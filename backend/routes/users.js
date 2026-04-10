
// import express from 'express';
// import User from '../models/User.js';
// import Conversation from '../models/Conversation.js';
// import { authMiddleware } from '../middleware/auth.js';

// const router = express.Router();

// // ========== ROUTES SPÉCIFIQUES (avant la route dynamique) ==========

// router.get('/test', (req, res) => {
//   res.json({ message: 'OK' });
// });

// router.get('/tutors', async (req, res) => {
//   try {
//     const tutors = await User.find({ role: 'tutor', isActive: true }).select('-password');
//     res.json(tutors);
//   } catch (error) {
//     res.json([]);
//   }
// });

// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur' });
//   }
// });

// router.get('/conversations', authMiddleware, async (req, res) => {
//   try {
//     const conversations = await Conversation.find({ participants: req.userId });
//     res.json(conversations);
//   } catch (error) {
//     res.json([]);
//   }
// });

// router.post('/conversation', authMiddleware, async (req, res) => {
//   try {
//     const { tutorId } = req.body;
//     let conversation = await Conversation.findOne({
//       participants: { $all: [req.userId, tutorId] }
//     });
//     if (!conversation) {
//       conversation = new Conversation({
//         participants: [req.userId, tutorId],
//         messages: []
//       });
//       await conversation.save();
//     }
//     res.json(conversation);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur' });
//   }
// });

// // ROUTES ADMIN (spécifiques)
// router.get('/all', authMiddleware, async (req, res) => {
//   try {
//     console.log('🔍 Vérification admin...');
//     const admin = await User.findById(req.userId);
    
//     if (!admin || admin.role !== 'admin') {
//       return res.status(403).json({ message: 'Non autorisé' });
//     }
    
//     const users = await User.find({}).select('-password');
//     res.json(users);
//   } catch (error) {
//     console.error('Erreur:', error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// router.get('/conversations/all', authMiddleware, async (req, res) => {
//   try {
//     const admin = await User.findById(req.userId);
//     if (!admin || admin.role !== 'admin') {
//       return res.status(403).json({ message: 'Non autorisé' });
//     }
//     const conversations = await Conversation.find();
//     res.json(conversations);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur' });
//   }
// });

// router.patch('/:userId/status', authMiddleware, async (req, res) => {
//   try {
//     const admin = await User.findById(req.userId);
//     if (!admin || admin.role !== 'admin') {
//       return res.status(403).json({ message: 'Non autorisé' });
//     }
//     const { isActive } = req.body;
//     const user = await User.findByIdAndUpdate(req.params.userId, { isActive }, { new: true }).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur' });
//   }
// });

// // ========== ROUTE DYNAMIQUE (TOUJOURS EN DERNIER) ==========
// router.get('/:userId', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur' });
//   }
// });

// export default router;



















import express from 'express';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import { authMiddleware } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

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

// ========== ROUTES DE MODIFICATION DE PROFIL ==========

// 🔧 MODIFIER SON PROPRE PROFIL
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, province, city, district, subjects, classes } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (province !== undefined) updateData.province = province;
    if (city !== undefined) updateData.city = city;
    if (district !== undefined) updateData.district = district;
    if (subjects !== undefined) updateData.subjects = subjects;
    if (classes !== undefined) updateData.classes = classes;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔧 CHANGER LE MOT DE PASSE
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
    }
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }
    
    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔧 MODIFIER PHOTO DE PROFIL
router.put('/photo', authMiddleware, async (req, res) => {
  try {
    const { photo } = req.body;
    
    if (!photo) {
      return res.status(400).json({ message: 'Photo requise' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { photo },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur mise à jour photo:', error);
    res.status(500).json({ message: 'Erreur serveur' });
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

// ========== ROUTES DE NOTIFICATION ==========

// 🔔 COMPTER LES MESSAGES NON LUS
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId
    });
    
    let unreadCount = 0;
    for (const conv of conversations) {
      const unreadMessages = conv.messages.filter(
        msg => msg.senderId.toString() !== req.userId && 
               !msg.readBy.includes(req.userId)
      );
      unreadCount += unreadMessages.length;
    }
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('Erreur comptage:', error);
    res.json({ unreadCount: 0 });
  }
});

// 👁️ MARQUER LES MESSAGES COMME LUS
router.post('/conversation/:conversationId/read', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    for (const message of conversation.messages) {
      if (message.senderId.toString() !== req.userId && 
          !message.readBy.includes(req.userId)) {
        message.readBy.push(req.userId);
      }
    }
    
    await conversation.save();
    res.json({ message: 'Messages marqués comme lus' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
export default router;













































