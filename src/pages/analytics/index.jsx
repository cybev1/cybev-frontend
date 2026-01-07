// ============================================
// FILE: src/pages/analytics/index.jsx
// Creator Analytics Dashboard
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Eye,
  FileText,
  Film,
  BookOpen,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Period options
const PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' }
];

// Stat Card Component
function StatCard({ title, value, change, icon: Icon, color, subtitle }) {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

// Top Content Item
function ContentItem({ item, index }) {
  const typeIcons = {
    post: FileText,
    blog: BookOpen,
    vlog: Film
  };
  const Icon = typeIcons[item.type] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">#{index + 1}</span>
      </div>
      
      {item.thumbnail ? (
        <img 
          src={item.thumbnail} 
          alt="" 
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {item.title || item.content || 'Untitled'}
        </p>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" /> {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" /> {item.comments}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {item.views}
          </span>
        </div>
      </div>
      
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        item.type === 'post' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
        item.type === 'blog' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      }`}>
        {item.type}
      </span>
    </motion.div>
  );
}

// Period Selector
function PeriodSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = PERIODS.find(p => p.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selected?.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
            >
              {PERIODS.map((period) => (
                <button
                  key={period.value}
                  onClick={() => {
                    onChange(period.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    value === period.value ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom Tooltip for Charts
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    overview: null,
    chart: null,
    topContent: [],
    breakdown: [],
    reactions: [],
    followerGrowth: []
  });

  // Fetch all analytics data
  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [overview, chart, content, breakdown, reactions, growth] = await Promise.all([
        axios.get(`${API_URL}/api/creator-analytics/overview?period=${period}`, { headers }),
        axios.get(`${API_URL}/api/creator-analytics/engagement-chart?period=${period}`, { headers }),
        axios.get(`${API_URL}/api/creator-analytics/top-content?period=${period}&limit=5`, { headers }),
        axios.get(`${API_URL}/api/creator-analytics/content-breakdown`, { headers }),
        axios.get(`${API_URL}/api/creator-analytics/reaction-breakdown?period=${period}`, { headers }),
        axios.get(`${API_URL}/api/creator-analytics/follower-growth?period=${period}`, { headers })
      ]);

      setData({
        overview: overview.data.overview,
        chart: chart.data.chart?.data || [],
        topContent: content.data.content || [],
        breakdown: breakdown.data.breakdown || [],
        reactions: reactions.data.reactions || [],
        followerGrowth: growth.data.growth || []
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  // Check auth
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    }
  }, []);

  const { overview, chart, topContent, breakdown, reactions, followerGrowth } = data;

  // Chart colors
  const COLORS = ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <>
      <Head>
        <title>Analytics | CYBEV</title>
        <meta name="description" content="View your creator analytics and performance metrics" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-7 h-7 text-purple-600" />
                  Creator Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Track your content performance and audience growth
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                <PeriodSelector value={period} onChange={setPeriod} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Followers"
                  value={overview?.followers?.total || 0}
                  change={overview?.followers?.change}
                  icon={Users}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                  subtitle={`+${overview?.followers?.new || 0} this period`}
                />
                <StatCard
                  title="Total Content"
                  value={overview?.content?.total || 0}
                  change={overview?.content?.change}
                  icon={FileText}
                  color="bg-gradient-to-br from-pink-500 to-pink-600"
                  subtitle={`${overview?.content?.posts || 0} posts, ${overview?.content?.blogs || 0} blogs`}
                />
                <StatCard
                  title="Total Likes"
                  value={overview?.engagement?.likes || 0}
                  icon={Heart}
                  color="bg-gradient-to-br from-red-500 to-red-600"
                  subtitle={`${overview?.engagement?.comments || 0} comments`}
                />
                <StatCard
                  title="Engagement Rate"
                  value={`${overview?.engagement?.rate || 0}%`}
                  icon={TrendingUp}
                  color="bg-gradient-to-br from-green-500 to-green-600"
                  subtitle={`${overview?.engagement?.views?.toLocaleString() || 0} total views`}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Engagement Over Time
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chart}>
                        <defs>
                          <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="label" 
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="likes"
                          name="Likes"
                          stroke="#9333ea"
                          fillOpacity={1}
                          fill="url(#colorLikes)"
                        />
                        <Area
                          type="monotone"
                          dataKey="comments"
                          name="Comments"
                          stroke="#ec4899"
                          fillOpacity={1}
                          fill="url(#colorComments)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Content Breakdown */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Content Breakdown
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={breakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {breakdown.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color || COLORS[index] }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.name} ({item.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Follower Growth & Top Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Follower Growth */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Follower Growth
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={followerGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="label" 
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="new" 
                          name="New Followers"
                          fill="#9333ea" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Content */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Top Performing Content
                    </h3>
                    <Link 
                      href="/profile"
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      View all <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  {topContent.length > 0 ? (
                    <div className="space-y-2">
                      {topContent.map((item, index) => (
                        <ContentItem key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Sparkles className="w-12 h-12 mb-3 opacity-50" />
                      <p>No content in this period</p>
                      <Link 
                        href="/create"
                        className="mt-3 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Create your first post →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Reactions Breakdown */}
              {reactions.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Reaction Types
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {reactions.map((reaction, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      >
                        <span className="text-2xl">{reaction.emoji}</span>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {reaction.count.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {reaction.percentage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
