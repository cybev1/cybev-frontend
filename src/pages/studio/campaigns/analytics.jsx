// ============================================
// FILE: src/pages/studio/campaigns/analytics.jsx
// CYBEV Campaign Analytics Dashboard
// VERSION: 1.0.0 - Full Analytics Overview
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft, Mail, Send, Users, Eye, MousePointer, TrendingUp,
  TrendingDown, BarChart3, PieChart, Calendar, Loader2, RefreshCw,
  ChevronRight, Download, Clock, Target, Zap, Award, CheckCircle,
  AlertTriangle, ExternalLink
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const getAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
};

export default function CampaignAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, campaignsRes] = await Promise.all([
        fetch(`${API_URL}/api/campaigns-enhanced/stats`, getAuth()),
        fetch(`${API_URL}/api/campaigns-enhanced`, getAuth())
      ]);
      
      const statsData = await statsRes.json();
      const campaignsData = await campaignsRes.json();
      
      if (statsData) setStats(statsData);
      if (campaignsData.campaigns) {
        // Get only sent campaigns and sort by sentAt
        const sentCampaigns = campaignsData.campaigns
          .filter(c => c.status === 'sent')
          .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
        setCampaigns(sentCampaigns);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate stats from campaigns
  const aggregateStats = campaigns.reduce((acc, campaign) => {
    const stats = campaign.stats || {};
    acc.totalSent += stats.sent || 0;
    acc.totalDelivered += stats.delivered || 0;
    acc.totalOpened += stats.opened || 0;
    acc.totalClicked += stats.clicked || 0;
    acc.totalBounced += stats.bounced || 0;
    acc.totalUnsubscribed += stats.unsubscribed || 0;
    return acc;
  }, {
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalBounced: 0,
    totalUnsubscribed: 0
  });

  const avgOpenRate = aggregateStats.totalSent > 0 
    ? (aggregateStats.totalOpened / aggregateStats.totalSent * 100).toFixed(1) 
    : 0;
  const avgClickRate = aggregateStats.totalSent > 0 
    ? (aggregateStats.totalClicked / aggregateStats.totalSent * 100).toFixed(1) 
    : 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Email Analytics | CYBEV Studio</title>
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
                <h1 className="text-2xl font-bold text-gray-900">Email Analytics</h1>
                <p className="text-gray-500 mt-1">Track your email marketing performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Total Sent</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {aggregateStats.totalSent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {campaigns.length} campaigns
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Avg. Open Rate</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{avgOpenRate}%</div>
              <div className="flex items-center gap-1 mt-1">
                {parseFloat(avgOpenRate) >= 21.5 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Above average</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-600">Below average</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Avg. Click Rate</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{avgClickRate}%</div>
              <div className="flex items-center gap-1 mt-1">
                {parseFloat(avgClickRate) >= 2.3 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Above average</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-600">Below average</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-500">Contacts</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {(stats?.contacts?.subscribed || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {stats?.contacts?.total || 0} total
              </div>
            </div>
          </div>

          {/* Campaign Performance Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Campaign Performance</h2>
            </div>
            
            {campaigns.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns sent yet</h3>
                <p className="text-gray-500 mb-6">Send your first campaign to see analytics here.</p>
                <Link 
                  href="/studio/campaigns/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                  Create Campaign
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Campaign</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sent</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Open Rate</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Click Rate</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {campaigns.slice(0, 10).map(campaign => {
                      const stats = campaign.stats || {};
                      const openRate = stats.sent > 0 ? ((stats.opened || 0) / stats.sent * 100).toFixed(1) : 0;
                      const clickRate = stats.sent > 0 ? ((stats.clicked || 0) / stats.sent * 100).toFixed(1) : 0;
                      
                      return (
                        <tr key={campaign._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-medium">
                            {(stats.sent || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${parseFloat(openRate) >= 21.5 ? 'text-green-600' : 'text-gray-900'}`}>
                                {openRate}%
                              </span>
                              {parseFloat(openRate) >= 21.5 && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${parseFloat(clickRate) >= 2.3 ? 'text-green-600' : 'text-gray-900'}`}>
                                {clickRate}%
                              </span>
                              {parseFloat(clickRate) >= 2.3 && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link 
                              href={`/studio/campaigns/${campaign._id}/report`}
                              className="text-purple-600 hover:text-purple-700 flex items-center justify-end gap-1"
                            >
                              View Report
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Tips to Improve Your Metrics</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                    <span>Segment your audience for more targeted campaigns</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                    <span>Test different send times to find your optimal window</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                    <span>Use A/B testing for subject lines and content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                    <span>Keep your subject lines under 50 characters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
