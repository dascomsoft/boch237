
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { User, Conversation } from '@/types';
// import { UserCircle, MapPin, BookOpen, GraduationCap, MessageSquare, LogOut, Megaphone, PlusCircle } from 'lucide-react';
// import MobileNav from '@/components/MobileNav';
// import ContactAdminButton from '@/components/ContactAdminButton';
// import { API_URL } from '@/lib/api';

// export default function ProfilePage() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login');
//       return;
//     }
//     fetchData(token);
//   }, []);

//   const fetchData = async (token: string) => {
//     try {
//       const [userRes, convRes] = await Promise.all([
//         axios.get(`${API_URL}/users/me`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${API_URL}/users/conversations`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);
//       setUser(userRes.data);
//       setConversations(convRes.data);
//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     router.push('/');
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
//       <div className="bg-green-600 p-6 text-center">
//         <div className="inline-block p-3 bg-white rounded-full mb-3">
//           <UserCircle size={48} className="text-green-600" />
//         </div>
//         <h1 className="text-white text-xl font-bold">{user?.name}</h1>
//         <p className="text-green-100">
//           {user?.role === 'tutor' ? '👨‍🏫 Répétiteur' : '👨‍👩‍👧 Parent/Élève'}
//         </p>
//         <p className="text-green-100 text-sm mt-1">{user?.phone}</p>
//       </div>

//       <div className="p-4 space-y-4">
//         {/* Bouton contacter l'admin - pour tous les utilisateurs */}
//         <ContactAdminButton />

//         {user?.role === 'parent' && (
//           <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500 rounded-xl p-4">
//             <button
//               onClick={() => router.push('/annonces/creer')}
//               className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2"
//             >
//               <Megaphone size={20} /> Publier une annonce <PlusCircle size={16} />
//             </button>
//           </div>
//         )}

//         <div className="bg-slate-800 rounded-xl p-4">
//           <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
//             <MapPin size={18} /> Localisation
//           </h2>
//           <div className="space-y-2 text-gray-300">
//             <p>Province: {user?.province || 'Non spécifié'}</p>
//             <p>Ville: {user?.city || 'Non spécifié'}</p>
//             <p>Quartier: {user?.district || 'Non spécifié'}</p>
//           </div>
//         </div>

//         {user?.role === 'tutor' && (
//           <>
//             <div className="bg-slate-800 rounded-xl p-4">
//               <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
//                 <BookOpen size={18} /> Matières enseignées
//               </h2>
//               <div className="flex flex-wrap gap-2">
//                 {user.subjects?.map((subject, index) => (
//                   <span key={index} className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
//                     {subject}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-slate-800 rounded-xl p-4">
//               <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
//                 <GraduationCap size={18} /> Classes
//               </h2>
//               <div className="flex flex-wrap gap-2">
//                 {user.classes?.map((className, index) => (
//                   <span key={index} className="bg-slate-700 text-gray-300 px-3 py-1 rounded-lg text-sm">
//                     {className}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}

//         <div className="bg-slate-800 rounded-xl p-4">
//           <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
//             <MessageSquare size={18} /> Conversations récentes
//           </h2>
//           {conversations.length === 0 ? (
//             <p className="text-gray-400 text-sm">Aucune conversation</p>
//           ) : (
//             <div className="space-y-2">
//               {conversations.slice(0, 3).map((conv) => (
//                 <div
//                   key={conv._id}
//                   className="bg-slate-900 p-2 rounded-lg cursor-pointer"
//                   onClick={() => router.push(`/chat?convId=${conv._id}`)}
//                 >
//                   <p className="text-gray-300 text-sm">{conv.messages.length} message(s)</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <button onClick={() => router.push('/annonces')} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2">
//           <Megaphone size={20} /> Voir toutes les annonces
//         </button>

//         <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2">
//           <LogOut size={20} /> Se déconnecter
//         </button>
//       </div>

//       <MobileNav userRole={user?.role} />
//     </div>
//   );
// }























'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Conversation } from '@/types';
import { UserCircle, MapPin, BookOpen, GraduationCap, MessageSquare, LogOut, Megaphone, PlusCircle, Edit } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import ContactAdminButton from '@/components/ContactAdminButton';
import { API_URL } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const [userRes, convRes] = await Promise.all([
        axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/users/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setUser(userRes.data);
      setConversations(convRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
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
      {/* Header */}
      <div className="bg-green-600 p-4 space-y-4 pt-15 sticky top-0 left-0 w-full shadow-md">
        {/* <div className="inline-block p-3 bg-white rounded-full mb-3">
          <UserCircle size={8} className="text-green-600" />
        </div> */}
        <h1 className="text-white text-xl font-bold">{user?.name}</h1>
        <p className="text-green-100">
          {user?.role === 'tutor' ? '👨‍🏫 Répétiteur' : '👨‍👩‍👧 Parent/Élève'}
        </p>
        <p className="text-green-100 text-sm mt-1">{user?.phone}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Bouton Modifier le profil */}
        <button
          onClick={() => router.push('/profile/edit')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Edit size={20} /> Modifier mon profil
        </button>

        {/* Bouton contacter l'admin */}
        <ContactAdminButton />

        {user?.role === 'parent' && (
          <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500 rounded-xl p-4">
            <button
              onClick={() => router.push('/annonces/creer')}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Megaphone size={20} /> Publier une annonce <PlusCircle size={16} />
            </button>
          </div>
        )}

        {/* Localisation */}
        <div className="bg-slate-800 rounded-xl p-2">
          <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
            <MapPin size={18} /> Localisation
          </h2>
          <div className="space-y-2 text-gray-300">
            <p>Province: {user?.province || 'Non spécifié'}</p>
            <p>Ville: {user?.city || 'Non spécifié'}</p>
            <p>Quartier: {user?.district || 'Non spécifié'}</p>
          </div>
        </div>

        {user?.role === 'tutor' && (
          <>
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <BookOpen size={18} /> Matières enseignées
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.subjects && user.subjects.length > 0 ? (
                  user.subjects.map((subject, index) => (
                    <span key={index} className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                      {subject}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Aucune matière spécifiée</p>
                )}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <GraduationCap size={18} /> Classes
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.classes && user.classes.length > 0 ? (
                  user.classes.map((className, index) => (
                    <span key={index} className="bg-slate-700 text-gray-300 px-3 py-1 rounded-lg text-sm">
                      {className}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Aucune classe spécifiée</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Conversations récentes */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold mb-3 flex items-center gap-2">
            <MessageSquare size={18} /> Conversations récentes
          </h2>
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune conversation</p>
          ) : (
            <div className="space-y-2">
              {conversations.slice(0, 3).map((conv) => (
                <div
                  key={conv._id}
                  className="bg-slate-900 p-2 rounded-lg cursor-pointer"
                  onClick={() => router.push(`/chat?convId=${conv._id}`)}
                >
                  <p className="text-gray-300 text-sm">{conv.messages.length} message(s)</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => router.push('/annonces')} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2">
          <Megaphone size={20} /> Voir toutes les annonces
        </button>

        <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2">
          <LogOut size={20} /> Se déconnecter
        </button>
      </div>

      <MobileNav userRole={user?.role} />
    </div>
  );
}
