// ============================================
// FILE: src/pages/studio/campaigns/[id]/report.jsx
// CYBEV Campaign Analytics Report
// VERSION: 1.0.0 - Full Analytics Dashboard
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft, Mail, Send, Users, Eye, MousePointer, AlertTriangle,
  TrendingUp, TrendingDown, Minus, BarChart3, PieChart, Clock,
  Globe, Smartphone, Monitor, Tablet, Download, RefreshCw, Loader2,
  CheckCircle, XCircle, UserMinus, ExternalLink, Link2, Calendar,
  Target, Zap, Award, Info
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const getAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subValue, trend, trendValue, benchmark, color = 'purple' }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            {trendValue && <span className="text-sm text-gray-500">{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
      {subValue && <div className="text-xs text-gray-400 mt-1">{subValue}</div>}
      {benchmark !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Industry avg:</span>
            <span className={parseFloat(value) >= benchmark ? 'text-green-600' : 'text-orange-500'}>
              {benchmark}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ value, max, label, color = 'purple' }) => {
  const percentage = max > 0 ? (value / max * 100) : 0;
  const colors = {
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default function CampaignReport() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/${id}/report`, getAuth());
      const data = await res.json();
      
      if (data.campaign) {
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReport();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  if (!report) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="w-12 h-12 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-900">Campaign not found</h2>
          <Link href="/studio/campaigns" className="text-purple-600 hover:underline">
            ← Back to campaigns
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { campaign, stats, benchmarks, deviceStats } = report;

  return (
    <AppLayout>
      <Head>
        <title>Campaign Report - {campaign.name} | CYBEV</title>
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
                <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
                <p className="text-gray-500 mt-1">{campaign.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Campaign Info Banner */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Sent</div>
                  <div className="font-medium text-gray-900">
                    {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Not sent'}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Recipients</div>
                  <div className="font-medium text-gray-900">{stats.sent.toLocaleString()}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  campaign.status === 'sent' ? 'bg-green-500' :
                  campaign.status === 'sending' ? 'bg-yellow-500 animate-pulse' :
                  'bg-gray-400'
                }`} />
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-medium text-gray-900 capitalize">{campaign.status}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Send}
              label="Delivered"
              value={stats.delivered.toLocaleString()}
              subValue={`${stats.sent > 0 ? ((stats.delivered / stats.sent) * 100).toFixed(1) : 0}% delivery rate`}
              color="green"
            />
            <StatCard
              icon={Eye}
              label="Opened"
              value={stats.opened.toLocaleString()}
              subValue={`${stats.openRate}% open rate`}
              benchmark={benchmarks.openRate}
              trend={stats.openRate >= benchmarks.openRate ? 'up' : 'down'}
              color="blue"
            />
            <StatCard
              icon={MousePointer}
              label="Clicked"
              value={stats.clicked.toLocaleString()}
              subValue={`${stats.clickRate}% click rate`}
              benchmark={benchmarks.clickRate}
              trend={stats.clickRate >= benchmarks.clickRate ? 'up' : 'down'}
              color="purple"
            />
            <StatCard
              icon={UserMinus}
              label="Unsubscribed"
              value={stats.unsubscribed.toLocaleString()}
              subValue={`${stats.unsubscribeRate}% unsub rate`}
              benchmark={benchmarks.unsubscribeRate}
              trend={stats.unsubscribeRate <= benchmarks.unsubscribeRate ? 'up' : 'down'}
              color={stats.unsubscribeRate > benchmarks.unsubscribeRate ? 'red' : 'gray'}
            />
          </div>

          {/* Detailed Stats */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Funnel */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Email Funnel
              </h3>
              <ProgressBar value={stats.sent} max={stats.sent} label="Sent" color="gray" />
              <ProgressBar value={stats.delivered} max={stats.sent} label="Delivered" color="green" />
              <ProgressBar value={stats.opened} max={stats.sent} label="Opened" color="blue" />
              <ProgressBar value={stats.clicked} max={stats.sent} label="Clicked" color="purple" />
              
              {/* Bounces & Complaints */}
              {stats.bounced > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Bounced
                    </span>
                    <span className="font-medium">{stats.bounced}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Device Breakdown
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Desktop</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{deviceStats?.desktop || 60}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">Mobile</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{deviceStats?.mobile || 35}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Tablet className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Tablet</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{deviceStats?.tablet || 5}%</div>
                  </div>
                </div>
              </div>
              
              {/* Visual bar */}
              <div className="mt-6 h-4 bg-gray-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: `${deviceStats?.desktop || 60}%` }} />
                <div className="bg-green-500 h-full" style={{ width: `${deviceStats?.mobile || 35}%` }} />
                <div className="bg-purple-500 h-full" style={{ width: `${deviceStats?.tablet || 5}%` }} />
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Performance Insights</h3>
                <div className="space-y-2 text-purple-100">
                  {stats.openRate >= benchmarks.openRate ? (
                    <p className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      Great job! Your open rate is above industry average.
                    </p>
                  ) : (
                    <p className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-yellow-300" />
                      Try testing different subject lines to improve open rates.
                    </p>
                  )}
                  {stats.clickRate >= benchmarks.clickRate ? (
                    <p className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      Excellent click-through rate! Your content is engaging.
                    </p>
                  ) : (
                    <p className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-yellow-300" />
                      Consider adding clearer call-to-action buttons.
                    </p>
                  )}
                  {stats.unsubscribeRate > benchmarks.unsubscribeRate && (
                    <p className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-300" />
                      Higher than average unsubscribes. Review your sending frequency.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link 
              href={`/studio/campaigns/editor?id=${id}`}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              View Email
            </Link>
            <Link 
              href="/studio/campaigns/create"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Create New Campaign
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
