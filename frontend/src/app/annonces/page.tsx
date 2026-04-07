'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Search, MapPin, BookOpen, Clock, Eye, Filter } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import { API_URL } from '@/lib/api';

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

export default function AnnoncesPage() {
  const router = useRouter();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ subject: '', class: '', city: '' });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
    fetchAnnonces();
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchAnnonces = async () => {
    try {
      const response = await axios.get(`${API_URL}/annonces`);
      setAnnonces(response.data);
    } catch (error) {
      console.error('Erreur chargement annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchAnnonces = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.class) params.append('class', filters.class);
      if (filters.city) params.append('city', filters.city);
      
      const response = await axios.get(`${API_URL}/annonces?${params}`);
      setAnnonces(response.data);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ subject: '', class: '', city: '' });
    fetchAnnonces();
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button onClick={() => router.back()} className="text-white">
            ← Retour
          </button>
          <h1 className="text-white text-xl font-bold">📢 Annonces</h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="text-white"
          >
            <Filter size={20} />
          </button>
        </div>
        <p className="text-green-100 text-sm text-center mt-1">
          Besoin d'un répétiteur ? Consultez les annonces
        </p>
      </div>

      {/* Bouton Publier une annonce - pour les parents */}
      {user && user.role === 'parent' && (
        <div className="p-4">
          <button
            onClick={() => router.push('/annonces/creer')}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
          >
            ➕ Publier une annonce
          </button>
        </div>
      )}

      {/* Filtres */}
      {showFilters && (
        <div className="px-4 pb-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Filtrer les annonces</h3>
            <div className="space-y-3">
              <select
                className="w-full p-3 rounded-lg bg-slate-900 text-white border border-green-500"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              >
                <option value="">Toutes les matières</option>
                <option>Mathématiques</option>
                <option>Français</option>
                <option>Anglais</option>
                <option>Physique</option>
                <option>SVT</option>
              </select>
              
              <select
                className="w-full p-3 rounded-lg bg-slate-900 text-white border border-green-500"
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              >
                <option value="">Toutes les classes</option>
                <option>6ème</option><option>5ème</option><option>4ème</option>
                <option>3ème</option><option>Seconde</option><option>Terminale</option>
              </select>
              
              <input
                type="text"
                placeholder="Ville"
                className="w-full p-3 rounded-lg bg-slate-900 text-white border border-green-500"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
              
              <div className="flex gap-2">
                <button
                  onClick={searchAnnonces}
                  className="flex-1 bg-green-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Search size={16} /> Rechercher
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 bg-slate-700 text-white p-2 rounded-lg"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des annonces */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Chargement...</p>
          </div>
        ) : annonces.length === 0 ? (
          <div className="text-center py-10 bg-slate-800 rounded-xl">
            <p className="text-gray-400">Aucune annonce pour le moment</p>
            {user && user.role === 'parent' && (
              <button
                onClick={() => router.push('/annonces/creer')}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Publier une annonce
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {annonces.map((annonce) => (
              <div key={annonce._id} className="bg-slate-800 rounded-xl p-4 border border-green-500/30">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold text-lg flex-1">{annonce.title}</h3>
                  <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-lg text-xs">
                    ✅ Validée
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mt-2">{annonce.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-lg text-xs">
                    📚 {annonce.subject}
                  </span>
                  <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-xs">
                    🎓 {annonce.class}
                  </span>
                  <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-xs">
                    📍 {annonce.city}
                  </span>
                  {annonce.budget && (
                    <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-xs">
                      💰 {annonce.budget} FCFA
                    </span>
                  )}
                  <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-xs">
                    <Clock size={12} className="inline" /> {annonce.duration}
                  </span>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-gray-500 text-xs">
                    Publié par {annonce.parentName} • {new Date(annonce.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => router.push(`/annonces/${annonce._id}`)}
                    className="text-green-400 text-sm flex items-center gap-1 hover:underline"
                  >
                    <Eye size={16} /> Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileNav userRole={user?.role} />
    </div>
  );
}