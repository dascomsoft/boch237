// Configuration centralisée des URLs API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// URL complète pour les appels API
export const API_URL = `${API_BASE_URL}/api`;

// URL pour Socket.IO (chat temps réel)
export const SOCKET_URL = API_BASE_URL;

// Export de la configuration
export const config = {
  apiUrl: API_URL,
  socketUrl: SOCKET_URL
};
