
'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, User } from '@/types';
import { SOCKET_URL } from '@/lib/api';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: User;
  messages: Message[];
  onNewMessage: (message: Message) => void;
}

const ChatWindow = ({ conversationId, currentUserId, otherUser, messages, onNewMessage }: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // ✅ Utilisation de SOCKET_URL depuis la configuration
    console.log('🔌 Connexion Socket à:', SOCKET_URL);
    
    const socket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connecté:', socket.id);
      // ✅ RECONNEXION : rejoindre à nouveau la conversation
      socket.emit('join_conversation', conversationId);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket déconnecté');
    });

    // ✅ Rejoint la conversation
    socket.emit('join_conversation', conversationId);
    console.log('📌 Joined conversation:', conversationId);

    // ✅ Réception des nouveaux messages avec filtrage des doublons
    socket.on('new_message', (message: Message) => {
      console.log('📩 Message reçu:', message);
      
      // Vérifier si le message n'existe pas déjà (éviter doublons)
      const exists = messages.some(m => 
        m.content === message.content && 
        m.senderId === message.senderId &&
        Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
      );
      
      if (!exists) {
        onNewMessage(message);
      } else {
        console.log('⚠️ Message ignoré (doublon)');
      }
    });

    socket.on('phone_alert', (alert: any) => {
      console.log('🚨 Alerte admin:', alert);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, currentUserId]); // ✅ Ne pas mettre messages dans les dépendances

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg = {
      conversationId,
      content: input,
      receiverId: otherUser._id
    };

    socketRef.current.emit('send_message', msg);
    console.log('📤 Envoi message:', msg);
    setInput('');
  };

  // ✅ Tri des messages par date
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 p-4">
      {/* Header */}
      <div className="bg-green-600 p-3 rounded-lg mb-3">
        <h3 className="text-white font-bold">{otherUser.name}</h3>
        <p className="text-green-100 text-sm">{otherUser.city} - {otherUser.district}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {sortedMessages.map((msg, idx) => (
          <div 
            key={msg._id || `msg-${msg.timestamp}-${idx}`}
            className={`p-2 rounded max-w-[70%] ${
              msg.senderId === currentUserId 
                ? 'bg-green-600 text-white ml-auto' 
                : 'bg-slate-800 text-gray-200'
            }`}
          >
            <p className="break-words">{msg.content}</p>
            <span className="text-xs opacity-70 block mt-1">
              {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-slate-800 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Écrivez votre message..."
        />
        <button 
          onClick={handleSend} 
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
