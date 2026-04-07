

'use client';
import { MessageCircle, MapPin, BookOpen, CheckCircle, XCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User as UserType } from '@/types';

interface TutorCardProps {
  tutor: UserType;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const router = useRouter();

  const startChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5001/api/users/conversation',
        { tutorId: tutor._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      router.push(`/chat?convId=${response.data._id}`);
    } catch (error) {
      console.error('Erreur lors du démarrage du chat:', error);
    }
  };

  const viewProfile = () => {
    router.push(`/profile/${tutor._id}`);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30 hover:border-green-500 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">{tutor.name}</h3>
          <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
            <MapPin size={14} /> {tutor.city} - {tutor.district || 'Quartier non spécifié'}
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
          tutor.isActive ? 'bg-green-600' : 'bg-gray-600'
        }`}>
          {tutor.isActive ? (
            <>
              <CheckCircle size={10} /> Actif
            </>
          ) : (
            <>
              <XCircle size={10} /> Indisponible
            </>
          )}
        </div>
      </div>
      
      {tutor.subjects && tutor.subjects.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tutor.subjects.slice(0, 3).map((subject, index) => (
            <span key={index} className="bg-green-600/20 text-green-400 px-2 py-1 rounded-lg text-xs">
              {subject}
            </span>
          ))}
          {tutor.subjects.length > 3 && (
            <span className="bg-slate-700 text-gray-400 px-2 py-1 rounded-lg text-xs">
              +{tutor.subjects.length - 3}
            </span>
          )}
        </div>
      )}
      
      <div className="mt-3 flex gap-2">
        <button 
          onClick={startChat}
          disabled={!tutor.isActive}
          className={`flex-1 text-white p-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
            tutor.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
          } transition-colors`}
        >
          <MessageCircle size={16} /> Démarrer le chat
        </button>
        <button 
          onClick={viewProfile}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <User size={16} /> Voir profil
        </button>
      </div>
    </div>
  );
}
