// ============================================
// FILE: src/pages/studio/social/automation.jsx
// PURPOSE: Social Media Automation Hub
// All the features from the FB bot, mobile-optimized
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Bot, Zap, Users, Heart, MessageSquare, UserPlus, Send,
  Settings, Play, Pause, AlertCircle, CheckCircle, Clock,
  Target, Filter, Hash, AtSign, Bell, ChevronRight,
  Shield, Activity, TrendingUp, RefreshCw, Plus, Trash2,
  Edit, ToggleLeft, ToggleRight, Info, AlertTriangle
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const AUTOMATION_TYPES = [
  {
    id: 'auto_like',
    name: 'Auto Like',
    description: 'Automatically like posts based on hashtags or keywords',
    icon: Heart,
    color: 'pink'
  },
  {
    id: 'auto_comment',
    name: 'Auto Comment',
    description: 'Post comments with customizable templates',
    icon: MessageSquare,
    color: 'blue'
  },
  {
    id: 'auto_follow',
    name: 'Auto Follow',
    description: 'Follow users based on criteria',
    icon: UserPlus,
    color: 'green'
  },
  {
    id: 'auto_message',
    name: 'Auto DM',
    description: 'Send welcome messages to new followers',
    icon: Send,
    color: 'purple'
  },
  {
    id: 'auto_accept',
    name: 'Auto Accept',
    description: 'Automatically accept friend/follow requests',
    icon: CheckCircle,
    color: 'teal'
  },
  {
    id: 'engagement_boost',
    name: 'Engagement Boost',
    description: 'Engage with posts to boost visibility',
    icon: TrendingUp,
    color: 'orange'
  }
];

export default function SocialAutomation() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [accountsRes, automationsRes, statsRes] = await Promise.all([
        fetch(`${API}/api/social/accounts`, { headers }),
        fetch(`${API}/api/social/automations`, { headers }),
        fetch(`${API}/api/social/automations/stats`, { headers })
      ]);

      const [accountsData, automationsData, statsData] = await Promise.all([
        accountsRes.json(),
        automationsRes.json(),
        statsRes.json()
      ]);

      if (accountsData.ok) {
        setAccounts(accountsData.accounts || []);
        if (accountsData.accounts?.length > 0) {
          setSelectedAccount(accountsData.accounts[0]);
        }
      }
      if (automationsData.ok) setAutomations(automationsData.automations || []);
      if (statsData.ok) setStats(statsData.stats);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (automationId, enabled) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/api/social/automations/${automationId}/toggle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      });

      setAutomations(prev => prev.map(a => 
        a._id === automationId ? { ...a, enabled } : a
      ));
    } catch (err) {
      console.error('Error toggling automation:', err);
    }
  };

  const deleteAutomation = async (automationId) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/api/social/automations/${automationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      setAutomations(prev => prev.filter(a => a._id !== automationId));
    } catch (err) {
      console.error('Error deleting automation:', err);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Social Media Automation | CYBEV Studio</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bot className="w-7 h-7 text-purple-600" />
              Automation Hub
            </h1>
            <p className="text-gray-500 text-sm">Set up automated engagement for your accounts</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                Use automation responsibly
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Excessive automation may violate platform terms. We recommend conservative settings 
                and mixing automated actions with genuine engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Activity className="w-4 h-4" />
              Actions Today
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.actionsToday || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Heart className="w-4 h-4" />
              Likes Sent
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.likesToday || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <MessageSquare className="w-4 h-4" />
              Comments
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.commentsToday || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <UserPlus className="w-4 h-4" />
              New Follows
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.followsToday || 0}
            </p>
          </div>
        </div>

        {/* Account Selector */}
        {accounts.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Account
            </label>
            <select
              value={selectedAccount?._id || ''}
              onChange={(e) => setSelectedAccount(accounts.find(a => a._id === e.target.value))}
              className="w-full md:w-64 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.accountName} ({account.platform})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* No Accounts Warning */}
        {accounts.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700 mb-6">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Connect an Account First
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              You need to connect a social media account before setting up automations
            </p>
            <Link
              href="/studio/social/accounts/connect"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
            >
              <Plus className="w-4 h-4" />
              Connect Account
            </Link>
          </div>
        )}

        {/* Automation Types */}
        {accounts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Automation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AUTOMATION_TYPES.map(type => {
                const colorClasses = {
                  pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 hover:border-pink-300',
                  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:border-blue-300',
                  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 hover:border-green-300',
                  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:border-purple-300',
                  teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 hover:border-teal-300',
                  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 hover:border-orange-300'
                };

                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      setShowCreateModal(true);
                    }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-left hover:shadow-md transition group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${colorClasses[type.color]} flex items-center justify-center mb-3`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600">
                      {type.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Active Automations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Automations
            </h2>
            <span className="text-sm text-gray-500">
              {automations.filter(a => a.enabled).length} active
            </span>
          </div>

          {automations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No automations set up yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first automation above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {automations.map(automation => {
                const type = AUTOMATION_TYPES.find(t => t.id === automation.type);
                return (
                  <AutomationCard
                    key={automation._id}
                    automation={automation}
                    type={type}
                    onToggle={(enabled) => toggleAutomation(automation._id, enabled)}
                    onDelete={() => deleteAutomation(automation._id)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Rate Limits Info */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-gray-500" />
            Safety Limits
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Likes/Hour</p>
              <p className="font-medium text-gray-900 dark:text-white">30 max</p>
            </div>
            <div>
              <p className="text-gray-500">Comments/Hour</p>
              <p className="font-medium text-gray-900 dark:text-white">20 max</p>
            </div>
            <div>
              <p className="text-gray-500">Follows/Day</p>
              <p className="font-medium text-gray-900 dark:text-white">50 max</p>
            </div>
            <div>
              <p className="text-gray-500">Messages/Hour</p>
              <p className="font-medium text-gray-900 dark:text-white">15 max</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Automation Modal */}
      {showCreateModal && selectedType && (
        <CreateAutomationModal
          type={selectedType}
          account={selectedAccount}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedType(null);
          }}
          onCreated={(newAutomation) => {
            setAutomations(prev => [newAutomation, ...prev]);
            setShowCreateModal(false);
            setSelectedType(null);
          }}
        />
      )}
    </AppLayout>
  );
}

// Automation Card Component
function AutomationCard({ automation, type, onToggle, onDelete }) {
  const colorClasses = {
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[type?.color || 'purple']} flex items-center justify-center flex-shrink-0`}>
          {type?.icon && <type.icon className="w-5 h-5" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {type?.name || automation.type}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              automation.enabled 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {automation.enabled ? 'Active' : 'Paused'}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {automation.trigger?.type === 'hashtag' && (
              <>Targeting: #{automation.trigger.value}</>
            )}
            {automation.trigger?.type === 'keyword' && (
              <>Keywords: {automation.trigger.value}</>
            )}
            {automation.trigger?.type === 'new_follower' && (
              <>New followers</>
            )}
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>{automation.stats?.executed || 0} actions</span>
            <span>{automation.stats?.success || 0} successful</span>
            <span>{automation.action?.maxPerHour || 0}/hour limit</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(!automation.enabled)}
            className={`p-2 rounded-lg transition ${
              automation.enabled 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
            }`}
          >
            {automation.enabled ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Create Automation Modal
function CreateAutomationModal({ type, account, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    triggerType: 'hashtag',
    triggerValue: '',
    template: '',
    maxPerHour: 10,
    enabled: true
  });
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.triggerValue && type.id !== 'auto_accept') {
      alert('Please enter a trigger value');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/automations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: account._id,
          type: type.id,
          trigger: {
            type: formData.triggerType,
            value: formData.triggerValue
          },
          action: {
            template: formData.template,
            maxPerHour: formData.maxPerHour
          },
          enabled: formData.enabled
        })
      });

      const data = await res.json();
      if (data.ok) {
        onCreated(data.automation);
      } else {
        alert(data.error || 'Failed to create automation');
      }
    } catch (err) {
      console.error('Error creating automation:', err);
      alert('Failed to create automation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <type.icon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {type.name}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trigger Type */}
            {type.id !== 'auto_accept' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trigger Type
                  </label>
                  <select
                    value={formData.triggerType}
                    onChange={(e) => setFormData(prev => ({ ...prev, triggerType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <option value="hashtag">Hashtag</option>
                    <option value="keyword">Keyword</option>
                    <option value="competitor">Competitor Followers</option>
                    {type.id === 'auto_message' && (
                      <option value="new_follower">New Followers</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {formData.triggerType === 'hashtag' ? 'Hashtag (without #)' : 
                     formData.triggerType === 'keyword' ? 'Keywords' : 
                     formData.triggerType === 'competitor' ? 'Competitor Username' : 'Value'}
                  </label>
                  <input
                    type="text"
                    value={formData.triggerValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, triggerValue: e.target.value }))}
                    placeholder={formData.triggerType === 'hashtag' ? 'fitness, motivation' : 'Enter value...'}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>
              </>
            )}

            {/* Template for comments/messages */}
            {(type.id === 'auto_comment' || type.id === 'auto_message') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message Template
                </label>
                <textarea
                  value={formData.template}
                  onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  placeholder="Great post! 🔥|Love this! ❤️|Amazing content!"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple templates with | for random selection
                </p>
              </div>
            )}

            {/* Rate Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Actions Per Hour
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.maxPerHour}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPerHour: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 10-15 for safety
              </p>
            </div>

            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable immediately
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`p-2 rounded-lg ${
                  formData.enabled 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {formData.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Automation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
