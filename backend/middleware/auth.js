import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('🔐 Auth - Token reçu:', token ? 'Oui' : 'Non');
  
  if (!token) {
    console.log('❌ Auth - Pas de token');
    return res.status(401).json({ message: 'Accès non autorisé' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Auth - Token valide pour userId:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('❌ Auth - Token invalide:', error.message);
    res.status(401).json({ message: 'Token invalide' });
  }
};
