// ============================================
// FILE: src/pages/studio/forms/index.jsx
// CYBEV Form Builder - Pop-ups, Embedded Forms
// VERSION: 1.0.0 - Klaviyo-Quality Forms
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  FileText, Plus, Edit2, Trash2, Copy, Eye, MoreHorizontal,
  Play, Pause, BarChart3, Users, ArrowLeft, Search, Filter,
  Loader2, Check, X, ExternalLink, Code, Zap, Target,
  Layout, Smartphone, Monitor, MessageSquare, Bell, Gift,
  ChevronDown, Settings, TrendingUp, MousePointer
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const FORM_TYPES = [
  { id: 'popup', name: 'Pop-up', icon: MessageSquare, description: 'Modal that appears over content' },
  { id: 'embedded', name: 'Embedded', icon: Code, description: 'Inline form in your page' },
  { id: 'flyout', name: 'Fly-out', icon: Bell, description: 'Slides in from the side' },
  { id: 'fullscreen', name: 'Full Screen', icon: Monitor, description: 'Takes over the entire screen' },
  { id: 'banner', name: 'Banner', icon: Layout, description: 'Fixed bar at top or bottom' },
];

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFormType, setNewFormType] = useState('popup');
  const [newFormName, setNewFormName] = useState('');
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchForms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/forms`, getAuth());
      const data = await res.json();
      if (data.forms) setForms(data.forms);
    } catch (err) {
      console.error('Fetch forms error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createForm = async () => {
    if (!newFormName.trim()) return;
    setCreating(true);
    
    try {
      const res = await fetch(`${API_URL}/api/forms`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          name: newFormName,
          type: newFormType
        })
      });
      
      const data = await res.json();
      if (data.form) {
        router.push(`/studio/forms/${data.form._id}/edit`);
      }
    } catch (err) {
      alert('Failed to create form');
    } finally {
      setCreating(false);
    }
  };

  const toggleFormStatus = async (form) => {
    const endpoint = form.status === 'active' ? 'pause' : 'activate';
    try {
      await fetch(`${API_URL}/api/forms/${form._id}/${endpoint}`, {
        method: 'POST',
        ...getAuth()
      });
      fetchForms();
    } catch (err) {
      alert('Failed to update form status');
    }
  };

  const duplicateForm = async (formId) => {
    try {
      const res = await fetch(`${API_URL}/api/forms/${formId}/duplicate`, {
        method: 'POST',
        ...getAuth()
      });
      const data = await res.json();
      if (data.form) {
        fetchForms();
      }
    } catch (err) {
      alert('Failed to duplicate form');
    }
  };

  const deleteForm = async (formId) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    
    try {
      await fetch(`${API_URL}/api/forms/${formId}`, {
        method: 'DELETE',
        ...getAuth()
      });
      fetchForms();
    } catch (err) {
      alert('Failed to delete form');
    }
  };

  const filteredForms = forms.filter(form => {
    if (filter !== 'all' && form.status !== filter) return false;
    if (searchQuery && !form.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: forms.length,
    active: forms.filter(f => f.status === 'active').length,
    totalViews: forms.reduce((sum, f) => sum + (f.stats?.views || 0), 0),
    totalSubmissions: forms.reduce((sum, f) => sum + (f.stats?.submissions || 0), 0)
  };

  return (
    <AppLayout>
      <Head>
        <title>Sign-up Forms - CYBEV Studio</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Sign-up Forms</h1>
            <p className="text-gray-600">Grow your list with pop-ups, embedded forms, and more</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Form
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Forms', value: stats.total, icon: FileText, color: 'purple' },
            { label: 'Active', value: stats.active, icon: Play, color: 'green' },
            { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'blue' },
            { label: 'Submissions', value: stats.totalSubmissions.toLocaleString(), icon: Users, color: 'orange' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'paused', 'draft'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Forms List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-500 mb-4">Create your first form to start collecting subscribers</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredForms.map(form => {
              const TypeIcon = FORM_TYPES.find(t => t.id === form.type)?.icon || FileText;
              const conversionRate = form.stats?.views > 0 
                ? (form.stats.submissions / form.stats.views * 100).toFixed(1) 
                : '0.0';
              
              return (
                <div
                  key={form._id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        form.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <TypeIcon className={`w-6 h-6 ${
                          form.status === 'active' ? 'text-green-600' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{form.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="capitalize">{form.type}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            form.status === 'active' 
                              ? 'bg-green-100 text-green-700'
                              : form.status === 'paused'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {form.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{form.stats?.views?.toLocaleString() || 0}</p>
                          <p className="text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{form.stats?.submissions?.toLocaleString() || 0}</p>
                          <p className="text-gray-500">Submits</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">{conversionRate}%</p>
                          <p className="text-gray-500">CVR</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFormStatus(form)}
                          className={`p-2 rounded-lg ${
                            form.status === 'active'
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={form.status === 'active' ? 'Pause' : 'Activate'}
                        >
                          {form.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/studio/forms/${form._id}/edit`}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/studio/forms/${form._id}/analytics`}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                          title="Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => duplicateForm(form._id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteForm(form._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Create New Form</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Form Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
                <input
                  type="text"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Newsletter Sign-up"
                  autoFocus
                />
              </div>

              {/* Form Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FORM_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewFormType(type.id)}
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          newFormType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${
                          newFormType === type.id ? 'text-purple-600' : 'text-gray-500'
                        }`} />
                        <h4 className="font-medium text-gray-900">{type.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createForm}
                disabled={creating || !newFormName.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Form
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
