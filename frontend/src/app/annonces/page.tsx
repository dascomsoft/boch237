
'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';

import MobileNav from '@/components/MobileNav';
import { API_URL } from '@/lib/api';

/* =====================================================
   TYPES
===================================================== */

type UserRole = 'admin' | 'parent' | 'tutor';

const VALID_ROLES: readonly UserRole[] = [
  'admin',
  'parent',
  'tutor',
] as const;

function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (VALID_ROLES as readonly string[]).includes(value)
  );
}

interface Annonce {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  city: string;
  district: string;
  budget: string;
  duration: string;
  parentName: string;
  parentPhone: string;
  status: string;
  createdAt: string;
}

interface User {
  role?: UserRole;
}

interface Filters {
  subject: string;
  class: string;
  city: string;
}

/* =====================================================
   CONSTANTS
===================================================== */

const SUBJECTS = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Physique',
  'SVT',
];

const CLASSES = [
  '6ème',
  '5ème',
  '4ème',
  '3ème',
  'Seconde',
  'Terminale',
];

const INITIAL_FILTERS: Filters = {
  subject: '',
  class: '',
  city: '',
};

/* =====================================================
   PAGE
===================================================== */

export default function AnnoncesPage() {
  const router = useRouter();

  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');

  const isParent = user?.role === 'parent';

  const fetchUser = useCallback(async (token: string) => {
    try {
      const response = await axios.get<{ role?: unknown }>(
        `${API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const role = isUserRole(response.data?.role)
        ? response.data.role
        : undefined;

      setUser({ role });
    } catch (requestError) {
      console.error('Erreur utilisateur :', requestError);
    }
  }, []);

  const fetchAnnonces = useCallback(async () => {
    setError('');

    try {
      const response = await axios.get<Annonce[]>(
        `${API_URL}/annonces`
      );

      setAnnonces(response.data);
    } catch (requestError) {
      console.error('Erreur chargement annonces :', requestError);

      setError('Impossible de charger les annonces pour le moment.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      void fetchUser(token);
    }

    void fetchAnnonces();
  }, [fetchAnnonces, fetchUser]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const searchAnnonces = async (
    event?: FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();

    if (searching) return;

    setSearching(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (filters.subject) {
        params.append('subject', filters.subject);
      }

      if (filters.class) {
        params.append('class', filters.class);
      }

      if (filters.city.trim()) {
        params.append('city', filters.city.trim());
      }

      const response = await axios.get<Annonce[]>(
        `${API_URL}/annonces?${params.toString()}`
      );

      setAnnonces(response.data);
    } catch (requestError) {
      console.error('Erreur recherche :', requestError);

      setError('La recherche a échoué. Veuillez réessayer.');
    } finally {
      setSearching(false);
    }
  };

  const resetFilters = async () => {
    if (searching) return;

    setFilters(INITIAL_FILTERS);
    setSearching(true);
    setError('');

    try {
      const response = await axios.get<Annonce[]>(
        `${API_URL}/annonces`
      );

      setAnnonces(response.data);
    } catch (requestError) {
      console.error('Erreur chargement annonces :', requestError);

      setError('Impossible de réinitialiser les annonces.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-950 pb-[calc(5rem+env(safe-area-inset-bottom))] text-white">
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex min-h-[72px] items-center justify-between gap-3">
            {/* Back */}

            <button
              type="button"
              onClick={() => router.back()}
              className="group inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-300 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Retour à la page précédente"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition group-hover:-translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="hidden sm:inline">Retour</span>
            </button>

            {/* Brand */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <BookOpen size={21} className="text-slate-950" />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-lg font-bold leading-none tracking-tight">
                  Boch<span className="text-emerald-400">237</span>
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Annonces
                </p>
              </div>
            </div>

            {/* Filter button */}

            <button
              type="button"
              onClick={() =>
                setShowFilters((current) => !current)
              }
              className={`flex min-h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                showFilters
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300'
              }`}
              aria-label={
                showFilters
                  ? 'Masquer les filtres'
                  : 'Afficher les filtres'
              }
              aria-expanded={showFilters}
              aria-controls="annonces-filters"
            >
              {showFilters ? (
                <X size={19} aria-hidden="true" />
              ) : (
                <Filter size={19} aria-hidden="true" />
              )}

              <span className="hidden sm:inline">
                {showFilters ? 'Fermer' : 'Filtres'}
              </span>
            </button>
          </div>

          {/* Header title */}

          <div className="pb-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <Sparkles size={13} />

              Opportunités disponibles
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Trouvez une demande de répétiteur
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Consultez les besoins des parents et trouvez les
              annonces correspondant à vos compétences.
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 mx-auto w-full max-w-6xl">
        {/* ===================================================
            PUBLISH BUTTON FOR PARENTS
        ==================================================== */}

        {isParent && (
          <section
            className="px-4 pt-5 sm:px-6 lg:pt-7"
            aria-label="Publication"
          >
            <button
              type="button"
              onClick={() => router.push('/annonces/creer')}
              className="group flex min-h-[54px] w-full items-center justify-center gap-3 rounded-2xl border border-pink-400/20 bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-3.5 font-bold text-white shadow-xl shadow-pink-500/10 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-pink-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-lg transition group-hover:scale-105">
                +
              </span>

              <span>Publier une annonce</span>
            </button>
          </section>
        )}

        {/* ===================================================
            FILTERS
        ==================================================== */}

        {showFilters && (
          <section
            id="annonces-filters"
            className="px-4 pt-5 sm:px-6"
            aria-labelledby="filters-title"
          >
            <form
              onSubmit={searchAnnonces}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
            >
              {/* Decorative glow */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative">
                {/* Filter heading */}

                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                      <Filter size={20} />
                    </div>

                    <div>
                      <h2
                        id="filters-title"
                        className="text-lg font-bold tracking-tight text-white"
                      >
                        Filtrer les annonces
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Affinez votre recherche
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white sm:hidden"
                    aria-label="Fermer les filtres"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Fields */}

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Subject */}

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      Matière
                    </label>

                    <div className="relative">
                      <BookOpen
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400"
                        aria-hidden="true"
                      />

                      <select
                        id="subject"
                        value={filters.subject}
                        onChange={(event) =>
                          updateFilter('subject', event.target.value)
                        }
                        className="min-h-[52px] w-full appearance-none rounded-2xl border border-white/10 bg-slate-950 px-10 pr-10 text-sm font-medium text-white outline-none transition hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                      >
                        <option value="">
                          Toutes les matières
                        </option>

                        {SUBJECTS.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={17}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Class */}

                  <div>
                    <label
                      htmlFor="class"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      Classe
                    </label>

                    <div className="relative">
                      <BookOpen
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400"
                        aria-hidden="true"
                      />

                      <select
                        id="class"
                        value={filters.class}
                        onChange={(event) =>
                          updateFilter('class', event.target.value)
                        }
                        className="min-h-[52px] w-full appearance-none rounded-2xl border border-white/10 bg-slate-950 px-10 pr-10 text-sm font-medium text-white outline-none transition hover:border-white/20 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
                      >
                        <option value="">
                          Toutes les classes
                        </option>

                        {CLASSES.map((className) => (
                          <option key={className} value={className}>
                            {className}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={17}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* City */}

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      Ville
                    </label>

                    <div className="relative">
                      <MapPin
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400"
                        aria-hidden="true"
                      />

                      <input
                        id="city"
                        type="search"
                        autoComplete="address-level2"
                        placeholder="Ex. Douala"
                        value={filters.city}
                        onChange={(event) =>
                          updateFilter('city', event.target.value)
                        }
                        className="min-h-[52px] w-full rounded-2xl border border-white/10 bg-slate-950 px-10 text-sm font-medium text-white outline-none placeholder:text-slate-600 transition hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={searching}
                    className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {searching ? (
                      <>
                        <span
                          className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
                          aria-hidden="true"
                        />

                        Recherche...
                      </>
                    ) : (
                      <>
                        <Search size={18} aria-hidden="true" />

                        Rechercher
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => void resetFilters()}
                    disabled={searching}
                    className="min-h-[52px] rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* ===================================================
            LIST SECTION
        ==================================================== */}

        <section
          className="px-4 py-6 sm:px-6 lg:py-8"
          aria-labelledby="annonces-list-title"
          aria-busy={loading || searching}
        >
          {/* Section heading */}

          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Opportunités
              </p>

              <h2
                id="annonces-list-title"
                className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                Annonces disponibles
              </h2>

              {!loading && annonces.length > 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  {annonces.length}{' '}
                  {annonces.length > 1
                    ? 'annonces trouvées'
                    : 'annonce trouvée'}
                </p>
              )}
            </div>

            {/* Mobile filter shortcut */}

            <button
              type="button"
              onClick={() =>
                setShowFilters((current) => !current)
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:hidden"
            >
              <Filter size={15} />

              Filtrer
            </button>
          </div>

          {/* Error */}

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                !
              </div>

              <p className="leading-6">{error}</p>
            </div>
          )}

          {/* Loading */}

          {loading ? (
            <div
              className="rounded-3xl border border-white/10 bg-slate-900/60 px-4 py-16 text-center backdrop-blur-xl"
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
                <span
                  className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-400">
                Chargement des annonces...
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Veuillez patienter
              </p>
            </div>
          ) : annonces.length === 0 ? (
            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 px-5 py-14 text-center shadow-2xl shadow-black/10 backdrop-blur-xl">
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                  <Search size={28} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  Aucune annonce trouvée
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Aucune demande ne correspond actuellement à
                  votre recherche.
                </p>

                {isParent && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push('/annonces/creer')
                    }
                    className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    Publier une annonce
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* =================================================
               ANNOUNCES GRID
            ================================================== */

            <ul className="grid gap-5 md:grid-cols-2">
              {annonces.map((annonce) => (
                <li key={annonce._id}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25 hover:shadow-2xl hover:shadow-emerald-950/20 sm:p-6">
                    {/* Card glow */}

                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl transition group-hover:bg-emerald-500/10" />

                    <div className="relative flex h-full flex-col">
                      {/* Card header */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                            <BookOpen size={20} />
                          </div>

                          <div className="min-w-0">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Demande de cours
                            </p>

                            <h3 className="break-words text-lg font-bold leading-snug tracking-tight text-white transition group-hover:text-emerald-300">
                              {annonce.title}
                            </h3>
                          </div>
                        </div>

                        {/* Validated badge */}

                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-bold text-emerald-300">
                          <CheckCircle2 size={13} />

                          <span className="hidden xs:inline">
                            Validée
                          </span>
                        </span>
                      </div>

                      {/* Description */}

                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                        {annonce.description}
                      </p>

                      {/* Tags */}

                      <ul
                        className="mt-5 flex flex-wrap gap-2"
                        aria-label="Informations sur l’annonce"
                      >
                        {/* Subject */}

                        <li className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/10 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
                          <BookOpen
                            size={13}
                            aria-hidden="true"
                          />

                          {annonce.subject}
                        </li>

                        {/* Class */}

                        <li className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
                          <span
                            className="text-cyan-400"
                            aria-hidden="true"
                          >
                            🎓
                          </span>

                          {annonce.class}
                        </li>

                        {/* City */}

                        <li className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
                          <MapPin
                            size={13}
                            className="text-emerald-400"
                            aria-hidden="true"
                          />

                          {annonce.city}
                        </li>

                        {/* Budget */}

                        {annonce.budget && (
                          <li className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/10 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-300">
                            <Wallet
                              size={13}
                              aria-hidden="true"
                            />

                            {annonce.budget} FCFA
                          </li>
                        )}

                        {/* Duration */}

                        <li className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
                          <Clock
                            size={13}
                            className="text-cyan-400"
                            aria-hidden="true"
                          />

                          {annonce.duration}
                        </li>
                      </ul>

                      {/* Divider */}

                      <div className="mt-6 border-t border-white/5 pt-4" />

                      {/* Bottom */}

                      <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500">
                            Publié par
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-slate-300">
                            {annonce.parentName}
                          </p>

                          <time
                            dateTime={annonce.createdAt}
                            className="mt-0.5 block text-[11px] text-slate-600"
                          >
                            {new Date(
                              annonce.createdAt
                            ).toLocaleDateString('fr-FR')}
                          </time>
                        </div>

                        {/* Details */}

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/annonces/${annonce._id}`
                            )
                          }
                          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 text-sm font-bold text-emerald-300 ring-1 ring-inset ring-white/10 transition hover:bg-emerald-400/10 hover:text-emerald-200 hover:ring-emerald-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:min-w-[150px]"
                          aria-label={`Voir les détails de l’annonce : ${annonce.title}`}
                        >
                          Voir les détails

                          <Eye
                            size={17}
                            aria-hidden="true"
                            className="transition group-hover:translate-x-0.5"
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <MobileNav userRole={user?.role} />
    </div>
  );
}