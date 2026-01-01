// ============================================
// FILE: src/pages/dashboard.jsx
// CYBEV Dashboard - Matching Feed Design
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Users, Video, Bell, Menu, Search, MessageCircle, Plus,
  BookOpen, Eye, Heart, MessageSquare, DollarSign, TrendingUp,
  Edit, Trash2, MoreHorizontal, Calendar, Filter, Sparkles,
  ChevronRight, BarChart3, Coins, Loader2, X
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// ==========================================
// TOP NAVIGATION BAR (Same as Feed)
// ==========================================
function TopNavBar({ user }) {
  const router = useRouter();
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <Link href="/feed">
          <h1 className="text-2xl font-bold text-purple-600 cursor-pointer">CYBEV</h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-2">
          <Link href="/feed">
            <button className="px-8 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Home className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-8 py-2 rounded-lg hover:bg-gray-100 text-purple-600 border-b-2 border-purple-600">
              <BarChart3 className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/live">
            <button className="px-8 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Video className="w-6 h-6" />
            </button>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/studio')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={() => router.push('/search')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={() => router.push('/messages')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 relative">
            <MessageCircle className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={() => router.push('/notifications')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STAT CARD COMPONENT
// ==========================================
function StatCard({ icon: Icon, value, label, color, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ==========================================
// BLOG POST ITEM
// ==========================================
function BlogPostItem({ post, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 
            onClick={() => router.push(`/blog/${post._id}`)}
            className="font-semibold text-gray-900 hover:text-purple-600 cursor-pointer truncate"
          >
            {post.title || 'Untitled Post'}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 100)}
          </p>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {post.likes?.length || post.likesCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {post.commentsCount || post.comments?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="relative flex-shrink-0">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-10">
              <button 
                onClick={() => { onEdit(post._id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 text-sm"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => { onDelete(post._id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-red-500 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN DASHBOARD PAGE
// ==========================================
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalEarnings: 0,
    tokenBalance: 0
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch {}
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user's blogs
      const blogsRes = await api.get('/api/blogs/my-blogs', { headers });
      const blogs = blogsRes.data.blogs || blogsRes.data.data?.blogs || [];
      setPosts(blogs);

      // Calculate stats
      const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
      const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || b.likesCount || 0), 0);
      const totalComments = blogs.reduce((sum, b) => sum + (b.commentsCount || b.comments?.length || 0), 0);

      // Fetch wallet balance
      let tokenBalance = 0;
      try {
        const walletRes = await api.get('/api/wallet/balance', { headers });
        tokenBalance = walletRes.data.balance || 0;
      } catch {}

      setStats({
        totalPosts: blogs.length,
        totalViews,
        totalLikes,
        totalComments,
        totalEarnings: tokenBalance * 0.01, // Assume 1 token = $0.01
        tokenBalance
      });

    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  const handleEdit = (id) => {
    router.push(`/blog/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post permanently?')) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Post deleted');
      setPosts(prev => prev.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'published') return post.status === 'published';
    if (filter === 'draft') return post.status === 'draft';
    return true;
  });

  return (
    <>
      <Head>
        <title>Dashboard - CYBEV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <TopNavBar user={user} />

        <div className="max-w-screen-lg mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage your content and track growth</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push('/studio')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
              >
                <Sparkles className="w-4 h-4" /> Create Blog
              </button>
              <button 
                onClick={() => router.push('/feed')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                <TrendingUp className="w-4 h-4" /> View Feed
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats Grid - 2 columns on mobile, 3 on tablet, 6 on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <StatCard 
                  icon={BookOpen} 
                  value={stats.totalPosts} 
                  label="Posts" 
                  color="bg-purple-500"
                />
                <StatCard 
                  icon={Eye} 
                  value={stats.totalViews} 
                  label="Views" 
                  color="bg-blue-500"
                  trend={12}
                />
                <StatCard 
                  icon={Heart} 
                  value={stats.totalLikes} 
                  label="Likes" 
                  color="bg-pink-500"
                />
                <StatCard 
                  icon={MessageSquare} 
                  value={stats.totalComments} 
                  label="Comments" 
                  color="bg-green-500"
                />
                <StatCard 
                  icon={Coins} 
                  value={stats.tokenBalance} 
                  label="Tokens" 
                  color="bg-yellow-500"
                />
                <StatCard 
                  icon={DollarSign} 
                  value={`$${stats.totalEarnings.toFixed(2)}`} 
                  label="Earnings" 
                  color="bg-emerald-500"
                />
              </div>

              {/* Blog Posts Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Section Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Your Blog Posts</h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filter === 'all' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setFilter('published')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filter === 'published' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      Published
                    </button>
                    <button 
                      onClick={() => setFilter('draft')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filter === 'draft' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      Drafts
                    </button>
                  </div>
                </div>

                {/* Posts List */}
                <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
                  {filteredPosts.length === 0 ? (
                    <div className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">No posts yet</p>
                      <button 
                        onClick={() => router.push('/studio')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        Create Your First Blog
                      </button>
                    </div>
                  ) : (
                    filteredPosts.map(post => (
                      <div key={post._id} className="p-4">
                        <BlogPostItem 
                          post={post} 
                          onEdit={handleEdit} 
                          onDelete={handleDelete}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="p-3 text-gray-500"><Home className="w-6 h-6" /></button>
          </Link>
          <Link href="/discover">
            <button className="p-3 text-gray-500"><Users className="w-6 h-6" /></button>
          </Link>
          <button onClick={() => router.push('/studio')} className="p-3 bg-purple-600 rounded-full -mt-6 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </button>
          <Link href="/dashboard">
            <button className="p-3 text-purple-600"><BarChart3 className="w-6 h-6" /></button>
          </Link>
          <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
            <button className="p-3 text-gray-500"><Menu className="w-6 h-6" /></button>
          </Link>
        </div>
      </div>
    </>
  );
}
