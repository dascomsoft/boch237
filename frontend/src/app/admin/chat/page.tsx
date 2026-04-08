
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MessageCircle, User, Calendar, Search } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Conversation {
  _id: string;
  participants: string[];
  messages: any[];
  lastActivity: string;
}

interface UserType {
  _id: string;
  name: string;
  phone: string;
  role: string;
}

export default function AdminChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<Record<string, UserType>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentAdminId, setCurrentAdminId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      // Récupérer l'admin courant
      const meRes = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentAdminId(meRes.data._id);

      // Récupérer toutes les conversations
      const convRes = await axios.get(`${API_URL}/users/conversations/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(convRes.data);

      // Récupérer tous les utilisateurs
      const usersRes = await axios.get(`${API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const usersMap: Record<string, UserType> = {};
      usersRes.data.forEach((user: UserType) => {
        usersMap[user._id] = user;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation: Conversation): UserType | null => {
    const otherId = conversation.participants.find(id => id !== currentAdminId);
    return otherId ? users[otherId] : null;
  };

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    if (!other) return false;
    return other.name.toLowerCase().includes(search.toLowerCase()) ||
           other.phone.includes(search);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 pb-20">
      <div className="bg-green-600 p-4 rounded-lg mb-4">
        <button onClick={() => router.back()} className="text-white mb-2 flex items-center gap-1">
          ← Retour
        </button>
        <h1 className="text-white text-xl font-bold text-center">
          💬 Messages des utilisateurs
        </h1>
        <p className="text-green-100 text-sm text-center">
          Consultez et répondez aux messages
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            className="flex-1 bg-transparent text-white outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-10 bg-slate-800 rounded-xl">
            <MessageCircle size={40} className="text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">Aucune conversation</p>
            <p className="text-gray-500 text-sm">Les messages des utilisateurs apparaîtront ici</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const otherUser = getOtherParticipant(conv);
            const lastMessage = conv.messages[conv.messages.length - 1];
            
            return (
              <div
                key={conv._id}
                onClick={() => router.push(`/chat?convId=${conv._id}`)}
                className="bg-slate-800 rounded-xl p-4 cursor-pointer hover:bg-slate-700 transition-colors border border-green-500/30"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <User size={16} className="text-green-400" />
                      <h3 className="text-white font-bold">
                        {otherUser?.name || 'Utilisateur'}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        otherUser?.role === 'parent' 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'bg-purple-600/20 text-purple-400'
                      }`}>
                        {otherUser?.role === 'parent' ? '👨‍👩‍👧 Parent' : '👨‍🏫 Répétiteur'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      📱 {otherUser?.phone || ''}
                    </p>
                    {lastMessage && (
                      <p className="text-gray-500 text-xs mt-2 truncate max-w-md">
                        💬 {lastMessage.content.substring(0, 60)}...
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar size={12} />
                      {new Date(conv.lastActivity).toLocaleDateString()}
                    </div>
                    {conv.messages.filter(m => m.senderId !== currentAdminId).length > 0 && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {conv.messages.filter(m => m.senderId !== currentAdminId).length} non lu(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
