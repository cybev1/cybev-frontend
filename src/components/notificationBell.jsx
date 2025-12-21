import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { notificationAPI } from '@/lib/api';

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  const hasToken = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('token'));
  }, []);

  useOutsideClick(wrapRef, () => setOpen(false));

  const fetchUnreadCount = async () => {
    if (!hasToken) return;
    try {
      const { data } = await notificationAPI.getUnreadCount();
      if (data?.ok) setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      // silent
    }
  };

  const fetchNotifications = async () => {
    if (!hasToken) return;
    setLoading(true);
    try {
      const { data } = await notificationAPI.getNotifications({ limit: 20, skip: 0 });
      if (data?.ok) {
        setItems(Array.isArray(data.notifications) ? data.notifications : []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const t = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken]);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) await fetchNotifications();
  };

  const markAllRead = async () => {
    if (!hasToken) return;
    try {
      await notificationAPI.markAllAsRead();
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={toggle}
        className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors relative"
        aria-label="Notifications"
        type="button"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-pink-500 rounded-full text-[10px] text-white flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20">
            <div className="text-white font-semibold">Notifications</div>
            <button
              onClick={markAllRead}
              className="text-sm text-purple-300 hover:text-white inline-flex items-center gap-2"
              type="button"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          </div>

          <div className="max-h-[420px] overflow-auto">
            {loading ? (
              <div className="p-6 flex items-center justify-center text-gray-300 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-gray-300 text-sm">No notifications yet.</div>
            ) : (
              <ul className="divide-y divide-purple-500/10">
                {items.map((n) => {
                  const href =
                    n?.link ||
                    (n?.data?.blogId ? `/blogs/${n.data.blogId}` : n?.data?.postId ? `/posts/${n.data.postId}` : '/feed');

                  return (
                    <li key={n._id} className="p-4 hover:bg-white/5 transition-colors">
                      <Link href={href} onClick={() => setOpen(false)}>
                        <div className="flex items-start gap-3">
                          <div
                            className={[
                              'mt-2 w-2 h-2 rounded-full flex-shrink-0',
                              n.isRead ? 'bg-gray-600' : 'bg-pink-500'
                            ].join(' ')}
                          />
                          <div className="min-w-0">
                            <div className="text-white text-sm font-semibold truncate">{n.title}</div>
                            <div className="text-gray-300 text-xs mt-1 line-clamp-2">{n.message}</div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-4 py-3 border-t border-purple-500/20 text-right">
            <Link href="/notifications" onClick={() => setOpen(false)} className="text-sm text-purple-300 hover:text-white">
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
