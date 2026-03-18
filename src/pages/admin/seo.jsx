// ============================================
// FILE: admin/seo.jsx
// PATH: /src/pages/admin/seo.jsx
// CYBEV Admin SEO Dashboard
// VERSION: 1.0
// ============================================
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import api from '@/lib/api';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Globe, BarChart3, BookOpen, Eye, TrendingUp, Clock, Users,
  Loader2, ChevronRight, Rocket, Target, Layers, RefreshCw,
  PenTool, ArrowUp, ExternalLink, Zap
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color = 'purple' }) {
  const colors = { purple: 'bg-purple-50 text-purple-600', blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600' };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]} mb-2`}><Icon size={18} /></div>
      <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {sub && <p className="text-xs text-emerald-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminSEO() {
  const [overview, setOverview] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/seo/admin/overview').catch(() => ({ data: null })),
      api.get('/api/seo/admin/campaigns?limit=20').catch(() => ({ data: { campaigns: [] } }))
    ]).then(([o, c]) => {
      setOverview(o.data?.overview);
      setCampaigns(c.data?.campaigns || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout><div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-purple-600" /></div></AppLayout>
  );

  const o = overview || {};

  return (
    <AppLayout>
      <Head><title>Admin SEO Dashboard — CYBEV</title></Head>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Globe className="text-purple-600" size={28} /> Admin SEO Dashboard</h1>
            <p className="text-gray-500 mt-1">Platform-wide SEO performance and campaign management</p>
          </div>
          <Link href="/studio/seo" className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium">
            <Rocket size={16} /> Open SEO Studio
          </Link>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Total Articles" value={o.totalBlogs || 0} color="purple" />
          <StatCard icon={Eye} label="Published" value={o.totalPublished || 0} color="blue" />
          <StatCard icon={BarChart3} label="Total Views" value={o.totalViews || 0} color="emerald" />
          <StatCard icon={Target} label="Campaigns" value={o.totalCampaigns || 0} color="amber" />
          <StatCard icon={Clock} label="This Week" value={o.articlesThisWeek || 0} sub={`${o.avgArticlesPerDay || 0}/day avg`} color="purple" />
          <StatCard icon={TrendingUp} label="Avg/Day" value={o.avgArticlesPerDay || 0} color="blue" />
        </div>

        {/* Top Categories */}
        {overview && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Top Content Categories</h3>
            <div className="space-y-3">
              {(overview?.topCategories || []).slice(0, 10).map((cat, i) => {
                const maxViews = overview.topCategories?.[0]?.views || 1;
                return (
                  <div key={cat._id || i} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600 truncate">{cat._id || 'general'}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full flex items-center px-2" style={{ width: `${Math.max(5, (cat.views / maxViews) * 100)}%` }}>
                        <span className="text-[10px] text-white font-medium whitespace-nowrap">{cat.count} articles · {cat.views?.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Campaigns */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Target size={18} className="text-purple-600" /> All SEO Campaigns</h3>
          {campaigns.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No campaigns yet</p>
          ) : (
            <div className="space-y-3">
              {campaigns.map(c => (
                <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                    {c.type === 'content_campaign' ? <PenTool size={14} /> : c.type === 'content_cluster' ? <Layers size={14} /> : c.type === 'programmatic_seo' ? <Zap size={14} /> : <Target size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-800 truncate">{c.name}</h5>
                    <p className="text-xs text-gray-500">{c.type?.replace(/_/g, ' ')} · by {c.user?.displayName || c.user?.username || 'Unknown'} · {c.stats?.totalArticlesGenerated || 0} articles</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : c.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
