```javascript
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { notificationAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await notificationAPI.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationAPI.getNotifications({ limit: 5 });
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    
      
        
        {unreadCount > 0 && (
          
            {unreadCount > 9 ? '9+' : unreadCount}
          
        )}
      

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
            {/* Header */}
            
              Notifications
              {unreadCount > 0 && (
                
                  Mark all read
                
              )}
            

            {/* Notifications List */}
            
              {loading ? (
                
                  Loading...
                
              ) : notifications.length === 0 ? (
                
                  
                  No notifications yet
                
              ) : (
                notifications.map(notification => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onRead={() => {
                      setUnreadCount(Math.max(0, unreadCount - 1));
                      setShowDropdown(false);
                    }}
                  />
                ))
              )}
            

            {/* Footer */}
            
              
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all notifications
                
              
            
          
        </>
      )}
    
  );
}

function NotificationItem({ notification, onRead }) {
  const handleClick = async () => {
    try {
      if (!notification.read) {
        await notificationAPI.markAsRead(notification._id);
      }
      onRead();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getNotificationLink = () => {
    switch (notification.type) {
      case 'follow':
        return `/profile/${notification.sender.username}`;
      case 'like':
      case 'comment':
        return `/blog/${notification.target}`;
      case 'reply':
        return `/blog/${notification.target}`;
      default:
        return '#';
    }
  };

  return (
    
      
        
          <img
            src={notification.sender.avatar || '/default-avatar.png'}
            alt={notification.sender.username}
            className="w-10 h-10 rounded-full"
          />
          
            
              {notification.sender.username}
              {' '}
              {notification.message}
            
            
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            
          
          {!notification.read && (
            
          )}
        
      
    
  );
}
```

---
