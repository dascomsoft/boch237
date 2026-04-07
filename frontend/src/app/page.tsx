
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import TutorCard from '@/components/TutorCard';
import MobileNav from '@/components/MobileNav';
import { User, SearchFilters } from '@/types';
import { Megaphone, PlusCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    province: '',
    city: '',
    class: '',
    subject: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
    fetchAllTutors();
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Erreur profil:', error);
    }
  };

  const fetchAllTutors = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/tutors');
      setTutors(response.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const searchTutors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/users/tutors', {
        params: filters
      });
      setTutors(response.data);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-green-600 p-4 sticky top-0 z-10 shadow-lg">
        <h1 className="text-xl font-bold text-white text-center">
          📚 Cours Repetitions Cameroun
        </h1>
        {user && (
          <p className="text-green-100 text-sm text-center mt-1">
            Bonjour {user.name} 👋
          </p>
        )}
      </div>

      {/* Bouton Publier une annonce - visible seulement pour les parents */}
      {user && user.role === 'parent' && (
        <div className="p-4">
          <button
            onClick={() => router.push('/annonces/creer')}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Megaphone size={20} />
            Publier une annonce de besoin de cours
            <PlusCircle size={16} />
          </button>
          <p className="text-gray-500 text-xs text-center mt-2">
            Besoin d'un répétiteur ? Publiez une annonce et les tuteurs vous contacteront
          </p>
        </div>
      )}

      {/* Search Section */}
      <div className="p-4">
        <SearchBar 
          filters={filters}
          onFilterChange={setFilters}
          onSearch={searchTutors}
          isLoading={loading}
        />
      </div>

      {/* Results Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-bold text-lg">
            📖 Répétiteurs disponibles ({tutors.length})
          </h2>
          {user && user.role === 'parent' && (
            <button 
              onClick={() => router.push('/annonces')}
              className="text-green-400 text-sm flex items-center gap-1"
            >
              Voir les annonces →
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center text-gray-400 py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2">Recherche en cours...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center text-gray-400 py-10 bg-slate-800 rounded-xl">
            <p>Aucun répétiteur trouvé</p>
            <p className="text-sm mt-2">Modifiez vos critères de recherche</p>
            {user && user.role === 'parent' && (
              <button
                onClick={() => router.push('/annonces/creer')}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Publier une annonce
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>

      <MobileNav userRole={user?.role} />
    </div>
  );
}
