// ============================================
// FILE: src/pages/admin/index.jsx
// Admin Dashboard - Main Overview
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { adminAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Users, FileText, MessageCircle, Eye, Heart, Share2,
  TrendingUp, Shield, Settings, BarChart3, AlertTriangle,
  Calendar, ArrowUpRight, Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [topBlogs, setTopBlogs] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin' && !user.isAdmin) {
        toast.error('Admin access required');
        router.push('/dashboard');
        return;
      }
      setIsAdmin(true);
      fetchStats();
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStats();
      if (res.data.ok) {
        setStats(res.data.stats);
        setTopBlogs(res.data.topBlogs || []);
        setRecentUsers(res.data.recentUsers || []);
        setRecentBlogs(res.data.recentBlogs || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      if (error.response?.status === 403) {
        toast.error('Admin access required');
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading admin dashboard...</p>
          </div>
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
                <Shield className="w-8 h-8 text-purple-400" />
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Platform overview and management</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/users">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  <Users className="w-4 h-4" />
                  Users
                </button>
              </Link>
              <Link href="/admin/content">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  Content
                </button>
              </Link>
              <Link href="/admin/reports">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
              </Link>
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats?.users?.total || 0}
              subtext={`+${stats?.users?.today || 0} today`}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Total Blogs"
              value={stats?.content?.blogs || 0}
              subtext={`${stats?.content?.comments || 0} comments`}
              icon={FileText}
              color="green"
            />
            <StatCard
              title="Total Views"
              value={stats?.engagement?.views || 0}
              subtext="All time"
              icon={Eye}
              color="purple"
            />
            <StatCard
              title="Engagement"
              value={stats?.engagement?.likes || 0}
              subtext={`${stats?.engagement?.shares || 0} shares`}
              icon={Heart}
              color="pink"
            />
          </div>

          {/* User Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                User Growth
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Today</span>
                  <span className="text-white font-semibold">+{stats?.users?.today || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">This Week</span>
                  <span className="text-white font-semibold">+{stats?.users?.thisWeek || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-white font-semibold">+{stats?.users?.thisMonth || 0}</span>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Recent Users
                </h3>
                <Link href="/admin/users" className="text-purple-400 text-sm hover:text-purple-300">
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs">@{user.username}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  Recent Blogs
                </h3>
                <Link href="/admin/content" className="text-purple-400 text-sm hover:text-purple-300">
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <div key={blog._id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-white text-sm font-medium truncate">{blog.title}</p>
                      <p className="text-gray-500 text-xs">by {blog.authorName}</p>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Content */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              Top Performing Content
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Author</th>
                    <th className="pb-3 font-medium text-right">Views</th>
                    <th className="pb-3 font-medium text-right">Likes</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {topBlogs.map((blog, idx) => (
                    <tr key={blog._id} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{idx + 1}.</span>
                          <Link href={`/blog/${blog._id}`}>
                            <span className="text-white hover:text-purple-400 cursor-pointer truncate max-w-xs">
                              {blog.title}
                            </span>
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400">{blog.authorName}</td>
                      <td className="py-3 text-right text-gray-300">{blog.views?.toLocaleString() || 0}</td>
                      <td className="py-3 text-right text-gray-300">{blog.likes?.length || 0}</td>
                      <td className="py-3 text-right text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <div className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl p-4 cursor-pointer transition-colors">
                <Users className="w-6 h-6 text-blue-400 mb-2" />
                <h4 className="text-white font-medium">Manage Users</h4>
                <p className="text-gray-400 text-sm">View, edit, ban users</p>
              </div>
            </Link>
            <Link href="/admin/content">
              <div className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl p-4 cursor-pointer transition-colors">
                <FileText className="w-6 h-6 text-green-400 mb-2" />
                <h4 className="text-white font-medium">Moderate Content</h4>
                <p className="text-gray-400 text-sm">Review, hide, delete</p>
              </div>
            </Link>
            <Link href="/admin/reports">
              <div className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl p-4 cursor-pointer transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
                <h4 className="text-white font-medium">View Reports</h4>
                <p className="text-gray-400 text-sm">Analytics & insights</p>
              </div>
            </Link>
            <Link href="/settings">
              <div className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-xl p-4 cursor-pointer transition-colors">
                <Settings className="w-6 h-6 text-gray-400 mb-2" />
                <h4 className="text-white font-medium">Settings</h4>
                <p className="text-gray-400 text-sm">Platform configuration</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, subtext, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    pink: 'bg-pink-500/20 text-pink-400',
    yellow: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-gray-500 text-sm mt-1">{subtext}</p>
    </div>
  );
}
