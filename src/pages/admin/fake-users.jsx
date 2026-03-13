// ============================================
// FILE: src/pages/admin/fake-users.jsx
// Admin Panel: Synthetic User Generation & Engagement
// VERSION: 1.0
// ============================================

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Shield, Users, Bot, Zap, Globe, BarChart3, Loader2,
  Plus, Trash2, Play, Pause, Eye, Heart, MessageSquare,
  UserPlus, RefreshCw, AlertTriangle, CheckCircle, ChevronDown,
  ArrowLeft, Radio, TrendingUp, Search, Filter, Download
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function FakeUsersAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });
  
  // Generation form
  const [genCount, setGenCount] = useState(100);
  const [genCountry, setGenCountry] = useState('');
  const [genDaysBack, setGenDaysBack] = useState(365);
  const [generating, setGenerating] = useState(false);
  
  // Engagement form
  const [engAction, setEngAction] = useState('like');
  const [engTargetType, setEngTargetType] = useState('posts');
  const [engCount, setEngCount] = useState(50);
  const [engTargetId, setEngTargetId] = useState('');
  const [simulating, setSimulating] = useState(false);
  
  // Stream viewer form
  const [streamId, setStreamId] = useState('');
  const [viewerCount, setViewerCount] = useState(100);
  const [addingViewers, setAddingViewers] = useState(false);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('');

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('cybev_token');
  const headers = () => ({ Authorization: `Bearer ${getToken()}` });

  // ==========================================
  // Data fetching
  // ==========================================
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/fake-users/stats`, { headers: headers() });
      setStats(res.data.stats);
    } catch (err) {
      console.error('Stats error:', err);
    }
  }, []);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (searchQuery) params.set('search', searchQuery);
      if (filterCountry) params.set('country', filterCountry);
      
      const res = await axios.get(`${API_URL}/api/admin/fake-users/list?${params}`, { headers: headers() });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('List error:', err);
    }
  }, [searchQuery, filterCountry]);

  const fetchCountries = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/fake-users/countries`, { headers: headers() });
      setCountries(res.data.countries);
    } catch (err) {
      console.error('Countries error:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      // Check admin
      const userData = localStorage.getItem('user');
      if (userData) {
        const u = JSON.parse(userData);
        if (u.role !== 'admin' && !u.isAdmin) {
          router.push('/feed');
          return;
        }
      } else {
        router.push('/auth/login');
        return;
      }
      
      await Promise.all([fetchStats(), fetchUsers(), fetchCountries()]);
      setLoading(false);
    };
    init();
  }, []);

  // ==========================================
  // Actions
  // ==========================================
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API_URL}/api/admin/fake-users/generate`, {
        count: genCount,
        country: genCountry || null,
        daysBack: genDaysBack,
      }, { headers: headers() });
      
      toast.success(`Generated ${res.data.generated} users in ${res.data.elapsed}!`);
      fetchStats();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed');
    }
    setGenerating(false);
  };

  const handleSimulateEngagement = async () => {
    setSimulating(true);
    try {
      const res = await axios.post(`${API_URL}/api/admin/fake-users/simulate-engagement`, {
        action: engAction,
        targetType: engTargetType,
        count: engCount,
        targetId: engTargetId || null,
      }, { headers: headers() });
      
      toast.success(`${res.data.engaged} ${engAction}s simulated!`);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Simulation failed');
    }
    setSimulating(false);
  };

  const handleAddStreamViewers = async () => {
    if (!streamId) return toast.error('Enter a stream ID');
    setAddingViewers(true);
    try {
      const res = await axios.post(`${API_URL}/api/admin/fake-users/simulate-stream-viewers`, {
        streamId,
        viewerCount,
      }, { headers: headers() });
      
      toast.success(`Added ${res.data.addedViewers} viewers! Total: ${res.data.totalViewers}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add viewers');
    }
    setAddingViewers(false);
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure? This will delete ALL synthetic users!')) return;
    if (!confirm('REALLY sure? This cannot be undone!')) return;
    
    try {
      const res = await axios.delete(`${API_URL}/api/admin/fake-users/all`, {
        headers: headers(),
        data: { confirm: 'DELETE_ALL_SYNTHETIC' }
      });
      toast.success(`Deleted ${res.data.deleted} synthetic users`);
      fetchStats();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Synthetic Users — Admin | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <Bot className="w-6 h-6 text-purple-600" />
              <span className="font-bold text-xl text-gray-900">Synthetic Users</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Admin</span>
            </div>
            <button onClick={handleDeleteAll} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Bot} label="Synthetic Users" value={stats?.totalSynthetic || 0} color="bg-purple-500" />
            <StatCard icon={Users} label="Real Users" value={stats?.totalReal || 0} color="bg-blue-500" />
            <StatCard icon={TrendingUp} label="Ratio" value={`${stats?.ratio || 0}:1`} color="bg-green-500" subtitle="Synthetic:Real" />
            <StatCard icon={Zap} label="Last 24h" value={stats?.recentSynthetic || 0} color="bg-orange-500" subtitle="Generated" />
          </div>

          {/* Country Breakdown */}
          {stats?.countryBreakdown?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Country Distribution
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.countryBreakdown.map(c => (
                  <span key={c.country} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                    {c.country}: <strong>{c.count.toLocaleString()}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Controls Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Generate Users Panel */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                Generate Users
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Count</label>
                  <input
                    type="number"
                    value={genCount}
                    onChange={e => setGenCount(Number(e.target.value))}
                    min={1}
                    max={5000}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Country (empty = random)</label>
                  <select
                    value={genCountry}
                    onChange={e => setGenCountry(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Random (weighted)</option>
                    {countries.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.names} name combos)</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Account age spread (days)</label>
                  <select
                    value={genDaysBack}
                    onChange={e => setGenDaysBack(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                    <option value={180}>Last 6 months</option>
                    <option value={365}>Last 1 year</option>
                    <option value={730}>Last 2 years</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  {generating ? 'Generating...' : `Generate ${genCount} Users`}
                </button>
              </div>
            </div>

            {/* Engagement Simulation Panel */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Simulate Engagement
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Action</label>
                  <select
                    value={engAction}
                    onChange={e => setEngAction(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="like">❤️ Like / React</option>
                    <option value="comment">💬 Comment</option>
                    <option value="follow">👥 Follow Real Users</option>
                    <option value="view">👁️ View</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Count</label>
                  <input
                    type="number"
                    value={engCount}
                    onChange={e => setEngCount(Number(e.target.value))}
                    min={1}
                    max={500}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Target ID (empty = random posts)</label>
                  <input
                    type="text"
                    value={engTargetId}
                    onChange={e => setEngTargetId(e.target.value)}
                    placeholder="Post/Blog ID (optional)"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  onClick={handleSimulateEngagement}
                  disabled={simulating}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {simulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  {simulating ? 'Simulating...' : `Run ${engCount} ${engAction}s`}
                </button>
              </div>
            </div>

            {/* Stream / Watch Party Viewers Panel */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600" />
                Stream / Watch Party Viewers
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Stream or Watch Party ID</label>
                  <input
                    type="text"
                    value={streamId}
                    onChange={e => setStreamId(e.target.value)}
                    placeholder="Paste livestream or watch party ID"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Viewer Count</label>
                  <input
                    type="number"
                    value={viewerCount}
                    onChange={e => setViewerCount(Number(e.target.value))}
                    min={10}
                    max={100000}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Works with both livestreams and watch parties
                </div>

                <button
                  onClick={handleAddStreamViewers}
                  disabled={addingViewers || !streamId}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingViewers ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                  {addingViewers ? 'Adding...' : `Add ${viewerCount} Viewers`}
                </button>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Synthetic Users ({pagination.total.toLocaleString()})
              </h3>
              <button onClick={() => fetchUsers(pagination.page)} className="p-2 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchUsers(1)}
                  placeholder="Search by name, email, username..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <select
                value={filterCountry}
                onChange={e => { setFilterCountry(e.target.value); setTimeout(() => fetchUsers(1), 100); }}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Countries</option>
                {countries.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <button onClick={() => fetchUsers(1)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Search
              </button>
            </div>

            {/* User Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {users.map(user => (
                <div key={user._id} className="border border-gray-200 rounded-xl p-3 hover:border-purple-300 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 overflow-hidden flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {user.location?.split(',')[0] || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {user.followerCount || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No synthetic users yet. Generate some above!</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => fetchUsers(page)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      page === pagination.page
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {pagination.pages > 10 && <span className="text-gray-500">...</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable stat card
function StatCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
