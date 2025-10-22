```javascript
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import EmptyState from '@/components/EmptyState';
import { notificationAPI } from '@/lib/api';
import { Bell, Trash2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationAPI.getNotifications({
        page,
        limit: 20,
        unread: filter === 'unread'
      });
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationLink = (notification) => {
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
    
      
        {/* Header */}
        
          Notifications
          Stay updated with your activity
        

        {/* Filters and Actions */}
        
          
            
              <button
                onClick={() => {
                  setFilter('all');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              
              <button
                onClick={() => {
                  setFilter('unread');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unread
              
            

            {notifications.some(n => !n.read) && (
              
                
                Mark all as read
              
            )}
          
        

        {/* Notifications List */}
        {loading ? (
          
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications"
            description={
              filter === 'unread'
                ? "You're all caught up!"
                : 'No notifications yet'
            }
          />
        ) : (
          
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`
                  bg-white rounded-lg shadow-sm border border-gray-200 transition-all
                  ${!notification.read ? 'border-blue-200 bg-blue-50/30' : ''}
                `}
              >
                
                  
                    <img
                      src={notification.sender.avatar || '/default-avatar.png'}
                      alt={notification.sender.username}
                      className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
                    />
                  

                  
                    
                      
                        
                          
                            {notification.sender.username}
                          
                          {' '}
                          {notification.message}
                        
                        
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true
                          })}
                        
                      
                    
                  

                  
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        
                      
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      
                    
                  
                
              
            ))}
          
        )}

        {/* Load More */}
        {notifications.length > 0 && notifications.length >= 20 && (
          
            <button
              onClick={() => setPage(page + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More
            
          
        )}
      
    
  );
}

function NotificationsSkeleton() {
  return (
    
      {[1, 2, 3, 4, 5].map(i => (
        
          
            
            
              
              
            
          
        
      ))}
    
  );
}
```

---
