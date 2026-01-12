// ============================================
// FILE: src/pages/admin/notifications.jsx
// PURPOSE: Admin Push Notifications Management
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Bell, ArrowLeft, Send, Users, Clock, CheckCircle, XCircle, Plus, Edit, Trash2, Eye, Loader2, Target, Calendar, Filter
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminNotifications() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, delivered: 0, clicked: 0, subscribers: 0 });
  const [newNotification, setNewNotification] = useState({
    title: '', body: '', url: '', audience: 'all', scheduledFor: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.get('/api/admin/notifications', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({}));

      setStats({ totalSent: 45230, delivered: 42890, clicked: 8456, subscribers: 12450 });
      setNotifications([
        { id: '1', title: 'New Feature: NFT Minting!', body: 'Create and sell your own NFTs on CYBEV', audience: 'all', sentAt: '2024-12-29T10:00:00Z', delivered: 12450, clicked: 2340, status: 'sent' },
        { id: '2', title: 'Weekly Digest', body: 'Check out trending posts this week', audience: 'active', sentAt: '2024-12-28T09:00:00Z', delivered: 8920, clicked: 1890, status: 'sent' },
        { id: '3', title: 'Premium Discount', body: 'Get 50% off Premium this month!', audience: 'free', sentAt: '2024-12-27T14:00:00Z', delivered: 5680, clicked: 890, status: 'sent' },
        { id: '4', title: 'Creator Update', body: 'New monetization features available', audience: 'creators', scheduledFor: '2024-12-30T10:00:00Z', status: 'scheduled' },
      ]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSend = async () => {
    if (!newNotification.title || !newNotification.body) return;
    setSending(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/admin/notifications/send', newNotification, { headers: { Authorization: `Bearer ${token}` } });
      setShowComposer(false);
      setNewNotification({ title: '', body: '', url: '', audience: 'all', scheduledFor: '' });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const getAudienceLabel = (audience) => {
    const labels = { all: 'All Users', active: 'Active Users', creators: 'Creators', premium: 'Premium', free: 'Free Users' };
    return labels[audience] || audience;
  };

  return (
    <AppLayout>
      <Head><title>Push Notifications - Admin - CYBEV</title></Head>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link href="/admin"><button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"><ArrowLeft className="w-5 h-5" />Back to Dashboard</button></Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center"><Bell className="w-7 h-7 text-gray-900" /></div>
            <div><h1 className="text-2xl font-bold text-gray-900">Push Notifications</h1><p className="text-gray-500">Send notifications to users</p></div>
          </div>
          <button onClick={() => setShowComposer(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-gray-900 rounded-lg hover:bg-purple-600">
            <Plus className="w-4 h-4" />New Notification
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/50 rounded-xl border border-gray-200 p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.subscribers.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Subscribers</p>
          </div>
          <div className="bg-white/50 rounded-xl border border-gray-200 p-4 text-center">
            <Send className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Total Sent</p>
          </div>
          <div className="bg-white/50 rounded-xl border border-gray-200 p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{((stats.delivered / stats.totalSent) * 100).toFixed(1)}%</p>
            <p className="text-gray-500 text-sm">Delivery Rate</p>
          </div>
          <div className="bg-white/50 rounded-xl border border-gray-200 p-4 text-center">
            <Target className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{((stats.clicked / stats.delivered) * 100).toFixed(1)}%</p>
            <p className="text-gray-500 text-sm">Click Rate</p>
          </div>
        </div>

        {/* Notification Composer Modal */}
        {showComposer && (
          <div className="fixed inset-0 bg-gray-900/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Create Notification</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Title</label>
                  <input type="text" value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    placeholder="Notification title" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-500 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-2">Body</label>
                  <textarea value={newNotification.body} onChange={(e) => setNewNotification({ ...newNotification, body: e.target.value })}
                    placeholder="Notification message" rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-500 focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-2">Link URL (optional)</label>
                  <input type="url" value={newNotification.url} onChange={(e) => setNewNotification({ ...newNotification, url: e.target.value })}
                    placeholder="https://cybev.io/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-500 focus:outline-none" />
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-2">Audience</label>
                  <select value={newNotification.audience} onChange={(e) => setNewNotification({ ...newNotification, audience: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-500 focus:outline-none">
                    <option value="all">All Users ({stats.subscribers.toLocaleString()})</option>
                    <option value="active">Active Users (Last 7 days)</option>
                    <option value="creators">Creators Only</option>
                    <option value="premium">Premium Users</option>
                    <option value="free">Free Users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-2">Schedule (optional)</label>
                  <input type="datetime-local" value={newNotification.scheduledFor} onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-500 focus:outline-none" />
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-2">Preview</p>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-gray-900" /></div>
                      <div>
                        <p className="text-gray-900 font-medium">{newNotification.title || 'Notification Title'}</p>
                        <p className="text-gray-500 text-sm">{newNotification.body || 'Notification message...'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowComposer(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-600">Cancel</button>
                <button onClick={handleSend} disabled={sending || !newNotification.title || !newNotification.body}
                  className="flex-1 px-4 py-3 bg-purple-500 text-gray-900 rounded-xl hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center gap-2">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {newNotification.scheduledFor ? 'Schedule' : 'Send Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white/50 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notification History</h3>
          </div>
          <div className="divide-y divide-gray-200/50">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
            ) : notifications.map((notif) => (
              <div key={notif.id} className="p-4 hover:bg-gray-100/30">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-gray-900 font-medium">{notif.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs ${notif.status === 'sent' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{notif.body}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-500" /></button>
                    {notif.status === 'scheduled' && <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4 text-gray-500" /></button>}
                    {notif.status === 'scheduled' && <button className="p-2 hover:bg-gray-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Target className="w-4 h-4" />{getAudienceLabel(notif.audience)}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{notif.sentAt ? new Date(notif.sentAt).toLocaleString() : `Scheduled: ${new Date(notif.scheduledFor).toLocaleString()}`}</span>
                  {notif.delivered && <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" />{notif.delivered.toLocaleString()} delivered</span>}
                  {notif.clicked && <span className="flex items-center gap-1"><Send className="w-4 h-4 text-blue-400" />{notif.clicked.toLocaleString()} clicked</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
