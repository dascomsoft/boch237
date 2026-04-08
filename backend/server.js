
import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import annonceRoutes from './routes/annonces.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configuration CORS pour Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: ["https://boch237.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Middleware CORS pour Express
app.use(cors({
  origin: ["https://boch237.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/annonces', annonceRoutes);

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne !' });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Nouvelle connexion socket:', socket.id);
  
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conv_${conversationId}`);
    console.log(`📌 Socket ${socket.id} joined conversation ${conversationId}`);
  });
  
  socket.on('send_message', async (data) => {
    console.log('📨 Message reçu:', data);
    // ... le reste du code
  });
  
  socket.on('disconnect', () => {
    console.log('🔴 Socket déconnecté:', socket.id);
  });
});

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boch237';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
