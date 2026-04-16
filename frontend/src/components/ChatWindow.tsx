
'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Message, User } from '@/types';
import { SOCKET_URL, API_URL } from '@/lib/api';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: User;
  messages: Message[];
  onNewMessage: (message: Message) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
}

const ChatWindow = ({
  conversationId,
  currentUserId,
  otherUser,
  messages,
  onNewMessage,
  onDeleteMessage,
  onEditMessage,
}: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connecté');
      socket.emit('join_conversation', conversationId);
    });

    socket.on('new_message', (message: Message) => {
      onNewMessage(message);
    });

    socket.on('message_deleted', (data: { messageId: string }) => {
      if (onDeleteMessage) onDeleteMessage(data.messageId);
    });

    socket.on('message_edited', (data: { messageId: string; content: string }) => {
      if (onEditMessage) onEditMessage(data.messageId, data.content);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, currentUserId]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      conversationId,
      content: input,
      receiverId: otherUser._id,
    });

    setInput('');
    inputRef.current?.focus();
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/conversation/${conversationId}/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowMenu(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const startEditMessage = (msg: Message) => {
    setEditingMessage({ id: msg._id!, content: msg.content });
    setShowMenu(null);
    setTimeout(() => editInputRef.current?.focus(), 100);
  };

  const saveEditMessage = async () => {
    if (!editingMessage?.content.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/users/conversation/${conversationId}/message/${editingMessage.id}`,
        { content: editingMessage.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingMessage(null);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-900">
      {/* Header */}
      <div className="bg-green-600 p-4">
        <h3 className="text-white font-bold text-lg">{otherUser.name}</h3>
        <p className="text-green-100 text-sm">📍 {otherUser.city} - {otherUser.district}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedMessages.map((msg, index) => (
          <div
            key={msg._id || `msg-${index}`}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[75%] p-3 rounded-2xl ${
                msg.senderId === currentUserId
                  ? 'bg-green-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-gray-200 rounded-bl-sm'
              }`}
              onContextMenu={(e) => {
                e.preventDefault();
                if (msg.senderId === currentUserId) {
                  setShowMenu(showMenu === msg._id ? null : msg._id!);
                }
              }}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-[10px] opacity-70 block mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              {showMenu === msg._id && msg.senderId === currentUserId && (
                <div className="absolute -top-8 right-0 bg-slate-800 rounded-lg shadow-lg flex overflow-hidden">
                  <button onClick={() => startEditMessage(msg)} className="px-3 py-1 text-xs text-white hover:bg-slate-700">
                    ✏️ Modifier
                  </button>
                  <button onClick={() => handleDeleteMessage(msg._id!)} className="px-3 py-1 text-xs text-red-400 hover:bg-slate-700">
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800 p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-2 rounded-full bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-green-500 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
