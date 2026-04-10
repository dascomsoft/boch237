
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Save, ArrowLeft, Key, Camera } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    province: '',
    city: '',
    district: '',
    subjects: '',
    classes: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchUser(token);
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data;
      setUser(userData);
      setForm({
        name: userData.name || '',
        province: userData.province || '',
        city: userData.city || '',
        district: userData.district || '',
        subjects: userData.subjects?.join(', ') || '',
        classes: userData.classes?.join(', ') || ''
      });
    } catch (error) {
      console.error('Erreur:', error);
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const updateData: any = {
        name: form.name,
        province: form.province,
        city: form.city,
        district: form.district
      };
      
      if (user?.role === 'tutor') {
        updateData.subjects = form.subjects ? form.subjects.split(',').map(s => s.trim()) : [];
        updateData.classes = form.classes ? form.classes.split(',').map(c => c.trim()) : [];
      }
      
      await axios.put(`${API_URL}/users/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('✅ Profil mis à jour avec succès !');
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('✅ Mot de passe modifié avec succès !');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 pb-20">
      {/* Header */}
      <div className="bg-green-600 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Modifier mon profil</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-600/20 border border-green-500 rounded-lg p-3 mb-4">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3">Informations personnelles</h2>
          
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          
          <select
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
          >
            <option value="">Province</option>
            <option>Centre</option><option>Littoral</option><option>Ouest</option>
            <option>Nord</option><option>Extrême-Nord</option><option>Sud</option>
          </select>
          
          <input
            type="text"
            placeholder="Ville"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="Quartier"
            className="w-full p-3 rounded-lg bg-slate-900 text-white"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </div>

        {user.role === 'tutor' && (
          <div className="bg-slate-800 rounded-xl p-4">
            <h2 className="text-green-400 font-bold mb-3">Compétences</h2>
            
            <input
              type="text"
              placeholder="Matières (séparées par des virgules)"
              className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
              value={form.subjects}
              onChange={(e) => setForm({ ...form, subjects: e.target.value })}
            />
            
            <input
              type="text"
              placeholder="Classes (séparées par des virgules)"
              className="w-full p-3 rounded-lg bg-slate-900 text-white"
              value={form.classes}
              onChange={(e) => setForm({ ...form, classes: e.target.value })}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            <Key size={20} /> Changer mot de passe
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} /> {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* Modal changement mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white text-xl font-bold mb-4">Changer le mot de passe</h2>
            
            {error && (
              <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Mot de passe actuel"
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
              
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
              
              <input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                className="w-full p-3 rounded-lg bg-slate-900 text-white"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setError('');
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 bg-gray-600 text-white p-2 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white p-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Changer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
