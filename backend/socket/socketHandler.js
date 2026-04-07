
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
      try {
        const { conversationId, content, receiverId } = data;
        
        console.log(`💬 Message de ${socket.userId} à ${receiverId}: ${content.substring(0, 50)}`);
        
        // Détection des numéros de téléphone camerounais
        const phoneRegex = /(\+237|237)?[6,2,9][0-9]{8}/g;
        const hasPhoneNumber = phoneRegex.test(content);
        
        if (hasPhoneNumber) {
          console.log('⚠️ Tentative de partage de numéro détectée !');
        }
        
        // Récupérer la conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.error('❌ Conversation non trouvée:', conversationId);
          return;
        }
        
        // Créer le nouveau message avec timestamp
        const newMessage = {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
          isAlert: hasPhoneNumber
        };
        
        // Ajouter le message à la conversation
        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();
        await conversation.save();
        
        console.log(`✅ Message sauvegardé dans conversation ${conversationId}`);
        
        // Envoyer le message à tous les participants de la conversation
        io.to(`conv_${conversationId}`).emit('new_message', newMessage);
        
        // Alerter l'admin si numéro détecté
        if (hasPhoneNumber) {
          io.to('admin_room').emit('phone_alert', {
            conversationId,
            message: content,
            users: conversation.participants,
            timestamp: new Date()
          });
          console.log('🚨 Alerte admin envoyée pour partage de numéro');
        }
      } catch (error) {
        console.error('❌ Erreur dans send_message:', error);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.userId);
    });
  });
};
