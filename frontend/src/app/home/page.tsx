'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import TutorCard from '@/components/TutorCard';
import MobileNav from '@/components/MobileNav';
import { User, SearchFilters } from '@/types';
import { Megaphone, PlusCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    province: '',
    city: '',
    class: '',
    subject: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchUserProfile(token);
    fetchAllTutors();
    setIsCheckingAuth(false);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Erreur profil:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const fetchAllTutors = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/tutors`);
      setTutors(response.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const searchTutors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/tutors`, {
        params: filters
      });
      setTutors(response.data);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      
      {/* HEADER */}
      <div className="bg-green-600 px-4 py-3 sticky top-0 z-10 shadow-md">
        <h1 className="text-base font-semibold text-white text-center tracking-tight">
          📚 Boch237
        </h1>
        {user && (
          <p className="text-green-100 text-xs text-center mt-0.5">
            Bonjour {user.name} 👋
          </p>
        )}
      </div>

      {/* CTA PARENT */}
      {user && user.role === 'parent' && (
        <div className="px-4 pt-4">
          <button
            onClick={() => router.push('/annonces/creer')}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white py-2.5 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition shadow"
          >
            <Megaphone size={16} />
            Publier une annonce
            <PlusCircle size={14} />
          </button>

          <p className="text-gray-500 text-[11px] text-center mt-1.5">
            Trouvez rapidement un répétiteur qualifié
          </p>
        </div>
      )}

      {/* SEARCH */}
      <div className="px-4 mt-3">
        <div className="bg-slate-800 rounded-lg p-3 shadow-sm">
          <SearchBar 
            filters={filters}
            onFilterChange={setFilters}
            onSearch={searchTutors}
            isLoading={loading}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-white font-semibold text-sm">
            Répétiteurs ({tutors.length})
          </h2>

          {user && user.role === 'parent' && (
            <button 
              onClick={() => router.push('/annonces')}
              className="text-green-400 text-xs hover:underline"
            >
              Voir annonces →
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-sm">Recherche...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center text-gray-400 py-8 bg-slate-800 rounded-lg">
            <p className="text-sm">Aucun répétiteur trouvé</p>
            <p className="text-xs mt-1">Essayez d'autres filtres</p>

            {user && user.role === 'parent' && (
              <button
                onClick={() => router.push('/annonces/creer')}
                className="mt-3 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs"
              >
                Publier une annonce
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
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