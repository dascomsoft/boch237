
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

// ✅ IMPORTANT : Rendre io accessible dans les routes
app.set('io', io);

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
import { setupSocket } from './socket/socketHandler.js';
setupSocket(io);

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boch237';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log('📦 Base de données:', mongoose.connection.db.databaseName);
  })
  .catch(err => console.error('❌ MongoDB error:', err));

// 🔥 DIAGNOSTIC : Afficher le nombre de conversations au démarrage
mongoose.connection.once('open', async () => {
  try {
    const Conversation = (await import('./models/Conversation.js')).default;
    const count = await Conversation.countDocuments();
    console.log(`📊 [STARTUP] ${count} conversations trouvées dans la base`);
    
    const conversations = await Conversation.find().select('_id participants');
    console.log(`📊 [STARTUP] IDs des conversations:`, conversations.map(c => c._id.toString()));
  } catch (error) {
    console.error('❌ Erreur diagnostic:', error);
  }
});

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
