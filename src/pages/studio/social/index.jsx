// ============================================
// FILE: src/pages/studio/social/index.jsx
// PURPOSE: Social Media Command Center Dashboard
// Mobile-first design
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  Plus, Settings, BarChart3, Calendar, Users, MessageSquare,
  Heart, Share2, Clock, AlertCircle, CheckCircle, Zap,
  RefreshCw, Send, Bot, TrendingUp, ChevronRight, MoreVertical,
  PlusCircle, Link as LinkIcon, Eye, ThumbsUp, MessageCircle
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', bgColor: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F', bgColor: 'bg-pink-600' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#000000', bgColor: 'bg-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', bgColor: 'bg-blue-700' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000', bgColor: 'bg-red-600' }
];

export default function SocialDashboard() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [accountsRes, statsRes, activityRes, scheduledRes] = await Promise.all([
        fetch(`${API}/api/social/accounts`, { headers }),
        fetch(`${API}/api/social/stats`, { headers }),
        fetch(`${API}/api/social/activity?limit=10`, { headers }),
        fetch(`${API}/api/social/posts/scheduled?limit=5`, { headers })
      ]);

      const [accountsData, statsData, activityData, scheduledData] = await Promise.all([
        accountsRes.json(),
        statsRes.json(),
        activityRes.json(),
        scheduledRes.json()
      ]);

      if (accountsData.ok) setAccounts(accountsData.accounts || []);
      if (statsData.ok) setStats(statsData.stats);
      if (activityData.ok) setRecentActivity(activityData.activity || []);
      if (scheduledData.ok) setScheduledPosts(scheduledData.posts || []);

    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformConfig = (platformId) => {
    return PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Social Media Command Center | CYBEV Studio</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-7 h-7 text-purple-600" />
              Social Command Center
            </h1>
            <p className="text-gray-500 text-sm">Manage all your social accounts in one place</p>
          </div>
          <Link
            href="/studio/social/accounts/connect"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Connect Account</span>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Total Followers"
            value={formatNumber(stats?.totalFollowers || 0)}
            change={stats?.followersChange}
            color="purple"
          />
          <StatCard
            icon={Heart}
            label="Engagements"
            value={formatNumber(stats?.totalEngagements || 0)}
            change={stats?.engagementsChange}
            color="pink"
          />
          <StatCard
            icon={Eye}
            label="Impressions"
            value={formatNumber(stats?.totalImpressions || 0)}
            change={stats?.impressionsChange}
            color="blue"
          />
          <StatCard
            icon={Calendar}
            label="Scheduled"
            value={scheduledPosts.length}
            color="green"
          />
        </div>

        {/* Connected Accounts */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connected Accounts
            </h2>
            <Link href="/studio/social/accounts" className="text-sm text-purple-600 hover:underline">
              Manage →
            </Link>
          </div>

          {accounts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Connect Your First Account
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Start by connecting your social media accounts to manage them all from here
              </p>
              <Link
                href="/studio/social/accounts/connect"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
              >
                <Plus className="w-4 h-4" />
                Connect Account
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map(account => {
                const platform = getPlatformConfig(account.platform);
                return (
                  <div
                    key={account._id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${platform.bgColor} rounded-full flex items-center justify-center`}>
                        <platform.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {account.accountName}
                        </p>
                        <p className="text-xs text-gray-500">{platform.name}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        account.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {formatNumber(account.stats?.followers || 0)} followers
                      </span>
                      <Link
                        href={`/studio/social/accounts/${account._id}`}
                        className="text-purple-600 hover:underline"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                );
              })}
              
              {/* Add Account Card */}
              <Link
                href="/studio/social/accounts/connect"
                className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 transition"
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Account</span>
              </Link>
            </div>
          )}
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionCard
              icon={Send}
              title="Create Post"
              description="Post to multiple platforms"
              href="/studio/social/compose"
              color="purple"
            />
            <ActionCard
              icon={Calendar}
              title="Schedule"
              description="Plan your content"
              href="/studio/social/scheduler"
              color="blue"
            />
            <ActionCard
              icon={Bot}
              title="Automation"
              description="Set up auto-actions"
              href="/studio/social/automation"
              color="green"
            />
            <ActionCard
              icon={BarChart3}
              title="Analytics"
              description="View performance"
              href="/studio/social/analytics"
              color="orange"
            />
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scheduled Posts */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Scheduled Posts
              </h2>
              <Link href="/studio/social/scheduler" className="text-sm text-purple-600 hover:underline">
                View all →
              </Link>
            </div>

            {scheduledPosts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No scheduled posts</p>
                <Link
                  href="/studio/social/compose"
                  className="text-purple-600 text-sm hover:underline mt-2 inline-block"
                >
                  Create your first post →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPosts.map(post => (
                  <ScheduledPostCard key={post._id} post={post} platforms={PLATFORMS} />
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                Recent Activity
              </h2>
              <Link href="/studio/social/activity" className="text-sm text-purple-600 hover:underline">
                View all →
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <RefreshCw className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                {recentActivity.map((activity, i) => (
                  <ActivityItem key={i} activity={activity} platforms={PLATFORMS} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Pro Features Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">🚀 Social Media Pro Features</h3>
              <ul className="text-sm text-white/90 space-y-1">
                <li>• Auto-engage with your audience</li>
                <li>• AI-powered content suggestions</li>
                <li>• Competitor analysis & tracking</li>
                <li>• Advanced analytics & reports</li>
              </ul>
            </div>
            <Link
              href="/studio/social/automation"
              className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm hover:bg-gray-100"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper Components
function StatCard({ icon: Icon, label, value, change, color }) {
  const colorClasses = {
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-gray-500">{label}</p>
        {change !== undefined && (
          <span className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, href, color }) {
  const colorClasses = {
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
  };

  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition group"
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition">
        {title}
      </h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </Link>
  );
}

function ScheduledPostCard({ post, platforms }) {
  const platform = platforms.find(p => post.platforms?.includes(p.id));
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className="flex -space-x-1">
          {post.platforms?.slice(0, 3).map(p => {
            const plt = platforms.find(pl => pl.id === p);
            if (!plt) return null;
            return (
              <div key={p} className={`w-7 h-7 ${plt.bgColor} rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800`}>
                <plt.icon className="w-3.5 h-3.5 text-white" />
              </div>
            );
          })}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
            {post.content?.text?.slice(0, 100)}...
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(post.scheduledFor).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity, platforms }) {
  const platform = platforms.find(p => p.id === activity.platform);
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'post_published': return Send;
      case 'like_received': return Heart;
      case 'comment_received': return MessageCircle;
      case 'follow_received': return Users;
      default: return RefreshCw;
    }
  };

  const Icon = getActivityIcon(activity.type);

  return (
    <div className="flex items-center gap-3 p-3">
      <div className={`w-8 h-8 ${platform?.bgColor || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
        {platform?.icon && <platform.icon className="w-4 h-4 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white truncate">
          {activity.message}
        </p>
        <p className="text-xs text-gray-500">
          {formatTimeAgo(activity.timestamp)}
        </p>
      </div>
      <Icon className="w-4 h-4 text-gray-400" />
    </div>
  );
}

// Utility functions
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
