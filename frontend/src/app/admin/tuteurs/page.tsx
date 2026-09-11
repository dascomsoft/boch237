'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  User,
  Eye,
  RefreshCw,
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  Users,
  MapPin,
  BookOpen,
  CheckCircle2,
  XCircle,
  Power,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Tutor {
  _id: string;
  name: string;
  phone: string;
  role: string;
  city: string;
  district: string;
  subjects: string[];
  classes: string[];
  isActive: boolean;
}

export default function AdminTuteurs() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/users/tutors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTutors(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de chargement des répétiteurs');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (
    id: string,
    currentStatus: boolean
  ) => {
    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `${API_URL}/users/${id}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTutors();

      alert(
        `✅ Répétiteur ${
          !currentStatus ? 'activé' : 'désactivé'
        }`
      );
    } catch (error) {
      alert('❌ Erreur lors de la modification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-slate-950 text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div
          className="relative flex min-h-dvh items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/10">
              <span
                className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400"
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-400">
              Chargement des répétiteurs...
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Veuillez patienter
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-950 pb-8 text-white">
      {/* Background décoratif */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex min-h-[76px] items-center justify-between gap-3">
            {/* Retour */}
            <button
              type="button"
              onClick={() => router.back()}
              className="group inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-300 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <ArrowLeft
                size={17}
                className="transition group-hover:-translate-x-0.5"
                aria-hidden="true"
              />

              <span className="hidden sm:inline">
                Retour
              </span>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <ShieldCheck
                  size={22}
                  className="text-slate-950"
                  aria-hidden="true"
                />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-lg font-bold leading-none tracking-tight">
                  Boch<span className="text-emerald-400">237</span>
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Administration
                </p>
              </div>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchTutors}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Actualiser la liste"
              title="Actualiser"
            >
              <RefreshCw
                size={18}
                className="transition group-hover:rotate-180"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles size={13} aria-hidden="true" />
                Gestion des utilisateurs
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Gestion des répétiteurs
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Consultez les profils, les compétences et le
                statut des répétiteurs inscrits sur Boch237.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                <Users
                  size={20}
                  className="text-emerald-400"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-xl font-bold text-white">
                  {tutors.length}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Répétiteurs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bouton ajouter */}
        <section className="mt-5">
          <button
            type="button"
            onClick={() =>
              router.push('/admin/tuteurs/ajouter')
            }
            className="group flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3.5 font-bold text-slate-950 shadow-xl shadow-emerald-500/15 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/10">
              <UserPlus
                size={19}
                aria-hidden="true"
              />
            </span>

            <span>Ajouter un répétiteur</span>
          </button>
        </section>

        {/* Liste */}
        <section
          className="mt-8"
          aria-labelledby="tutors-list-title"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Répertoire
              </p>

              <h2
                id="tutors-list-title"
                className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                Répétiteurs inscrits
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Gérez leur disponibilité et consultez leurs profils.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-slate-500 sm:flex">
              <Users
                size={14}
                className="text-emerald-400"
                aria-hidden="true"
              />

              {tutors.length}{' '}
              {tutors.length > 1
                ? 'profils'
                : 'profil'}
            </div>
          </div>

          {tutors.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 px-5 py-16 text-center shadow-2xl shadow-black/10 backdrop-blur-xl">
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                  <User
                    size={28}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  Aucun répétiteur
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Aucun répétiteur n'est actuellement enregistré
                  sur la plateforme.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push('/admin/tuteurs/ajouter')
                  }
                  className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <UserPlus size={17} />
                  Ajouter un répétiteur
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {tutors.map((tutor) => (
                <article
                  key={tutor._id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-2xl hover:shadow-emerald-950/20 sm:p-6"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl transition group-hover:bg-emerald-500/10" />

                  <div className="relative">
                    {/* En-tête profil */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 ring-1 ring-emerald-400/10">
                          <User
                            size={25}
                            className="text-emerald-400"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-white">
                            {tutor.name}
                          </h3>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {tutor.phone}
                          </p>
                        </div>
                      </div>

                      {/* Statut */}
                      <div
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${
                          tutor.isActive
                            ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                            : 'border-slate-600/30 bg-slate-700/30 text-slate-400'
                        }`}
                      >
                        {tutor.isActive ? (
                          <CheckCircle2
                            size={13}
                            aria-hidden="true"
                          />
                        ) : (
                          <XCircle
                            size={13}
                            aria-hidden="true"
                          />
                        )}

                        {tutor.isActive
                          ? 'Actif'
                          : 'Inactif'}
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3.5 py-3">
                      <MapPin
                        size={16}
                        className="shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />

                      <span className="truncate text-xs font-medium text-slate-300">
                        {tutor.city}

                        {tutor.district &&
                          ` • ${tutor.district}`}
                      </span>
                    </div>

                    {/* Matières */}
                    {tutor.subjects &&
                      tutor.subjects.length > 0 && (
                        <div className="mt-5">
                          <div className="mb-2.5 flex items-center gap-2">
                            <BookOpen
                              size={15}
                              className="text-emerald-400"
                              aria-hidden="true"
                            />

                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                              Matières
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {tutor.subjects.map(
                              (subject, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-xl border border-emerald-400/10 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300"
                                >
                                  {subject}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Classes */}
                    {tutor.classes &&
                      tutor.classes.length > 0 && (
                        <div className="mt-5">
                          <div className="mb-2.5 flex items-center gap-2">
                            <span
                              className="text-sm"
                              aria-hidden="true"
                            >
                              🎓
                            </span>

                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                              Classes
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {tutor.classes.map(
                              (className, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300"
                                >
                                  {className}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Séparateur */}
                    <div className="my-5 border-t border-white/5" />

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(
                            tutor._id,
                            tutor.isActive
                          )
                        }
                        className={`group/action flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 ${
                          tutor.isActive
                            ? 'bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-400/10 hover:bg-amber-500/15 hover:ring-amber-400/20 focus-visible:ring-amber-400'
                            : 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/10 hover:bg-emerald-500/15 hover:ring-emerald-400/20 focus-visible:ring-emerald-400'
                        }`}
                      >
                        <Power
                          size={16}
                          className="transition group-hover/action:scale-110"
                          aria-hidden="true"
                        />

                        {tutor.isActive
                          ? 'Désactiver'
                          : 'Activer'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/profile/${tutor._id}`
                          )
                        }
                        className="group/action flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      >
                        <Eye
                          size={16}
                          aria-hidden="true"
                        />

                        Voir le profil

                        <ChevronRight
                          size={15}
                          className="transition group-hover/action:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Information sécurité */}
        <section className="mt-8">
          <div className="flex items-start gap-4 rounded-3xl border border-emerald-400/10 bg-emerald-400/5 p-5 backdrop-blur-xl sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">
              <ShieldCheck
                size={21}
                className="text-emerald-400"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Gestion sécurisée
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Le statut d'un répétiteur peut être activé ou
                désactivé à tout moment. La modification est
                appliquée directement sur la plateforme.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}