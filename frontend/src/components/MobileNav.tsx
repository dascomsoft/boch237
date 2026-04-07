'use client';
import { Search, MessageCircle, User, LayoutDashboard } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  icon: typeof Search;
  label: string;
  path: string;
  roles?: ('parent' | 'tutor' | 'admin')[];
}

export default function MobileNav({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { icon: Search, label: 'Recherche', path: '/', roles: ['parent', 'tutor'] },
    { icon: MessageCircle, label: 'Messages', path: '/chat', roles: ['parent', 'tutor', 'admin'] },
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
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-green-500' : 'text-gray-400 hover:text-green-400'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}