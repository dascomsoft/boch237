'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MobileNav from '@/components/MobileNav';
import { Users, MessageSquare, Settings, FileText, PlusCircle, UserPlus, Megaphone } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, tutors: 0, parents: 0 });
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
      const usersRes = await axios.get(`${API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = usersRes.data;
      setStats({
        users: users.length,
        tutors: users.filter((u: any) => u.role === 'tutor').length,
        parents: users.filter((u: any) => u.role === 'parent').length
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Megaphone, label: 'Gérer les annonces', href: '/admin/annonces', color: 'bg-blue-600', description: 'Valider, modifier ou supprimer' },
    { icon: PlusCircle, label: 'Ajouter une annonce', href: '/admin/annonces/ajouter', color: 'bg-green-600', description: 'Pour un parent' },
    { icon: Users, label: 'Gérer les répétiteurs', href: '/admin/tuteurs', color: 'bg-purple-600', description: 'Voir la liste' },
    { icon: UserPlus, label: 'Ajouter un répétiteur', href: '/admin/tuteurs/ajouter', color: 'bg-orange-600', description: 'Ajouter manuellement' },
    { icon: FileText, label: 'Voir les annonces', href: '/annonces', color: 'bg-teal-600', description: 'Site public' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="bg-green-600 p-4">
        <h1 className="text-white text-xl font-bold text-center">Dashboard Administrateur</h1>
      </div>

      <div className="p-4">
        <h2 className="text-white font-bold mb-3 flex items-center gap-2">
          <Settings size={18} className="text-green-400" />
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`${item.color} p-4 rounded-xl flex items-center gap-3 text-left transition-all hover:scale-102 w-full`}
            >
              <item.icon size={24} className="text-white" />
              <div className="flex-1">
                <span className="text-white font-medium block">{item.label}</span>
                <span className="text-white/70 text-xs">{item.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-white font-bold mb-3">Statistiques</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <Users className="text-green-400 mx-auto mb-2" size={24} />
            <p className="text-2xl text-white font-bold">{stats.users}</p>
            <p className="text-gray-400 text-sm">Utilisateurs</p>
            <div className="flex justify-center gap-2 mt-2 text-xs">
              <span className="text-green-400">{stats.tutors} tuteurs</span>
              <span className="text-blue-400">{stats.parents} parents</span>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <MessageSquare className="text-green-400 mx-auto mb-2" size={24} />
            <p className="text-2xl text-white font-bold">-</p>
            <p className="text-gray-400 text-sm">Conversations</p>
          </div>
        </div>
      </div>

      <MobileNav userRole="admin" />
    </div>
  );
}