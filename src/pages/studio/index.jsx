// ============================================
// FILE: src/pages/studio/index.jsx
// PATH: cybev-frontend/src/pages/studio/index.jsx
// PURPOSE: Studio Dashboard - Clean White Design
// VERSION: 7.0.0 - Facebook-style clean with floating cards
// PREVIOUS: 6.8.x - Dark gradient design
// ROLLBACK: Restore previous studio/index.jsx
// GITHUB: https://github.com/cybev1/cybev-frontend
// UPDATED: 2026-01-12
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
  Copy, Check, AlertCircle, Rocket, Zap, Users, Upload, EyeOff,
  Share2, Send, MessageCircle, Church, ChevronRight, TrendingUp
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ==========================================
// QUICK ACTIONS DATA
// ==========================================
const QUICK_ACTIONS = [
  {
    id: 'website',
    title: 'Create Website',
    description: 'Build a stunning website with AI',
    icon: Globe,
    href: '/studio/sites/new',
    color: '#7c3aed',
    bgColor: '#f3e8ff',
    badge: 'Popular'
  },
  {
    id: 'blog',
    title: 'Write with AI',
    description: 'Generate blog posts instantly',
    icon: PenTool,
    href: '/studio/ai-blog',
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    id: 'church',
    title: 'Church Management',
    description: 'Manage your ministry',
    icon: Church,
    href: '/church',
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 'vlog',
    title: 'Create Vlog',
    description: 'Upload video content',
    icon: Video,
    href: '/vlog/create',
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 'nft',
    title: 'Mint NFT',
    description: 'Turn content into NFTs',
    icon: Sparkles,
    href: '/nft/create',
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    id: 'meet',
    title: 'Meet',
    description: 'Video conferencing',
    icon: Video,
    href: '/meet',
    color: '#10b981',
    bgColor: '#d1fae5',
    badge: 'New'
  },
  {
    id: 'social',
    title: 'Social Tools',
    description: 'Automate social media',
    icon: Share2,
    href: '/studio/social',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    badge: 'New'
  },
  {
    id: 'campaigns',
    title: 'Campaigns',
    description: 'Email & SMS marketing',
    icon: Send,
    href: '/studio/campaigns',
    color: '#f97316',
    bgColor: '#ffedd5',
    badge: 'New'
  }
];

// ==========================================
// QUICK ACTION CARD - Floating Style
// ==========================================
function QuickActionCard({ action }) {
  return (
    <Link href={action.href}>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
        {/* Icon & Badge Row */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: action.bgColor }}
          >
            <action.icon className="w-6 h-6" style={{ color: action.color }} />
          </div>
          {action.badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              action.badge === 'New' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {action.badge}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
          {action.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {action.description}
        </p>

        {/* Arrow indicator */}
        <div className="flex items-center gap-1 mt-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">Get started</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

// ==========================================
// SITE CARD COMPONENT
// ==========================================
function SiteCard({ site, onDelete, onPublish }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const siteUrl = `https://${site.subdomain}.cybev.io`;
  const isPublished = site.status === 'published';

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this website?')) return;
    setDeleting(true);
    setShowMenu(false);
    await onDelete(site._id);
    setDeleting(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setShowMenu(false);
    await onPublish(site._id, !isPublished);
    setPublishing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-200">
      {/* Preview Image */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-50 to-pink-50">
        {site.thumbnail ? (
          <img src={site.thumbnail} alt={site.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-12 h-12 text-purple-200" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isPublished 
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow-sm transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-scale-in">
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">Visit Site</span>
                </a>
                <Link href={`/studio/sites/${site._id}/edit`}>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </div>
                </Link>
                <button
                  onClick={copyUrl}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy URL'}</span>
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                >
                  {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {publishing ? 'Saving...' : isPublished ? 'Unpublish' : 'Publish'}
                  </span>
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white rounded-lg font-semibold text-gray-900 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </a>
          <Link href={`/studio/sites/${site._id}/edit`}>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </Link>
        </div>
      </div>

      {/* Site Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{site.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{siteUrl}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{site.views || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(site.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STATS CARD - Floating Style
// ==========================================
function StatsCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ==========================================
// MAIN STUDIO PAGE
// ==========================================
export default function StudioPage() {
  const router = useRouter();
  const [sites, setSites] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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

      // Fetch sites
      const sitesRes = await fetch(`${API_URL}/api/sites/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sitesData = await sitesRes.json();
      if (sitesData.ok) setSites(sitesData.sites || []);

      // Fetch blogs
      const blogsRes = await fetch(`${API_URL}/api/blogs/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blogsData = await blogsRes.json();
      if (blogsData.ok) setBlogs(blogsData.blogs || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSite = async (siteId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sites/${siteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSites(sites.filter(s => s._id !== siteId));
      }
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const handlePublishSite = async (siteId, publish) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: publish ? 'published' : 'draft' })
      });
      if (res.ok) {
        setSites(sites.map(s =>
          s._id === siteId ? { ...s, status: publish ? 'published' : 'draft' } : s
        ));
      }
    } catch (error) {
      console.error('Error updating site:', error);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Studio | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* ==========================================
            HERO SECTION - Floating Header
            ========================================== */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Creator Studio
                </h1>
                <p className="text-gray-500">
                  Build websites, write blogs, and grow your audience
                </p>
              </div>
              <Link href="/studio/sites/new">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  style={{ boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)' }}
                >
                  <Plus className="w-5 h-5" />
                  Create Website
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* ==========================================
              STATS ROW - Floating Cards
              ========================================== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={Globe}
              label="Total Websites"
              value={sites.length}
              color="#7c3aed"
            />
            <StatsCard
              icon={FileText}
              label="Blog Posts"
              value={blogs.length}
              color="#3b82f6"
            />
            <StatsCard
              icon={Eye}
              label="Total Views"
              value={sites.reduce((acc, s) => acc + (s.views || 0), 0)}
              trend={12}
              color="#10b981"
            />
            <StatsCard
              icon={Users}
              label="Followers"
              value="0"
              color="#f59e0b"
            />
          </div>

          {/* ==========================================
              QUICK ACTIONS - Floating Cards
              ========================================== */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard key={action.id} action={action} />
              ))}
            </div>
          </div>

          {/* ==========================================
              MY WEBSITES SECTION
              ========================================== */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Websites</h2>
              <Link href="/studio/sites/new">
                <button className="text-purple-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  New Website
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sites.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No websites yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Create your first website with our AI-powered builder. It's fast, easy, and beautiful.
                </p>
                <Link href="/studio/sites/new">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                    Create Your First Website
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                  <SiteCard
                    key={site._id}
                    site={site}
                    onDelete={handleDeleteSite}
                    onPublish={handlePublishSite}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ==========================================
              MY BLOGS SECTION
              ========================================== */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Blogs</h2>
              <Link href="/studio/ai-blog">
                <button className="text-purple-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Write Blog
                </button>
              </Link>
            </div>

            {blogs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PenTool className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">No blogs yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start writing with our AI-powered blog generator
                </p>
                <Link href="/studio/ai-blog">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                    Write Your First Blog
                  </button>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
                {blogs.slice(0, 5).map((blog) => (
                  <Link key={blog._id} href={`/blog/${blog._id}`}>
                    <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{blog.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()} • {blog.views || 0} views
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
