import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext({ socket: null });

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  // Support both keys (we'll normalize later)
  return localStorage.getItem('cybev_token') || localStorage.getItem('token');
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // Not authenticated; don't connect
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      // Avoid throwing in build; just skip
      return;
    }

    const s = io(baseUrl, {
      transports: ['websocket'],
      auth: { token },
    });

    setSocket(s);

    return () => {
      try {
        s.disconnect();
      } catch {
        // ignore
      }
    };
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
