
// 'use client';
// import { Search, MessageCircle, User, LayoutDashboard, Home } from 'lucide-react';
// import { usePathname, useRouter } from 'next/navigation';

// interface NavItem {
//   icon: typeof Search;
//   label: string;
//   path: string;
//   roles?: ('parent' | 'tutor' | 'admin')[];
// }

// export default function MobileNav({ userRole }: { userRole?: string }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const navItems: NavItem[] = [
//     { icon: Home, label: 'Accueil', path: '/home', roles: ['parent', 'tutor'] },
//     { icon: MessageCircle, label: 'Messages', path: '/chat', roles: ['parent', 'tutor', 'admin'] },
//     { icon: User, label: 'Profil', path: '/profile', roles: ['parent', 'tutor'] },
//     { icon: LayoutDashboard, label: 'Admin', path: '/admin', roles: ['admin'] },
//   ];

//   const filteredItems = navItems.filter(item => 
//     !item.roles || (userRole && item.roles.includes(userRole as any))
//   );

//   if (filteredItems.length === 0) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-green-500 max-w-md mx-auto z-50">
//       <div className="flex justify-around p-3">
//         {filteredItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.path || (item.path === '/home' && pathname === '/');
          
//           return (
//             <button
//               key={item.path}
//               onClick={() => router.push(item.path)}
//               className={`flex flex-col items-center gap-1 transition-colors ${
//                 isActive ? 'text-green-500' : 'text-gray-400 hover:text-green-400'
//               }`}
//             >
//               <Icon size={24} />
//               <span className="text-xs">{item.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }




























































































































'use client';
import { Home, MessageCircle, User, LayoutDashboard } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/api';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  roles?: ('parent' | 'tutor' | 'admin')[];
  badge?: boolean;
}

export default function MobileNav({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get(`${API_URL}/users/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadMessages(response.data.unreadCount);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { icon: Home, label: 'Accueil', path: '/home', roles: ['parent', 'tutor'] },
    { icon: MessageCircle, label: 'Messages', path: '/chat', roles: ['parent', 'tutor', 'admin'], badge: true },
    { icon: User, label: 'Profil', path: '/profile', roles: ['parent', 'tutor'] },
    { icon: LayoutDashboard, label: 'Admin', path: '/admin', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => 
    !item.roles || (userRole && item.roles.includes(userRole as any))
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-green-500 max-w-md mx-auto z-50">
      <div className="flex justify-around p-3">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/home' && pathname === '/');
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center gap-1 transition-colors"
            >
              <Icon size={24} className={isActive ? 'text-green-500' : 'text-gray-400 hover:text-green-400'} />
              <span className={`text-xs ${isActive ? 'text-green-500' : 'text-gray-400'}`}>{item.label}</span>
              {item.badge && unreadMessages > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}