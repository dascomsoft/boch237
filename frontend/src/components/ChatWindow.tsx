
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
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Connexion Socket.IO
    const newSocket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connecté à', SOCKET_URL);
      setIsConnected(true);
      // Rejoindre la conversation après reconnexion
      newSocket.emit('join_conversation', conversationId);
    });

    newSocket.on('disconnect', () => {
      console.log('🔴 Socket déconnecté');
      setIsConnected(false);
    });

    // ✅ Écouter le BON événement (new_message - exactement comme backend)
    newSocket.on('new_message', (message: Message) => {
      console.log('📩 Message reçu via socket:', message);
      onNewMessage(message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [conversationId, currentUserId]);

  // Rejoindre la conversation quand le socket est connecté
  useEffect(() => {
    if (socket && isConnected && conversationId) {
      socket.emit('join_conversation', conversationId);
      console.log('📌 Joined conversation:', conversationId);
    }
  }, [socket, isConnected, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    // Vérification des numéros de téléphone
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

    console.log('📤 Envoi message:', messageData);
    socket.emit('send_message', messageData);
    setNewMessage('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-green-600 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold">{otherUser?.name || 'Chat'}</h3>
            <p className="text-green-100 text-sm">
              {otherUser?.city} - {otherUser?.district}
            </p>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}>
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          
          return (
            <div
              key={message._id || index}
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
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        {!isConnected && (
          <p className="text-red-400 text-xs text-center mt-2">
            Reconnexion en cours...
          </p>
        )}
      </div>
    </div>
  );
}
