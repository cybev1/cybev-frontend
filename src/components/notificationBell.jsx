import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';

import { notificationAPI } from '@/lib/api';

function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const unreadCount = useMemo(
    () => items.reduce((acc, n) => acc + (n?.isRead ? 0 : 1), 0),
    [items]
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
    } catch {}
  };

  const removeOne = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center p-2 rounded-xl hover:bg-white/5 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-red-600 text-white px-1.5 py-0.5 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl border border-white/10 bg-[#0B1020] shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="font-semibold">Notifications</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs px-2 py-1 rounded-lg border border-white/10 hover:bg-white/5"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={load}
                className="text-xs px-2 py-1 rounded-lg border border-white/10 hover:bg-white/5"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-auto">
            {loading ? (
              <div className="p-6 flex items-center justify-center gap-2 text-white/70">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-white/70">No notifications yet.</div>
            ) : (
              <ul className="divide-y divide-white/10">
                {items.map((n) => (
                  <li key={n._id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={`text-sm ${n.isRead ? 'text-white/70' : 'text-white'}`}>
                          {n.message || 'Notification'}
                        </div>
                        <div className="text-xs text-white/50 mt-1">{formatTime(n.createdAt)}</div>
                        {n.entityModel === 'Post' && n.entityId && (
                          <div className="mt-2">
                            <Link
                              href={`/feed?post=${n.entityId}`}
                              className="text-xs text-blue-300 hover:text-blue-200"
                              onClick={() => setOpen(false)}
                            >
                              View
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!n.isRead && (
                          <button
                            type="button"
                            onClick={() => markOneRead(n._id)}
                            className="p-2 rounded-lg hover:bg-white/5"
                            aria-label="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeOne(n._id)}
                          className="p-2 rounded-lg hover:bg-white/5"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
