'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  MapPin,
  Megaphone,
  RefreshCw,
  Trash2,
  User,
  XCircle
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import { API_URL } from '@/lib/api';

interface Annonce {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  city: string;
  status: string;
  parentName: string;
  createdAt: string;
}

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminAnnonces() {
  const router = useRouter();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/annonces/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnonces(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const comment = prompt('Commentaire (optionnel):');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/annonces/${id}/status`,
        { status, adminComment: comment || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnnonces();
      alert(`✅ Annonce ${status === 'approved' ? 'validée' : 'refusée'}`);
    } catch (error) {
      alert('❌ Erreur');
    }
  };

  const deleteAnnonce = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/annonces/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnnonces();
      alert('✅ Annonce supprimée');
    } catch (error) {
      alert('❌ Erreur');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            ✅ Validée
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
            ❌ Refusée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
            ⏳ En attente
          </span>
        );
    }
  };

  const filteredAnnonces = annonces.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const filterTabs: { key: FilterType; label: string; icon: any; activeClass: string }[] = [
    {
      key: 'all',
      label: 'Toutes',
      icon: ClipboardList,
      activeClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
    },
    {
      key: 'pending',
      label: 'En attente',
      icon: Clock,
      activeClass: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
    },
    {
      key: 'approved',
      label: 'Validées',
      icon: CheckCircle,
      activeClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
    },
    {
      key: 'rejected',
      label: 'Refusées',
      icon: XCircle,
      activeClass: 'border-red-500/40 bg-red-500/10 text-red-300'
    }
  ];

  const countFor = (key: FilterType) =>
    key === 'all' ? annonces.length : annonces.filter(a => a.status === key).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-400" />
          </div>
          <p className="text-sm font-medium text-slate-400">
            Chargement des annonces...
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
              <Megaphone size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold leading-none tracking-tight">
                Gestion des <span className="text-emerald-400">annonces</span>
              </p>
              <p className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:block">
                Modération et validation
              </p>
            </div>
          </div>

          <button
            onClick={fetchAnnonces}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
            title="Actualiser"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pb-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <FileText size={14} />
            {annonces.filter(a => a.status === 'pending').length} annonce(s) en attente de validation
          </div>

          <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            Validez ou refusez les annonces{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              publiées par les parents.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Consultez les annonces soumises, approuvez celles conformes et
            supprimez celles qui ne respectent pas les règles.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-6 flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? tab.activeClass
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <Icon size={15} />
                {tab.label}
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive ? 'bg-white/10' : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {countFor(tab.key)}
                </span>
              </button>
            );
          })}
        </section>

        {/* Results */}
        <section className="pb-8">
          {filteredAnnonces.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <ClipboardList size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Aucune annonce dans cette catégorie
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Les annonces correspondant à ce filtre apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredAnnonces.map((annonce) => (
                <div
                  key={annonce._id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/20"
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 transition group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="flex-1 font-semibold leading-snug text-white">
                      {annonce.title}
                    </h3>
                    {getStatusBadge(annonce.status)}
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-6 text-slate-400">
                    {annonce.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-inset ring-white/10">
                      <BookOpen size={12} className="text-emerald-400" />
                      {annonce.subject}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-inset ring-white/10">
                      <MapPin size={12} className="text-emerald-400" />
                      {annonce.city}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold text-slate-950">
                      {annonce.parentName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <User size={12} />
                      Par :{' '}
                      <span className="font-medium text-slate-300">
                        {annonce.parentName}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {annonce.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(annonce._id, 'approved')}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                        >
                          <CheckCircle size={15} />
                          Valider
                        </button>
                        <button
                          onClick={() => updateStatus(annonce._id, 'rejected')}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                        >
                          <XCircle size={15} />
                          Refuser
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteAnnonce(annonce._id)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 ${
                        annonce.status === 'pending' ? '' : 'flex-1'
                      }`}
                    >
                      <Trash2 size={15} />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <MobileNav userRole="admin" />
    </div>
  );
}