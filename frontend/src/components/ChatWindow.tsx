
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
// import axios from 'axios';
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

//     socket.on('new_message', (message: Message) => {
//       console.log('📩 Nouveau message reçu:', message);
//       onNewMessage(message);
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
//     <div className="fixed inset-0 max-w-4xl mx-auto pt-10 flex flex-col bg-slate-900 pb-16">
//       {/* Header */}
//       <div className="bg-green-600 p-4">
//         <h3 className="text-white font-bold text-lg">{otherUser.name}</h3>
//         <p className="text-green-100 text-sm">📍 {otherUser.city} - {otherUser.district}</p>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {sortedMessages.map((msg, index) => (
//           <div
//             key={msg._id || `msg-${index}`}
//             className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`relative max-w-[75%] p-3 rounded-2xl ${
//                 msg.senderId === currentUserId
//                   ? 'bg-green-600 text-white rounded-br-sm'
//                   : 'bg-slate-800 text-gray-200 rounded-bl-sm'
//               }`}
//               onContextMenu={(e) => {
//                 e.preventDefault();
//                 // Afficher le menu seulement pour ses propres messages ET si l'ID existe
//                 if (msg.senderId === currentUserId && msg._id) {
//                   setShowMenu(showMenu === msg._id ? null : msg._id);
//                 }
//               }}
//             >
//               <p className="text-sm break-words">{msg.content}</p>
//               <span className="text-[10px] opacity-70 block mt-1">
//                 {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </span>
              
//               {/* Menu contextuel (clic droit) */}
//               {showMenu === msg._id && (
//                 <div className="absolute -top-8 right-0 bg-slate-800 rounded-lg shadow-lg flex overflow-hidden z-50">
//                   <button
//                     onClick={() => startEditMessage(msg)}
//                     className="px-3 py-1.5 text-xs text-white hover:bg-slate-700 transition-colors"
//                   >
//                     ✏️ Modifier
//                   </button>
//                   <button
//                     onClick={() => handleDeleteMessage(msg._id!)}
//                     className="px-3 py-1.5 text-xs text-red-400 hover:bg-slate-700 transition-colors"
//                   >
//                     🗑️ Supprimer
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="bg-slate-800 p-3 border-t border-slate-700">
//         <div className="flex gap-2">
//           <input
//             ref={inputRef}
//             type="text"
//             className="flex-1 px-4 py-2 rounded-full bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-green-500 text-sm"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Message..."
//           />
//           <button
//             onClick={handleSend}
//             disabled={!input.trim()}
//             className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center disabled:opacity-50"
//           >
//             ➤
//           </button>
//         </div>
//       </div>

//       {/* Modal d'édition */}
//       {editingMessage && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-slate-800 rounded-xl p-4 w-full max-w-sm">
//             <h3 className="text-white font-bold mb-3">Modifier le message</h3>
//             <input
//               ref={editInputRef}
//               type="text"
//               value={editingMessage.content}
//               onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
//               className="w-full px-3 py-2 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none"
//               autoFocus
//             />
//             <div className="flex gap-2 mt-4">
//               <button onClick={saveEditMessage} className="flex-1 bg-green-600 py-2 rounded-lg text-white">
//                 Enregistrer
//               </button>
//               <button onClick={cancelEdit} className="flex-1 bg-gray-600 py-2 rounded-lg text-white">
//                 Annuler
//               </button>
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

  // Fonction pour formater la date et l'heure
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

    socket.on('new_message', (message: Message) => {
      console.log('📩 Nouveau message reçu:', message);
      onNewMessage(message);
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
    <div className="fixed inset-0 max-w-4xl mx-auto pt-10 flex flex-col bg-slate-900 pb-16">
      {/* Header */}
      <div className="bg-green-600 p-4">
        <h3 className="text-white font-bold text-lg">{otherUser.name}</h3>
        <p className="text-green-100 text-sm">📍 {otherUser.city} - {otherUser.district}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedMessages.map((msg, index) => (
          <div
            key={msg._id || `msg-${index}`}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[75%] p-3 rounded-2xl ${
                msg.senderId === currentUserId
                  ? 'bg-green-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-gray-200 rounded-bl-sm'
              }`}
              onContextMenu={(e) => {
                e.preventDefault();
                if (msg.senderId === currentUserId && msg._id) {
                  setShowMenu(showMenu === msg._id ? null : msg._id);
                }
              }}
            >
              <p className="text-sm break-words">{msg.content}</p>
              {msg.edited  && (
                <span className="text-[8px] opacity-50 block mt-1">(modifié)</span>
              )}
              {/* ✅ Affichage formaté de la date et l'heure */}
              <span className="text-[10px] opacity-70 block mt-1">
                {formatMessageTime(msg.timestamp)}
              </span>
              
              {/* Menu contextuel (clic droit) */}
              {showMenu === msg._id && (
                <div className="absolute -top-8 right-0 bg-slate-800 rounded-lg shadow-lg flex overflow-hidden z-50">
                  <button
                    onClick={() => startEditMessage(msg)}
                    className="px-3 py-1.5 text-xs text-white hover:bg-slate-700 transition-colors"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg._id!)}
                    className="px-3 py-1.5 text-xs text-red-400 hover:bg-slate-700 transition-colors"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800 p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-2 rounded-full bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-green-500 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Modal d'édition */}
      {editingMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-4 w-full max-w-sm">
            <h3 className="text-white font-bold mb-3">Modifier le message</h3>
            <input
              ref={editInputRef}
              type="text"
              value={editingMessage.content}
              onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button onClick={saveEditMessage} className="flex-1 bg-green-600 py-2 rounded-lg text-white">
                Enregistrer
              </button>
              <button onClick={cancelEdit} className="flex-1 bg-gray-600 py-2 rounded-lg text-white">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

