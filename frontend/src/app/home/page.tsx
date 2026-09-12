// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import SearchBar from '@/components/SearchBar';
// import TutorCard from '@/components/TutorCard';
// import MobileNav from '@/components/MobileNav';
// import { User, SearchFilters } from '@/types';
// import { Megaphone, PlusCircle } from 'lucide-react';
// import { API_URL } from '@/lib/api';

// export default function Home() {
//   const router = useRouter();
//   const [tutors, setTutors] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [filters, setFilters] = useState<SearchFilters>({
//     province: '',
//     city: '',
//     class: '',
//     subject: ''
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       router.push('/login');
//       return;
//     }
    
//     fetchUserProfile(token);
//     fetchAllTutors();
//     setIsCheckingAuth(false);
//   }, []);

//   const fetchUserProfile = async (token: string) => {
//     try {
//       const response = await axios.get(`${API_URL}/users/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUser(response.data);
//     } catch (error) {
//       console.error('Erreur profil:', error);
//       localStorage.removeItem('token');
//       router.push('/login');
//     }
//   };

//   const fetchAllTutors = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/users/tutors`);
//       setTutors(response.data);
//     } catch (error) {
//       console.error('Erreur chargement:', error);
//     }
//   };

//   const searchTutors = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/users/tutors`, {
//         params: filters
//       });
//       setTutors(response.data);
//     } catch (error) {
//       console.error('Erreur recherche:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-900 pb-20">
      
//       {/* HEADER */}
//       <div className="bg-green-600 px-4 py-3 sticky top-0 z-10 shadow-md">
//         <h1 className="text-base font-semibold text-white text-center tracking-tight">
//           📚 Boch237
//         </h1>
//         {user && (
//           <p className="text-green-100 text-xs text-center mt-0.5">
//             Bonjour {user.name} 👋
//           </p>
//         )}
//       </div>

//       {/* CTA PARENT */}
//       {user && user.role === 'parent' && (
//         <div className="px-4 pt-4">
//           <button
//             onClick={() => router.push('/annonces/creer')}
//             className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white py-2.5 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition shadow"
//           >
//             <Megaphone size={16} />
//             Publier une annonce
//             <PlusCircle size={14} />
//           </button>

//           <p className="text-gray-500 text-[11px] text-center mt-1.5">
//             Trouvez rapidement un répétiteur qualifié
//           </p>
//         </div>
//       )}

//       {/* SEARCH */}
//       <div className="px-4 mt-3">
//         <div className="bg-slate-800 rounded-lg p-3 shadow-sm">
//           <SearchBar 
//             filters={filters}
//             onFilterChange={setFilters}
//             onSearch={searchTutors}
//             isLoading={loading}
//           />
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="px-4 mt-4">
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-white font-semibold text-sm">
//             Répétiteurs ({tutors.length})
//           </h2>

//           {user && user.role === 'parent' && (
//             <button 
//               onClick={() => router.push('/annonces')}
//               className="text-green-400 text-xs hover:underline"
//             >
//               Voir annonces →
//             </button>
//           )}
//         </div>
        
//         {loading ? (
//           <div className="text-center text-gray-400 py-8">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
//             <p className="mt-2 text-sm">Recherche...</p>
//           </div>
//         ) : tutors.length === 0 ? (
//           <div className="text-center text-gray-400 py-8 bg-slate-800 rounded-lg">
//             <p className="text-sm">Aucun répétiteur trouvé</p>
//             <p className="text-xs mt-1">Essayez d'autres filtres</p>

//             {user && user.role === 'parent' && (
//               <button
//                 onClick={() => router.push('/annonces/creer')}
//                 className="mt-3 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs"
//               >
//                 Publier une annonce
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-2">
//             {tutors.map((tutor) => (
//               <TutorCard key={tutor._id} tutor={tutor} />
//             ))}
//           </div>
//         )}
//       </div>

//       <MobileNav userRole={user?.role} />
//     </div>
//   );
// }











































































































































'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Megaphone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';

import SearchBar from '@/components/SearchBar';
import TutorCard from '@/components/TutorCard';
import MobileNav from '@/components/MobileNav';
import { User, SearchFilters } from '@/types';
import { API_URL } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [filters, setFilters] = useState<SearchFilters>({
    province: '',
    city: '',
    class: '',
    subject: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserProfile(token);
    fetchAllTutors();
    setIsCheckingAuth(false);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
    } catch (error) {
      console.error('Erreur profil:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const fetchAllTutors = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/tutors`);
      setTutors(response.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const searchTutors = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/users/tutors`, {
        params: filters
      });

      setTutors(response.data);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-400" />
          </div>

          <p className="text-sm font-medium text-slate-400">
            Chargement de votre espace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white lg:pb-10">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Desktop header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-3"
          >
            {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <GraduationCap size={22} className="text-white" />
            </div> */}

            {/* <div className="text-left">
              <p className="text-lg font-bold leading-none tracking-tight">
                Boch<span className="text-emerald-400">237</span>
              </p>
              <p className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:block">
                Apprendre autrement
              </p>
            </div> */}
          </button>

          <div className="flex items-center gap-3">
            {user?.role === 'parent' && (
              <button
                onClick={() => router.push('/annonces')}
                className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 md:flex"
              >
                <Megaphone size={16} />
                Mes annonces
              </button>
            )}

            {user && (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-2 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="max-w-32 truncate text-xs font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="text-[10px] capitalize text-slate-400">
                    {user.role === 'parent' ? 'Parent' : 'Répétiteur'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden pb-8 pt-8 sm:pt-12 lg:pb-12 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <Sparkles size={14} />
                Des répétiteurs qualifiés près de chez vous
              </div>

              <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Trouvez le bon répétiteur pour{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  progresser durablement.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base lg:text-lg">
                Recherchez selon votre ville, votre classe et votre matière.
                Entrez directement en relation avec le profil adapté à vos
                besoins.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400 sm:text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-emerald-400" />
                  Profils accessibles
                </div>

                <div className="flex items-center gap-2">
                  <Search size={17} className="text-emerald-400" />
                  Recherche rapide
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen size={17} className="text-emerald-400" />
                  Toutes les matières
                </div>
              </div>
            </div>

            {/* Parent CTA */}
            {user?.role === 'parent' && (
              <div className="relative hidden lg:block">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-xl" />

                <div className="relative rounded-3xl border border-white/10 bg-slate-900/90 p-7 shadow-2xl backdrop-blur">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
                    <Megaphone size={24} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    Besoin spécifique ?
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    Publiez votre annonce
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Décrivez votre besoin et permettez aux répétiteurs
                    disponibles de vous trouver.
                  </p>

                  <button
                    onClick={() => router.push('/annonces/creer')}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-950/40 active:translate-y-0"
                  >
                    <Plus size={18} />
                    Créer une annonce
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mobile parent CTA */}
        {user?.role === 'parent' && (
          <section className="mb-5 lg:hidden">
            <button
              onClick={() => router.push('/annonces/creer')}
              className="flex w-full items-center justify-between rounded-2xl border border-rose-400/20 bg-gradient-to-r from-rose-500/15 to-pink-500/10 p-4 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-950/30">
                  <Megaphone size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Publier une annonce
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Trouvez rapidement un répétiteur
                  </p>
                </div>
              </div>

              <ArrowRight size={18} className="shrink-0 text-rose-300" />
            </button>
          </section>
        )}

        {/* Search panel */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6 lg:rounded-3xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Search size={18} className="text-emerald-400" />
                <h2 className="font-semibold text-white sm:text-lg">
                  Rechercher un répétiteur
                </h2>
              </div>

              <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                Affinez les résultats selon vos critères.
              </p>
            </div>

            <div className="hidden rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:block">
              {tutors.length} profil{tutors.length > 1 ? 's' : ''}
            </div>
          </div>

          <SearchBar
            filters={filters}
            onFilterChange={setFilters}
            onSearch={searchTutors}
            isLoading={loading}
          />
        </section>

        {/* Results */}
        <section className="pb-8 pt-8 lg:pt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Résultats
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Répétiteurs disponibles
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {tutors.length} profil{tutors.length > 1 ? 's' : ''} trouvé
                {tutors.length > 1 ? 's' : ''}
              </p>
            </div>

            {user?.role === 'parent' && (
              <button
                onClick={() => router.push('/annonces')}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 transition hover:text-emerald-300 sm:text-sm"
              >
                Voir les annonces
                <ArrowRight size={15} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/50">
              <div className="relative h-11 w-11">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/15" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-400" />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-300">
                Recherche en cours...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Nous sélectionnons les profils correspondants.
              </p>
            </div>
          ) : tutors.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <Users size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Aucun répétiteur trouvé
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Modifiez votre ville, votre matière ou votre classe pour élargir
                les résultats.
              </p>

              {user?.role === 'parent' && (
                <button
                  onClick={() => router.push('/annonces/creer')}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  <Plus size={17} />
                  Publier une annonce
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          )}
        </section>
      </main>

      <MobileNav userRole={user?.role} />
    </div>
  );
}