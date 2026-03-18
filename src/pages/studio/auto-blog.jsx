// ============================================
// FILE: src/pages/studio/auto-blog.jsx
// Studio: User Auto-Blog — AI writes articles for you
// Respects plan limits (free=1/week, paid=more/day)
// VERSION: 1.0
// ============================================
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Bot, FileText, Zap, Loader2, Plus, Trash2, Play, Pause, Clock,
  Settings, ArrowLeft, TrendingUp, Wand2, ChevronRight, Crown,
  CheckCircle, Hash, Globe, Sparkles, Eye
} from 'lucide-react';
import api from '@/lib/api';

const ALL_CATEGORIES = [
  'technology', 'business', 'health', 'entertainment', 'sports', 'science',
  'lifestyle', 'news', 'education', 'faith', 'travel', 'food', 'music',
  'culture', 'finance', 'general'
];

const ALL_TONES = ['conversational', 'informative', 'inspiring', 'analytical', 'storytelling'];

export default function UserAutoBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [plan, setPlan] = useState('free');
  const [planLimits, setPlanLimits] = useState({});
  const [recentArticles, setRecentArticles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: 'My Auto-Blog',
    articlesPerDay: 1,
    topics: '',
    categories: ['technology', 'business', 'lifestyle', 'health'],
    tones: ['conversational', 'informative'],
    articleLength: 'medium',
    includeSEO: true,
    includeImages: true,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, blogsRes] = await Promise.all([
        api.get('/api/wallet').catch(() => ({ data: {} })),
        api.get('/api/blogs/my?limit=10&sort=-createdAt').catch(() => ({ data: { blogs: [] } })),
      ]);

      const w = walletRes.data?.wallet || walletRes.data || {};
      const currentPlan = w.subscription?.plan || 'free';
      setWallet(w);
      setPlan(currentPlan);

      // Get plan limits
      const plans = walletRes.data?.plans || {};
      const limits = plans[currentPlan]?.limits || {};
      setPlanLimits(limits);

      // Set max articles based on plan
      const maxPerDay = limits.autoBlogPerDay || 0;
      const maxPerWeek = limits.autoBlogPerWeek || 1;
      if (currentPlan === 'free') {
        setForm(f => ({ ...f, articlesPerDay: 0, name: 'My Weekly Article' }));
      } else {
        setForm(f => ({ ...f, articlesPerDay: Math.min(f.articlesPerDay, maxPerDay || 3) }));
      }

      // Get user's auto-blog campaigns
      try {
        const campRes = await api.get('/api/user-auto-blog/my-campaigns');
        setCampaigns(campRes.data?.campaigns || []);
      } catch { setCampaigns([]); }

      // Recent AI articles
      const blogs = blogsRes.data?.blogs || blogsRes.data?.data?.blogs || [];
      setRecentArticles(blogs.filter(b => b.isAIGenerated).slice(0, 5));

    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return alert('Give your auto-blog a name');
    setCreating(true);
    try {
      const payload = {
        ...form,
        topics: form.topics ? form.topics.split('\n').map(t => t.trim()).filter(Boolean) : [],
        articlesPerDay: plan === 'free' ? 0 : form.articlesPerDay,
      };
      await api.post('/api/user-auto-blog/campaigns', payload);
      setShowCreate(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create');
    } finally { setCreating(false); }
  };

  const handleToggle = async (id) => {
    try {
      await api.post(`/api/user-auto-blog/campaigns/${id}/toggle`);
      fetchData();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this auto-blog? This cannot be undone.')) return;
    try {
      await api.delete(`/api/user-auto-blog/campaigns/${id}`);
      fetchData();
    } catch {}
  };

  const handleRunNow = async (id) => {
    try {
      const { data } = await api.post(`/api/user-auto-blog/campaigns/${id}/run-now`);
      alert(`✅ ${data.message || 'Article generation started! Check your blog in a few minutes.'}`);
      setTimeout(() => fetchData(), 10000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed';
      if (msg.includes('limit') || msg.includes('upgrade')) {
        if (confirm(`${msg}\n\nUpgrade your plan?`)) router.push('/wallet');
      } else alert(msg);
    }
  };

  const maxArticlesPerDay = planLimits.autoBlogPerDay || 0;
  const isFreePlan = plan === 'free';

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head><title>Auto-Blog — CYBEV Studio</title></Head>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-600" />
              Auto-Blog
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">AI writes quality articles for you on schedule</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
            <Plus className="w-4 h-4" /> Set Up
          </button>
        </div>

        {/* Plan Info Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-purple-600" />
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isFreePlan
                  ? '1 AI article per week • Upgrade for daily articles'
                  : `Up to ${maxArticlesPerDay} articles per day`
                }
              </p>
            </div>
            {isFreePlan && (
              <Link href="/wallet">
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700">
                  Upgrade
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Create/Setup Form */}
        {showCreate && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-600" /> Set Up Auto-Blog
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. My Tech Blog, Health Tips..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              {/* Articles per day (paid only) */}
              {!isFreePlan && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                    Articles per day (max {maxArticlesPerDay})
                  </label>
                  <input type="number" min={1} max={maxArticlesPerDay}
                    value={form.articlesPerDay}
                    onChange={e => setForm({ ...form, articlesPerDay: Math.min(parseInt(e.target.value) || 1, maxArticlesPerDay) })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              )}

              {isFreePlan && (
                <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-700">
                  📝 Free plan: 1 AI article per week, generated automatically. Upgrade to get daily articles!
                </div>
              )}

              {/* Article length */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Article Length</label>
                <div className="flex gap-2">
                  {[
                    { v: 'short', l: 'Short (500 words)' },
                    { v: 'medium', l: 'Medium (800 words)' },
                    { v: 'long', l: 'Long (1200+ words)' },
                  ].map(({ v, l }) => (
                    <button key={v} onClick={() => setForm({ ...form, articleLength: v })}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border ${
                        form.articleLength === v ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'
                      }`}>{l}</button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Categories (pick your interests)</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => {
                      const cats = form.categories.includes(cat) ? form.categories.filter(c => c !== cat) : [...form.categories, cat];
                      setForm({ ...form, categories: cats });
                    }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border ${
                        form.categories.includes(cat) ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300'
                      }`}>{cat}</button>
                  ))}
                </div>
              </div>

              {/* Tones */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Writing Style</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TONES.map(tone => (
                    <button key={tone} onClick={() => {
                      const tones = form.tones.includes(tone) ? form.tones.filter(t => t !== tone) : [...form.tones, tone];
                      setForm({ ...form, tones });
                    }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border ${
                        form.tones.includes(tone) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'
                      }`}>{tone}</button>
                  ))}
                </div>
              </div>

              {/* Custom Topics */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">
                  Custom Topics (optional — leave blank for AI-generated trending topics)
                </label>
                <textarea value={form.topics} onChange={e => setForm({ ...form, topics: e.target.value })}
                  placeholder={"How to Start a Business in 2026\nHealthy Morning Routines\nBest Travel Destinations\n\n(Leave blank = AI picks topics for you)"}
                  rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>

              {/* Options */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.includeSEO}
                    onChange={e => setForm({ ...form, includeSEO: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600" />
                  <span className="text-sm text-gray-700">SEO Optimized</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.includeImages}
                    onChange={e => setForm({ ...form, includeImages: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600" />
                  <span className="text-sm text-gray-700">Include Images</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 text-gray-600 font-medium text-sm">Cancel</button>
                <button onClick={handleCreate} disabled={creating}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {creating ? 'Creating...' : 'Start Auto-Blog'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Campaigns */}
        {campaigns.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Your Auto-Blogs</h2>
            <div className="space-y-3">
              {campaigns.map(camp => (
                <div key={camp._id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      camp.isPaused ? 'bg-amber-100' : 'bg-green-100'
                    }`}>
                      {camp.isPaused ? <Pause className="w-5 h-5 text-amber-600" /> : <Play className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{camp.name}</h3>
                      <p className="text-xs text-gray-500">
                        {isFreePlan ? '1 article/week' : `${camp.articlesPerDay}/day`} • {camp.totalArticlesGenerated || 0} generated
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleRunNow(camp._id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100">
                        <Zap className="w-3.5 h-3.5 inline mr-1" />Write Now
                      </button>
                      <button onClick={() => handleToggle(camp._id)}
                        className={`p-2 rounded-lg ${camp.isPaused ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {camp.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(camp._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent AI Articles */}
        {recentArticles.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">Recent AI Articles</h2>
            <div className="space-y-2">
              {recentArticles.map(article => (
                <Link key={article._id} href={`/blog/${article.slug || article._id}`}>
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:bg-purple-50 cursor-pointer">
                    {article.featuredImage ? (
                      <img src={article.featuredImage} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-purple-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{article.views || 0}</span>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {campaigns.length === 0 && !showCreate && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <Bot className="w-14 h-14 text-purple-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">AI writes articles for you</h3>
            <p className="text-sm text-gray-500 mb-4">
              Set up Auto-Blog and AI will write quality, SEO-optimized articles on your behalf.
              {isFreePlan ? ' Free plan: 1 article per week.' : ` Your plan: up to ${maxArticlesPerDay} articles per day.`}
            </p>
            <button onClick={() => setShowCreate(true)}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700">
              <Sparkles className="w-4 h-4 inline mr-1.5" />Get Started
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
