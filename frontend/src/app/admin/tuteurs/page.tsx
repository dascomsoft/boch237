
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Edit, Trash2, Eye, RefreshCw, UserPlus } from 'lucide-react';

interface Tutor {
  _id: string;
  name: string;
  phone: string;
  role: string;
  city: string;
  district: string;
  subjects: string[];
  classes: string[];
  isActive: boolean;
}

export default function AdminTuteurs() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/users/tutors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTutors(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de chargement des répétiteurs');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5001/api/users/${id}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTutors();
      alert(`✅ Répétiteur ${!currentStatus ? 'activé' : 'désactivé'}`);
    } catch (error) {
      alert('❌ Erreur lors de la modification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="bg-green-600 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <button onClick={() => router.back()} className="text-white">
            ← Retour
          </button>
          <h1 className="text-white text-xl font-bold">Gestion des répétiteurs</h1>
          <button onClick={fetchTutors} className="text-white">
            <RefreshCw size={20} />
          </button>
        </div>
        <p className="text-green-100 text-sm text-center mt-1">
          {tutors.length} répétiteurs inscrits
        </p>
      </div>

      <button
        onClick={() => router.push('/admin/tuteurs/ajouter')}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold mb-4 flex items-center justify-center gap-2"
      >
        <UserPlus size={20} /> Ajouter un répétiteur
      </button>

      <div className="space-y-3">
        {tutors.length === 0 ? (
          <div className="text-center py-10 bg-slate-800 rounded-xl">
            <p className="text-gray-400">Aucun répétiteur</p>
          </div>
        ) : (
          tutors.map((tutor) => (
            <div key={tutor._id} className="bg-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold">{tutor.name}</h3>
                  <p className="text-gray-400 text-sm">{tutor.phone}</p>
                  <p className="text-gray-500 text-xs">{tutor.city} {tutor.district && `- ${tutor.district}`}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${tutor.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                  {tutor.isActive ? 'Actif' : 'Inactif'}
                </div>
              </div>
              
              {tutor.subjects && tutor.subjects.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {tutor.subjects.map((subject, idx) => (
                    <span key={idx} className="bg-green-600/20 text-green-400 px-2 py-1 rounded-lg text-xs">
                      {subject}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => toggleStatus(tutor._id, tutor.isActive)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    tutor.isActive ? 'bg-yellow-600' : 'bg-green-600'
                  } text-white`}
                >
                  {tutor.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => router.push(`/profile/${tutor._id}`)}
                  className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                >
                  <Eye size={16} /> Voir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
