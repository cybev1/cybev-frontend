import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { blogAPI, rewardAPI } from '@/lib/api';
import { 
  BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2,
  FileText, Users, Calendar, ArrowUp, ArrowDown, Minus,
  Award, Coins, Clock, Target
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // 'week', 'month', 'all'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, blogsRes, walletRes] = await Promise.all([
        blogAPI.getStats(),
        blogAPI.getMyBlogs(),
        rewardAPI.getWallet().catch(() => ({ data: { balance: 0 } }))
      ]);

      if (statsRes.data.success || statsRes.data.ok) {
        setStats(statsRes.data.stats);
      }

      if (blogsRes.data.success || blogsRes.data.ok) {
        setBlogs(blogsRes.data.blogs || []);
      }

      if (walletRes.data) {
        setWallet(walletRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived stats
  const calculateDerivedStats = () => {
    if (!blogs.length) return {};

    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
    const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);
    const totalShares = blogs.reduce((sum, b) => sum + (b.shares?.total || 0), 0);
    
    const avgViews = blogs.length ? Math.round(totalViews / blogs.length) : 0;
    const avgLikes = blogs.length ? Math.round(totalLikes / blogs.length) : 0;
    
    // Engagement rate: (likes + shares) / views * 100
    const engagementRate = totalViews > 0 
      ? ((totalLikes + totalShares) / totalViews * 100).toFixed(1) 
      : 0;

    // Best performing blog
    const bestBlog = blogs.reduce((best, blog) => {
      const score = (blog.views || 0) + (blog.likes?.length || 0) * 3;
      const bestScore = (best?.views || 0) + (best?.likes?.length || 0) * 3;
      return score > bestScore ? blog : best;
    }, blogs[0]);

    // Categories breakdown
    const categories = blogs.reduce((acc, blog) => {
      const cat = blog.category || 'uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return {
      totalViews,
      totalLikes,
      totalShares,
      avgViews,
      avgLikes,
      engagementRate,
      bestBlog,
      categories
    };
  };

  const derivedStats = calculateDerivedStats();

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Track your content performance</p>
            </div>
            
            {/* Time Range Filter */}
            <div className="flex gap-2">
              {['week', 'month', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
                </button>
              ))}
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Views"
              value={derivedStats.totalViews?.toLocaleString() || 0}
              icon={Eye}
              color="blue"
              change={+12}
            />
            <StatCard
              title="Total Likes"
              value={derivedStats.totalLikes?.toLocaleString() || 0}
              icon={Heart}
              color="pink"
              change={+8}
            />
            <StatCard
              title="Total Shares"
              value={derivedStats.totalShares?.toLocaleString() || 0}
              icon={Share2}
              color="green"
              change={+5}
            />
            <StatCard
              title="Total Posts"
              value={blogs.length}
              icon={FileText}
              color="purple"
              change={0}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Engagement Rate</p>
                  <p className="text-2xl font-bold text-white">{derivedStats.engagementRate}%</p>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  style={{ width: `${Math.min(derivedStats.engagementRate * 10, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg. Views/Post</p>
                  <p className="text-2xl font-bold text-white">{derivedStats.avgViews}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Token Earnings</p>
                  <p className="text-2xl font-bold text-white">
                    {wallet?.balance?.toLocaleString() || 0} CYBEV
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Best Performing Post */}
          {derivedStats.bestBlog && (
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Best Performing Post</h2>
              </div>
              <Link href={`/blog/${derivedStats.bestBlog._id}`}>
                <div className="bg-black/20 rounded-lg p-4 hover:bg-black/30 transition-colors cursor-pointer">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {derivedStats.bestBlog.title}
                  </h3>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {derivedStats.bestBlog.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {derivedStats.bestBlog.likes?.length || 0} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      {derivedStats.bestBlog.shares?.total || 0} shares
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(derivedStats.bestBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Content Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* All Posts Performance */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Posts Performance
              </h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {blogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No posts yet</p>
                ) : (
                  blogs.slice(0, 10).map((blog) => (
                    <Link key={blog._id} href={`/blog/${blog._id}`}>
                      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-white font-medium truncate">{blog.title}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {blog.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {blog.likes?.length || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Categories Breakdown */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Categories Breakdown
              </h2>
              <div className="space-y-3">
                {Object.keys(derivedStats.categories || {}).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No data yet</p>
                ) : (
                  Object.entries(derivedStats.categories || {}).map(([category, count]) => {
                    const percentage = blogs.length ? (count / blogs.length * 100).toFixed(0) : 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 capitalize">{category}</span>
                          <span className="text-gray-500">{count} posts ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/studio/ai-blog">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium">
                  Create New Post
                </button>
              </Link>
              <Link href="/feed">
                <button className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium">
                  View Feed
                </button>
              </Link>
              <Link href="/rewards/dashboard">
                <button className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium">
                  Token Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, change }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    pink: 'bg-pink-500/20 text-pink-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && change !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
