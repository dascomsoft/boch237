
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












// 'use client';

// import {
//   Home,
//   LayoutDashboard,
//   MessageCircle,
//   User
// } from 'lucide-react';
// import { usePathname, useRouter } from 'next/navigation';

// interface NavItem {
//   icon: typeof Home;
//   label: string;
//   path: string;
//   roles?: Array<'parent' | 'tutor' | 'admin'>;
// }

// interface MobileNavProps {
//   userRole?: 'parent' | 'tutor' | 'admin';
// }

// const navItems: NavItem[] = [
//   {
//     icon: Home,
//     label: 'Accueil',
//     path: '/home',
//     roles: ['parent', 'tutor']
//   },
//   {
//     icon: MessageCircle,
//     label: 'Messages',
//     path: '/chat',
//     roles: ['parent', 'tutor', 'admin']
//   },
//   {
//     icon: User,
//     label: 'Profil',
//     path: '/profile',
//     roles: ['parent', 'tutor']
//   },
//   {
//     icon: LayoutDashboard,
//     label: 'Admin',
//     path: '/admin',
//     roles: ['admin']
//   }
// ];

// export default function MobileNav({ userRole }: MobileNavProps) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const filteredItems = navItems.filter(
//     (item) =>
//       !item.roles || (userRole && item.roles.includes(userRole))
//   );

//   const isItemActive = (path: string) => {
//     if (path === '/home') {
//       return pathname === '/' || pathname === '/home';
//     }

//     return pathname === path || pathname.startsWith(`${path}/`);
//   };

//   if (filteredItems.length === 0) return null;

//   return (
//     <nav
//       aria-label="Navigation principale"
//       className="
//         fixed inset-x-0 bottom-0 z-50
//         border-t border-white/[0.08]
//         bg-slate-950/90
//         shadow-[0_-12px_40px_rgba(0,0,0,0.35)]
//         backdrop-blur-2xl
//         md:bottom-5 md:left-1/2 md:right-auto
//         md:w-auto md:-translate-x-1/2
//         md:rounded-2xl md:border
//         md:border-white/[0.1]
//         md:bg-slate-900/90
//         md:p-1.5
//         md:shadow-2xl md:shadow-black/40
//         lg:bottom-7
//       "
//     >
//       <div
//         className="
//           mx-auto flex w-full max-w-lg items-center justify-around
//           px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2
//           md:max-w-none md:justify-center md:gap-1 md:p-0
//         "
//       >
//         {filteredItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = isItemActive(item.path);

//           return (
//             <button
//               key={item.path}
//               type="button"
//               aria-label={item.label}
//               aria-current={isActive ? 'page' : undefined}
//               onClick={() => router.push(item.path)}
//               className={`
//                 group relative flex min-w-[72px] flex-col items-center
//                 justify-center gap-1 rounded-xl px-3 py-2
//                 transition-all duration-200
//                 focus-visible:outline-none
//                 focus-visible:ring-2
//                 focus-visible:ring-emerald-400/80
//                 active:scale-95
//                 md:min-w-24 md:flex-row md:gap-2.5
//                 md:px-4 md:py-3
//                 ${
//                   isActive
//                     ? 'bg-emerald-400/10 text-emerald-400 md:bg-emerald-500 md:text-slate-950 md:shadow-lg md:shadow-emerald-950/30'
//                     : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-200'
//                 }
//               `}
//             >
//               {/* Indicateur actif mobile */}
//               {isActive && (
//                 <span
//                   aria-hidden="true"
//                   className="
//                     absolute -top-2 h-0.5 w-8 rounded-full
//                     bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]
//                     md:hidden
//                   "
//                 />
//               )}

//               <span className="relative">
//                 <Icon
//                   size={21}
//                   strokeWidth={isActive ? 2.5 : 2}
//                   className="transition-transform duration-200 group-hover:-translate-y-0.5 md:group-hover:translate-y-0"
//                 />

//                 {/* Point décoratif actif */}
//                 {isActive && (
//                   <span
//                     aria-hidden="true"
//                     className="
//                       absolute -right-1 -top-0.5 h-1.5 w-1.5
//                       rounded-full bg-emerald-300
//                       ring-2 ring-slate-950
//                       md:hidden
//                     "
//                   />
//                 )}
//               </span>

//               <span
//                 className={`
//                   text-[10px] leading-none tracking-tight
//                   md:text-sm md:font-semibold
//                   ${
//                     isActive
//                       ? 'font-bold'
//                       : 'font-medium'
//                   }
//                 `}
//               >
//                 {item.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }




















// 'use client';

// import { useState } from 'react';
// import {
//   Home,
//   LayoutDashboard,
//   Menu,
//   MessageCircle,
//   User,
//   X,
// } from 'lucide-react';
// import { usePathname, useRouter } from 'next/navigation';

// interface NavItem {
//   icon: typeof Home;
//   label: string;
//   path: string;
//   roles?: Array<'parent' | 'tutor' | 'admin'>;
// }

// interface MobileNavProps {
//   userRole?: 'parent' | 'tutor' | 'admin';
// }

// const navItems: NavItem[] = [
//   {
//     icon: Home,
//     label: 'Accueil',
//     path: '/home',
//     roles: ['parent', 'tutor'],
//   },
//   {
//     icon: MessageCircle,
//     label: 'Messages',
//     path: '/chat',
//     roles: ['parent', 'tutor', 'admin'],
//   },
//   {
//     icon: User,
//     label: 'Profil',
//     path: '/profile',
//     roles: ['parent', 'tutor'],
//   },
//   {
//     icon: LayoutDashboard,
//     label: 'Admin',
//     path: '/admin',
//     roles: ['admin'],
//   },
// ];

// export default function MobileNav({ userRole }: MobileNavProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const filteredItems = navItems.filter(
//     (item) =>
//       !item.roles || (userRole && item.roles.includes(userRole))
//   );

//   const isItemActive = (path: string) => {
//     if (path === '/home') {
//       return pathname === '/' || pathname === '/home';
//     }

//     return pathname === path || pathname.startsWith(`${path}/`);
//   };

//   if (filteredItems.length === 0) return null;

//   const handleNavigate = (path: string) => {
//     router.push(path);
//     setIsOpen(false);
//   };

//   return (
//     <>
//       {/* Bouton toggle (mobile uniquement) */}
//       <button
//         type="button"
//         onClick={() => setIsOpen((v) => !v)}
//         aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
//         aria-expanded={isOpen}
//         aria-controls="main-mobile-nav"
//         className="
//           fixed right-4 top-4 z-[60]
//           flex h-11 w-11 items-center justify-center
//           rounded-2xl border border-white/10
//           bg-slate-900/90 text-slate-200
//           shadow-lg shadow-black/30 backdrop-blur-xl
//           transition hover:bg-slate-800 hover:text-white
//           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80
//           active:scale-95
//           md:hidden
//         "
//       >
//         {isOpen ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       {/* Backdrop mobile */}
//       {isOpen && (
//         <div
//           aria-hidden="true"
//           onClick={() => setIsOpen(false)}
//           className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
//         />
//       )}

//       {/* Navigation */}
//       <nav
//         id="main-mobile-nav"
//         aria-label="Navigation principale"
//         className={`
//           fixed inset-x-0 top-0 z-50
//           border-b border-white/[0.08]
//           bg-slate-950/90
//           shadow-[0_12px_40px_rgba(0,0,0,0.35)]
//           backdrop-blur-2xl
//           transition-all duration-300 ease-out

//           /* Mobile : caché par défaut, glisse depuis le haut quand ouvert */
//           ${
//             isOpen
//               ? 'translate-y-0 opacity-100'
//               : '-translate-y-full opacity-0 pointer-events-none'
//           }

//           /* Desktop : toujours visible */
//           md:translate-y-0 md:opacity-100 md:pointer-events-auto
//         `}
//       >
//         <div
//           className="
//             mx-auto flex w-full max-w-lg items-center justify-around
//             px-2 py-2
//             md:max-w-4xl md:justify-center md:gap-1 md:py-2
//           "
//         >
//           {filteredItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = isItemActive(item.path);

//             return (
//               <button
//                 key={item.path}
//                 type="button"
//                 aria-label={item.label}
//                 aria-current={isActive ? 'page' : undefined}
//                 onClick={() => handleNavigate(item.path)}
//                 className={`
//                   group relative flex min-w-[72px] flex-col items-center
//                   justify-center gap-1 rounded-xl px-3 py-2
//                   transition-all duration-200
//                   focus-visible:outline-none
//                   focus-visible:ring-2
//                   focus-visible:ring-emerald-400/80
//                   active:scale-95
//                   md:min-w-24 md:flex-row md:gap-2.5
//                   md:px-4 md:py-2.5
//                   ${
//                     isActive
//                       ? 'bg-emerald-400/10 text-emerald-400 md:bg-emerald-500 md:text-slate-950 md:shadow-lg md:shadow-emerald-950/30'
//                       : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-200'
//                   }
//                 `}
//               >
//                 {/* Indicateur actif mobile (barre en bas de l'item) */}
//                 {isActive && (
//                   <span
//                     aria-hidden="true"
//                     className="
//                       absolute -bottom-2 h-0.5 w-8 rounded-full
//                       bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]
//                       md:hidden
//                     "
//                   />
//                 )}

//                 <span className="relative">
//                   <Icon
//                     size={21}
//                     strokeWidth={isActive ? 2.5 : 2}
//                     className="transition-transform duration-200 group-hover:-translate-y-0.5 md:group-hover:translate-y-0"
//                   />

//                   {/* Point décoratif actif */}
//                   {isActive && (
//                     <span
//                       aria-hidden="true"
//                       className="
//                         absolute -right-1 -top-0.5 h-1.5 w-1.5
//                         rounded-full bg-emerald-300
//                         ring-2 ring-slate-950
//                         md:hidden
//                       "
//                     />
//                   )}
//                 </span>

//                 <span
//                   className={`
//                     text-[10px] leading-none tracking-tight
//                     md:text-sm md:font-semibold
//                     ${isActive ? 'font-bold' : 'font-medium'}
//                   `}
//                 >
//                   {item.label}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </nav>
//     </>
//   );
// }
































// 'use client';

// import { useState } from 'react';
// import {
//   BookOpen,
//   Home,
//   LayoutDashboard,
//   Menu,
//   MessageCircle,
//   User,
//   X,
// } from 'lucide-react';
// import { usePathname, useRouter } from 'next/navigation';

// interface NavItem {
//   icon: typeof Home;
//   label: string;
//   path: string;
//   roles?: Array<'parent' | 'tutor' | 'admin'>;
// }

// interface MobileNavProps {
//   userRole?: 'parent' | 'tutor' | 'admin';
// }

// const navItems: NavItem[] = [
//   {
//     icon: Home,
//     label: 'Accueil',
//     path: '/home',
//     roles: ['parent', 'tutor'],
//   },
//   {
//     icon: MessageCircle,
//     label: 'Messages',
//     path: '/chat',
//     roles: ['parent', 'tutor', 'admin'],
//   },
//   {
//     icon: User,
//     label: 'Profil',
//     path: '/profile',
//     roles: ['parent', 'tutor'],
//   },
//   {
//     icon: LayoutDashboard,
//     label: 'Admin',
//     path: '/admin',
//     roles: ['admin'],
//   },
// ];

// export default function MobileNav({ userRole }: MobileNavProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const filteredItems = navItems.filter(
//     (item) =>
//       !item.roles || (userRole && item.roles.includes(userRole))
//   );

//   const isItemActive = (path: string) => {
//     if (path === '/home') {
//       return pathname === '/' || pathname === '/home';
//     }

//     return pathname === path || pathname.startsWith(`${path}/`);
//   };

//   if (filteredItems.length === 0) return null;

//   const handleNavigate = (path: string) => {
//     router.push(path);
//     setIsOpen(false);
//   };

//   return (
//     <>{/* ============================================================
//     HAMBURGER FLOTTANT — MOBILE UNIQUEMENT
//     Positionné à DROITE, sous la barre utilitaire.
// ============================================================= */}
// <button
//   type="button"
//   onClick={() => setIsOpen(true)}
//   aria-label="Ouvrir le menu"
//   aria-expanded={isOpen}
//   aria-controls="primary-nav"
//   className={`
//     fixed right-3 top-4 z-[60]
//     flex h-11 w-11 items-center justify-center
//     rounded-xl border border-white/[0.08]
//     bg-slate-900/95 text-slate-200
//     shadow-lg shadow-black/40 backdrop-blur-xl
//     transition-all duration-200 ease-out
//     hover:bg-slate-800 hover:text-white
//     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80
//     active:scale-95
//     md:hidden
//     ${
//       isOpen
//         ? 'pointer-events-none translate-x-3 opacity-0'
//         : 'translate-x-0 opacity-100'
//     }
//   `}
// >
//   <Menu size={20} aria-hidden="true" />
// </button>

//       {/* ============================================================
//           BACKDROP MOBILE
//       ============================================================= */}
//       {isOpen && (
//         <div
//           aria-hidden="true"
//           onClick={() => setIsOpen(false)}
//           className="
//             fixed inset-0 z-40
//             bg-black/60 backdrop-blur-sm
//             md:hidden
//           "
//         />
//       )}

//       {/* ============================================================
//           SIDEBAR VERTICALE
//       ============================================================= */}
//       <nav
//         id="primary-nav"
//         aria-label="Navigation principale"
//         className={`
//           fixed left-0 top-0 z-50
//           flex h-dvh w-64 flex-col
//           border-r border-white/[0.06]
//           bg-slate-950/95 backdrop-blur-2xl
//           shadow-2xl shadow-black/40
//           transition-transform duration-300 ease-out

//           ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//           md:translate-x-0
//         `}
//       >
//         {/* ---------- Header : brand + croix (mobile) ---------- */}
//         <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] px-4">
//           <button
//             type="button"
//             onClick={() => handleNavigate('/home')}
//             aria-label="Retour à l'accueil"
//             className="
//               flex min-w-0 items-center gap-2.5 rounded-xl
//               transition
//               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80
//               active:scale-[0.98]
//             "
//           >
//             <span
//               className="
//                 flex h-10 w-10 shrink-0 items-center justify-center
//                 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600
//                 shadow-lg shadow-emerald-500/20
//               "
//             >
//               <BookOpen
//                 size={20}
//                 className="text-slate-950"
//                 aria-hidden="true"
//               />
//             </span>

//             <span className="truncate text-lg font-extrabold tracking-tight text-white">
//               Boch<span className="text-emerald-400">237</span>
//             </span>
//           </button>

//           {/* Croix fermer — mobile uniquement, DANS la sidebar */}
//           <button
//             type="button"
//             onClick={() => setIsOpen(false)}
//             aria-label="Fermer le menu"
//             className="
//               flex h-9 w-9 shrink-0 items-center justify-center
//               rounded-xl border border-white/[0.08] bg-white/[0.04]
//               text-slate-400 transition
//               hover:bg-white/[0.08] hover:text-white
//               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80
//               active:scale-95
//               md:hidden
//             "
//           >
//             <X size={17} aria-hidden="true" />
//           </button>
//         </div>

//         {/* ---------- Items ---------- */}
//         <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
//           {filteredItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = isItemActive(item.path);

//             return (
//               <li key={item.path}>
//                 <button
//                   type="button"
//                   onClick={() => handleNavigate(item.path)}
//                   aria-current={isActive ? 'page' : undefined}
//                   className={`
//                     group relative flex w-full items-center gap-3
//                     rounded-xl px-3 py-2.5 text-sm font-semibold
//                     transition
//                     focus-visible:outline-none
//                     focus-visible:ring-2 focus-visible:ring-emerald-400/80
//                     ${
//                       isActive
//                         ? 'bg-emerald-400/10 text-emerald-300'
//                         : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
//                     }
//                   `}
//                 >
//                   {/* Indicateur actif à gauche */}
//                   {isActive && (
//                     <span
//                       aria-hidden="true"
//                       className="
//                         absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2
//                         rounded-r-full bg-emerald-400
//                         shadow-[0_0_10px_rgba(52,211,153,0.8)]
//                       "
//                     />
//                   )}

//                   <span
//                     className={`
//                       flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
//                       ${
//                         isActive
//                           ? 'bg-emerald-400/15 text-emerald-300'
//                           : 'bg-white/[0.04] text-slate-400 group-hover:text-white'
//                       }
//                     `}
//                   >
//                     <Icon
//                       size={17}
//                       strokeWidth={isActive ? 2.5 : 2}
//                       aria-hidden="true"
//                     />
//                   </span>

//                   <span className="flex-1 text-left">
//                     {item.label}
//                   </span>

//                   {isActive && (
//                     <span
//                       aria-hidden="true"
//                       className="
//                         h-1.5 w-1.5 rounded-full bg-emerald-400
//                         shadow-[0_0_8px_rgba(52,211,153,0.8)]
//                       "
//                     />
//                   )}
//                 </button>
//               </li>
//             );
//           })}
//         </ul>

//         {/* ---------- Footer ---------- */}
//         <div className="shrink-0 border-t border-white/[0.06] px-5 py-4">
//           <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
//             Boch237
//           </p>
//           <p className="mt-1 text-xs text-slate-500">
//             Trouvez votre répétiteur
//           </p>
//         </div>
//       </nav>
//     </>
//   );
// }





































'use client';

import {
  BookOpen,
  Home,
  LayoutDashboard,
  MessageCircle,
  User,
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
    roles: ['parent', 'tutor'],
  },
  {
    icon: MessageCircle,
    label: 'Messages',
    path: '/chat',
    roles: ['parent', 'tutor', 'admin'],
  },
  {
    icon: User,
    label: 'Profil',
    path: '/profile',
    roles: ['parent', 'tutor'],
  },
  {
    icon: LayoutDashboard,
    label: 'Admin',
    path: '/admin',
    roles: ['admin'],
  },
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

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* ============================================================
          SIDEBAR VERTICALE — DESKTOP UNIQUEMENT (md+)
      ============================================================= */}
      <nav
        id="primary-nav"
        aria-label="Navigation principale"
        className="
          fixed left-0 top-0 z-50
          hidden h-dvh w-64 flex-col
          border-r border-white/[0.06]
          bg-slate-950/95 backdrop-blur-2xl
          shadow-2xl shadow-black/40
          md:flex
        "
      >
        {/* ---------- Brand ---------- */}
        <div className="flex h-16 shrink-0 items-center border-b border-white/[0.06] px-4">
          <button
            type="button"
            onClick={() => handleNavigate('/home')}
            aria-label="Retour à l'accueil"
            className="
              flex min-w-0 items-center gap-2.5 rounded-xl
              transition
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80
              active:scale-[0.98]
            "
          >
            <span
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600
                shadow-lg shadow-emerald-500/20
              "
            >
              <BookOpen
                size={20}
                className="text-slate-950"
                aria-hidden="true"
              />
            </span>

            <span className="truncate text-lg font-extrabold tracking-tight text-white">
              Boch<span className="text-emerald-400">237</span>
            </span>
          </button>
        </div>

        {/* ---------- Items ---------- */}
        <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.path);

            return (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    group relative flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5 text-sm font-semibold
                    transition
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-emerald-400/80
                    ${
                      isActive
                        ? 'bg-emerald-400/10 text-emerald-300'
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                    }
                  `}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                        absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2
                        rounded-r-full bg-emerald-400
                        shadow-[0_0_10px_rgba(52,211,153,0.8)]
                      "
                    />
                  )}

                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                      ${
                        isActive
                          ? 'bg-emerald-400/15 text-emerald-300'
                          : 'bg-white/[0.04] text-slate-400 group-hover:text-white'
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.5 : 2}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="flex-1 text-left">
                    {item.label}
                  </span>

                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                        h-1.5 w-1.5 rounded-full bg-emerald-400
                        shadow-[0_0_8px_rgba(52,211,153,0.8)]
                      "
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* ---------- Footer ---------- */}
        <div className="shrink-0 border-t border-white/[0.06] px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
            Boch237
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Trouvez votre répétiteur
          </p>
        </div>
      </nav>

      {/* ============================================================
          BOTTOM NAVIGATION BAR — MOBILE UNIQUEMENT (md-)
      ============================================================= */}
      <nav
        aria-label="Navigation principale mobile"
        className="
          fixed inset-x-0 bottom-0 z-50
          border-t border-white/[0.08]
          bg-slate-950/95 backdrop-blur-2xl
          shadow-[0_-12px_40px_rgba(0,0,0,0.4)]
          md:hidden
        "
      >
        <ul
          className="
            mx-auto flex w-full max-w-lg items-stretch justify-around
            px-2 pt-2
            pb-[max(0.5rem,env(safe-area-inset-bottom))]
          "
        >
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.path);

            return (
              <li key={item.path} className="flex-1">
                <button
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  className={`
                    group relative flex w-full flex-col items-center justify-center
                    gap-1 rounded-xl px-2 py-2
                    transition
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-emerald-400/80
                    active:scale-95
                    ${
                      isActive
                        ? 'text-emerald-300'
                        : 'text-slate-500 hover:text-slate-200'
                    }
                  `}
                >
                  {/* Indicateur actif — petit trait en haut */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                        absolute -top-2 h-0.5 w-8 rounded-full
                        bg-emerald-400
                        shadow-[0_0_10px_rgba(52,211,153,0.8)]
                      "
                    />
                  )}

                  <span
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-xl
                      transition
                      ${
                        isActive
                          ? 'bg-emerald-400/15 text-emerald-300'
                          : 'bg-transparent text-slate-500 group-hover:bg-white/[0.05] group-hover:text-slate-200'
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.5 : 2}
                      aria-hidden="true"
                    />
                  </span>

                  <span
                    className={`
                      text-[10px] leading-none tracking-tight
                      ${isActive ? 'font-bold' : 'font-medium'}
                    `}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}