// ============================================
// FILE: src/pages/admin/dashboard.jsx
// Admin Dashboard - Comprehensive Analytics
// VERSION: 2.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users, FileText, Video, DollarSign, TrendingUp, TrendingDown,
  Eye, Heart, MessageSquare, Share2, Shield, AlertTriangle,
  Settings, BarChart3, Activity, Database, Server, Zap,
  ChevronRight, RefreshCw, Search, Filter, MoreHorizontal,
  Ban, CheckCircle, UserX, Clock, Calendar, Radio
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Stat Card Component
function StatCard({ title, value, change, icon: Icon, color, subtitle }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-gray-900" />
        </div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{isPositive ? '+' : ''}{change}% from last month</span>
        </div>
      )}
    </div>
  );
}

// Mini Chart Component (Simple bar visualization)
function MiniChart({ data, height = 60 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.slice(-14).map((d, i) => (
        <div
          key={i}
          className="flex-1 bg-purple-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
          style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? '4px' : '0' }}
          title={`${d.date}: ${d.value}`}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [userChart, setUserChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [topContent, setTopContent] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (overview) {
      fetchCharts();
    }
  }, [period]);

  const checkAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchDashboard();
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [overviewRes, usersRes, contentRes, streamsRes, healthRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin-analytics/overview`, { headers }),
        axios.get(`${API_URL}/api/admin-analytics/users/list?limit=5&sort=createdAt&order=desc`, { headers }),
        axios.get(`${API_URL}/api/admin-analytics/content/top?limit=5`, { headers }),
        axios.get(`${API_URL}/api/admin-analytics/streams?status=live&limit=5`, { headers }).catch(() => ({ data: { streams: [] } })),
        axios.get(`${API_URL}/api/admin-analytics/system/health`, { headers }).catch(() => ({ data: { system: null } }))
      ]);

      setOverview(overviewRes.data.overview);
      setRecentUsers(usersRes.data.users || []);
      setTopContent(contentRes.data.content || []);
      setLiveStreams(streamsRes.data.streams || []);
      setSystemHealth(healthRes.data.system);

      fetchCharts();
    } catch (error) {
      console.error('Dashboard error:', error);
      if (error.response?.status === 403) {
        toast.error('Admin access required');
        router.push('/feed');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCharts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [userChartRes, revenueChartRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin-analytics/users/chart?period=${period}`, { headers }),
        axios.get(`${API_URL}/api/admin-analytics/revenue/chart?period=${period}`, { headers })
      ]);

      setUserChart(userChartRes.data.data || []);
      setRevenueChart(revenueChartRes.data.data || []);
    } catch (error) {
      console.error('Charts error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="mt-2 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="bg-white dark:bg-gray-50 border-b border-gray-200 dark:border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/feed">
                  <span className="text-2xl font-bold text-purple-600">CYBEV</span>
                </Link>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-600 text-sm font-medium rounded-full">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboard}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-gray-500" />
                </button>
                <Link href="/settings">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-white rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-500" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Period Selector */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">Dashboard Overview</h1>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-white text-gray-600 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-100'
                  }`}
                >
                  {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={overview?.users?.total || 0}
              change={overview?.users?.growth}
              icon={Users}
              color="bg-blue-500"
              subtitle={`${overview?.users?.activeWeek || 0} active this week`}
            />
            <StatCard
              title="Total Content"
              value={overview?.content?.total || 0}
              icon={FileText}
              color="bg-green-500"
              subtitle={`${overview?.content?.blogs?.today || 0} blogs today`}
            />
            <StatCard
              title="Live Streams"
              value={overview?.streams?.live || 0}
              icon={Radio}
              color="bg-red-500"
              subtitle={`${overview?.streams?.total || 0} total streams`}
            />
            <StatCard
              title="Revenue (Month)"
              value={formatCurrency(overview?.revenue?.thisMonth || 0)}
              change={overview?.revenue?.growth}
              icon={DollarSign}
              color="bg-purple-500"
              subtitle={`${formatCurrency(overview?.revenue?.total || 0)} all time`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Signups Chart */}
            <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900">User Signups</h3>
                <span className="text-sm text-gray-500">
                  {userChart.reduce((sum, d) => sum + d.signups, 0)} total
                </span>
              </div>
              <MiniChart data={userChart.map(d => ({ date: d.date, value: d.signups }))} height={80} />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{userChart[0]?.date ? formatDate(userChart[0].date) : ''}</span>
                <span>{userChart[userChart.length - 1]?.date ? formatDate(userChart[userChart.length - 1].date) : ''}</span>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900">Revenue</h3>
                <span className="text-sm text-gray-500">
                  {formatCurrency(revenueChart.reduce((sum, d) => sum + d.revenue, 0))}
                </span>
              </div>
              <MiniChart data={revenueChart.map(d => ({ date: d.date, value: d.revenue }))} height={80} />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{revenueChart[0]?.date ? formatDate(revenueChart[0].date) : ''}</span>
                <span>{revenueChart[revenueChart.length - 1]?.date ? formatDate(revenueChart[revenueChart.length - 1].date) : ''}</span>
              </div>
            </div>
          </div>

          {/* Three Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Recent Users
                </h3>
                <Link href="/admin/users">
                  <span className="text-sm text-purple-600 hover:text-purple-700">View All</span>
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center gap-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7c3aed&color=fff`}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No users yet</p>
                )}
              </div>
            </div>

            {/* Top Content */}
            <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Top Content
                </h3>
                <Link href="/admin/content">
                  <span className="text-sm text-purple-600 hover:text-purple-700">View All</span>
                </Link>
              </div>
              <div className="space-y-3">
                {topContent.map((content, idx) => (
                  <div key={content._id} className="flex items-start gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-sm font-medium">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-900 text-sm line-clamp-1">{content.title || content.content?.substring(0, 50)}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{content.views || 0}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{content.engagement || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {topContent.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No content yet</p>
                )}
              </div>
            </div>

            {/* Live Streams */}
            <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500" />
                  Live Now
                </h3>
                <Link href="/admin/streams">
                  <span className="text-sm text-purple-600 hover:text-purple-700">View All</span>
                </Link>
              </div>
              <div className="space-y-3">
                {liveStreams.map((stream) => (
                  <div key={stream._id} className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={stream.host?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.host?.name || 'U')}&background=7c3aed&color=fff`}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-900 truncate">{stream.title}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {stream.viewerCount || 0} watching
                      </p>
                    </div>
                  </div>
                ))}
                {liveStreams.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No live streams</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/users">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Manage Users</span>
                  </div>
                </Link>
                <Link href="/admin/content">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                    <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Content</span>
                  </div>
                </Link>
                <Link href="/admin/reports">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
                    <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Reports</span>
                  </div>
                </Link>
                <Link href="/admin/revenue">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                    <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-600">Revenue</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <h3 className="font-semibold text-gray-900 dark:text-gray-900 flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-500" />
                System Health
              </h3>
              {systemHealth ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Database className="w-4 h-4" /> Database
                    </span>
                    <span className={`text-sm font-medium ${systemHealth.database === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                      {systemHealth.database === 'connected' ? '● Connected' : '○ Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Server className="w-4 h-4" /> Memory
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-900">{systemHealth.memory?.used}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Uptime
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-900">
                      {Math.floor(systemHealth.uptime / 3600)}h {Math.floor((systemHealth.uptime % 3600) / 60)}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Node
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-900">{systemHealth.node}</span>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">Unable to fetch</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
