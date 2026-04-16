
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { MapPin, BookOpen, Clock, User, Phone, Calendar, ArrowLeft } from 'lucide-react';
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

export default function AnnonceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
    fetchAnnonce();
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

  const fetchAnnonce = async () => {
    try {
      const response = await axios.get(`${API_URL}/annonces`);
      const found = response.data.find((a: any) => a._id === params.id);
      setAnnonce(found);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    if (!annonce) return;
    
    try {
      const token = localStorage.getItem('token');
      // Créer une conversation avec le parent qui a publié l'annonce
      const response = await axios.post(
        `${API_URL}/users/conversation`,
        { tutorId: annonce.parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push(`/chat?convId=${response.data._id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Impossible de contacter le parent');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="text-center py-10">
          <p className="text-white">Annonce non trouvée</p>
          <button onClick={() => router.back()} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
        <button onClick={() => router.back()} className="text-white flex items-center gap-1 mb-2">
          <ArrowLeft size={20} /> Retour
        </button>
        <h1 className="text-white text-xl font-bold text-center">{annonce.title}</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-2">Description</h2>
          <p className="text-gray-300">{annonce.description}</p>
        </div>

        {/* Détails */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3">Détails de l'annonce</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
              <BookOpen size={16} className="text-green-400" />
              <span>Matière: <strong>{annonce.subject}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <BookOpen size={16} className="text-green-400" />
              <span>Classe: <strong>{annonce.class}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={16} className="text-green-400" />
              <span>Localisation: <strong>{annonce.city}</strong> {annonce.district && `- ${annonce.district}`}</span>
            </div>
            {annonce.budget && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">💰</span>
                <span>Budget: <strong>{annonce.budget} FCFA</strong></span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-300">
              <Clock size={16} className="text-green-400" />
              <span>Fréquence: <strong>{annonce.duration}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar size={16} className="text-green-400" />
              <span>Publiée le: <strong>{new Date(annonce.createdAt).toLocaleDateString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Informations du parent */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
            <User size={16} /> Publié par
          </h2>
          <p className="text-white">{annonce.parentName}</p>
          
          {/* Bouton contacter - seulement pour les répétiteurs */}
          {user && user.role === 'tutor' && (
            <button
              onClick={startChat}
              className="w-full mt-3 bg-green-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Phone size={16} /> Contacter le parent
            </button>
          )}
        </div>

        {/* Note */}
        <div className="bg-blue-600/20 border border-blue-500 rounded-xl p-3">
          <p className="text-blue-400 text-xs text-center">
            ℹ️ Cette annonce a été vérifiée par notre équipe. Pour postuler, utilisez le bouton "Contacter".
          </p>
        </div>
      </div>
    </div>
  );
}
