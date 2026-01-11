// ============================================
// FILE: index.jsx
// PATH: cybev-frontend/src/pages/studio/campaigns/index.jsx
// PURPOSE: Campaign Dashboard - Email, SMS, WhatsApp Marketing
// VERSION: 1.0.0
// GITHUB: https://github.com/cybev1/cybev-frontend
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, MessageSquare, Phone, Bell, Plus, Users, TrendingUp, DollarSign, Search, Filter, Sparkles, Calendar, BarChart3 } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const CAMPAIGN_TYPES = [
  { id: 'email', name: 'Email', icon: Mail, color: 'blue' },
  { id: 'sms', name: 'SMS', icon: Phone, color: 'green' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'emerald' },
  { id: 'push', name: 'Push', icon: Bell, color: 'purple' }
];

export default function CampaignsDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, avgOpenRate: 0, avgClickRate: 0, totalRevenue: 0, totalContacts: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [campaignsRes, statsRes] = await Promise.all([
        fetch(`${API}/api/campaigns`, { headers }),
        fetch(`${API}/api/campaigns/stats`, { headers })
      ]);

      const campaignsData = await campaignsRes.json();
      const statsData = await statsRes.json();

      if (campaignsData.ok) setCampaigns(campaignsData.campaigns || []);
      if (statsData.ok) setStats(statsData.stats);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = campaigns.filter(c => {
    if (filter !== 'all' && c.type !== filter && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-400',
      scheduled: 'bg-blue-500/20 text-blue-400',
      sending: 'bg-yellow-500/20 text-yellow-400',
      active: 'bg-green-500/20 text-green-400',
      completed: 'bg-purple-500/20 text-purple-400',
      paused: 'bg-orange-500/20 text-orange-400'
    };
    return colors[status] || colors.draft;
  };

  return (
    <AppLayout>
      <Head><title>Campaigns | CYBEV Studio</title></Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
            <p className="text-gray-500">AI-powered marketing automation</p>
          </div>
          <Link href="/studio/campaigns/create" className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium">
            <Plus className="w-5 h-5" /> Create Campaign
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Mail} label="Total Sent" value={stats.totalSent?.toLocaleString()} />
          <StatCard icon={TrendingUp} label="Open Rate" value={`${stats.avgOpenRate}%`} />
          <StatCard icon={BarChart3} label="Click Rate" value={`${stats.avgClickRate}%`} />
          <StatCard icon={DollarSign} label="Revenue" value={`$${stats.totalRevenue?.toLocaleString()}`} />
          <StatCard icon={Users} label="Contacts" value={stats.totalContacts?.toLocaleString()} />
        </div>

        {/* Campaign Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CAMPAIGN_TYPES.map(type => (
            <Link key={type.id} href={`/studio/campaigns/create?type=${type.id}`}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 transition">
              <div className={`w-10 h-10 rounded-lg bg-${type.color}-100 dark:bg-${type.color}-900/30 flex items-center justify-center`}>
                <type.icon className={`w-5 h-5 text-${type.color}-600`} />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
            </Link>
          ))}
        </div>

        {/* AI Features Banner */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">AI-Powered Features</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm opacity-90">
            <span>✨ AI Copywriting</span>
            <span>🎯 Smart Segmentation</span>
            <span>⏰ Optimal Send Time</span>
            <span>🔄 A/B Testing</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/studio/campaigns/contacts" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
            <Users className="w-4 h-4 inline mr-1" /> Contacts
          </Link>
          <Link href="/studio/campaigns/templates" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
            <Mail className="w-4 h-4 inline mr-1" /> Templates
          </Link>
          <Link href="/studio/campaigns/analytics" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
            <BarChart3 className="w-4 h-4 inline mr-1" /> Analytics
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'email', 'sms', 'whatsapp', 'draft', 'active', 'completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-4">Create your first campaign to start engaging your audience</p>
            <Link href="/studio/campaigns/create" className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg">
              <Plus className="w-4 h-4" /> Create Campaign
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(campaign => (
              <Link key={campaign._id} href={`/studio/campaigns/${campaign._id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-purple-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      {campaign.type === 'email' && <Mail className="w-5 h-5 text-purple-600" />}
                      {campaign.type === 'sms' && <Phone className="w-5 h-5 text-green-600" />}
                      {campaign.type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                      {campaign.type === 'push' && <Bell className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">
                        {campaign.type} • {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {campaign.stats?.sent > 0 && (
                      <div className="text-right text-sm">
                        <p className="text-gray-900 dark:text-white">{campaign.stats.sent} sent</p>
                        <p className="text-gray-500">{campaign.stats.opened || 0} opened</p>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{label}</span>
        <Icon className="w-5 h-5 text-purple-600" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value || '0'}</p>
    </div>
  );
}
