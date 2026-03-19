// ============================================
// FILE: src/pages/studio/campaigns/ai.jsx
// PATH: cybev-frontend/src/pages/studio/campaigns/ai.jsx
// PURPOSE: AI Campaign Planner — 30-day content calendar generator
// VERSION: 1.1.0 — White design system
// ============================================
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Bot, Calendar, Sparkles, Loader2, Plus, Trash2, Play, Pause, Clock,
  ArrowLeft, ChevronLeft, ChevronRight, Edit3, RefreshCw, Send, Eye,
  Target, Wand2, Zap, LayoutGrid, List, Image, Video, Music, FileText,
  Share2, CheckCircle, XCircle, AlertCircle, Rocket, Copy, MoreVertical
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const NICHES = [
  'Ministry / Faith', 'Technology', 'Business / Finance', 'Health & Fitness',
  'Entertainment', 'Cooking / Food', 'Travel', 'Education', 'Fashion / Beauty',
  'Music', 'Sports', 'Real Estate', 'E-Commerce', 'Personal Brand', 'Other'
];

const VOICES = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'casual', label: 'Casual & Fun', emoji: '😎' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { id: 'educational', label: 'Educational', emoji: '📚' },
  { id: 'humorous', label: 'Humorous', emoji: '😂' },
  { id: 'bold', label: 'Bold & Edgy', emoji: '🔥' },
];

const PLATFORMS = [
  { id: 'cybev', name: 'CYBEV', emoji: '🌐' },
  { id: 'facebook', name: 'Facebook', emoji: '📘' },
  { id: 'instagram', name: 'Instagram', emoji: '📸' },
  { id: 'youtube', name: 'YouTube', emoji: '📺' },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵' },
  { id: 'twitter', name: 'X / Twitter', emoji: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼' },
];

const TYPE_COLORS = {
  blog: { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' },
  social_post: { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' },
  video_script: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
  graphics_prompt: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  music_prompt: { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' },
  reel_script: { bg: '#fce7f3', text: '#db2777', border: '#fbcfe8' },
  story: { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe' },
};

const TYPE_ICONS = { blog: FileText, social_post: Share2, video_script: Video, graphics_prompt: Image, music_prompt: Music, reel_script: Video, story: Image };
const TYPE_LABELS = { blog: 'Blog', social_post: 'Social', video_script: 'Video', graphics_prompt: 'Graphics', music_prompt: 'Music', reel_script: 'Reel', story: 'Story' };

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600', generating: 'bg-amber-100 text-amber-700', ready: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700', paused: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AICampaignPlanner() {
  const router = useRouter();
  const [view, setView] = useState('list');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');

  const [form, setForm] = useState({
    name: '', description: '', niche: 'Technology', targetAudience: '', brandVoice: 'professional',
    goals: ['grow engagement'], platforms: ['cybev', 'facebook', 'instagram'],
    durationDays: 30, postsPerDay: 2, postingTimes: ['09:00', '14:00'],
    autoPublish: false, autoGenerateAssets: false,
  });

  const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('cybev_token')}` } });
  const authJson = () => ({ headers: { ...getAuth().headers, 'Content-Type': 'application/json' } });

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = async () => {
    try { setLoading(true); const r = await fetch(`${API}/api/ai-campaigns`, getAuth()); const d = await r.json(); if (d.ok) setCampaigns(d.campaigns || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchCampaign = async (id) => {
    try { setLoading(true); const r = await fetch(`${API}/api/ai-campaigns/${id}`, getAuth()); const d = await r.json(); if (d.ok) { setActiveCampaign(d.campaign); setView('calendar'); } }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const createCampaign = async () => {
    if (!form.name || !form.niche) return;
    try { setLoading(true); const r = await fetch(`${API}/api/ai-campaigns`, { method: 'POST', ...authJson(), body: JSON.stringify({ ...form, startDate: new Date().toISOString() }) });
      const d = await r.json(); if (d.ok) { setActiveCampaign(d.campaign); setView('calendar'); fetchCampaigns(); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const generateCalendar = async () => {
    if (!activeCampaign) return; setGenerating(true);
    try { await fetch(`${API}/api/ai-campaigns/${activeCampaign._id}/generate`, { method: 'POST', ...getAuth() }); pollCampaign(activeCampaign._id); }
    catch (e) { console.error(e); setGenerating(false); }
  };

  const pollCampaign = (id) => {
    const poll = setInterval(async () => {
      try { const r = await fetch(`${API}/api/ai-campaigns/${id}`, getAuth()); const d = await r.json();
        if (d.ok && d.campaign.status !== 'generating') { clearInterval(poll); setActiveCampaign(d.campaign); setGenerating(false); }
      } catch { clearInterval(poll); setGenerating(false); }
    }, 5000);
    setTimeout(() => { clearInterval(poll); setGenerating(false); }, 120000);
  };

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    await fetch(`${API}/api/ai-campaigns/${id}`, { method: 'DELETE', ...getAuth() });
    setCampaigns(c => c.filter(x => x._id !== id));
    if (activeCampaign?._id === id) { setActiveCampaign(null); setView('list'); }
  };

  const toggleStatus = async (id, action) => {
    const r = await fetch(`${API}/api/ai-campaigns/${id}/${action}`, { method: 'POST', ...getAuth() });
    const d = await r.json(); if (d.ok) { setActiveCampaign(d.campaign); fetchCampaigns(); }
  };

  const regeneratePiece = async (dayNumber, contentId) => {
    try { await fetch(`${API}/api/ai-campaigns/${activeCampaign._id}/day/${dayNumber}/content/${contentId}/regenerate`, { method: 'POST', ...authJson(), body: JSON.stringify({}) });
      fetchCampaign(activeCampaign._id);
    } catch (e) { console.error(e); }
  };

  const sendToPublisher = async () => {
    if (!activeCampaign?.calendar?.length) return;
    const posts = [];
    for (const day of activeCampaign.calendar) {
      for (const piece of day.content) {
        if (piece.status !== 'ready') continue;
        const sd = new Date(day.date); const [h, m] = (piece.scheduledTime || '09:00').split(':'); sd.setHours(parseInt(h), parseInt(m), 0);
        posts.push({ campaign: activeCampaign._id, platforms: [{ platform: piece.platform === 'all' ? 'cybev' : piece.platform }],
          content: { text: piece.caption || piece.content || piece.title, title: piece.title, hashtags: piece.hashtags, callToAction: piece.callToAction },
          scheduledFor: sd.toISOString(), type: piece.type === 'blog' ? 'blog_share' : 'post',
          metadata: { source: 'campaign', campaignDay: day.dayNumber, campaignPieceId: piece._id } });
      }
    }
    try { const r = await fetch(`${API}/api/social-publisher/queue/bulk`, { method: 'POST', ...authJson(), body: JSON.stringify({ posts }) });
      const d = await r.json(); if (d.ok) { alert(`${d.count} posts scheduled!`); toggleStatus(activeCampaign._id, 'activate'); }
    } catch (e) { console.error(e); }
  };

  // ─── LIST ───
  const renderList = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-7 h-7 text-purple-600" /> AI Campaign Planner</h1>
          <p className="text-sm text-gray-500 mt-1">Generate 30-day content calendars with AI</p>
        </div>
        <button onClick={() => setView('create')} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
      : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Bot className="w-12 h-12 text-purple-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-500 mb-6">Let AI plan your entire month of content</p>
          <button onClick={() => setView('create')} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
            <Sparkles className="w-5 h-5" /> Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {campaigns.map(c => (
            <div key={c._id} onClick={() => fetchCampaign(c._id)} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.niche} • {c.durationDays} days • {c.postsPerDay}/day</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteCampaign(c._id); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex gap-6 mt-3 text-sm">
                <span className="text-gray-500 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {c.stats?.totalPieces || 0} pieces</span>
                <span className="text-gray-500 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {c.stats?.published || 0} published</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── CREATE ───
  const renderCreate = () => (
    <div>
      <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><Sparkles className="w-6 h-6 text-purple-600" /> Create AI Campaign</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-xl space-y-5">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Campaign Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., March Content Blitz"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Niche / Industry</label>
          <div className="flex flex-wrap gap-2">
            {NICHES.map(n => <button key={n} onClick={() => setForm(f => ({ ...f, niche: n }))} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${form.niche === n ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}>{n}</button>)}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Target Audience</label>
          <input value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))} placeholder="e.g., Young professionals aged 25-35"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Brand Voice</label>
          <div className="flex flex-wrap gap-2">
            {VOICES.map(v => <button key={v.id} onClick={() => setForm(f => ({ ...f, brandVoice: v.id }))} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${form.brandVoice === v.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}>{v.emoji} {v.label}</button>)}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => <button key={p.id} onClick={() => setForm(f => ({ ...f, platforms: f.platforms.includes(p.id) ? f.platforms.filter(x => x !== p.id) : [...f.platforms, p.id] }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${form.platforms.includes(p.id) ? 'bg-purple-50 text-purple-700 border-purple-400' : 'bg-white text-gray-500 border-gray-300 hover:border-purple-300'}`}>{p.emoji} {p.name}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Duration (days)</label>
            <input type="number" min={7} max={90} value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: parseInt(e.target.value) || 30 }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Posts/Day</label>
            <input type="number" min={1} max={10} value={form.postsPerDay} onChange={e => setForm(f => ({ ...f, postsPerDay: parseInt(e.target.value) || 2 }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
          </div>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" checked={form.autoPublish} onChange={e => setForm(f => ({ ...f, autoPublish: e.target.checked }))} className="w-4 h-4 rounded text-purple-600" /> Auto-publish</label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" checked={form.autoGenerateAssets} onChange={e => setForm(f => ({ ...f, autoGenerateAssets: e.target.checked }))} className="w-4 h-4 rounded text-purple-600" /> Auto-generate media</label>
        </div>
        <button onClick={createCampaign} disabled={!form.name || !form.niche}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50">
          <Rocket className="w-5 h-5" /> Create Campaign
        </button>
      </div>
    </div>
  );

  // ─── CALENDAR ───
  const renderCalendar = () => {
    if (!activeCampaign) return null;
    const cal = activeCampaign.calendar || [];
    const has = cal.length > 0;
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveCampaign(null); setView('list'); setSelectedDay(null); }} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{activeCampaign.name}</h2>
              <p className="text-xs text-gray-500">{activeCampaign.niche} • {activeCampaign.durationDays} days • {activeCampaign.platforms?.map(p => PLATFORMS.find(x => x.id === p)?.emoji || p).join(' ')}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {!has || activeCampaign.status === 'draft' ? (
              <button onClick={generateCalendar} disabled={generating} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} {generating ? 'Generating...' : 'Generate Calendar'}
              </button>
            ) : (<>
              <button onClick={() => setViewMode(v => v === 'calendar' ? 'list' : 'calendar')} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                {viewMode === 'calendar' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />} {viewMode === 'calendar' ? 'List' : 'Grid'}
              </button>
              <button onClick={generateCalendar} disabled={generating} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"><RefreshCw className="w-4 h-4" /> Regenerate</button>
              {activeCampaign.status === 'ready' && <button onClick={sendToPublisher} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"><Send className="w-4 h-4" /> Send to Publisher</button>}
              {activeCampaign.status === 'active' && <button onClick={() => toggleStatus(activeCampaign._id, 'pause')} className="flex items-center gap-1.5 px-3 py-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg"><Pause className="w-4 h-4" /> Pause</button>}
              {activeCampaign.status === 'paused' && <button onClick={() => toggleStatus(activeCampaign._id, 'activate')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"><Play className="w-4 h-4" /> Resume</button>}
            </>)}
          </div>
        </div>

        {generating && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI is crafting your content calendar...</h3>
            <p className="text-gray-500">Generating {activeCampaign.durationDays} days × {activeCampaign.postsPerDay} posts/day (30-60 sec)</p>
          </div>
        )}

        {has && !generating && viewMode === 'calendar' && (
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>)}
            {cal.map(day => {
              const sel = selectedDay?.dayNumber === day.dayNumber;
              const today = new Date(day.date).toDateString() === new Date().toDateString();
              return (
                <div key={day.dayNumber} onClick={() => setSelectedDay(sel ? null : day)}
                  className={`rounded-xl p-2.5 min-h-[90px] cursor-pointer transition-all border ${sel ? 'bg-purple-50 border-purple-400 shadow-md' : today ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold ${today ? 'text-amber-600' : 'text-gray-400'}`}>Day {day.dayNumber}</span>
                    <span className="text-[10px] text-gray-400">{new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="text-[11px] text-purple-600 font-medium mb-1.5 truncate">{day.theme}</div>
                  <div className="flex gap-1 flex-wrap">
                    {day.content.map((piece, i) => {
                      const tc = TYPE_COLORS[piece.type] || TYPE_COLORS.social_post;
                      const Icon = TYPE_ICONS[piece.type] || Share2;
                      return <span key={i} className="w-5 h-5 rounded flex items-center justify-center" style={{ background: tc.bg }}><Icon className="w-3 h-3" style={{ color: tc.text }} /></span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {has && !generating && viewMode === 'list' && (
          <div className="space-y-2">
            {cal.map(day => (
              <div key={day.dayNumber} onClick={() => setSelectedDay(selectedDay?.dayNumber === day.dayNumber ? null : day)}
                className="bg-white rounded-xl border border-gray-200 p-3.5 cursor-pointer hover:border-purple-200 hover:shadow-sm transition">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold text-sm min-w-[48px]">Day {day.dayNumber}</span>
                    <span className="text-gray-900 text-sm">{day.theme}</span>
                  </div>
                  <div className="flex gap-1">
                    {day.content.map((piece, i) => { const Icon = TYPE_ICONS[piece.type] || Share2; const tc = TYPE_COLORS[piece.type] || TYPE_COLORS.social_post;
                      return <Icon key={i} className="w-3.5 h-3.5" style={{ color: tc.text }} />; })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDay && (
          <div className="mt-5 bg-white rounded-2xl border-2 border-purple-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Day {selectedDay.dayNumber} — {selectedDay.theme}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(selectedDay.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {selectedDay.content.map((piece, idx) => {
                const tc = TYPE_COLORS[piece.type] || TYPE_COLORS.social_post;
                const Icon = TYPE_ICONS[piece.type] || Share2;
                const label = TYPE_LABELS[piece.type] || 'Post';
                return (
                  <div key={piece._id || idx} className="rounded-xl p-4" style={{ background: tc.bg + '44', border: `1px solid ${tc.border}` }}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: tc.text }} />
                        <span className="text-xs font-bold uppercase" style={{ color: tc.text }}>{label}</span>
                        <span className="text-xs text-gray-400">• {piece.platform} • {piece.scheduledTime}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => regeneratePiece(selectedDay.dayNumber, piece._id)} className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg" title="Regenerate"><RefreshCw className="w-3.5 h-3.5" /></button>
                        <button onClick={() => navigator.clipboard.writeText(piece.caption || piece.content || piece.title)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg" title="Copy"><Copy className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    {piece.title && <h4 className="font-semibold text-gray-900 mb-1 text-sm">{piece.title}</h4>}
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{piece.caption || piece.content?.substring(0, 300)}{piece.content?.length > 300 ? '...' : ''}</p>
                    {piece.hashtags?.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{piece.hashtags.map((t, i) => <span key={i} className="text-xs text-purple-600 font-medium">{t}</span>)}</div>}
                    {piece.mediaPrompt && <div className="mt-2 bg-white/80 rounded-lg p-2"><span className="text-amber-600 text-[11px] font-bold">📷 Media: </span><span className="text-gray-500 text-[11px]">{piece.mediaPrompt}</span></div>}
                    {piece.callToAction && <p className="text-xs text-green-600 font-medium mt-2">CTA: {piece.callToAction}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {has && (
          <div className="flex flex-wrap gap-4 mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
            {Object.entries(TYPE_COLORS).map(([type, tc]) => {
              const Icon = TYPE_ICONS[type] || Share2;
              return <div key={type} className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" style={{ color: tc.text }} /><span className="text-xs text-gray-500">{TYPE_LABELS[type]}</span></div>;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <Head><title>AI Campaign Planner | CYBEV Studio</title></Head>
      <div className="max-w-5xl mx-auto px-4 py-5">
        {view === 'list' && renderList()}
        {view === 'create' && renderCreate()}
        {view === 'calendar' && renderCalendar()}
      </div>
    </AppLayout>
  );
}
