import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['parent', 'tutor', 'admin'], default: 'parent' },
  name: { type: String, required: true },
  province: String,
  city: String,
  district: String,
  subjects: [String], // Pour les répétiteurs
  classes: [String], // Pour les répétiteurs
  photo: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);