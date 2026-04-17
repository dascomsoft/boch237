

'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from '@/components/ChatWindow';
import MobileNav from '@/components/MobileNav';
import { Conversation, Message, User } from '@/types';
import { API_URL } from '@/lib/api';

function ChatContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('convId');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [otherUsers, setOtherUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  const formatLastActivity = (timestamp: Date) => {
    const msgDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
    
    const diffDays = Math.floor((today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24));
    
    const timeStr = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (diffDays === 0) {
      return `Aujourd'hui à ${timeStr}`;
    } else if (diffDays === 1) {
      return `Hier à ${timeStr}`;
    } else if (diffDays < 7) {
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      return `${days[msgDate.getDay()]} à ${timeStr}`;
    } else {
      return `${msgDate.toLocaleDateString()} à ${timeStr}`;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchData(token);
  }, [conversationId]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentUserData = userResponse.data;
      setCurrentUser(currentUserData);
      
      const convResponse = await axios.get(`${API_URL}/users/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const conversationsData = convResponse.data;
      setConversations(conversationsData);
      
      const usersMap: Record<string, User> = {};
      for (const conv of conversationsData) {
        const otherId = conv.participants.find((id: string) => id !== currentUserData._id);
        if (otherId && !usersMap[otherId]) {
          try {
            const otherRes = await axios.get(`${API_URL}/users/${otherId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            usersMap[otherId] = otherRes.data;
          } catch (err) {
            console.error('Erreur chargement utilisateur:', err);
          }
        }
      }
      setOtherUsers(usersMap);
      
      if (conversationId) {
        const conv = conversationsData.find((c: Conversation) => c._id === conversationId);
        if (conv) {
          setCurrentConversation(conv);
          const otherId = conv.participants.find((id: string) => id !== currentUserData._id);
          if (otherId && usersMap[otherId]) {
            setOtherUser(usersMap[otherId]);
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION : Utiliser le pattern fonctionnel pour éviter le stale state
  const handleNewMessage = (message: Message) => {
    setCurrentConversation(prev => {
      if (!prev) return prev;

      // Vérifier si le message existe déjà
      const exists = prev.messages.some(m => m._id === message._id);
      if (exists) return prev;

      return {
        ...prev,
        messages: [...prev.messages, message]
      };
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setCurrentConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.filter(m => m._id !== messageId)
      };
    });
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setCurrentConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: prev.messages.map(m =>
          m._id === messageId ? { ...m, content: newContent } : m
        )
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {currentConversation && currentUser && otherUser ? (
        <ChatWindow
          conversationId={currentConversation._id}
          currentUserId={currentUser._id}
          otherUser={otherUser}
          messages={currentConversation.messages || []}
          onNewMessage={handleNewMessage}
          onDeleteMessage={handleDeleteMessage}
          onEditMessage={handleEditMessage}
        />
      ) : (
        <div className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">Mes conversations</h2>
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>Aucune conversation</p>
              <p className="text-sm mt-2">Commencez par rechercher un répétiteur</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const otherId = conv.participants.find(id => id !== currentUser?._id);
                const other = otherId ? otherUsers[otherId] : null;
                const lastMessage = conv.messages[conv.messages.length - 1];
                
                return (
                  <div
                    key={conv._id}
                    className="bg-slate-800 p-4 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700"
                    onClick={() => window.location.href = `/chat?convId=${conv._id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {other?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-bold">
                              {other?.name || 'Utilisateur'}
                            </h3>
                            <p className="text-gray-400 text-xs">
                              {other?.role === 'tutor' ? '👨‍🏫 Répétiteur' : '👨‍👩‍👧 Parent'}
                            </p>
                          </div>
                        </div>
                        {lastMessage && (
                          <p className="text-gray-500 text-sm mt-2 truncate ml-12">
                            {lastMessage.senderId === currentUser?._id ? '👤 Vous: ' : ''}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">
                          {formatLastActivity(conv.lastActivity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <MobileNav userRole={currentUser?.role} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-500 rounded-full"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
