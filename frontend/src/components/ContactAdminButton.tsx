
'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MessageCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';

// ⚠️ Remplace par l'ID de l'admin que tu as récupéré à l'étape 1
const ADMIN_ID = '69d417d3b7cfd4baa3c77ab0';

export default function ContactAdminButton() {
  const router = useRouter();

  const contactAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `${API_URL}/users/conversation`,
        { tutorId: ADMIN_ID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      router.push(`/chat?convId=${response.data._id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Impossible de contacter l\'administrateur');
    }
  };

  return (
    <button
      onClick={contactAdmin}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
    >
      <MessageCircle size={20} />
      Contacter l'administrateur
    </button>
  );
}
