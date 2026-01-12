// ============================================
// FILE: src/pages/studio/social/index.jsx
// Social Tools Dashboard - Facebook Automation
// VERSION: 1.0.0 - NEW FEATURE
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Users, MessageCircle, Heart, Search, BarChart3,
  Plus, Play, Pause, Loader2, Settings, Download,
  UserPlus, Send, ThumbsUp, Eye
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function SocialToolsDashboard() {
  const [activeTab, setActiveTab] = useState('scraping');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ friendRequests: 0, messagesSent: 0, postsLiked: 0, audience: 0 });
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'scraping', label: 'Data Scraping', icon: Search },
    { id: 'engagement', label: 'Auto Engagement', icon: Heart },
    { id: 'messaging', label: 'Messaging', icon: MessageCircle },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'audience', label: 'Audience Data', icon: BarChart3 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    try {
      const [accountsRes, jobsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/social-tools/accounts`, getAuth()),
        fetch(`${API_URL}/api/social-tools/jobs`, getAuth()),
        fetch(`${API_URL}/api/social-tools/stats`, getAuth()),
      ]);

      const accountsData = await accountsRes.json();
      const jobsData = await jobsRes.json();
      const statsData = await statsRes.json();

      if (accountsData.accounts) setAccounts(accountsData.accounts);
      if (jobsData.jobs) setJobs(jobsData.jobs);
      if (statsData.stats) setStats(statsData.stats);
      
      if (accountsData.accounts?.length > 0) {
        setSelectedAccount(accountsData.accounts[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const startJob = async (type, config) => {
    try {
      const res = await fetch(`${API_URL}/api/social-tools/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ accountId: selectedAccount, type, config })
      });
      const data = await res.json();
      if (data.job) {
        setJobs([data.job, ...jobs]);
        alert('Job started! Check the jobs list for status.');
      }
    } catch (err) {
      alert('Failed to start job');
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Social Tools - CYBEV Studio</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio" className="text-purple-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Studio
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Social Tools</h1>
            <p className="text-gray-600 dark:text-gray-400">Automate your social media presence</p>
          </div>
          
          <Link href="/studio/social/accounts">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage Accounts
            </button>
          </Link>
        </div>

        {/* Account Selector */}
        {accounts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Active Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.platform} - {acc.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">Friend Requests</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.friendRequests}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">Messages Sent</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.messagesSent}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <ThumbsUp className="w-5 h-5 text-pink-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">Posts Liked</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.postsLiked}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">Total Audience</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.audience}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No accounts connected</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add a social media account to start automating</p>
            <Link href="/studio/social/accounts">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                Add Account
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Tab Content */}
            {activeTab === 'scraping' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Scraping</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Extract data from groups, pages, and profiles</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => startJob('scrape_group_members', {})}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">Scrape Group Members</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Extract member data from Facebook groups</p>
                  </button>
                  <button
                    onClick={() => startJob('scrape_page_followers', {})}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">Scrape Page Followers</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get followers from public pages</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'engagement' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Auto Engagement</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Automatically like, comment, and interact with posts</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => startJob('auto_like', {})}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">Auto Like Posts</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically like posts in your feed</p>
                  </button>
                  <button
                    onClick={() => startJob('send_friend_requests', {})}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">Send Friend Requests</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Grow your network automatically</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'messaging' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Automated Messaging</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Send bulk messages to your audience</p>
                
                <div className="space-y-4">
                  <textarea
                    placeholder="Enter your message template..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={4}
                  />
                  <button
                    onClick={() => alert('Configure message template first')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Start Campaign
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Group Management</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Post to multiple groups automatically</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => startJob('post_to_groups', {})}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">Post to Groups</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Schedule posts across multiple groups</p>
                  </button>
                  <button
                    onClick={() => startJob('join_groups', {})}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">Auto Join Groups</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Join relevant groups automatically</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'audience' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audience Data</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">View and export your collected audience data</p>
                
                <div className="flex justify-end mb-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
                
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No audience data yet. Run a scraping job to collect data.
                </div>
              </div>
            )}

            {/* Recent Jobs */}
            {jobs.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Jobs</h3>
                <div className="space-y-3">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{job.type}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        job.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        job.status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
