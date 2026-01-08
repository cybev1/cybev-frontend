// ============================================
// FILE: src/pages/admin/moderation.jsx
// Admin Moderation Dashboard
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Shield,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Eye,
  Ban,
  MessageSquare,
  User,
  FileText,
  Loader2,
  ChevronRight,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Activity
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
  escalated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

const REASON_LABELS = {
  spam: '🚫 Spam',
  harassment: '😠 Harassment',
  'hate-speech': '🚷 Hate Speech',
  violence: '⚠️ Violence',
  nudity: '🔞 Nudity',
  'self-harm': '💔 Self-Harm',
  misinformation: '❌ Misinfo',
  copyright: '©️ Copyright',
  impersonation: '🎭 Impersonation',
  scam: '💸 Scam',
  underage: '🔒 Underage',
  other: '📋 Other'
};

export default function ModerationDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'pending',
    priority: '',
    reason: ''
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [moderationStats, setModerationStats] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        status: filters.status,
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.reason && { reason: filters.reason })
      });

      const res = await axios.get(`${API_URL}/api/moderation/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReports(res.data.reports || []);
      setStats(res.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      if (error.response?.status === 403) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/moderation/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModerationStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAction = async (reportId, action, details = {}) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/api/moderation/admin/reports/${reportId}/action`,
        { action, ...details },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error('Action failed:', error);
      alert(error.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/api/moderation/admin/reports/${reportId}/dismiss`,
        { reason: 'No violation found' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error('Dismiss failed:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      <Head>
        <title>Content Moderation | Admin - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Content Moderation
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Review reported content and take action
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pending || 0}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.reviewing || 0}
                  </div>
                  <div className="text-sm text-gray-500">Reviewing</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.resolved || 0}
                  </div>
                  <div className="text-sm text-gray-500">Resolved</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.escalated || 0}
                  </div>
                  <div className="text-sm text-gray-500">Escalated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
              <option value="escalated">Escalated</option>
              <option value="all">All</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.reason}
              onChange={(e) => setFilters(f => ({ ...f, reason: e.target.value }))}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Reasons</option>
              {Object.entries(REASON_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Reports List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No reports found
                </h3>
                <p className="text-gray-500 mt-1">
                  {filters.status === 'pending' 
                    ? 'All caught up! No pending reports.' 
                    : 'Try adjusting your filters'}
                </p>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {reports.map(report => (
                  <div
                    key={report._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition ${
                      report.priority === 'critical' ? 'bg-red-50 dark:bg-red-900/10' : ''
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[report.priority]}`}>
                            {report.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[report.status]}`}>
                            {report.status}
                          </span>
                          <span className="text-sm">
                            {REASON_LABELS[report.reason] || report.reason}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="capitalize">{report.contentType}</span>
                          {report.contentAuthor && (
                            <span> by @{report.contentAuthor.username}</span>
                          )}
                        </div>

                        {report.contentSnapshot?.text && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            "{report.contentSnapshot.text}"
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Reported by @{report.reporter?.username}</span>
                          <span>{formatTimeAgo(report.createdAt)}</span>
                          {report.relatedReports?.length > 0 && (
                            <span className="text-red-500">
                              +{report.relatedReports.length} related reports
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedReport(null)}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Report Details
                  </h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Report Info */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${PRIORITY_COLORS[selectedReport.priority]}`}>
                      {selectedReport.priority} priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[selectedReport.status]}`}>
                      {selectedReport.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Reason</label>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {REASON_LABELS[selectedReport.reason]}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Content Type</label>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {selectedReport.contentType}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Reported By</label>
                      <div className="font-medium text-gray-900 dark:text-white">
                        @{selectedReport.reporter?.username}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Content Author</label>
                      <div className="font-medium text-gray-900 dark:text-white">
                        @{selectedReport.contentAuthor?.username || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* Content Snapshot */}
                  {selectedReport.contentSnapshot?.text && (
                    <div>
                      <label className="text-sm text-gray-500">Reported Content</label>
                      <div className="mt-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                          {selectedReport.contentSnapshot.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  {selectedReport.aiAnalysis && (
                    <div>
                      <label className="text-sm text-gray-500">AI Analysis</label>
                      <div className="mt-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                          selectedReport.aiAnalysis.flagged 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {selectedReport.aiAnalysis.flagged ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {selectedReport.aiAnalysis.flagged ? 'Flagged' : 'Not flagged'}
                        </div>
                        {selectedReport.aiAnalysis.categories?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedReport.aiAnalysis.categories.filter(c => c.score > 0.3).map(cat => (
                              <span key={cat.name} className="text-xs text-gray-600 dark:text-gray-400">
                                {cat.name}: {Math.round(cat.score * 100)}%
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reason Details */}
                  {selectedReport.reasonDetails && (
                    <div>
                      <label className="text-sm text-gray-500">Reporter's Notes</label>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {selectedReport.reasonDetails}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedReport.status === 'pending' || selectedReport.status === 'reviewing' ? (
                  <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Take Action
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleDismiss(selectedReport._id)}
                        disabled={actionLoading}
                        className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleAction(selectedReport._id, 'warning', {
                          reason: `Violation: ${selectedReport.reason}`
                        })}
                        disabled={actionLoading}
                        className="py-2 px-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition disabled:opacity-50"
                      >
                        Issue Warning
                      </button>
                      <button
                        onClick={() => handleAction(selectedReport._id, 'content-removed', {
                          reason: `Violation: ${selectedReport.reason}`
                        })}
                        disabled={actionLoading}
                        className="py-2 px-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition disabled:opacity-50"
                      >
                        Remove Content
                      </button>
                      <button
                        onClick={() => handleAction(selectedReport._id, 'account-suspended', {
                          reason: `Violation: ${selectedReport.reason}`,
                          duration: 24
                        })}
                        disabled={actionLoading}
                        className="py-2 px-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition disabled:opacity-50"
                      >
                        Suspend User (24h)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <div className="text-center text-gray-500">
                      This report has been {selectedReport.status}
                      {selectedReport.resolution?.moderator && (
                        <span> by {selectedReport.resolution.moderator.name}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
