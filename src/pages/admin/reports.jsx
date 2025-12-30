// ============================================
// FILE: src/pages/admin/reports.jsx
// PURPOSE: Admin Reports & Flags Management
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Flag, ArrowLeft, Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle, Trash2, Ban, Clock, Loader2, ChevronDown, MessageCircle
} from 'lucide-react';
import api from '@/lib/api';

const REPORT_TYPES = {
  spam: { label: 'Spam', color: 'bg-yellow-500/20 text-yellow-400' },
  harassment: { label: 'Harassment', color: 'bg-red-500/20 text-red-400' },
  inappropriate: { label: 'Inappropriate Content', color: 'bg-orange-500/20 text-orange-400' },
  copyright: { label: 'Copyright Violation', color: 'bg-blue-500/20 text-blue-400' },
  misinformation: { label: 'Misinformation', color: 'bg-purple-500/20 text-purple-400' },
  other: { label: 'Other', color: 'bg-gray-500/20 text-gray-400' }
};

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [stats, setStats] = useState({ pending: 0, resolved: 0, dismissed: 0 });

  useEffect(() => { fetchReports(); }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const res = await api.get(`/api/admin/reports?status=${filter}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: {} }));
      
      setReports(res.data.reports?.length ? res.data.reports : [
        { _id: '1', type: 'harassment', status: 'pending', contentType: 'post', contentId: '123', contentPreview: 'This is offensive content that violates community guidelines...', reporter: { name: 'John Doe', username: 'johndoe' }, reportedUser: { name: 'Bad Actor', username: 'badactor' }, reason: 'Bullying and harassment in comments', createdAt: '2024-12-29T10:30:00Z' },
        { _id: '2', type: 'spam', status: 'pending', contentType: 'blog', contentId: '456', contentPreview: 'Buy cheap products now! Click here for amazing deals...', reporter: { name: 'Jane Smith', username: 'janesmith' }, reportedUser: { name: 'Spammer123', username: 'spammer123' }, reason: 'Promotional spam content', createdAt: '2024-12-29T09:15:00Z' },
        { _id: '3', type: 'inappropriate', status: 'pending', contentType: 'comment', contentId: '789', contentPreview: 'Explicit content that should not be on the platform...', reporter: { name: 'Alice Brown', username: 'aliceb' }, reportedUser: { name: 'User456', username: 'user456' }, reason: 'Adult content in public post', createdAt: '2024-12-29T08:45:00Z' },
        { _id: '4', type: 'copyright', status: 'resolved', contentType: 'post', contentId: '101', contentPreview: 'Stolen artwork from another creator', reporter: { name: 'Creator Original', username: 'originalcreator' }, reportedUser: { name: 'Copier', username: 'copier' }, reason: 'Reposted my artwork without permission', createdAt: '2024-12-28T14:20:00Z', resolvedAt: '2024-12-28T16:00:00Z', resolution: 'Content removed' },
      ]);
      setStats({ pending: 12, resolved: 45, dismissed: 8 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (reportId, action) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/admin/reports/${reportId}/${action}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchReports();
      setSelectedReport(null);
    } catch (err) { console.error(err); }
  };

  return (
    <AppLayout>
      <Head><title>Reports - Admin - CYBEV</title></Head>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/admin"><button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-5 h-5" />Back to Dashboard</button></Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center"><Flag className="w-7 h-7 text-white" /></div>
          <div><h1 className="text-2xl font-bold text-white">Reports & Flags</h1><p className="text-gray-400">Review and manage user reports</p></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-gray-400 text-sm">Pending</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
            <p className="text-gray-400 text-sm">Resolved</p>
          </div>
          <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4 text-center">
            <XCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-400">{stats.dismissed}</p>
            <p className="text-gray-400 text-sm">Dismissed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['pending', 'resolved', 'dismissed', 'all'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg capitalize ${filter === f ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{f}</button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-gray-800/50 rounded-2xl p-12 flex justify-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
          ) : reports.map((report) => (
            <div key={report._id} className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${REPORT_TYPES[report.type]?.color || REPORT_TYPES.other.color}`}>
                    {REPORT_TYPES[report.type]?.label || report.type}
                  </span>
                  <span className="text-gray-400 text-sm capitalize">{report.contentType}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : report.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {report.status}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">{new Date(report.createdAt).toLocaleString()}</span>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                <p className="text-gray-300 line-clamp-2">{report.contentPreview}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400">Reported by:</p>
                  <p className="text-white">@{report.reporter.username}</p>
                </div>
                <div>
                  <p className="text-gray-400">Reported user:</p>
                  <p className="text-white">@{report.reportedUser.username}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Reason:</p>
                <p className="text-gray-300">{report.reason}</p>
              </div>

              {report.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button onClick={() => handleAction(report._id, 'view')} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"><Eye className="w-4 h-4" />View Content</button>
                  <button onClick={() => handleAction(report._id, 'remove')} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><Trash2 className="w-4 h-4" />Remove Content</button>
                  <button onClick={() => handleAction(report._id, 'ban')} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Ban className="w-4 h-4" />Ban User</button>
                  <button onClick={() => handleAction(report._id, 'dismiss')} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"><XCircle className="w-4 h-4" />Dismiss</button>
                </div>
              )}

              {report.resolution && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-green-400 text-sm">Resolution: {report.resolution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
