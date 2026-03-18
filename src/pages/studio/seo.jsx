// ============================================
// FILE: studio/seo.jsx
// PATH: /src/pages/studio/seo.jsx
// CYBEV SEO Command Center — Studio Page
// VERSION: 1.0
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Search, Target, Zap, BarChart3, RefreshCw, Link2, FileCode, Globe,
  TrendingUp, ArrowUp, ArrowDown, Minus, Plus, Play, Pause, Trash2,
  ChevronRight, ChevronDown, Loader2, CheckCircle2, XCircle, AlertTriangle,
  Sparkles, Layers, Map, Users, Eye, MousePointerClick, Award, Flame,
  BookOpen, PenTool, Settings, Download, Copy, ExternalLink, Rocket,
  Brain, Crosshair, Shield, Star, Clock, Activity, Hash
} from 'lucide-react';

// ─── Tabs ───
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, desc: 'SEO health & analytics' },
  { id: 'keywords', label: 'Keywords', icon: Search, desc: 'Research & track keywords' },
  { id: 'content', label: 'Content Engine', icon: PenTool, desc: 'AI article campaigns' },
  { id: 'clusters', label: 'Clusters', icon: Layers, desc: 'Topical authority builder' },
  { id: 'programmatic', label: 'Programmatic', icon: Map, desc: 'Auto-generate 100s of pages' },
  { id: 'refresh', label: 'Refresh', icon: RefreshCw, desc: 'Update stale content' },
  { id: 'competitors', label: 'Competitors', icon: Crosshair, desc: 'Keyword gap analysis' },
  { id: 'interlinks', label: 'Interlinks', icon: Link2, desc: 'Internal link intelligence' },
  { id: 'schema', label: 'Schema', icon: FileCode, desc: 'Rich snippet generator' },
];

// ─── Score Badge ───
function ScoreBadge({ score, size = 'lg' }) {
  const color = score >= 80 ? 'text-emerald-600 border-emerald-500 bg-emerald-50' : score >= 60 ? 'text-blue-600 border-blue-500 bg-blue-50' : score >= 40 ? 'text-amber-600 border-amber-500 bg-amber-50' : 'text-red-600 border-red-500 bg-red-50';
  const sz = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-12 h-12 text-sm';
  return <div className={`${sz} rounded-full border-2 flex items-center justify-center font-bold ${color}`}>{score}</div>;
}

// ─── Stat Card ───
function StatCard({ icon: Icon, label, value, trend, color = 'purple' }) {
  const colors = { purple: 'bg-purple-50 text-purple-600', blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', red: 'bg-red-50 text-red-600' };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon size={18} /></div>
        {trend !== undefined && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {trend > 0 ? <ArrowUp size={12} /> : trend < 0 ? <ArrowDown size={12} /> : <Minus size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Geo Target Selector ───
function GeoTargetSelector({ value, onChange }) {
  const types = [
    { id: 'global', label: 'Global / Generic' },
    { id: 'continent', label: 'Continent' },
    { id: 'country', label: 'Country' },
    { id: 'city', label: 'City' },
    { id: 'town', label: 'Town / Village' },
  ];
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Geo Targeting</label>
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button key={t.id} onClick={() => onChange({ ...value, type: t.id, value: t.id === 'global' ? '' : (value?.value || '') })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${(value?.type || 'global') === t.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >{t.label}</button>
        ))}
      </div>
      {value?.type && value.type !== 'global' && (
        <input value={value?.value || ''} onChange={e => onChange({ ...value, value: e.target.value })}
          placeholder={`Enter ${value.type} name (e.g. ${value.type === 'country' ? 'Ghana, Nigeria, UK' : value.type === 'city' ? 'Accra, Lagos, London' : value.type === 'continent' ? 'Africa, Europe' : 'Ho, Tema, Lekki'})`}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
      )}
    </div>
  );
}

// ─── Social Channel Input (with persistent save) ───
function SocialChannelManager({ channels, onChange, showSave = true }) {
  const platforms = ['youtube', 'facebook', 'instagram', 'tiktok', 'twitter', 'linkedin', 'website', 'podcast'];
  const addChannel = () => onChange([...channels, { platform: 'youtube', url: '', promotionStyle: 'moderate', enabled: true }]);
  const removeChannel = (i) => onChange(channels.filter((_, idx) => idx !== i));
  const updateChannel = (i, field, val) => { const c = [...channels]; c[i] = { ...c[i], [field]: val }; onChange(c); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Social Channels to Promote</label>
        <button onClick={addChannel} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"><Plus size={12} /> Add</button>
      </div>
      {channels.map((ch, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <select value={ch.platform} onChange={e => updateChannel(i, 'platform', e.target.value)} className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
            {platforms.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          <input value={ch.url} onChange={e => updateChannel(i, 'url', e.target.value)} placeholder="https://..." className="flex-1 text-xs border border-gray-300 rounded-lg px-2 py-1.5" />
          <select value={ch.promotionStyle} onChange={e => updateChannel(i, 'promotionStyle', e.target.value)} className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
            <option value="subtle">Subtle</option><option value="moderate">Moderate</option><option value="aggressive">Aggressive</option>
          </select>
          <button onClick={() => removeChannel(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ))}
      {showSave && channels.length > 0 && (
        <div className="flex gap-2">
          <button onClick={async () => {
            try { await api.post('/api/seo/social-channels', { channels }); alert('Social channels saved! They will auto-load next time.'); } catch { alert('Failed to save'); }
          }} className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-lg">
            <CheckCircle2 size={12} /> Save channels
          </button>
          <button onClick={async () => {
            try { const { data } = await api.get('/api/seo/social-channels'); if (data.channels?.length) { onChange(data.channels); } else { alert('No saved channels found'); } } catch { alert('Failed to load'); }
          }} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg">
            <RefreshCw size={12} /> Load saved
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: DASHBOARD
// ═══════════════════════════════════════════
function DashboardTab() {
  const [health, setHealth] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/seo/health').catch(() => ({ data: null })),
      api.get('/api/seo/analytics?days=30').catch(() => ({ data: null }))
    ]).then(([h, a]) => {
      setHealth(h.data); setAnalytics(a.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-purple-600" /></div>;

  const h = health?.health || {};
  const s = health?.stats || {};

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <ScoreBadge score={h.overallScore || 0} />
          <div>
            <h3 className="text-lg font-bold text-gray-900">SEO Health Score: <span className={h.overallScore >= 60 ? 'text-emerald-600' : 'text-amber-600'}>{h.grade || 'N/A'}</span></h3>
            <p className="text-sm text-gray-500 mt-1">Based on content volume, freshness, velocity, and engagement</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Content', score: h.contentScore, icon: BookOpen },
            { label: 'Freshness', score: h.freshnessScore, icon: Clock },
            { label: 'Velocity', score: h.velocityScore, icon: Rocket },
            { label: 'Engagement', score: h.engagementScore, icon: Activity },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className="relative w-14 h-14 mx-auto mb-2">
                <svg className="w-14 h-14 -rotate-90"><circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="4" /><circle cx="28" cy="28" r="24" fill="none" stroke={m.score >= 60 ? '#10b981' : '#f59e0b'} strokeWidth="4" strokeDasharray={`${(m.score || 0) * 1.508} 151`} strokeLinecap="round" /></svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">{m.score || 0}</div>
              </div>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Published Articles" value={s.publishedBlogs || 0} color="purple" />
        <StatCard icon={Eye} label="Total Views" value={s.totalViews || 0} color="blue" />
        <StatCard icon={TrendingUp} label="Articles (30d)" value={s.recentBlogs30d || 0} color="emerald" />
        <StatCard icon={Target} label="Active Campaigns" value={s.activeCampaigns || 0} color="amber" />
      </div>

      {/* Recommendations */}
      {health?.recommendations?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Brain size={18} className="text-purple-600" /> AI Recommendations</h3>
          <div className="space-y-3">
            {health.recommendations.map((rec, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${rec.priority === 'high' ? 'bg-red-50 border border-red-200' : rec.priority === 'medium' ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-400'} text-white`}>
                  {rec.priority === 'high' ? <AlertTriangle size={12} /> : rec.priority === 'medium' ? <Flame size={12} /> : <Star size={12} />}
                </div>
                <p className="text-sm text-gray-700">{rec.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performers */}
      {health?.topBlogs?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award size={18} className="text-purple-600" /> Top Performing Articles</h3>
          <div className="space-y-2">
            {health.topBlogs.slice(0, 8).map((b, i) => (
              <div key={b._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">#{i + 1}</span>
                <span className="flex-1 text-sm text-gray-800 truncate">{b.title}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={12} /> {b.views?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: KEYWORD RESEARCH
// ═══════════════════════════════════════════
function KeywordsTab() {
  const [seed, setSeed] = useState('');
  const [niche, setNiche] = useState('');
  const [geoTarget, setGeoTarget] = useState({ type: 'global', value: '' });
  const [keywords, setKeywords] = useState(null);
  const [loading, setLoading] = useState(false);

  const research = async () => {
    if (!seed.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/api/seo/keywords/research', { seedKeyword: seed, niche, geoTarget: geoTarget.type !== 'global' ? geoTarget : undefined, count: 25 });
      setKeywords(data);
    } catch (e) { alert(e?.response?.data?.error || 'Research failed. Check that DeepSeek API key is set.'); }
    finally { setLoading(false); }
  };

  const getDiffColor = (d) => d < 30 ? 'text-emerald-600 bg-emerald-50' : d < 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const getIntentColor = (i) => ({ informational: 'bg-blue-100 text-blue-700', commercial: 'bg-purple-100 text-purple-700', transactional: 'bg-emerald-100 text-emerald-700', navigational: 'bg-gray-100 text-gray-700' })[i] || 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Search size={18} className="text-purple-600" /> AI Keyword Research</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input value={seed} onChange={e => setSeed(e.target.value)} placeholder="Enter seed keyword (e.g. gospel music)" className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" onKeyDown={e => e.key === 'Enter' && research()} />
          <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Niche (optional)" className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          <button onClick={research} disabled={loading || !seed.trim()} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-colors">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Researching...' : 'Research Keywords'}
          </button>
        </div>
        <GeoTargetSelector value={geoTarget} onChange={setGeoTarget} />
      </div>

      {keywords && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Hash} label="Keywords Found" value={keywords.totalKeywords} color="purple" />
            <StatCard icon={TrendingUp} label="Avg Volume" value={keywords.avgVolume} color="blue" />
            <StatCard icon={Shield} label="Avg Difficulty" value={keywords.avgDifficulty} color="amber" />
            <StatCard icon={Zap} label="Quick Wins" value={keywords.quickWins} color="emerald" />
          </div>

          {/* Cluster View */}
          {keywords.clusters && Object.keys(keywords.clusters).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Keyword Clusters</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(keywords.clusters).map(([name, kws]) => (
                  <span key={name} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{name} ({kws.length})</span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Keyword</th>
                    <th className="text-center px-3 py-3 font-medium text-gray-500">Volume</th>
                    <th className="text-center px-3 py-3 font-medium text-gray-500">Difficulty</th>
                    <th className="text-center px-3 py-3 font-medium text-gray-500">CPC</th>
                    <th className="text-center px-3 py-3 font-medium text-gray-500">Intent</th>
                    <th className="text-center px-3 py-3 font-medium text-gray-500">SERP Feature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {keywords.keywords?.map((kw, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{kw.keyword}</td>
                      <td className="text-center px-3 py-2.5 text-gray-600">{(kw.searchVolume || 0).toLocaleString()}</td>
                      <td className="text-center px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDiffColor(kw.difficulty || 50)}`}>{kw.difficulty || 50}</span></td>
                      <td className="text-center px-3 py-2.5 text-gray-600">${(kw.cpc || 0).toFixed(2)}</td>
                      <td className="text-center px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getIntentColor(kw.intent)}`}>{kw.intent}</span></td>
                      <td className="text-center px-3 py-2.5 text-xs text-gray-500">{kw.serpFeature || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: CONTENT ENGINE
// ═══════════════════════════════════════════
function ContentTab() {
  const [mode, setMode] = useState('single'); // single | bulk
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState('professional');
  const [geoTarget, setGeoTarget] = useState({ type: 'global', value: '' });
  const [socialChannels, setSocialChannels] = useState([]);
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);

  // Load saved channels on mount
  useEffect(() => {
    api.get('/api/seo/social-channels').then(({ data }) => {
      if (data.channels?.length) setSocialChannels(data.channels);
    }).catch(() => {});
  }, []);

  const generateSingle = async () => {
    if (!keyword.trim()) return;
    setGenerating(true); setResult(null);
    try {
      const { data } = await api.post('/api/seo/content/generate', { keyword, title: title || undefined, niche, tone, geoTarget: geoTarget.type !== 'global' ? geoTarget : undefined, socialChannels: socialChannels.filter(c => c.url), includeFAQ: true });
      setResult(data);
    } catch (e) { alert(e?.response?.data?.error || 'Generation failed'); }
    finally { setGenerating(false); }
  };

  const generateBulk = async () => {
    const kws = bulkKeywords.split('\n').map(k => k.trim()).filter(Boolean);
    if (!kws.length) return;
    setGenerating(true); setBulkResult(null);
    try {
      const { data } = await api.post('/api/seo/content/bulk-generate', { keywords: kws, niche, tone, geoTarget: geoTarget.type !== 'global' ? geoTarget : undefined, socialChannels: socialChannels.filter(c => c.url), count: kws.length });
      setBulkResult(data);
    } catch (e) { alert(e?.response?.data?.error || 'Bulk generation failed'); }
    finally { setGenerating(false); }
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        {[{ id: 'single', label: 'Single Article', icon: PenTool }, { id: 'bulk', label: 'Bulk Campaign', icon: Rocket }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${mode === m.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <m.icon size={16} /> {m.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        {mode === 'single' ? (
          <>
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><PenTool size={18} className="text-purple-600" /> Generate SEO Article</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Target Keyword *</label>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. best gospel songs 2026" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Custom Title (optional)</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Leave blank for AI-generated title" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Niche</label>
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. music, ministry, tech" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                  <option value="professional">Professional</option><option value="conversational">Conversational</option><option value="authoritative">Authoritative</option><option value="inspirational">Inspirational</option><option value="casual">Casual</option><option value="academic">Academic</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Rocket size={18} className="text-purple-600" /> Bulk Content Campaign</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Keywords (one per line)</label>
                <textarea value={bulkKeywords} onChange={e => setBulkKeywords(e.target.value)} rows={6} placeholder={"best gospel songs 2026\nhow to start a church ministry\nchristian content creation tips\npastor training online\nworship music production"} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono" />
                <p className="text-xs text-gray-400 mt-1">{bulkKeywords.split('\n').filter(k => k.trim()).length} keywords</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Niche</label>
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. ministry" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                  <option value="professional">Professional</option><option value="conversational">Conversational</option><option value="authoritative">Authoritative</option><option value="inspirational">Inspirational</option>
                </select>
              </div>
            </div>
          </>
        )}

        <GeoTargetSelector value={geoTarget} onChange={setGeoTarget} />
        <SocialChannelManager channels={socialChannels} onChange={setSocialChannels} />

        <div className="flex items-center justify-end pt-2">
          <button onClick={mode === 'single' ? generateSingle : generateBulk}
            disabled={generating || (mode === 'single' ? !keyword.trim() : !bulkKeywords.trim())}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {generating ? 'Generating...' : mode === 'single' ? 'Generate Article' : `Generate ${bulkKeywords.split('\n').filter(k => k.trim()).length} Articles`}
          </button>
        </div>
      </div>

      {/* Single Result */}
      {result?.success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 mt-0.5" />
            <div>
              {result.blog ? (
                <>
                  <h4 className="font-bold text-emerald-800">{result.blog.title}</h4>
                  <p className="text-sm text-emerald-700 mt-1">{result.blog.excerpt}</p>
                  <a href={result.blog.url} target="_blank" rel="noopener" className="text-sm text-emerald-700 hover:underline mt-2 inline-flex items-center gap-1"><ExternalLink size={12} /> View Article</a>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-emerald-800">Article generation started!</h4>
                  <p className="text-sm text-emerald-700 mt-1">Keyword: "{result.keyword || keyword}". Estimated time: {result.estimatedTime || '60-90 seconds'}. The article will appear in your blog feed once ready.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Result */}
      {bulkResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Rocket size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-800">{bulkResult.message}</h4>
              <p className="text-sm text-blue-700 mt-1">Estimated time: {bulkResult.estimatedTime}. Articles will appear in your blog feed as they're generated.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {bulkResult.keywords?.map(k => <span key={k} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{k}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: CONTENT CLUSTERS
// ═══════════════════════════════════════════
function ClustersTab() {
  const [pillar, setPillar] = useState('');
  const [niche, setNiche] = useState('');
  const [count, setCount] = useState(10);
  const [geoTarget, setGeoTarget] = useState({ type: 'global', value: '' });
  const [planning, setPlanning] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [plan, setPlan] = useState(null);
  const [socialChannels, setSocialChannels] = useState([]);
  const [deployResult, setDeployResult] = useState(null);

  useEffect(() => { api.get('/api/seo/social-channels').then(({ data }) => { if (data.channels?.length) setSocialChannels(data.channels); }).catch(() => {}); }, []);

  const planCluster = async () => {
    if (!pillar.trim()) return;
    setPlanning(true); setPlan(null);
    try {
      const { data } = await api.post('/api/seo/cluster/plan', { pillarKeyword: pillar, niche, articleCount: count, geoTarget: geoTarget.type !== 'global' ? geoTarget : undefined });
      setPlan(data.plan);
    } catch (e) { alert(e?.response?.data?.error || 'Planning failed'); }
    finally { setPlanning(false); }
  };

  const deployCluster = async () => {
    if (!plan) return;
    setDeploying(true);
    try {
      const { data } = await api.post('/api/seo/cluster/deploy', { plan, geoTarget: geoTarget.type !== 'global' ? geoTarget : undefined, socialChannels: socialChannels.filter(c => c.url) });
      setDeployResult(data);
    } catch (e) { alert(e?.response?.data?.error || 'Deploy failed'); }
    finally { setDeploying(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Layers size={18} className="text-purple-600" /> Content Cluster Builder</h3>
        <p className="text-sm text-gray-500">Build topical authority by deploying a pillar article + supporting articles all interlinked. Google rewards this structure.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={pillar} onChange={e => setPillar(e.target.value)} placeholder="Pillar keyword (e.g. worship music)" className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Niche (optional)" className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Articles:</label>
            <select value={count} onChange={e => setCount(Number(e.target.value))} className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white">
              <option value={5}>5</option><option value={10}>10</option><option value={15}>15</option><option value={20}>20</option>
            </select>
          </div>
        </div>
        <GeoTargetSelector value={geoTarget} onChange={setGeoTarget} />
        <SocialChannelManager channels={socialChannels} onChange={setSocialChannels} />
        <button onClick={planCluster} disabled={planning || !pillar.trim()} className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
          {planning ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
          {planning ? 'Planning...' : 'Plan Cluster'}
        </button>
      </div>

      {plan?.pillarArticle && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Cluster Plan</h3>
            <button onClick={deployCluster} disabled={deploying} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
              {deploying ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
              {deploying ? 'Deploying...' : `Deploy All (${1 + (plan.supportingArticles?.length || 0)} articles)`}
            </button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1"><Star size={14} className="text-purple-600" /> <span className="text-xs font-bold text-purple-600 uppercase">Pillar Article</span></div>
            <h4 className="font-bold text-gray-900">{plan.pillarArticle.title}</h4>
            <p className="text-xs text-gray-500 mt-1">Keyword: {plan.pillarArticle.keyword}</p>
          </div>

          <div className="space-y-2">
            {plan.supportingArticles?.map((sa, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                <div>
                  <h5 className="text-sm font-medium text-gray-800">{sa.title}</h5>
                  <p className="text-xs text-gray-500">{sa.keyword} · {sa.targetSerpFeature || 'article'}</p>
                </div>
              </div>
            ))}
          </div>
          {plan.interlinkingStrategy && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3"><strong>Interlinking:</strong> {plan.interlinkingStrategy}</p>}
        </div>
      )}

      {deployResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <CheckCircle2 size={20} className="text-emerald-600 mb-2" />
          <h4 className="font-bold text-emerald-800">{deployResult.message}</h4>
          <p className="text-sm text-emerald-700">Estimated: {deployResult.estimatedTime}. Articles will be published as they generate.</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: PROGRAMMATIC SEO
// ═══════════════════════════════════════════
function ProgrammaticTab() {
  const [titleTemplate, setTitleTemplate] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [variables, setVariables] = useState([{ name: 'city', values: '' }]);
  const [category, setCategory] = useState('general');
  const [geoTarget, setGeoTarget] = useState({ type: 'global', value: '' });
  const [socialChannels, setSocialChannels] = useState([]);
  const [batchSize, setBatchSize] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { api.get('/api/seo/social-channels').then(({ data }) => { if (data.channels?.length) setSocialChannels(data.channels); }).catch(() => {}); }, []);

  const addVariable = () => setVariables([...variables, { name: '', values: '' }]);
  const updateVar = (i, field, val) => { const v = [...variables]; v[i] = { ...v[i], [field]: val }; setVariables(v); };
  const removeVar = (i) => setVariables(variables.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (!titleTemplate) return;
    setGenerating(true);
    try {
      const vars = variables.filter(v => v.name && v.values).map(v => ({ name: v.name, values: v.values.split(',').map(s => s.trim()).filter(Boolean) }));
      if (vars.length === 0) { alert('Add at least one variable with comma-separated values'); setGenerating(false); return; }
      const { data } = await api.post('/api/seo/programmatic/generate', { titleTemplate, promptTemplate: promptTemplate || undefined, variables: vars, category, geoTarget: geoTarget.type !== 'global' ? geoTarget : undefined, socialChannels: socialChannels.filter(c => c.url), batchSize });
      setResult(data);
    } catch (e) { alert(e?.response?.data?.error || 'Generation failed'); }
    finally { setGenerating(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><Map size={18} className="text-purple-600" /> Programmatic SEO</h3>
          <p className="text-sm text-gray-500 mt-1">Auto-generate hundreds of niche-specific pages by combining templates with variables.</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Title Template *</label>
          <input value={titleTemplate} onChange={e => setTitleTemplate(e.target.value)} placeholder="Best {topic} in {city} — Complete Guide 2026" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          <p className="text-xs text-gray-400 mt-1">Use {'{variable_name}'} for dynamic parts</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Prompt Template (optional)</label>
          <textarea value={promptTemplate} onChange={e => setPromptTemplate(e.target.value)} rows={3} placeholder="Write about the best {topic} options available in {city}. Include local context, pricing, and expert recommendations." className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Variables</label>
            <button onClick={addVariable} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"><Plus size={12} /> Add Variable</button>
          </div>
          {variables.map((v, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input value={v.name} onChange={e => updateVar(i, 'name', e.target.value)} placeholder="Variable name" className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-xs" />
              <input value={v.values} onChange={e => updateVar(i, 'values', e.target.value)} placeholder="Values (comma-separated): Accra, Lagos, Nairobi, London" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs" />
              {variables.length > 1 && <button onClick={() => removeVar(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Batch Size</label>
            <select value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white">
              <option value={5}>5 pages</option><option value={10}>10 pages</option><option value={25}>25 pages</option><option value={50}>50 pages</option>
            </select>
          </div>
        </div>

        <GeoTargetSelector value={geoTarget} onChange={setGeoTarget} />
        <SocialChannelManager channels={socialChannels} onChange={setSocialChannels} />

        <button onClick={generate} disabled={generating || !titleTemplate} className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium disabled:opacity-50">
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
          {generating ? 'Generating...' : 'Generate Pages'}
        </button>
      </div>

      {result && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-bold text-blue-800 mb-2">{result.message}</h4>
          <p className="text-sm text-blue-700 mb-3">Total combinations: {result.totalCombinations} | Batch: {result.batchSize}</p>
          {result.sampleTitles?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-blue-600">Sample titles being generated:</p>
              {result.sampleTitles.map((t, i) => <p key={i} className="text-xs text-blue-700">• {t}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: CONTENT REFRESH
// ═══════════════════════════════════════════
function RefreshTab() {
  const [candidates, setCandidates] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState({});

  const scan = async () => {
    setScanning(true);
    try {
      const { data } = await api.post('/api/seo/refresh/scan', { days: 30, minViews: 5 });
      setCandidates(data.candidates);
    } catch { alert('Scan failed'); }
    finally { setScanning(false); }
  };

  const refresh = async (blogId) => {
    setRefreshing(r => ({ ...r, [blogId]: true }));
    try {
      const { data } = await api.post('/api/seo/refresh/execute', { blogId });
      setCandidates(prev => prev.map(c => c._id === blogId ? { ...c, refreshed: true, changes: data.changes } : c));
    } catch { alert('Refresh failed'); }
    finally { setRefreshing(r => ({ ...r, [blogId]: false })); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><RefreshCw size={18} className="text-purple-600" /> Content Refresh Engine</h3>
            <p className="text-sm text-gray-500 mt-1">Find and auto-update stale articles to boost rankings</p>
          </div>
          <button onClick={scan} disabled={scanning} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {scanning ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {scanning ? 'Scanning...' : 'Scan for Stale Content'}
          </button>
        </div>

        {candidates && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{candidates.length} articles need refreshing</p>
            {candidates.map(c => (
              <div key={c._id} className={`flex items-center gap-3 p-3 rounded-xl ${c.refreshed ? 'bg-emerald-50 border border-emerald-200' : c.urgency === 'high' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-800 truncate">{c.title}</h5>
                  <p className="text-xs text-gray-500">{c.views} views · {c.daysSinceUpdate} days since update · {c.category}</p>
                  {c.changes && <p className="text-xs text-emerald-700 mt-1">{c.changes.length} changes applied</p>}
                </div>
                {c.refreshed ? (
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <button onClick={() => refresh(c._id)} disabled={refreshing[c._id]} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex-shrink-0">
                    {refreshing[c._id] ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    Refresh
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: COMPETITORS
// ═══════════════════════════════════════════
function CompetitorsTab() {
  const [domain, setDomain] = useState('');
  const [niche, setNiche] = useState('');
  const [gaps, setGaps] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/api/seo/keywords/gap', { competitorDomain: domain, ourNiche: niche, count: 20 });
      setGaps(data);
    } catch { alert('Analysis failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Crosshair size={18} className="text-purple-600" /> Competitor Keyword Gap Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="Competitor domain (e.g. competitor.com)" className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Your niche" className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          <button onClick={analyze} disabled={loading || !domain.trim()} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Target size={16} />}
            {loading ? 'Analyzing...' : 'Find Gaps'}
          </button>
        </div>
      </div>

      {gaps?.gaps?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-purple-50 border-b border-gray-200">
            <p className="text-sm font-medium text-purple-800">{gaps.gaps.length} keyword gaps found · <span className="text-emerald-700">{gaps.highOpportunity} high opportunity</span></p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b"><tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Keyword</th>
                <th className="text-center px-3 py-3 font-medium text-gray-500">Their Rank</th>
                <th className="text-center px-3 py-3 font-medium text-gray-500">Volume</th>
                <th className="text-center px-3 py-3 font-medium text-gray-500">Opportunity</th>
                <th className="text-left px-3 py-3 font-medium text-gray-500">Suggested Title</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {gaps.gaps.map((g, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-800">{g.keyword}</td>
                    <td className="text-center px-3 py-2.5 text-gray-600">#{g.competitorEstimatedRank}</td>
                    <td className="text-center px-3 py-2.5 text-gray-600">{(g.searchVolume || 0).toLocaleString()}</td>
                    <td className="text-center px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${g.opportunity === 'high' ? 'bg-emerald-100 text-emerald-700' : g.opportunity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{g.opportunity}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-500 max-w-xs truncate">{g.suggestedTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: INTERLINKS
// ═══════════════════════════════════════════
function InterlinksTab() {
  const [opps, setOpps] = useState(null);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/seo/interlink/scan');
      setOpps(data);
    } catch { alert('Scan failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Link2 size={18} className="text-purple-600" /> Internal Link Intelligence</h3>
            <p className="text-sm text-gray-500 mt-1">AI finds link opportunities between your articles to strengthen topical authority</p>
          </div>
          <button onClick={scan} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? 'Scanning...' : 'Scan Articles'}
          </button>
        </div>

        {opps?.opportunities?.length > 0 && (
          <div className="space-y-3">
            {opps.opportunities.map((o, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Link2 size={14} className="text-purple-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-gray-800"><span className="font-medium">{o.fromTitle}</span> → <span className="font-medium">{o.toTitle}</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">Anchor: "{o.anchorText}" · {o.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: SCHEMA MARKUP
// ═══════════════════════════════════════════
function SchemaTab() {
  const [blogId, setBlogId] = useState('');
  const [types, setTypes] = useState(['article', 'faq', 'breadcrumb']);
  const [schemas, setSchemas] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!blogId.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/api/seo/schema/generate', { blogId, schemaTypes: types });
      setSchemas(data.schemas);
    } catch { alert('Failed'); }
    finally { setLoading(false); }
  };

  const toggleType = (t) => setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FileCode size={18} className="text-purple-600" /> Schema Markup Generator</h3>
        <div className="flex gap-3 mb-4">
          <input value={blogId} onChange={e => setBlogId(e.target.value)} placeholder="Blog ID" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          <button onClick={generate} disabled={loading || !blogId.trim()} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Generate'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['article', 'faq', 'breadcrumb', 'howto'].map(t => (
            <button key={t} onClick={() => toggleType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${types.includes(t) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{t}</button>
          ))}
        </div>
      </div>
      {schemas?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          {schemas.map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-400 font-mono">{s['@type']}</span>
                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(s, null, 2))} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><Copy size={12} /> Copy</button>
              </div>
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{JSON.stringify(s, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function SEOCommandCenter() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const TAB_COMPONENTS = {
    dashboard: DashboardTab,
    keywords: KeywordsTab,
    content: ContentTab,
    clusters: ClustersTab,
    programmatic: ProgrammaticTab,
    refresh: RefreshTab,
    competitors: CompetitorsTab,
    interlinks: InterlinksTab,
    schema: SchemaTab
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardTab;

  return (
    <AppLayout>
      <Head><title>SEO Command Center — CYBEV</title></Head>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="text-purple-600" size={28} />
            SEO Command Center
          </h1>
          <p className="text-gray-500 mt-1">Create, deploy, interlink, and track — the SEO weapon nobody else has</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <ActiveComponent />
      </div>
    </AppLayout>
  );
}
