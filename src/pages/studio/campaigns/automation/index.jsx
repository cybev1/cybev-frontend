// ============================================
// FILE: src/pages/studio/campaigns/automation/index.jsx
// CYBEV Automation Dashboard - Workflow List & Templates
// VERSION: 2.0.0 - Full Feature Dashboard
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Zap, Plus, Play, Pause, Edit2, Trash2, Copy, MoreHorizontal,
  ArrowLeft, Search, Filter, Loader2, Users, Mail, Clock,
  TrendingUp, BarChart3, GitBranch, Target, Settings, Eye,
  Calendar, ShoppingCart, Heart, UserPlus, Gift, Bell, X, Check
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const TEMPLATES = [
  { id: 'welcome_series', name: 'Welcome Series', icon: '👋', description: 'Onboard new subscribers with a 3-email welcome sequence', category: 'engagement', emails: 3, popularityScore: 95 },
  { id: 'abandoned_cart', name: 'Abandoned Cart', icon: '🛒', description: 'Recover lost sales with timely cart reminders', category: 'ecommerce', emails: 2, popularityScore: 92 },
  { id: 'birthday', name: 'Birthday Celebration', icon: '🎂', description: 'Send personalized birthday wishes and offers', category: 'engagement', emails: 1, popularityScore: 88 },
  { id: 'win_back', name: 'Win-Back Campaign', icon: '💔', description: 'Re-engage inactive subscribers with special offers', category: 'engagement', emails: 2, popularityScore: 85 },
  { id: 'post_purchase', name: 'Post-Purchase', icon: '📦', description: 'Thank customers and request reviews', category: 'ecommerce', emails: 3, popularityScore: 90 },
  { id: 'event_reminder', name: 'Event Reminder', icon: '📅', description: 'Send reminders before an event', category: 'engagement', emails: 3, popularityScore: 78 },
];

export default function AutomationDashboard() {
  const router = useRouter();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchAutomations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/automations`, getAuth());
      const data = await res.json();
      if (data.automations) setAutomations(data.automations);
    } catch (err) {
      console.error('Fetch automations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (automation) => {
    const endpoint = automation.status === 'active' ? 'pause' : 'activate';
    try {
      await fetch(`${API_URL}/api/automations/${automation._id}/${endpoint}`, {
        method: 'POST',
        ...getAuth()
      });
      fetchAutomations();
    } catch (err) {
      alert('Failed to update automation');
    }
  };

  const duplicateAutomation = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/automations/${id}/duplicate`, {
        method: 'POST',
        ...getAuth()
      });
      if (res.ok) fetchAutomations();
    } catch (err) {
      alert('Failed to duplicate');
    }
  };

  const deleteAutomation = async (id) => {
    if (!confirm('Delete this automation? This cannot be undone.')) return;
    try {
      await fetch(`${API_URL}/api/automations/${id}`, {
        method: 'DELETE',
        ...getAuth()
      });
      fetchAutomations();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const createFromTemplate = (templateId) => {
    router.push(`/studio/campaigns/automation/new?template=${templateId}`);
  };

  const filteredAutomations = automations.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: automations.length,
    active: automations.filter(a => a.status === 'active').length,
    totalEntered: automations.reduce((sum, a) => sum + (a.stats?.totalEntered || 0), 0),
    emailsSent: automations.reduce((sum, a) => sum + (a.stats?.emailsSent || 0), 0)
  };

  return (
    <AppLayout>
      <Head>
        <title>Email Automations - CYBEV Studio</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Email Automations</h1>
            <p className="text-gray-600">Create automated email sequences that run on autopilot</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Templates
            </button>
            <Link
              href="/studio/campaigns/automation/new"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Automation
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Automations', value: stats.total, icon: Zap, color: 'purple' },
            { label: 'Active', value: stats.active, icon: Play, color: 'green' },
            { label: 'Contacts Entered', value: stats.totalEntered.toLocaleString(), icon: Users, color: 'blue' },
            { label: 'Emails Sent', value: stats.emailsSent.toLocaleString(), icon: Mail, color: 'orange' },
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
              placeholder="Search automations..."
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

        {/* Automations List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredAutomations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No automations yet</h3>
            <p className="text-gray-500 mb-6">Create your first automation to engage subscribers automatically</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
              >
                Start from Template
              </button>
              <Link
                href="/studio/campaigns/automation/new"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create from Scratch
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAutomations.map(automation => (
              <div
                key={automation._id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      automation.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Zap className={`w-6 h-6 ${
                        automation.status === 'active' ? 'text-green-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="capitalize">{automation.trigger?.type?.replace('_', ' ') || 'No trigger'}</span>
                        <span>•</span>
                        <span>{automation.steps?.length || 0} steps</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          automation.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : automation.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {automation.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{automation.stats?.totalEntered?.toLocaleString() || 0}</p>
                        <p className="text-gray-500">Entered</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{automation.stats?.currentlyActive || 0}</p>
                        <p className="text-gray-500">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{automation.stats?.emailsSent?.toLocaleString() || 0}</p>
                        <p className="text-gray-500">Sent</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(automation)}
                        className={`p-2 rounded-lg ${
                          automation.status === 'active'
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title={automation.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {automation.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <Link
                        href={`/studio/campaigns/automation/new?id=${automation._id}`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/studio/campaigns/automation/${automation._id}/analytics`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                        title="Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => duplicateAutomation(automation._id)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAutomation(automation._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Automation Templates</h3>
                <p className="text-gray-500">Start with a proven workflow</p>
              </div>
              <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="grid md:grid-cols-2 gap-4">
                {TEMPLATES.map(template => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg transition cursor-pointer"
                    onClick={() => createFromTemplate(template.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{template.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {template.emails} emails
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {template.popularityScore}% effective
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setShowTemplates(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link
                href="/studio/campaigns/automation/new"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                onClick={() => setShowTemplates(false)}
              >
                Start from Scratch
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
