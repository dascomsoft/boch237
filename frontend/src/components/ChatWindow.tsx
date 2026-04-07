'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Message, User } from '@/types';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/api';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser?: User;
  messages: Message[];
  onNewMessage: (message: Message) => void;
}

export default function ChatWindow({ 
  conversationId, 
  currentUserId, 
  otherUser, 
  messages, 
  onNewMessage 
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Utilisation de SOCKET_URL depuis la configuration centralisée
    const newSocket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ['websocket', 'polling'] // fallback si websocket échoue
    });

    newSocket.on('connect', () => {
      console.log('Socket connecté à', SOCKET_URL);
      newSocket.emit('join_conversation', conversationId);
    });

    newSocket.on('new_message', (message: Message) => {
      onNewMessage(message);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Erreur de connexion Socket:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    // Détection des numéros de téléphone camerounais
    const phoneRegex = /(\+237|237)?[6,2,9][0-9]{8}/g;
    const hasPhoneNumber = phoneRegex.test(newMessage);
    
    if (hasPhoneNumber) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      alert("⚠️ Le partage de numéro de téléphone est interdit pour votre sécurité. Utilisez le chat pour communiquer.");
      return;
    }

    const messageData = {
      conversationId,
      content: newMessage,
      receiverId: otherUser?._id
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="bg-green-600 p-4 sticky top-0 z-10">
        <h3 className="text-white font-bold">{otherUser?.name || 'Chat'}</h3>
        <p className="text-green-100 text-sm">
          {otherUser?.city} - {otherUser?.district}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          
          return (
            <div
              key={index}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} message-enter`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  isCurrentUser
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-gray-200 rounded-bl-none'
                }`}
              >
                {message.isAlert && (
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                    <AlertCircle size={12} /> Message signalé
                  </div>
                )}
                <p className="break-words">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800 p-4 border-t border-green-500">
        {showAlert && (
          <div className="bg-red-600/20 border border-red-500 rounded-lg p-2 mb-2">
            <p className="text-red-400 text-xs flex items-center gap-1">
              <AlertCircle size={14} /> 
              ⚠️ Les numéros de téléphone sont automatiquement bloqués
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-slate-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}