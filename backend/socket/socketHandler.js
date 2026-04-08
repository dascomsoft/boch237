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
      console.log('📨 Message reçu:', data);
      const { conversationId, content, receiverId } = data;
      
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        
        const newMessage = {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
          isAlert: false
        };
        
        conversation.messages.push(newMessage);
        await conversation.save();
        
        console.log('✅ Message sauvegardé');
        io.to(`conv_${conversationId}`).emit('new_message', newMessage);
        
      } catch (error) {
        console.error('❌ Erreur:', error);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.userId);
    });
  });
};