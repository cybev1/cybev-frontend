// ============================================
// FILE: src/pages/studio/campaigns/index.jsx
// PURPOSE: AI Campaign Suite Dashboard
// Similar to Bird.com but enhanced
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Mail, MessageSquare, Bell, Smartphone, Send, Plus,
  BarChart3, Users, Target, Zap, Clock, CheckCircle,
  AlertCircle, TrendingUp, Eye, MousePointer, DollarSign,
  Calendar, Filter, Search, MoreVertical, Play, Pause,
  Copy, Trash2, Edit, ChevronRight, Sparkles, Bot
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const CAMPAIGN_TYPES = [
  { id: 'email', name: 'Email', icon: Mail, color: 'blue', description: 'Send beautiful emails' },
  { id: 'sms', name: 'SMS', icon: Smartphone, color: 'green', description: 'Text message campaigns' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'emerald', description: 'WhatsApp broadcasts' },
  { id: 'push', name: 'Push', icon: Bell, color: 'purple', description: 'Push notifications' }
];

export default function CampaignsDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [campaignsRes, statsRes] = await Promise.all([
        fetch(`${API}/api/campaigns`, { headers }),
        fetch(`${API}/api/campaigns/stats`, { headers })
      ]);

      const [campaignsData, statsData] = await Promise.all([
        campaignsRes.json(),
        statsRes.json()
      ]);

      if (campaignsData.ok) setCampaigns(campaignsData.campaigns || []);
      if (statsData.ok) setStats(statsData.stats);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (activeTab !== 'all' && c.type !== activeTab) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
        <title>AI Campaign Suite | CYBEV Studio</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-600" />
              AI Campaign Suite
            </h1>
            <p className="text-gray-500 text-sm">Create converting campaigns with AI assistance</p>
          </div>
          <Link
            href="/studio/campaigns/create"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Campaign</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Send}
            label="Sent"
            value={formatNumber(stats?.totalSent || 0)}
            color="blue"
          />
          <StatCard
            icon={Eye}
            label="Opened"
            value={`${stats?.avgOpenRate || 0}%`}
            sublabel="open rate"
            color="green"
          />
          <StatCard
            icon={MousePointer}
            label="Clicked"
            value={`${stats?.avgClickRate || 0}%`}
            sublabel="click rate"
            color="purple"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`$${formatNumber(stats?.totalRevenue || 0)}`}
            color="emerald"
          />
        </div>

        {/* Quick Create */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Create New Campaign
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CAMPAIGN_TYPES.map(type => {
              const colorClasses = {
                blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:border-blue-300',
                green: 'bg-green-50 dark:bg-green-900/20 text-green-600 hover:border-green-300',
                emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:border-emerald-300',
                purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:border-purple-300'
              };

              return (
                <Link
                  key={type.id}
                  href={`/studio/campaigns/create?type=${type.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition group"
                >
                  <div className={`w-12 h-12 rounded-xl ${colorClasses[type.color]} flex items-center justify-center mb-3`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600">
                    {type.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AI Features Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">AI-Powered Marketing</h3>
              <p className="text-sm text-white/80 mb-3">
                Let AI write your emails, optimize send times, and predict conversions
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">AI Copywriting</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Smart Segmentation</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Optimal Timing</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">A/B Testing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickLink
            icon={Users}
            title="Contacts"
            count={stats?.totalContacts || 0}
            href="/studio/contacts"
          />
          <QuickLink
            icon={Target}
            title="Funnels"
            count={stats?.totalFunnels || 0}
            href="/studio/funnels"
          />
          <QuickLink
            icon={Mail}
            title="Templates"
            count={stats?.totalTemplates || 0}
            href="/studio/campaigns/templates"
          />
          <QuickLink
            icon={BarChart3}
            title="Analytics"
            href="/studio/campaigns/analytics"
          />
        </div>

        {/* Campaigns List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Campaigns
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['all', ...CAMPAIGN_TYPES.map(t => t.id)].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tab === 'all' ? 'All' : CAMPAIGN_TYPES.find(t => t.id === tab)?.name}
                </button>
              ))}
            </div>
          </div>

          {/* Campaigns */}
          {filteredCampaigns.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {campaigns.length === 0 ? 'No campaigns yet' : 'No matching campaigns'}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {campaigns.length === 0 
                  ? 'Create your first campaign to start engaging your audience'
                  : 'Try adjusting your search or filters'
                }
              </p>
              {campaigns.length === 0 && (
                <Link
                  href="/studio/campaigns/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Campaign
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCampaigns.map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

// Components
function StatCard({ icon: Icon, label, value, sublabel, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500">{sublabel || label}</p>
    </div>
  );
}

function QuickLink({ icon: Icon, title, count, href }) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-purple-300 transition group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition">
            <Icon className="w-5 h-5 text-gray-500 group-hover:text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{title}</p>
            {count !== undefined && (
              <p className="text-xs text-gray-500">{formatNumber(count)} total</p>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
      </div>
    </Link>
  );
}

function CampaignCard({ campaign }) {
  const type = CAMPAIGN_TYPES.find(t => t.id === campaign.type) || CAMPAIGN_TYPES[0];
  
  const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    scheduled: 'bg-blue-100 text-blue-600',
    active: 'bg-green-100 text-green-600',
    paused: 'bg-yellow-100 text-yellow-600',
    completed: 'bg-purple-100 text-purple-600'
  };

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
  };

  return (
    <Link
      href={`/studio/campaigns/${campaign._id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-purple-300 transition"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[type.color]} flex items-center justify-center flex-shrink-0`}>
          <type.icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {campaign.name}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
              {campaign.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-1 mb-2">
            {campaign.content?.subject || campaign.content?.text?.slice(0, 50)}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {campaign.stats?.sent > 0 && (
              <>
                <span>{formatNumber(campaign.stats.sent)} sent</span>
                <span>{campaign.stats.opened ? `${Math.round((campaign.stats.opened / campaign.stats.sent) * 100)}% opened` : '0% opened'}</span>
                <span>{campaign.stats.clicked ? `${Math.round((campaign.stats.clicked / campaign.stats.sent) * 100)}% clicked` : '0% clicked'}</span>
              </>
            )}
            {campaign.schedule?.sendAt && campaign.status === 'scheduled' && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(campaign.schedule.sendAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </Link>
  );
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
