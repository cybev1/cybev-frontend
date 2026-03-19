// ============================================
// FILE: src/pages/studio/campaigns/ai.jsx
// PATH: cybev-frontend/src/pages/studio/campaigns/ai.jsx
// PURPOSE: AI Campaign Planner — 30-day content calendar generator
// VERSION: 1.0.0
// ============================================
import { useState, useEffect, useCallback } from 'react';
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
import api from '@/lib/api';

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

const TYPE_ICONS = {
  blog: FileText,
  social_post: Share2,
  video_script: Video,
  graphics_prompt: Image,
  music_prompt: Music,
  reel_script: Video,
  story: Image,
};

const TYPE_COLORS = {
  blog: '#3b82f6',
  social_post: '#8b5cf6',
  video_script: '#ef4444',
  graphics_prompt: '#f59e0b',
  music_prompt: '#10b981',
  reel_script: '#ec4899',
  story: '#6366f1',
};

const STATUS_COLORS = {
  planned: '#6b7280', generating: '#f59e0b', ready: '#3b82f6',
  published: '#10b981', failed: '#ef4444', skipped: '#9ca3af',
  draft: '#6b7280', active: '#10b981', paused: '#f59e0b', completed: '#3b82f6',
};

export default function AICampaignPlanner() {
  const router = useRouter();
  const [view, setView] = useState('list'); // list, create, calendar, detail
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(0); // offset from start
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingPiece, setEditingPiece] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list

  // Create form
  const [form, setForm] = useState({
    name: '', description: '', niche: 'Technology',
    targetAudience: '', brandVoice: 'professional',
    goals: ['grow engagement'], platforms: ['cybev', 'facebook', 'instagram'],
    durationDays: 30, postsPerDay: 2,
    postingTimes: ['09:00', '14:00'],
    autoPublish: false, autoGenerateAssets: false,
  });

  const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('cybev_token')}` } });

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/ai-campaigns`, getAuth());
      const data = await res.json();
      if (data.ok) setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Fetch campaigns error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaign = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/ai-campaigns/${id}`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setActiveCampaign(data.campaign);
        setView('calendar');
      }
    } catch (err) {
      console.error('Fetch campaign error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!form.name || !form.niche) return;
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/ai-campaigns`, {
        method: 'POST', ...getAuth(),
        headers: { ...getAuth().headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, startDate: new Date().toISOString() })
      });
      const data = await res.json();
      if (data.ok) {
        setActiveCampaign(data.campaign);
        setView('calendar');
        fetchCampaigns();
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const generateCalendar = async () => {
    if (!activeCampaign) return;
    setGenerating(true);
    try {
      const res = await fetch(`${API}/api/ai-campaigns/${activeCampaign._id}/generate`, {
        method: 'POST', ...getAuth()
      });
      const data = await res.json();
      if (data.ok) {
        // Poll for completion
        pollCampaign(activeCampaign._id);
      }
    } catch (err) { console.error(err); }
  };

  const pollCampaign = (id) => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/ai-campaigns/${id}`, getAuth());
        const data = await res.json();
        if (data.ok && data.campaign.status !== 'generating') {
          clearInterval(poll);
          setActiveCampaign(data.campaign);
          setGenerating(false);
        }
      } catch { clearInterval(poll); setGenerating(false); }
    }, 5000);
    // Safety timeout
    setTimeout(() => { clearInterval(poll); setGenerating(false); }, 120000);
  };

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    await fetch(`${API}/api/ai-campaigns/${id}`, { method: 'DELETE', ...getAuth() });
    setCampaigns(c => c.filter(x => x._id !== id));
    if (activeCampaign?._id === id) { setActiveCampaign(null); setView('list'); }
  };

  const toggleStatus = async (id, action) => {
    const res = await fetch(`${API}/api/ai-campaigns/${id}/${action}`, { method: 'POST', ...getAuth() });
    const data = await res.json();
    if (data.ok) {
      setActiveCampaign(data.campaign);
      fetchCampaigns();
    }
  };

  const regeneratePiece = async (dayNumber, contentId) => {
    try {
      const res = await fetch(`${API}/api/ai-campaigns/${activeCampaign._id}/day/${dayNumber}/content/${contentId}/regenerate`, {
        method: 'POST', ...getAuth(),
        headers: { ...getAuth().headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.ok) fetchCampaign(activeCampaign._id);
    } catch (err) { console.error(err); }
  };

  const sendToPublisher = async () => {
    if (!activeCampaign?.calendar?.length) return;
    // Collect all ready pieces and schedule them via social publisher
    const posts = [];
    for (const day of activeCampaign.calendar) {
      for (const piece of day.content) {
        if (piece.status !== 'ready') continue;
        const scheduledDate = new Date(day.date);
        const [h, m] = (piece.scheduledTime || '09:00').split(':');
        scheduledDate.setHours(parseInt(h), parseInt(m), 0);

        posts.push({
          campaign: activeCampaign._id,
          platforms: [{ platform: piece.platform === 'all' ? 'cybev' : piece.platform }],
          content: {
            text: piece.caption || piece.content || piece.title,
            title: piece.title,
            hashtags: piece.hashtags,
            callToAction: piece.callToAction
          },
          scheduledFor: scheduledDate.toISOString(),
          type: piece.type === 'blog' ? 'blog_share' : 'post',
          metadata: { source: 'campaign', campaignDay: day.dayNumber, campaignPieceId: piece._id }
        });
      }
    }

    try {
      const res = await fetch(`${API}/api/social-publisher/queue/bulk`, {
        method: 'POST',
        headers: { ...getAuth().headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts })
      });
      const data = await res.json();
      if (data.ok) {
        alert(`${data.count} posts scheduled for publishing!`);
        toggleStatus(activeCampaign._id, 'activate');
      }
    } catch (err) { console.error(err); }
  };

  // ─── RENDER: Campaign List ───
  const renderList = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>AI Campaign Planner</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Generate 30-day content calendars with AI</p>
        </div>
        <button onClick={() => setView('create')} style={btnPrimary}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Loader2 size={32} className="animate-spin" style={{ color: '#8b5cf6' }} /></div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#1a1a2e', borderRadius: 16, border: '1px solid #2a2a4a' }}>
          <Bot size={48} style={{ color: '#8b5cf6', margin: '0 auto 16px' }} />
          <h3 style={{ color: '#fff', marginBottom: 8 }}>No campaigns yet</h3>
          <p style={{ color: '#9ca3af', marginBottom: 24 }}>Let AI plan your entire month of content</p>
          <button onClick={() => setView('create')} style={btnPrimary}><Sparkles size={18} /> Create Your First Campaign</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {campaigns.map(c => (
            <div key={c._id} onClick={() => fetchCampaign(c._id)} style={{
              background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #2a2a4a',
              cursor: 'pointer', transition: 'border-color 0.2s',
            }} onMouseOver={e => e.currentTarget.style.borderColor = '#8b5cf6'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#2a2a4a'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>{c.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>
                    {c.niche} • {c.durationDays} days • {c.postsPerDay}/day
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    background: STATUS_COLORS[c.status] + '22', color: STATUS_COLORS[c.status],
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'uppercase'
                  }}>{c.status}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteCampaign(c._id); }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
                <Stat icon={FileText} label="Pieces" value={c.stats?.totalPieces || 0} />
                <Stat icon={CheckCircle} label="Published" value={c.stats?.published || 0} />
                <Stat icon={Target} label="Platforms" value={c.platforms?.length || 0} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── RENDER: Create Campaign ───
  const renderCreate = () => (
    <div>
      <button onClick={() => setView('list')} style={{ ...btnGhost, marginBottom: 16 }}>
        <ArrowLeft size={18} /> Back
      </button>
      <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        <Sparkles size={24} style={{ color: '#8b5cf6', marginRight: 8, verticalAlign: 'middle' }} />
        Create AI Campaign
      </h2>

      <div style={{ display: 'grid', gap: 20, maxWidth: 640 }}>
        <Field label="Campaign Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g., March Content Blitz" />
        <Field label="Description (optional)" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief description of this campaign" />

        <div>
          <label style={labelStyle}>Niche / Industry</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {NICHES.map(n => (
              <button key={n} onClick={() => setForm(f => ({ ...f, niche: n }))}
                style={{ ...chipStyle, background: form.niche === n ? '#8b5cf6' : '#2a2a4a', color: form.niche === n ? '#fff' : '#ccc' }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <Field label="Target Audience" value={form.targetAudience} onChange={v => setForm(f => ({ ...f, targetAudience: v }))} placeholder="e.g., Young professionals aged 25-35 interested in tech" />

        <div>
          <label style={labelStyle}>Brand Voice</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {VOICES.map(v => (
              <button key={v.id} onClick={() => setForm(f => ({ ...f, brandVoice: v.id }))}
                style={{ ...chipStyle, background: form.brandVoice === v.id ? '#8b5cf6' : '#2a2a4a', color: form.brandVoice === v.id ? '#fff' : '#ccc' }}>
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Publish to Platforms</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.map(p => (
              <button key={p.id}
                onClick={() => setForm(f => ({
                  ...f, platforms: f.platforms.includes(p.id)
                    ? f.platforms.filter(x => x !== p.id)
                    : [...f.platforms, p.id]
                }))}
                style={{
                  ...chipStyle,
                  background: form.platforms.includes(p.id) ? '#8b5cf622' : '#2a2a4a',
                  border: `1px solid ${form.platforms.includes(p.id) ? '#8b5cf6' : '#3a3a5a'}`,
                  color: form.platforms.includes(p.id) ? '#c4b5fd' : '#9ca3af'
                }}>
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Duration (days)</label>
            <input type="number" min={7} max={90} value={form.durationDays}
              onChange={e => setForm(f => ({ ...f, durationDays: parseInt(e.target.value) || 30 }))}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Posts per Day</label>
            <input type="number" min={1} max={10} value={form.postsPerDay}
              onChange={e => setForm(f => ({ ...f, postsPerDay: parseInt(e.target.value) || 2 }))}
              style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.autoPublish} onChange={e => setForm(f => ({ ...f, autoPublish: e.target.checked }))} />
            Auto-publish when ready
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.autoGenerateAssets} onChange={e => setForm(f => ({ ...f, autoGenerateAssets: e.target.checked }))} />
            Auto-generate images/videos
          </label>
        </div>

        <button onClick={createCampaign} disabled={!form.name || !form.niche} style={{
          ...btnPrimary, width: '100%', padding: '14px 24px', fontSize: 16, opacity: (!form.name || !form.niche) ? 0.5 : 1
        }}>
          <Rocket size={20} /> Create Campaign
        </button>
      </div>
    </div>
  );

  // ─── RENDER: Calendar View ───
  const renderCalendar = () => {
    if (!activeCampaign) return null;
    const cal = activeCampaign.calendar || [];
    const hasCalendar = cal.length > 0;

    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => { setActiveCampaign(null); setView('list'); setSelectedDay(null); }} style={btnGhost}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>{activeCampaign.name}</h2>
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
                {activeCampaign.niche} • {activeCampaign.durationDays} days • {activeCampaign.platforms?.map(p => PLATFORMS.find(x => x.id === p)?.emoji || p).join(' ')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!hasCalendar || activeCampaign.status === 'draft' ? (
              <button onClick={generateCalendar} disabled={generating} style={btnPrimary}>
                {generating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                {generating ? 'Generating...' : 'Generate Calendar'}
              </button>
            ) : (
              <>
                <button onClick={() => setViewMode(v => v === 'calendar' ? 'list' : 'calendar')} style={btnGhost}>
                  {viewMode === 'calendar' ? <List size={16} /> : <LayoutGrid size={16} />}
                  {viewMode === 'calendar' ? 'List' : 'Grid'}
                </button>
                <button onClick={generateCalendar} disabled={generating} style={btnGhost}>
                  <RefreshCw size={16} /> Regenerate
                </button>
                {activeCampaign.status === 'ready' && (
                  <button onClick={sendToPublisher} style={btnPrimary}>
                    <Send size={16} /> Send to Publisher
                  </button>
                )}
                {activeCampaign.status === 'active' && (
                  <button onClick={() => toggleStatus(activeCampaign._id, 'pause')} style={btnWarning}>
                    <Pause size={16} /> Pause
                  </button>
                )}
                {activeCampaign.status === 'paused' && (
                  <button onClick={() => toggleStatus(activeCampaign._id, 'activate')} style={btnPrimary}>
                    <Play size={16} /> Resume
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Generating state */}
        {generating && (
          <div style={{ textAlign: 'center', padding: 60, background: '#1a1a2e', borderRadius: 16, border: '1px solid #8b5cf644' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: '#8b5cf6', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ color: '#fff', marginBottom: 8 }}>AI is crafting your content calendar...</h3>
            <p style={{ color: '#9ca3af' }}>This takes 30-60 seconds. Generating {activeCampaign.durationDays} days × {activeCampaign.postsPerDay} posts/day</p>
          </div>
        )}

        {/* Calendar Grid */}
        {hasCalendar && !generating && viewMode === 'calendar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} style={{ textAlign: 'center', color: '#6b7280', fontSize: 12, fontWeight: 600, padding: '8px 0' }}>{d}</div>
            ))}
            {cal.map(day => {
              const isSelected = selectedDay?.dayNumber === day.dayNumber;
              const isToday = new Date(day.date).toDateString() === new Date().toDateString();
              return (
                <div key={day.dayNumber} onClick={() => setSelectedDay(isSelected ? null : day)}
                  style={{
                    background: isSelected ? '#2a2a5a' : '#1a1a2e',
                    border: `1px solid ${isSelected ? '#8b5cf6' : isToday ? '#f59e0b44' : '#2a2a4a'}`,
                    borderRadius: 10, padding: 10, minHeight: 90, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.borderColor = '#8b5cf644'; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.borderColor = isToday ? '#f59e0b44' : '#2a2a4a'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: isToday ? '#f59e0b' : '#9ca3af', fontSize: 12, fontWeight: 600 }}>
                      Day {day.dayNumber}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: 10 }}>
                      {new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#c4b5fd', marginBottom: 4, lineHeight: 1.3 }}>
                    {day.theme?.substring(0, 40)}{day.theme?.length > 40 ? '...' : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {day.content.map((piece, i) => {
                      const Icon = TYPE_ICONS[piece.type] || FileText;
                      return (
                        <span key={i} style={{
                          width: 20, height: 20, borderRadius: 4,
                          background: TYPE_COLORS[piece.type] + '33',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Icon size={12} style={{ color: TYPE_COLORS[piece.type] }} />
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {hasCalendar && !generating && viewMode === 'list' && (
          <div style={{ display: 'grid', gap: 8 }}>
            {cal.map(day => (
              <div key={day.dayNumber} onClick={() => setSelectedDay(selectedDay?.dayNumber === day.dayNumber ? null : day)}
                style={{ background: '#1a1a2e', borderRadius: 10, padding: 14, border: '1px solid #2a2a4a', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 14, minWidth: 48 }}>Day {day.dayNumber}</span>
                    <span style={{ color: '#fff', fontSize: 14 }}>{day.theme}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {day.content.map((piece, i) => {
                      const Icon = TYPE_ICONS[piece.type] || FileText;
                      return <Icon key={i} size={14} style={{ color: TYPE_COLORS[piece.type] }} />;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Day Detail Panel */}
        {selectedDay && (
          <div style={{
            marginTop: 20, background: '#1a1a2e', borderRadius: 16,
            border: '1px solid #8b5cf644', padding: 24
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ color: '#fff', margin: 0 }}>Day {selectedDay.dayNumber} — {selectedDay.theme}</h3>
                <p style={{ color: '#9ca3af', fontSize: 13, margin: '4px 0 0' }}>
                  {new Date(selectedDay.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button onClick={() => setSelectedDay(null)} style={btnGhost}><XCircle size={18} /></button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {selectedDay.content.map((piece, idx) => {
                const Icon = TYPE_ICONS[piece.type] || FileText;
                return (
                  <div key={piece._id || idx} style={{
                    background: '#12122a', borderRadius: 12, padding: 16,
                    border: `1px solid ${TYPE_COLORS[piece.type]}33`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={16} style={{ color: TYPE_COLORS[piece.type] }} />
                        <span style={{ color: TYPE_COLORS[piece.type], fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                          {piece.type.replace('_', ' ')}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: 12 }}>• {piece.platform}</span>
                        <span style={{ color: '#6b7280', fontSize: 12 }}>• {piece.scheduledTime}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => regeneratePiece(selectedDay.dayNumber, piece._id)}
                          style={{ ...btnIcon, color: '#8b5cf6' }} title="Regenerate">
                          <RefreshCw size={14} />
                        </button>
                        <button onClick={() => {
                          navigator.clipboard.writeText(piece.caption || piece.content || piece.title);
                        }} style={{ ...btnIcon, color: '#6b7280' }} title="Copy">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    {piece.title && <h4 style={{ color: '#fff', margin: '0 0 6px', fontSize: 15 }}>{piece.title}</h4>}
                    <p style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.6, margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>
                      {piece.caption || piece.content?.substring(0, 300)}
                      {piece.content?.length > 300 ? '...' : ''}
                    </p>

                    {piece.hashtags?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                        {piece.hashtags.map((tag, i) => (
                          <span key={i} style={{ color: '#8b5cf6', fontSize: 12 }}>{tag}</span>
                        ))}
                      </div>
                    )}

                    {piece.mediaPrompt && (
                      <div style={{ background: '#1a1a2e', borderRadius: 8, padding: 8, marginTop: 6 }}>
                        <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 600 }}>📷 Media Prompt: </span>
                        <span style={{ color: '#9ca3af', fontSize: 11 }}>{piece.mediaPrompt}</span>
                      </div>
                    )}

                    {piece.callToAction && (
                      <div style={{ color: '#10b981', fontSize: 12, marginTop: 6 }}>
                        CTA: {piece.callToAction}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        {hasCalendar && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20, padding: 12, background: '#12122a', borderRadius: 10 }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => {
              const Icon = TYPE_ICONS[type] || FileText;
              return (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={14} style={{ color }} />
                  <span style={{ color: '#9ca3af', fontSize: 12, textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <Head><title>AI Campaign Planner | CYBEV Studio</title></Head>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
        {view === 'list' && renderList()}
        {view === 'create' && renderCreate()}
        {view === 'calendar' && renderCalendar()}
      </div>
    </AppLayout>
  );
}

// ─── Shared Components ───
function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Icon size={14} style={{ color: '#6b7280' }} />
      <span style={{ color: '#9ca3af', fontSize: 12 }}>{label}:</span>
      <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ─── Styles ───
const btnPrimary = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff',
  border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14,
};
const btnGhost = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  background: '#2a2a4a', color: '#ccc', border: '1px solid #3a3a5a',
  borderRadius: 8, cursor: 'pointer', fontSize: 13,
};
const btnWarning = {
  ...btnGhost, background: '#f59e0b22', color: '#f59e0b', borderColor: '#f59e0b44'
};
const btnIcon = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4,
};
const labelStyle = { display: 'block', color: '#9ca3af', fontSize: 13, marginBottom: 6, fontWeight: 500 };
const inputStyle = {
  width: '100%', padding: '10px 14px', background: '#12122a', border: '1px solid #2a2a4a',
  borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const chipStyle = {
  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
};
