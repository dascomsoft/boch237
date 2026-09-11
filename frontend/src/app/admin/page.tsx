'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MobileNav from '@/components/MobileNav';
import {
  Users,
  MessageSquare,
  Settings,
  FileText,
  PlusCircle,
  UserPlus,
  Megaphone,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    tutors: 0,
    parents: 0,
  });
  const [loading, setLoading] = useState(true);

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
      const usersRes = await axios.get(`${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = usersRes.data;

      setStats({
        users: users.length,
        tutors: users.filter((u: any) => u.role === 'tutor').length,
        parents: users.filter((u: any) => u.role === 'parent').length,
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const menuItems = [
    {
      icon: MessageSquare,
      label: '💬 Messages',
      href: '/admin/chat',
      color: 'from-indigo-500 to-indigo-700',
      iconBg: 'bg-indigo-400/10',
      iconColor: 'text-indigo-400',
      description: 'Consulter et répondre aux messages',
    },
    {
      icon: Megaphone,
      label: 'Gérer les annonces',
      href: '/admin/annonces',
      color: 'from-blue-500 to-blue-700',
      iconBg: 'bg-blue-400/10',
      iconColor: 'text-blue-400',
      description: 'Valider, modifier ou supprimer',
    },
    {
      icon: PlusCircle,
      label: 'Ajouter une annonce',
      href: '/admin/annonces/ajouter',
      color: 'from-emerald-400 to-emerald-600',
      iconBg: 'bg-emerald-400/10',
      iconColor: 'text-emerald-400',
      description: 'Créer une annonce pour un parent',
    },
    {
      icon: Users,
      label: 'Gérer les répétiteurs',
      href: '/admin/tuteurs',
      color: 'from-purple-500 to-purple-700',
      iconBg: 'bg-purple-400/10',
      iconColor: 'text-purple-400',
      description: 'Voir et gérer la liste des répétiteurs',
    },
    {
      icon: UserPlus,
      label: 'Ajouter un répétiteur',
      href: '/admin/tuteurs/ajouter',
      color: 'from-orange-500 to-orange-700',
      iconBg: 'bg-orange-400/10',
      iconColor: 'text-orange-400',
      description: 'Ajouter manuellement un répétiteur',
    },
    {
      icon: FileText,
      label: 'Voir les annonces',
      href: '/annonces',
      color: 'from-cyan-500 to-cyan-700',
      iconBg: 'bg-cyan-400/10',
      iconColor: 'text-cyan-400',
      description: 'Accéder aux annonces publiques',
    },
  ];

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
              Chargement du tableau de bord...
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
    <div className="min-h-dvh bg-slate-950 pb-[calc(5rem+env(safe-area-inset-bottom))] text-white">
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
              aria-label="Retour à la page précédente"
            >
              <ArrowLeft
                size={17}
                className="transition group-hover:-translate-x-0.5"
                aria-hidden="true"
              />

              <span className="hidden sm:inline">Retour</span>
            </button>

            {/* Logo / identité */}
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

            {/* Déconnexion desktop */}
            <button
              type="button"
              onClick={handleLogout}
              className="group inline-flex min-h-11 items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 text-sm font-semibold text-red-300 transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              title="Se déconnecter"
            >
              <LogOut
                size={17}
                className="transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />

              <span className="hidden sm:inline">
                Déconnexion
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles size={13} aria-hidden="true" />
                Espace sécurisé
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dashboard Direction
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Gérez les utilisateurs, les annonces et les échanges
                de la plateforme Boch237 depuis votre espace
                d'administration.
              </p>
            </div>

            <div className="hidden shrink-0 sm:flex">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/10">
                <Activity
                  size={28}
                  className="text-emerald-400"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section
          className="mt-6"
          aria-labelledby="statistics-title"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Vue globale
              </p>

              <h2
                id="statistics-title"
                className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                Statistiques
              </h2>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-slate-500 sm:flex">
              <Activity
                size={14}
                className="text-emerald-400"
                aria-hidden="true"
              />
              Plateforme active
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
            {/* Utilisateurs */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10">
                    <Users
                      size={21}
                      className="text-emerald-400"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Total
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-white">
                  {stats.users}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Utilisateurs
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-lg bg-emerald-400/10 px-2 py-1 font-medium text-emerald-400">
                    {stats.tutors} tuteurs
                  </span>

                  <span className="rounded-lg bg-blue-400/10 px-2 py-1 font-medium text-blue-400">
                    {stats.parents} parents
                  </span>
                </div>
              </div>
            </div>

            {/* Tuteurs */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-400/10">
                  <UserPlus
                    size={21}
                    className="text-purple-400"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-white">
                  {stats.tutors}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Répétiteurs
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                    style={{
                      width:
                        stats.users > 0
                          ? `${Math.min(
                              (stats.tutors / stats.users) * 100,
                              100
                            )}%`
                          : '0%',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Conversations */}
            <div className="relative col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:col-span-1 sm:p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10">
                    <MessageSquare
                      size={21}
                      className="text-cyan-400"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-400">
                    Chat
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-white">
                  -
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Conversations
                </p>

                <p className="mt-4 text-[11px] leading-5 text-slate-600">
                  Statistique des conversations à venir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Actions rapides */}
        <section
          className="mt-8"
          aria-labelledby="quick-actions-title"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Administration
              </p>

              <h2
                id="quick-actions-title"
                className="mt-1 flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                <Settings
                  size={20}
                  className="text-emerald-400"
                  aria-hidden="true"
                />
                Actions rapides
              </h2>
            </div>

            <span className="text-xs text-slate-600">
              {menuItems.length} actions
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-5 text-left shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:translate-y-0"
                >
                  {/* Glow */}
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${item.color} opacity-5 blur-3xl transition group-hover:opacity-15`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}
                      >
                        <Icon
                          size={23}
                          className={item.iconColor}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-600 transition group-hover:border-white/10 group-hover:bg-white/10 group-hover:text-white">
                        <ChevronRight
                          size={17}
                          className="transition group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <h3 className="mt-5 text-base font-bold text-white transition group-hover:text-emerald-300">
                      {item.label}
                    </h3>

                    <p className="mt-1.5 min-h-[40px] text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${item.color}`}
                      />

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 transition group-hover:text-slate-400">
                        Ouvrir
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sécurité */}
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
                Espace d'administration sécurisé
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Cet espace permet de gérer les ressources de la
                plateforme. Assurez-vous de vous déconnecter après
                chaque session sur un appareil partagé.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Déconnexion flottante mobile */}
      <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 sm:hidden">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/15 text-red-300 shadow-xl shadow-black/30 backdrop-blur-xl transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-95"
          aria-label="Se déconnecter"
        >
          <LogOut size={20} aria-hidden="true" />
        </button>
      </div>

      <MobileNav userRole="admin" />
    </div>
  );
}