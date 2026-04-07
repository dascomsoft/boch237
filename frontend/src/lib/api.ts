
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

// export { API_URL, SOCKET_URL };







// Récupère l'URL de base
// ⚠️ NEXT_PUBLIC_API_URL doit être défini sur Vercel comme: https://boch237-backend.onrender.com
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Pour les appels API REST (avec /api)
export const API_URL = `${API_BASE_URL}/api`;

// Pour Socket.IO (sans /api)
export const SOCKET_URL = API_BASE_URL;

// Vérification en console
if (typeof window !== 'undefined') {
  console.log('🔧 API_URL:', API_URL);
  console.log('🔧 SOCKET_URL:', SOCKET_URL);
}

