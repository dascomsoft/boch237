
import express from 'express';
import Annonce from '../models/Annonce.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'OK' });
});

router.get('/', async (req, res) => {
  try {
    const annonces = await Annonce.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(annonces);
  } catch (error) {
    res.json([]);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const annonce = new Annonce({
      ...req.body,
      parentId: req.userId,
      parentName: user.name,
      parentPhone: user.phone,
      status: 'pending'
    });
    await annonce.save();
    res.status(201).json(annonce);
  } catch (error) {
    res.status(500).json({ message: 'Erreur' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'admin') return res.status(403).json({ message: 'Non autorisé' });
  const annonces = await Annonce.find().sort({ createdAt: -1 });
  res.json(annonces);
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'admin') return res.status(403).json({ message: 'Non autorisé' });
  const annonce = await Annonce.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(annonce);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  const annonce = await Annonce.findById(req.params.id);
  if (annonce.parentId.toString() !== req.userId && user.role !== 'admin') {
    return res.status(403).json({ message: 'Non autorisé' });
  }
  await Annonce.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supprimé' });
});

router.post('/admin/create', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'admin') return res.status(403).json({ message: 'Non autorisé' });
  
  const { parentPhone, parentName, ...data } = req.body;
  let parent = await User.findOne({ phone: parentPhone });
  
  if (!parent) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('parent123', 10);
    parent = new User({ phone: parentPhone, name: parentName || 'Parent', password: hashedPassword, role: 'parent' });
    await parent.save();
  }
  
  const annonce = new Annonce({ ...data, parentId: parent._id, parentName: parent.name, parentPhone: parent.phone, status: 'approved' });
  await annonce.save();
  res.status(201).json(annonce);
});

router.post('/admin/add-tutor', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'admin') return res.status(403).json({ message: 'Non autorisé' });
  
  const bcrypt = await import('bcryptjs');
  const tempPassword = Math.random().toString(36).substring(7);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
  const tutor = new User({ ...req.body, password: hashedPassword, role: 'tutor' });
  await tutor.save();
  
  res.json({ tutor, tempPassword, message: `Mot de passe: ${tempPassword}` });
});

export default router;
