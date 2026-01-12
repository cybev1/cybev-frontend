// ============================================
// FILE: src/pages/notifications.jsx
// CYBEV Notifications - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import { Bell, Heart, MessageCircle, UserPlus, Share2, Star, Loader2, Check, Trash2, Settings } from 'lucide-react';

const NOTIFICATION_ICONS = {
  like: { icon: Heart, color: 'text-red-500', bg: 'bg-red-100' },
  comment: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-100' },
  follow: { icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-100' },
  share: { icon: Share2, color: 'text-green-500', bg: 'bg-green-100' },
  mention: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  default: { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-100' }
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }
      const res = await api.get('/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(res.data.notifications || res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/notifications/mark-all-read', {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <Head><title>Notifications | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} unread</p>}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" />Mark all read
                </button>
              )}
              <Link href="/settings/notifications">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['all', 'unread', 'like', 'comment', 'follow'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notification => {
                  const config = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.default;
                  const Icon = config.icon;
                  return (
                    <div key={notification._id}
                      className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-purple-50/50' : ''}`}
                      onClick={() => notification.link && router.push(notification.link)}>
                      <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">
                          <span className="font-semibold">{notification.sender?.name || 'Someone'}</span>
                          {' '}{notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{getTimeAgo(notification.createdAt)}</p>
                      </div>
                      {!notification.read && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full flex-shrink-0 mt-2" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
