// ============================================
// FILE: /studio/forms/index.jsx
// PURPOSE: Forms List - Manage all user forms
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus, FileText, MoreVertical, Edit, Eye, Trash2, Copy,
  BarChart2, Share2, ExternalLink, Search, Filter, Clock,
  CheckCircle, XCircle, Archive, Users, Calendar, ChevronDown
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function FormsListPage() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setForms(data.forms || []);
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms/${formId}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        fetchForms();
        setActiveMenu(null);
      }
    } catch (err) {
      console.error('Error duplicating form:', err);
    }
  };

  const handleDelete = async () => {
    if (!formToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms/${formToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        fetchForms();
        setShowDeleteModal(false);
        setFormToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting form:', err);
    }
  };

  const handlePublish = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms/${formId}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchForms();
        setActiveMenu(null);
      }
    } catch (err) {
      console.error('Error publishing form:', err);
    }
  };

  const handleClose = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms/${formId}/close`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchForms();
        setActiveMenu(null);
      }
    } catch (err) {
      console.error('Error closing form:', err);
    }
  };

  const copyFormLink = (slug) => {
    const link = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Form link copied!');
    setActiveMenu(null);
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-green-100 text-green-700',
      closed: 'bg-red-100 text-red-700',
      archived: 'bg-purple-100 text-purple-700'
    };
    const icons = {
      draft: <Clock className="w-3 h-3" />,
      published: <CheckCircle className="w-3 h-3" />,
      closed: <XCircle className="w-3 h-3" />,
      archived: <Archive className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AppLayout>
      <Head>
        <title>Forms | CYBEV Studio</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forms</h1>
            <p className="text-gray-500 mt-1">Create and manage forms for your campaigns</p>
          </div>
          <Link
            href="/studio/forms/builder"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Form
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Forms List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No forms found' : 'No forms yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first form to collect responses'}
            </p>
            <Link
              href="/studio/forms/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Create Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map(form => (
              <div
                key={form._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition group"
              >
                {/* Card Header with Color Bar */}
                <div
                  className="h-2"
                  style={{ backgroundColor: form.branding?.primaryColor || '#7c3aed' }}
                />

                <div className="p-5">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {form.title}
                    </h3>
                    {getStatusBadge(form.status)}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
                    {form.description || 'No description'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {form.analytics?.responses || 0} responses
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-2">
                      <Link
                        href={`/studio/forms/builder?id=${form._id}`}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/studio/forms/${form._id}/responses`}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="View Responses"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </Link>
                      {form.status === 'published' && (
                        <Link
                          href={`/forms/${form.slug}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="Open Form"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>

                    {/* More Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === form._id ? null : form._id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenu === form._id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                          {form.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(form._id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Publish
                            </button>
                          )}
                          {form.status === 'published' && (
                            <>
                              <button
                                onClick={() => copyFormLink(form.slug)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <Share2 className="w-4 h-4" />
                                Copy Link
                              </button>
                              <button
                                onClick={() => handleClose(form._id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <XCircle className="w-4 h-4" />
                                Close Form
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDuplicate(form._id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => {
                              setFormToDelete(form._id);
                              setShowDeleteModal(true);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Form?
            </h3>
            <p className="text-gray-500 mb-6">
              This will permanently delete this form and all its responses. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFormToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </AppLayout>
  );
}
