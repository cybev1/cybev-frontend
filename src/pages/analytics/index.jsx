// ============================================
// FILE: src/pages/analytics/index.jsx
// PATH: cybev-frontend/src/pages/analytics/index.jsx
// PURPOSE: Creator analytics dashboard - views, earnings, growth
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Users,
  DollarSign,
  FileText,
  Sparkles,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  Share2,
  MessageCircle,
  Loader2,
  ChevronDown,
  Download,
  RefreshCw
} from 'lucide-react';
import api from '@/lib/api';

// Stat Card Component
function StatCard({ title, value, change, changeType, icon: Icon, color, subtitle }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm mt-2 ${
          changeType === 'up' ? 'text-green-400' : changeType === 'down' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {changeType === 'up' ? <ArrowUp className="w-3 h-3" /> : changeType === 'down' ? <ArrowDown className="w-3 h-3" /> : null}
          <span>{change} vs last period</span>
        </div>
      )}
    </div>
  );
}

// Simple Chart Component
function SimpleBarChart({ data, label }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-sm mb-4">{label}</p>
      <div className="flex items-end gap-2 h-40">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all duration-300 hover:opacity-80"
              style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: item.value > 0 ? '4px' : '0' }}
            />
            <span className="text-gray-500 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Top Content Row
function ContentRow({ item, index }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-700/50 last:border-0">
      <span className="text-gray-500 w-6 text-center">{index + 1}</span>
      {item.image ? (
        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
      ) : (
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{item.title || 'Untitled'}</p>
        <p className="text-gray-400 text-sm">{item.type}</p>
      </div>
      <div className="text-right">
        <p className="text-white font-medium">{item.views?.toLocaleString() || 0}</p>
        <p className="text-gray-500 text-sm">views</p>
      </div>
    </div>
  );
}

export default function Analytics() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [topContent, setTopContent] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Sample data for demo
  const sampleStats = {
    totalViews: 45678,
    viewsChange: '+12.5%',
    totalLikes: 3456,
    likesChange: '+8.2%',
    followers: 1234,
    followersChange: '+15',
    engagement: 4.8,
    engagementChange: '+0.3%',
    shares: 567,
    comments: 234
  };

  const sampleEarnings = {
    tips: { total: 1250, count: 45 },
    subscriptions: { monthlyRevenue: 450, subscriberCount: 30 },
    contentSales: { total: 890, count: 12 },
    availableBalance: 2590
  };

  const sampleTopContent = [
    { title: 'The Future of Web3', type: 'Blog', views: 12500, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200' },
    { title: 'Cosmic Dream #001', type: 'NFT', views: 8900, image: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c9c?w=200' },
    { title: 'Building a Better Platform', type: 'Blog', views: 6700, image: null },
    { title: 'Digital Art Collection', type: 'NFT', views: 4500, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200' },
    { title: 'My Journey into Crypto', type: 'Post', views: 3200, image: null }
  ];

  const sampleChartData = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 180 },
    { label: 'Wed', value: 150 },
    { label: 'Thu', value: 220 },
    { label: 'Fri', value: 280 },
    { label: 'Sat', value: 190 },
    { label: 'Sun', value: 240 }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (e) {}
    }

    fetchAnalytics();
  }, [router, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Fetch analytics
      const analyticsRes = await api.get(`/api/analytics?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (analyticsRes.data.ok) {
        setStats(analyticsRes.data.stats);
        setChartData(analyticsRes.data.chartData);
        setTopContent(analyticsRes.data.topContent);
      } else {
        setStats(sampleStats);
        setChartData(sampleChartData);
        setTopContent(sampleTopContent);
      }

      // Fetch earnings
      const earningsRes = await api.get('/api/monetization/earnings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (earningsRes.data.ok) {
        setEarnings(earningsRes.data.earnings);
      } else {
        setEarnings(sampleEarnings);
      }
    } catch (error) {
      console.log('Using sample data');
      setStats(sampleStats);
      setEarnings(sampleEarnings);
      setChartData(sampleChartData);
      setTopContent(sampleTopContent);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Analytics - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              Analytics
            </h1>
            <p className="text-gray-400 mt-1">Track your performance and earnings</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={fetchAnalytics}
              className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Views"
            value={stats?.totalViews?.toLocaleString() || '0'}
            change={stats?.viewsChange}
            changeType="up"
            icon={Eye}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Likes"
            value={stats?.totalLikes?.toLocaleString() || '0'}
            change={stats?.likesChange}
            changeType="up"
            icon={Heart}
            color="bg-pink-500"
          />
          <StatCard
            title="Followers"
            value={stats?.followers?.toLocaleString() || '0'}
            change={stats?.followersChange}
            changeType="up"
            icon={Users}
            color="bg-purple-500"
          />
          <StatCard
            title="Engagement Rate"
            value={`${stats?.engagement || 0}%`}
            change={stats?.engagementChange}
            changeType="up"
            icon={TrendingUp}
            color="bg-green-500"
          />
        </div>

        {/* Earnings Section */}
        {earnings && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Earnings Overview */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Earnings Overview
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Tips Received</p>
                  <p className="text-2xl font-bold text-white">{earnings.tips?.total || 0} CYBEV</p>
                  <p className="text-gray-500 text-sm">{earnings.tips?.count || 0} tips</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Subscriptions</p>
                  <p className="text-2xl font-bold text-white">{earnings.subscriptions?.monthlyRevenue || 0} CYBEV</p>
                  <p className="text-gray-500 text-sm">{earnings.subscriptions?.subscriberCount || 0} subscribers</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Content Sales</p>
                  <p className="text-2xl font-bold text-white">{earnings.contentSales?.total || 0} CYBEV</p>
                  <p className="text-gray-500 text-sm">{earnings.contentSales?.count || 0} sales</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4">
                  <p className="text-white/80 text-sm">Available Balance</p>
                  <p className="text-2xl font-bold text-white">{earnings.availableBalance || 0} CYBEV</p>
                  <button className="text-white/80 text-sm underline mt-1">Withdraw</button>
                </div>
              </div>
            </div>

            {/* Views Chart */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-lg font-bold text-white mb-4">Views Over Time</h2>
              <SimpleBarChart data={chartData} label="Daily Views" />
            </div>
          </div>
        )}

        {/* Content Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Content */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Top Performing Content
            </h2>

            {topContent.length > 0 ? (
              <div>
                {topContent.map((item, i) => (
                  <ContentRow key={i} item={item} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No content yet</p>
            )}
          </div>

          {/* Engagement Breakdown */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-lg font-bold text-white mb-4">Engagement Breakdown</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className="text-gray-300">Likes</span>
                </div>
                <span className="text-white font-bold">{stats?.totalLikes?.toLocaleString() || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Comments</span>
                </div>
                <span className="text-white font-bold">{stats?.comments?.toLocaleString() || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300">Shares</span>
                </div>
                <span className="text-white font-bold">{stats?.shares?.toLocaleString() || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-gray-300">New Followers</span>
                </div>
                <span className="text-white font-bold">{stats?.followersChange || '+0'}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Avg. Engagement Rate</span>
                <span className="text-green-400 font-bold">{stats?.engagement || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${Math.min(stats?.engagement || 0, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Recent Activity
          </h2>

          <div className="space-y-3">
            {[
              { icon: Heart, text: 'Someone liked your post "The Future of Web3"', time: '2 hours ago', color: 'text-pink-400' },
              { icon: Users, text: 'You gained a new follower: @cryptofan', time: '3 hours ago', color: 'text-purple-400' },
              { icon: DollarSign, text: 'You received a 50 CYBEV tip', time: '5 hours ago', color: 'text-green-400' },
              { icon: MessageCircle, text: 'New comment on your NFT listing', time: '6 hours ago', color: 'text-blue-400' },
              { icon: Sparkles, text: 'Your NFT "Cosmic Dream" was featured', time: '1 day ago', color: 'text-yellow-400' }
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className={`w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{activity.text}</p>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}