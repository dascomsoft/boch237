import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (userId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io('http://localhost:5000', {
      auth: { userId },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connecté');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket déconnecté');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  return { socket, isConnected };
};