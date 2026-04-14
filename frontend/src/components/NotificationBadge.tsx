
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { Bell, MessageCircle } from 'lucide-react';
// import { SOCKET_URL, API_URL } from '@/lib/api';
// import io, { Socket } from 'socket.io-client';

// interface Notification {
//   id: string;
//   type: 'message';
//   title: string;
//   content: string;
//   conversationId?: string;
//   read: boolean;
//   timestamp: Date;
// }

// export default function NotificationBadge() {
//   const router = useRouter();
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     fetchUser();

//     // Décoder le token pour obtenir userId
//     let userId = null;
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       }).join(''));
//       userId = JSON.parse(jsonPayload).userId;
//     } catch (error) {
//       console.error('Erreur décodage token:', error);
//       return;
//     }

//     if (!userId) return;

//     const newSocket = io(SOCKET_URL, {
//       auth: { userId },
//       transports: ['websocket', 'polling']
//     });

//     newSocket.on('new_message_notification', (data: any) => {
//       console.log('🔔 Nouveau message reçu:', data);
//       setUnreadCount(prev => prev + 1);
//       setNotifications(prev => [{
//         id: Date.now().toString(),
//         type: 'message',
//         title: 'Nouveau message',
//         content: data.content,
//         conversationId: data.conversationId,
//         read: false,
//         timestamp: new Date()
//       }, ...prev]);

//       if ('Notification' in window && Notification.permission === 'granted') {
//         new Notification('Nouveau message', {
//           body: data.content,
//           icon: '/favicon.ico'
//         });
//       }
//     });

//     setSocket(newSocket);

//     return () => {
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       // ✅ Utiliser API_URL au lieu de process.env
//       const response = await axios.get(`${API_URL}/users/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUser(response.data);
//     } catch (error) {
//       console.error('Erreur:', error);
//     }
//   };

//   const handleNotificationClick = (notification: Notification) => {
//     if (notification.conversationId) {
//       router.push(`/chat?convId=${notification.conversationId}`);
//     }
//     setShowDropdown(false);
//   };

//   const markAsRead = () => {
//     setUnreadCount(0);
//   };

//   useEffect(() => {
//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   }, []);

//   if (!user) return null;

//   return (
//     <div className="relative">
//       <button
//         onClick={() => {
//           setShowDropdown(!showDropdown);
//           if (unreadCount > 0) markAsRead();
//         }}
//         className="relative p-2 rounded-full hover:bg-slate-800 transition-colors"
//       >
//         <Bell size={20} className="text-white" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {showDropdown && (
//         <>
//           <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
//           <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-lg z-50 overflow-hidden">
//             <div className="p-3 border-b border-slate-700 flex justify-between items-center">
//               <h3 className="text-white font-bold">Notifications</h3>
//               {notifications.length > 0 && (
//                 <button
//                   onClick={() => setNotifications([])}
//                   className="text-gray-400 text-xs hover:text-white"
//                 >
//                   Tout effacer
//                 </button>
//               )}
//             </div>
//             <div className="max-h-96 overflow-y-auto">
//               {notifications.length === 0 ? (
//                 <div className="p-4 text-center text-gray-400">
//                   <Bell size={32} className="mx-auto mb-2 opacity-50" />
//                   <p className="text-sm">Aucune notification</p>
//                 </div>
//               ) : (
//                 notifications.map((notif) => (
//                   <div
//                     key={notif.id}
//                     onClick={() => handleNotificationClick(notif)}
//                     className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors ${
//                       !notif.read ? 'bg-slate-700/50' : ''
//                     }`}
//                   >
//                     <div className="flex items-start gap-2">
//                       <MessageCircle size={16} className="text-green-400 mt-0.5" />
//                       <div className="flex-1">
//                         <p className="text-white text-sm font-medium">{notif.title}</p>
//                         <p className="text-gray-400 text-xs truncate">{notif.content}</p>
//                         <p className="text-gray-500 text-xs mt-1">
//                           {new Date(notif.timestamp).toLocaleTimeString()}
//                         </p>
//                       </div>
//                       {!notif.read && (
//                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }






















































































'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from '@/components/ChatWindow';
import MobileNav from '@/components/MobileNav';
import NotificationBadge from '@/components/NotificationBadge';
import { Conversation, Message, User } from '@/types';
import { API_URL } from '@/lib/api';

function ChatContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('convId');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentUserData = userResponse.data;
      setCurrentUser(currentUserData);
      
      const convResponse = await axios.get(`${API_URL}/users/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const conversationsData = convResponse.data;
      setConversations(conversationsData);
      
      if (conversationId) {
        const conv = conversationsData.find((c: Conversation) => c._id === conversationId);
        if (conv) {
          setCurrentConversation(conv);
          const otherId = conv.participants.find((id: string) => id !== currentUserData._id);
          if (otherId) {
            try {
              const otherUserResponse = await axios.get(`${API_URL}/users/${otherId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setOtherUser(otherUserResponse.data);
            } catch (err) {
              console.error('Erreur chargement autre utilisateur:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (currentConversation) {
      setCurrentConversation({
        ...currentConversation,
        messages: [...currentConversation.messages, message]
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="sticky top-0 z-20 bg-green-600 p-2 flex justify-end">
        <NotificationBadge />
      </div>
      {currentConversation && currentUser && otherUser ? (
        <ChatWindow
          conversationId={currentConversation._id}
          currentUserId={currentUser._id}
          otherUser={otherUser}
          messages={currentConversation.messages || []}
          onNewMessage={handleNewMessage}
        />
      ) : (
        <div className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">Mes conversations</h2>
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>Aucune conversation</p>
              <p className="text-sm mt-2">Commencez par rechercher un répétiteur</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  className="bg-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-700"
                  onClick={() => window.location.href = `/chat?convId=${conv._id}`}
                >
                  <p className="text-white">Conversation du {new Date(conv.lastActivity).toLocaleDateString()}</p>
                  <p className="text-gray-400 text-sm">{conv.messages.length} message(s)</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <MobileNav userRole={currentUser?.role} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-500 rounded-full"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
