
// 'use client';
// import { Home, MessageCircle, User, LayoutDashboard } from 'lucide-react';
// import { usePathname, useRouter } from 'next/navigation';

// interface NavItem {
//   icon: typeof Home;
//   label: string;
//   path: string;
//   roles?: ('parent' | 'tutor' | 'admin')[];
// }

// interface MobileNavProps {
//   userRole?: 'parent' | 'tutor' | 'admin';
// }

// export default function MobileNav({ userRole }: MobileNavProps) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const navItems: NavItem[] = [
//     { icon: Home, label: 'Accueil', path: '/home', roles: ['parent', 'tutor'] },
//     { icon: MessageCircle, label: 'Messages', path: '/chat', roles: ['parent', 'tutor', 'admin'] },
//     { icon: User, label: 'Profil', path: '/profile', roles: ['parent', 'tutor'] },
//     { icon: LayoutDashboard, label: 'Admin', path: '/admin', roles: ['admin'] },
//   ];

//   const filteredItems = navItems.filter(item => 
//     !item.roles || (userRole && item.roles.includes(userRole))
//   );

//   if (filteredItems.length === 0) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-green-500 z-50 max-w-4xl mx-auto">
//       <div className="flex justify-around p-3 max-w-md mx-auto">
//         {filteredItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.path || (item.path === '/home' && pathname === '/');
          
//           return (
//             <button
//               key={item.path}
//               onClick={() => router.push(item.path)}
//               className="relative flex flex-col items-center gap-1 transition-colors"
//             >
//               <Icon size={24} className={isActive ? 'text-green-500' : 'text-gray-400 hover:text-green-400'} />
//               <span className={`text-xs ${isActive ? 'text-green-500' : 'text-gray-400'}`}>{item.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }












'use client';

import {
  Home,
  LayoutDashboard,
  MessageCircle,
  User
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  roles?: Array<'parent' | 'tutor' | 'admin'>;
}

interface MobileNavProps {
  userRole?: 'parent' | 'tutor' | 'admin';
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'Accueil',
    path: '/home',
    roles: ['parent', 'tutor']
  },
  {
    icon: MessageCircle,
    label: 'Messages',
    path: '/chat',
    roles: ['parent', 'tutor', 'admin']
  },
  {
    icon: User,
    label: 'Profil',
    path: '/profile',
    roles: ['parent', 'tutor']
  },
  {
    icon: LayoutDashboard,
    label: 'Admin',
    path: '/admin',
    roles: ['admin']
  }
];

export default function MobileNav({ userRole }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const filteredItems = navItems.filter(
    (item) =>
      !item.roles || (userRole && item.roles.includes(userRole))
  );

  const isItemActive = (path: string) => {
    if (path === '/home') {
      return pathname === '/' || pathname === '/home';
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };

  if (filteredItems.length === 0) return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="
        fixed inset-x-0 bottom-0 z-50
        border-t border-white/[0.08]
        bg-slate-950/90
        shadow-[0_-12px_40px_rgba(0,0,0,0.35)]
        backdrop-blur-2xl
        md:bottom-5 md:left-1/2 md:right-auto
        md:w-auto md:-translate-x-1/2
        md:rounded-2xl md:border
        md:border-white/[0.1]
        md:bg-slate-900/90
        md:p-1.5
        md:shadow-2xl md:shadow-black/40
        lg:bottom-7
      "
    >
      <div
        className="
          mx-auto flex w-full max-w-lg items-center justify-around
          px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2
          md:max-w-none md:justify-center md:gap-1 md:p-0
        "
      >
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.path);

          return (
            <button
              key={item.path}
              type="button"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => router.push(item.path)}
              className={`
                group relative flex min-w-[72px] flex-col items-center
                justify-center gap-1 rounded-xl px-3 py-2
                transition-all duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-emerald-400/80
                active:scale-95
                md:min-w-24 md:flex-row md:gap-2.5
                md:px-4 md:py-3
                ${
                  isActive
                    ? 'bg-emerald-400/10 text-emerald-400 md:bg-emerald-500 md:text-slate-950 md:shadow-lg md:shadow-emerald-950/30'
                    : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-200'
                }
              `}
            >
              {/* Indicateur actif mobile */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="
                    absolute -top-2 h-0.5 w-8 rounded-full
                    bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]
                    md:hidden
                  "
                />
              )}

              <span className="relative">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 md:group-hover:translate-y-0"
                />

                {/* Point décoratif actif */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute -right-1 -top-0.5 h-1.5 w-1.5
                      rounded-full bg-emerald-300
                      ring-2 ring-slate-950
                      md:hidden
                    "
                  />
                )}
              </span>

              <span
                className={`
                  text-[10px] leading-none tracking-tight
                  md:text-sm md:font-semibold
                  ${
                    isActive
                      ? 'font-bold'
                      : 'font-medium'
                  }
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}