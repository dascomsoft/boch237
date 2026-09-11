'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import {
  BookOpen,
  GraduationCap,
  Loader2,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  User
} from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({
    phone: '',
    password: '',
    name: '',
    role: 'parent',
    province: '',
    city: '',
    district: '',
    subjects: '',
    classes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        // 🔐 CONNEXION
        const response = await axios.post(`${API_URL}/auth/login`, {
          phone: form.phone,
          password: form.password
        });

        localStorage.setItem('token', response.data.token);

        if (response.data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/home');
        }
      } else {
        // 📝 INSCRIPTION
        const requestData = {
          phone: form.phone,
          password: form.password,
          name: form.name,
          role: form.role,
          province: form.province,
          city: form.city,
          district: form.district,
          subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()) : [],
          classes: form.classes ? form.classes.split(',').map(c => c.trim()) : []
        };

        await axios.post(`${API_URL}/auth/register`, requestData);

        // ✅ Succès de l'inscription
        setSuccessMessage('✅ Compte créé avec succès ! Veuillez vous connecter.');

        // 🔄 Réinitialiser le formulaire
        setForm({
          phone: '',
          password: '',
          name: '',
          role: 'parent',
          province: '',
          city: '',
          district: '',
          subjects: '',
          classes: ''
        });

        // 🔁 Basculer vers le mode Connexion
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/10';

  const selectClass =
    'w-full rounded-xl border border-white/10 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white transition focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 [&>option]:bg-slate-900';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full ring-2 ring-emerald-500/30 ring-offset-4 ring-offset-slate-900">
              <Image
                src="/bochlogo.png"
                alt="Boch237 Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Boch<span className="text-emerald-400">237</span>
            </h1>
            <p className="mt-1 text-sm font-medium text-emerald-400">
              La réussite, simplifiée
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
            </p>
          </div>

          {/* Toggle Connexion / Inscription */}
          <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccessMessage('');
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
                isLogin
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-950/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={15} />
              Connexion
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccessMessage('');
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
                !isLogin
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-950/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={15} />
              Inscription
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Phone
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="tel"
                placeholder="Numéro de téléphone *"
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="password"
                placeholder="Mot de passe *"
                className={inputClass}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Nom complet *"
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <GraduationCap
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <select
                    className={selectClass}
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="parent">👨‍👩‍👧 Parent/Élève</option>
                    <option value="tutor">👨‍🏫 Répétiteur</option>
                  </select>
                </div>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Province"
                    className={inputClass}
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Ville *"
                    className={inputClass}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Quartier"
                    className={inputClass}
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                  />
                </div>

                {form.role === 'tutor' && (
                  <>
                    <div className="relative">
                      <BookOpen
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="Matières (ex: Maths, Français, Anglais)"
                        className={inputClass}
                        value={form.subjects}
                        onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                      />
                    </div>

                    <div className="relative">
                      <GraduationCap
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="Classes (ex: 6ème, 5ème, 4ème)"
                        className={inputClass}
                        value={form.classes}
                        onChange={(e) => setForm({ ...form, classes: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Chargement...
                </>
              ) : isLogin ? (
                'Se connecter'
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © 2026 Boch237 — Apprendre autrement
        </p>
      </div>
    </div>
  );
}