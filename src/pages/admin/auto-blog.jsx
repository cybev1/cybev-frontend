// ============================================
// FILE: src/pages/admin/auto-blog.jsx
// Admin Panel: Auto-Blog Campaign Management
// Special Users auto-generate quality articles daily
// VERSION: 1.0
// ============================================
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Shield, FileText, Bot, Zap, Loader2, Plus, Trash2, Play, Pause, Eye,
  ArrowLeft, TrendingUp, Search, Clock, Settings, RefreshCw, ChevronDown,
  CheckCircle, AlertTriangle, Globe, Users, Hash, Wand2, Radio
} from 'lucide-react';
import api from '@/lib/api';

const ALL_CATEGORIES = [
  'technology', 'business', 'health', 'entertainment', 'sports', 'science',
  'lifestyle', 'news', 'education', 'faith', 'travel', 'food', 'music',
  'culture', 'finance', 'general'
];

const ALL_TONES = ['conversational', 'informative', 'inspiring', 'analytical', 'storytelling'];

export default function AutoBlogAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [running, setRunning] = useState(null); // campaign ID being run
  const [specialUsers, setSpecialUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState('');

  // Create form
  const [form, setForm] = useState({
    name: '',
    articlesPerDay: 10,
    randomUserCount: 15,
    assignedUsers: [],
    topics: '',
    categories: ['technology', 'business', 'health', 'news', 'entertainment', 'lifestyle', 'faith', 'education'],
    niches: ['general'],
    tones: ['conversational', 'informative', 'inspiring'],
    articleLength: 'medium',
    includeSEO: true,
    includeImages: true,
    includeNews: true,
    includeSocialPromo: false,
    socialLinks: { youtube: '', facebook: '', instagram: '', tiktok: '', twitter: '', website: '' },
    socialPromoText: '',
    postingHours: [6, 8, 10, 12, 14, 16, 18, 20, 22],
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campRes, statRes] = await Promise.all([
        api.get('/api/auto-blog/campaigns').catch(() => ({ data: { campaigns: [] } })),
        api.get('/api/auto-blog/stats').catch(() => ({ data: { stats: {} } })),
      ]);
      setCampaigns(campRes.data?.campaigns || []);
      setStats(statRes.data?.stats || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchSpecialUsers = async (search = '') => {
    try {
      const { data } = await api.get(`/api/auto-blog/special-users?limit=30&search=${search}`);
      setSpecialUsers(data.users || []);
    } catch {}
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return alert('Campaign name is required');
    try {
      const payload = {
        ...form,
        topics: form.topics ? form.topics.split('\n').map(t => t.trim()).filter(Boolean) : [],
      };
      await api.post('/api/auto-blog/campaigns', payload);
      setShowCreate(false);
      setForm(f => ({ ...f, name: '', topics: '' }));
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Failed to create'); }
  };

  const handleToggle = async (id) => {
    try {
      await api.post(`/api/auto-blog/campaigns/${id}/toggle`);
      fetchData();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    try {
      await api.delete(`/api/auto-blog/campaigns/${id}`);
      fetchData();
    } catch {}
  };

  const handleRunNow = async (id) => {
    setRunning(id);
    try {
      const { data } = await api.post(`/api/auto-blog/campaigns/${id}/run-now`);
      alert(`Generated! ${data.campaign?.lastRunArticles || 0} articles created, ${data.campaign?.lastRunErrors || 0} errors.`);
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
    finally { setRunning(null); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head><title>Auto-Blog Campaigns — CYBEV Admin</title></Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/admin">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            </Link>
            <div className="flex-1">
              <h1 className="font-bold text-gray-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" /> Auto-Blog Campaigns
              </h1>
              <p className="text-xs text-gray-500">Special Users auto-generate quality articles daily</p>
            </div>
            <button onClick={() => { setShowCreate(!showCreate); if (!showCreate) fetchSpecialUsers(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-5">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {[
                { label: 'Campaigns', value: stats.totalCampaigns, color: 'purple', icon: Settings },
                { label: 'Active', value: stats.activeCampaigns, color: 'green', icon: Play },
                { label: 'Paused', value: stats.pausedCampaigns, color: 'amber', icon: Pause },
                { label: 'Generated', value: stats.totalArticlesGenerated, color: 'blue', icon: FileText },
                { label: 'AI Blogs', value: stats.totalAIBlogsInDB, color: 'pink', icon: Bot },
                { label: 'Today', value: stats.articlesGeneratedToday, color: 'cyan', icon: Clock },
                { label: 'Daily Target', value: stats.projectedDailyOutput, color: 'red', icon: TrendingUp },
              ].map((s, i) => (
                <div key={i} className={`bg-${s.color}-50 rounded-xl p-3 text-center`}
                  style={{ backgroundColor: `var(--tw-${s.color}-50, #f5f3ff)` }}>
                  <s.icon className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <p className="text-lg font-black text-gray-900">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value || 0}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Create Campaign Form */}
          {showCreate && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" /> Create Auto-Blog Campaign
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Campaign Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Daily Mixed Content, News Updates, Tech Blog..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                {/* Articles per day */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Articles Per Day</label>
                  <input type="number" min={1} max={100} value={form.articlesPerDay}
                    onChange={e => setForm({ ...form, articlesPerDay: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                {/* Random user count */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Random Authors Count</label>
                  <input type="number" min={1} max={100} value={form.randomUserCount}
                    onChange={e => setForm({ ...form, randomUserCount: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                  <p className="text-[10px] text-gray-400 mt-1">Picks random Special Users as authors each run</p>
                </div>

                {/* Article length */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Article Length</label>
                  <div className="flex gap-2">
                    {['short', 'medium', 'long'].map(len => (
                      <button key={len} onClick={() => setForm({ ...form, articleLength: len })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border capitalize ${
                          form.articleLength === len ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'
                        }`}>{len}</button>
                    ))}
                  </div>
                </div>

                {/* Options toggles */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Options</label>
                  <div className="space-y-2">
                    {[
                      { key: 'includeSEO', label: 'SEO Optimization' },
                      { key: 'includeImages', label: 'Featured Images (Pexels)' },
                      { key: 'includeNews', label: 'Include News Topics' },
                      { key: 'includeSocialPromo', label: 'Promote Social Links' },
                    ].map(opt => (
                      <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form[opt.key]}
                          onChange={e => setForm({ ...form, [opt.key]: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Categories (select multiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => {
                        const cats = form.categories.includes(cat)
                          ? form.categories.filter(c => c !== cat)
                          : [...form.categories, cat];
                        setForm({ ...form, categories: cats });
                      }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-colors ${
                          form.categories.includes(cat)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}>{cat}</button>
                    ))}
                  </div>
                </div>

                {/* Tones */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Writing Tones</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TONES.map(tone => (
                      <button key={tone} onClick={() => {
                        const tones = form.tones.includes(tone)
                          ? form.tones.filter(t => t !== tone)
                          : [...form.tones, tone];
                        setForm({ ...form, tones });
                      }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border ${
                          form.tones.includes(tone)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300'
                        }`}>{tone}</button>
                    ))}
                  </div>
                </div>

                {/* Custom Topics */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Custom Topics (optional — one per line, leave blank for AI-generated)</label>
                  <textarea value={form.topics} onChange={e => setForm({ ...form, topics: e.target.value })}
                    placeholder={"The Future of AI in Healthcare\nTop 10 Business Ideas for 2026\nHealthy Living Tips for Busy Professionals\n(Leave blank and AI will generate trending topics automatically)"}
                    rows={4} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>

                {/* Social Links (shown when includeSocialPromo is on) */}
                {form.includeSocialPromo && (
                  <div className="md:col-span-2 bg-purple-50 rounded-xl p-4">
                    <label className="text-xs font-semibold text-purple-700 uppercase mb-2 block">Social Media Links to Promote</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['youtube', 'facebook', 'instagram', 'tiktok', 'twitter', 'website'].map(platform => (
                        <input key={platform} placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                          value={form.socialLinks[platform]}
                          onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, [platform]: e.target.value } })}
                          className="px-3 py-2 border border-purple-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                      ))}
                    </div>
                    <input placeholder="Promo text (e.g. Follow us for more!)" value={form.socialPromoText}
                      onChange={e => setForm({ ...form, socialPromoText: e.target.value })}
                      className="w-full mt-3 px-3 py-2 border border-purple-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 text-gray-600 font-medium">Cancel</button>
                <button onClick={handleCreate}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Create Campaign
                </button>
              </div>
            </div>
          )}

          {/* Campaign List */}
          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No campaigns yet</p>
                <p className="text-gray-400 text-sm mt-1">Create your first auto-blog campaign to start generating articles</p>
              </div>
            ) : campaigns.map(camp => (
              <div key={camp._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  {/* Status indicator */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    camp.isPaused ? 'bg-amber-100' : camp.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {camp.isPaused ? <Pause className="w-5 h-5 text-amber-600" /> :
                     camp.isActive ? <Play className="w-5 h-5 text-green-600" /> :
                     <Settings className="w-5 h-5 text-gray-400" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{camp.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        camp.isPaused ? 'bg-amber-100 text-amber-700' : camp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>{camp.isPaused ? 'PAUSED' : camp.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {camp.articlesPerDay}/day</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {camp.assignedUsers?.length || camp.randomUserCount} authors</span>
                      <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {camp.categories?.length || 0} categories</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {camp.totalArticlesGenerated || 0} total generated</span>
                      {camp.lastRunAt && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last: {new Date(camp.lastRunAt).toLocaleString()}</span>
                      )}
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(camp.categories || []).slice(0, 8).map(cat => (
                        <span key={cat} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] capitalize">{cat}</span>
                      ))}
                      {(camp.categories || []).length > 8 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">+{camp.categories.length - 8} more</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleRunNow(camp._id)} disabled={running === camp._id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 disabled:opacity-50"
                      title="Generate articles now">
                      {running === camp._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                      Run Now
                    </button>
                    <button onClick={() => handleToggle(camp._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        camp.isPaused ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      }`} title={camp.isPaused ? 'Resume' : 'Pause'}>
                      {camp.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(camp._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-purple-50 rounded-xl p-5 border border-purple-100">
            <h3 className="font-bold text-purple-900 mb-2">How Auto-Blog Works</h3>
            <div className="text-sm text-purple-700 space-y-1.5">
              <p>• The system runs <strong>every hour</strong> and checks if the current hour is in the campaign's posting schedule.</p>
              <p>• Each run, it picks random Special Users as authors and generates unique articles using AI (DeepSeek).</p>
              <p>• Leave <strong>Topics blank</strong> and AI will generate trending, timely topics automatically.</p>
              <p>• Articles include SEO metadata (title, description, keywords), featured images from Pexels, and proper formatting.</p>
              <p>• Use <strong>"Run Now"</strong> to trigger immediate article generation for testing.</p>
              <p>• Enable <strong>"Promote Social Links"</strong> to add your YouTube/Facebook/Instagram links at the end of each article.</p>
              <p>• Default posting hours: 6am, 8am, 10am, 12pm, 2pm, 4pm, 6pm, 8pm, 10pm (server timezone).</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
