'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  MapPin,
  MessageCircle,
  UserCircle,
} from 'lucide-react';

import MobileNav from '@/components/MobileNav';
import { API_URL } from '@/lib/api';
import type { User } from '@/types';

export default function TutorProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [tutor, setTutor] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const tutorResponse = await axios.get<User>(
          `${API_URL}/users/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTutor(tutorResponse.data);

        const currentUserResponse = await axios.get<User>(
          `${API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCurrentUser(currentUserResponse.data);
      } catch (fetchError) {
        console.error('Erreur chargement :', fetchError);
        setError('Impossible de charger le profil du répétiteur.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [params.id, router]);

  const startChat = async () => {
    if (!tutor?._id || !tutor.isActive || isStartingChat) return;

    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    setIsStartingChat(true);
    setError('');

    try {
      const response = await axios.post<{ _id: string }>(
        `${API_URL}/users/conversation`,
        { tutorId: tutor._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      router.push(`/chat?convId=${response.data._id}`);
    } catch (chatError) {
      console.error('Erreur démarrage chat :', chatError);
      setError('Impossible de démarrer la conversation.');
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div
          className="flex flex-col items-center gap-3 text-gray-300"
          role="status"
          aria-live="polite"
        >
          <div
            className="size-9 animate-spin rounded-full border-2 border-slate-700 border-b-green-500"
            aria-hidden="true"
          />
          <span className="text-sm">Chargement du profil…</span>
        </div>
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <section className="w-full max-w-md rounded-2xl bg-slate-800 p-6 text-center shadow-lg">
          <UserCircle
            className="mx-auto mb-4 size-14 text-gray-500"
            aria-hidden="true"
          />

          <h1 className="text-xl font-bold text-white">
            Répétiteur non trouvé
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            {error || 'Ce profil est introuvable ou indisponible.'}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            Retour
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-24 text-white">
      <header className="sticky top-0 z-40 bg-green-600 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-md">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Revenir à la page précédente"
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft className="size-6" aria-hidden="true" />
          </button>

          <h1 className="truncate text-xl font-bold">
            Profil du répétiteur
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-6">
          <aside className="space-y-4">
            <section className="rounded-2xl bg-slate-800 p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 inline-flex rounded-full bg-white p-3">
                <UserCircle
                  className="size-16 text-green-600 sm:size-20"
                  aria-hidden="true"
                />
              </div>

              <h2 className="break-words text-2xl font-bold">
                {tutor.name}
              </h2>

              <p className="mt-1 text-green-400">Répétiteur</p>

              <span
                className={`mt-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                  tutor.isActive
                    ? 'bg-green-600/20 text-green-300'
                    : 'bg-gray-600/30 text-gray-300'
                }`}
              >
                <span
                  className={`mr-2 size-2 rounded-full ${
                    tutor.isActive ? 'bg-green-400' : 'bg-gray-400'
                  }`}
                  aria-hidden="true"
                />
                {tutor.isActive ? 'Disponible' : 'Indisponible'}
              </span>
            </section>

            <section className="rounded-2xl bg-slate-800 p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-green-400">
                <MapPin className="size-5" aria-hidden="true" />
                Localisation
              </h2>

              <dl className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-400">Province</dt>
                  <dd className="text-right text-gray-200">
                    {tutor.province || 'Non spécifiée'}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-400">Ville</dt>
                  <dd className="text-right text-gray-200">
                    {tutor.city || 'Non spécifiée'}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-400">Quartier</dt>
                  <dd className="text-right text-gray-200">
                    {tutor.district || 'Non spécifié'}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>

          <div className="space-y-4">
            <section className="rounded-2xl bg-slate-800 p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-green-400">
                <BookOpen className="size-5" aria-hidden="true" />
                Matières enseignées
              </h2>

              {tutor.subjects?.length ? (
                <ul className="flex flex-wrap gap-2" aria-label="Matières">
                  {tutor.subjects.map((subject, index) => (
                    <li
                      key={`${subject}-${index}`}
                      className="rounded-lg bg-green-600/20 px-3 py-2 text-sm text-green-300"
                    >
                      {subject}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">
                  Aucune matière spécifiée
                </p>
              )}
            </section>

            <section className="rounded-2xl bg-slate-800 p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-green-400">
                <GraduationCap className="size-5" aria-hidden="true" />
                Classes
              </h2>

              {tutor.classes?.length ? (
                <ul className="flex flex-wrap gap-2" aria-label="Classes">
                  {tutor.classes.map((className, index) => (
                    <li
                      key={`${className}-${index}`}
                      className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-gray-200"
                    >
                      {className}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">
                  Aucune classe spécifiée
                </p>
              )}
            </section>

            <button
              type="button"
              onClick={startChat}
              disabled={!tutor.isActive || isStartingChat}
              aria-busy={isStartingChat}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-bold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300"
            >
              {isStartingChat ? (
                <>
                  <span
                    className="size-5 animate-spin rounded-full border-2 border-white/40 border-b-white"
                    aria-hidden="true"
                  />
                  Ouverture…
                </>
              ) : (
                <>
                  <MessageCircle className="size-5" aria-hidden="true" />
                  {tutor.isActive
                    ? 'Démarrer une conversation'
                    : 'Indisponible pour le moment'}
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <MobileNav userRole={currentUser?.role} />
    </div>
  );
}