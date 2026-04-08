

import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function getAdminId() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log('✅ Admin trouvé !');
      console.log('📝 ID:', admin._id.toString());
      console.log('👤 Nom:', admin.name);
      console.log('📱 Téléphone:', admin.phone);
      console.log('\n🔧 Copie cet ID pour l\'utiliser dans ContactAdminButton.tsx');
    } else {
      console.log('❌ Aucun admin trouvé');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

getAdminId();
