
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
      
      // Détection des numéros de téléphone
      const phoneRegex = /(\+237|237)?[6,2,9][0-9]{8}/g;
      const hasPhoneNumber = phoneRegex.test(content);
      
      try {
        console.log('🔍 Recherche conversation:', conversationId);
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          console.error('❌ Conversation non trouvée:', conversationId);
          return;
        }
        
        console.log('✅ Conversation trouvée, participants:', conversation.participants);
        
        const newMessage = {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
          isAlert: hasPhoneNumber
        };
        
        console.log('📝 Ajout du message:', newMessage);
        
        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();
        await conversation.save();
        
        console.log(`✅ Message sauvegardé dans conversation ${conversationId}`);
        
        // Envoyer aux participants
        io.to(`conv_${conversationId}`).emit('new_message', newMessage);
        console.log(`📤 Message envoyé à la room conv_${conversationId}`);
        
        if (hasPhoneNumber) {
          io.to('admin_room').emit('phone_alert', {
            conversationId,
            message: content,
            users: conversation.participants,
            timestamp: new Date()
          });
          console.log('🚨 Alerte admin envoyée');
        }
      } catch (error) {
        console.error('❌ Erreur dans send_message:', error);
        console.error('❌ Stack:', error.stack);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.userId);
    });
  });
};