
import mongoose from 'mongoose';

const annonceSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  class: String,
  city: String,
  district: String,
  budget: String,
  duration: { type: String, default: 'Ponctuel' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parentName: String,
  parentPhone: String,
  adminComment: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Annonce', annonceSchema);
