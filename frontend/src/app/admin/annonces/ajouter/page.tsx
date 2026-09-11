'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  PlusCircle,
  User,
  Wallet
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';

export default function AdminAjouterAnnonce() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    city: '',
    district: '',
    budget: '',
    duration: 'Ponctuel',
    parentPhone: '',
    parentName: '',
    parentEmail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/annonces/admin/create',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.parentCreated) {
        alert(`✅ Annonce créée ! Un compte parent a été créé automatiquement.`);
      } else {
        alert(`✅ Annonce créée avec succès !`);
      }
      router.push('/admin/annonces');
    } catch (error: any) {
      alert(error.response?.data?.message || '❌ Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/10';

  const selectClass =
    'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white transition focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 [&>option]:bg-slate-900';

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
                Ajouter une <span className="text-emerald-400">annonce</span>
              </p>
              <p className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:block">
                Espace administrateur
              </p>
            </div>
          </div>

          <div className="w-10" />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pb-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <PlusCircle size={14} />
            Pour un parent pas encore sur la plateforme
          </div>

          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            Créez une annonce{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              au nom d'un parent.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Renseignez les informations du parent et les détails de l'annonce.
            Un compte parent sera créé automatiquement si nécessaire.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section : Informations du parent */}
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 text-emerald-400">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  Informations du parent
                </h2>
                <p className="text-xs text-slate-500">
                  Identité et coordonnées de contact
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Phone
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="tel"
                  placeholder="Téléphone du parent *"
                  className={`${inputClass} pl-11`}
                  required
                  onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                />
              </div>

              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Nom du parent"
                  className={`${inputClass} pl-11`}
                  onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                />
              </div>

              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  placeholder="Email du parent (optionnel)"
                  className={`${inputClass} pl-11`}
                  onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Section : Informations de l'annonce */}
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 text-emerald-400">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  Informations de l'annonce
                </h2>
                <p className="text-xs text-slate-500">
                  Contenu de l'annonce visible par les répétiteurs
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titre de l'annonce *"
                className={inputClass}
                required
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                placeholder="Description *"
                rows={3}
                className={`${inputClass} resize-none`}
                required
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="relative">
                <BookOpen
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  className={`${selectClass} pl-11`}
                  required
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="">Matière *</option>
                  <option>Mathématiques</option>
                  <option>Français</option>
                  <option>Anglais</option>
                  <option>Physique</option>
                  <option>SVT</option>
                </select>
              </div>

              <div className="relative">
                <GraduationCap
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  className={`${selectClass} pl-11`}
                  required
                  onChange={(e) => setForm({ ...form, class: e.target.value })}
                >
                  <option value="">Classe *</option>
                  <option>6ème</option>
                  <option>5ème</option>
                  <option>4ème</option>
                  <option>3ème</option>
                  <option>Seconde</option>
                  <option>Terminale</option>
                </select>
              </div>

              <div className="relative">
                <MapPin
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Ville *"
                  className={`${inputClass} pl-11`}
                  required
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <input
                type="text"
                placeholder="Quartier"
                className={inputClass}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />

              <div className="relative">
                <Wallet
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="number"
                  placeholder="Budget (FCFA)"
                  className={`${inputClass} pl-11`}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>

              <div className="relative">
                <CalendarClock
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  className={`${selectClass} pl-11`}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                >
                  <option>Ponctuel</option>
                  <option>Hebdomadaire</option>
                  <option>Mensuel</option>
                </select>
              </div>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                Créer l'annonce
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500">
            Un compte parent sera créé automatiquement si le numéro n'existe
            pas encore sur la plateforme.
          </p>
        </form>
      </main>

      <MobileNav userRole="admin" />
    </div>
  );
}