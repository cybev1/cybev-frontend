// ============================================
// FILE: src/pages/studio/index.jsx
// Studio Hub - FIXED with proper AI Generator link
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  PenTool,
  Wand2,
  Globe,
  Video,
  Image as ImageIcon,
  FileText,
  Plus,
  ExternalLink,
  Settings,
  MoreHorizontal,
  Loader2,
  Eye,
  Edit3,
  Trash2,
  Layout,
  Sparkles,
  BookOpen,
  Radio,
  Home,
  Compass
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const STUDIO_TOOLS = [
  {
    id: 'ai-generator',
    name: 'AI Content Generator',
    description: 'Generate blog posts, articles & content with AI',
    icon: Wand2,
    href: '/studio/ai-blog',
    color: 'from-purple-500 to-pink-500',
    badge: 'Popular'
  },
  {
    id: 'blog-create',
    name: 'Write Blog Post',
    description: 'Create a new blog post manually',
    icon: PenTool,
    href: '/blog/create',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'website-builder',
    name: 'Website Builder',
    description: 'Build and manage your websites',
    icon: Globe,
    href: '/studio/sites/new',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'vlog',
    name: 'Create Vlog',
    description: 'Upload and share video content',
    icon: Video,
    href: '/vlog/create',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'go-live',
    name: 'Go Live',
    description: 'Start a live stream',
    icon: Radio,
    href: '/live/go-live',
    color: 'from-pink-500 to-rose-500',
    badge: 'Live'
  },
  {
    id: 'nft',
    name: 'Create NFT',
    description: 'Mint your content as NFT',
    icon: Sparkles,
    href: '/nft/create',
    color: 'from-yellow-500 to-amber-500'
  }
];

function WebsiteCard({ site, onDelete }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this website?')) return;
    setDeleting(true);
    await onDelete(site._id);
    setDeleting(false);
  };

  return (
    <div className="bg-white/5 rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all group">
      {/* Preview */}
      <div className="h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
        {site.thumbnail ? (
          <img src={site.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="w-12 h-12 text-purple-500/50" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${
          site.isPublished 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {site.isPublished ? 'Published' : 'Draft'}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/studio/sites/${site.subdomain || site._id}/edit`}>
            <button className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30">
              <Edit3 className="w-5 h-5" />
            </button>
          </Link>
          <a
            href={`https://${site.subdomain}.cybev.io`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30"
          >
            {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{site.name || 'Untitled Site'}</h3>
        <p className="text-gray-500 text-sm truncate">
          {site.subdomain}.cybev.io
        </p>
      </div>
    </div>
  );
}

function BlogPostCard({ post }) {
  return (
    <Link href={`/blog/edit/${post._id}`}>
      <div className="bg-white/5 rounded-xl border border-purple-500/20 p-4 hover:border-purple-500/40 transition-all cursor-pointer">
        <div className="flex items-start gap-3">
          {post.coverImage ? (
            <img src={post.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{post.title || 'Untitled'}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
              post.isPublished 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {post.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function StudioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [websites, setWebsites] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeSection, setActiveSection] = useState('tools');

  useEffect(() => {
    fetchData();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sitesRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/api/sites/my`, getAuth()).catch(() => ({ data: { sites: [] } })),
        axios.get(`${API_URL}/api/blogs/my`, getAuth()).catch(() => ({ data: { blogs: [] } }))
      ]);

      setWebsites(sitesRes.data.sites || []);
      setBlogs(blogsRes.data.blogs || blogsRes.data.posts || []);
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSite = async (siteId) => {
    try {
      await axios.delete(`${API_URL}/api/sites/${siteId}`, getAuth());
      setWebsites(websites.filter(s => s._id !== siteId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Studio - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-purple-500/20">
          <Link href="/feed">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
              Feed
            </button>
          </Link>
          <Link href="/explore">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <Compass className="w-4 h-4" />
              Explore
            </button>
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg">
            <Layout className="w-4 h-4" />
            Studio
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Creator Studio</h1>
          <p className="text-gray-400">Create, manage, and publish your content</p>
        </div>

        {/* Quick Create Tools */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Create Something New</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STUDIO_TOOLS.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all cursor-pointer group relative">
                  {tool.badge && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                      {tool.badge}
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{tool.name}</h3>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Websites */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Websites</h2>
              <Link href="/studio/sites/new">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  New Site
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : websites.length === 0 ? (
              <div className="bg-white/5 rounded-xl border border-purple-500/20 p-8 text-center">
                <Globe className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No websites yet</p>
                <Link href="/studio/sites/new">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                    Create Your First Website
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {websites.slice(0, 4).map(site => (
                  <WebsiteCard key={site._id} site={site} onDelete={handleDeleteSite} />
                ))}
                {websites.length > 4 && (
                  <Link href="/studio/sites">
                    <button className="w-full py-3 text-purple-400 hover:text-purple-300 font-medium">
                      View all {websites.length} websites →
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* My Blog Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Blog Posts</h2>
              <Link href="/blog/create">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white/5 rounded-xl border border-purple-500/20 p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No blog posts yet</p>
                <div className="flex justify-center gap-3">
                  <Link href="/studio/ai-blog">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                      <Wand2 className="w-4 h-4" />
                      Write with AI
                    </button>
                  </Link>
                  <Link href="/blog/create">
                    <button className="px-4 py-2 bg-white/10 text-white rounded-lg">
                      Write Manually
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {blogs.slice(0, 5).map(post => (
                  <BlogPostCard key={post._id} post={post} />
                ))}
                {blogs.length > 5 && (
                  <Link href="/blog">
                    <button className="w-full py-3 text-purple-400 hover:text-purple-300 font-medium">
                      View all {blogs.length} posts →
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
