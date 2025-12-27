import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext({ 
  socket: null, 
  connected: false,
  unreadCount: 0,
  realtimeNotifications: [],
  markAsRead: () => {},
  markAllAsRead: () => {}
});

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cybev_token') || localStorage.getItem('token');
}

function getUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    const user = getUser();
    
    if (!token || !user) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
    if (!baseUrl) {
      return;
    }

    const s = io(baseUrl, {
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    s.on('connect', () => {
      console.log('🔌 Socket connected');
      setConnected(true);
      // Join user's room
      s.emit('join', user.id || user._id);
    });

    s.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setConnected(false);
    });

    s.on('connect_error', (error) => {
      console.log('🔌 Socket error:', error.message);
      setConnected(false);
    });

    // Handle incoming notifications
    s.on('notification', (notification) => {
      console.log('🔔 Real-time notification:', notification);
      
      setRealtimeNotifications(prev => [notification, ...prev.slice(0, 49)]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast
      const messages = {
        follow: '👤 New follower!',
        like: '❤️ Someone liked your post',
        comment: '💬 New comment',
        comment_like: '👍 Comment liked',
        mention: '📢 You were mentioned',
        reward: '🎁 Tokens earned!',
        system: '📣 Notification'
      };
      
      toast.info(messages[notification.type] || notification.message || 'New notification', {
        position: 'top-right',
        autoClose: 3000
      });
    });

    setSocket(s);

    return () => {
      if (s) {
        const userId = user?.id || user?._id;
        if (userId) s.emit('leave', userId);
        s.disconnect();
      }
    };
  }, []);

  const markAsRead = useCallback((id) => {
    setRealtimeNotifications(prev => 
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setRealtimeNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  const value = useMemo(() => ({ 
    socket, 
    connected,
    realtimeNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    updateUnreadCount
  }), [socket, connected, realtimeNotifications, unreadCount, markAsRead, markAllAsRead, updateUnreadCount]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
