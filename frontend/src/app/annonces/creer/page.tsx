
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreerAnnonce() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    city: '',
    district: '',
    budget: '',
    duration: 'Ponctuel'
  });

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Récupérer les infos de l'utilisateur
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    if (!form.title || !form.description || !form.subject || !form.class || !form.city) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/annonces',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('✅ Annonce publiée avec succès !\n\nElle sera visible après validation par l\'administrateur.');
      router.push('/annonces');
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || '❌ Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg mb-4">
        <button 
          onClick={() => router.back()}
          className="text-white mb-2 flex items-center gap-1"
        >
          ← Retour
        </button>
        <h1 className="text-white text-xl font-bold text-center">
          📢 Publier une annonce
        </h1>
        <p className="text-green-100 text-sm text-center mt-1">
          Besoin d'un répétiteur ? Décrivez votre besoin
        </p>
      </div>

      {/* Info utilisateur */}
      {user && (
        <div className="bg-slate-800 rounded-xl p-3 mb-4">
          <p className="text-gray-400 text-sm">
            Vous publiez en tant que : <span className="text-green-400 font-medium">{user.name}</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            📞 {user.phone}
          </p>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Titre de l'annonce <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Recherche professeur de maths pour élève de 3ème"
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Description détaillée <span className="text-red-400">*</span>
          </label>
          <textarea
            placeholder="Décrivez votre besoin (niveau de l'élève, objectifs, fréquence, etc.)"
            rows={5}
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        
        {/* Matière */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Matière <span className="text-red-400">*</span>
          </label>
          <select
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          >
            <option value="">Sélectionnez une matière</option>
            <option>Mathématiques</option>
            <option>Français</option>
            <option>Anglais</option>
            <option>Physique-Chimie</option>
            <option>SVT / Biologie</option>
            <option>Histoire-Géographie</option>
            <option>Philosophie</option>
            <option>Informatique</option>
            <option>Espagnol</option>
            <option>Allemand</option>
          </select>
        </div>
        
        {/* Classe */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Classe / Niveau <span className="text-red-400">*</span>
          </label>
          <select
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            required
            value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
          >
            <option value="">Sélectionnez une classe</option>
            <option>Primaire</option>
            <option>6ème</option><option>5ème</option><option>4ème</option><option>3ème</option>
            <option>Seconde</option><option>Première</option><option>Terminale</option>
            <option>Form 1</option><option>Form 2</option><option>Form 3</option>
            <option>Form 4</option><option>Form 5</option><option>Lower Sixth</option><option>Upper Sixth</option>
            <option>Université</option>
          </select>
        </div>
        
        {/* Ville */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Ville <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Yaoundé, Douala, Bafoussam..."
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        
        {/* Quartier */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Quartier (optionnel)
          </label>
          <input
            type="text"
            placeholder="Ex: Bastos, Bonapriso, Akwa..."
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </div>
        
        {/* Budget */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Budget proposé (FCFA) - optionnel
          </label>
          <input
            type="number"
            placeholder="Ex: 15000"
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
        </div>
        
        {/* Durée */}
        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Fréquence
          </label>
          <select
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          >
            <option>Ponctuel</option>
            <option>Hebdomadaire</option>
            <option>Mensuel</option>
          </select>
        </div>
        
        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg font-bold transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-3 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Publication...' : '📢 Publier'}
          </button>
        </div>
      </form>
      
      {/* Information */}
      <div className="mt-6 bg-blue-600/20 border border-blue-500 rounded-xl p-4">
        <p className="text-blue-400 text-sm font-medium">ℹ️ Information</p>
        <p className="text-gray-400 text-xs mt-1">
          Votre annonce sera d'abord vérifiée par notre équipe avant d'être publiée. 
          Les répétiteurs intéressés pourront vous contacter directement via la messagerie.
        </p>
      </div>
    </div>
  );
}
