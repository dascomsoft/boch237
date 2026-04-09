
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
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

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center justify-center mb-6">
         <div className="w-36 h-36 relative mb-3 rounded-full overflow-hidden">
         <Image
           src="/bochlogo.png"
           alt="Boch237 Logo"
           fill
           className="object-cover"
           priority
           />
           </div>
          <h1 className="text-white text-2xl font-bold">Boch237</h1>
          <p className="text-green-400 text-sm mt-1 font-medium">La réussite, simplifiée</p>
          <p className="text-gray-400 text-sm mt-2">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              isLogin ? 'bg-green-600 text-white' : 'text-gray-400'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              !isLogin ? 'bg-green-600 text-white' : 'text-gray-400'
            }`}
          >
            Inscription
          </button>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-600/20 border border-green-500 rounded-lg p-3 mb-4">
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="tel"
            placeholder="Numéro de téléphone *"
            className="w-full p-3 rounded-lg bg-slate-900 text-white"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          
          <input
            type="password"
            placeholder="Mot de passe *"
            className="w-full p-3 rounded-lg bg-slate-900 text-white"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nom complet *"
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              
              <select
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="parent">👨‍👩‍👧 Parent/Élève</option>
                <option value="tutor">👨‍🏫 Répétiteur</option>
              </select>

              <input
                type="text"
                placeholder="Province"
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />

              <input
                type="text"
                placeholder="Ville *"
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Quartier"
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />

              {form.role === 'tutor' && (
                <>
                  <input
                    type="text"
                    placeholder="Matières (ex: Maths, Français, Anglais)"
                    className="w-full p-3 rounded-lg bg-slate-900 text-white"
                    value={form.subjects}
                    onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Classes (ex: 6ème, 5ème, 4ème)"
                    className="w-full p-3 rounded-lg bg-slate-900 text-white"
                    value={form.classes}
                    onChange={(e) => setForm({ ...form, classes: e.target.value })}
                  />
                </>
              )}
            </>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold disabled:opacity-50 mt-4"
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>
      </div>
    </div>
  );
}