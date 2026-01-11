// ============================================
// FILE: src/pages/studio/index.jsx
// PURPOSE: Creator Studio with Forms, Reports, etc.
// VERSION: 2.0 - Added Forms, Vlogs, Reports tabs
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Globe, Church, Sparkles, Video, Coins, Plus, ExternalLink,
  MoreVertical, Eye, Edit, Trash2, Settings, FileText, BarChart2,
  PenTool, Grid, Calendar, Users, TrendingUp, Clock, Check
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

// Studio Feature Cards
const STUDIO_FEATURES = [
  {
    id: 'website',
    title: 'Create Website',
    description: 'Build a stunning website with AI',
    icon: Globe,
    href: '/studio/sites/new',
    color: '#f59e0b',
    badge: 'Popular'
  },
  {
    id: 'church',
    title: 'Church Management',
    description: 'Manage your church & ministry',
    icon: Church,
    href: '/church',
    color: '#7c3aed',
    badge: 'New'
  },
  {
    id: 'ai-write',
    title: 'Write with AI',
    description: 'Generate blog posts instantly',
    icon: PenTool,
    href: '/blog/create?ai=true',
    color: '#10b981',
    badge: null
  },
  {
    id: 'vlog',
    title: 'Create Vlog',
    description: 'Upload and share video content',
    icon: Video,
    href: '/vlog/create',
    color: '#ef4444',
    badge: null
  },
  {
    id: 'forms',
    title: 'Forms Builder',
    description: 'Create surveys & collect responses',
    icon: FileText,
    href: '/studio/forms',
    color: '#3b82f6',
    badge: 'New'
  },
  {
    id: 'nft',
    title: 'Mint NFT',
    description: 'Turn your content into NFTs',
    icon: Coins,
    href: '/studio/nft/mint',
    color: '#8b5cf6',
    badge: null
  }
];

// Tab definitions
const TABS = [
  { id: 'websites', label: 'Websites', icon: Globe },
  { id: 'blogs', label: 'Blog Posts', icon: FileText },
  { id: 'forms', label: 'Forms', icon: FileText },
  { id: 'vlogs', label: 'Vlogs', icon: Video },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 }
];

export default function StudioPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('websites');
  const [websites, setWebsites] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [forms, setForms] = useState([]);
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    websites: 0,
    blogs: 0,
    forms: 0,
    vlogs: 0
  });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all content types in parallel
      const [websitesRes, blogsRes, formsRes, vlogsRes] = await Promise.all([
        fetch(`${API}/api/sites/my`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API}/api/blogs/my`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API}/api/forms`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API}/api/vlogs/my`, { headers }).catch(() => ({ ok: false }))
      ]);

      // Parse responses
      const websitesData = websitesRes.ok ? await websitesRes.json() : { sites: [] };
      const blogsData = blogsRes.ok ? await blogsRes.json() : { blogs: [] };
      const formsData = formsRes.ok ? await formsRes.json() : { forms: [] };
      const vlogsData = vlogsRes.ok ? await vlogsRes.json() : { vlogs: [] };

      setWebsites(websitesData.sites || []);
      setBlogs(blogsData.blogs || []);
      setForms(formsData.forms || []);
      setVlogs(vlogsData.vlogs || []);

      setCounts({
        websites: websitesData.sites?.length || 0,
        blogs: blogsData.blogs?.length || 0,
        forms: formsData.forms?.length || 0,
        vlogs: vlogsData.vlogs?.length || 0
      });
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Creator Studio | CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Creator Studio
          </h1>
          <p className="text-gray-500">
            Build websites, write content, and manage your creations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {STUDIO_FEATURES.map(feature => (
            <Link
              key={feature.id}
              href={feature.href}
              className="relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-purple-300 transition group"
            >
              {feature.badge && (
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${
                  feature.badge === 'New' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {feature.badge}
                </span>
              )}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500">{feature.description}</p>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Websites Tab */}
            {activeTab === 'websites' && (
              <WebsitesTab websites={websites} onRefresh={fetchAllContent} />
            )}

            {/* Blog Posts Tab */}
            {activeTab === 'blogs' && (
              <BlogsTab blogs={blogs} onRefresh={fetchAllContent} />
            )}

            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <FormsTab forms={forms} onRefresh={fetchAllContent} />
            )}

            {/* Vlogs Tab */}
            {activeTab === 'vlogs' && (
              <VlogsTab vlogs={vlogs} onRefresh={fetchAllContent} />
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <AnalyticsTab />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}

// Websites Tab Component
function WebsitesTab({ websites, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Websites</h2>
        <Link
          href="/studio/sites/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          New Website
        </Link>
      </div>

      {websites.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No websites yet"
          description="Create your first website with our AI-powered builder"
          action={{ label: 'Create Website', href: '/studio/sites/new' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map(site => (
            <WebsiteCard key={site._id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}

// Blog Posts Tab Component
function BlogsTab({ blogs, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Blog Posts</h2>
        <Link
          href="/blog/create"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No blog posts yet"
          description="Write your first blog post and share it with the world"
          action={{ label: 'Write Post', href: '/blog/create' }}
        />
      ) : (
        <div className="space-y-4">
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

// Forms Tab Component
function FormsTab({ forms, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Forms</h2>
        <Link
          href="/studio/forms/builder"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No forms yet"
          description="Create surveys, collect feedback, and gather responses"
          action={{ label: 'Create Form', href: '/studio/forms/builder' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map(form => (
            <FormCard key={form._id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
}

// Vlogs Tab Component
function VlogsTab({ vlogs, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Vlogs</h2>
        <Link
          href="/vlog/create"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Upload Vlog
        </Link>
      </div>

      {vlogs.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No vlogs yet"
          description="Upload your first video and grow your audience"
          action={{ label: 'Upload Vlog', href: '/vlog/create' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vlogs.map(vlog => (
            <VlogCard key={vlog._id} vlog={vlog} />
          ))}
        </div>
      )}
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Views" value="12.4K" trend="+12%" color="purple" />
        <StatCard label="Engagement Rate" value="8.2%" trend="+3.1%" color="green" />
        <StatCard label="New Followers" value="156" trend="+24" color="blue" />
        <StatCard label="Total Earnings" value="$234.50" trend="+$45" color="amber" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Performance Over Time</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Chart coming soon...</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <Link
        href={action.href}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        <Plus className="w-4 h-4" />
        {action.label}
      </Link>
    </div>
  );
}

function WebsiteCard({ site }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition">
      <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <Globe className="w-12 h-12 text-purple-300" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{site.name}</h3>
            <p className="text-sm text-gray-500">{site.domain || 'No domain'}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            site.status === 'published' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {site.status || 'Draft'}
          </span>
        </div>
        <div className="flex gap-2">
          <Link 
            href={`/studio/sites/${site._id}/edit`}
            className="flex-1 text-center py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Edit
          </Link>
          <a 
            href={site.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        {blog.coverImage && (
          <img src={blog.coverImage} alt="" className="w-24 h-24 rounded-lg object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{blog.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.excerpt || blog.content?.slice(0, 100)}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {blog.views || 0} views
            </span>
            <span className={`px-2 py-0.5 rounded-full ${
              blog.status === 'published' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {blog.status || 'Draft'}
            </span>
          </div>
        </div>
        <Link href={`/blog/${blog._id}/edit`} className="p-2 hover:bg-gray-100 rounded-lg">
          <Edit className="w-4 h-4 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}

function FormCard({ form }) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    published: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700'
  };

  return (
    <Link 
      href={`/studio/forms/builder?id=${form._id}`}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[form.status] || statusColors.draft}`}>
          {form.status || 'Draft'}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{form.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{form.fields?.length || 0} fields</p>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span>{form.responses?.length || 0} responses</span>
        <span>{new Date(form.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}

function VlogCard({ vlog }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition">
      <div className="relative h-40 bg-gray-100">
        {vlog.thumbnail ? (
          <img src={vlog.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {vlog.duration && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
            {vlog.duration}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{vlog.title}</h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {vlog.views || 0}
          </span>
          <span>{new Date(vlog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, color }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[color]}`}>{trend}</span>
    </div>
  );
}
