'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  Edit3,
  GraduationCap,
  Loader2,
  LogOut,
  MapPin,
  Megaphone,
  MessageSquare,
  Plus,
  UserCircle,
} from 'lucide-react';

import type { Conversation, User } from '@/types';
import MobileNav from '@/components/MobileNav';
import ContactAdminButton from '@/components/ContactAdminButton';
import { API_URL } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (token: string) => {
    setLoading(true);
    setError('');

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [userRes, conversationsRes] = await Promise.all([
        axios.get(`${API_URL}/users/me`, { headers }),
        axios.get(`${API_URL}/users/conversations`, { headers }),
      ]);

      setUser(userRes.data);
      setConversations(conversationsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil :', error);
      setError('Impossible de charger votre profil.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/');
      return;
    }

    fetchData(token);
  }, [fetchData, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/');
  };

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-slate-950"
        aria-busy="true"
        aria-label="Chargement du profil"
      >
        <div className="flex flex-col items-center gap-4 text-slate-300">
          <Loader2
            className="h-9 w-9 animate-spin text-emerald-400"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">Chargement du profil…</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <section className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-center shadow-2xl">
          <AlertCircle
            className="mx-auto mb-4 h-10 w-10 text-red-400"
            aria-hidden="true"
          />

          <h1 className="text-lg font-bold text-white">
            Profil indisponible
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {error || 'Les informations du profil sont introuvables.'}
          </p>

          <button
            type="button"
            onClick={() => {
              const token = localStorage.getItem('token');

              if (token) {
                fetchData(token);
              } else {
                router.replace('/');
              }
            }}
            className="mt-6 min-h-12 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Réessayer
          </button>
        </section>
      </main>
    );
  }

  const isTutor = user.role === 'tutor';
  const isParent = user.role === 'parent';

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 md:pb-28 lg:pb-32">
      {/* En-tête du profil */}
      <header className="border-b border-emerald-400/10 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-7 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 md:flex-row md:items-center md:justify-between md:py-10 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm sm:h-20 sm:w-20">
              <UserCircle
                className="h-10 w-10 text-white sm:h-12 sm:w-12"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-emerald-100">
                Mon profil
              </p>

              <h1 className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {user.name}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-emerald-50">
                <span>
                  {isTutor ? 'Répétiteur' : 'Parent / Élève'}
                </span>

                {user.phone && (
                  <>
                    <span
                      className="hidden h-1 w-1 rounded-full bg-emerald-200 sm:block"
                      aria-hidden="true"
                    />
                    <span>{user.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/profile/edit')}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700 md:w-auto"
          >
            <Edit3 className="h-5 w-5" aria-hidden="true" />
            Modifier mon profil
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 md:py-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        {/* Colonne principale */}
        <div className="space-y-5">
          {isParent && (
            <section className="overflow-hidden rounded-2xl border border-pink-400/20 bg-gradient-to-br from-pink-500/15 to-rose-500/5 p-4 shadow-lg sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-white">
                    Vous cherchez un répétiteur ?
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Publiez votre besoin pour recevoir des propositions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/annonces/creer')}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:from-pink-500 hover:to-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  <Megaphone className="h-5 w-5" aria-hidden="true" />
                  Publier une annonce
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-white/5 bg-slate-900 p-5 shadow-xl sm:p-6">
            <SectionTitle
              icon={<MapPin className="h-5 w-5" />}
              title="Localisation"
            />

            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
              <InformationCard
                label="Province"
                value={user.province}
              />
              <InformationCard
                label="Ville"
                value={user.city}
              />
              <InformationCard
                label="Quartier"
                value={user.district}
              />
            </dl>
          </section>

          {isTutor && (
            <div className="grid gap-5 md:grid-cols-2">
              <section className="rounded-2xl border border-white/5 bg-slate-900 p-5 shadow-xl sm:p-6">
                <SectionTitle
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Matières enseignées"
                />

                <div className="mt-5 flex flex-wrap gap-2">
                  {user.subjects?.length ? (
                    user.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-300"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <EmptyValue text="Aucune matière spécifiée" />
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-white/5 bg-slate-900 p-5 shadow-xl sm:p-6">
                <SectionTitle
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="Classes"
                />

                <div className="mt-5 flex flex-wrap gap-2">
                  {user.classes?.length ? (
                    user.classes.map((className) => (
                      <span
                        key={className}
                        className="rounded-full border border-slate-600/50 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300"
                      >
                        {className}
                      </span>
                    ))
                  ) : (
                    <EmptyValue text="Aucune classe spécifiée" />
                  )}
                </div>
              </section>
            </div>
          )}

          <section className="rounded-2xl border border-white/5 bg-slate-900 p-5 shadow-xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <SectionTitle
                icon={<MessageSquare className="h-5 w-5" />}
                title="Conversations récentes"
              />

              {conversations.length > 3 && (
                <button
                  type="button"
                  onClick={() => router.push('/chat')}
                  className="shrink-0 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Tout voir
                </button>
              )}
            </div>

            {conversations.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-4 py-8 text-center">
                <MessageSquare
                  className="mx-auto h-8 w-8 text-slate-600"
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm font-medium text-slate-300">
                  Aucune conversation
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Vos échanges récents apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-slate-800">
                {conversations.slice(0, 3).map((conversation) => {
                  const messageCount = conversation.messages?.length ?? 0;

                  return (
                    <button
                      key={conversation._id}
                      type="button"
                      onClick={() =>
                        router.push(`/chat?convId=${conversation._id}`)
                      }
                      className="group flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      aria-label={`Ouvrir la conversation contenant ${messageCount} message${messageCount > 1 ? 's' : ''}`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                        <MessageSquare
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-slate-200">
                          Conversation
                        </span>
                        <span className="block text-sm text-slate-500">
                          {messageCount} message
                          {messageCount !== 1 ? 's' : ''}
                        </span>
                      </span>

                      <ChevronRight
                        className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-emerald-400"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Actions secondaires */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-2xl border border-white/5 bg-slate-900 p-4 shadow-xl">
            <h2 className="px-1 pb-3 text-sm font-semibold text-slate-400">
              Actions rapides
            </h2>

            <div className="space-y-3">
              <ContactAdminButton />

              <button
                type="button"
                onClick={() => router.push('/annonces')}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                <Megaphone className="h-5 w-5" aria-hidden="true" />
                Voir toutes les annonces
              </button>
            </div>
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-semibold text-red-400 transition hover:border-red-500/30 hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Se déconnecter
          </button>
        </aside>
      </main>

      <MobileNav userRole={user.role} />
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="flex items-center gap-2 font-bold text-slate-100">
      <span className="text-emerald-400" aria-hidden="true">
        {icon}
      </span>
      {title}
    </h2>
  );
}

function InformationCard({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-200">
        {value || 'Non spécifié'}
      </dd>
    </div>
  );
}

function EmptyValue({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-500">
      {text}
    </p>
  );
}