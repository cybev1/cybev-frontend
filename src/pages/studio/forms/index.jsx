// ============================================
// FILE: src/pages/studio/forms/index.jsx
// PURPOSE: Forms List Page in Studio
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus, Search, MoreVertical, Eye, Edit, Trash2, Copy,
  ExternalLink, BarChart2, FileText, Calendar, Clock,
  CheckCircle, XCircle, Archive, Filter
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
  published: { label: 'Published', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-red-100 text-red-700', icon: XCircle },
  archived: { label: 'Archived', color: 'bg-purple-100 text-purple-700', icon: Archive }
};

export default function FormsListPage() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

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
      if (data.ok) setForms(data.forms || []);
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms/${formId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setForms(prev => prev.filter(f => f._id !== formId));
        setShowDeleteModal(null);
      }
    } catch (err) {
      console.error('Error deleting form:', err);
    }
  };

  const duplicateForm = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/forms/${formId}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        fetchForms();
      }
    } catch (err) {
      console.error('Error duplicating form:', err);
    }
  };

  const copyFormLink = (form) => {
    const url = `${window.location.origin}/forms/${form.slug}`;
    navigator.clipboard.writeText(url);
    alert('Form link copied to clipboard!');
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <Head>
        <title>Forms Builder | CYBEV Studio</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forms Builder</h1>
            <p className="text-gray-500">Create surveys, collect feedback, and gather responses</p>
          </div>
          <Link
            href="/studio/forms/builder"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            New Form
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Forms List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
                ? 'Try adjusting your search or filters' 
                : 'Create your first form to start collecting responses'}
            </p>
            <Link
              href="/studio/forms/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Create Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map(form => (
              <FormCard
                key={form._id}
                form={form}
                onDelete={() => setShowDeleteModal(form._id)}
                onDuplicate={() => duplicateForm(form._id)}
                onCopyLink={() => copyFormLink(form)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Delete Form?</h3>
            <p className="text-gray-500 mb-6">
              This will permanently delete the form and all its responses. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteForm(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// Form Card Component
function FormCard({ form, onDelete, onDuplicate, onCopyLink }) {
  const [showMenu, setShowMenu] = useState(false);
  const status = STATUS_CONFIG[form.status] || STATUS_CONFIG.draft;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {form.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {form.fields?.length || 0} fields · {form.responses?.length || 0} responses
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-40 z-10">
                  <Link
                    href={`/studio/forms/builder?id=${form._id}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Link>
                  <Link
                    href={`/studio/forms/${form._id}/responses`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    <BarChart2 className="w-4 h-4" /> Responses
                  </Link>
                  <button
                    onClick={() => { onCopyLink(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    <Copy className="w-4 h-4" /> Copy Link
                  </button>
                  <button
                    onClick={() => { onDuplicate(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    <Copy className="w-4 h-4" /> Duplicate
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-red-600"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(form.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/studio/forms/builder?id=${form._id}`}
            className="flex-1 text-center py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Edit
          </Link>
          <Link
            href={`/studio/forms/${form._id}/responses`}
            className="flex-1 text-center py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Responses
          </Link>
        </div>
      </div>
    </div>
  );
}
