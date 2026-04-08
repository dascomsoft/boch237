'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ChatWindow from '@/components/ChatWindow';
import MobileNav from '@/components/MobileNav';
import { Conversation, Message, User } from '@/types';
import { API_URL } from '@/lib/api';

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationId = searchParams.get('convId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 LOAD DATA
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 🔥 reset propre
    setCurrentConversation(null);
    setOtherUser(null);

    fetchData(token);
  }, [conversationId]);

  const fetchData = async (token: string) => {
    setLoading(true);

    try {
      // 👤 USER
      const userRes = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = userRes.data;
      setCurrentUser(user);

      // 💬 CONVERSATIONS
      const convRes = await axios.get(`${API_URL}/users/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const convs = convRes.data;
      setConversations(convs);

      if (conversationId) {
        const currentConv = convs.find((c: Conversation) => c._id === conversationId);

        if (currentConv) {
          setCurrentConversation(currentConv);

          const otherId = currentConv.participants.find(
            (id: string) => id !== user._id
          );

          if (otherId) {
            const otherRes = await axios.get(`${API_URL}/users/${otherId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            setOtherUser(otherRes.data);
          }
        }
      }

    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GESTION MESSAGE TEMPS RÉEL (FIX TOTAL)
  const handleNewMessage = (message: Message) => {

    // ✅ conversation active
    setCurrentConversation(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        messages: [...prev.messages, message]
      };
    });

    // ✅ liste conversations sync
    setConversations(prev =>
      prev.map(conv =>
        conv._id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-500 rounded-full"></div>
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
        />
      ) : (
        <div className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">
            Mes conversations
          </h2>

          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>Aucune conversation</p>
              <p className="text-sm mt-2">
                Commencez par rechercher un répétiteur
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map(conv => (
                <div
                  key={conv._id}
                  className="bg-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-700"
                  onClick={() => router.push(`/chat?convId=${conv._id}`)}
                >
                  <p className="text-white">
                    Conversation du{' '}
                    {new Date(conv.lastActivity).toLocaleDateString()}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {conv.messages?.length || 0} message(s)
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

// 🔥 PAGE AVEC SUSPENSE
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