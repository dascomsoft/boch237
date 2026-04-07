
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

// export { API_URL, SOCKET_URL };







const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// URL pour les appels API REST
export const API_URL = `${API_BASE_URL}/api`;

// URL pour Socket.IO (même base que l'API)
export const SOCKET_URL = API_BASE_URL;

// Pour le débogage (supprime après vérification)
console.log('🔧 [API] BASE_URL:', API_BASE_URL);
console.log('🔧 [API] API_URL:', API_URL);
console.log('🔧 [API] SOCKET_URL:', SOCKET_URL);
