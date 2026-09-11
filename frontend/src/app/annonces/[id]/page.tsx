
// // 'use client';
// // import { useState, useEffect } from 'react';
// // import { useParams, useRouter } from 'next/navigation';
// // import axios from 'axios';
// // import { MapPin, BookOpen, Clock, User, Calendar, ArrowLeft, MessageCircle } from 'lucide-react';
// // import { API_URL } from '@/lib/api';

// // interface Annonce {
// //   _id: string;
// //   title: string;
// //   description: string;
// //   subject: string;
// //   class: string;
// //   city: string;
// //   district: string;
// //   budget: string;
// //   duration: string;
// //   parentName: string;
// //   parentPhone: string;
// //   parentId?: string;
// //   status: string;
// //   createdAt: string;
// // }

// // export default function AnnonceDetailPage() {
// //   const params = useParams();
// //   const router = useRouter();
// //   const [annonce, setAnnonce] = useState<Annonce | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [user, setUser] = useState<any>(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       fetchUser(token);
// //     }
// //     fetchAnnonce();
// //   }, []);

// //   const fetchUser = async (token: string) => {
// //     try {
// //       const response = await axios.get(`${API_URL}/users/me`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       setUser(response.data);
// //     } catch (error) {
// //       console.error('Erreur:', error);
// //     }
// //   };

// //   const fetchAnnonce = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/annonces`);
// //       const found = response.data.find((a: any) => a._id === params.id);
// //       setAnnonce(found);
// //     } catch (error) {
// //       console.error('Erreur:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const startChat = async () => {
// //     if (!annonce || !annonce.parentId) {
// //       alert('Impossible de contacter ce parent');
// //       return;
// //     }
    
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) {
// //         router.push('/login');
// //         return;
// //       }
      
// //       // Créer une conversation avec le parent qui a publié l'annonce
// //       const response = await axios.post(
// //         `${API_URL}/users/conversation`,
// //         { tutorId: annonce.parentId },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       // Rediriger vers le chat
// //       router.push(`/chat?convId=${response.data._id}`);
// //     } catch (error) {
// //       console.error('Erreur:', error);
// //       alert('Impossible de contacter le parent. Veuillez réessayer.');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
// //       </div>
// //     );
// //   }

// //   if (!annonce) {
// //     return (
// //       <div className="min-h-screen bg-slate-900 p-4">
// //         <div className="text-center py-10">
// //           <p className="text-white">Annonce non trouvée</p>
// //           <button onClick={() => router.back()} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
// //             Retour
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-slate-900 pb-20">
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
// //         <button onClick={() => router.back()} className="text-white flex items-center gap-1 mb-2">
// //           <ArrowLeft size={20} /> Retour
// //         </button>
// //         <h1 className="text-white text-xl font-bold text-center">{annonce.title}</h1>
// //       </div>

// //       <div className="p-4 space-y-4">
// //         {/* Description */}
// //         <div className="bg-slate-800 rounded-xl p-4">
// //           <h2 className="text-green-400 font-bold mb-2">Description</h2>
// //           <p className="text-gray-300">{annonce.description}</p>
// //         </div>

// //         {/* Détails */}
// //         <div className="bg-slate-800 rounded-xl p-4">
// //           <h2 className="text-green-400 font-bold mb-3">Détails de l'annonce</h2>
// //           <div className="space-y-2">
// //             <div className="flex items-center gap-2 text-gray-300">
// //               <BookOpen size={16} className="text-green-400" />
// //               <span>Matière: <strong>{annonce.subject}</strong></span>
// //             </div>
// //             <div className="flex items-center gap-2 text-gray-300">
// //               <BookOpen size={16} className="text-green-400" />
// //               <span>Classe: <strong>{annonce.class}</strong></span>
// //             </div>
// //             <div className="flex items-center gap-2 text-gray-300">
// //               <MapPin size={16} className="text-green-400" />
// //               <span>Localisation: <strong>{annonce.city}</strong> {annonce.district && `- ${annonce.district}`}</span>
// //             </div>
// //             {annonce.budget && (
// //               <div className="flex items-center gap-2 text-gray-300">
// //                 <span className="text-green-400">💰</span>
// //                 <span>Budget: <strong>{annonce.budget} FCFA</strong></span>
// //               </div>
// //             )}
// //             <div className="flex items-center gap-2 text-gray-300">
// //               <Clock size={16} className="text-green-400" />
// //               <span>Fréquence: <strong>{annonce.duration}</strong></span>
// //             </div>
// //             <div className="flex items-center gap-2 text-gray-300">
// //               <Calendar size={16} className="text-green-400" />
// //               <span>Publiée le: <strong>{new Date(annonce.createdAt).toLocaleDateString()}</strong></span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Informations du parent */}
// //         <div className="bg-slate-800 rounded-xl p-4">
// //           <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
// //             <User size={16} /> Publié par
// //           </h2>
// //           <p className="text-white font-medium">{annonce.parentName}</p>
// //         </div>

// //         {/* BOUTON CONTACTER - Visible pour tous les utilisateurs connectés */}
// //         {user ? (
// //           <button
// //             onClick={startChat}
// //             className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
// //           >
// //             <MessageCircle size={18} />
// //             Contacter {annonce.parentName}
// //           </button>
// //         ) : (
// //           <div className="bg-slate-800 rounded-xl p-4 text-center">
// //             <p className="text-gray-400 text-sm">
// //               🔒 Connectez-vous pour contacter {annonce.parentName}
// //             </p>
// //             <button
// //               onClick={() => router.push('/login')}
// //               className="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
// //             >
// //               Se connecter
// //             </button>
// //           </div>
// //         )}

// //         {/* Note */}
// //         <div className="bg-blue-600/20 border border-blue-500 rounded-xl p-3">
// //           <p className="text-blue-400 text-xs text-center">
// //             ℹ️ Cette annonce a été vérifiée par notre équipe. Cliquez sur "Contacter" pour discuter avec le parent.
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }









// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios, { AxiosError } from 'axios';
// import {
//   MapPin,
//   BookOpen,
//   Clock,
//   User,
//   Calendar,
//   ArrowLeft,
//   MessageCircle,
//   Wallet,
// } from 'lucide-react';
// import { API_URL } from '@/lib/api';

// interface Annonce {
//   _id: string;
//   title: string;
//   description: string;
//   subject: string;
//   class: string;
//   city: string;
//   district: string;
//   budget: string;
//   duration: string;
//   parentName: string;
//   parentPhone: string;
//   parentId?: string;
//   status: string;
//   createdAt: string;
// }

// interface CurrentUser {
//   _id: string;
//   name?: string;
//   [key: string]: unknown;
// }

// type LoadState = 'loading' | 'success' | 'error';

// export default function AnnonceDetailPage() {
//   const params = useParams<{ id: string }>();
//   const router = useRouter();

//   const [annonce, setAnnonce] = useState<Annonce | null>(null);
//   const [loadState, setLoadState] = useState<LoadState>('loading');
//   const [user, setUser] = useState<CurrentUser | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [contactError, setContactError] = useState<string | null>(null);

//   const fetchUser = useCallback(async (token: string) => {
//     try {
//       const response = await axios.get<CurrentUser>(`${API_URL}/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(response.data);
//     } catch (error) {
//       console.error('Erreur utilisateur:', error);
//     }
//   }, []);

//   const fetchAnnonce = useCallback(async () => {
//     try {
//       const response = await axios.get<Annonce[]>(`${API_URL}/annonces`);
//       const found = response.data.find((a) => a._id === params.id);
//       setAnnonce(found ?? null);
//       setLoadState('success');
//     } catch (error) {
//       console.error('Erreur annonce:', error instanceof AxiosError ? error.message : error);
//       setLoadState('error');
//     }
//   }, [params.id]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       fetchUser(token);
//     }
//     fetchAnnonce();
//   }, [fetchUser, fetchAnnonce]);

//   const startChat = async () => {
//     if (!annonce || !annonce.parentId) {
//       setContactError("Impossible de contacter ce parent pour le moment.");
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login');
//       return;
//     }

//     setIsSubmitting(true);
//     setContactError(null);

//     try {
//       const response = await axios.post<{ _id: string }>(
//         `${API_URL}/users/conversation`,
//         { tutorId: annonce.parentId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       router.push(`/chat?convId=${response.data._id}`);
//     } catch (error) {
//       console.error('Erreur contact:', error);
//       setContactError('Impossible de contacter le parent. Veuillez réessayer.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ── Chargement ─────────────────────────────── */
//   if (loadState === 'loading') {
//     return (
//       <div
//         className="flex min-h-screen items-center justify-center bg-slate-900"
//         role="status"
//         aria-live="polite"
//       >
//         <span className="sr-only">Chargement de l'annonce…</span>
//         <div
//           className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-500"
//           aria-hidden="true"
//         />
//       </div>
//     );
//   }

//   /* ── Erreur réseau ──────────────────────────── */
//   if (loadState === 'error') {
//     return (
//       <div className="min-h-screen bg-slate-900 p-4 pt-[env(safe-area-inset-top)]">
//         <div className="py-10 text-center">
//           <h1 className="text-lg font-semibold text-white">
//             Une erreur est survenue
//           </h1>
//           <p className="mt-2 text-sm text-gray-400">
//             Impossible de charger l'annonce. Vérifiez votre connexion.
//           </p>
//           <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
//             <button
//               onClick={() => {
//                 setLoadState('loading');
//                 fetchAnnonce();
//               }}
//               className="min-h-[44px] rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
//             >
//               Réessayer
//             </button>
//             <button
//               onClick={() => router.back()}
//               className="min-h-[44px] rounded-lg border border-slate-600 px-6 py-2 font-medium text-gray-300 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
//             >
//               Retour
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ── Annonce introuvable ────────────────────── */
//   if (!annonce) {
//     return (
//       <div className="min-h-screen bg-slate-900 p-4 pt-[env(safe-area-inset-top)]">
//         <div className="py-10 text-center">
//           <h1 className="text-lg font-semibold text-white">Annonce non trouvée</h1>
//           <p className="mt-2 text-sm text-gray-400">
//             Cette annonce n'existe plus ou a été retirée.
//           </p>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 min-h-[44px] rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
//           >
//             Retour
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const details: { icon: React.ReactNode; label: string; value: string }[] = [
//     { icon: <BookOpen size={16} />, label: 'Matière', value: annonce.subject },
//     { icon: <BookOpen size={16} />, label: 'Classe', value: annonce.class },
//     {
//       icon: <MapPin size={16} />,
//       label: 'Localisation',
//       value: annonce.district
//         ? `${annonce.city} - ${annonce.district}`
//         : annonce.city,
//     },
//     ...(annonce.budget
//       ? [{ icon: <Wallet size={16} />, label: 'Budget', value: `${annonce.budget} FCFA` }]
//       : []),
//     { icon: <Clock size={16} />, label: 'Fréquence', value: annonce.duration },
//     {
//       icon: <Calendar size={16} />,
//       label: 'Publiée le',
//       value: new Date(annonce.createdAt).toLocaleDateString('fr-FR'),
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-900 pb-20 pt-[env(safe-area-inset-top)]">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-600 to-green-700 p-4">
//         <button
//           onClick={() => router.back()}
//           aria-label="Retour à la page précédente"
//           className="mb-2 flex min-h-[44px] items-center gap-1 rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
//         >
//           <ArrowLeft size={20} aria-hidden="true" />
//           Retour
//         </button>
//         <h1 className="text-center text-xl font-bold text-white">{annonce.title}</h1>
//       </header>

//       <main className="space-y-4 p-4">
//         {/* Description */}
//         <section
//           aria-labelledby="description-heading"
//           className="rounded-xl bg-slate-800 p-4"
//         >
//           <h2 id="description-heading" className="mb-2 font-bold text-green-400">
//             Description
//           </h2>
//           <p className="whitespace-pre-line text-gray-300">{annonce.description}</p>
//         </section>

//         {/* Détails */}
//         <section
//           aria-labelledby="details-heading"
//           className="rounded-xl bg-slate-800 p-4"
//         >
//           <h2 id="details-heading" className="mb-3 font-bold text-green-400">
//             Détails de l'annonce
//           </h2>
//           <dl className="space-y-3">
//             {details.map(({ icon, label, value }) => (
//               <div key={label} className="flex items-center gap-2 text-gray-300">
//                 <span className="shrink-0 text-green-400" aria-hidden="true">
//                   {icon}
//                 </span>
//                 <dt className="sr-only">{label}</dt>
//                 <dd>
//                   {label} : <strong className="text-white">{value}</strong>
//                 </dd>
//               </div>
//             ))}
//           </dl>
//         </section>

//         {/* Informations du parent */}
//         <section
//           aria-labelledby="parent-heading"
//           className="rounded-xl bg-slate-800 p-4"
//         >
//           <h2
//             id="parent-heading"
//             className="mb-3 flex items-center gap-2 font-bold text-green-400"
//           >
//             <User size={16} aria-hidden="true" /> Publié par
//           </h2>
//           <p className="font-medium text-white">{annonce.parentName}</p>
//         </section>

//         {/* Zone de contact */}
//         {user ? (
//           <div className="space-y-2">
//             <button
//               onClick={startChat}
//               disabled={isSubmitting}
//               aria-busy={isSubmitting}
//               className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {isSubmitting ? (
//                 <>
//                   <span
//                     className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
//                     aria-hidden="true"
//                   />
//                   Envoi en cours…
//                 </>
//               ) : (
//                 <>
//                   <MessageCircle size={18} aria-hidden="true" />
//                   Contacter {annonce.parentName}
//                 </>
//               )}
//             </button>
//             {contactError && (
//               <p role="alert" className="text-center text-sm text-red-400">
//                 {contactError}
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="rounded-xl bg-slate-800 p-4 text-center">
//             <p className="text-sm text-gray-400">
//               🔒 Connectez-vous pour contacter {annonce.parentName}
//             </p>
//             <button
//               onClick={() => router.push('/login')}
//               className="mt-3 min-h-[44px] rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
//             >
//               Se connecter
//             </button>
//           </div>
//         )}

//         {/* Note */}
//         <p className="rounded-xl border border-blue-500 bg-blue-600/20 p-3 text-center text-xs text-blue-400">
//           ℹ️ Cette annonce a été vérifiée par notre équipe. Cliquez sur
//           « Contacter » pour discuter avec le parent.
//         </p>
//       </main>
//     </div>
//   );
// }
















'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react';

import { API_URL } from '@/lib/api';

interface Annonce {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  city: string;
  district: string;
  budget: string;
  duration: string;
  parentName: string;
  parentPhone: string;
  parentId?: string;
  status: string;
  createdAt: string;
}

interface CurrentUser {
  _id: string;
  name?: string;
  [key: string]: unknown;
}

type LoadState = 'loading' | 'success' | 'error';

export default function AnnonceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const response = await axios.get<CurrentUser>(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Erreur utilisateur:', error);
    }
  }, []);

  const fetchAnnonce = useCallback(async () => {
    try {
      const response = await axios.get<Annonce[]>(`${API_URL}/annonces`);

      const found = response.data.find((a) => a._id === params.id);

      setAnnonce(found ?? null);
      setLoadState('success');
    } catch (error) {
      console.error(
        'Erreur annonce:',
        error instanceof AxiosError ? error.message : error
      );

      setLoadState('error');
    }
  }, [params.id]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetchUser(token);
    }

    fetchAnnonce();
  }, [fetchUser, fetchAnnonce]);

  const startChat = async () => {
    if (!annonce || !annonce.parentId) {
      setContactError(
        'Impossible de contacter ce parent pour le moment.'
      );
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setContactError(null);

    try {
      const response = await axios.post<{ _id: string }>(
        `${API_URL}/users/conversation`,
        {
          tutorId: annonce.parentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push(`/chat?convId=${response.data._id}`);
    } catch (error) {
      console.error('Erreur contact:', error);

      setContactError(
        'Impossible de contacter le parent. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────────
     CHARGEMENT
  ───────────────────────────────────────────── */

  if (loadState === 'loading') {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-white"
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <span className="sr-only">
          Chargement de l'annonce…
        </span>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-400" />
          </div>

          <p className="text-sm font-medium text-slate-400">
            Chargement de l'annonce...
          </p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     ERREUR RÉSEAU
  ───────────────────────────────────────────── */

  if (loadState === 'error') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 p-4 pt-[env(safe-area-inset-top)] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertCircle size={32} />
            </div>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-white">
              Une erreur est survenue
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Impossible de charger l'annonce. Vérifiez votre connexion puis
              réessayez.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setLoadState('loading');
                  fetchAnnonce();
                }}
                className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <RefreshCw size={17} />
                Réessayer
              </button>

              <button
                onClick={() => router.back()}
                className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <ArrowLeft size={17} />
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     ANNONCE INTROUVABLE
  ───────────────────────────────────────────── */

  if (!annonce) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 p-4 pt-[env(safe-area-inset-top)] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
              <BookOpen size={32} />
            </div>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-white">
              Annonce non trouvée
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Cette annonce n'existe plus ou a été retirée.
            </p>

            <button
              onClick={() => router.back()}
              className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <ArrowLeft size={17} />
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     DÉTAILS
  ───────────────────────────────────────────── */

  const details: {
    icon: ReactNode;
    label: string;
    value: string;
  }[] = [
    {
      icon: <BookOpen size={17} />,
      label: 'Matière',
      value: annonce.subject,
    },

    {
      icon: <GraduationCap size={17} />,
      label: 'Classe',
      value: annonce.class,
    },

    {
      icon: <MapPin size={17} />,
      label: 'Localisation',
      value: annonce.district
        ? `${annonce.city} - ${annonce.district}`
        : annonce.city,
    },

    ...(annonce.budget
      ? [
          {
            icon: <Wallet size={17} />,
            label: 'Budget',
            value: `${annonce.budget} FCFA`,
          },
        ]
      : []),

    {
      icon: <Clock size={17} />,
      label: 'Fréquence',
      value: annonce.duration,
    },

    {
      icon: <Calendar size={17} />,
      label: 'Publiée le',
      value: new Date(annonce.createdAt).toLocaleDateString(
        'fr-FR'
      ),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-24 pt-[env(safe-area-inset-top)] text-white">
      {/* ─────────────────────────────────────────
          BACKGROUND
      ───────────────────────────────────────── */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      {/* ─────────────────────────────────────────
          HEADER
      ───────────────────────────────────────── */}

      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <button
            onClick={() => router.back()}
            aria-label="Retour à la page précédente"
            className="group flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-0.5"
              aria-hidden="true"
            />

            <span>Retour</span>
          </button>

          {/* Logo desktop */}

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <GraduationCap
                size={22}
                className="text-white"
              />
            </div>

            <div className="text-left">
              <p className="text-lg font-bold leading-none tracking-tight">
                Boch<span className="text-emerald-400">237</span>
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Détail annonce
              </p>
            </div>
          </div>

          {/* Status */}

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <CheckCircle2 size={14} />
            Disponible
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────
          MAIN
      ───────────────────────────────────────── */}

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* ───────────────────────────────────────
            HERO
        ─────────────────────────────────────── */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <Sparkles size={14} />

              Annonce de cours particulier
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <h1 className="max-w-4xl break-words text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {annonce.title}
                </h1>

                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin
                      size={16}
                      className="text-emerald-400"
                    />

                    {annonce.district
                      ? `${annonce.city} - ${annonce.district}`
                      : annonce.city}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Calendar
                      size={16}
                      className="text-emerald-400"
                    />

                    Publiée le{' '}
                    {new Date(
                      annonce.createdAt
                    ).toLocaleDateString('fr-FR')}
                  </span>
                </p>
              </div>

              {/* Résumé besoin */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Besoin
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    {annonce.subject}
                  </span>

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                    {annonce.class}
                  </span>

                  {annonce.budget && (
                    <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300">
                      {annonce.budget} FCFA
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────
            CONTENT + SIDEBAR
        ─────────────────────────────────────── */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* ─────────────────────────────────────
              LEFT CONTENT
          ───────────────────────────────────── */}

          <div className="space-y-6">
            {/* Description */}

            <section
              aria-labelledby="description-heading"
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                  <BookOpen size={22} />
                </div>

                <div>
                  <h2
                    id="description-heading"
                    className="text-lg font-bold tracking-tight text-white"
                  >
                    Description
                  </h2>

                  <p className="text-xs text-slate-500">
                    Informations données par le parent.
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-300 sm:text-base">
                {annonce.description}
              </p>
            </section>

            {/* Détails */}

            <section
              aria-labelledby="details-heading"
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    Informations
                  </p>

                  <h2
                    id="details-heading"
                    className="mt-1 text-lg font-bold tracking-tight text-white"
                  >
                    Détails de l'annonce
                  </h2>
                </div>

                <div className="hidden rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:block">
                  {details.length} détails
                </div>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                {details.map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.04]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                      {icon}
                    </div>

                    <dt className="text-xs font-medium text-slate-500">
                      {label}
                    </dt>

                    <dd className="mt-1 break-words text-sm font-semibold text-white">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* ─────────────────────────────────────
              SIDEBAR
          ───────────────────────────────────── */}

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Parent */}

            <section
              aria-labelledby="parent-heading"
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                  {annonce.parentName
                    ?.charAt(0)
                    .toUpperCase() || 'P'}
                </div>

                <div className="min-w-0">
                  <h2
                    id="parent-heading"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-400"
                  >
                    <User
                      size={16}
                      className="text-emerald-400"
                    />

                    Publié par
                  </h2>

                  <p className="mt-1 truncate text-lg font-bold text-white">
                    {annonce.parentName}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <p className="text-xs leading-5 text-emerald-100/80">
                    Cette annonce a été vérifiée par notre équipe.
                    Vous pouvez contacter le parent pour discuter
                    des modalités.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}

            <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              {user ? (
                <div className="space-y-3">
                  <button
                    onClick={startChat}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
                          aria-hidden="true"
                        />

                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <MessageCircle
                          size={18}
                          aria-hidden="true"
                        />

                        Contacter {annonce.parentName}
                      </>
                    )}
                  </button>

                  {contactError && (
                    <p
                      role="alert"
                      className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
                    >
                      {contactError}
                    </p>
                  )}

                  <p className="text-center text-xs leading-5 text-slate-500">
                    Une conversation sera créée automatiquement avec
                    le parent.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                    <MessageCircle size={26} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-white">
                    Connectez-vous pour contacter le parent
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Vous devez être connecté pour démarrer une
                    conversation avec {annonce.parentName}.
                  </p>

                  <button
                    onClick={() => router.push('/login')}
                    className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    <MessageCircle
                      size={18}
                      aria-hidden="true"
                    />

                    Se connecter
                  </button>
                </div>
              )}
            </section>

            {/* Sécurité */}

            <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Échange sécurisé
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Gardez vos échanges sur Boch237 et ne partagez
                    jamais vos informations sensibles.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* ─────────────────────────────────────────
          MOBILE CTA
      ───────────────────────────────────────── */}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        {user ? (
          <button
            onClick={startChat}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span
                  className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
                  aria-hidden="true"
                />

                Envoi en cours…
              </>
            ) : (
              <>
                <MessageCircle
                  size={18}
                  aria-hidden="true"
                />

                Contacter {annonce.parentName}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition active:scale-[0.99]"
          >
            <MessageCircle
              size={18}
              aria-hidden="true"
            />

            Se connecter pour contacter
          </button>
        )}
      </div>
    </div>
  );
}

