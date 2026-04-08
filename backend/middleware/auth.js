// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
  
//   console.log('🔐 Auth - Token reçu:', token ? 'Oui' : 'Non');
  
//   if (!token) {
//     console.log('❌ Auth - Pas de token');
//     return res.status(401).json({ message: 'Accès non autorisé' });
//   }
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('✅ Auth - Token valide pour userId:', decoded.userId);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     console.error('❌ Auth - Token invalide:', error.message);
//     res.status(401).json({ message: 'Token invalide' });
//   }
// };






















































import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Pas de token ou format incorrect');
    return res.status(401).json({ message: 'Non autorisé' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token || token === 'null' || token === 'undefined') {
    console.log('❌ Token vide ou null');
    return res.status(401).json({ message: 'Token invalide' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    console.log('✅ Token valide pour:', req.userId);
    next();
  } catch (error) {
    console.error('❌ Erreur JWT:', error.message);
    return res.status(401).json({ message: 'Token invalide', error: error.message });
  }
};