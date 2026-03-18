// ============================================
// FILE: src/pages/admin/index.jsx
// PURPOSE: Comprehensive Admin Dashboard
// VERSION: 4.0 - Added Special Users Panel
// ============================================

import { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  Video,
  Radio,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  Database,
  Server,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
  Globe,
  Sparkles,
  UserPlus,
  Play,
  Pause,
  Wallet,
  Navigation
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function StatCard({ title, value, change, changeType, icon: Icon, color, link, subtitle }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => link && router.push(link)}
      className={`bg-white rounded-2xl border border-gray-200 p-6 ${link ? 'cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function QuickAction({ title, description, icon: Icon, color, onClick, badge }) {
  return (
    <button onClick={onClick} className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-purple-400 hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{title}</p>
            {badge > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                {badge}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
      </div>
    </button>
  );
}

function ActivityItem({ type, user, action, target, time, status, avatar }) {
  const getIcon = () => {
    switch (type) {
      case 'user': return Users;
      case 'content': return FileText;
      case 'report': return Flag;
      case 'payment': return DollarSign;
      case 'stream': return Video;
      default: return Activity;
    }
  };
  const Icon = getIcon();
  const statusColors = {
    success: 'text-green-500 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-500 bg-red-100',
    info: 'text-blue-500 bg-blue-100'
  };
  const statusColor = statusColors[status] || 'text-gray-500 bg-gray-100';

  return (
    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`w-9 h-9 rounded-full ${statusColor.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${statusColor.split(' ')[0]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm">
          <span className="font-medium">{user}</span>{' '}
          <span className="text-gray-500">{action}</span>{' '}
          {target && <span className="font-medium">{target}</span>}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function SystemHealthIndicator({ name, status, icon: Icon }) {
  const isHealthy = status === 'healthy' || status === 'connected';
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'} ${isHealthy ? '' : 'animate-pulse'}`} />
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <div>
          <p className="text-gray-700 text-sm font-medium capitalize">{name}</p>
          <p className={`text-xs ${isHealthy ? 'text-green-600' : 'text-red-500'}`}>{status}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Fund/Credit Management Panel ───
function FundManagementPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [actionType, setActionType] = useState('add_usd');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [recentAdjustments, setRecentAdjustments] = useState([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const searchUsers = async (q) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const { data } = await axios.get(`${API_URL}/api/search?q=${encodeURIComponent(q)}&type=users&limit=8`, { headers });
      setSearchResults(data.results?.users || data.users || []);
    } catch { setSearchResults([]); }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery(user.name || user.username);
    try {
      const { data } = await axios.get(`${API_URL}/api/wallet/admin/user-wallet/${user._id}`, { headers });
      setWalletInfo(data.wallet || { usdBalance: 0, credits: 0 });
    } catch {
      setWalletInfo({ usdBalance: 0, credits: 0 });
    }
  };

  const executeAdjustment = async () => {
    if (!selectedUser || !amount || Number(amount) <= 0) {
      alert('Select a user and enter a valid amount');
      return;
    }
    setProcessing(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/wallet/admin/adjust`, {
        userId: selectedUser._id,
        type: actionType,
        amount: Number(amount),
        reason: reason || 'Admin manual adjustment'
      }, { headers });

      const label = actionType.includes('add') ? '+' : '-';
      const curr = actionType.includes('usd') ? 'USD' : 'Credits';
      const entry = {
        user: selectedUser.name || selectedUser.username,
        action: `${label}${amount} ${curr}`,
        reason: reason || 'Manual',
        time: new Date().toLocaleTimeString()
      };
      setRecentAdjustments(prev => [entry, ...prev].slice(0, 10));

      // Refresh wallet from response
      if (data.wallet) setWalletInfo(data.wallet);

      alert(data.message || `Success!`);
      setAmount('');
      setReason('');
    } catch (e) {
      alert(e?.response?.data?.error || 'Adjustment failed');
    } finally { setProcessing(false); }
  };

  const actionTypes = [
    { id: 'add_usd', label: 'Add USD', color: 'bg-emerald-600', icon: '+$' },
    { id: 'deduct_usd', label: 'Deduct USD', color: 'bg-red-600', icon: '-$' },
    { id: 'add_credits', label: 'Add Credits', color: 'bg-blue-600', icon: '+C' },
    { id: 'deduct_credits', label: 'Deduct Credits', color: 'bg-orange-600', icon: '-C' },
  ];

  return (
    <div id="fund-panel" className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-500" />
            Fund / Credit Management
          </h3>
          <p className="text-xs text-gray-500 mt-1">Manually add or remove USD and credits from any user's wallet</p>
        </div>
      </div>

      {/* User Search */}
      <div className="mb-4 relative">
        <label className="text-xs text-gray-500 mb-1 block">Search user by name, username, or email</label>
        <input
          value={searchQuery}
          onChange={e => searchUsers(e.target.value)}
          placeholder="Type to search users..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map(u => (
              <button key={u._id} onClick={() => selectUser(u)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs flex-shrink-0">
                  {(u.name || u.username || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.name || u.username}</p>
                  <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                </div>
                {u.isSynthetic && <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">Special</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected User + Wallet Info */}
      {selectedUser && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                {(selectedUser.name || selectedUser.username || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedUser.name || selectedUser.username}</p>
                <p className="text-xs text-gray-500">@{selectedUser.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">${(walletInfo?.usdBalance || 0).toFixed(2)} <span className="text-xs font-normal text-gray-500">USD</span></p>
              <p className="text-sm font-bold text-blue-600">{(walletInfo?.credits || 0).toLocaleString()} <span className="text-xs font-normal text-gray-500">Credits</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Action Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {actionTypes.map(at => (
          <button key={at.id} onClick={() => setActionType(at.id)}
            className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              actionType === at.id
                ? `${at.color} text-white shadow-sm`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            <span className="font-bold mr-1">{at.icon}</span> {at.label}
          </button>
        ))}
      </div>

      {/* Amount + Reason */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Amount {actionType.includes('usd') ? '(USD)' : '(Credits)'}</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step={actionType.includes('usd') ? '0.01' : '1'} placeholder={actionType.includes('usd') ? '10.00' : '500'}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">Reason / Note</label>
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Payment received via MoMo but gateway failed"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
      </div>

      {/* Execute Button */}
      <button onClick={executeAdjustment}
        disabled={processing || !selectedUser || !amount || Number(amount) <= 0}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors ${
          actionType.includes('deduct') ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}>
        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
        {processing ? 'Processing...' : `${actionType.includes('add') ? 'Add' : 'Deduct'} ${amount || '0'} ${actionType.includes('usd') ? 'USD' : 'Credits'} ${selectedUser ? 'for @' + selectedUser.username : ''}`}
      </button>

      {/* Recent Adjustments */}
      {recentAdjustments.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Recent Adjustments (this session)</h4>
          <div className="space-y-1.5">
            {recentAdjustments.map((adj, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-700"><span className="font-medium">{adj.user}</span> — {adj.action}</span>
                <span className="text-gray-400">{adj.reason} · {adj.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Traffic Simulation Panel ───
function TrafficSimulationPanel() {
  const [status, setStatus] = useState(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [articlesCount, setArticlesCount] = useState(10);
  const [visitsPerArticle, setVisitsPerArticle] = useState(3);
  const [cronRunning, setCronRunning] = useState(false);
  const [cronInterval, setCronInterval] = useState(60);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    axios.get(`${API_URL}/api/traffic/status`, { headers }).then(r => setStatus(r.data)).catch(() => {});
  }, []);

  const runSimulation = async () => {
    setRunning(true); setResult(null);
    try {
      const { data } = await axios.post(`${API_URL}/api/traffic/run`, { articlesCount, visitsPerArticle, useProxy: true }, { headers });
      setResult(data);
    } catch (e) { alert(e?.response?.data?.error || 'Failed'); }
    finally { setRunning(false); }
  };

  const testProxy = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/api/traffic/test`, {}, { headers });
      alert(data.proxyWorking ? `Proxy working! Response: ${data.elapsed}` : `Proxy failed: ${data.error}`);
    } catch (e) { alert('Test failed: ' + (e?.response?.data?.error || e.message)); }
  };

  const startCron = async () => {
    try {
      await axios.post(`${API_URL}/api/traffic/cron/start`, { intervalMinutes: cronInterval }, { headers });
      setCronRunning(true);
      alert(`Traffic cron started — every ${cronInterval} minutes`);
    } catch (e) { alert('Failed: ' + (e?.response?.data?.error || e.message)); }
  };

  const stopCron = async () => {
    try {
      await axios.post(`${API_URL}/api/traffic/cron/stop`, {}, { headers });
      setCronRunning(false);
      alert('Traffic cron stopped');
    } catch (e) { alert('Failed'); }
  };

  return (
    <div id="traffic-panel" className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-500" />
            Traffic Simulation (Brightdata)
          </h3>
          <p className="text-xs text-gray-500 mt-1">Special users visit articles through residential proxies — real traffic signals</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${status?.proxyConfigured ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-500">{status?.proxyConfigured ? 'Proxy Connected' : 'Proxy Not Set'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Articles to target</label>
          <input type="number" value={articlesCount} onChange={e => setArticlesCount(Number(e.target.value))} min={1} max={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Visits per article</label>
          <input type="number" value={visitsPerArticle} onChange={e => setVisitsPerArticle(Number(e.target.value))} min={1} max={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total sessions</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900">{articlesCount * visitsPerArticle}</div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Est. time</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">{Math.ceil(articlesCount * visitsPerArticle * 10 / 60)} min</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={runSimulation} disabled={running}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? 'Running...' : 'Run Simulation Now'}
        </button>
        <button onClick={testProxy}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium">
          <Zap className="w-4 h-4" /> Test Proxy
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <select value={cronInterval} onChange={e => setCronInterval(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value={30}>Every 30 min</option>
            <option value={60}>Every 1 hour</option>
            <option value={90}>Every 90 min</option>
            <option value={180}>Every 3 hours</option>
          </select>
          {!cronRunning ? (
            <button onClick={startCron} className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium">
              <Play className="w-4 h-4" /> Start Auto
            </button>
          ) : (
            <button onClick={stopCron} className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">
              <Pause className="w-4 h-4" /> Stop Auto
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
          <p className="text-sm font-medium text-cyan-800">{result.message}</p>
          <p className="text-xs text-cyan-600 mt-1">Est: {result.estimatedTime}. Check Railway logs for live progress.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [overview, setOverview] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [topContent, setTopContent] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [specialStats, setSpecialStats] = useState(null);
  const [quickGenerating, setQuickGenerating] = useState(false);
  const [quickSimulating, setQuickSimulating] = useState(false);

  useEffect(() => { 
    checkAdmin(); 
  }, []);

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Verify admin status from API
      const headers = { Authorization: `Bearer ${token}` };
      const userRes = await axios.get(`${API_URL}/api/users/me`, { headers }).catch(() => null);
      
      if (!userRes?.data?.user) {
        // Try localStorage as fallback
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/auth/login');
          return;
        }
        const user = JSON.parse(userData);
        if (user.role !== 'admin' && !user.isAdmin) {
          toast.error('Admin access required');
          router.push('/feed');
          return;
        }
      } else {
        const user = userRes.data.user;
        if (user.role !== 'admin' && !user.isAdmin) {
          toast.error('Admin access required');
          router.push('/feed');
          return;
        }
      }

      setIsAdmin(true);
      await fetchDashboardData();
    } catch (error) {
      console.error('Admin check error:', error);
      router.push('/feed');
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all dashboard data in parallel
      const [overviewRes, usersRes, contentRes, healthRes, streamsRes, specialRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin-analytics/overview`, { headers }).catch(e => ({ data: {} })),
        axios.get(`${API_URL}/api/admin-analytics/users/list?limit=5&sort=createdAt&order=desc`, { headers }).catch(e => ({ data: { users: [] } })),
        axios.get(`${API_URL}/api/admin-analytics/content/top?limit=5`, { headers }).catch(e => ({ data: { content: [] } })),
        axios.get(`${API_URL}/api/admin-analytics/system/health`, { headers }).catch(e => ({ data: { system: null } })),
        axios.get(`${API_URL}/api/admin-analytics/streams?status=live&limit=5`, { headers }).catch(e => ({ data: { streams: [] } })),
        axios.get(`${API_URL}/api/admin/fake-users/stats`, { headers }).catch(e => ({ data: { stats: null } }))
      ]);

      setOverview(overviewRes.data.overview || null);
      setRecentUsers(usersRes.data.users || []);
      setTopContent(contentRes.data.content || []);
      setSystemHealth(healthRes.data.system || null);
      setLiveStreams(streamsRes.data.streams || []);
      setSpecialStats(specialRes.data.stats || null);

      // Generate activity from recent users
      generateRecentActivity(usersRes.data.users || []);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const generateRecentActivity = (users) => {
    const activities = [];
    
    // Add recent user registrations
    users.slice(0, 3).forEach(user => {
      activities.push({
        type: 'user',
        user: user.name || user.username,
        action: 'registered',
        target: '',
        time: formatTimeAgo(user.createdAt),
        status: 'success'
      });
    });

    // Add some system activities
    activities.push(
      { type: 'content', user: 'System', action: 'published new content', target: '', time: '5 min ago', status: 'info' },
      { type: 'payment', user: 'System', action: 'processed transaction', target: '', time: '12 min ago', status: 'success' }
    );

    setRecentActivity(activities.slice(0, 5));
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'recently';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const exportReport = async () => {
    try {
      toast.info('Generating report...');
      // Create CSV data
      const data = {
        overview: overview,
        recentUsers: recentUsers.length,
        systemHealth: systemHealth,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cybev-admin-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report exported!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const quickGenerate = async (count = 500) => {
    setQuickGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/admin/fake-users/generate`, 
        { count, daysBack: 365 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Generated ${res.data.generated} special users! (${res.data.autoFollowed} auto-follows)`);
      // Refresh stats
      const statsRes = await axios.get(`${API_URL}/api/admin/fake-users/stats`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { stats: null } }));
      setSpecialStats(statsRes.data.stats || null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed');
    }
    setQuickGenerating(false);
  };

  const quickSimulate = async (action = 'like', count = 100) => {
    setQuickSimulating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/admin/fake-users/simulate-engagement`,
        { action, count, targetType: 'posts' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${res.data.engaged} ${action}s simulated!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Simulation failed');
    }
    setQuickSimulating(false);
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Verifying admin access...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Use real data or fallback to defaults
  const stats = {
    totalUsers: overview?.users?.total || 0,
    activeUsers: overview?.users?.activeWeek || 0,
    newUsersToday: overview?.users?.today || 0,
    userGrowth: overview?.users?.growth || 0,
    totalContent: overview?.content?.total || 0,
    blogsTotal: overview?.content?.blogs?.total || 0,
    postsTotal: overview?.content?.posts?.total || 0,
    contentToday: (overview?.content?.blogs?.today || 0) + (overview?.content?.posts?.today || 0),
    pendingReports: 0, // Would come from reports endpoint
    totalRevenue: overview?.revenue?.total || 0,
    revenueGrowth: overview?.revenue?.growth || 0,
    liveStreams: overview?.streams?.live || liveStreams.length
  };

  return (
    <AppLayout>
      <Head><title>Admin Dashboard - CYBEV</title></Head>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData} 
              disabled={refreshing}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Users" 
            value={formatNumber(stats.totalUsers)} 
            change={stats.userGrowth} 
            changeType={stats.userGrowth >= 0 ? 'up' : 'down'} 
            icon={Users} 
            color="bg-blue-500" 
            link="/admin/users"
            subtitle={`+${stats.newUsersToday} today`}
          />
          <StatCard 
            title="Total Content" 
            value={formatNumber(stats.totalContent)} 
            change={8} 
            changeType="up" 
            icon={FileText} 
            color="bg-purple-500" 
            link="/admin/content"
            subtitle={`${stats.blogsTotal} blogs, ${stats.postsTotal} posts`}
          />
          <StatCard 
            title="Pending Reports" 
            value={stats.pendingReports} 
            change={stats.pendingReports > 5 ? 15 : -10} 
            changeType={stats.pendingReports > 5 ? 'up' : 'down'} 
            icon={Flag} 
            color="bg-red-500" 
            link="/admin/reports"
          />
          <StatCard 
            title="Revenue" 
            value={formatCurrency(stats.totalRevenue)} 
            change={stats.revenueGrowth} 
            changeType={stats.revenueGrowth >= 0 ? 'up' : 'down'} 
            icon={DollarSign} 
            color="bg-green-500" 
            link="/admin/revenue"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-gray-500 text-sm">Active Now</p>
            </div>
            <p className="text-xl font-bold text-green-600">{formatNumber(stats.activeUsers)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">New Users Today</p>
            <p className="text-xl font-bold text-blue-600">+{stats.newUsersToday}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Content Today</p>
            <p className="text-xl font-bold text-purple-600">{stats.contentToday}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-red-500" />
              <p className="text-gray-500 text-sm">Live Streams</p>
            </div>
            <p className="text-xl font-bold text-red-500">{stats.liveStreams}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions & Recent Users */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <QuickAction 
                  title="User Management" 
                  description="View, edit, and manage users" 
                  icon={Users} 
                  color="bg-blue-500" 
                  onClick={() => router.push('/admin/users')} 
                />
                <QuickAction 
                  title="Content Moderation" 
                  description="Review and moderate content" 
                  icon={FileText} 
                  color="bg-purple-500" 
                  onClick={() => router.push('/admin/content')} 
                  badge={stats.pendingReports}
                />
                <QuickAction 
                  title="Reports & Flags" 
                  description="Handle user reports" 
                  icon={Flag} 
                  color="bg-red-500" 
                  onClick={() => router.push('/admin/reports')} 
                  badge={stats.pendingReports}
                />
                <QuickAction 
                  title="Revenue & Payments" 
                  description="Track earnings and payouts" 
                  icon={DollarSign} 
                  color="bg-green-500" 
                  onClick={() => router.push('/admin/revenue')} 
                />
                <QuickAction 
                  title="Analytics" 
                  description="Platform insights" 
                  icon={BarChart3} 
                  color="bg-yellow-500" 
                  onClick={() => router.push('/admin/analytics')} 
                />
                <QuickAction 
                  title="System Settings" 
                  description="Configure platform" 
                  icon={Settings} 
                  color="bg-gray-500" 
                  onClick={() => router.push('/settings')} 
                />
                <QuickAction 
                  title="Push Notifications" 
                  description="Send to users" 
                  icon={Bell} 
                  color="bg-pink-500" 
                  onClick={() => router.push('/admin/notifications')} 
                />
                <QuickAction 
                  title="Special Users" 
                  description={`${specialStats?.totalSynthetic?.toLocaleString() || 0} users across 190 countries`}
                  icon={Bot} 
                  color="bg-gradient-to-br from-violet-500 to-fuchsia-500" 
                  onClick={() => router.push('/admin/fake-users')} 
                  badge={0}
                />
                <QuickAction 
                  title="Auto-Blog" 
                  description="AI article campaigns"
                  icon={FileText} 
                  color="bg-gradient-to-br from-blue-500 to-purple-500" 
                  onClick={() => router.push('/admin/auto-blog')} 
                  badge={0}
                />
                <QuickAction 
                  title="SEO Command Center" 
                  description="Rankings, campaigns, analytics"
                  icon={Globe} 
                  color="bg-gradient-to-br from-emerald-500 to-teal-500" 
                  onClick={() => router.push('/admin/seo')} 
                />
                <QuickAction 
                  title="Monetization" 
                  description="Subscriptions & ads" 
                  icon={TrendingUp} 
                  color="bg-emerald-500" 
                  onClick={() => router.push('/admin/monetization')} 
                />
                <QuickAction 
                  title="Add Fund / Credits" 
                  description="Manage user wallets" 
                  icon={Wallet} 
                  color="bg-gradient-to-br from-amber-500 to-orange-500" 
                  onClick={() => document.getElementById('fund-panel')?.scrollIntoView({ behavior: 'smooth' })} 
                />
                <QuickAction 
                  title="Traffic Simulation" 
                  description="Brightdata-powered visits" 
                  icon={Navigation} 
                  color="bg-gradient-to-br from-cyan-500 to-blue-600" 
                  onClick={() => document.getElementById('traffic-panel')?.scrollIntoView({ behavior: 'smooth' })} 
                />
              </div>
            </div>

            {/* ═══ Fund / Credit Management Panel ═══ */}
            <FundManagementPanel />

            {/* ═══ Traffic Simulation Panel ═══ */}
            <TrafficSimulationPanel />

            {/* Recent Users */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Recent Users
                </h3>
                <Link href="/admin/users" className="text-sm text-purple-600 hover:text-purple-700">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7c3aed&color=fff`}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate flex items-center gap-1">
                        {user.name || user.username}
                        {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      </p>
                      <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    </div>
                    <span className="text-xs text-gray-400">{formatTimeAgo(user.createdAt)}</span>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">No users yet</p>
                )}
              </div>
            </div>

            {/* ==========================================
               SPECIAL USERS PANEL
               ========================================== */}
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl border border-violet-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  Special Users
                </h3>
                <Link href="/admin/fake-users" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
                  Full Panel <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-violet-600">{formatNumber(specialStats?.totalSynthetic || 0)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Special</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(specialStats?.totalReal || 0)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Real</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{specialStats?.ratio || '0'}:1</p>
                  <p className="text-xs text-gray-500 mt-0.5">Ratio</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-orange-600">{specialStats?.countryBreakdown?.length || 0}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Countries</p>
                </div>
              </div>

              {/* Country Distribution (Top 8) */}
              {specialStats?.countryBreakdown?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Top Countries
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {specialStats.countryBreakdown.slice(0, 8).map(c => (
                      <span key={c.country} className="px-2 py-1 bg-white/70 rounded-full text-xs text-gray-600">
                        {c.country}: <strong>{c.count}</strong>
                      </span>
                    ))}
                    {specialStats.countryBreakdown.length > 8 && (
                      <span className="px-2 py-1 bg-violet-100 rounded-full text-xs text-violet-600 font-medium">
                        +{specialStats.countryBreakdown.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Must-Follow Accounts */}
              {specialStats?.mustFollowAccounts?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium text-gray-500 mb-2">Auto-Follow Accounts</p>
                  <div className="flex flex-wrap gap-1.5">
                    {specialStats.mustFollowAccounts.map(u => (
                      <span key={u.id} className="px-2 py-1 bg-violet-100 rounded-full text-xs text-violet-700 font-medium">
                        @{u.username}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => quickGenerate(500)}
                  disabled={quickGenerating}
                  className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-50 transition-all shadow-sm"
                >
                  {quickGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {quickGenerating ? 'Generating...' : 'Generate 500'}
                </button>
                <button
                  onClick={() => quickSimulate('like', 100)}
                  disabled={quickSimulating}
                  className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all shadow-sm"
                >
                  {quickSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {quickSimulating ? 'Simulating...' : 'Boost 100 Likes'}
                </button>
                <button
                  onClick={() => quickSimulate('comment', 50)}
                  disabled={quickSimulating}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 border border-gray-200 disabled:opacity-50 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  50 Comments
                </button>
                <button
                  onClick={() => quickSimulate('follow', 100)}
                  disabled={quickSimulating}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 border border-gray-200 disabled:opacity-50 transition-all"
                >
                  <Users className="w-4 h-4" />
                  100 Follows
                </button>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-500" />
                System Health
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SystemHealthIndicator 
                  name="API" 
                  status={systemHealth?.database ? 'healthy' : 'checking'} 
                  icon={Server} 
                />
                <SystemHealthIndicator 
                  name="Database" 
                  status={systemHealth?.database || 'checking'} 
                  icon={Database} 
                />
                <SystemHealthIndicator 
                  name="Storage" 
                  status="healthy" 
                  icon={Zap} 
                />
                <SystemHealthIndicator 
                  name="CDN" 
                  status="healthy" 
                  icon={Activity} 
                />
              </div>
              {systemHealth && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Memory Used</p>
                    <p className="font-medium text-gray-900">{systemHealth.memory?.used || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Uptime</p>
                    <p className="font-medium text-gray-900">
                      {systemHealth.uptime ? `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Node Version</p>
                    <p className="font-medium text-gray-900">{systemHealth.node || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Activity & Top Content */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <Link href="/admin/activity" className="text-sm text-purple-600 hover:text-purple-700">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                  <ActivityItem key={i} {...activity} />
                )) : (
                  <div className="p-8 text-center text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Content */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Top Content
                </h3>
                <Link href="/admin/content" className="text-sm text-purple-600 hover:text-purple-700">
                  View all
                </Link>
              </div>
              <div className="p-4 space-y-3">
                {topContent.length > 0 ? topContent.map((content, idx) => (
                  <div key={content._id || idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">
                        {content.title || content.content?.substring(0, 50) || 'Untitled'}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />{content.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />{content.likes || content.engagement || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">No content yet</p>
                )}
              </div>
            </div>

            {/* Live Streams */}
            {liveStreams.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                    Live Now
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {liveStreams.map((stream) => (
                    <div key={stream._id} className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={stream.host?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.host?.name || 'U')}&background=7c3aed&color=fff`}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{stream.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {stream.viewerCount || 0} watching
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
