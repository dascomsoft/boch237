
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Un administrateur existe déjà :');
      console.log(`   Nom: ${existingAdmin.name}`);
      console.log(`   Téléphone: ${existingAdmin.phone}`);
      console.log('\n💡 Connecte-toi avec ces identifiants');
      await mongoose.disconnect();
      return;
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Créer l'administrateur
    const admin = new User({
      phone: '600000000',
      password: hashedPassword,
      role: 'admin',
      name: 'Administrateur',
      province: 'Centre',
      city: 'Yaoundé',
      district: 'Centre Ville',
      isActive: true
    });
    
    await admin.save();
    
    console.log('✅ Administrateur créé avec succès !');
    console.log('\n📱 Informations de connexion :');
    console.log('   Téléphone: 600000000');
    console.log('   Mot de passe: admin123');
    console.log('   Rôle: Administrateur');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

createAdmin();
