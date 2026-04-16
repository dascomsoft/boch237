
'use client';
import { Home, MessageCircle, User, LayoutDashboard } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  roles?: ('parent' | 'tutor' | 'admin')[];
}

interface MobileNavProps {
  userRole?: 'parent' | 'tutor' | 'admin';
}

export default function MobileNav({ userRole }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { icon: Home, label: 'Accueil', path: '/home', roles: ['parent', 'tutor'] },
    { icon: MessageCircle, label: 'Messages', path: '/chat', roles: ['parent', 'tutor', 'admin'] },
    { icon: User, label: 'Profil', path: '/profile', roles: ['parent', 'tutor'] },
    { icon: LayoutDashboard, label: 'Admin', path: '/admin', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => 
    !item.roles || (userRole && item.roles.includes(userRole))
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-green-500 z-50 max-w-4xl mx-auto">
      <div className="flex justify-around p-3 max-w-md mx-auto">
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
