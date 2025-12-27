import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';

import { notificationAPI } from '@/lib/api';
import { useSocket } from '@/context/SocketContext';

function formatTime(ts) {
  try {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  
  // Get real-time notifications from socket
  const { realtimeNotifications, unreadCount: socketUnreadCount, markAllAsRead: socketMarkAllRead } = useSocket();

  // Merge real-time and fetched notifications
  const mergedItems = useMemo(() => {
    const fetchedIds = new Set(items.map(n => n._id));
    const newRealtime = realtimeNotifications.filter(n => !fetchedIds.has(n._id));
    return [...newRealtime, ...items];
  }, [items, realtimeNotifications]);

  const unreadCount = useMemo(
    () => mergedItems.reduce((acc, n) => acc + (n?.isRead ? 0 : 1), 0),
    [mergedItems]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.getNotifications({ limit: 25 });
      setItems(res.data?.notifications || []);
    } catch (e) {
      // silent: keep UI clean
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Refresh when new real-time notifications arrive
  useEffect(() => {
    if (realtimeNotifications.length > 0 && open) {
      load();
    }
  }, [realtimeNotifications.length]);

  const markOneRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      socketMarkAllRead?.();
    } catch {}
  };

  const removeOne = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  const getIcon = (type) => {
    const icons = {
      follow: '👤',
      like: '❤️',
      comment: '💬',
      comment_like: '👍',
      mention: '📢',
      reward: '🎁',
      system: '📣'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load(); // Refresh on open
        }}
        className="relative inline-flex items-center justify-center p-2 rounded-xl hover:bg-white/5 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-red-600 text-white px-1.5 py-0.5 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl border border-white/10 bg-[#0B1020] shadow-xl overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
                {unreadCount > 0 && (
                  <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs px-2 py-1 rounded-lg border border-white/10 hover:bg-white/5 text-purple-400"
                  >
                    Mark all read
                  </button>
                )}
                <Link href="/notifications" onClick={() => setOpen(false)}>
                  <span className="text-xs text-purple-400 hover:text-purple-300">View all</span>
                </Link>
              </div>
            </div>

            <div className="max-h-[420px] overflow-auto">
              {loading ? (
                <div className="p-6 flex items-center justify-center gap-2 text-white/70">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                </div>
              ) : mergedItems.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-white/70">No notifications yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/10">
                  {mergedItems.slice(0, 20).map((n) => (
                    <li 
                      key={n._id} 
                      className={`px-4 py-3 hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-purple-500/5' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-lg">{getIcon(n.type)}</span>
                          <div className="min-w-0">
                            <div className={`text-sm ${n.isRead ? 'text-white/70' : 'text-white font-medium'}`}>
                              {n.message || 'Notification'}
                            </div>
                            <div className="text-xs text-white/50 mt-1">{formatTime(n.createdAt)}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {!n.isRead && (
                            <button
                              type="button"
                              onClick={() => markOneRead(n._id)}
                              className="p-1.5 rounded-lg hover:bg-white/10"
                              aria-label="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeOne(n._id)}
                            className="p-1.5 rounded-lg hover:bg-white/10"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
