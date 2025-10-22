```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
        withCredentials: true
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('join', user._id);
      });

      newSocket.on('notification', (notification) => {
        // Show toast notification
        toast(
          
            
            
              {notification.sender.username}
              {notification.message}
            
          ,
          {
            duration: 4000,
            icon: '🔔'
          }
        );

        // You can also update notification count here
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    
      {children}
    
  );
}

export const useSocket = () => useContext(SocketContext);
```
