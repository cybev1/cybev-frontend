// ============================================
// FILE: src/pages/studio/campaigns/index.jsx
// Marketing Campaigns Dashboard
// VERSION: 1.0.0 - NEW FEATURE
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Mail, MessageSquare, Smartphone, Bell, Plus, Send, Edit2,
  Trash2, Copy, Loader2, BarChart3, Users, Clock, CheckCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function CampaignsDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, sent: 0, opened: 0, clicked: 0 });
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    audience: 'all',
  });

  const campaignTypes = [
    { id: 'email', label: 'Email', icon: Mail, color: 'blue' },
    { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'green' },
    { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, color: 'emerald' },
    { id: 'push', label: 'Push Notification', icon: Bell, color: 'purple' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    try {
      const [campaignsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/campaigns`, getAuth()),
        fetch(`${API_URL}/api/campaigns/stats`, getAuth()),
      ]);

      const campaignsData = await campaignsRes.json();
      const statsData = await statsRes.json();

      if (campaignsData.campaigns) setCampaigns(campaignsData.campaigns);
      if (statsData.stats) setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.campaign) {
        setCampaigns([data.campaign, ...campaigns]);
        setShowCreate(false);
        setFormData({ name: '', type: 'email', subject: '', content: '', audience: 'all' });
        setStep(1);
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      alert('Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const sendCampaign = async (id) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns/${id}/send`, {
        method: 'POST',
        ...getAuth()
      });
      
      const data = await res.json();
      if (data.ok) {
        setCampaigns(campaigns.map(c => c._id === id ? { ...c, status: 'sending' } : c));
        alert('Campaign is being sent!');
      }
    } catch (err) {
      alert('Failed to send campaign');
    }
  };

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    
    try {
      await fetch(`${API_URL}/api/campaigns/${id}`, { method: 'DELETE', ...getAuth() });
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const getTypeIcon = (type) => {
    const t = campaignTypes.find(ct => ct.id === type);
    return t ? <t.icon className="w-4 h-4" /> : <Mail className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'sending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-500';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-500';
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Campaigns - CYBEV Studio</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio" className="text-purple-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Studio
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900">Campaigns</h1>
            <p className="text-gray-600 dark:text-gray-500">Create and manage marketing campaigns</p>
          </div>
          
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-purple-600 text-gray-900 rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-white rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-500 text-sm">Total Campaigns</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-white rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 dark:text-gray-500 text-sm">Messages Sent</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{stats.sent}</p>
          </div>
          <div className="bg-white dark:bg-white rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-500 text-sm">Opens</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{stats.opened}</p>
          </div>
          <div className="bg-white dark:bg-white rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-pink-500" />
              <span className="text-gray-600 dark:text-gray-500 text-sm">Clicks</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{stats.clicked}</p>
          </div>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white dark:bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Create your first marketing campaign</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-purple-600 text-gray-900 rounded-lg font-semibold hover:bg-purple-700"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <div
                key={campaign._id}
                className="bg-white dark:bg-white rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      campaign.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      campaign.type === 'sms' ? 'bg-green-100 text-green-600' :
                      campaign.type === 'whatsapp' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-900">{campaign.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
                        <span className="capitalize">{campaign.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {campaign.recipientCount || 0} recipients
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                    
                    {campaign.status === 'draft' && (
                      <>
                        <button
                          onClick={() => sendCampaign(campaign._id)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => deleteCampaign(campaign._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Stats Row */}
                {campaign.status === 'sent' && (
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-200 text-sm">
                    <span className="text-gray-500 dark:text-gray-500">
                      <strong className="text-gray-900 dark:text-gray-900">{campaign.stats?.sent || 0}</strong> sent
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">
                      <strong className="text-gray-900 dark:text-gray-900">{campaign.stats?.opened || 0}</strong> opened
                    </span>
                    <span className="text-gray-500 dark:text-gray-500">
                      <strong className="text-gray-900 dark:text-gray-900">{campaign.stats?.clicked || 0}</strong> clicked
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-100 dark:border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900">Create Campaign</h2>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Step {step} of 3</p>
              </div>
              
              <div className="p-6">
                {/* Step 1: Type */}
                {step === 1 && (
                  <>
                    <h3 className="font-medium text-gray-900 dark:text-gray-900 mb-4">Choose campaign type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {campaignTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setFormData({...formData, type: type.id})}
                          className={`p-4 rounded-lg border-2 text-left transition ${
                            formData.type === type.id
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-200 dark:border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <type.icon className={`w-6 h-6 mb-2 ${
                            formData.type === type.id ? 'text-purple-600' : 'text-gray-500'
                          }`} />
                          <p className="font-medium text-gray-900 dark:text-gray-900">{type.label}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Welcome Email"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                      />
                    </div>
                    
                    {formData.type === 'email' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          placeholder="Email subject"
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                        />
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                        Message Content
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        placeholder="Write your message..."
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Audience */}
                {step === 3 && (
                  <>
                    <h3 className="font-medium text-gray-900 dark:text-gray-900 mb-4">Select audience</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'all', label: 'All Contacts', desc: 'Send to everyone' },
                        { id: 'subscribers', label: 'Subscribers', desc: 'Email subscribers only' },
                        { id: 'members', label: 'Church Members', desc: 'Registered members' },
                        { id: 'custom', label: 'Custom List', desc: 'Upload or select specific contacts' },
                      ].map(audience => (
                        <button
                          key={audience.id}
                          onClick={() => setFormData({...formData, audience: audience.id})}
                          className={`w-full p-4 rounded-lg border-2 text-left transition ${
                            formData.audience === audience.id
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-200 dark:border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900 dark:text-gray-900">{audience.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{audience.desc}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Actions */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-200 flex justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowCreate(false);
                      setStep(1);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2 bg-purple-600 text-gray-900 rounded-lg font-medium hover:bg-purple-700"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={createCampaign}
                    disabled={creating}
                    className="px-6 py-2 bg-purple-600 text-gray-900 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {creating ? 'Creating...' : 'Create Campaign'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
