// ============================================
// FILE: pages/studio/automation/index.jsx
// CYBEV Automation Workflow Builder
// VERSION: 1.0.0 - Visual Workflow Editor
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus, Play, Pause, Trash2, Copy, Settings, BarChart2,
  Mail, Clock, GitBranch, Tag, Users, Webhook, Bell,
  ChevronRight, Search, Filter, MoreVertical, ArrowLeft,
  Zap, Target, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

// ==========================================
// AUTOMATION LIST PAGE
// ==========================================

export default function AutomationPage() {
  const router = useRouter();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, [filter]);

  const fetchAutomations = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      
      const res = await fetch(`/api/automation?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAutomations(data.automations || []);
    } catch (err) {
      console.error('Fetch automations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/automation/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAutomations();
      }
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/automation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAutomations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/automation/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAutomations();
      }
    } catch (err) {
      console.error('Duplicate error:', err);
    }
  };

  const filteredAutomations = automations.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTriggerIcon = (type) => {
    const icons = {
      manual: Users,
      list_subscribe: Users,
      tag_added: Tag,
      email_received: Mail,
      form_submit: Target,
      date_based: Clock,
      api: Webhook,
      no_activity: AlertCircle
    };
    const Icon = icons[type] || Zap;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <>
      <Head>
        <title>Automations | CYBEV Studio</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/studio" className="text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Automations</h1>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5" />
                Create Automation
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{automations.filter(a => a.status === 'active').length}</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {automations.reduce((sum, a) => sum + (a.stats?.currentlyActive || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-500">Active Subscribers</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {automations.reduce((sum, a) => sum + (a.stats?.emailsSent || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-500">Emails Sent</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {automations.reduce((sum, a) => sum + (a.stats?.completed || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search automations..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'paused', 'draft'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    filter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Automation List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : filteredAutomations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No automations yet</h3>
              <p className="text-gray-500 mb-6">Create your first automation to start engaging with your audience automatically.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5" />
                Create Automation
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trigger</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emails Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAutomations.map(automation => (
                    <tr key={automation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/studio/automation/${automation._id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                          {automation.name}
                        </Link>
                        <p className="text-sm text-gray-500">{automation.steps?.length || 0} steps</p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(automation.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          {getTriggerIcon(automation.trigger?.type)}
                          <span className="text-sm capitalize">{automation.trigger?.type?.replace(/_/g, ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{automation.stats?.currentlyActive || 0}</td>
                      <td className="px-6 py-4 text-gray-600">{automation.stats?.emailsSent || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {automation.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(automation._id, 'pause')}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                              title="Pause"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : automation.status !== 'archived' && (
                            <button
                              onClick={() => handleStatusChange(automation._id, 'activate')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Activate"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            href={`/studio/automation/${automation._id}`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Settings className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(automation._id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(automation._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAutomationModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(automation) => {
            router.push(`/studio/automation/${automation._id}`);
          }}
        />
      )}
    </>
  );
}

// ==========================================
// CREATE AUTOMATION MODAL
// ==========================================

function CreateAutomationModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('drip');
  const [triggerType, setTriggerType] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/automation/templates/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Fetch templates error:', err);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (selectedTemplate) {
        // Create from template
        const res = await fetch(`/api/automation/templates/${selectedTemplate}/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (data.ok) onCreated(data.automation);
      } else {
        // Create blank
        const res = await fetch('/api/automation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            type,
            trigger: { type: triggerType }
          })
        });
        const data = await res.json();
        if (data.ok) onCreated(data.automation);
      }
    } catch (err) {
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Create Automation</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Automation Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Welcome Series"
            />
          </div>

          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start from Template</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className={`p-4 border-2 rounded-lg text-left ${!selectedTemplate ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5 text-gray-600" />
                </div>
                <p className="font-medium">Blank Automation</p>
                <p className="text-sm text-gray-500">Start from scratch</p>
              </button>
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 border-2 rounded-lg text-left ${selectedTemplate === template.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-gray-500">{template.stepsCount} steps</p>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Type (only for blank) */}
          {!selectedTemplate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="manual">Manual - Add contacts manually</option>
                <option value="list_subscribe">List Subscribe - When someone joins a list</option>
                <option value="tag_added">Tag Added - When a tag is added</option>
                <option value="form_submit">Form Submit - When a form is submitted</option>
                <option value="email_received">Email Received - When you receive an email</option>
                <option value="date_based">Date Based - Birthday, anniversary, etc.</option>
                <option value="api">API - Trigger via API call</option>
              </select>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Automation'}
          </button>
        </div>
      </div>
    </div>
  );
}
