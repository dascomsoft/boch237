// 'use client';
// import { Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import ChatWindow from '@/components/ChatWindow';
// import MobileNav from '@/components/MobileNav';
// import { Conversation, Message, User } from '@/types';
// import { API_URL } from '@/lib/api';

// function ChatContent() {
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get('convId');
  
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [otherUser, setOtherUser] = useState<User | null>(null);
//   const [otherUsers, setOtherUsers] = useState<Record<string, User>>({});
//   const [loading, setLoading] = useState(true);

//   const formatLastActivity = (timestamp: Date) => {
//     const msgDate = new Date(timestamp);
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
    
//     const diffDays = Math.floor((today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24));
    
//     const timeStr = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
//     if (diffDays === 0) {
//       return `Aujourd'hui à ${timeStr}`;
//     } else if (diffDays === 1) {
//       return `Hier à ${timeStr}`;
//     } else if (diffDays < 7) {
//       const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
//       return `${days[msgDate.getDay()]} à ${timeStr}`;
//     } else {
//       return `${msgDate.toLocaleDateString()} à ${timeStr}`;
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       window.location.href = '/';
//       return;
//     }
//     fetchData(token);
//   }, [conversationId]);

//   const fetchData = async (token: string) => {
//     setLoading(true);
//     try {
//       // 1. Récupérer l'utilisateur courant
//       const userResponse = await axios.get(`${API_URL}/users/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const currentUserData = userResponse.data;
//       setCurrentUser(currentUserData);
      
//       // 2. Récupérer les conversations
//       const convResponse = await axios.get(`${API_URL}/users/conversations`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const conversationsData = convResponse.data;
//       setConversations(conversationsData);
      
//       // 3. Charger les autres utilisateurs (avec protection 404)
//       const usersMap: Record<string, User> = {};
//       for (const conv of conversationsData) {
//         const otherId = conv.participants.find((id: string) => id !== currentUserData._id);
//         if (otherId && !usersMap[otherId]) {
//           try {
//             const otherRes = await axios.get(`${API_URL}/users/${otherId}`, {
//               headers: { Authorization: `Bearer ${token}` }
//             });
//             usersMap[otherId] = otherRes.data;
//           } catch (err: any) {
//             // ✅ PROTECTION : Si l'utilisateur n'existe pas, créer un placeholder
//             if (err.response?.status === 404) {
//               console.warn('⚠️ Utilisateur introuvable:', otherId);
//               usersMap[otherId] = {
//                 _id: otherId,
//                 name: 'Utilisateur supprimé',
//                 phone: '',
//                 role: 'parent',
//                 isActive: false,
//                 createdAt: new Date()
//               };
//             } else {
//               console.error('Erreur chargement utilisateur:', err);
//             }
//           }
//         }
//       }
//       setOtherUsers(usersMap);
      
//       // 4. Si une conversation est sélectionnée
//       if (conversationId) {
//         const conv = conversationsData.find((c: Conversation) => c._id === conversationId);
//         if (conv) {
//           setCurrentConversation(conv);
//           const otherId = conv.participants.find((id: string) => id !== currentUserData._id);
//           if (otherId && usersMap[otherId]) {
//             setOtherUser(usersMap[otherId]);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Erreur chargement:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Gestion des nouveaux messages
//   const handleNewMessage = (message: Message) => {
//     setCurrentConversation(prev => {
//       if (!prev) return prev;

//       const exists = prev.messages.some(m => m._id === message._id);
//       if (exists) return prev;

//       return {
//         ...prev,
//         messages: [...prev.messages, message]
//       };
//     });
//   };

//   const handleDeleteMessage = (messageId: string) => {
//     setCurrentConversation(prev => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         messages: prev.messages.filter(m => m._id !== messageId)
//       };
//     });
//   };

//   const handleEditMessage = (messageId: string, newContent: string) => {
//     setCurrentConversation(prev => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         messages: prev.messages.map(m =>
//           m._id === messageId ? { ...m, content: newContent } : m
//         )
//       };
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-900 pb-20">
//       {currentConversation && currentUser && otherUser ? (
//         <ChatWindow
//           conversationId={currentConversation._id}
//           currentUserId={currentUser._id}
//           otherUser={otherUser}
//           messages={currentConversation.messages || []}
//           onNewMessage={handleNewMessage}
//           onDeleteMessage={handleDeleteMessage}
//           onEditMessage={handleEditMessage}
//         />
//       ) : (
//         <div className="p-4">
//           <h2 className="text-white text-xl font-bold mb-4">Mes conversations</h2>
//           {conversations.length === 0 ? (
//             <div className="text-center text-gray-400 py-10">
//               <p>Aucune conversation</p>
//               <p className="text-sm mt-2">Commencez par rechercher un répétiteur</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {conversations.map((conv) => {
//                 const otherId = conv.participants.find(id => id !== currentUser?._id);
//                 const other = otherId ? otherUsers[otherId] : null;
//                 const lastMessage = conv.messages[conv.messages.length - 1];
                
//                 return (
//                   <div
//                     key={conv._id}
//                     className="bg-slate-800 p-4 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700"
//                     onClick={() => window.location.href = `/chat?convId=${conv._id}`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
//                             <span className="text-white font-bold">
//                               {other?.name?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div>
//                             <h3 className="text-white font-bold">
//                               {other?.name || 'Utilisateur'}
//                             </h3>
//                             <p className="text-gray-400 text-xs">
//                               {other?.role === 'tutor' ? '👨‍🏫 Répétiteur' : '👨‍👩‍👧 Parent'}
//                             </p>
//                           </div>
//                         </div>
//                         {lastMessage && (
//                           <p className="text-gray-500 text-sm mt-2 truncate ml-12">
//                             {lastMessage.senderId === currentUser?._id ? '👤 Vous: ' : ''}
//                             {lastMessage.content}
//                           </p>
//                         )}
//                       </div>
//                       <div className="text-right">
//                         <p className="text-gray-500 text-xs">
//                           {formatLastActivity(conv.lastActivity)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}
//       <MobileNav userRole={currentUser?.role} />
//     </div>
//   );
// }

// export default function ChatPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
//         <div className="animate-spin h-8 w-8 border-b-2 border-green-500 rounded-full"></div>
//       </div>
//     }>
//       <ChatContent />
//     </Suspense>
//   );
// }










































// 'use client';

// import { Suspense, useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import {
//   ArrowRight,
//   Clock3,
//   MessageCircle,
//   MessagesSquare,
//   Search,
//   ShieldCheck,
//   Users
// } from 'lucide-react';

// import ChatWindow from '@/components/ChatWindow';
// import MobileNav from '@/components/MobileNav';
// import { Conversation, Message, User } from '@/types';
// import { API_URL } from '@/lib/api';

// function LoadingScreen() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
//       <div className="flex flex-col items-center gap-4">
//         <div className="relative flex h-16 w-16 items-center justify-center">
//           <div className="absolute inset-0 rounded-full border border-emerald-400/20" />
//           <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-400" />

//           <MessageCircle
//             size={22}
//             className="text-emerald-400"
//             aria-hidden="true"
//           />
//         </div>

//         <div className="text-center">
//           <p className="font-semibold text-white">
//             Chargement des conversations
//           </p>
//           <p className="mt-1 text-sm text-slate-500">
//             Vos messages arrivent…
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ChatContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const conversationId = searchParams.get('convId');

//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [currentConversation, setCurrentConversation] =
//     useState<Conversation | null>(null);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [otherUser, setOtherUser] = useState<User | null>(null);
//   const [otherUsers, setOtherUsers] = useState<Record<string, User>>({});
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   const formatLastActivity = (timestamp: Date) => {
//     const msgDate = new Date(timestamp);
//     const now = new Date();

//     const today = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate()
//     );

//     const msgDay = new Date(
//       msgDate.getFullYear(),
//       msgDate.getMonth(),
//       msgDate.getDate()
//     );

//     const diffDays = Math.floor(
//       (today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24)
//     );

//     const timeStr = msgDate.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit'
//     });

//     if (diffDays === 0) {
//       return `Aujourd'hui à ${timeStr}`;
//     }

//     if (diffDays === 1) {
//       return `Hier à ${timeStr}`;
//     }

//     if (diffDays < 7) {
//       const days = [
//         'Dimanche',
//         'Lundi',
//         'Mardi',
//         'Mercredi',
//         'Jeudi',
//         'Vendredi',
//         'Samedi'
//       ];

//       return `${days[msgDate.getDay()]} à ${timeStr}`;
//     }

//     return `${msgDate.toLocaleDateString()} à ${timeStr}`;
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       window.location.href = '/';
//       return;
//     }

//     fetchData(token);
//   }, [conversationId]);

//   const fetchData = async (token: string) => {
//     setLoading(true);

//     try {
//       // 1. Récupérer l'utilisateur courant
//       const userResponse = await axios.get(`${API_URL}/users/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const currentUserData = userResponse.data;
//       setCurrentUser(currentUserData);

//       // 2. Récupérer les conversations
//       const convResponse = await axios.get(
//         `${API_URL}/users/conversations`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       const conversationsData = convResponse.data;
//       setConversations(conversationsData);

//       // 3. Charger les autres utilisateurs
//       const usersMap: Record<string, User> = {};

//       for (const conv of conversationsData) {
//         const otherId = conv.participants.find(
//           (id: string) => id !== currentUserData._id
//         );

//         if (otherId && !usersMap[otherId]) {
//           try {
//             const otherRes = await axios.get(
//               `${API_URL}/users/${otherId}`,
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`
//                 }
//               }
//             );

//             usersMap[otherId] = otherRes.data;
//           } catch (err: any) {
//             if (err.response?.status === 404) {
//               console.warn('Utilisateur introuvable :', otherId);

//               usersMap[otherId] = {
//                 _id: otherId,
//                 name: 'Utilisateur supprimé',
//                 phone: '',
//                 role: 'parent',
//                 isActive: false,
//                 createdAt: new Date()
//               };
//             } else {
//               console.error(
//                 'Erreur lors du chargement de l’utilisateur :',
//                 err
//               );
//             }
//           }
//         }
//       }

//       setOtherUsers(usersMap);

//       // 4. Déterminer la conversation sélectionnée
//       if (conversationId) {
//         const conversation = conversationsData.find(
//           (item: Conversation) => item._id === conversationId
//         );

//         if (conversation) {
//           setCurrentConversation(conversation);

//           const otherId = conversation.participants.find(
//             (id: string) => id !== currentUserData._id
//           );

//           setOtherUser(
//             otherId && usersMap[otherId] ? usersMap[otherId] : null
//           );
//         } else {
//           setCurrentConversation(null);
//           setOtherUser(null);
//         }
//       } else {
//         setCurrentConversation(null);
//         setOtherUser(null);
//       }
//     } catch (error) {
//       console.error('Erreur de chargement :', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewMessage = (message: Message) => {
//     setCurrentConversation((previousConversation) => {
//       if (!previousConversation) return previousConversation;

//       const messages = previousConversation.messages || [];
//       const alreadyExists = messages.some(
//         (item) => item._id === message._id
//       );

//       if (alreadyExists) return previousConversation;

//       return {
//         ...previousConversation,
//         messages: [...messages, message]
//       };
//     });
//   };

//   const handleDeleteMessage = (messageId: string) => {
//     setCurrentConversation((previousConversation) => {
//       if (!previousConversation) return previousConversation;

//       return {
//         ...previousConversation,
//         messages: (previousConversation.messages || []).filter(
//           (message) => message._id !== messageId
//         )
//       };
//     });
//   };

//   const handleEditMessage = (
//     messageId: string,
//     newContent: string
//   ) => {
//     setCurrentConversation((previousConversation) => {
//       if (!previousConversation) return previousConversation;

//       return {
//         ...previousConversation,
//         messages: (previousConversation.messages || []).map(
//           (message) =>
//             message._id === messageId
//               ? { ...message, content: newContent }
//               : message
//         )
//       };
//     });
//   };

//   const visibleConversations = conversations.filter((conversation) => {
//     const otherId = conversation.participants.find(
//       (id) => id !== currentUser?._id
//     );

//     const other = otherId ? otherUsers[otherId] : null;
//     const lastMessage =
//       conversation.messages?.[conversation.messages.length - 1];

//     const searchableContent = [
//       other?.name,
//       other?.role,
//       lastMessage?.content
//     ]
//       .filter(Boolean)
//       .join(' ')
//       .toLowerCase();

//     return searchableContent.includes(searchTerm.trim().toLowerCase());
//   });

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   if (currentConversation && currentUser && otherUser) {
//     return (
//       <div className="relative min-h-screen bg-slate-950 pb-24 md:pb-28">
//         <div
//           aria-hidden="true"
//           className="pointer-events-none fixed inset-0 overflow-hidden"
//         >
//           <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-3xl" />
//           <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/[0.05] blur-3xl" />
//         </div>

//         <div className="relative mx-auto min-h-screen w-full max-w-7xl">
//           <ChatWindow
//             conversationId={currentConversation._id}
//             currentUserId={currentUser._id}
//             otherUser={otherUser}
//             messages={currentConversation.messages || []}
//             onNewMessage={handleNewMessage}
//             onDeleteMessage={handleDeleteMessage}
//             onEditMessage={handleEditMessage}
//           />
//         </div>

//         <MobileNav userRole={currentUser.role} />
//       </div>
//     );
//   }

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 pb-28 text-white md:pb-32">
//       {/* Décor d’arrière-plan */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0"
//       >
//         <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-emerald-500/[0.08] blur-3xl" />
//         <div className="absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.06] blur-3xl" />
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:42px_42px]" />
//       </div>

//       <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
//         {/* En-tête */}
//         <header className="mb-8 md:mb-10">
//           <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-semibold text-emerald-300">
//                 <ShieldCheck size={14} />
//                 Messagerie personnelle
//               </div>

//               <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
//                 Mes conversations
//               </h1>

//               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
//                 Retrouvez vos échanges avec les parents et les répétiteurs
//                 dans un espace simple et organisé.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-3 sm:flex">
//               <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
//                 <div className="flex items-center gap-2 text-slate-400">
//                   <MessagesSquare size={15} />
//                   <span className="text-xs font-medium">Conversations</span>
//                 </div>

//                 <p className="mt-1 text-xl font-bold text-white">
//                   {conversations.length}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
//                 <div className="flex items-center gap-2 text-slate-400">
//                   <Users size={15} />
//                   <span className="text-xs font-medium">Contacts</span>
//                 </div>

//                 <p className="mt-1 text-xl font-bold text-white">
//                   {Object.keys(otherUsers).length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Conteneur principal */}
//         <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/60 shadow-2xl shadow-black/20 backdrop-blur-xl">
//           <div className="border-b border-white/[0.07] p-4 sm:p-5 lg:p-6">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h2 className="font-semibold text-white">
//                   Boîte de réception
//                 </h2>
//                 <p className="mt-1 text-xs text-slate-500 sm:text-sm">
//                   Sélectionnez une conversation pour afficher les messages.
//                 </p>
//               </div>

//               <div className="relative w-full sm:max-w-xs">
//                 <Search
//                   size={17}
//                   aria-hidden="true"
//                   className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
//                 />

//                 <input
//                   type="search"
//                   value={searchTerm}
//                   onChange={(event) => setSearchTerm(event.target.value)}
//                   placeholder="Rechercher…"
//                   aria-label="Rechercher une conversation"
//                   className="
//                     h-11 w-full rounded-xl border border-white/[0.08]
//                     bg-slate-950/60 pl-10 pr-4 text-sm text-white
//                     outline-none transition
//                     placeholder:text-slate-600
//                     hover:border-white/[0.14]
//                     focus:border-emerald-400/50
//                     focus:ring-4 focus:ring-emerald-400/[0.08]
//                   "
//                 />
//               </div>
//             </div>
//           </div>

//           {conversations.length === 0 ? (
//             <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
//               <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.08]">
//                 <div className="absolute inset-3 rounded-2xl bg-emerald-400/10 blur-xl" />
//                 <MessageCircle
//                   size={34}
//                   className="relative text-emerald-400"
//                 />
//               </div>

//               <h3 className="text-xl font-bold text-white">
//                 Aucune conversation
//               </h3>

//               <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
//                 Recherchez un répétiteur et démarrez une conversation.
//                 Vos futurs échanges apparaîtront ici.
//               </p>
//             </div>
//           ) : visibleConversations.length === 0 ? (
//             <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center">
//               <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
//                 <Search size={28} />
//               </div>

//               <h3 className="font-semibold text-white">
//                 Aucun résultat
//               </h3>

//               <p className="mt-2 text-sm text-slate-500">
//                 Essayez avec un autre nom ou un autre message.
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-white/[0.06]">
//               {visibleConversations.map((conversation) => {
//                 const otherId = conversation.participants.find(
//                   (id) => id !== currentUser?._id
//                 );

//                 const other = otherId
//                   ? otherUsers[otherId]
//                   : null;

//                 const messages = conversation.messages || [];
//                 const lastMessage = messages[messages.length - 1];
//                 const isTutor = other?.role === 'tutor';
//                 const isDeleted = !other?.isActive;

//                 return (
//                   <button
//                     key={conversation._id}
//                     type="button"
//                     onClick={() =>
//                       router.push(`/chat?convId=${conversation._id}`)
//                     }
//                     className="
//                       group relative flex w-full items-center gap-3
//                       px-4 py-4 text-left transition duration-200
//                       hover:bg-white/[0.04]
//                       focus-visible:z-10 focus-visible:outline-none
//                       focus-visible:ring-2 focus-visible:ring-inset
//                       focus-visible:ring-emerald-400/70
//                       sm:gap-4 sm:px-5 sm:py-5 lg:px-6
//                     "
//                   >
//                     <span className="absolute bottom-3 left-0 top-3 w-0.5 scale-y-0 rounded-full bg-emerald-400 transition-transform duration-200 group-hover:scale-y-100" />

//                     {/* Avatar */}
//                     <div className="relative shrink-0">
//                       <div
//                         className={`
//                           flex h-12 w-12 items-center justify-center
//                           rounded-2xl border text-base font-bold
//                           shadow-lg sm:h-14 sm:w-14 sm:text-lg
//                           ${
//                             isDeleted
//                               ? 'border-slate-700 bg-slate-800 text-slate-500'
//                               : isTutor
//                                 ? 'border-emerald-400/20 bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 shadow-emerald-950/30'
//                                 : 'border-cyan-400/20 bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-cyan-950/30'
//                           }
//                         `}
//                       >
//                         {other?.name?.charAt(0)?.toUpperCase() || '?'}
//                       </div>

//                       {!isDeleted && (
//                         <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-slate-900 bg-emerald-400" />
//                       )}
//                     </div>

//                     {/* Contenu */}
//                     <div className="min-w-0 flex-1">
//                       <div className="flex min-w-0 items-center gap-2">
//                         <h3 className="truncate font-semibold text-white sm:text-base">
//                           {other?.name || 'Utilisateur'}
//                         </h3>

//                         <span
//                           className={`
//                             hidden shrink-0 rounded-full px-2 py-0.5
//                             text-[10px] font-semibold sm:inline-flex
//                             ${
//                               isTutor
//                                 ? 'bg-emerald-400/10 text-emerald-300'
//                                 : 'bg-cyan-400/10 text-cyan-300'
//                             }
//                           `}
//                         >
//                           {isTutor ? 'Répétiteur' : 'Parent'}
//                         </span>
//                       </div>

//                       <p className="mt-1 text-xs font-medium text-slate-500 sm:hidden">
//                         {isTutor ? 'Répétiteur' : 'Parent'}
//                       </p>

//                       <p className="mt-1.5 truncate text-sm text-slate-400 transition-colors group-hover:text-slate-300">
//                         {lastMessage ? (
//                           <>
//                             {lastMessage.senderId === currentUser?._id && (
//                               <span className="font-medium text-slate-300">
//                                 Vous :{' '}
//                               </span>
//                             )}

//                             {lastMessage.content}
//                           </>
//                         ) : (
//                           <span className="italic text-slate-600">
//                             Aucun message
//                           </span>
//                         )}
//                       </p>
//                     </div>

//                     {/* Date et flèche */}
//                     <div className="flex shrink-0 flex-col items-end gap-2">
//                       <span className="flex items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
//                         <Clock3
//                           size={12}
//                           className="hidden sm:block"
//                         />
//                         <span className="max-w-[82px] truncate sm:max-w-none">
//                           {formatLastActivity(
//                             conversation.lastActivity
//                           )}
//                         </span>
//                       </span>

//                       <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-slate-500 transition-all duration-200 group-hover:border-emerald-400/20 group-hover:bg-emerald-400/10 group-hover:text-emerald-400">
//                         <ArrowRight
//                           size={15}
//                           className="transition-transform group-hover:translate-x-0.5"
//                         />
//                       </span>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </div>

//       <MobileNav userRole={currentUser?.role} />
//     </main>
//   );
// }

// export default function ChatPage() {
//   return (
//     <Suspense fallback={<LoadingScreen />}>
//       <ChatContent />
//     </Suspense>
//   );
// }

























































'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import {
  ArrowRight,
  Clock3,
  MessageCircle,
  MessagesSquare,
  Search,
  ShieldCheck,
  Users
} from 'lucide-react';

import ChatWindow from '@/components/ChatWindow';
import MobileNav from '@/components/MobileNav';
import { Conversation, Message, User } from '@/types';
import { API_URL } from '@/lib/api';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-emerald-400/20" />
          <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-400" />

          <MessageCircle
            size={22}
            className="text-emerald-400"
            aria-hidden="true"
          />
        </div>

        <div className="text-center">
          <p className="font-semibold text-white">
            Chargement des conversations
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Vos messages arrivent…
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('convId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [otherUsers, setOtherUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const formatLastActivity = (timestamp: Date) => {
    const msgDate = new Date(timestamp);
    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const msgDay = new Date(
      msgDate.getFullYear(),
      msgDate.getMonth(),
      msgDate.getDate()
    );

    const diffDays = Math.floor(
      (today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    const timeStr = msgDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (diffDays === 0) {
      return `Aujourd'hui à ${timeStr}`;
    }

    if (diffDays === 1) {
      return `Hier à ${timeStr}`;
    }

    if (diffDays < 7) {
      const days = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
      ];

      return `${days[msgDate.getDay()]} à ${timeStr}`;
    }

    return `${msgDate.toLocaleDateString()} à ${timeStr}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/';
      return;
    }

    fetchData(token);
  }, [conversationId]);

  const fetchData = async (token: string) => {
    setLoading(true);

    try {
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const currentUserData = userResponse.data;
      setCurrentUser(currentUserData);

      const convResponse = await axios.get(
        `${API_URL}/users/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const conversationsData = convResponse.data;
      setConversations(conversationsData);

      const usersMap: Record<string, User> = {};

      for (const conv of conversationsData) {
        const otherId = conv.participants.find(
          (id: string) => id !== currentUserData._id
        );

        if (otherId && !usersMap[otherId]) {
          try {
            const otherRes = await axios.get(
              `${API_URL}/users/${otherId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            usersMap[otherId] = otherRes.data;
          } catch (err: any) {
            if (err.response?.status === 404) {
              console.warn('Utilisateur introuvable :', otherId);

              usersMap[otherId] = {
                _id: otherId,
                name: 'Utilisateur supprimé',
                phone: '',
                role: 'parent',
                isActive: false,
                createdAt: new Date()
              };
            } else {
              console.error(
                'Erreur lors du chargement de l’utilisateur :',
                err
              );
            }
          }
        }
      }

      setOtherUsers(usersMap);

      if (conversationId) {
        const conversation = conversationsData.find(
          (item: Conversation) => item._id === conversationId
        );

        if (conversation) {
          setCurrentConversation(conversation);

          const otherId = conversation.participants.find(
            (id: string) => id !== currentUserData._id
          );

          setOtherUser(
            otherId && usersMap[otherId] ? usersMap[otherId] : null
          );
        } else {
          setCurrentConversation(null);
          setOtherUser(null);
        }
      } else {
        setCurrentConversation(null);
        setOtherUser(null);
      }
    } catch (error) {
      console.error('Erreur de chargement :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    setCurrentConversation((previousConversation) => {
      if (!previousConversation) return previousConversation;

      const messages = previousConversation.messages || [];
      const alreadyExists = messages.some(
        (item) => item._id === message._id
      );

      if (alreadyExists) return previousConversation;

      return {
        ...previousConversation,
        messages: [...messages, message]
      };
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setCurrentConversation((previousConversation) => {
      if (!previousConversation) return previousConversation;

      return {
        ...previousConversation,
        messages: (previousConversation.messages || []).filter(
          (message) => message._id !== messageId
        )
      };
    });
  };

  const handleEditMessage = (
    messageId: string,
    newContent: string
  ) => {
    setCurrentConversation((previousConversation) => {
      if (!previousConversation) return previousConversation;

      return {
        ...previousConversation,
        messages: (previousConversation.messages || []).map(
          (message) =>
            message._id === messageId
              ? { ...message, content: newContent }
              : message
        )
      };
    });
  };

  const visibleConversations = conversations.filter((conversation) => {
    const otherId = conversation.participants.find(
      (id) => id !== currentUser?._id
    );

    const other = otherId ? otherUsers[otherId] : null;
    const lastMessage =
      conversation.messages?.[conversation.messages.length - 1];

    const searchableContent = [
      other?.name,
      other?.role,
      lastMessage?.content
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableContent.includes(searchTerm.trim().toLowerCase());
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (currentConversation && currentUser && otherUser) {
    return (
      <>
        {/* ============================================================
            Vue conversation ouverte
            - top-10        : sous la barre utilitaire du layout (h-10)
            - bottom-16     : au-dessus de la bottom nav mobile
            - md:bottom-0   : plein écran vertical en desktop
            - md:left-64    : à droite de la sidebar desktop
        ============================================================= */}
        <div className="fixed inset-x-0 bottom-16 top-10 z-0 md:bottom-0 md:left-64">
          <ChatWindow
            conversationId={currentConversation._id}
            currentUserId={currentUser._id}
            otherUser={otherUser}
            messages={currentConversation.messages || []}
            onNewMessage={handleNewMessage}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
          />
        </div>

        <MobileNav userRole={currentUser.role} />
      </>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Décor d’arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-emerald-500/[0.08] blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.06] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* En-tête */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <ShieldCheck size={14} />
                Messagerie personnelle
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Mes conversations
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Retrouvez vos échanges avec les parents et les répétiteurs
                dans un espace simple et organisé.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-slate-400">
                  <MessagesSquare size={15} />
                  <span className="text-xs font-medium">Conversations</span>
                </div>

                <p className="mt-1 text-xl font-bold text-white">
                  {conversations.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={15} />
                  <span className="text-xs font-medium">Contacts</span>
                </div>

                <p className="mt-1 text-xl font-bold text-white">
                  {Object.keys(otherUsers).length}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Conteneur principal */}
        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/60 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="border-b border-white/[0.07] p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Boîte de réception
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Sélectionnez une conversation pour afficher les messages.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Rechercher…"
                  aria-label="Rechercher une conversation"
                  className="
                    h-11 w-full rounded-xl border border-white/[0.08]
                    bg-slate-950/60 pl-10 pr-4 text-sm text-white
                    outline-none transition
                    placeholder:text-slate-600
                    hover:border-white/[0.14]
                    focus:border-emerald-400/50
                    focus:ring-4 focus:ring-emerald-400/[0.08]
                  "
                />
              </div>
            </div>
          </div>

          {conversations.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.08]">
                <div className="absolute inset-3 rounded-2xl bg-emerald-400/10 blur-xl" />
                <MessageCircle
                  size={34}
                  className="relative text-emerald-400"
                />
              </div>

              <h3 className="text-xl font-bold text-white">
                Aucune conversation
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Recherchez un répétiteur et démarrez une conversation.
                Vos futurs échanges apparaîtront ici.
              </p>
            </div>
          ) : visibleConversations.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
                <Search size={28} />
              </div>

              <h3 className="font-semibold text-white">
                Aucun résultat
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Essayez avec un autre nom ou un autre message.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {visibleConversations.map((conversation) => {
                const otherId = conversation.participants.find(
                  (id) => id !== currentUser?._id
                );

                const other = otherId
                  ? otherUsers[otherId]
                  : null;

                const messages = conversation.messages || [];
                const lastMessage = messages[messages.length - 1];
                const isTutor = other?.role === 'tutor';
                const isDeleted = !other?.isActive;

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() =>
                      router.push(`/chat?convId=${conversation._id}`)
                    }
                    className="
                      group relative flex w-full items-center gap-3
                      px-4 py-4 text-left transition duration-200
                      hover:bg-white/[0.04]
                      focus-visible:z-10 focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-inset
                      focus-visible:ring-emerald-400/70
                      sm:gap-4 sm:px-5 sm:py-5 lg:px-6
                    "
                  >
                    <span className="absolute bottom-3 left-0 top-3 w-0.5 scale-y-0 rounded-full bg-emerald-400 transition-transform duration-200 group-hover:scale-y-100" />

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={`
                          flex h-12 w-12 items-center justify-center
                          rounded-2xl border text-base font-bold
                          shadow-lg sm:h-14 sm:w-14 sm:text-lg
                          ${
                            isDeleted
                              ? 'border-slate-700 bg-slate-800 text-slate-500'
                              : isTutor
                                ? 'border-emerald-400/20 bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 shadow-emerald-950/30'
                                : 'border-cyan-400/20 bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-cyan-950/30'
                          }
                        `}
                      >
                        {other?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>

                      {!isDeleted && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-slate-900 bg-emerald-400" />
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate font-semibold text-white sm:text-base">
                          {other?.name || 'Utilisateur'}
                        </h3>

                        <span
                          className={`
                            hidden shrink-0 rounded-full px-2 py-0.5
                            text-[10px] font-semibold sm:inline-flex
                            ${
                              isTutor
                                ? 'bg-emerald-400/10 text-emerald-300'
                                : 'bg-cyan-400/10 text-cyan-300'
                            }
                          `}
                        >
                          {isTutor ? 'Répétiteur' : 'Parent'}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-slate-500 sm:hidden">
                        {isTutor ? 'Répétiteur' : 'Parent'}
                      </p>

                      <p className="mt-1.5 truncate text-sm text-slate-400 transition-colors group-hover:text-slate-300">
                        {lastMessage ? (
                          <>
                            {lastMessage.senderId === currentUser?._id && (
                              <span className="font-medium text-slate-300">
                                Vous :{' '}
                              </span>
                            )}

                            {lastMessage.content}
                          </>
                        ) : (
                          <span className="italic text-slate-600">
                            Aucun message
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Date et flèche */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
                        <Clock3
                          size={12}
                          className="hidden sm:block"
                        />
                        <span className="max-w-[82px] truncate sm:max-w-none">
                          {formatLastActivity(
                            conversation.lastActivity
                          )}
                        </span>
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-slate-500 transition-all duration-200 group-hover:border-emerald-400/20 group-hover:bg-emerald-400/10 group-hover:text-emerald-400">
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <MobileNav userRole={currentUser?.role} />
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ChatContent />
    </Suspense>
  );
}