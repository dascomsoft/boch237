// // 'use client';
// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import axios from 'axios';
// // import { API_URL } from '@/lib/api';

// // export default function CreerAnnonce() {
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState<any>(null);
// //   const [form, setForm] = useState({
// //     title: '',
// //     description: '',
// //     subject: '',
// //     class: '',
// //     city: '',
// //     district: '',
// //     budget: '',
// //     duration: 'Ponctuel'
// //   });

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       router.push('/login');
// //       return;
// //     }
    
// //     const fetchUser = async () => {
// //       try {
// //         const response = await axios.get(`${API_URL}/users/me`, {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });
// //         setUser(response.data);
// //       } catch (error) {
// //         console.error('Erreur:', error);
// //       }
// //     };
// //     fetchUser();
// //   }, []);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
    
// //     if (!form.title || !form.description || !form.subject || !form.class || !form.city) {
// //       alert('Veuillez remplir tous les champs obligatoires (*)');
// //       setLoading(false);
// //       return;
// //     }
    
// //     try {
// //       const token = localStorage.getItem('token');
// //       await axios.post(
// //         `${API_URL}/annonces`,
// //         form,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       alert('✅ Annonce publiée avec succès !\n\nElle sera visible après validation par l\'administrateur.');
// //       router.push('/annonces');
// //     } catch (error: any) {
// //       console.error('Erreur:', error);
// //       alert(error.response?.data?.message || '❌ Erreur lors de la publication');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-900 p-4">
// //       <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg mb-4">
// //         <button onClick={() => router.back()} className="text-white mb-2 flex items-center gap-1">
// //           ← Retour
// //         </button>
// //         <h1 className="text-white text-xl font-bold text-center">📢 Publier une annonce</h1>
// //         <p className="text-green-100 text-sm text-center mt-1">Besoin d'un répétiteur ? Décrivez votre besoin</p>
// //       </div>

// //       {user && (
// //         <div className="bg-slate-800 rounded-xl p-3 mb-4">
// //           <p className="text-gray-400 text-sm">
// //             Vous publiez en tant que : <span className="text-green-400 font-medium">{user.name}</span>
// //           </p>
// //           <p className="text-gray-500 text-xs mt-1">📞 {user.phone}</p>
// //         </div>
// //       )}

// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Titre de l'annonce <span className="text-red-400">*</span></label>
// //           <input
// //             type="text"
// //             placeholder="Ex: Recherche professeur de maths pour élève de 3ème"
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             required
// //             value={form.title}
// //             onChange={(e) => setForm({ ...form, title: e.target.value })}
// //           />
// //         </div>
        
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Description détaillée <span className="text-red-400">*</span></label>
// //           <textarea
// //             placeholder="Décrivez votre besoin (niveau de l'élève, objectifs, fréquence, etc.)"
// //             rows={5}
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             required
// //             value={form.description}
// //             onChange={(e) => setForm({ ...form, description: e.target.value })}
// //           />
// //         </div>
        
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Matière <span className="text-red-400">*</span></label>
// //           <select
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             required
// //             value={form.subject}
// //             onChange={(e) => setForm({ ...form, subject: e.target.value })}
// //           >
// //             <option value="">Sélectionnez une matière</option>
// //             <option>Mathématiques</option>
// //             <option>Français</option>
// //             <option>Anglais</option>
// //             <option>Physique-Chimie</option>
// //             <option>SVT / Biologie</option>
// //             <option>Histoire-Géographie</option>
// //             <option>Philosophie</option>
// //             <option>Informatique</option>
// //           </select>
// //         </div>
        
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Classe / Niveau <span className="text-red-400">*</span></label>
// //           <select
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             required
// //             value={form.class}
// //             onChange={(e) => setForm({ ...form, class: e.target.value })}
// //           >
// //             <option value="">Sélectionnez une classe</option>
// //             <option>Primaire</option>
// //             <option>6ème</option><option>5ème</option><option>4ème</option><option>3ème</option>
// //             <option>Seconde</option><option>Première</option><option>Terminale</option>
// //           </select>
// //         </div>
        
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Ville <span className="text-red-400">*</span></label>
// //           <input
// //             type="text"
// //             placeholder="Ex: Yaoundé, Douala, Bafoussam..."
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             required
// //             value={form.city}
// //             onChange={(e) => setForm({ ...form, city: e.target.value })}
// //           />
// //         </div>
        
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Quartier (optionnel)</label>
// //           <input
// //             type="text"
// //             placeholder="Ex: Bastos, Bonapriso, Akwa..."
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             value={form.district}
// //             onChange={(e) => setForm({ ...form, district: e.target.value })}
// //           />
// //         </div>
        
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Budget proposé (FCFA) - optionnel</label>
// //           <input
// //             type="number"
// //             placeholder="Ex: 15000"
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             value={form.budget}
// //             onChange={(e) => setForm({ ...form, budget: e.target.value })}
// //           />
// //         </div>
        
// //         <div>
// //           <label className="text-gray-300 text-sm block mb-1">Fréquence</label>
// //           <select
// //             className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-green-500 outline-none"
// //             value={form.duration}
// //             onChange={(e) => setForm({ ...form, duration: e.target.value })}
// //           >
// //             <option>Ponctuel</option>
// //             <option>Hebdomadaire</option>
// //             <option>Mensuel</option>
// //           </select>
// //         </div>
        
// //         <div className="flex gap-3 pt-4">
// //           <button
// //             type="button"
// //             onClick={() => router.back()}
// //             className="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg font-bold transition-colors"
// //           >
// //             Annuler
// //           </button>
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="flex-1 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-3 rounded-lg font-bold transition-all disabled:opacity-50"
// //           >
// //             {loading ? 'Publication...' : '📢 Publier'}
// //           </button>
// //         </div>
// //       </form>
      
// //       <div className="mt-6 bg-blue-600/20 border border-blue-500 rounded-xl p-4">
// //         <p className="text-blue-400 text-sm font-medium">ℹ️ Information</p>
// //         <p className="text-gray-400 text-xs mt-1">
// //           Votre annonce sera d'abord vérifiée par notre équipe avant d'être publiée.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }










// 'use client';

// import {
//   type ChangeEvent,
//   type FormEvent,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { API_URL } from '@/lib/api';

// const SUBJECTS = [
//   'Mathématiques',
//   'Français',
//   'Anglais',
//   'Physique-Chimie',
//   'SVT / Biologie',
//   'Histoire-Géographie',
//   'Philosophie',
//   'Informatique',
// ] as const;

// const CLASSES = [
//   'Primaire',
//   '6ème',
//   '5ème',
//   '4ème',
//   '3ème',
//   'Seconde',
//   'Première',
//   'Terminale',
// ] as const;

// const DURATIONS = ['Ponctuel', 'Hebdomadaire', 'Mensuel'] as const;

// type Duration = (typeof DURATIONS)[number];

// interface User {
//   name: string;
//   phone?: string | null;
// }

// interface AnnouncementForm {
//   title: string;
//   description: string;
//   subject: string;
//   class: string;
//   city: string;
//   district: string;
//   budget: string;
//   duration: Duration;
// }

// const INITIAL_FORM: AnnouncementForm = {
//   title: '',
//   description: '',
//   subject: '',
//   class: '',
//   city: '',
//   district: '',
//   budget: '',
//   duration: 'Ponctuel',
// };

// const FIELD_CLASS =
//   'min-h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder:text-slate-500 outline-none transition-colors focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/40 disabled:cursor-not-allowed disabled:opacity-60';

// const LABEL_CLASS = 'mb-1.5 block text-sm font-medium text-gray-300';

// function getErrorMessage(error: unknown, fallback: string): string {
//   if (!axios.isAxiosError(error)) {
//     return fallback;
//   }

//   const data = error.response?.data as { message?: string } | undefined;
//   return data?.message || fallback;
// }

// export default function CreerAnnonce() {
//   const router = useRouter();
//   const errorRef = useRef<HTMLDivElement>(null);

//   const [user, setUser] = useState<User | null>(null);
//   const [form, setForm] = useState<AnnouncementForm>(INITIAL_FORM);
//   const [isUserLoading, setIsUserLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [userError, setUserError] = useState('');
//   const [submitError, setSubmitError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       router.replace('/login');
//       return;
//     }

//     let isMounted = true;

//     const fetchUser = async () => {
//       try {
//         const response = await axios.get<User>(`${API_URL}/users/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (isMounted) {
//           setUser(response.data);
//         }
//       } catch (error: unknown) {
//         console.error('Erreur lors du chargement de l’utilisateur :', error);

//         if (isMounted) {
//           setUserError(
//             getErrorMessage(
//               error,
//               'Impossible de charger les informations de votre compte.',
//             ),
//           );
//         }
//       } finally {
//         if (isMounted) {
//           setIsUserLoading(false);
//         }
//       }
//     };

//     void fetchUser();

//     return () => {
//       isMounted = false;
//     };
//   }, [router]);

//   const updateField =
//     (field: keyof AnnouncementForm) =>
//     (
//       event: ChangeEvent<
//         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//       >,
//     ) => {
//       const value = event.target.value;

//       setForm((currentForm) => ({
//         ...currentForm,
//         [field]: value,
//       }));
//     };

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (isSubmitting) {
//       return;
//     }

//     setSubmitError('');

//     const hasMissingRequiredField =
//       !form.title.trim() ||
//       !form.description.trim() ||
//       !form.subject ||
//       !form.class ||
//       !form.city.trim();

//     if (hasMissingRequiredField) {
//       setSubmitError('Veuillez remplir tous les champs obligatoires.');
//       requestAnimationFrame(() => errorRef.current?.focus());
//       return;
//     }

//     const token = localStorage.getItem('token');

//     if (!token) {
//       router.replace('/login');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await axios.post(`${API_URL}/annonces`, form, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert(
//         "✅ Annonce publiée avec succès !\n\nElle sera visible après validation par l'administrateur.",
//       );

//       router.push('/annonces');
//     } catch (error: unknown) {
//       console.error('Erreur lors de la publication :', error);

//       setSubmitError(
//         getErrorMessage(error, 'Erreur lors de la publication de l’annonce.'),
//       );

//       requestAnimationFrame(() => errorRef.current?.focus());
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="min-h-dvh bg-slate-900 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-5xl">
//         <header className="mb-6 rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             aria-label="Retourner à la page précédente"
//             className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
//           >
//             <span aria-hidden="true">←</span>
//             Retour
//           </button>

//           <div className="text-center">
//             <h1 className="text-xl font-bold text-white sm:text-2xl">
//               <span aria-hidden="true">📢 </span>
//               Publier une annonce
//             </h1>
//             <p className="mt-1 text-sm text-green-100 sm:text-base">
//               Besoin d’un répétiteur ? Décrivez votre besoin.
//             </p>
//           </div>
//         </header>

//         <section
//           aria-labelledby="publisher-heading"
//           aria-busy={isUserLoading}
//           className="mb-6 rounded-xl bg-slate-800 p-4"
//         >
//           <h2 id="publisher-heading" className="sr-only">
//             Compte utilisé pour la publication
//           </h2>

//           {isUserLoading ? (
//             <p className="text-sm text-gray-400" role="status">
//               Chargement de votre compte…
//             </p>
//           ) : userError ? (
//             <div role="alert" className="text-sm text-red-300">
//               {userError}
//             </div>
//           ) : user ? (
//             <>
//               <p className="text-sm text-gray-400">
//                 Vous publiez en tant que{' '}
//                 <strong className="font-medium text-green-400">
//                   {user.name}
//                 </strong>
//               </p>

//               {user.phone && (
//                 <p className="mt-1 text-xs text-gray-500">
//                   <span aria-hidden="true">📞 </span>
//                   <span className="sr-only">Téléphone : </span>
//                   {user.phone}
//                 </p>
//               )}
//             </>
//           ) : null}
//         </section>

//         <section aria-labelledby="form-heading">
//           <h2 id="form-heading" className="sr-only">
//             Informations de l’annonce
//           </h2>

//           <p id="required-fields-note" className="mb-4 text-sm text-gray-400">
//             Les champs marqués d’un astérisque sont obligatoires.
//           </p>

//           {submitError && (
//             <div
//               ref={errorRef}
//               tabIndex={-1}
//               role="alert"
//               className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 p-4 text-sm text-red-200 outline-none focus-visible:ring-2 focus-visible:ring-red-400"
//             >
//               {submitError}
//             </div>
//           )}

//           <form
//             onSubmit={handleSubmit}
//             aria-describedby="required-fields-note"
//             aria-busy={isSubmitting}
//             noValidate
//           >
//             <fieldset disabled={isSubmitting} className="space-y-5">
//               <legend className="sr-only">Détails de votre annonce</legend>

//               <div>
//                 <label htmlFor="title" className={LABEL_CLASS}>
//                   Titre de l’annonce{' '}
//                   <span aria-hidden="true" className="text-red-400">
//                     *
//                   </span>
//                 </label>
//                 <input
//                   id="title"
//                   name="title"
//                   type="text"
//                   required
//                   autoComplete="off"
//                   maxLength={150}
//                   placeholder="Ex. Recherche professeur de maths pour élève de 3ème"
//                   className={FIELD_CLASS}
//                   value={form.title}
//                   onChange={updateField('title')}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className={LABEL_CLASS}>
//                   Description détaillée{' '}
//                   <span aria-hidden="true" className="text-red-400">
//                     *
//                   </span>
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   required
//                   rows={6}
//                   placeholder="Décrivez votre besoin : niveau de l’élève, objectifs, fréquence…"
//                   className={`${FIELD_CLASS} min-h-36 resize-y`}
//                   value={form.description}
//                   onChange={updateField('description')}
//                 />
//               </div>

//               <div className="grid gap-5 md:grid-cols-2">
//                 <div>
//                   <label htmlFor="subject" className={LABEL_CLASS}>
//                     Matière{' '}
//                     <span aria-hidden="true" className="text-red-400">
//                       *
//                     </span>
//                   </label>
//                   <select
//                     id="subject"
//                     name="subject"
//                     required
//                     className={FIELD_CLASS}
//                     value={form.subject}
//                     onChange={updateField('subject')}
//                   >
//                     <option value="">Sélectionnez une matière</option>
//                     {SUBJECTS.map((subject) => (
//                       <option key={subject} value={subject}>
//                         {subject}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="class" className={LABEL_CLASS}>
//                     Classe / Niveau{' '}
//                     <span aria-hidden="true" className="text-red-400">
//                       *
//                     </span>
//                   </label>
//                   <select
//                     id="class"
//                     name="class"
//                     required
//                     className={FIELD_CLASS}
//                     value={form.class}
//                     onChange={updateField('class')}
//                   >
//                     <option value="">Sélectionnez une classe</option>
//                     {CLASSES.map((schoolClass) => (
//                       <option key={schoolClass} value={schoolClass}>
//                         {schoolClass}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid gap-5 md:grid-cols-2">
//                 <div>
//                   <label htmlFor="city" className={LABEL_CLASS}>
//                     Ville{' '}
//                     <span aria-hidden="true" className="text-red-400">
//                       *
//                     </span>
//                   </label>
//                   <input
//                     id="city"
//                     name="city"
//                     type="text"
//                     required
//                     autoComplete="address-level2"
//                     placeholder="Ex. Yaoundé, Douala, Bafoussam…"
//                     className={FIELD_CLASS}
//                     value={form.city}
//                     onChange={updateField('city')}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="district" className={LABEL_CLASS}>
//                     Quartier{' '}
//                     <span className="font-normal text-gray-500">
//                       (optionnel)
//                     </span>
//                   </label>
//                   <input
//                     id="district"
//                     name="district"
//                     type="text"
//                     autoComplete="address-level3"
//                     placeholder="Ex. Bastos, Bonapriso, Akwa…"
//                     className={FIELD_CLASS}
//                     value={form.district}
//                     onChange={updateField('district')}
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-5 md:grid-cols-2">
//                 <div>
//                   <label htmlFor="budget" className={LABEL_CLASS}>
//                     Budget proposé en FCFA{' '}
//                     <span className="font-normal text-gray-500">
//                       (optionnel)
//                     </span>
//                   </label>
//                   <input
//                     id="budget"
//                     name="budget"
//                     type="number"
//                     min="0"
//                     step="1"
//                     inputMode="numeric"
//                     placeholder="Ex. 15000"
//                     className={FIELD_CLASS}
//                     value={form.budget}
//                     onChange={updateField('budget')}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="duration" className={LABEL_CLASS}>
//                     Fréquence
//                   </label>
//                   <select
//                     id="duration"
//                     name="duration"
//                     className={FIELD_CLASS}
//                     value={form.duration}
//                     onChange={updateField('duration')}
//                   >
//                     {DURATIONS.map((duration) => (
//                       <option key={duration} value={duration}>
//                         {duration}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </fieldset>

//             <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <button
//                 type="button"
//                 onClick={() => router.back()}
//                 disabled={isSubmitting}
//                 className="min-h-12 rounded-lg bg-gray-600 px-6 py-3 font-bold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-40"
//               >
//                 Annuler
//               </button>

//               <button
//                 type="submit"
//                 disabled={isSubmitting || isUserLoading}
//                 aria-disabled={isSubmitting || isUserLoading}
//                 className="min-h-12 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-bold text-white transition-all hover:from-green-700 hover:to-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-48"
//               >
//                 {isSubmitting ? (
//                   <span role="status">Publication en cours…</span>
//                 ) : (
//                   <>
//                     <span aria-hidden="true">📢 </span>
//                     Publier
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </section>

//         <aside
//           aria-labelledby="moderation-information"
//           className="mt-8 rounded-xl border border-blue-500 bg-blue-600/20 p-4"
//         >
//           <h2
//             id="moderation-information"
//             className="text-sm font-medium text-blue-400"
//           >
//             <span aria-hidden="true">ℹ️ </span>
//             Information
//           </h2>
//           <p className="mt-1 text-sm text-gray-400">
//             Votre annonce sera d’abord vérifiée par notre équipe avant d’être
//             publiée.
//           </p>
//         </aside>
//       </div>
//     </main>
//   );
// }














'use client';

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';

const SUBJECTS = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Physique-Chimie',
  'SVT / Biologie',
  'Histoire-Géographie',
  'Philosophie',
  'Informatique',
] as const;

const CLASSES = [
  'Primaire',
  '6ème',
  '5ème',
  '4ème',
  '3ème',
  'Seconde',
  'Première',
  'Terminale',
] as const;

const DURATIONS = ['Ponctuel', 'Hebdomadaire', 'Mensuel'] as const;

type Duration = (typeof DURATIONS)[number];

interface User {
  name: string;
  phone?: string | null;
}

interface AnnouncementForm {
  title: string;
  description: string;
  subject: string;
  class: string;
  city: string;
  district: string;
  budget: string;
  duration: Duration;
}

const INITIAL_FORM: AnnouncementForm = {
  title: '',
  description: '',
  subject: '',
  class: '',
  city: '',
  district: '',
  budget: '',
  duration: 'Ponctuel',
};

const FIELD_CLASS =
  'min-h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white placeholder:text-slate-500 outline-none transition-colors focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/40 disabled:cursor-not-allowed disabled:opacity-60';

const LABEL_CLASS = 'mb-1.5 block text-sm font-medium text-gray-300';

function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as { message?: string } | undefined;
  return data?.message || fallback;
}

export default function CreerAnnonce() {
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(INITIAL_FORM);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userError, setUserError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setUser(response.data);
        }
      } catch (error: unknown) {
        console.error('Erreur lors du chargement de l’utilisateur :', error);

        if (isMounted) {
          setUserError(
            getErrorMessage(
              error,
              'Impossible de charger les informations de votre compte.',
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsUserLoading(false);
        }
      }
    };

    void fetchUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const updateField =
    (field: keyof AnnouncementForm) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = event.target.value;

      setForm((currentForm) => ({
        ...currentForm,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitError('');

    const hasMissingRequiredField =
      !form.title.trim() ||
      !form.description.trim() ||
      !form.subject ||
      !form.class ||
      !form.city.trim();

    if (hasMissingRequiredField) {
      setSubmitError('Veuillez remplir tous les champs obligatoires.');
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/annonces`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(
        "✅ Annonce publiée avec succès !\n\nElle sera visible après validation par l'administrateur.",
      );

      router.push('/annonces');
    } catch (error: unknown) {
      console.error('Erreur lors de la publication :', error);

      setSubmitError(
        getErrorMessage(error, 'Erreur lors de la publication de l’annonce.'),
      );

      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-slate-900 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retourner à la page précédente"
            className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-white transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span aria-hidden="true">←</span>
            Retour
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              <span aria-hidden="true">📢 </span>
              Publier une annonce
            </h1>
            <p className="mt-1 text-sm text-green-100 sm:text-base">
              Besoin d’un répétiteur ? Décrivez votre besoin.
            </p>
          </div>
        </header>

        <section
          aria-labelledby="publisher-heading"
          aria-busy={isUserLoading}
          className="mb-6 rounded-xl bg-slate-800 p-4"
        >
          <h2 id="publisher-heading" className="sr-only">
            Compte utilisé pour la publication
          </h2>

          {isUserLoading ? (
            <p className="text-sm text-gray-400" role="status">
              Chargement de votre compte…
            </p>
          ) : userError ? (
            <div role="alert" className="text-sm text-red-300">
              {userError}
            </div>
          ) : user ? (
            <>
              <p className="text-sm text-gray-400">
                Vous publiez en tant que{' '}
                <strong className="font-medium text-green-400">
                  {user.name}
                </strong>
              </p>

              {user.phone && (
                <p className="mt-1 text-xs text-gray-500">
                  <span aria-hidden="true">📞 </span>
                  <span className="sr-only">Téléphone : </span>
                  {user.phone}
                </p>
              )}
            </>
          ) : null}
        </section>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Informations de l’annonce
          </h2>

          <p id="required-fields-note" className="mb-4 text-sm text-gray-400">
            Les champs marqués d’un astérisque sont obligatoires.
          </p>

          {submitError && (
            <div
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 p-4 text-sm text-red-200 outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              {submitError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            aria-describedby="required-fields-note"
            aria-busy={isSubmitting}
            noValidate
          >
            <fieldset disabled={isSubmitting} className="space-y-5">
              <legend className="sr-only">Détails de votre annonce</legend>

              <div>
                <label htmlFor="title" className={LABEL_CLASS}>
                  Titre de l’annonce{' '}
                  <span aria-hidden="true" className="text-red-400">
                    *
                  </span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  autoComplete="off"
                  maxLength={150}
                  placeholder="Ex. Recherche professeur de maths pour élève de 3ème"
                  className={FIELD_CLASS}
                  value={form.title}
                  onChange={updateField('title')}
                />
              </div>

              <div>
                <label htmlFor="description" className={LABEL_CLASS}>
                  Description détaillée{' '}
                  <span aria-hidden="true" className="text-red-400">
                    *
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  placeholder="Décrivez votre besoin : niveau de l’élève, objectifs, fréquence…"
                  className={`${FIELD_CLASS} min-h-36 resize-y`}
                  value={form.description}
                  onChange={updateField('description')}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="subject" className={LABEL_CLASS}>
                    Matière{' '}
                    <span aria-hidden="true" className="text-red-400">
                      *
                    </span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className={FIELD_CLASS}
                    value={form.subject}
                    onChange={updateField('subject')}
                  >
                    <option value="">Sélectionnez une matière</option>
                    {SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="class" className={LABEL_CLASS}>
                    Classe / Niveau{' '}
                    <span aria-hidden="true" className="text-red-400">
                      *
                    </span>
                  </label>
                  <select
                    id="class"
                    name="class"
                    required
                    className={FIELD_CLASS}
                    value={form.class}
                    onChange={updateField('class')}
                  >
                    <option value="">Sélectionnez une classe</option>
                    {CLASSES.map((schoolClass) => (
                      <option key={schoolClass} value={schoolClass}>
                        {schoolClass}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="city" className={LABEL_CLASS}>
                    Ville{' '}
                    <span aria-hidden="true" className="text-red-400">
                      *
                    </span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    placeholder="Ex. Yaoundé, Douala, Bafoussam…"
                    className={FIELD_CLASS}
                    value={form.city}
                    onChange={updateField('city')}
                  />
                </div>

                <div>
                  <label htmlFor="district" className={LABEL_CLASS}>
                    Quartier{' '}
                    <span className="font-normal text-gray-500">
                      (optionnel)
                    </span>
                  </label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    autoComplete="address-level3"
                    placeholder="Ex. Bastos, Bonapriso, Akwa…"
                    className={FIELD_CLASS}
                    value={form.district}
                    onChange={updateField('district')}
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="budget" className={LABEL_CLASS}>
                    Budget proposé en FCFA{' '}
                    <span className="font-normal text-gray-500">
                      (optionnel)
                    </span>
                  </label>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="Ex. 15000"
                    className={FIELD_CLASS}
                    value={form.budget}
                    onChange={updateField('budget')}
                  />
                </div>

                <div>
                  <label htmlFor="duration" className={LABEL_CLASS}>
                    Fréquence
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    className={FIELD_CLASS}
                    value={form.duration}
                    onChange={updateField('duration')}
                  >
                    {DURATIONS.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="min-h-12 rounded-lg bg-gray-600 px-6 py-3 font-bold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-40"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUserLoading}
                aria-disabled={isSubmitting || isUserLoading}
                className="min-h-12 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-bold text-white transition-all hover:from-green-700 hover:to-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-48"
              >
                {isSubmitting ? (
                  <span role="status">Publication en cours…</span>
                ) : (
                  <>
                    <span aria-hidden="true">📢 </span>
                    Publier
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <aside
          aria-labelledby="moderation-information"
          className="mt-8 rounded-xl border border-blue-500 bg-blue-600/20 p-4"
        >
          <h2
            id="moderation-information"
            className="text-sm font-medium text-blue-400"
          >
            <span aria-hidden="true">ℹ️ </span>
            Information
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Votre annonce sera d’abord vérifiée par notre équipe avant d’être
            publiée.
          </p>
        </aside>
      </div>
    </main>
  );
}