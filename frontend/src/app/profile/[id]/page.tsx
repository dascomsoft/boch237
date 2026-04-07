'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { User } from '@/types';
import { UserCircle, MapPin, BookOpen, GraduationCap, MessageCircle, ArrowLeft } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import { API_URL } from '@/lib/api';

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const tutorId = params.id as string;
      
      // Récupérer le profil du répétiteur
      const tutorResponse = await axios.get(`${API_URL}/users/${tutorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTutor(tutorResponse.data);
      
      // Récupérer l'utilisateur courant
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(userResponse.data);
      
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/users/conversation`,
        { tutorId: tutor?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push(`/chat?convId=${response.data._id}`);
    } catch (error) {
      console.error('Erreur démarrage chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Répétiteur non trouvé</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-green-600 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Profil du répétiteur</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Photo et nom */}
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <div className="inline-block p-3 bg-white rounded-full mb-3">
            <UserCircle size={64} className="text-green-600" />
          </div>
          <h1 className="text-white text-2xl font-bold">{tutor.name}</h1>
          <p className="text-green-400 mt-1">👨‍🏫 Répétiteur</p>
          <div className={`inline-block px-3 py-1 rounded-full text-xs mt-2 ${tutor.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
            {tutor.isActive ? '✅ Disponible' : '❌ Indisponible'}
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
            <MapPin size={18} /> Localisation
          </h2>
          <div className="space-y-2 text-gray-300">
            <p>Province: {tutor.province || 'Non spécifié'}</p>
            <p>Ville: {tutor.city || 'Non spécifié'}</p>
            <p>Quartier: {tutor.district || 'Non spécifié'}</p>
          </div>
        </div>

        {/* Matières enseignées */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
            <BookOpen size={18} /> Matières enseignées
          </h2>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects && tutor.subjects.length > 0 ? (
              tutor.subjects.map((subject, index) => (
                <span key={index} className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                  {subject}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Aucune matière spécifiée</p>
            )}
          </div>
        </div>

        {/* Classes */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
            <GraduationCap size={18} /> Classes
          </h2>
          <div className="flex flex-wrap gap-2">
            {tutor.classes && tutor.classes.length > 0 ? (
              tutor.classes.map((className, index) => (
                <span key={index} className="bg-slate-700 text-gray-300 px-3 py-1 rounded-lg text-sm">
                  {className}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Aucune classe spécifiée</p>
            )}
          </div>
        </div>

        {/* Bouton démarrer chat */}
        <button
          onClick={startChat}
          disabled={!tutor.isActive}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
            tutor.isActive 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
        >
          <MessageCircle size={20} />
          {tutor.isActive ? 'Démarrer une conversation' : 'Indisponible pour le moment'}
        </button>
      </div>

      <MobileNav userRole={currentUser?.role} />
    </div>
  );
}