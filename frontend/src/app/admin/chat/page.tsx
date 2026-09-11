'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Inbox,
  MessageCircle,
  MessagesSquare,
  Search,
  User
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-400" />
          </div>
          <p className="text-sm font-medium text-slate-400">
            Chargement des messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white lg:pb-10">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Retour</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <MessagesSquare size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold leading-none tracking-tight">
                Messages{' '}
                <span className="text-emerald-400">utilisateurs</span>
              </p>
              <p className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:block">
                Consultez et répondez aux messages
              </p>
            </div>
          </div>

          <div className="hidden rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:block">
            {filteredConversations.length} conversation
            {filteredConversations.length > 1 ? 's' : ''}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pb-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <MessageCircle size={14} />
            Messagerie de support
          </div>

          <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            Répondez aux messages de vos{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              utilisateurs.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Retrouvez toutes les conversations avec les parents et les
            répétiteurs, et répondez directement depuis cette page.
          </p>
        </section>

        {/* Search panel */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:rounded-3xl sm:p-6">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-emerald-400" />
            <h2 className="font-semibold text-white sm:text-lg">
              Rechercher une conversation
            </h2>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 transition focus-within:border-emerald-500/40">
            <Search size={18} className="shrink-0 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou téléphone..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* Results */}
        <section className="pb-8 pt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Conversations
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Messages reçus
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {filteredConversations.length} conversation
                {filteredConversations.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <Inbox size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Aucune conversation
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Les messages des utilisateurs apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredConversations.map((conv) => {
                const otherUser = getOtherParticipant(conv);
                const lastMessage = conv.messages[conv.messages.length - 1];
                const unreadCount = conv.messages.filter(
                  (m) => m.senderId !== currentAdminId
                ).length;

                return (
                  <div
                    key={conv._id}
                    onClick={() => router.push(`/chat?convId=${conv._id}`)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/20"
                  >
                    {/* Accent on hover */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 transition group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Avatar */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-base font-bold text-slate-950">
                          {otherUser?.name?.charAt(0).toUpperCase() || (
                            <User size={20} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-white">
                            {otherUser?.name || 'Utilisateur'}
                          </h3>

                          <span
                            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                              otherUser?.role === 'parent'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-purple-500/10 text-purple-400'
                            }`}
                          >
                            {otherUser?.role === 'parent'
                              ? '👨‍👩‍👧 Parent'
                              : '👨‍🏫 Répétiteur'}
                          </span>
                        </div>
                      </div>

                      {unreadCount > 0 && (
                        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    {lastMessage && (
                      <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-6 text-slate-400">
                        💬 {lastMessage.content.substring(0, 60)}...
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} />
                        {new Date(conv.lastActivity).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 transition group-hover:gap-2 group-hover:text-emerald-300">
                        Répondre
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <MobileNav userRole="admin" />
    </div>
  );
}