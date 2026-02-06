// ============================================
// FILE: src/pages/studio/campaigns/automation/index.jsx
// CYBEV Email Automation Dashboard
// VERSION: 1.0.0 - Automation Workflows
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft, Zap, Plus, Play, Pause, Edit2, Trash2, Copy,
  Mail, Users, Clock, Target, BarChart3, Loader2, CheckCircle,
  AlertCircle, ChevronRight, Settings, Crown, Sparkles, Calendar,
  UserPlus, ShoppingCart, Heart, Bell, RefreshCw, Eye
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const getAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
};

// Automation templates
const AUTOMATION_TEMPLATES = [
  {
    id: 'welcome',
    name: 'Welcome Series',
    description: 'Send a series of emails to new subscribers',
    icon: UserPlus,
    trigger: 'New subscriber joins list',
    emails: 3,
    color: 'purple',
    popular: true
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart',
    description: 'Recover lost sales with reminder emails',
    icon: ShoppingCart,
    trigger: 'Cart abandoned for 1 hour',
    emails: 3,
    color: 'orange',
    popular: true,
    pro: true
  },
  {
    id: 'birthday',
    name: 'Birthday Email',
    description: 'Send special offers on subscriber birthdays',
    icon: Heart,
    trigger: 'Subscriber birthday',
    emails: 1,
    color: 'pink'
  },
  {
    id: 're-engagement',
    name: 'Re-engagement',
    description: 'Win back inactive subscribers',
    icon: RefreshCw,
    trigger: 'No opens in 30 days',
    emails: 2,
    color: 'blue',
    pro: true
  },
  {
    id: 'post-purchase',
    name: 'Post-Purchase',
    description: 'Follow up after a purchase',
    icon: CheckCircle,
    trigger: 'Purchase completed',
    emails: 2,
    color: 'green',
    pro: true
  },
  {
    id: 'event-reminder',
    name: 'Event Reminder',
    description: 'Send reminders before an event',
    icon: Calendar,
    trigger: 'Days before event',
    emails: 3,
    color: 'indigo'
  }
];

export default function EmailAutomation() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [automations, setAutomations] = useState([]);
  const [stats, setStats] = useState({ active: 0, paused: 0, total: 0 });
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/automation`, getAuth());
      const data = await res.json();
      
      if (data.automations) {
        setAutomations(data.automations);
        setStats({
          active: data.automations.filter(a => a.status === 'active').length,
          paused: data.automations.filter(a => a.status === 'paused').length,
          total: data.automations.length
        });
      }
    } catch (err) {
      console.error('Failed to fetch automations:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await fetch(`${API_URL}/api/automation/${id}/toggle`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ status: newStatus })
      });
      fetchAutomations();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const deleteAutomation = async (id) => {
    if (!confirm('Delete this automation?')) return;
    try {
      await fetch(`${API_URL}/api/automation/${id}`, {
        method: 'DELETE',
        ...getAuth()
      });
      fetchAutomations();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Email Automation | CYBEV Studio</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link href="/studio/campaigns" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Email Automation</h1>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Pro
                  </span>
                </div>
                <p className="text-gray-500 mt-1">Create automated email workflows</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTemplates(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Plus className="w-5 h-5" />
              Create Automation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Pause className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.paused}</div>
                  <div className="text-sm text-gray-500">Paused</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Automations List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : automations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No automations yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first automation to send emails automatically based on triggers like new subscribers, purchases, or dates.
              </p>
              <button 
                onClick={() => setShowTemplates(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Automation
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Automation</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Trigger</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sent</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {automations.map(automation => (
                    <tr key={automation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{automation.name}</div>
                            <div className="text-sm text-gray-500">{automation.emails?.length || 0} emails</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{automation.trigger || 'Manual'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          automation.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {automation.status === 'active' ? 'Active' : 'Paused'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {(automation.stats?.sent || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => toggleAutomation(automation._id, automation.status)}
                            className={`p-2 rounded-lg ${
                              automation.status === 'active' 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={automation.status === 'active' ? 'Pause' : 'Activate'}
                          >
                            {automation.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteAutomation(automation._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg" 
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

          {/* Templates Modal */}
          {showTemplates && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-xl font-semibold text-gray-900">Choose Automation Template</h2>
                  <button 
                    onClick={() => setShowTemplates(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-4">
                  {AUTOMATION_TEMPLATES.map(template => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => {
                          setShowTemplates(false);
                          router.push(`/studio/campaigns/automation/new?template=${template.id}`);
                        }}
                        className="text-left p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition relative group"
                      >
                        {template.popular && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                        {template.pro && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Pro
                          </span>
                        )}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-${template.color}-100`}>
                          <Icon className={`w-6 h-6 text-${template.color}-600`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {template.trigger}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {template.emails} emails
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-purple-600/90 text-white opacity-0 group-hover:opacity-100 transition rounded-xl">
                          <span className="flex items-center gap-2">
                            Use Template <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setShowTemplates(false);
                      router.push('/studio/campaigns/automation/new');
                    }}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:text-purple-600 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Start from Scratch
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
