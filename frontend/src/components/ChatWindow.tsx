

// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
// import axios from 'axios';
// import {
//   Edit3,
//   MapPin,
//   MessageCircle,
//   MoreHorizontal,
//   Send,
//   Trash2,
//   X
// } from 'lucide-react';

// import { Message, User } from '@/types';
// import { SOCKET_URL, API_URL } from '@/lib/api';

// interface ChatWindowProps {
//   conversationId: string;
//   currentUserId: string;
//   otherUser: User;
//   messages: Message[];
//   onNewMessage: (message: Message) => void;
//   onDeleteMessage?: (messageId: string) => void;
//   onEditMessage?: (messageId: string, newContent: string) => void;
// }

// const ChatWindow = ({
//   conversationId,
//   currentUserId,
//   otherUser,
//   messages,
//   onNewMessage,
//   onDeleteMessage,
//   onEditMessage,
// }: ChatWindowProps) => {
//   const [input, setInput] = useState('');
//   const [showMenu, setShowMenu] = useState<string | null>(null);
//   const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
//   const socketRef = useRef<Socket | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const editInputRef = useRef<HTMLInputElement>(null);

//   // ✅ REF POUR GARDER LES MESSAGES À JOUR
//   const messagesRef = useRef<Message[]>(messages);

//   // ✅ Synchroniser la ref avec les props
//   useEffect(() => {
//     messagesRef.current = messages;
//   }, [messages]);

//   const formatMessageTime = (timestamp: Date) => {
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
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   useEffect(() => {
//     const socket = io(SOCKET_URL, {
//       auth: { userId: currentUserId },
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('✅ Socket connecté');
//       socket.emit('join_conversation', conversationId);
//     });

//     // ✅ CORRECTION : Utiliser messagesRef.current au lieu de messages
//     socket.on('new_message', (message: Message) => {
//       console.log('📩 Nouveau message reçu:', message);

//       // Vérifier avec la ref toujours à jour
//       const exists = messagesRef.current.some(m =>
//         m._id === message._id ||
//         (
//           m.content === message.content &&
//           m.senderId === message.senderId &&
//           Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
//         )
//       );

//       if (!exists) {
//         onNewMessage(message);
//       } else {
//         console.log('⚠️ Message ignoré (doublon)');
//       }
//     });

//     socket.on('message_deleted', (data: { messageId: string }) => {
//       console.log('🗑️ Message supprimé via socket:', data.messageId);
//       if (onDeleteMessage) {
//         onDeleteMessage(data.messageId);
//       }
//     });

//     socket.on('message_edited', (data: { messageId: string; content: string }) => {
//       console.log('✏️ Message modifié via socket:', data);
//       if (onEditMessage) {
//         onEditMessage(data.messageId, data.content);
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [conversationId, currentUserId]);

//   const handleSend = () => {
//     if (!input.trim() || !socketRef.current) return;

//     socketRef.current.emit('send_message', {
//       conversationId,
//       content: input,
//       receiverId: otherUser._id,
//     });

//     setInput('');
//     inputRef.current?.focus();
//   };

//   const handleDeleteMessage = async (messageId: string) => {
//     if (!messageId) {
//       console.error('❌ messageId undefined');
//       return;
//     }

//     if (!confirm('Supprimer ce message ?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(
//         `${API_URL}/users/conversation/${conversationId}/message/${messageId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setShowMenu(null);
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//     }
//   };

//   const startEditMessage = (msg: Message) => {
//     if (!msg._id) return;
//     console.log('📝 Édition du message ID:', msg._id);
//     setEditingMessage({ id: msg._id, content: msg.content });
//     setShowMenu(null);
//     setTimeout(() => editInputRef.current?.focus(), 100);
//   };

//   const saveEditMessage = async () => {
//     if (!editingMessage?.id) {
//       console.error('❌ editingMessage.id undefined');
//       return;
//     }
//     if (!editingMessage?.content.trim()) return;

//     console.log('💾 Sauvegarde édition ID:', editingMessage.id);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API_URL}/users/conversation/${conversationId}/message/${editingMessage.id}`,
//         { content: editingMessage.content },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setEditingMessage(null);
//     } catch (error) {
//       console.error('Erreur modification:', error);
//       alert('Impossible de modifier le message');
//     }
//   };

//   const cancelEdit = () => {
//     setEditingMessage(null);
//   };

//   const sortedMessages = [...messages].sort(
//     (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
//   );

//   return (
//     <div className="fixed inset-0 bg-slate-950 text-white">
//       {/* Background decoration */}
//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
//         <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
//         <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl" />
//       </div>

//       <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col border-x border-white/5 bg-slate-950/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
//         {/* Header */}
//         <header className="shrink-0 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-6">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
//                 {otherUser.name?.charAt(0).toUpperCase()}
//               </div>

//               <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
//             </div>

//             <div className="min-w-0 flex-1">
//               <div className="flex items-center gap-2">
//                 <h3 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
//                   {otherUser.name}
//                 </h3>

//                 <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 sm:inline-flex">
//                   Conversation
//                 </span>
//               </div>

//               <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-400 sm:text-sm">
//                 <MapPin size={14} className="shrink-0 text-emerald-400" />
//                 {otherUser.city} - {otherUser.district}
//               </p>
//             </div>

//             <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right sm:block">
//               <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
//                 Boch237
//               </p>
//               <p className="mt-0.5 text-xs font-medium text-emerald-300">
//                 Messagerie
//               </p>
//             </div>
//           </div>
//         </header>

//         {/* Messages */}
//         <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
//           {sortedMessages.length === 0 ? (
//             <div className="flex h-full min-h-96 flex-col items-center justify-center text-center">
//               <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 text-emerald-400 shadow-2xl shadow-black/20">
//                 <MessageCircle size={30} />
//               </div>

//               <h3 className="mt-5 text-lg font-semibold text-white">
//                 Aucun message pour le moment
//               </h3>

//               <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
//                 Envoyez un premier message à {otherUser.name} pour démarrer la conversation.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {sortedMessages.map((msg, index) => {
//                 const isMine = msg.senderId === currentUserId;

//                 return (
//                   <div
//                     key={msg._id || `msg-${index}`}
//                     className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`group relative max-w-[82%] sm:max-w-[72%] ${
//                         isMine ? 'items-end' : 'items-start'
//                       }`}
//                     >
//                       <div
//                         className={`relative rounded-3xl px-4 py-3 shadow-lg backdrop-blur ${
//                           isMine
//                             ? 'rounded-br-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-950/20'
//                             : 'rounded-bl-md border border-white/10 bg-slate-900/90 text-slate-200 shadow-black/20'
//                         }`}
//                         onContextMenu={(e) => {
//                           e.preventDefault();
//                           if (msg.senderId === currentUserId && msg._id) {
//                             setShowMenu(showMenu === msg._id ? null : msg._id ?? null);
//                           }
//                         }}
//                       >
//                         <p className="whitespace-pre-wrap break-words text-sm leading-6">
//                           {msg.content}
//                         </p>

//                         <div
//                           className={`mt-2 flex items-center gap-2 text-[10px] ${
//                             isMine ? 'text-emerald-50/75' : 'text-slate-500'
//                           }`}
//                         >
//                           {msg.edited && (
//                             <span className="rounded-full bg-black/10 px-1.5 py-0.5">
//                               modifié
//                             </span>
//                           )}

//                           <span>
//                             {formatMessageTime(msg.timestamp)}
//                           </span>
//                         </div>

//                         {isMine && msg._id && (
//                           <button
//                             type="button"
//                             onClick={() => setShowMenu(showMenu === msg._id ? null : msg._id ?? null)}
//                             className="absolute -left-9 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-slate-400 opacity-0 shadow-lg transition hover:text-white group-hover:flex group-hover:opacity-100"
//                             aria-label="Options du message"
//                           >
//                             <MoreHorizontal size={16} />
//                           </button>
//                         )}

//                         {showMenu === msg._id && (
//                           <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl shadow-black/40 backdrop-blur-xl">
//                             <button
//                               onClick={() => startEditMessage(msg)}
//                               className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-200 transition hover:bg-white/5 hover:text-emerald-300"
//                             >
//                               <Edit3 size={14} />
//                               Modifier
//                             </button>

//                             <button
//                               onClick={() => handleDeleteMessage(msg._id!)}
//                               className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
//                             >
//                               <Trash2 size={14} />
//                               Supprimer
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </main>

//         {/* Input */}
//         <footer className="shrink-0 border-t border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur-xl sm:px-6">
//           <div className="flex items-end gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl shadow-black/20">
//             <input
//               ref={inputRef}
//               type="text"
//               className="min-h-11 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//               placeholder="Écrire un message..."
//             />

//             <button
//               onClick={handleSend}
//               disabled={!input.trim()}
//               className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
//               aria-label="Envoyer le message"
//             >
//               <Send size={18} />
//             </button>
//           </div>

//           <p className="mt-2 text-center text-[10px] text-slate-600">
//             Appuyez sur Entrée pour envoyer
//           </p>
//         </footer>
//       </div>

//       {/* Edit modal */}
//       {editingMessage && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
//           <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
//             <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

//             <div className="relative p-5 sm:p-6">
//               <div className="mb-5 flex items-start justify-between gap-4">
//                 <div>
//                   <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
//                     <Edit3 size={21} />
//                   </div>

//                   <h3 className="text-lg font-bold tracking-tight text-white">
//                     Modifier le message
//                   </h3>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Corrigez votre message puis enregistrez.
//                   </p>
//                 </div>

//                 <button
//                   onClick={cancelEdit}
//                   className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
//                   aria-label="Fermer"
//                 >
//                   <X size={17} />
//                 </button>
//               </div>

//               <input
//                 ref={editInputRef}
//                 type="text"
//                 value={editingMessage.content}
//                 onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
//                 className="w-full rounded-2xl border border-emerald-400/30 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 shadow-inner focus:border-emerald-400 focus:outline-none"
//                 autoFocus
//               />

//               <div className="mt-5 flex gap-3">
//                 <button
//                   onClick={saveEditMessage}
//                   disabled={!editingMessage.content.trim()}
//                   className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
//                 >
//                   Enregistrer
//                 </button>

//                 <button
//                   onClick={cancelEdit}
//                   className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWindow;













































































'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import {
  Edit3,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
  X
} from 'lucide-react';

import { Message, User } from '@/types';
import { SOCKET_URL, API_URL } from '@/lib/api';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: User;
  messages: Message[];
  onNewMessage: (message: Message) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
}

const ChatWindow = ({
  conversationId,
  currentUserId,
  otherUser,
  messages,
  onNewMessage,
  onDeleteMessage,
  onEditMessage,
}: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // ✅ REF POUR GARDER LES MESSAGES À JOUR
  const messagesRef = useRef<Message[]>(messages);

  // ✅ Synchroniser la ref avec les props
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const formatMessageTime = (timestamp: Date) => {
    const msgDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

    const diffDays = Math.floor((today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24));

    const timeStr = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffDays === 0) {
      return `Aujourd'hui à ${timeStr}`;
    } else if (diffDays === 1) {
      return `Hier à ${timeStr}`;
    } else if (diffDays < 7) {
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      return `${days[msgDate.getDay()]} à ${timeStr}`;
    } else {
      return `${msgDate.toLocaleDateString()} à ${timeStr}`;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connecté');
      socket.emit('join_conversation', conversationId);
    });

    // ✅ CORRECTION : Utiliser messagesRef.current au lieu de messages
    socket.on('new_message', (message: Message) => {
      console.log('📩 Nouveau message reçu:', message);

      // Vérifier avec la ref toujours à jour
      const exists = messagesRef.current.some(m =>
        m._id === message._id ||
        (
          m.content === message.content &&
          m.senderId === message.senderId &&
          Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
        )
      );

      if (!exists) {
        onNewMessage(message);
      } else {
        console.log('⚠️ Message ignoré (doublon)');
      }
    });

    socket.on('message_deleted', (data: { messageId: string }) => {
      console.log('🗑️ Message supprimé via socket:', data.messageId);
      if (onDeleteMessage) {
        onDeleteMessage(data.messageId);
      }
    });

    socket.on('message_edited', (data: { messageId: string; content: string }) => {
      console.log('✏️ Message modifié via socket:', data);
      if (onEditMessage) {
        onEditMessage(data.messageId, data.content);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, currentUserId]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      conversationId,
      content: input,
      receiverId: otherUser._id,
    });

    setInput('');
    inputRef.current?.focus();
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!messageId) {
      console.error('❌ messageId undefined');
      return;
    }

    if (!confirm('Supprimer ce message ?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/users/conversation/${conversationId}/message/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setShowMenu(null);
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const startEditMessage = (msg: Message) => {
    if (!msg._id) return;
    console.log('📝 Édition du message ID:', msg._id);
    setEditingMessage({ id: msg._id, content: msg.content });
    setShowMenu(null);
    setTimeout(() => editInputRef.current?.focus(), 100);
  };

  const saveEditMessage = async () => {
    if (!editingMessage?.id) {
      console.error('❌ editingMessage.id undefined');
      return;
    }
    if (!editingMessage?.content.trim()) return;

    console.log('💾 Sauvegarde édition ID:', editingMessage.id);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/users/conversation/${conversationId}/message/${editingMessage.id}`,
        { content: editingMessage.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingMessage(null);
    } catch (error) {
      console.error('Erreur modification:', error);
      alert('Impossible de modifier le message');
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
  );

  return (
    <div className="relative flex h-full w-full flex-col bg-slate-950 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col border-x border-white/5 bg-slate-950/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
        {/* Header */}
        <header className="shrink-0 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                {otherUser.name?.charAt(0).toUpperCase()}
              </div>

              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                  {otherUser.name}
                </h3>

                <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 sm:inline-flex">
                  Conversation
                </span>
              </div>

              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-400 sm:text-sm">
                <MapPin size={14} className="shrink-0 text-emerald-400" />
                {otherUser.city} - {otherUser.district}
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right sm:block">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Boch237
              </p>
              <p className="mt-0.5 text-xs font-medium text-emerald-300">
                Messagerie
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {sortedMessages.length === 0 ? (
            <div className="flex h-full min-h-96 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 text-emerald-400 shadow-2xl shadow-black/20">
                <MessageCircle size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                Aucun message pour le moment
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Envoyez un premier message à {otherUser.name} pour démarrer la conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMessages.map((msg, index) => {
                const isMine = msg.senderId === currentUserId;

                return (
                  <div
                    key={msg._id || `msg-${index}`}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`group relative max-w-[82%] sm:max-w-[72%] ${
                        isMine ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`relative rounded-3xl px-4 py-3 shadow-lg backdrop-blur ${
                          isMine
                            ? 'rounded-br-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-950/20'
                            : 'rounded-bl-md border border-white/10 bg-slate-900/90 text-slate-200 shadow-black/20'
                        }`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (msg.senderId === currentUserId && msg._id) {
                            setShowMenu(showMenu === msg._id ? null : msg._id ?? null);
                          }
                        }}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                          {msg.content}
                        </p>

                        <div
                          className={`mt-2 flex items-center gap-2 text-[10px] ${
                            isMine ? 'text-emerald-50/75' : 'text-slate-500'
                          }`}
                        >
                          {msg.edited && (
                            <span className="rounded-full bg-black/10 px-1.5 py-0.5">
                              modifié
                            </span>
                          )}

                          <span>
                            {formatMessageTime(msg.timestamp)}
                          </span>
                        </div>

                        {isMine && msg._id && (
                          <button
                            type="button"
                            onClick={() => setShowMenu(showMenu === msg._id ? null : msg._id ?? null)}
                            className="absolute -left-9 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-slate-400 opacity-0 shadow-lg transition hover:text-white group-hover:flex group-hover:opacity-100"
                            aria-label="Options du message"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        )}

                        {showMenu === msg._id && (
                          <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl shadow-black/40 backdrop-blur-xl">
                            <button
                              onClick={() => startEditMessage(msg)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-200 transition hover:bg-white/5 hover:text-emerald-300"
                            >
                              <Edit3 size={14} />
                              Modifier
                            </button>

                            <button
                              onClick={() => handleDeleteMessage(msg._id!)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input */}
        <footer className="shrink-0 border-t border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-end gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl shadow-black/20">
            <input
              ref={inputRef}
              type="text"
              className="min-h-11 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Écrire un message..."
            />

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              aria-label="Envoyer le message"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-slate-600">
            Appuyez sur Entrée pour envoyer
          </p>
        </footer>
      </div>

      {/* Edit modal */}
      {editingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                    <Edit3 size={21} />
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-white">
                    Modifier le message
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Corrigez votre message puis enregistrez.
                  </p>
                </div>

                <button
                  onClick={cancelEdit}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Fermer"
                >
                  <X size={17} />
                </button>
              </div>

              <input
                ref={editInputRef}
                type="text"
                value={editingMessage.content}
                onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
                className="w-full rounded-2xl border border-emerald-400/30 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 shadow-inner focus:border-emerald-400 focus:outline-none"
                autoFocus
              />

              <div className="mt-5 flex gap-3">
                <button
                  onClick={saveEditMessage}
                  disabled={!editingMessage.content.trim()}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  Enregistrer
                </button>

                <button
                  onClick={cancelEdit}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;