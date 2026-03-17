// ============================================
// FILE: src/pages/studio/index.jsx
// CYBEV Studio Dashboard - CLEAN WHITE DESIGN
// VERSION: 7.4.0 - Added Church Quick Create Organization Buttons
// PRESERVES: All existing buttons (Feed, Create Website, Write Article, AI Article,
//            Church Management, Create Vlog, Mint NFT, Meet, Social Tools, Campaigns)
// ADDS: Church Quick Create Organization section
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Globe, Plus, Eye, Trash2, MoreHorizontal, Edit3, ExternalLink,
  PenTool, Video, Sparkles, FileText, Calendar, Users, Share2, Send,
  Church, ChevronRight, TrendingUp, Loader2, Clock, EyeOff, Copy, Check, Rss,
  Wand2, Edit, Image as ImageIcon, Home, BookOpenCheck, PlusCircle, BarChart2, BookOpen,
  Film, Music, Tv, MessageCircle, Rocket, Radio
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ==========================================
// QUICK ACTIONS - ALL ORIGINAL BUTTONS PRESERVED
// ==========================================
const QUICK_ACTIONS = [
  { id: 'feed', title: 'Feed', desc: 'Explore content', icon: Rss, href: '/feed', color: '#059669', bg: '#d1fae5', badge: 'Home' },
  { id: 'website', title: 'Create Website', desc: 'Build with AI', icon: Globe, href: '/studio/sites/new', color: '#7c3aed', bg: '#f3e8ff', badge: 'Popular' },
  { id: 'manual-blog', title: 'Write Article', desc: 'Manual writing', icon: Edit, href: '/blog/create', color: '#2563eb', bg: '#dbeafe' },
  { id: 'ai-blog', title: 'AI Article', desc: 'Generate with AI', icon: Wand2, href: '/studio/ai-blog', color: '#8b5cf6', bg: '#ede9fe', badge: 'AI' },
  { id: 'church', title: 'Church Management', desc: 'Manage ministry', icon: Church, href: '/church', color: '#f59e0b', bg: '#fef3c7' },
  { id: 'vlog', title: 'Create Vlog', desc: 'Upload video', icon: Video, href: '/vlog/create', color: '#ef4444', bg: '#fee2e2' },
  { id: 'nft', title: 'Mint NFT', desc: 'Create NFTs', icon: Sparkles, href: '/nft/create', color: '#ec4899', bg: '#fce7f3' },
  { id: 'meet', title: 'Meet', desc: 'Video call', icon: Video, href: '/meet', color: '#10b981', bg: '#d1fae5', badge: 'New' },
  { id: 'social', title: 'Social Tools', desc: 'Automation', icon: Share2, href: '/studio/social', color: '#8b5cf6', bg: '#ede9fe', badge: 'New' },
  { id: 'campaigns', title: 'Campaigns', desc: 'Email & SMS', icon: Send, href: '/studio/campaigns', color: '#f97316', bg: '#ffedd5', badge: 'New' },
  { id: 'watch-party', title: 'Watch Party', desc: 'Watch together', icon: Film, href: '/watch-party', color: '#7c3aed', bg: '#ede9fe', badge: 'New' },
  { id: 'ai-studio', title: 'AI Studio', desc: 'Video, Music, Art', icon: Wand2, href: '/ai-studio', color: '#ec4899', bg: '#fce7f3', badge: '✨ AI' },
];

// Desktop: card grid. Mobile: Facebook-style horizontal rows
function QuickActionCard({ action }) {
  return (
    <Link href={action.href}>
      {/* Desktop — grid card (hidden on mobile) */}
      <div className="hidden sm:block bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: action.bg }}>
            <action.icon className="w-6 h-6" style={{ color: action.color }} />
          </div>
          {action.badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              action.badge === 'New' ? 'bg-purple-600 text-white' : 
              action.badge === 'AI' || action.badge === '✨ AI' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
              'bg-purple-100 text-purple-700'
            }`}>{action.badge}</span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{action.title}</h3>
        <p className="text-sm text-gray-500">{action.desc}</p>
      </div>

      {/* Mobile — Facebook-style horizontal row (hidden on desktop) */}
      <div className="sm:hidden flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-xl border border-gray-100 active:bg-gray-50 transition-colors cursor-pointer">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: action.bg }}>
          <action.icon className="w-5 h-5" style={{ color: action.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-[15px]">{action.title}</h3>
            {action.badge && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                action.badge === 'New' ? 'bg-purple-600 text-white' : 
                action.badge === 'AI' || action.badge === '✨ AI' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                'bg-purple-100 text-purple-700'
              }`}>{action.badge}</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    </Link>
  );
}

function SiteCard({ site, onDelete, onPublish }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const siteUrl = `https://${site.subdomain}.cybev.io`;
  const isPublished = site.status === 'published';

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
      <div className="aspect-video bg-gray-100 relative">
        {site.thumbnail ? (
          <img src={site.thumbnail} alt={site.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
            <Globe className="w-12 h-12 text-purple-200" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>{isPublished ? 'Published' : 'Draft'}</span>
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-sm">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                  <ExternalLink className="w-4 h-4" /><span className="text-sm font-medium">Visit Site</span>
                </a>
                <Link href={`/studio/sites/${site._id}/edit`}>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                    <Edit3 className="w-4 h-4" /><span className="text-sm font-medium">Edit</span>
                  </div>
                </Link>
                <button onClick={copyUrl} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy URL'}</span>
                </button>
                <button onClick={() => { onPublish(site._id, !isPublished); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                  {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-sm font-medium">{isPublished ? 'Unpublish' : 'Publish'}</span>
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button onClick={() => { onDelete(site._id); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" /><span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1">{site.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{siteUrl}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1"><Eye className="w-4 h-4" />{site.views || 0}</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(site.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-1.5 sm:mb-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs sm:text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    </div>
  );
}

// Blog Creation Options Modal/Section
function BlogCreationOptions({ onClose }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link href="/blog/create">
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Edit className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Write Manually</h3>
          <p className="text-gray-500 text-sm mb-4">
            Full control over your content. Write your own articles with rich text editor, 
            upload images, and publish on your terms.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Rich Editor</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Image Upload</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Full Control</span>
          </div>
        </div>
      </Link>
      
      <Link href="/studio/ai-blog">
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
              AI Powered
            </span>
          </div>
          <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Wand2 className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Generate with AI</h3>
          <p className="text-gray-500 text-sm mb-4">
            Let AI write your article. Just provide a topic and preferences, 
            and get a complete blog post with images and SEO.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">Auto Generate</span>
            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">SEO Optimized</span>
            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">AI Images</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ==========================================
// NEW: Church Quick Create Section
// ==========================================
function ChurchQuickCreate() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-purple-600" />
        Quick Create Organization
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Create Church */}
        <Link href="/church/org/create?type=church">
          <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition cursor-pointer shadow-md hover:shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Church className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Create Church</p>
              <p className="text-xs text-white/80">Local congregation</p>
            </div>
          </div>
        </Link>

        {/* Create Fellowship */}
        <Link href="/church/org/create?type=fellowship">
          <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition cursor-pointer shadow-md hover:shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Create Fellowship</p>
              <p className="text-xs text-white/80">Small group</p>
            </div>
          </div>
        </Link>

        {/* Create Cell */}
        <Link href="/church/org/create?type=cell">
          <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition cursor-pointer shadow-md hover:shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Create Cell</p>
              <p className="text-xs text-white/80">Home cell group</p>
            </div>
          </div>
        </Link>

        {/* Create Bible Study */}
        <Link href="/church/org/create?type=biblestudy">
          <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition cursor-pointer shadow-md hover:shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Bible Study</p>
              <p className="text-xs text-white/80">Study group</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Church Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/church" className="group">
          <div className="bg-gray-50 rounded-xl p-3 hover:bg-purple-50 transition flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Dashboard</p>
              <p className="text-xs text-gray-500">View stats</p>
            </div>
          </div>
        </Link>

        <Link href="/church/souls/add" className="group">
          <div className="bg-gray-50 rounded-xl p-3 hover:bg-red-50 transition flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Add Soul</p>
              <p className="text-xs text-gray-500">New convert</p>
            </div>
          </div>
        </Link>

        <Link href="/church/foundation" className="group">
          <div className="bg-gray-50 rounded-xl p-3 hover:bg-blue-50 transition flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Foundation</p>
              <p className="text-xs text-gray-500">School</p>
            </div>
          </div>
        </Link>

        <Link href="/church/attendance" className="group">
          <div className="bg-gray-50 rounded-xl p-3 hover:bg-green-50 transition flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Attendance</p>
              <p className="text-xs text-gray-500">Track</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const router = useRouter();
  const [sites, setSites] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [watchParties, setWatchParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBlogOptions, setShowBlogOptions] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      const [sitesRes, blogsRes, wpRes] = await Promise.all([
        fetch(`${API_URL}/api/sites/my`, { headers }).then(r => r.json()).catch(() => ({ sites: [] })),
        fetch(`${API_URL}/api/blogs/my`, { headers }).then(r => r.json()).catch(() => ({ blogs: [] })),
        fetch(`${API_URL}/api/watch-party?limit=50`).then(r => r.json()).catch(() => ({ parties: [] }))
      ]);

      setSites(sitesRes.sites || []);
      setBlogs(blogsRes.blogs || blogsRes.data?.blogs || []);
      setWatchParties(Array.isArray(wpRes.parties) ? wpRes.parties : Array.isArray(wpRes) ? wpRes : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDeleteSite = async (siteId) => {
    if (!confirm('Delete this website?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/sites/${siteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setSites(sites.filter(s => s._id !== siteId));
    } catch (err) { console.error(err); }
  };

  const handlePublishSite = async (siteId, publish) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/sites/${siteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: publish ? 'published' : 'draft' })
      });
      setSites(sites.map(s => s._id === siteId ? { ...s, status: publish ? 'published' : 'draft' } : s));
    } catch (err) { console.error(err); }
  };

  return (
    <AppLayout>
      <Head><title>Studio | CYBEV</title></Head>

      {/* SOLID WHITE/GRAY BACKGROUND */}
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Creator Studio</h1>
                <p className="text-gray-600">Build websites, write blogs, and grow your audience</p>
              </div>
              <div className="flex gap-3">
                <Link href="/blog/create">
                  <button className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors">
                    <Edit className="w-5 h-5" />Write Article
                  </button>
                </Link>
                <Link href="/studio/sites/new">
                  <button className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg hover:bg-purple-700 transition-colors">
                    <Plus className="w-5 h-5" />Create Website
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatsCard icon={Globe} label="Total Websites" value={sites.length} color="#7c3aed" />
            <StatsCard icon={FileText} label="Blog Posts" value={blogs.length} color="#3b82f6" />
            <StatsCard icon={Eye} label="Total Views" value={sites.reduce((acc, s) => acc + (s.views || 0), 0)} trend={12} color="#10b981" />
            <StatsCard icon={Users} label="Followers" value="0" color="#f59e0b" />
          </div>

          {/* ─── Watch Party Insights (Facebook-style) ─── */}
          {watchParties.length > 0 && (() => {
            const liveParties = watchParties.filter(p => p.status === 'live');
            const endedParties = watchParties.filter(p => p.status === 'ended');
            const totalViewers = watchParties.reduce((sum, p) => sum + (p.activeViewers || p.totalViews || p.peakViewers || 0), 0);
            const totalChats = watchParties.reduce((sum, p) => sum + (p.chatMessages?.length || 0), 0);
            const totalShares = watchParties.reduce((sum, p) => sum + (p.shareCount || 0), 0);
            const totalBoosted = watchParties.reduce((sum, p) => sum + (p.boostedViewers || 0) + (p.boostConfig?.totalBoostedEver || 0), 0);
            const peakEver = Math.max(...watchParties.map(p => p.peakViewers || p.activeViewers || 0), 0);

            return (
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Film className="w-5 h-5 text-purple-600" />
                    Watch Party Insights
                  </h2>
                  <Link href="/watch-party">
                    <span className="text-sm text-purple-600 font-semibold hover:underline cursor-pointer flex items-center gap-1">
                      See all <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>

                {/* Insight Stats Row */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-black text-purple-700">{watchParties.length}</p>
                    <p className="text-[10px] sm:text-xs text-purple-500 font-medium">Total Parties</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-black text-red-600">{liveParties.length}</p>
                    <p className="text-[10px] sm:text-xs text-red-500 font-medium">Live Now</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-black text-blue-700">{totalViewers >= 1000000 ? (totalViewers/1000000).toFixed(1)+'M' : totalViewers >= 1000 ? (totalViewers/1000).toFixed(1)+'K' : totalViewers}</p>
                    <p className="text-[10px] sm:text-xs text-blue-500 font-medium">Total Viewers</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-black text-amber-700">{totalChats >= 1000 ? (totalChats/1000).toFixed(1)+'K' : totalChats}</p>
                    <p className="text-[10px] sm:text-xs text-amber-500 font-medium">Chat Messages</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-black text-green-700">{peakEver >= 1000000 ? (peakEver/1000000).toFixed(1)+'M' : peakEver >= 1000 ? (peakEver/1000).toFixed(1)+'K' : peakEver}</p>
                    <p className="text-[10px] sm:text-xs text-green-500 font-medium">Peak Viewers</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-black text-pink-700">{totalBoosted >= 1000000 ? (totalBoosted/1000000).toFixed(1)+'M' : totalBoosted >= 1000 ? (totalBoosted/1000).toFixed(1)+'K' : totalBoosted}</p>
                    <p className="text-[10px] sm:text-xs text-pink-500 font-medium">Boosted</p>
                  </div>
                </div>

                {/* Recent Watch Parties list */}
                <div className="space-y-2">
                  {watchParties.slice(0, 5).map(wp => (
                    <Link key={wp._id} href={`/watch-party/${wp._id}/analytics`}>
                      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:bg-purple-50 transition-colors cursor-pointer">
                        {wp.coverImage ? (
                          <img src={wp.coverImage} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                            <Tv className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{wp.title}</p>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {(wp.activeViewers || wp.peakViewers || 0) >= 1000 ? ((wp.activeViewers || wp.peakViewers || 0)/1000).toFixed(1)+'K' : (wp.activeViewers || wp.peakViewers || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {wp.chatMessages?.length || 0}
                            </span>
                            {wp.boostedViewers > 0 && (
                              <span className="flex items-center gap-1 text-purple-600">
                                <Rocket className="w-3 h-3" />
                                +{wp.boostedViewers >= 1000 ? (wp.boostedViewers/1000).toFixed(1)+'K' : wp.boostedViewers}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {wp.status === 'live' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
                            </span>
                          )}
                          {wp.status === 'ended' && <span className="text-[10px] text-gray-400">Ended</span>}
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            {/* Mobile: vertical list, Desktop: grid */}
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
              {QUICK_ACTIONS.map(action => <QuickActionCard key={action.id} action={action} />)}
            </div>
          </div>

          {/* ============================================ */}
          {/* NEW: Church Quick Create Organization Section */}
          {/* ============================================ */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Church className="w-5 h-5 text-purple-600" />
              Church Management
            </h2>
            <ChurchQuickCreate />
          </div>

          {/* Blog Creation Options */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Create New Article</h2>
            </div>
            <BlogCreationOptions />
          </div>

          {/* My Websites */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Websites</h2>
              <Link href="/studio/sites/new" className="text-purple-600 text-sm font-semibold hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />New Website
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-200">
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-4"><div className="h-5 bg-gray-200 rounded mb-2 w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : sites.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No websites yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first website with our AI-powered builder.</p>
                <Link href="/studio/sites/new">
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                    Create Your First Website
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map(site => <SiteCard key={site._id} site={site} onDelete={handleDeleteSite} onPublish={handlePublishSite} />)}
              </div>
            )}
          </div>

          {/* Recent Blogs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Articles</h2>
              <div className="flex gap-2">
                <Link href="/blog/create" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  <Edit className="w-4 h-4" />Write
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/studio/ai-blog" className="text-purple-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  <Wand2 className="w-4 h-4" />AI Generate
                </Link>
              </div>
            </div>

            {blogs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PenTool className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">No articles yet</h3>
                <p className="text-sm text-gray-500 mb-4">Write your own article or generate one with AI</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/blog/create">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                      Write Manually
                    </button>
                  </Link>
                  <Link href="/studio/ai-blog">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors">
                      Generate with AI
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                {blogs.slice(0, 5).map(blog => (
                  <Link key={blog._id} href={`/blog/${blog._id}`}>
                    <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 cursor-pointer">
                      {blog.featuredImage && (
                        <img 
                          src={blog.featuredImage} 
                          alt="" 
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{blog.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()} • {blog.views || 0} views
                          {blog.status === 'draft' && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Draft</span>
                          )}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
                {blogs.length > 5 && (
                  <Link href="/blog">
                    <div className="p-4 hover:bg-gray-50 transition-colors text-center text-purple-600 font-semibold cursor-pointer">
                      View All Articles ({blogs.length})
                    </div>
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
