// ============================================
// FILE: src/pages/admin/content.jsx
// Admin Content Moderation
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { adminAPI } from '@/lib/api';
import { 
  FileText, MessageCircle, Flag, Trash2, Eye, EyeOff,
  ChevronLeft, ChevronRight, RefreshCw, AlertTriangle,
  Check, X, Filter, Clock, User
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminContent() {
  const router = useRouter();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    fetchContent();
  }, [pagination.page, filters]);

  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'admin') {
      toast.error('Admin access required');
      router.push('/');
      return;
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getContent({
        page: pagination.page,
        limit: pagination.limit,
        type: filters.type,
        status: filters.status
      });

      if (response.data.ok) {
        setContent(response.data.content);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            ...response.data.pagination
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (action) => {
    if (!selectedItem) return;
    
    setActionLoading(true);
    try {
      await adminAPI.moderateContent(
        selectedItem.contentType,
        selectedItem._id,
        action,
        moderationReason
      );

      const messages = {
        hide: 'Content hidden',
        unhide: 'Content visible',
        flag: 'Content flagged for review',
        unflag: 'Flag removed',
        delete: 'Content deleted'
      };

      toast.success(messages[action] || 'Action completed');
      fetchContent();
      setShowModal(false);
      setSelectedItem(null);
      setModerationReason('');
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getContentPreview = (item) => {
    if (item.contentType === 'blog') {
      return item.title || 'Untitled Blog';
    }
    if (item.contentType === 'comment') {
      return item.content?.substring(0, 100) || 'No content';
    }
    return item.content?.substring(0, 100) || item.text?.substring(0, 100) || 'No preview';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blog': return <FileText className="w-4 h-4" />;
      case 'comment': return <MessageCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'blog': return 'bg-blue-500/20 text-blue-300';
      case 'comment': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const ContentCard = ({ item }) => (
    <div className={`bg-gray-800/30 rounded-xl p-5 border transition-all ${
      item.isFlagged 
        ? 'border-red-500/50 bg-red-900/10' 
        : item.isHidden 
          ? 'border-yellow-500/30 bg-yellow-900/10' 
          : 'border-purple-500/20 hover:border-purple-500/40'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.contentType)}`}>
              {getTypeIcon(item.contentType)}
              {item.contentType}
            </span>
            {item.isFlagged && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-medium">
                <Flag className="w-3 h-3" />
                Flagged
              </span>
            )}
            {item.isHidden && (
              <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-medium">
                <EyeOff className="w-3 h-3" />
                Hidden
              </span>
            )}
          </div>

          {/* Content Preview */}
          <h3 className="text-white font-medium mb-2 line-clamp-2">
            {getContentPreview(item)}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {item.author?.username || item.authorName || 'Unknown'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
            {item.contentType === 'blog' && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {item.views || 0} views
              </span>
            )}
          </div>

          {/* Flag Reason */}
          {item.flagReason && (
            <div className="mt-2 px-3 py-2 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                {item.flagReason}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { setSelectedItem(item); setShowModal(true); }}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            Moderate
          </button>
          {item.contentType === 'blog' && (
            <Link href={`/blog/${item._id}`}>
              <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors w-full">
                View
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Content Moderation - CYBEV Admin</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <div className="bg-gray-900/50 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin/Admin_dashboard">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-400" />
                    Content Moderation
                  </h1>
                  <p className="text-gray-400 text-sm">Review and moderate platform content</p>
                </div>
              </div>
              <button
                onClick={fetchContent}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Filter:</span>
            </div>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="blogs">Blogs</option>
              <option value="comments">Comments</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="flagged">Flagged</option>
              <option value="hidden">Hidden</option>
            </select>

            {/* Quick Stats */}
            <div className="ml-auto flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                {content.filter(c => c.isFlagged).length} flagged
              </span>
              <span className="text-gray-400 text-sm">
                {content.filter(c => c.isHidden).length} hidden
              </span>
            </div>
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-purple-500/20">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No content found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item) => (
                <ContentCard key={`${item.contentType}-${item._id}`} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Moderation Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-2">
                Moderate {selectedItem.contentType}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {getContentPreview(selectedItem)}
              </p>

              {/* Reason Input */}
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Reason (optional)</label>
                <textarea
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  placeholder="Enter reason for moderation action..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={2}
                />
              </div>
              
              <div className="space-y-3">
                {!selectedItem.isHidden ? (
                  <button
                    onClick={() => handleModeration('hide')}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
                  >
                    <EyeOff className="w-5 h-5" />
                    Hide Content
                  </button>
                ) : (
                  <button
                    onClick={() => handleModeration('unhide')}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    Unhide Content
                  </button>
                )}

                {!selectedItem.isFlagged ? (
                  <button
                    onClick={() => handleModeration('flag')}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg transition-colors"
                  >
                    <Flag className="w-5 h-5" />
                    Flag for Review
                  </button>
                ) : (
                  <button
                    onClick={() => handleModeration('unflag')}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Remove Flag
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm('Are you sure? This cannot be undone.')) {
                      handleModeration('delete');
                    }
                  }}
                  disabled={actionLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Permanently
                </button>
              </div>

              <button
                onClick={() => { setShowModal(false); setSelectedItem(null); setModerationReason(''); }}
                className="w-full mt-4 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
