
import express from 'express';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ========== ROUTES SPÉCIFIQUES (avant la route dynamique) ==========

router.get('/test', (req, res) => {
  res.json({ message: 'OK' });
});

router.get('/tutors', async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor', isActive: true }).select('-password');
    res.json(tutors);
  } catch (error) {
    res.json([]);
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur' });
  }
});

router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.userId });
    res.json(conversations);
  } catch (error) {
    res.json([]);
  }
});

router.post('/conversation', authMiddleware, async (req, res) => {
  try {
    const { tutorId } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, tutorId] }
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [req.userId, tutorId],
        messages: []
      });
      await conversation.save();
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur' });
  }
});

// ROUTES ADMIN (spécifiques)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Vérification admin...');
    const admin = await User.findById(req.userId);
    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/conversations/all', authMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur' });
  }
});

router.patch('/:userId/status', authMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { isActive }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur' });
  }
});

// ========== ROUTE DYNAMIQUE (TOUJOURS EN DERNIER) ==========
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur' });
  }
});

export default router;
