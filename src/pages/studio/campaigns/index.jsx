// ============================================
// FILE: src/pages/studio/campaigns/index.jsx
// CYBEV Campaigns Dashboard - Enhanced
// VERSION: 2.0.0 - Full Email Marketing Platform
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Mail, Send, Plus, Edit2, Trash2, Copy, MoreHorizontal,
  BarChart3, Users, Clock, CheckCircle, Loader2, Play, Pause,
  Calendar, TrendingUp, Eye, MousePointer, AlertCircle,
  ArrowLeft, Filter, Search, Download, Upload, Settings
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function CampaignsDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
        fetch(`${API_URL}/api/campaigns-enhanced`, getAuth()),
        fetch(`${API_URL}/api/campaigns-enhanced/stats`, getAuth()),
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

  const sendCampaign = async (id) => {
    if (!confirm('Send this campaign now?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/${id}/send`, {
        method: 'POST',
        ...getAuth()
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Campaign sending to ${data.recipientCount} recipients!`);
        fetchData();
      } else {
        alert(data.error || 'Failed to send');
      }
    } catch (err) {
      alert('Failed to send campaign');
    }
  };

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await fetch(`${API_URL}/api/campaigns-enhanced/${id}`, { method: 'DELETE', ...getAuth() });
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const duplicateCampaign = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/${id}/duplicate`, {
        method: 'POST',
        ...getAuth()
      });
      const data = await res.json();
      if (data.ok) {
        setCampaigns([data.campaign, ...campaigns]);
      }
    } catch (err) {
      alert('Failed to duplicate');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      sent: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      sending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Loader2 },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Calendar },
      paused: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Pause },
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Edit2 }
    };
    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded-full`}>
        <Icon className={`w-3 h-3 ${status === 'sending' ? 'animate-spin' : ''}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <Head>
        <title>Campaigns - CYBEV Studio</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Studio
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
            <p className="text-gray-600">Create and send marketing campaigns to your audience</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/studio/campaigns/contacts" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </Link>
            <Link href="/studio/campaigns/create" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 text-sm">Campaigns</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 text-sm">Contacts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalContacts?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 text-sm">Emails Sent</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSent?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-orange-500" />
              <span className="text-gray-600 text-sm">Avg Open Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.avgOpenRate || 0}%</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <MousePointer className="w-5 h-5 text-pink-500" />
              <span className="text-gray-600 text-sm">Avg Click Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.avgClickRate || 0}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {['all', 'draft', 'scheduled', 'sending', 'sent'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 w-64"
            />
          </div>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-6">Create your first email campaign to reach your audience</p>
            <Link href="/studio/campaigns/create" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Campaign</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Recipients</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Open Rate</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Click Rate</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampaigns.map(campaign => (
                  <tr key={campaign._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(campaign.status)}
                      {campaign.status === 'sending' && campaign.sending?.progress > 0 && (
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${campaign.sending.progress}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {campaign.stats?.recipientCount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4">
                      {campaign.status === 'sent' ? (
                        <span className="text-gray-900">{campaign.stats?.openRate || 0}%</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {campaign.status === 'sent' ? (
                        <span className="text-gray-900">{campaign.stats?.clickRate || 0}%</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {campaign.sentAt 
                        ? new Date(campaign.sentAt).toLocaleDateString()
                        : new Date(campaign.createdAt).toLocaleDateString()
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {campaign.status === 'draft' && (
                          <>
                            <button
                              onClick={() => router.push(`/studio/campaigns/${campaign._id}/edit`)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => sendCampaign(campaign._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Send Now"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {campaign.status === 'sent' && (
                          <Link
                            href={`/studio/campaigns/${campaign._id}/report`}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="View Report"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => duplicateCampaign(campaign._id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link href="/studio/campaigns/contacts" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition">
            <Users className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Manage Contacts</h3>
            <p className="text-sm text-gray-500">Import, organize, and segment your contacts</p>
          </Link>
          <Link href="/studio/campaigns/templates" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition">
            <Mail className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Email Templates</h3>
            <p className="text-sm text-gray-500">Create and manage reusable templates</p>
          </Link>
          <Link href="/studio/email/domains" className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition">
            <Settings className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Sender Domains</h3>
            <p className="text-sm text-gray-500">Verify domains for better deliverability</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
