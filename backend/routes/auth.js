import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    // ✅ AJOUT DE subjects ET classes
    const { phone, password, name, role, province, city, district, subjects, classes } = req.body;
    
    console.log('📝 Nouvelle inscription:', { phone, name, role });
    console.log('📚 Subjects reçus:', subjects);
    console.log('🎓 Classes reçues:', classes);
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce numéro est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ✅ Créer l'utilisateur AVEC subjects et classes
    const user = new User({
      phone,
      password: hashedPassword,
      name,
      role: role || 'parent',
      province,
      city,
      district,
      subjects: subjects || [],
      classes: classes || []
    });
    
    await user.save();
    
    console.log('✅ Utilisateur créé:', user.name);
    console.log('�� Subjects enregistrés:', user.subjects);
    console.log('🎓 Classes enregistrées:', user.classes);
    
    // Générer le token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Vérifier l'utilisateur
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Numéro ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Numéro ou mot de passe incorrect' });
    }
    
    // Générer le token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
