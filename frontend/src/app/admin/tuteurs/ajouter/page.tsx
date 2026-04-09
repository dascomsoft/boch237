
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';

export default function AdminAjouterTuteur() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    phone: '',
    name: '',
    province: '',
    city: '',
    district: '',
    subjects: '',
    classes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    if (!form.phone || !form.name) {
      alert('Le téléphone et le nom sont requis');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/annonces/admin/add-tutor`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResult(response.data);
      setForm({
        phone: '', name: '', province: '', city: '',
        district: '', subjects: '', classes: ''
      });
      alert('✅ Répétiteur ajouté avec succès !');
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || '❌ Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="bg-green-600 p-4 rounded-lg mb-4">
        <button onClick={() => router.back()} className="text-white mb-2">
          ← Retour
        </button>
        <h1 className="text-white text-xl font-bold text-center">
          Ajouter un répétiteur (Admin)
        </h1>
        <p className="text-green-100 text-sm text-center">Ajouter manuellement un répétiteur</p>
      </div>

      {result && (
        <div className="bg-green-600/20 border border-green-500 rounded-xl p-4 mb-4">
          <p className="text-green-400 font-bold">✅ {result.message}</p>
          <p className="text-gray-300 text-sm mt-2">
            Mot de passe temporaire: <span className="text-green-400 font-mono">{result.tempPassword}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Le répétiteur devra changer son mot de passe à la première connexion.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3">Informations personnelles</h2>
          
          <input
            type="tel"
            placeholder="Téléphone *"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="Nom complet *"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          
          <select
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
          >
            <option value="">Province</option>
            <option>Centre</option><option>Littoral</option>
            <option>Ouest</option><option>Nord</option>
            <option>Extrême-Nord</option><option>Sud</option>
            <option>Sud-Ouest</option><option>Nord-Ouest</option>
            <option>Est</option><option>Adamaoua</option>
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
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-bold"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter le répétiteur'}
        </button>
      </form>
    </div>
  );
}