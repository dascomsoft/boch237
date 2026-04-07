'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckCircle, XCircle, Trash2, RefreshCw } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Annonce {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  city: string;
  status: string;
  parentName: string;
  createdAt: string;
}

export default function AdminAnnonces() {
  const router = useRouter();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/annonces/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnonces(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const comment = prompt('Commentaire (optionnel):');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/annonces/${id}/status`,
        { status, adminComment: comment || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnnonces();
      alert(`✅ Annonce ${status === 'approved' ? 'validée' : 'refusée'}`);
    } catch (error) {
      alert('❌ Erreur');
    }
  };

  const deleteAnnonce = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/annonces/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnnonces();
      alert('✅ Annonce supprimée');
    } catch (error) {
      alert('❌ Erreur');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">✅ Validée</span>;
      case 'rejected': return <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">❌ Refusée</span>;
      default: return <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">⏳ En attente</span>;
    }
  };

  const filteredAnnonces = annonces.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

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
          <button onClick={() => router.back()} className="text-white">← Retour</button>
          <h1 className="text-white text-xl font-bold">Gestion des annonces</h1>
          <button onClick={fetchAnnonces} className="text-white"><RefreshCw size={20} /></button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`flex-1 py-2 rounded-lg ${filter === 'all' ? 'bg-green-600' : 'bg-slate-800'} text-white`}>
          Toutes ({annonces.length})
        </button>
        <button onClick={() => setFilter('pending')} className={`flex-1 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600' : 'bg-slate-800'} text-white`}>
          En attente ({annonces.filter(a => a.status === 'pending').length})
        </button>
        <button onClick={() => setFilter('approved')} className={`flex-1 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-600' : 'bg-slate-800'} text-white`}>
          Validées ({annonces.filter(a => a.status === 'approved').length})
        </button>
      </div>

      <div className="space-y-3">
        {filteredAnnonces.map((annonce) => (
          <div key={annonce._id} className="bg-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-white font-bold flex-1">{annonce.title}</h3>
              {getStatusBadge(annonce.status)}
            </div>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{annonce.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-xs">📚 {annonce.subject}</span>
              <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-xs">📍 {annonce.city}</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">Par: {annonce.parentName}</p>
            <div className="flex gap-2 mt-3">
              {annonce.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(annonce._id, 'approved')} className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                    <CheckCircle size={16} /> Valider
                  </button>
                  <button onClick={() => updateStatus(annonce._id, 'rejected')} className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                    <XCircle size={16} /> Refuser
                  </button>
                </>
              )}
              <button onClick={() => deleteAnnonce(annonce._id)} className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                <Trash2 size={16} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}