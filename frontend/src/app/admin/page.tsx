
'use client';
import { useRouter } from 'next/navigation';
import MobileNav from '@/components/MobileNav';
import { Settings, FileText, PlusCircle, UserPlus, Megaphone, Users, MessageSquare } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  const menuItems = [
    { icon: Megaphone, label: 'Gérer les annonces', href: '/admin/annonces', color: 'bg-blue-600', description: 'Valider, modifier ou supprimer' },
    { icon: PlusCircle, label: 'Ajouter une annonce', href: '/admin/annonces/ajouter', color: 'bg-green-600', description: 'Pour un parent' },
    { icon: Users, label: 'Gérer les répétiteurs', href: '/admin/tuteurs', color: 'bg-purple-600', description: 'Voir la liste' },
    { icon: UserPlus, label: 'Ajouter un répétiteur', href: '/admin/tuteurs/ajouter', color: 'bg-orange-600', description: 'Ajouter manuellement' },
    { icon: FileText, label: 'Voir les annonces', href: '/annonces', color: 'bg-teal-600', description: 'Site public' },
  ];

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
        <h2 className="text-white font-bold mb-3">Accès rapide</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <Users className="text-green-400 mx-auto mb-2" size={24} />
            <p className="text-gray-400 text-sm">Gestion des utilisateurs</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <MessageSquare className="text-green-400 mx-auto mb-2" size={24} />
            <p className="text-gray-400 text-sm">Modération des annonces</p>
          </div>
        </div>
      </div>

      <MobileNav userRole="admin" />
    </div>
  );
}
