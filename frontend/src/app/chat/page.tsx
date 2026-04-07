'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from '@/components/ChatWindow';
import MobileNav from '@/components/MobileNav';
import { Conversation, Message, User } from '@/types';
import { API_URL } from '@/lib/api';

// Composant interne qui utilise useSearchParams
function ChatContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('convId');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
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
      
      if (conversationId) {
        const conv = conversationsData.find((c: Conversation) => c._id === conversationId);
        if (conv) {
          setCurrentConversation(conv);
          const otherId = conv.participants.find((id: string) => id !== currentUserData._id);
          if (otherId) {
            try {
              const otherUserResponse = await axios.get(`${API_URL}/users/${otherId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setOtherUser(otherUserResponse.data);
            } catch (err) {
              console.error('Erreur chargement autre utilisateur:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (currentConversation) {
      setCurrentConversation({
        ...currentConversation,
        messages: [...currentConversation.messages, message]
      });
    }
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
          messages={currentConversation.messages}
          onNewMessage={handleNewMessage}
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
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  className="bg-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-700"
                  onClick={() => window.location.href = `/chat?convId=${conv._id}`}
                >
                  <p className="text-white">Conversation du {new Date(conv.lastActivity).toLocaleDateString()}</p>
                  <p className="text-gray-400 text-sm">
                    {conv.messages.length} message(s)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <MobileNav userRole={currentUser?.role} />
    </div>
  );
}

// Page principale avec Suspense boundary
export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}