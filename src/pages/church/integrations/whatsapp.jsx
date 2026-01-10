// ============================================
// FILE: pages/church/integrations/whatsapp.jsx
// WhatsApp Integration - Automated Follow-up Messages
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  MessageSquare, Send, Users, Clock, CheckCircle, Settings,
  ArrowLeft, Loader2, Plus, Zap, Phone, Globe, Edit,
  Trash2, Play, Pause, BarChart3, Calendar, Heart,
  AlertCircle, RefreshCw, Copy, ExternalLink, Check
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const templateCategories = [
  { id: 'welcome', label: 'Welcome', icon: '👋', description: 'First-time visitors' },
  { id: 'followup', label: 'Follow-up', icon: '📞', description: 'Soul follow-up' },
  { id: 'reminder', label: 'Reminder', icon: '⏰', description: 'Event reminders' },
  { id: 'birthday', label: 'Birthday', icon: '🎂', description: 'Birthday wishes' },
  { id: 'anniversary', label: 'Anniversary', icon: '💒', description: 'Membership anniversary' },
  { id: 'invitation', label: 'Invitation', icon: '✉️', description: 'Service invitations' }
];

const defaultTemplates = [
  {
    id: 1,
    name: 'New Soul Welcome',
    category: 'welcome',
    message: `Hello {{name}}! 👋

Welcome to the family of God! We are so excited that you made the decision to accept Jesus Christ as your Lord and Savior.

"Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come." - 2 Corinthians 5:17

We would love to connect with you and help you grow in your faith journey. 

Our services are:
📅 Sundays: 9:00 AM & 11:00 AM
📍 {{church_address}}

See you soon!
{{church_name}}`,
    triggers: ['new_soul'],
    delay: 0,
    active: true
  },
  {
    id: 2,
    name: 'First Follow-up',
    category: 'followup',
    message: `Hi {{name}}! 🙏

This is {{sender_name}} from {{church_name}}. I'm reaching out to check on you and see how you're doing since accepting Christ.

Do you have any questions about your new faith? We're here to help!

Would you like to:
1️⃣ Join our Foundation School
2️⃣ Connect with a cell group
3️⃣ Schedule a one-on-one meeting

Reply with a number or type your question!`,
    triggers: ['soul_day_3'],
    delay: 3,
    active: true
  },
  {
    id: 3,
    name: 'Service Reminder',
    category: 'reminder',
    message: `Good morning {{name}}! ☀️

Just a friendly reminder that we have {{service_name}} today at {{service_time}}.

"For where two or three gather in my name, there am I with them." - Matthew 18:20

We can't wait to worship with you! 🙌

{{church_name}}`,
    triggers: ['service_reminder'],
    delay: 0,
    active: true
  }
];

function TemplateCard({ template, onEdit, onToggle, onDelete }) {
  const category = templateCategories.find(c => c.id === template.category) || templateCategories[0];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
            <p className="text-sm text-gray-500">{category.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(template)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              template.active
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {template.active ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap line-clamp-4">
          {template.message}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-500">
          {template.delay > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {template.delay} day delay
            </span>
          )}
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            {template.triggers?.join(', ')}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(template)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(template)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageLogCard({ log }) {
  const statusColors = {
    sent: 'bg-green-100 text-green-700',
    delivered: 'bg-blue-100 text-blue-700',
    read: 'bg-purple-100 text-purple-700',
    failed: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">{log.recipientName || log.phone}</p>
        <p className="text-sm text-gray-500 truncate">{log.templateName}</p>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[log.status] || statusColors.pending}`}>
          {log.status}
        </span>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(log.sentAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function CreateTemplateModal({ isOpen, onClose, onCreate, loading, editTemplate }) {
  const [form, setForm] = useState({
    name: '',
    category: 'welcome',
    message: '',
    triggers: [],
    delay: 0,
    active: true
  });

  const triggerOptions = [
    { id: 'new_soul', label: 'New Soul Added' },
    { id: 'soul_day_3', label: 'Soul - Day 3' },
    { id: 'soul_day_7', label: 'Soul - Day 7' },
    { id: 'soul_day_14', label: 'Soul - Day 14' },
    { id: 'first_timer', label: 'First Timer' },
    { id: 'service_reminder', label: 'Service Reminder' },
    { id: 'event_reminder', label: 'Event Reminder' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'membership_anniversary', label: 'Membership Anniversary' }
  ];

  const variables = [
    '{{name}}', '{{first_name}}', '{{phone}}',
    '{{church_name}}', '{{church_address}}',
    '{{sender_name}}', '{{service_name}}', '{{service_time}}',
    '{{event_name}}', '{{event_date}}'
  ];

  useEffect(() => {
    if (editTemplate) {
      setForm({
        name: editTemplate.name || '',
        category: editTemplate.category || 'welcome',
        message: editTemplate.message || '',
        triggers: editTemplate.triggers || [],
        delay: editTemplate.delay || 0,
        active: editTemplate.active !== false
      });
    }
  }, [editTemplate]);

  if (!isOpen) return null;

  const toggleTrigger = (triggerId) => {
    setForm(f => ({
      ...f,
      triggers: f.triggers.includes(triggerId)
        ? f.triggers.filter(t => t !== triggerId)
        : [...f.triggers, triggerId]
    }));
  };

  const insertVariable = (variable) => {
    setForm(f => ({ ...f, message: f.message + variable }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            {editTemplate ? 'Edit Template' : 'Create Template'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                placeholder="e.g., Welcome Message"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                {templateCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <div className="flex gap-1 flex-wrap">
                {variables.slice(0, 5).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-purple-100 hover:text-purple-700"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={form.message}
              onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none font-mono text-sm"
              placeholder="Type your message here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Triggers (When to send)
            </label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map(trigger => (
                <button
                  key={trigger.id}
                  type="button"
                  onClick={() => toggleTrigger(trigger.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    form.triggers.includes(trigger.id)
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {trigger.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delay (Days)
              </label>
              <input
                type="number"
                min="0"
                value={form.delay}
                onChange={(e) => setForm(f => ({ ...f, delay: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-green-600"
                />
                <span className="font-medium text-gray-900 dark:text-white">Active</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onCreate(form, editTemplate?._id)}
            disabled={loading || !form.name || !form.message}
            className="flex-1 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {editTemplate ? 'Save Changes' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppIntegration() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [messageLogs, setMessageLogs] = useState([]);
  const [stats, setStats] = useState({ sent: 0, delivered: 0, failed: 0, queued: 0 });
  const [activeTab, setActiveTab] = useState('templates');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch WhatsApp status
      const statusRes = await fetch(`${API_URL}/api/church/whatsapp/status`, getAuth());
      const statusData = await statusRes.json();
      if (statusData.ok) {
        setConnected(statusData.connected || false);
      }

      // Fetch templates
      const templatesRes = await fetch(`${API_URL}/api/church/whatsapp/templates`, getAuth());
      const templatesData = await templatesRes.json();
      if (templatesData.ok && templatesData.templates?.length > 0) {
        setTemplates(templatesData.templates);
      }

      // Fetch logs
      const logsRes = await fetch(`${API_URL}/api/church/whatsapp/logs?limit=20`, getAuth());
      const logsData = await logsRes.json();
      if (logsData.ok) {
        setMessageLogs(logsData.logs || []);
        setStats(logsData.stats || { sent: 0, delivered: 0, failed: 0, queued: 0 });
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    }
    setLoading(false);
  };

  const handleCreateTemplate = async (formData, templateId) => {
    setActionLoading(true);
    try {
      const url = templateId
        ? `${API_URL}/api/church/whatsapp/templates/${templateId}`
        : `${API_URL}/api/church/whatsapp/templates`;

      const res = await fetch(url, {
        method: templateId ? 'PUT' : 'POST',
        ...getAuth(),
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.ok) {
        setShowCreateModal(false);
        setEditTemplate(null);
        fetchData();
      } else {
        alert(data.error || 'Failed to save template');
      }
    } catch (err) {
      console.error('Create template error:', err);
    }
    setActionLoading(false);
  };

  const handleToggleTemplate = async (template) => {
    try {
      await fetch(`${API_URL}/api/church/whatsapp/templates/${template._id || template.id}`, {
        method: 'PUT',
        ...getAuth(),
        body: JSON.stringify({ active: !template.active })
      });
      setTemplates(prev => prev.map(t => 
        (t._id || t.id) === (template._id || template.id) 
          ? { ...t, active: !t.active } 
          : t
      ));
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const webhookUrl = `${API_URL}/api/church/whatsapp/webhook/YOUR_ORG_ID`;

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>WhatsApp Integration - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                WhatsApp Integration
              </h1>
              <p className="text-green-100 mt-1">Automated follow-up messages for souls</p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                connected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-red-500/20 text-red-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-300 animate-pulse' : 'bg-red-400'}`} />
                {connected ? 'Connected' : 'Not Connected'}
              </div>
              <Link href="/church/integrations/whatsapp/setup">
                <button className="px-4 py-2 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Setup
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.sent}</p>
              <p className="text-green-200 text-sm">Messages Sent</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.delivered}</p>
              <p className="text-green-200 text-sm">Delivered</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.queued}</p>
              <p className="text-green-200 text-sm">In Queue</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold text-red-300">{stats.failed}</p>
              <p className="text-green-200 text-sm">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'templates', label: 'Message Templates', icon: MessageSquare },
            { id: 'logs', label: 'Message Logs', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Message Templates ({templates.length})
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Template
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Templates Yet</h3>
                <p className="text-gray-500 mb-6">Create message templates for automated follow-ups</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                >
                  Create Template
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <TemplateCard
                    key={template._id || template.id}
                    template={template}
                    onEdit={(t) => { setEditTemplate(t); setShowCreateModal(true); }}
                    onToggle={handleToggleTemplate}
                    onDelete={(t) => console.log('Delete', t)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Message Logs</h2>
              <button
                onClick={fetchData}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {messageLogs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Messages Yet</h3>
                <p className="text-gray-500">Messages will appear here once sent</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messageLogs.map((log, i) => (
                  <MessageLogCard key={i} log={log} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connection Status</h3>
              <div className={`p-4 rounded-xl ${connected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`font-medium ${connected ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {connected ? 'WhatsApp Business API Connected' : 'Not Connected'}
                  </span>
                </div>
                {!connected && (
                  <p className="text-sm text-gray-500 mt-2">
                    Connect your WhatsApp Business account to start sending automated messages.
                  </p>
                )}
              </div>
            </div>

            {/* Webhook URL */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Webhook URL</h3>
              <p className="text-sm text-gray-500 mb-3">Use this URL in your WhatsApp Business API settings:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 font-mono text-sm"
                />
                <button
                  onClick={copyWebhook}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
            </div>

            {/* Automation Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Automation Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Auto-send Welcome Messages</p>
                    <p className="text-sm text-gray-500">Send welcome message when new soul is added</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-green-600" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Follow-up Reminders</p>
                    <p className="text-sm text-gray-500">Send reminders for pending follow-ups</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-green-600" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Event Reminders</p>
                    <p className="text-sm text-gray-500">Send reminders 24 hours before events</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-green-600" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setEditTemplate(null); }}
        onCreate={handleCreateTemplate}
        loading={actionLoading}
        editTemplate={editTemplate}
      />
    </div>
  );
}
