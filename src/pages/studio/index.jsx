// ============================================
// FILE: src/pages/studio/index.jsx
// Enhanced Studio - Creative Hub
// VERSION: 2.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import {
  Plus,
  FileText,
  Video,
  Globe,
  Image,
  Sparkles,
  Radio,
  Calendar,
  BarChart3,
  Settings,
  ArrowRight,
  Loader2,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const QUICK_ACTIONS = [
  { 
    id: 'post', 
    label: 'Quick Post', 
    description: 'Share a thought or update',
    icon: FileText, 
    color: 'bg-blue-500',
    href: '/create'
  },
  { 
    id: 'blog', 
    label: 'Blog Article', 
    description: 'Write a long-form article',
    icon: FileText, 
    color: 'bg-purple-500',
    href: '/studio/sites'
  },
  { 
    id: 'vlog', 
    label: 'Video Post', 
    description: 'Upload a video',
    icon: Video, 
    color: 'bg-red-500',
    href: '/vlog/create'
  },
  { 
    id: 'website', 
    label: 'Create Website', 
    description: 'Build your own site',
    icon: Globe, 
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    href: '/studio/sites/new',
    featured: true
  },
  { 
    id: 'live', 
    label: 'Go Live', 
    description: 'Start streaming',
    icon: Radio, 
    color: 'bg-green-500',
    href: '/live/go-live'
  },
  { 
    id: 'nft', 
    label: 'Mint NFT', 
    description: 'Create digital collectible',
    icon: Image, 
    color: 'bg-orange-500',
    href: '/nft/create'
  }
];

export default function StudioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalPosts: 0,
    totalSites: 0,
    followers: 0
  });
  const [recentContent, setRecentContent] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch sites and stats in parallel
      const [sitesRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/api/sites`, { headers }).catch(() => ({ data: { sites: [] } })),
        axios.get(`${API_URL}/api/analytics/dashboard?period=30d`, { headers }).catch(() => ({ data: {} }))
      ]);

      setSites(sitesRes.data.sites || []);
      
      if (analyticsRes.data.dashboard) {
        const d = analyticsRes.data.dashboard.overview;
        setStats({
          totalViews: d.views?.current || 0,
          totalPosts: 0,
          totalSites: sitesRes.data.sites?.length || 0,
          followers: d.followers?.current || 0
        });
      }
    } catch (error) {
      console.error('Fetch studio data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Studio | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Creator Studio
                </h1>
                <p className="text-purple-100 mt-1">Your creative command center</p>
              </div>
              <Link
                href="/studio/sites/new"
                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition"
              >
                <Plus className="w-5 h-5" />
                New Website
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <div className="text-purple-200 text-sm">Total Views</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.totalSites}</div>
                <div className="text-purple-200 text-sm">Websites</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.followers.toLocaleString()}</div>
                <div className="text-purple-200 text-sm">Followers</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <Link href="/analytics" className="flex items-center gap-2 text-white hover:underline">
                  <BarChart3 className="w-5 h-5" />
                  View Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Something
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {QUICK_ACTIONS.map(action => (
                <Link
                  key={action.id}
                  href={action.href}
                  className={`relative p-4 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1 ${
                    action.featured
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-transparent'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {action.featured && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                  <action.icon className={`w-8 h-8 mb-2 ${
                    action.featured ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <div className={`font-medium ${
                    action.featured ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {action.label}
                  </div>
                  <div className={`text-xs mt-1 ${
                    action.featured ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {action.description}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* My Websites */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Websites
              </h2>
              <Link 
                href="/studio/sites"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {sites.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8 text-center">
                <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  No websites yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first website with our AI-powered builder
                </p>
                <Link
                  href="/studio/sites/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Website with AI
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sites.slice(0, 6).map(site => (
                  <div 
                    key={site._id}
                    className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-12 h-12 text-white/30" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          site.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {site.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {site.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {site.url}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-gray-700">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {site.stats?.views || 0} views
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/studio/sites/${site._id}`}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </Link>
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Create New Card */}
                <Link
                  href="/studio/sites/new"
                  className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 flex flex-col items-center justify-center text-center hover:border-purple-500 dark:hover:border-purple-500 transition"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Create New Website
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Build with AI or choose a template
                  </div>
                </Link>
              </div>
            )}
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              More Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/studio/ai-blog"
                className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 hover:shadow-lg transition flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">AI Content Generator</div>
                  <div className="text-sm text-gray-500">Generate blog posts with AI</div>
                </div>
              </Link>

              <Link
                href="/live/schedule"
                className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 hover:shadow-lg transition flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Schedule Stream</div>
                  <div className="text-sm text-gray-500">Plan your live streams</div>
                </div>
              </Link>

              <Link
                href="/analytics"
                className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 hover:shadow-lg transition flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Analytics</div>
                  <div className="text-sm text-gray-500">Track your performance</div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
