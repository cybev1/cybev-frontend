// ============================================
// FILE: src/pages/studio/index.jsx
// Studio Dashboard - Shows user's sites & content
// VERSION: 6.4.2
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Globe, Plus, Settings, Eye, Trash2, ExternalLink, Loader2,
  PenTool, Video, Image as ImageIcon, BarChart3, Sparkles,
  Layout, FileText, Calendar, Clock, MoreHorizontal, Edit3,
  Copy, Check, AlertCircle, Rocket, Zap, Users
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Quick action cards
const QUICK_ACTIONS = [
  {
    id: 'website',
    title: 'Create Website',
    description: 'Build a stunning website with AI',
    icon: Globe,
    href: '/studio/sites/new',
    color: 'from-purple-500 to-pink-500',
    badge: 'Popular'
  },
  {
    id: 'blog',
    title: 'Write with AI',
    description: 'Generate blog posts instantly',
    icon: PenTool,
    href: '/studio/ai-blog',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'vlog',
    title: 'Create Vlog',
    description: 'Upload and share video content',
    icon: Video,
    href: '/vlog/create',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'nft',
    title: 'Mint NFT',
    description: 'Turn your content into NFTs',
    icon: Sparkles,
    href: '/nft/create',
    color: 'from-amber-500 to-yellow-500'
  }
];

function SiteCard({ site, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const siteUrl = `https://${site.subdomain}.cybev.io`;

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this website?')) return;
    setDeleting(true);
    await onDelete(site._id);
    setDeleting(false);
  };

  const getStatusColor = () => {
    switch (site.status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition">
      {/* Preview Image */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
        {site.thumbnail ? (
          <img src={site.thumbnail} alt={site.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-12 h-12 text-purple-300 dark:text-purple-600" />
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
          <Link href={`/studio/sites/${site._id}/edit`}>
            <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </Link>
          <a href={siteUrl} target="_blank" rel="noopener noreferrer">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-purple-700">
              <Eye className="w-4 h-4" />
              View
            </button>
          </a>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {site.status || 'Draft'}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{site.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{site.subdomain}.cybev.io</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-20 py-1">
                  <Link href={`/studio/sites/${site._id}/edit`}>
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Edit Site
                    </button>
                  </Link>
                  <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open Site
                    </button>
                  </a>
                  <button 
                    onClick={copyUrl}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy URL'}
                  </button>
                  <Link href={`/studio/sites/${site._id}/settings`}>
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </Link>
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete Site
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {site.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {site.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(site.updatedAt || site.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {site.views || 0} views
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const router = useRouter();
  const [sites, setSites] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sites');

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchSites();
    fetchBlogs();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sites/my`, getAuth());
      const data = await res.json();
      setSites(data.sites || data || []);
    } catch (err) {
      console.error('Fetch sites error:', err);
    }
    setLoading(false);
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blogs/my`, getAuth());
      const data = await res.json();
      setBlogs(data.blogs || data || []);
    } catch (err) {
      console.error('Fetch blogs error:', err);
    }
  };

  const deleteSite = async (siteId) => {
    try {
      await fetch(`${API_URL}/api/sites/${siteId}`, {
        method: 'DELETE',
        ...getAuth()
      });
      setSites(sites.filter(s => s._id !== siteId));
    } catch (err) {
      console.error('Delete site error:', err);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Studio - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Creator Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build websites, write content, and manage your creations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.id} href={action.href}>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition cursor-pointer group">
                {action.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                    {action.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('sites')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'sites'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Websites
              {sites.length > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  {sites.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'blogs'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Blog Posts
              {blogs.length > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  {blogs.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : activeTab === 'sites' ? (
          sites.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No websites yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first website with our AI-powered builder. Choose from templates or let AI design for you.
              </p>
              <Link href="/studio/sites/new">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2 mx-auto">
                  <Plus className="w-5 h-5" />
                  Create Your First Website
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Websites
                </h2>
                <Link href="/studio/sites/new">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Website
                  </button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                  <SiteCard key={site._id} site={site} onDelete={deleteSite} />
                ))}
              </div>
            </>
          )
        ) : (
          blogs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start writing with AI assistance or create from scratch.
              </p>
              <Link href="/studio/ai-blog">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 mx-auto">
                  <Sparkles className="w-5 h-5" />
                  Write with AI
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{blog.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{blog.excerpt || blog.content?.slice(0, 100)}</p>
                  <Link href={`/blog/${blog._id}`}>
                    <button className="text-purple-600 text-sm font-medium hover:underline">
                      View Post →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </AppLayout>
  );
}
