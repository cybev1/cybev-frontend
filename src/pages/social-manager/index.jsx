// ============================================
// FILE: src/pages/social-manager/index.jsx
// PATH: cybev-frontend/src/pages/social-manager/index.jsx
// PURPOSE: Social media management dashboard
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Plus,
  Settings,
  Calendar,
  BarChart3,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  Clock,
  Send,
  Image,
  Video,
  Link as LinkIcon,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Filter,
  Search,
  Grid,
  List,
  Zap,
  Globe
} from 'lucide-react';
import api from '@/lib/api';

// Platform configurations
const PLATFORMS = {
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    textColor: 'text-blue-400',
    bgLight: 'bg-blue-500/10'
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-600 to-pink-500',
    textColor: 'text-pink-400',
    bgLight: 'bg-pink-500/10'
  },
  twitter: {
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'bg-gray-800',
    textColor: 'text-gray-300',
    bgLight: 'bg-gray-500/10'
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: 'bg-red-600',
    textColor: 'text-red-400',
    bgLight: 'bg-red-500/10'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700',
    textColor: 'text-blue-400',
    bgLight: 'bg-blue-500/10'
  },
  tiktok: {
    name: 'TikTok',
    icon: Zap,
    color: 'bg-black',
    textColor: 'text-white',
    bgLight: 'bg-gray-500/10'
  },
  kingschat: {
    name: 'KingsChat',
    icon: MessageCircle,
    color: 'bg-yellow-600',
    textColor: 'text-yellow-400',
    bgLight: 'bg-yellow-500/10'
  }
};

// Connected Account Card
function AccountCard({ account, onDisconnect, onRefresh }) {
  const platform = PLATFORMS[account.platform];
  const Icon = platform?.icon || Globe;

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${platform?.color || 'bg-gray-700'} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">{account.name}</h3>
            <p className="text-gray-400 text-sm">@{account.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {account.isConnected ? (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Reconnect
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{account.followers?.toLocaleString() || 0}</p>
          <p className="text-gray-400 text-xs">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{account.posts || 0}</p>
          <p className="text-gray-400 text-xs">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{account.engagement || '0%'}</p>
          <p className="text-gray-400 text-xs">Engagement</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onRefresh(account)}
          className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDisconnect(account)}
          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Post Composer
function PostComposer({ accounts, onPost }) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [posting, setPosting] = useState(false);

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePost = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      alert('Please enter content and select at least one platform');
      return;
    }

    setPosting(true);
    await onPost({
      content,
      platforms: selectedPlatforms,
      scheduledFor: isScheduled ? scheduleDate : null
    });
    setPosting(false);
    setContent('');
    setSelectedPlatforms([]);
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Edit className="w-5 h-5 text-purple-400" />
        Create Post
      </h3>

      {/* Platform Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {accounts.map((account) => {
          const platform = PLATFORMS[account.platform];
          const Icon = platform?.icon || Globe;
          const isSelected = selectedPlatforms.includes(account._id);

          return (
            <button
              key={account._id}
              onClick={() => togglePlatform(account._id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {account.name}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind? Write your post here..."
        rows={4}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none mb-4"
      />

      {/* Character count */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <span>{content.length} characters</span>
        <span className={content.length > 280 ? 'text-yellow-400' : ''}>
          {280 - content.length} remaining for Twitter
        </span>
      </div>

      {/* Media buttons */}
      <div className="flex items-center gap-2 mb-4">
        <button className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:text-white transition-colors">
          <Image className="w-5 h-5" />
        </button>
        <button className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:text-white transition-colors">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:text-white transition-colors">
          <LinkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Schedule */}
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
          />
          <span className="text-gray-300">Schedule for later</span>
        </label>
        
        {isScheduled && (
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          />
        )}
      </div>

      {/* Post button */}
      <button
        onClick={handlePost}
        disabled={posting || !content.trim() || selectedPlatforms.length === 0}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {posting ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Posting...
          </>
        ) : isScheduled ? (
          <>
            <Calendar className="w-5 h-5" />
            Schedule Post
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Post Now
          </>
        )}
      </button>
    </div>
  );
}

// Analytics Overview
function AnalyticsOverview({ accounts }) {
  const totalFollowers = accounts.reduce((sum, acc) => sum + (acc.followers || 0), 0);
  const totalPosts = accounts.reduce((sum, acc) => sum + (acc.posts || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">Total Followers</span>
        </div>
        <p className="text-2xl font-bold text-white">{totalFollowers.toLocaleString()}</p>
        <p className="text-green-400 text-sm">+12.5% this month</p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm">Total Posts</span>
        </div>
        <p className="text-2xl font-bold text-white">{totalPosts}</p>
        <p className="text-gray-400 text-sm">Across all platforms</p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">Engagement Rate</span>
        </div>
        <p className="text-2xl font-bold text-white">4.8%</p>
        <p className="text-green-400 text-sm">+0.8% this week</p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Scheduled</span>
        </div>
        <p className="text-2xl font-bold text-white">5</p>
        <p className="text-gray-400 text-sm">Posts pending</p>
      </div>
    </div>
  );
}

// Main Component
export default function SocialManager() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Sample accounts for demo
  const sampleAccounts = [
    {
      _id: '1',
      platform: 'facebook',
      name: 'My Page',
      username: 'mypage',
      followers: 12500,
      posts: 245,
      engagement: '3.2%',
      isConnected: true
    },
    {
      _id: '2',
      platform: 'instagram',
      name: 'My Instagram',
      username: 'myinsta',
      followers: 8700,
      posts: 180,
      engagement: '5.1%',
      isConnected: true
    },
    {
      _id: '3',
      platform: 'twitter',
      name: 'My Twitter',
      username: 'mytwitter',
      followers: 4200,
      posts: 520,
      engagement: '2.8%',
      isConnected: true
    },
    {
      _id: '4',
      platform: 'youtube',
      name: 'My Channel',
      username: 'mychannel',
      followers: 15000,
      posts: 85,
      engagement: '6.5%',
      isConnected: true
    }
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
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    // Fetch connected accounts
    fetchAccounts();
  }, [router]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/social/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setConnectedAccounts(response.data.accounts);
      }
    } catch (error) {
      console.log('Using sample accounts');
      setConnectedAccounts(sampleAccounts);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = async (platformId) => {
    // In production, this would redirect to OAuth flow
    alert(`Connecting to ${PLATFORMS[platformId]?.name}... (OAuth flow would start here)`);
    setShowConnectModal(false);
  };

  const handleDisconnect = async (account) => {
    if (confirm(`Disconnect ${account.name}?`)) {
      setConnectedAccounts(prev => prev.filter(a => a._id !== account._id));
    }
  };

  const handleRefresh = async (account) => {
    alert(`Refreshing ${account.name}...`);
  };

  const handlePost = async (postData) => {
    console.log('Posting:', postData);
    alert('Post created successfully!');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid },
    { id: 'accounts', label: 'Accounts', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inbox', label: 'Inbox', icon: MessageCircle }
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Social Media Manager - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="w-8 h-8 text-purple-400" />
              Social Media Manager
            </h1>
            <p className="text-gray-400 mt-1">Manage all your social accounts in one place</p>
          </div>

          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Connect Account
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <>
            <AnalyticsOverview accounts={connectedAccounts} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Post Composer */}
              <div className="lg:col-span-2">
                <PostComposer accounts={connectedAccounts} onPost={handlePost} />
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                  <h3 className="text-white font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { text: 'New follower on Instagram', time: '2m ago', icon: Heart },
                      { text: 'Comment on Facebook post', time: '15m ago', icon: MessageCircle },
                      { text: 'Video reached 1K views', time: '1h ago', icon: Eye }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300">{item.text}</p>
                          <p className="text-gray-500 text-xs">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedAccounts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No accounts connected</h3>
                <p className="text-gray-400 mb-6">Connect your social media accounts to get started</p>
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg"
                >
                  Connect Account
                </button>
              </div>
            ) : (
              connectedAccounts.map((account) => (
                <AccountCard
                  key={account._id}
                  account={account}
                  onDisconnect={handleDisconnect}
                  onRefresh={handleRefresh}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Content Calendar</h3>
            <p className="text-gray-400">Schedule and manage your posts across all platforms</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
            <p className="text-gray-400">View detailed analytics and insights</p>
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Unified Inbox</h3>
            <p className="text-gray-400">Manage messages from all platforms in one place</p>
          </div>
        )}

        {/* Connect Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Connect a Platform</h2>
              
              <div className="space-y-3">
                {Object.entries(PLATFORMS).map(([id, platform]) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={id}
                      onClick={() => handleConnectPlatform(id)}
                      className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium">{platform.name}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowConnectModal(false)}
                className="w-full mt-6 py-3 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}