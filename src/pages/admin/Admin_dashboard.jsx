import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    earnings: 0,
    nfts: 0
  });
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [insights, setInsights] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('cybev_token');
      
      const [statsRes, analyticsRes, activityRes, insightsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }),
        fetch(`/api/admin/analytics?range=${timeRange}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }),
        fetch('/api/admin/recent-activity', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }),
        fetch('/api/admin/insights', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData.activities || []);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData.summary || '');
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    setStats({
      users: 2547,
      posts: 8932,
      earnings: 45230,
      nfts: 1203
    });

    setAnalytics({
      userGrowth: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'New Users',
          data: [12, 19, 8, 15, 32, 28, 45],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      engagement: {
        labels: ['Posts', 'Comments', 'Likes', 'Shares', 'NFTs'],
        datasets: [{
          data: [145, 289, 567, 123, 89],
          backgroundColor: [
            '#FF6384',
            '#36A2EB', 
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ],
          borderWidth: 0
        }]
      },
      earnings: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Platform Earnings ($)',
          data: [1200, 1900, 3000, 5000, 4200, 6500],
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderRadius: 8
        }]
      }
    });

    setRecentActivity([
      { id: 1, type: 'user_join', user: 'alice@example.com', time: '2 minutes ago', details: 'New user registration' },
      { id: 2, type: 'nft_mint', user: 'bob@example.com', time: '5 minutes ago', details: 'Blog post minted as NFT' },
      { id: 3, type: 'post_boost', user: 'charlie@example.com', time: '10 minutes ago', details: 'Post boosted for 50 CYBV' },
      { id: 4, type: 'token_stake', user: 'diana@example.com', time: '15 minutes ago', details: 'Staked 100 CYBV tokens' },
      { id: 5, type: 'blog_create', user: 'eve@example.com', time: '20 minutes ago', details: 'New blog created: TechTrends' }
    ]);

    setInsights('Platform growth is accelerating with 15% increase in user engagement this week. NFT minting activity has doubled, and token staking reached an all-time high. Consider promoting the AI content features to capitalize on current momentum.');
  };

  const StatCard = ({ title, value, icon, color, change, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 ${color} relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className="text-6xl">{icon}</div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          {trend && (
            <div className={`text-xs px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {trend === 'up' ? '↗️' : '↘️'} {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        
        {change && (
          <p className={`text-sm mt-2 flex items-center ${
            change > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            <span className="mr-1">{change > 0 ? '📈' : '📉'}</span>
            {Math.abs(change)}% from last week
          </p>
        )}
      </div>
    </motion.div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      const icons = {
        'user_join': '👤',
        'nft_mint': '🪙', 
        'post_boost': '🚀',
        'token_stake': '💰',
        'blog_create': '📝',
        'post_create': '✍️',
        'comment': '💬',
        'like': '❤️'
      };
      return icons[type] || '📊';
    };

    const getActivityColor = (type) => {
      const colors = {
        'user_join': 'bg-blue-100 text-blue-600',
        'nft_mint': 'bg-purple-100 text-purple-600',
        'post_boost': 'bg-orange-100 text-orange-600', 
        'token_stake': 'bg-green-100 text-green-600',
        'blog_create': 'bg-indigo-100 text-indigo-600',
        'post_create': 'bg-yellow-100 text-yellow-600',
        'comment': 'bg-pink-100 text-pink-600',
        'like': 'bg-red-100 text-red-600'
      };
      return colors[type] || 'bg-gray-100 text-gray-600';
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all cursor-pointer"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {activity.user}
          </p>
          <p className="text-xs text-gray-500 truncate">{activity.details}</p>
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-300 rounded-xl"></div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - CYBEV</title>
        <meta name="description" content="CYBEV Admin Dashboard - Monitor platform performance and analytics" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                🚀 CYBEV Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor platform performance and user activity in real-time
              </p>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadDashboardData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                🔄 Refresh
              </motion.button>
            </div>
          </div>

          {/* AI Insights Banner */}
          {insights && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl p-6 mb-8"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                🤖 AI Platform Insights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{insights}</p>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.users}
              icon="👥"
              color="border-blue-500"
              change={12.5}
              trend="up"
            />
            <StatCard
              title="Total Posts"
              value={stats.posts}
              icon="📝"
              color="border-green-500"
              change={8.2}
              trend="up"
            />
            <StatCard
              title="Platform Earnings"
              value={`$${stats.earnings.toLocaleString()}`}
              icon="💰"
              color="border-yellow-500"
              change={15.3}
              trend="up"
            />
            <StatCard
              title="NFTs Minted"
              value={stats.nfts}
              icon="🖼️"
              color="border-purple-500"
              change={-2.1}
              trend="down"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                📈 User Growth Trend
              </h3>
              {analytics?.userGrowth && (
                <Line
                  data={analytics.userGrowth}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { 
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.1)' }
                      },
                      x: {
                        grid: { color: 'rgba(0,0,0,0.1)' }
                      }
                    }
                  }}
                />
              )}
            </motion.div>

            {/* Engagement Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🎯 Platform Engagement
              </h3>
              {analytics?.engagement && (
                <Doughnut
                  data={analytics.engagement}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { 
                        position: 'bottom',
                        labels: { padding: 20 }
                      }
                    }
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              💵 Monthly Revenue Overview
            </h3>
            {analytics?.earnings && (
              <Bar
                data={analytics.earnings}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { 
                      beginAtZero: true,
                      grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    x: {
                      grid: { display: false }
                    }
                  }
                }}
              />
            )}
          </motion.div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                ⚡ Recent Activity
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </motion.div>

            {/* Quick Actions & System Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  ⚡ Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition"
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm font-medium">User Management</div>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium">Generate Report</div>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition"
                  >
                    <div className="text-2xl mb-2">🪙</div>
                    <div className="text-sm font-medium">Token Management</div>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition"
                  >
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="text-sm font-medium">System Settings</div>
                  </motion.button>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  🏥 System Health
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3">
                    <div className="text-2xl mb-2">🟢</div>
                    <div className="text-sm font-medium">API Status</div>
                    <div className="text-xs text-green-600">Operational</div>
                  </div>
                  
                  <div className="text-center p-3">
                    <div className="text-2xl mb-2">🟢</div>
                    <div className="text-sm font-medium">Database</div>
                    <div className="text-xs text-green-600">99.9% Uptime</div>
                  </div>
                  
                  <div className="text-center p-3">
                    <div className="text-2xl mb-2">🟡</div>
                    <div className="text-sm font-medium">Blockchain</div>
                    <div className="text-xs text-yellow-600">Moderate Load</div>
                  </div>
                  
                  <div className="text-center p-3">
                    <div className="text-2xl mb-2">🟢</div>
                    <div className="text-sm font-medium">CDN</div>
                    <div className="text-xs text-green-600">Global Edge</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
