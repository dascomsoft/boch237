
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

const ChatWindow = ({
  conversationId,
  currentUserId,
  otherUser,
  messages,
  onNewMessage,
}: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll vers le bas quand nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    console.log('🔌 Connexion Socket à:', SOCKET_URL);

    const socket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connecté:', socket.id);
      socket.emit('join_conversation', conversationId);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket déconnecté');
    });

    socket.emit('join_conversation', conversationId);

    socket.on('new_message', (message: Message) => {
      console.log('📩 Message reçu:', message);

      const exists = messages.some(
        (m) =>
          m.content === message.content &&
          m.senderId === message.senderId &&
          Math.abs(
            new Date(m.timestamp).getTime() -
              new Date(message.timestamp).getTime()
          ) < 1000
      );

      if (!exists) {
        onNewMessage(message);
      }
    });

    socket.on('phone_alert', (alert: any) => {
      console.log('🚨 Alerte admin:', alert);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, currentUserId]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg = {
      conversationId,
      content: input,
      receiverId: otherUser._id,
    };

    socketRef.current.emit('send_message', msg);
    console.log('📤 Envoi message:', msg);
    setInput('');
    inputRef.current?.focus();
  };

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.timestamp || 0).getTime() -
      new Date(b.timestamp || 0).getTime()
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-900 pb-16">
      {/* Header fixe en haut */}
      <div className="flex-shrink-0 bg-green-600 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className='p-8'>
            <h3 className="text-white font-bold text-lg">{otherUser.name}</h3>
            <p className="text-green-100 text-sm">
              📍 {otherUser.city} - {otherUser.district}
            </p>
          </div>
        </div>
      </div>

      {/* Zone messages - seule partie qui scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="p-4 space-y-3">
          {sortedMessages.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm text-center">
                💬 Aucun message encore.<br />
                Commencez la conversation !
              </p>
            </div>
          )}

          {sortedMessages.map((msg, idx) => (
            <div
              key={msg._id || `msg-${msg.timestamp}-${idx}`}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                  msg.senderId === currentUserId
                    ? 'bg-green-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-gray-200 rounded-bl-sm'
                }`}
              >
                <p className="break-words text-sm md:text-base leading-relaxed">
                  {msg.content}
                </p>
                <span
                  className={`text-[10px] block mt-1 ${
                    msg.senderId === currentUserId
                      ? 'text-green-200'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input fixe en bas */}
      <div className="flex-shrink-0 bg-slate-800 px-3 py-2 border-t border-slate-700">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-0 px-4 py-3 rounded-full bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Écrivez votre message..."
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              input.trim()
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transform rotate-90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
