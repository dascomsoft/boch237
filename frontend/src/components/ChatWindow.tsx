
'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, User } from '@/types';
import { SOCKET_URL } from '@/lib/api';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: User;
  messages: Message[];
  onNewMessage: (message: Message) => void;
}

const ChatWindow = ({ conversationId, currentUserId, otherUser, messages, onNewMessage }: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    console.log('🔌 Connexion Socket à:', SOCKET_URL);
    
    const socket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connecté:', socket.id);
      socket.emit('join_conversation', conversationId);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket déconnecté');
    });

    socket.emit('join_conversation', conversationId);
    console.log('📌 Joined conversation:', conversationId);

    socket.on('new_message', (message: Message) => {
      console.log('📩 Message reçu:', message);
      
      const exists = messages.some(m => 
        m.content === message.content && 
        m.senderId === message.senderId &&
        Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
      );
      
      if (!exists) {
        onNewMessage(message);
      } else {
        console.log('⚠️ Message ignoré (doublon)');
      }
    });

    socket.on('phone_alert', (alert: any) => {
      console.log('🚨 Alerte admin:', alert);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, currentUserId]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg = {
      conversationId,
      content: input,
      receiverId: otherUser._id
    };

    socketRef.current.emit('send_message', msg);
    console.log('📤 Envoi message:', msg);
    setInput('');
    inputRef.current?.focus();
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
  );

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-green-600 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold">{otherUser.name}</h3>
            <p className="text-green-100 text-sm">{otherUser.city} - {otherUser.district}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedMessages.map((msg, idx) => (
          <div 
            key={msg._id || `msg-${msg.timestamp}-${idx}`}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] p-3 rounded-lg ${
                msg.senderId === currentUserId 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="break-words text-sm md:text-base">{msg.content}</p>
              <span className="text-xs opacity-70 block mt-1">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Version responsive mobile */}
      <div className="bg-slate-800 p-3 border-t border-green-500">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-0 p-3 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..."
          />
          <button 
            onClick={handleSend} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;












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
// }

// const ChatWindow = ({ conversationId, currentUserId, otherUser, messages, onNewMessage }: ChatWindowProps) => {
//   const [input, setInput] = useState('');
//   const socketRef = useRef<Socket | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Scroll automatique
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // 🔔 MARQUER LES MESSAGES COMME LUS
//   useEffect(() => {
//     const markAsRead = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.post(`${API_URL}/users/conversation/${conversationId}/read`, {}, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('✅ Messages marqués comme lus');
//       } catch (error) {
//         console.error('Erreur marquage lu:', error);
//       }
//     };
    
//     if (conversationId) {
//       markAsRead();
//     }
//   }, [conversationId]);

//   useEffect(() => {
//     console.log('🔌 Connexion Socket à:', SOCKET_URL);
    
//     const socket = io(SOCKET_URL, {
//       auth: { userId: currentUserId },
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('✅ Socket connecté:', socket.id);
//       socket.emit('join_conversation', conversationId);
//     });

//     socket.on('disconnect', () => {
//       console.log('🔴 Socket déconnecté');
//     });

//     socket.emit('join_conversation', conversationId);
//     console.log('📌 Joined conversation:', conversationId);

//     socket.on('new_message', (message: Message) => {
//       console.log('📩 Message reçu:', message);
      
//       const exists = messages.some(m => 
//         m.content === message.content && 
//         m.senderId === message.senderId &&
//         Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
//       );
      
//       if (!exists) {
//         onNewMessage(message);
//       } else {
//         console.log('⚠️ Message ignoré (doublon)');
//       }
//     });

//     socket.on('phone_alert', (alert: any) => {
//       console.log('🚨 Alerte admin:', alert);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [conversationId, currentUserId]);

//   const handleSend = () => {
//     if (!input.trim() || !socketRef.current) return;

//     const msg = {
//       conversationId,
//       content: input,
//       receiverId: otherUser._id
//     };

//     socketRef.current.emit('send_message', msg);
//     console.log('📤 Envoi message:', msg);
//     setInput('');
//     inputRef.current?.focus();
//   };

//   const sortedMessages = [...messages].sort(
//     (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
//   );

//   return (
//     <div className="flex flex-col h-screen bg-slate-900">
//       <div className="bg-green-600 p-4 sticky top-0 z-10">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-white font-bold">{otherUser.name}</h3>
//             <p className="text-green-100 text-sm">{otherUser.city} - {otherUser.district}</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {sortedMessages.map((msg, idx) => (
//           <div 
//             key={msg._id || `msg-${msg.timestamp}-${idx}`}
//             className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
//           >
//             <div 
//               className={`max-w-[75%] p-3 rounded-lg ${
//                 msg.senderId === currentUserId 
//                   ? 'bg-green-600 text-white rounded-br-none' 
//                   : 'bg-slate-800 text-gray-200 rounded-bl-none'
//               }`}
//             >
//               <p className="break-words text-sm md:text-base">{msg.content}</p>
//               <span className="text-xs opacity-70 block mt-1">
//                 {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
//               </span>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="bg-slate-800 p-3 border-t border-green-500">
//         <div className="flex gap-2 items-center">
//           <input
//             ref={inputRef}
//             type="text"
//             className="flex-1 min-w-0 p-3 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Écrivez votre message..."
//           />
//           <button 
//             onClick={handleSend} 
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base"
//           >
//             Envoyer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;
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
// }

// const ChatWindow = ({ conversationId, currentUserId, otherUser, messages, onNewMessage }: ChatWindowProps) => {
//   const [input, setInput] = useState('');
//   const socketRef = useRef<Socket | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Scroll automatique
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // 🔔 MARQUER LES MESSAGES COMME LUS
//   useEffect(() => {
//     const markAsRead = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.post(`${API_URL}/users/conversation/${conversationId}/read`, {}, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('✅ Messages marqués comme lus');
//       } catch (error) {
//         console.error('Erreur marquage lu:', error);
//       }
//     };
    
//     if (conversationId) {
//       markAsRead();
//     }
//   }, [conversationId]);

//   useEffect(() => {
//     console.log('🔌 Connexion Socket à:', SOCKET_URL);
    
//     const socket = io(SOCKET_URL, {
//       auth: { userId: currentUserId },
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('✅ Socket connecté:', socket.id);
//       socket.emit('join_conversation', conversationId);
//     });

//     socket.on('disconnect', () => {
//       console.log('🔴 Socket déconnecté');
//     });

//     socket.emit('join_conversation', conversationId);
//     console.log('📌 Joined conversation:', conversationId);

//     socket.on('new_message', (message: Message) => {
//       console.log('📩 Message reçu:', message);
      
//       const exists = messages.some(m => 
//         m.content === message.content && 
//         m.senderId === message.senderId &&
//         Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
//       );
      
//       if (!exists) {
//         onNewMessage(message);
//       } else {
//         console.log('⚠️ Message ignoré (doublon)');
//       }
//     });

//     socket.on('phone_alert', (alert: any) => {
//       console.log('🚨 Alerte admin:', alert);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [conversationId, currentUserId]);

//   const handleSend = () => {
//     if (!input.trim() || !socketRef.current) return;

//     const msg = {
//       conversationId,
//       content: input,
//       receiverId: otherUser._id
//     };

//     socketRef.current.emit('send_message', msg);
//     console.log('📤 Envoi message:', msg);
//     setInput('');
//     inputRef.current?.focus();
//   };

//   const sortedMessages = [...messages].sort(
//     (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
//   );

//   return (
//     <div className="flex flex-col h-screen bg-slate-900">
//       <div className="bg-green-600 p-4 sticky top-0 z-10">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-white font-bold">{otherUser.name}</h3>
//             <p className="text-green-100 text-sm">{otherUser.city} - {otherUser.district}</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {sortedMessages.map((msg, idx) => (
//           <div 
//             key={msg._id || `msg-${msg.timestamp}-${idx}`}
//             className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
//           >
//             <div 
//               className={`max-w-[75%] p-3 rounded-lg ${
//                 msg.senderId === currentUserId 
//                   ? 'bg-green-600 text-white rounded-br-none' 
//                   : 'bg-slate-800 text-gray-200 rounded-bl-none'
//               }`}
//             >
//               <p className="break-words text-sm md:text-base">{msg.content}</p>
//               <span className="text-xs opacity-70 block mt-1">
//                 {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
//               </span>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="bg-slate-800 p-3 border-t border-green-500">
//         <div className="flex gap-2 items-center">
//           <input
//             ref={inputRef}
//             type="text"
//             className="flex-1 min-w-0 p-3 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Écrivez votre message..."
//           />
//           <button 
//             onClick={handleSend} 
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base"
//           >
//             Envoyer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;