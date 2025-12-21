import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const baseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
  }, []);

  useEffect(() => {
    // Socket is optional in CYBEV right now (backend may not expose socket.io yet).
    // We only attempt connection if a token exists.
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(baseUrl, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    setSocket(s);

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    return () => {
      try {
        s.disconnect();
      } catch {
        // ignore
      }
    };
  }, [baseUrl]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
