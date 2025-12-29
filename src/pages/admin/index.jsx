// ============================================
// FILE: src/pages/admin/index.jsx
// PATH: cybev-frontend/src/pages/admin/index.jsx
// PURPOSE: Admin dashboard - stats, users, content, settings
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Shield,
  Users,
  FileText,
  Settings,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Eye,
  EyeOff,
  Ban,
  CheckCircle,
  Trash2,
  Edit,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Loader2,
  RefreshCw,
  Download,
  Star,
  Coins,
  Image as ImageIcon,
  Activity,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  X,
  Check
} from 'lucide-react';
import api from '@/lib/api';

// Stat Card Component
function StatCard({ title, value, change, changeType, icon: Icon, color }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-5 border border-purple-500/20">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value?.toLocaleString() || 0}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${
          changeType === 'up' ? 'text-green-400' : changeType === 'down' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {changeType === 'up' ? <ArrowUp className="w-3 h-3" /> : changeType === 'down' ? <ArrowDown className="w-3 h-3" /> : null}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}

// User Row Component
function UserRow({ user, onAction, selected, onSelect }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="border-b border-gray-700/50 hover:bg-gray-800/30">
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(user._id, e.target.checked)}
          className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-500"
        />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              user.name?.[0] || 'U'
            )}
          </div>
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              {user.name}
              {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" />}
              {user.isAdmin && <Shield className="w-4 h-4 text-purple-400" />}
            </p>
            <p className="text-gray-400 text-sm">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-300">{user.email}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.isBanned ? 'bg-red-500/20 text-red-400' :
          user.isAdmin ? 'bg-purple-500/20 text-purple-400' :
          user.isVerified ? 'bg-green-500/20 text-green-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {user.isBanned ? 'Banned' : user.isAdmin ? 'Admin' : user.isVerified ? 'Verified' : 'User'}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-300">{user.tokenBalance?.toLocaleString() || 0}</td>
      <td className="py-3 px-4 text-gray-400 text-sm">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="py-3 px-4 relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {showMenu && (
          <div className="absolute right-4 top-full mt-1 bg-gray-800 rounded-xl border border-gray-700 shadow-xl z-10 min-w-[150px]">
            <button
              onClick={() => { onAction('edit', user); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            {user.isBanned ? (
              <button
                onClick={() => { onAction('unban', user); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Unban
              </button>
            ) : (
              <button
                onClick={() => { onAction('ban', user); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-yellow-400 hover:bg-gray-700 flex items-center gap-2"
              >
                <Ban className="w-4 h-4" /> Ban
              </button>
            )}
            <button
              onClick={() => { onAction('delete', user); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// Content Row Component
function ContentRow({ item, onAction }) {
  return (
    <tr className="border-b border-gray-700/50 hover:bg-gray-800/30">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {item.image || item.featuredImage || item.coverImage ? (
            <img
              src={item.image || item.featuredImage || item.coverImage}
              alt=""
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              {item.contentType === 'nft' ? <ImageIcon className="w-5 h-5 text-gray-400" /> : <FileText className="w-5 h-5 text-gray-400" />}
            </div>
          )}
          <div>
            <p className="text-white font-medium">{item.name || item.title || 'Untitled'}</p>
            <p className="text-gray-400 text-sm capitalize">{item.contentType}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-300">
        @{item.creator?.username || item.author?.username || 'unknown'}
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.isHidden ? 'bg-red-500/20 text-red-400' :
          item.isFeatured ? 'bg-yellow-500/20 text-yellow-400' :
          item.status === 'published' || item.status === 'minted' ? 'bg-green-500/20 text-green-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {item.isHidden ? 'Hidden' : item.isFeatured ? 'Featured' : item.status || 'Active'}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-400 text-sm">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {item.isFeatured ? (
            <button
              onClick={() => onAction('unfeature', item)}
              className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
              title="Unfeature"
            >
              <Star className="w-4 h-4 fill-yellow-400" />
            </button>
          ) : (
            <button
              onClick={() => onAction('feature', item)}
              className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600"
              title="Feature"
            >
              <Star className="w-4 h-4" />
            </button>
          )}
          {item.isHidden ? (
            <button
              onClick={() => onAction('unhide', item)}
              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
              title="Show"
            >
              <Eye className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onAction('hide', item)}
              className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600"
              title="Hide"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Stats
  const [stats, setStats] = useState(null);
  
  // Users
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Content
  const [content, setContent] = useState([]);
  const [contentType, setContentType] = useState('all');
  
  // Modals
  const [editingUser, setEditingUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [targetUser, setTargetUser] = useState(null);

  // Sample data
  const sampleStats = {
    users: { total: 1250, today: 23, thisWeek: 145, thisMonth: 420, verified: 890, active: 567 },
    content: { totalBlogs: 456, publishedBlogs: 398, totalNFTs: 234, listedNFTs: 189 },
    staking: { totalStaked: 1250000, activeStakes: 342 }
  };

  const sampleUsers = [
    { _id: '1', name: 'John Doe', username: 'johndoe', email: 'john@example.com', isVerified: true, isAdmin: false, isBanned: false, tokenBalance: 5000, createdAt: new Date() },
    { _id: '2', name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com', isVerified: true, isAdmin: true, isBanned: false, tokenBalance: 15000, createdAt: new Date() },
    { _id: '3', name: 'Bob Wilson', username: 'bobwilson', email: 'bob@example.com', isVerified: false, isAdmin: false, isBanned: true, tokenBalance: 100, createdAt: new Date() }
  ];

  const sampleContent = [
    { _id: '1', contentType: 'blog', title: 'Introduction to Web3', author: { username: 'johndoe' }, status: 'published', isFeatured: true, isHidden: false, createdAt: new Date() },
    { _id: '2', contentType: 'nft', name: 'Cosmic Art #1', creator: { username: 'janesmith' }, status: 'minted', isFeatured: false, isHidden: false, image: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c9c?w=200', createdAt: new Date() }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (!parsed.isAdmin && parsed.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(parsed);
      } catch (e) {
        router.push('/');
        return;
      }
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Fetch stats
      const statsRes = await api.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.data.ok) setStats(statsRes.data.stats);
      else setStats(sampleStats);

      // Fetch users
      const usersRes = await api.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (usersRes.data.ok) {
        setUsers(usersRes.data.users);
        setUsersTotal(usersRes.data.total);
      } else {
        setUsers(sampleUsers);
        setUsersTotal(sampleUsers.length);
      }

      // Fetch content
      const contentRes = await api.get('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (contentRes.data.ok) setContent(contentRes.data.content);
      else setContent(sampleContent);

    } catch (error) {
      console.log('Using sample data');
      setStats(sampleStats);
      setUsers(sampleUsers);
      setContent(sampleContent);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, user) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');

    switch (action) {
      case 'edit':
        setEditingUser(user);
        break;
      case 'ban':
        setTargetUser(user);
        setShowBanModal(true);
        break;
      case 'unban':
        try {
          await api.post(`/api/admin/users/${user._id}/unban`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchData();
        } catch (error) {
          alert('Failed to unban user');
        }
        break;
      case 'delete':
        if (confirm(`Delete user ${user.name}? This cannot be undone.`)) {
          try {
            await api.delete(`/api/admin/users/${user._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
          } catch (error) {
            alert('Failed to delete user');
          }
        }
        break;
    }
  };

  const handleBanUser = async () => {
    if (!targetUser) return;
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');

    try {
      await api.post(`/api/admin/users/${targetUser._id}/ban`, { reason: banReason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setShowBanModal(false);
      setBanReason('');
      setTargetUser(null);
    } catch (error) {
      alert('Failed to ban user');
    }
  };

  const handleContentAction = async (action, item) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');

    try {
      switch (action) {
        case 'feature':
          await api.post(`/api/admin/content/${item._id}/feature`, { type: item.contentType, featured: true }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'unfeature':
          await api.post(`/api/admin/content/${item._id}/feature`, { type: item.contentType, featured: false }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'hide':
          await api.post(`/api/admin/content/${item._id}/hide`, { type: item.contentType }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'unhide':
          await api.post(`/api/admin/content/${item._id}/unhide`, { type: item.contentType }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
      }
      fetchData();
    } catch (error) {
      alert(`Failed to ${action} content`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('No users selected');
      return;
    }

    if (!confirm(`${action} ${selectedUsers.length} users?`)) return;

    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    try {
      await api.post('/api/admin/bulk/users', { action, userIds: selectedUsers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUsers([]);
      fetchData();
    } catch (error) {
      alert('Bulk action failed');
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAllUsers = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(u => u._id));
    } else {
      setSelectedUsers([]);
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
        <title>Admin Dashboard - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage your platform</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                change={`+${stats.users.today} today`}
                changeType="up"
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Active Users (24h)"
                value={stats.users.active}
                icon={Activity}
                color="bg-green-500"
              />
              <StatCard
                title="Total Content"
                value={stats.content.totalBlogs + stats.content.totalNFTs}
                icon={FileText}
                color="bg-purple-500"
              />
              <StatCard
                title="Total Staked"
                value={stats.staking.totalStaked}
                icon={Coins}
                color="bg-yellow-500"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-5 border border-purple-500/20">
                <h3 className="text-white font-medium mb-4">User Growth</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">This Week</span>
                    <span className="text-white">{stats.users.thisWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">This Month</span>
                    <span className="text-white">{stats.users.thisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verified</span>
                    <span className="text-green-400">{stats.users.verified}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-5 border border-purple-500/20">
                <h3 className="text-white font-medium mb-4">Content Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blogs</span>
                    <span className="text-white">{stats.content.totalBlogs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Published</span>
                    <span className="text-green-400">{stats.content.publishedBlogs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">NFTs</span>
                    <span className="text-white">{stats.content.totalNFTs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-5 border border-purple-500/20">
                <h3 className="text-white font-medium mb-4">Staking Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Staked</span>
                    <span className="text-white">{stats.staking.totalStaked?.toLocaleString()} CYBEV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Stakes</span>
                    <span className="text-white">{stats.staking.activeStakes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('ban')}
                    className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
                  >
                    Ban Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('verify')}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                  >
                    Verify Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="py-3 px-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={(e) => handleSelectAllUsers(e.target.checked)}
                          className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-500"
                        />
                      </th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">User</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Email</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Balance</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Joined</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <UserRow
                        key={user._id}
                        user={user}
                        onAction={handleUserAction}
                        selected={selectedUsers.includes(user._id)}
                        onSelect={handleSelectUser}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              {['all', 'blogs', 'nfts'].map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    contentType === type
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Content Table */}
            <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Content</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Author</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Created</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content
                      .filter(item => contentType === 'all' || item.contentType === contentType.slice(0, -1))
                      .map(item => (
                        <ContentRow key={item._id} item={item} onAction={handleContentAction} />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-4">Platform Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Maintenance Mode</p>
                    <p className="text-gray-400 text-sm">Disable site for non-admins</p>
                  </div>
                  <button className="w-14 h-7 bg-gray-600 rounded-full relative">
                    <div className="w-6 h-6 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">New User Registration</p>
                    <p className="text-gray-400 text-sm">Allow new signups</p>
                  </div>
                  <button className="w-14 h-7 bg-purple-500 rounded-full relative">
                    <div className="w-6 h-6 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">NFT Minting</p>
                    <p className="text-gray-400 text-sm">Allow users to mint NFTs</p>
                  </div>
                  <button className="w-14 h-7 bg-purple-500 rounded-full relative">
                    <div className="w-6 h-6 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-4">Fee Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Platform Fee (%)</label>
                  <input
                    type="number"
                    defaultValue="2.5"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Minimum Withdrawal</label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ban Modal */}
      {showBanModal && targetUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-4">Ban User</h2>
            <p className="text-gray-400 mb-4">Ban {targetUser.name}?</p>
            
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Reason (optional)</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason for ban..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowBanModal(false); setTargetUser(null); setBanReason(''); }}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
