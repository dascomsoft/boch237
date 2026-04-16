
// import Conversation from '../models/Conversation.js';
// import mongoose from 'mongoose';

// export const setupSocket = (io) => {
//   io.use((socket, next) => {
//     const userId = socket.handshake.auth.userId;
//     if (!userId) return next(new Error("Invalid user"));
//     socket.userId = userId;
//     next();
//   });

//   io.on('connection', async (socket) => {
//     console.log('🟢 User connected:', socket.userId);

//     // 🔥 DIAGNOSTIC : Compter les conversations
//     const totalConversations = await Conversation.countDocuments();
//     console.log('📊 TOTAL CONVERSATIONS EN DB:', totalConversations);

//     socket.on('join_conversation', (conversationId) => {
//       socket.join(`conv_${conversationId}`);
//       console.log('📌 Joined conversation:', conversationId);
//     });

//     socket.on('send_message', async (data) => {
//       console.log('📨 1 - Message reçu:', data);
//       const { conversationId, content } = data;

//       try {
//         // 🔥 Vérifier si l'ID est valide
//         if (!mongoose.Types.ObjectId.isValid(conversationId)) {
//           console.log('❌ ID INVALIDE:', conversationId);
//           return;
//         }

//         console.log('🔍 2 - Recherche conversation:', conversationId);
//         const conversation = await Conversation.findById(conversationId);
        
//         console.log('🔍 3 - RÉSULTAT:', conversation ? `TROUVÉE (${conversation.messages.length} messages)` : 'NULL');

//         if (!conversation) {
//           console.log('❌ 4 - Conversation NON trouvée dans MongoDB');
//           return;
//         }

//         console.log('✅ 5 - Conversation trouvée');

//         const newMessage = {
//           senderId: socket.userId,
//           content,
//           timestamp: new Date(),
//           isAlert: false
//         };

//         console.log('📝 6 - Ajout message');
//         conversation.messages.push(newMessage);
//         conversation.lastActivity = new Date();

//         console.log('💾 7 - Sauvegarde...');
//         await conversation.save();

//         console.log('✅ 8 - Message sauvegardé !');
//         io.to(`conv_${conversationId}`).emit('new_message', newMessage);

//       } catch (error) {
//         console.error('❌ ERREUR:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('🔴 User disconnected:', socket.userId);
//     });
//   });
// };

















































// import Conversation from '../models/Conversation.js';
// import mongoose from 'mongoose';

// export const setupSocket = (io) => {
//   io.use((socket, next) => {
//     const userId = socket.handshake.auth.userId;
//     if (!userId) return next(new Error("Invalid user"));
//     socket.userId = userId;
//     next();
//   });

//   io.on('connection', async (socket) => {
//     console.log('🟢 User connected:', socket.userId);

//     // 🔥 DIAGNOSTIC : Compter les conversations
//     const totalConversations = await Conversation.countDocuments();
//     console.log('📊 TOTAL CONVERSATIONS EN DB:', totalConversations);

//     socket.on('join_conversation', (conversationId) => {
//       socket.join(`conv_${conversationId}`);
//       console.log('📌 Joined conversation:', conversationId);
//     });

//     socket.on('send_message', async (data) => {
//       console.log('📨 1 - Message reçu:', data);
//       const { conversationId, content, receiverId } = data;

//       try {
//         // 🔥 Vérifier si l'ID est valide
//         if (!mongoose.Types.ObjectId.isValid(conversationId)) {
//           console.log('❌ ID INVALIDE:', conversationId);
//           return;
//         }

//         console.log('🔍 2 - Recherche conversation:', conversationId);
//         const conversation = await Conversation.findById(conversationId);
        
//         console.log('🔍 3 - RÉSULTAT:', conversation ? `TROUVÉE (${conversation.messages.length} messages)` : 'NULL');

//         if (!conversation) {
//           console.log('❌ 4 - Conversation NON trouvée dans MongoDB');
//           return;
//         }

//         console.log('✅ 5 - Conversation trouvée');

//         const newMessage = {
//           senderId: socket.userId,
//           content,
//           timestamp: new Date(),
//           isAlert: false
//         };

//         console.log('📝 6 - Ajout message');
//         conversation.messages.push(newMessage);
//         conversation.lastActivity = new Date();

//         console.log('💾 7 - Sauvegarde...');
//         await conversation.save();

//         console.log('✅ 8 - Message sauvegardé !');
        
//         // 🔥 CORRECTION : Envoyer à TOUS dans la conversation (y compris l'expéditeur)
//         io.to(`conv_${conversationId}`).emit('new_message', newMessage);
        
//         // 🔔 NOTIFICATION POUR LE DESTINATAIRE (seulement pour le badge)
//         if (receiverId) {
//           io.to(`user_${receiverId}`).emit('new_message_notification', {
//             conversationId,
//             senderId: socket.userId,
//             content: content.substring(0, 50),
//             timestamp: new Date()
//           });
//           console.log(`🔔 Notification envoyée à l'utilisateur ${receiverId}`);
//         }

//       } catch (error) {
//         console.error('❌ ERREUR:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('🔴 User disconnected:', socket.userId);
//     });
//   });
// };




























// import Conversation from '../models/Conversation.js';
// import mongoose from 'mongoose';

// export const setupSocket = (io) => {
//   io.use((socket, next) => {
//     const userId = socket.handshake.auth.userId;
//     if (!userId) return next(new Error("Invalid user"));
//     socket.userId = userId;
//     next();
//   });

//   io.on('connection', async (socket) => {
//     console.log('🟢 User connected:', socket.userId);
    
//     // 🔥 CRUCIAL : Rejoindre sa room personnelle pour les notifications
//     socket.join(`user_${socket.userId}`);

//     socket.on('join_conversation', (conversationId) => {
//       socket.join(`conv_${conversationId}`);
//       console.log('📌 Joined conversation:', conversationId);
//     });

//     socket.on('send_message', async (data) => {
//       console.log('📨 Message reçu:', data);
//       const { conversationId, content, receiverId } = data;

//       try {
//         if (!mongoose.Types.ObjectId.isValid(conversationId)) {
//           console.log('❌ ID INVALIDE');
//           return;
//         }

//         const conversation = await Conversation.findById(conversationId);
//         if (!conversation) {
//           console.log('❌ Conversation non trouvée');
//           return;
//         }

//         const newMessage = {
//           senderId: socket.userId,
//           content,
//           timestamp: new Date(),
//           isAlert: false
//         };

//         conversation.messages.push(newMessage);
//         conversation.lastActivity = new Date();
//         await conversation.save();

//         console.log('✅ Message sauvegardé');
        
//         io.to(`conv_${conversationId}`).emit('new_message', newMessage);

//         if (receiverId && receiverId !== socket.userId) {
//           io.to(`user_${receiverId}`).emit('new_message_notification', {
//             conversationId,
//             senderId: socket.userId,
//             content: content.substring(0, 50),
//             timestamp: new Date()
//           });
//           console.log(`🔔 Notification envoyée à l'utilisateur ${receiverId}`);
//         }

//       } catch (error) {
//         console.error('❌ Erreur:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('🔴 User disconnected:', socket.userId);
//     });
//   });
// };










import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';

export const setupSocket = (io) => {
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return next(new Error("Invalid user"));
    socket.userId = userId;
    next();
  });

  io.on('connection', async (socket) => {
    console.log('🟢 User connected:', socket.userId);

    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
      console.log('📌 Joined conversation:', conversationId);
    });

    socket.on('send_message', async (data) => {
      console.log('📨 Message reçu:', data);
      const { conversationId, content, receiverId } = data;

      try {
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
          console.log('❌ ID INVALIDE');
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.log('❌ Conversation non trouvée');
          return;
        }

        const newMessage = {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
          isAlert: false
        };

        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();

        await conversation.save();

        // ✅ IMPORTANT : récupérer le message avec _id généré par MongoDB
        const savedMessage = conversation.messages[conversation.messages.length - 1];

        console.log('✅ Message sauvegardé avec ID:', savedMessage._id);

        // ✅ envoyer le bon message (AVEC _id)
        io.to(`conv_${conversationId}`).emit('new_message', savedMessage);

        // 🔔 Notification
        if (receiverId && receiverId !== socket.userId) {
          io.to(`user_${receiverId}`).emit('new_message_notification', {
            conversationId,
            senderId: socket.userId,
            content: content.substring(0, 50),
            timestamp: new Date()
          });
          console.log(`🔔 Notification envoyée à l'utilisateur ${receiverId}`);
        }

      } catch (error) {
        console.error('❌ Erreur:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.userId);
    });
  });
};
