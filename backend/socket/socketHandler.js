
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
    socket.join(`user_${socket.userId}`);

    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
      console.log(`📌 User ${socket.userId} joined conversation ${conversationId}`);
    });

    socket.on('send_message', async (data) => {
      console.log('📨 send_message reçu:', data);
      const { conversationId, content, receiverId } = data;
      
      console.log(`💬 Message de ${socket.userId} à ${receiverId}: ${content}`);
      
      const phoneRegex = /(\+237|237)?[6,2,9][0-9]{8}/g;
      const hasPhoneNumber = phoneRegex.test(content);
      
      try {
        console.log('🔍 1 - Recherche conversation:', conversationId);
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          console.error('❌ 2 - Conversation non trouvée');
          return;
        }
        
        console.log('✅ 3 - Conversation trouvée, participants:', conversation.participants);
        
        const newMessage = {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
          isAlert: hasPhoneNumber
        };
        
        console.log('📝 4 - Ajout du message');
        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();
        
        console.log('💾 5 - Sauvegarde en cours...');
        await conversation.save();
        
        console.log(`✅ 6 - Message sauvegardé dans ${conversationId}`);
        
        console.log(`📤 7 - Envoi à la room conv_${conversationId}`);
        io.to(`conv_${conversationId}`).emit('new_message', newMessage);
        
        if (hasPhoneNumber) {
          io.to('admin_room').emit('phone_alert', {
            conversationId,
            message: content,
            users: conversation.participants
          });
          console.log('🚨 8 - Alerte admin envoyée');
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
