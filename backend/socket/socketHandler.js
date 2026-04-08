
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

    // 🔥 DIAGNOSTIC : Compter les conversations
    const totalConversations = await Conversation.countDocuments();
    console.log('📊 TOTAL CONVERSATIONS EN DB:', totalConversations);

    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
      console.log('📌 Joined conversation:', conversationId);
    });

    socket.on('send_message', async (data) => {
      console.log('📨 1 - Message reçu:', data);
      const { conversationId, content } = data;

      try {
        // 🔥 Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
          console.log('❌ ID INVALIDE:', conversationId);
          return;
        }

        console.log('🔍 2 - Recherche conversation:', conversationId);
        const conversation = await Conversation.findById(conversationId);
        
        console.log('🔍 3 - RÉSULTAT:', conversation ? `TROUVÉE (${conversation.messages.length} messages)` : 'NULL');

        if (!conversation) {
          console.log('❌ 4 - Conversation NON trouvée dans MongoDB');
          return;
        }

        console.log('✅ 5 - Conversation trouvée');

        const newMessage = {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
          isAlert: false
        };

        console.log('📝 6 - Ajout message');
        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();

        console.log('💾 7 - Sauvegarde...');
        await conversation.save();

        console.log('✅ 8 - Message sauvegardé !');
        io.to(`conv_${conversationId}`).emit('new_message', newMessage);

      } catch (error) {
        console.error('❌ ERREUR:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.userId);
    });
  });
};
