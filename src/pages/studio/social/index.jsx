// ============================================
// FILE: index.jsx
// PATH: cybev-frontend/src/pages/studio/social/index.jsx
// PURPOSE: Facebook Engagement Studio - Complete Social Tools
// VERSION: 1.0.0
// GITHUB: https://github.com/cybev1/cybev-frontend
// FEATURES: Data Scraping, Auto Engagement, Messaging, Groups, Audience, Analytics
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Facebook, Instagram, Twitter, Linkedin, Youtube, TrendingUp,
  Users, Heart, MessageCircle, UserPlus, Send, Search, Filter,
  Settings, RefreshCw, Download, Upload, Trash2, Play, Pause,
  Plus, X, Check, AlertCircle, ChevronDown, ChevronRight,
  Globe, MapPin, Briefcase, GraduationCap, Clock, Zap,
  Database, Target, BarChart3, Activity, Eye, Share2
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const TABS = [
  { id: 'scraping', name: 'Data Scraping', icon: Database },
  { id: 'engagement', name: 'Auto Engagement', icon: Heart },
  { id: 'messages', name: 'Messaging', icon: MessageCircle },
  { id: 'groups', name: 'Groups', icon: Users },
  { id: 'audience', name: 'Audience Data', icon: Target },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 }
];

export default function SocialToolsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('scraping');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    friendRequestsSent: 0,
    messagesSent: 0,
    postsLiked: 0,
    totalAudience: 0
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    headlessMode: false,
    maxDelay: 5,
    maxActionsPerHour: 100,
    maxScrapeResults: 100000,
    windowSize: '1920x1080'
  });

  // Search/Filter state
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    searchType: 'people',
    location: '',
    maxResults: 100,
    friendsFilter: '',
    work: '',
    education: ''
  });

  // Scraping filters
  const [scrapingFilters, setScrapingFilters] = useState({
    enabled: true,
    location: '',
    connectionFilter: 'none',
    maxResults: 100,
    checkLimit: 200
  });

  // Scrape results
  const [scrapeResults, setScrapeResults] = useState([]);
  const [scrapeStatus, setScrapeStatus] = useState('');

  // Audience data
  const [audience, setAudience] = useState([]);
  const [audienceStats, setAudienceStats] = useState({ total: 0, bySource: [], byLocation: [] });

  // Automations
  const [automations, setAutomations] = useState([]);
  const [automationStats, setAutomationStats] = useState({});

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchAccounts();
    fetchStats();
    fetchAudience();
    fetchAutomations();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setAccounts(data.accounts || []);
        if (data.accounts?.length > 0) {
          setSelectedAccount(data.accounts[0]);
        }
      }
    } catch (err) {
      console.error('Fetch accounts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setStats(data.stats);
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const fetchAudience = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/audience?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setAudience(data.audience || []);
        setAudienceStats({ total: data.total });
      }
    } catch (err) {
      console.error('Fetch audience error:', err);
    }
  };

  const fetchAutomations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/automations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setAutomations(data.automations || []);

      const statsRes = await fetch(`${API}/api/social/automations/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.ok) setAutomationStats(statsData.stats);
    } catch (err) {
      console.error('Fetch automations error:', err);
    }
  };

  const saveSettings = async () => {
    if (!selectedAccount) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/api/social/accounts/${selectedAccount._id}/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert('Settings saved!');
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  const loginToFacebook = async () => {
    if (!selectedAccount) return;
    // In production, this would open a popup or redirect for cookie capture
    alert('Login feature requires browser extension or manual cookie input. Check documentation.');
  };

  const refreshEntities = async () => {
    if (!selectedAccount) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API}/api/social/accounts/${selectedAccount._id}/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Refresh queued!');
      fetchAccounts();
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  // Advanced Search
  const advancedSearch = async (saveToAudience = false) => {
    if (!selectedAccount) {
      alert('Please select an account first');
      return;
    }

    setScrapeStatus('Searching...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/scrape/search`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: selectedAccount._id,
          ...searchFilters,
          filters: scrapingFilters.enabled ? scrapingFilters : null,
          saveToAudience
        })
      });
      const data = await res.json();
      if (data.ok) {
        setScrapeStatus(`Search queued: ${data.jobId}`);
      } else {
        setScrapeStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setScrapeStatus(`Error: ${err.message}`);
    }
  };

  // Scrape functions
  const scrapeMyFollowers = async () => {
    if (!selectedAccount) return;
    setScrapeStatus('Scraping followers...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/scrape/my-connections`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: selectedAccount._id,
          type: 'followers',
          maxResults: scrapingFilters.maxResults,
          filters: scrapingFilters.enabled ? scrapingFilters : null
        })
      });
      const data = await res.json();
      setScrapeStatus(data.ok ? `Queued: ${data.jobId}` : `Error: ${data.error}`);
    } catch (err) {
      setScrapeStatus(`Error: ${err.message}`);
    }
  };

  const scrapeMyFriends = async () => {
    if (!selectedAccount) return;
    setScrapeStatus('Scraping friends...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/scrape/my-connections`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: selectedAccount._id,
          type: 'friends',
          maxResults: scrapingFilters.maxResults,
          filters: scrapingFilters.enabled ? scrapingFilters : null
        })
      });
      const data = await res.json();
      setScrapeStatus(data.ok ? `Queued: ${data.jobId}` : `Error: ${data.error}`);
    } catch (err) {
      setScrapeStatus(`Error: ${err.message}`);
    }
  };

  const scrapeSuggestions = async () => {
    if (!selectedAccount) return;
    setScrapeStatus('Scraping suggestions...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/scrape/suggestions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: selectedAccount._id,
          maxResults: scrapingFilters.maxResults,
          filters: scrapingFilters.enabled ? scrapingFilters : null
        })
      });
      const data = await res.json();
      setScrapeStatus(data.ok ? `Queued: ${data.jobId}` : `Error: ${data.error}`);
    } catch (err) {
      setScrapeStatus(`Error: ${err.message}`);
    }
  };

  const exportAudience = async () => {
    try {
      const token = localStorage.getItem('token');
      window.open(`${API}/api/social/audience/export?token=${token}`, '_blank');
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Social Tools | CYBEV Studio</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Facebook Engagement Studio</h1>
                <p className="text-gray-400 text-sm">Advanced social media automation tools</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedAccount?.status === 'active' ? (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online - {selectedAccount.email || selectedAccount.accountName}
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                  Offline
                </span>
              )}
              <button
                onClick={loginToFacebook}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Login to Facebook
              </button>
            </div>
          </div>

          {/* Anti-Detection Controls */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Headless Mode</label>
                <button
                  onClick={() => setSettings(s => ({ ...s, headlessMode: !s.headlessMode }))}
                  className={`w-12 h-6 rounded-full transition ${settings.headlessMode ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.headlessMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Delay (1-X sec)</label>
                <input
                  type="number"
                  value={settings.maxDelay}
                  onChange={(e) => setSettings(s => ({ ...s, maxDelay: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Actions/Hour</label>
                <input
                  type="number"
                  value={settings.maxActionsPerHour}
                  onChange={(e) => setSettings(s => ({ ...s, maxActionsPerHour: parseInt(e.target.value) || 100 }))}
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Scrape Results</label>
                <input
                  type="number"
                  value={settings.maxScrapeResults}
                  onChange={(e) => setSettings(s => ({ ...s, maxScrapeResults: parseInt(e.target.value) || 100000 }))}
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Window Size</label>
                <select
                  value={settings.windowSize}
                  onChange={(e) => setSettings(s => ({ ...s, windowSize: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-gray-800 border border-white/20 rounded-lg text-white text-sm"
                >
                  <option value="1920x1080">1920x1080</option>
                  <option value="1366x768">1366x768</option>
                  <option value="1280x720">1280x720</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={saveSettings}
                  className="w-full px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={UserPlus}
              label="Friend Requests Sent"
              value={stats.friendRequestsSent}
              color="purple"
            />
            <StatCard
              icon={Send}
              label="Messages Sent"
              value={stats.messagesSent}
              color="blue"
            />
            <StatCard
              icon={Heart}
              label="Posts Liked"
              value={stats.postsLiked}
              color="pink"
            />
            <StatCard
              icon={Database}
              label="Total Audience"
              value={stats.totalAudience || audienceStats.total}
              color="green"
            />
          </div>

          {/* My Accounts & Entities */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-yellow-400" />
                My Accounts & Entities
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshEntities}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Entities
                </button>
                <span className="text-gray-400 text-sm">
                  {selectedAccount?.pages?.length || 0} pages, {selectedAccount?.groups?.length || 0} groups
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Active Entity (for actions)</label>
              <select
                value={selectedAccount?._id || ''}
                onChange={(e) => {
                  const acc = accounts.find(a => a._id === e.target.value);
                  setSelectedAccount(acc);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white"
              >
                <option value="">Select account...</option>
                {accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountName} ({acc.platform})
                  </option>
                ))}
              </select>
            </div>

            {/* Pages */}
            {selectedAccount?.pages?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  My Pages ({selectedAccount.pages.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-left">
                        <th className="pb-2">Page Name</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">Followers</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAccount.pages.map((page, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td className="py-2 text-blue-400">{page.name}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                              {page.role}
                            </span>
                          </td>
                          <td className="py-2 text-gray-300">{page.followers || 'N/A'}</td>
                          <td className="py-2">
                            <button className="text-gray-400 hover:text-white text-xs">Use</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2 bg-white/5 backdrop-blur rounded-xl p-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'scraping' && (
            <div className="space-y-4">
              {/* Advanced Search */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-400" />
                  Advanced Search & Geo-Targeting
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Search Facebook with filters - find people, pages, groups by location, interests, and more.
                  <strong className="text-white"> Search Query is optional</strong> - you can search by location only!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Search Query (optional)</label>
                    <input
                      type="text"
                      value={searchFilters.query}
                      onChange={(e) => setSearchFilters(f => ({ ...f, query: e.target.value }))}
                      placeholder="Leave empty to search by location only"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <small className="text-gray-500">Keywords like "realtor", "pastor", etc.</small>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Search Type</label>
                    <select
                      value={searchFilters.searchType}
                      onChange={(e) => setSearchFilters(f => ({ ...f, searchType: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white text-sm"
                    >
                      <option value="people">👤 People</option>
                      <option value="all">All Results</option>
                      <option value="pages">📄 Pages</option>
                      <option value="groups">👥 Groups</option>
                      <option value="events">📅 Events</option>
                      <option value="reels">🎬 Reels</option>
                      <option value="marketplace">🛒 Marketplace</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">📍 Location (City/Country)</label>
                    <input
                      type="text"
                      value={searchFilters.location}
                      onChange={(e) => setSearchFilters(f => ({ ...f, location: e.target.value }))}
                      placeholder="e.g., Houston, Texas"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <small className="text-gray-500">Primary filter - where to search</small>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Max Results</label>
                    <input
                      type="number"
                      value={searchFilters.maxResults}
                      onChange={(e) => setSearchFilters(f => ({ ...f, maxResults: parseInt(e.target.value) || 100 }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Friends Filter</label>
                    <select
                      value={searchFilters.friendsFilter}
                      onChange={(e) => setSearchFilters(f => ({ ...f, friendsFilter: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white text-sm"
                    >
                      <option value="">Any</option>
                      <option value="friends_of_friends">Friends of Friends</option>
                      <option value="not_friends">Not Friends</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Work</label>
                    <input
                      type="text"
                      value={searchFilters.work}
                      onChange={(e) => setSearchFilters(f => ({ ...f, work: e.target.value }))}
                      placeholder="e.g., Google"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Education</label>
                    <input
                      type="text"
                      value={searchFilters.education}
                      onChange={(e) => setSearchFilters(f => ({ ...f, education: e.target.value }))}
                      placeholder="e.g., MIT"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => advancedSearch(false)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                  >
                    🔍 Search
                  </button>
                  <button
                    onClick={() => advancedSearch(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                  >
                    🔍 Search & Save to Audience
                  </button>
                  <button
                    onClick={() => setSearchFilters({ query: '', searchType: 'people', location: '', maxResults: 100, friendsFilter: '', work: '', education: '' })}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>

                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <small className="text-yellow-400">
                    💡 <strong>Tip:</strong> For best results when searching by location only, set Search Type to "People" and enter a specific city/state.
                  </small>
                </div>
              </div>

              {/* Scraping Filters */}
              <div className="bg-white/5 backdrop-blur border-2 border-purple-500/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    🎛️ Scraping Filters (Apply to All Below)
                  </h3>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scrapingFilters.enabled}
                        onChange={(e) => setScrapingFilters(f => ({ ...f, enabled: e.target.checked }))}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-gray-300 text-sm">Enable Filters</span>
                    </label>
                    <button
                      onClick={() => setScrapingFilters({ enabled: true, location: '', connectionFilter: 'none', maxResults: 100, checkLimit: 200 })}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">📍 Location Filter</label>
                    <input
                      type="text"
                      value={scrapingFilters.location}
                      onChange={(e) => setScrapingFilters(f => ({ ...f, location: e.target.value }))}
                      placeholder="e.g., Houston, Texas"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <small className="text-gray-500">Only save profiles from this location</small>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">🎯 Connection Filter</label>
                    <select
                      value={scrapingFilters.connectionFilter}
                      onChange={(e) => setScrapingFilters(f => ({ ...f, connectionFilter: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white text-sm"
                    >
                      <option value="none">No Filter (All Results)</option>
                      <option value="followers">My Followers Only</option>
                      <option value="friends">My Friends Only</option>
                      <option value="both">Followers OR Friends</option>
                      <option value="mutual">Mutual (Following & Friends)</option>
                    </select>
                    <small className="text-gray-500">Filter by your connections</small>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">🔢 Max Results</label>
                    <input
                      type="number"
                      value={scrapingFilters.maxResults}
                      onChange={(e) => setScrapingFilters(f => ({ ...f, maxResults: parseInt(e.target.value) || 100 }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <small className="text-gray-500">Maximum profiles to save</small>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">🔍 Check Limit</label>
                    <input
                      type="number"
                      value={scrapingFilters.checkLimit}
                      onChange={(e) => setScrapingFilters(f => ({ ...f, checkLimit: parseInt(e.target.value) || 200 }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <small className="text-gray-500">Profiles to scan for filtering</small>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <small className="text-purple-300">
                    💡 <strong>How filters work:</strong> When enabled, all scraping actions below will apply your location and connection filters. Profiles not matching will be skipped. Leave Location empty to skip location filtering.
                  </small>
                </div>
              </div>

              {/* Quick Scrape My Connections */}
              <div className="bg-white/5 backdrop-blur border-2 border-green-500/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  ⚡ Quick Scrape My Connections
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Quickly scrape all your followers or friends (filters above still apply)
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={scrapeMyFollowers}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                  >
                    📥 Scrape All My Followers
                  </button>
                  <button
                    onClick={scrapeMyFriends}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    👫 Scrape All My Friends
                  </button>
                </div>
                {scrapeStatus && (
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <span className="text-blue-300 text-sm">{scrapeStatus}</span>
                  </div>
                )}
              </div>

              {/* Scraping Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ScrapeCard
                  title="📊 Scrape Page/Profile Followers"
                  description="Scrape followers from any page or profile"
                  inputLabel="Page/Profile URL"
                  inputPlaceholder="https://www.facebook.com/PageName"
                  buttonText="Scrape Followers"
                  onSubmit={(url) => {
                    // Handle scrape followers
                    console.log('Scrape followers:', url);
                  }}
                />
                <ScrapeCard
                  title="🎯 Scrape Friend Suggestions"
                  description='Get "People You May Know" - great for new connections!'
                  buttonText="Scrape Suggestions"
                  onSubmit={scrapeSuggestions}
                />
                <ScrapeCard
                  title="👀 Scrape Post Engagers"
                  description="Get people who liked, commented, or shared a post"
                  inputLabel="Post URL"
                  inputPlaceholder="https://facebook.com/..."
                  buttonText="Scrape Engagers"
                  onSubmit={(url) => console.log('Scrape engagers:', url)}
                />
                <ScrapeCard
                  title="👥 Scrape Group Members"
                  description="Get members from a Facebook group"
                  inputLabel="Group URL"
                  inputPlaceholder="https://facebook.com/groups/..."
                  buttonText="Scrape Members"
                  onSubmit={(url) => console.log('Scrape group:', url)}
                />
              </div>
            </div>
          )}

          {activeTab === 'engagement' && (
            <AutoEngagementTab
              automations={automations}
              stats={automationStats}
              selectedAccount={selectedAccount}
              onRefresh={fetchAutomations}
            />
          )}

          {activeTab === 'messages' && (
            <MessagingTab selectedAccount={selectedAccount} audience={audience} />
          )}

          {activeTab === 'groups' && (
            <GroupsTab selectedAccount={selectedAccount} />
          )}

          {activeTab === 'audience' && (
            <AudienceTab
              audience={audience}
              stats={audienceStats}
              onExport={exportAudience}
              onRefresh={fetchAudience}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab selectedAccount={selectedAccount} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    pink: 'from-pink-500 to-pink-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  );
}

// Scrape Card Component
function ScrapeCard({ title, description, inputLabel, inputPlaceholder, buttonText, onSubmit }) {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = () => {
    if (inputLabel && !inputValue) {
      setStatus('Please enter a URL');
      return;
    }
    setStatus('Processing...');
    onSubmit(inputValue);
  };

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      {inputLabel && (
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">{inputLabel}</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          />
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
      >
        {buttonText}
      </button>
      {status && (
        <p className="mt-2 text-green-400 text-xs">{status}</p>
      )}
    </div>
  );
}

// Auto Engagement Tab
function AutoEngagementTab({ automations, stats, selectedAccount, onRefresh }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.actionsToday || 0}</p>
          <p className="text-gray-400 text-sm">Actions Today</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-pink-400">{stats.likesToday || 0}</p>
          <p className="text-gray-400 text-sm">Likes Sent</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.commentsToday || 0}</p>
          <p className="text-gray-400 text-sm">Comments</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.followsToday || 0}</p>
          <p className="text-gray-400 text-sm">New Follows</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.friendRequestsToday || 0}</p>
          <p className="text-gray-400 text-sm">Friend Requests</p>
        </div>
      </div>

      {/* Automations List */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Active Automations</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
          >
            + Create Automation
          </button>
        </div>

        {automations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No automations yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {automations.map(auto => (
              <div key={auto._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{auto.name}</p>
                  <p className="text-gray-400 text-sm">{auto.type} • {auto.stats?.executed || 0} executed</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${auto.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {auto.enabled ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rate Limits Warning */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            <strong>⚠️ Rate Limits:</strong> 30 likes/hour, 20 comments/hour, 50 follows/day, 15 messages/hour
          </p>
        </div>
      </div>
    </div>
  );
}

// Messaging Tab
function MessagingTab({ selectedAccount, audience }) {
  const [message, setMessage] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">Send Messages</h3>
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Message Template</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi {name}, I came across your profile and..."
            rows={4}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          />
          <small className="text-gray-500">Use {'{name}'} for personalization</small>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
            Send to Selected ({selectedProfiles.length})
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
            Send to All Audience
          </button>
        </div>
      </div>
    </div>
  );
}

// Groups Tab
function GroupsTab({ selectedAccount }) {
  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">Group Management</h3>
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Group URL to Join</label>
          <input
            type="text"
            placeholder="https://facebook.com/groups/..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          />
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
          Join Group
        </button>
      </div>

      {selectedAccount?.groups?.length > 0 && (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">My Groups ({selectedAccount.groups.length})</h3>
          <div className="space-y-2">
            {selectedAccount.groups.map((group, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white">{group.name}</p>
                  <p className="text-gray-400 text-sm">{group.members} members</p>
                </div>
                <button className="text-purple-400 text-sm hover:underline">Post</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Audience Tab
function AudienceTab({ audience, stats, onExport, onRefresh }) {
  const [search, setSearch] = useState('');

  const filtered = audience.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audience..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-semibold">Total Audience: {stats.total?.toLocaleString() || 0}</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filtered.map((person, i) => (
            <div key={i} className="flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  {person.avatar ? (
                    <img src={person.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-white">{person.name || 'Unknown'}</p>
                  <p className="text-gray-400 text-xs">
                    {person.location || 'No location'} • {person.source}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded">
                  <UserPlus className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Analytics Tab
function AnalyticsTab({ selectedAccount }) {
  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">📈 Post Engagement Analytics</h3>
        <p className="text-gray-400 text-sm mb-4">
          Find posts with the most engagement (reactions, comments, shares) from a page or profile
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Page/Profile URL</label>
            <input
              type="text"
              placeholder="https://facebook.com/PageName"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Time Period</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white text-sm">
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
              Analyze Posts
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-medium mb-4">Engagement Overview</h4>
          <div className="h-48 flex items-center justify-center text-gray-500">
            Chart coming soon...
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-medium mb-4">Top Performing Posts</h4>
          <div className="h-48 flex items-center justify-center text-gray-500">
            Run analysis to see results
          </div>
        </div>
      </div>
    </div>
  );
}
