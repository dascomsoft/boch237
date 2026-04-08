
import Conversation from '../models/Conversation.js';

export const setupSocket = (io) => {
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return next(new Error("Invalid user"));
    socket.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.userId);

    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
      console.log('📌 Joined conversation:', conversationId);
    });

    socket.on('send_message', async (data) => {
      console.log('📨 1 - Message reçu:', data);
      const { conversationId, content, receiverId } = data;
      
      console.log('📨 2 - Recherche conversation:', conversationId);
      
      try {
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          console.log('❌ 3 - Conversation NON trouvée dans MongoDB');
          return;
        }
        
        console.log('✅ 4 - Conversation trouvée');
        
        const newMessage = {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
          isAlert: false
        };
        
        console.log('📝 5 - Ajout du message à la conversation');
        conversation.messages.push(newMessage);
        
        console.log('💾 6 - Sauvegarde dans MongoDB...');
        await conversation.save();
        
        console.log('✅ 7 - Message sauvegardé avec succès !');
        console.log('📤 8 - Envoi du message aux clients');
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
