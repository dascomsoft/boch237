

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="bg-green-600 p-4 rounded-lg mb-4">
        <h1 className="text-white text-xl font-bold text-center">
          Ajouter une annonce (Admin)
        </h1>
        <p className="text-green-100 text-sm text-center mt-1">
          Pour un parent qui n'est pas encore sur la plateforme
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3">Informations du parent</h2>
          
          <input
            type="tel"
            placeholder="Téléphone du parent *"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            required
            onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="Nom du parent"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            onChange={(e) => setForm({ ...form, parentName: e.target.value })}
          />
          
          <input
            type="email"
            placeholder="Email du parent (optionnel)"
            className="w-full p-3 rounded-lg bg-slate-900 text-white"
            onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
          />
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3">Informations de l'annonce</h2>
          
          <input
            type="text"
            placeholder="Titre de l'annonce *"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          
          <textarea
            placeholder="Description *"
            rows={3}
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            required
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          
          <select
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
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
          
          <select
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            required
            onChange={(e) => setForm({ ...form, class: e.target.value })}
          >
            <option value="">Classe *</option>
            <option>6ème</option><option>5ème</option><option>4ème</option>
            <option>3ème</option><option>Seconde</option><option>Terminale</option>
          </select>
          
          <input
            type="text"
            placeholder="Ville *"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            required
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="Quartier"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
          
          <input
            type="number"
            placeholder="Budget (FCFA)"
            className="w-full p-3 rounded-lg bg-slate-900 text-white mb-2"
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
          
          <select
            className="w-full p-3 rounded-lg bg-slate-900 text-white"
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          >
            <option>Ponctuel</option>
            <option>Hebdomadaire</option>
            <option>Mensuel</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-bold"
        >
          {loading ? 'Création...' : 'Créer l\'annonce'}
        </button>
      </form>
    </div>
  );
}
