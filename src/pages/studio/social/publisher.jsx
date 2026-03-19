// ============================================
// FILE: src/pages/studio/social/publisher.jsx
// PATH: cybev-frontend/src/pages/studio/social/publisher.jsx
// PURPOSE: Social Auto-Publisher — cross-platform scheduling & publishing
// VERSION: 1.1.0 — White design system
// ============================================
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Send, Clock, Plus, Trash2, Loader2, ArrowLeft, CheckCircle, XCircle,
  AlertCircle, RefreshCw, ExternalLink, Link2, Unlink, Play, Pause,
  Calendar, BarChart3, Eye, Image, Video, Music, FileText, Share2,
  Globe, Settings, Zap, Filter, Edit3, Radio
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const PLATFORM_META = {
  facebook:  { name: 'Facebook',    emoji: '📘', color: '#1877F2' },
  instagram: { name: 'Instagram',   emoji: '📸', color: '#E4405F' },
  youtube:   { name: 'YouTube',     emoji: '📺', color: '#FF0000' },
  tiktok:    { name: 'TikTok',      emoji: '🎵', color: '#000000' },
  twitter:   { name: 'X / Twitter', emoji: '🐦', color: '#1DA1F2' },
  linkedin:  { name: 'LinkedIn',    emoji: '💼', color: '#0A66C2' },
  kingschat: { name: 'KingsChat',   emoji: '👑', color: '#FFD700' },
  ceflix:    { name: 'CeFlix',      emoji: '🎬', color: '#FF6B00' },
};

const STATUS_STYLES = {
  scheduled:  'bg-blue-100 text-blue-700', publishing: 'bg-amber-100 text-amber-700',
  completed:  'bg-green-100 text-green-700', partial: 'bg-amber-100 text-amber-700',
  failed:     'bg-red-100 text-red-700', cancelled: 'bg-gray-100 text-gray-500',
  pending:    'bg-blue-50 text-blue-600', published: 'bg-green-100 text-green-700',
  skipped:    'bg-gray-100 text-gray-500',
};

export default function SocialPublisher() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('queue');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [queue, setQueue] = useState([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');

  const [compose, setCompose] = useState({ text: '', title: '', link: '', hashtags: '', platforms: [], scheduledFor: '' });
  const [composing, setComposing] = useState(false);
  const [connectForm, setConnectForm] = useState({ platform: '', accountName: '', accessToken: '', username: '' });
  const [connecting, setConnecting] = useState(false);

  const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('cybev_token')}` } });
  const authJson = () => ({ headers: { ...getAuth().headers, 'Content-Type': 'application/json' } });

  useEffect(() => {
    fetchAll();
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected')) { setActiveTab('accounts'); }
    if (params.get('error')) { alert(`Connection failed: ${params.get('error')}`); }
  }, []);

  const fetchAll = async () => { setLoading(true); await Promise.all([fetchAccounts(), fetchQueue()]); setLoading(false); };

  const fetchAccounts = async () => {
    try { const r = await fetch(`${API}/api/social-publisher/accounts`, getAuth()); const d = await r.json(); if (d.ok) setAccounts(d.accounts || []); }
    catch (e) { console.error(e); }
  };

  const fetchQueue = async () => {
    try { const url = filterStatus ? `${API}/api/social-publisher/queue?status=${filterStatus}&limit=50` : `${API}/api/social-publisher/queue?limit=50`;
      const r = await fetch(url, getAuth()); const d = await r.json(); if (d.ok) { setQueue(d.posts || []); setQueueTotal(d.total || 0); }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (!loading) fetchQueue(); }, [filterStatus]);

  const connectManual = async () => {
    if (!connectForm.platform || !connectForm.accountName) return;
    setConnecting(true);
    try { const r = await fetch(`${API}/api/social-publisher/accounts`, { method: 'POST', ...authJson(), body: JSON.stringify(connectForm) });
      const d = await r.json(); if (d.ok) { setConnectForm({ platform: '', accountName: '', accessToken: '', username: '' }); fetchAccounts(); } else alert(d.error);
    } catch { alert('Connection failed'); } finally { setConnecting(false); }
  };

  const disconnectAccount = async (id) => {
    if (!confirm('Disconnect this account?')) return;
    await fetch(`${API}/api/social-publisher/accounts/${id}`, { method: 'DELETE', ...getAuth() }); fetchAccounts();
  };

  const testAccount = async (id) => {
    const r = await fetch(`${API}/api/social-publisher/accounts/${id}/test`, { method: 'POST', ...getAuth() });
    const d = await r.json(); alert(d.success ? `✅ ${d.message}` : `❌ ${d.message}`); fetchAccounts();
  };

  const schedulePost = async () => {
    if (!compose.text || compose.platforms.length === 0) return alert('Enter content and select platforms');
    setComposing(true);
    try {
      const r = await fetch(`${API}/api/social-publisher/queue`, { method: 'POST', ...authJson(),
        body: JSON.stringify({
          platforms: compose.platforms.map(p => ({ platform: p })),
          content: { text: compose.text, title: compose.title, link: compose.link,
            hashtags: compose.hashtags ? compose.hashtags.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`) : [] },
          scheduledFor: compose.scheduledFor || new Date().toISOString(), type: 'post',
        })
      });
      const d = await r.json();
      if (d.ok) { setCompose({ text: '', title: '', link: '', hashtags: '', platforms: [], scheduledFor: '' }); setActiveTab('queue'); fetchQueue(); }
      else alert(d.error);
    } catch { alert('Failed to schedule'); } finally { setComposing(false); }
  };

  const publishNow = async (id) => { await fetch(`${API}/api/social-publisher/queue/${id}/publish-now`, { method: 'POST', ...getAuth() }); fetchQueue(); };
  const cancelPost = async (id) => { await fetch(`${API}/api/social-publisher/queue/${id}`, { method: 'DELETE', ...getAuth() }); fetchQueue(); };

  // ─── QUEUE TAB ───
  const renderQueue = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <p className="text-sm text-gray-500">{queueTotal} total posts</p>
        <div className="flex gap-1.5">
          {['', 'scheduled', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filterStatus === s ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-white text-gray-500 border-gray-300 hover:border-purple-300'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>
      {queue.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No posts in queue</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => setActiveTab('compose')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"><Plus className="w-4 h-4" /> Compose</button>
            <Link href="/studio/campaigns/ai" className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 no-underline"><Zap className="w-4 h-4" /> AI Campaign</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {queue.map(post => {
            const stClass = STATUS_STYLES[post.status] || 'bg-gray-100 text-gray-600';
            return (
              <div key={post._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {post.content?.title && <h4 className="font-semibold text-gray-900 text-sm mb-1">{post.content.title}</h4>}
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 whitespace-pre-wrap mb-2">{post.content?.text}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.platforms?.map((p, i) => {
                        const meta = PLATFORM_META[p.platform] || { emoji: '🌐', name: p.platform };
                        const pClass = STATUS_STYLES[p.status] || 'bg-gray-50 text-gray-500';
                        return (
                          <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${pClass}`}>
                            {meta.emoji} {meta.name}
                            {p.status === 'published' && <CheckCircle className="w-2.5 h-2.5" />}
                            {p.status === 'failed' && <XCircle className="w-2.5 h-2.5" />}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(post.scheduledFor).toLocaleString()}</span>
                      {post.campaign && <span>From campaign</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${stClass}`}>{post.status}</span>
                    {post.status === 'scheduled' && (
                      <div className="flex gap-1">
                        <button onClick={() => publishNow(post._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg border border-gray-200" title="Publish now"><Play className="w-3.5 h-3.5" /></button>
                        <button onClick={() => cancelPost(post._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-gray-200" title="Cancel"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                    {post.platforms?.some(p => p.postUrl) && (
                      <a href={post.platforms.find(p => p.postUrl)?.postUrl} target="_blank" rel="noopener noreferrer"
                        className="text-purple-600 text-xs flex items-center gap-1 hover:underline">View <ExternalLink className="w-3 h-3" /></a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ─── ACCOUNTS TAB ───
  const renderAccounts = () => (
    <div>
      <h3 className="font-bold text-gray-900 mb-4">Connected Platforms</h3>
      {accounts.length > 0 && (
        <div className="space-y-2.5 mb-6">
          {accounts.map(acc => {
            const meta = PLATFORM_META[acc.platform] || { emoji: '🌐', name: acc.platform, color: '#6b7280' };
            return (
              <div key={acc._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: meta.color + '15' }}>{meta.emoji}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{acc.accountName}</div>
                    <div className="text-xs text-gray-500">
                      {meta.name} {acc.username ? `• @${acc.username}` : ''} • <span className={acc.status === 'active' ? 'text-green-600' : acc.status === 'error' ? 'text-red-500' : 'text-amber-500'}>{acc.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => testAccount(acc._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"><RefreshCw className="w-3.5 h-3.5" /> Test</button>
                  <button onClick={() => disconnectAccount(acc._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200"><Unlink className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className="font-bold text-gray-900 mb-3">Add Platform</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {Object.entries(PLATFORM_META).map(([id, meta]) => {
          const connected = accounts.some(a => a.platform === id && a.status === 'active');
          return (
            <button key={id} onClick={() => setConnectForm(f => ({ ...f, platform: id }))}
              className={`rounded-xl border p-4 text-center transition hover:shadow-sm ${connected ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:border-purple-300'}`}>
              <div className="text-2xl mb-1.5">{meta.emoji}</div>
              <div className="text-sm font-medium text-gray-900">{meta.name}</div>
              {connected && <div className="text-[10px] text-green-600 font-semibold mt-1">✓ Connected</div>}
            </button>
          );
        })}
      </div>

      {connectForm.platform && (
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 shadow-sm max-w-md">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            {PLATFORM_META[connectForm.platform]?.emoji} Connect {PLATFORM_META[connectForm.platform]?.name}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Account Name</label>
              <input value={connectForm.accountName} onChange={e => setConnectForm(f => ({ ...f, accountName: e.target.value }))}
                placeholder="e.g., My Page Name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Username (optional)</label>
              <input value={connectForm.username} onChange={e => setConnectForm(f => ({ ...f, username: e.target.value }))}
                placeholder="@username" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Access Token / API Key</label>
              <input type="password" value={connectForm.accessToken} onChange={e => setConnectForm(f => ({ ...f, accessToken: e.target.value }))}
                placeholder="Paste token here" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
              <p className="text-[11px] text-gray-400 mt-1">Facebook: Page Access Token. Twitter: Bearer Token. Others: API key.</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={connectManual} disabled={!connectForm.accountName || connecting}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50">
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />} Connect
              </button>
              <button onClick={() => setConnectForm({ platform: '', accountName: '', accessToken: '', username: '' })}
                className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── COMPOSE TAB ───
  const renderCompose = () => (
    <div className="max-w-lg">
      <h3 className="font-bold text-gray-900 mb-4">Compose & Schedule Post</h3>
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Title (optional)</label>
          <input value={compose.title} onChange={e => setCompose(f => ({ ...f, title: e.target.value }))}
            placeholder="Post title" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Content *</label>
          <textarea value={compose.text} onChange={e => setCompose(f => ({ ...f, text: e.target.value }))}
            placeholder="Write your post content here..." rows={5}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-vertical text-gray-900" />
          <p className="text-right text-[11px] text-gray-400 mt-0.5">{compose.text.length} chars {compose.text.length > 280 ? '(exceeds Twitter limit)' : ''}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Link (optional)</label>
          <input value={compose.link} onChange={e => setCompose(f => ({ ...f, link: e.target.value }))}
            placeholder="https://cybev.io/blog/..." className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Hashtags</label>
          <input value={compose.hashtags} onChange={e => setCompose(f => ({ ...f, hashtags: e.target.value }))}
            placeholder="#CYBEV #WhereCreatorsConnect" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Publish To</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PLATFORM_META).map(([id, meta]) => {
              const connected = accounts.some(a => a.platform === id && a.status === 'active');
              const sel = compose.platforms.includes(id);
              return (
                <button key={id} onClick={() => setCompose(f => ({ ...f, platforms: sel ? f.platforms.filter(x => x !== id) : [...f.platforms, id] }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${sel ? 'bg-purple-50 text-purple-700 border-purple-400' : connected ? 'bg-white text-gray-600 border-gray-300 hover:border-purple-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                  {meta.emoji} {meta.name} {!connected && id !== 'cybev' && <span className="text-amber-500">(NC)</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Schedule For</label>
          <input type="datetime-local" value={compose.scheduledFor} onChange={e => setCompose(f => ({ ...f, scheduledFor: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
          <p className="text-[11px] text-gray-400 mt-0.5">Leave empty to publish immediately</p>
        </div>
        <button onClick={schedulePost} disabled={!compose.text || compose.platforms.length === 0 || composing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50">
          {composing ? <Loader2 className="w-4 h-4 animate-spin" /> : compose.scheduledFor ? <Clock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          {compose.scheduledFor ? 'Schedule Post' : 'Publish Now'}
        </button>
      </div>
    </div>
  );

  // ─── ANALYTICS TAB ───
  const renderAnalytics = () => {
    const published = queue.filter(p => p.status === 'completed' || p.status === 'partial').length;
    const failed = queue.filter(p => p.status === 'failed').length;
    const scheduled = queue.filter(p => p.status === 'scheduled').length;
    const platformStats = {};
    queue.forEach(post => { post.platforms?.forEach(p => {
      if (!platformStats[p.platform]) platformStats[p.platform] = { published: 0, failed: 0, total: 0 };
      platformStats[p.platform].total++; if (p.status === 'published') platformStats[p.platform].published++; if (p.status === 'failed') platformStats[p.platform].failed++;
    }); });

    return (
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Publishing Analytics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { icon: Send, label: 'Total', value: queue.length, color: 'purple' },
            { icon: CheckCircle, label: 'Published', value: published, color: 'green' },
            { icon: Clock, label: 'Scheduled', value: scheduled, color: 'blue' },
            { icon: XCircle, label: 'Failed', value: failed, color: 'red' },
            { icon: Globe, label: 'Platforms', value: accounts.length, color: 'amber' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm`}>
              <s.icon className={`w-5 h-5 mx-auto mb-2 text-${s.color}-500`} />
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
        {Object.keys(platformStats).length > 0 && (
          <>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Per Platform</h4>
            <div className="space-y-2">
              {Object.entries(platformStats).map(([plat, stats]) => {
                const meta = PLATFORM_META[plat] || { emoji: '🌐', name: plat, color: '#6b7280' };
                const pct = stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0;
                return (
                  <div key={plat} className="bg-white rounded-xl border border-gray-200 p-3.5 flex items-center gap-3 shadow-sm">
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{meta.name}</span>
                        <span className="text-xs text-gray-500">{stats.published}/{stats.total}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: meta.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  // ─── MAIN ───
  const tabs = [
    { id: 'queue', label: 'Queue', icon: Clock, count: queueTotal },
    { id: 'compose', label: 'Compose', icon: Edit3 },
    { id: 'accounts', label: 'Accounts', icon: Globe, count: accounts.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <AppLayout>
      <Head><title>Social Publisher | CYBEV Studio</title></Head>
      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Radio className="w-7 h-7 text-pink-500" /> Social Publisher</h1>
            <p className="text-sm text-gray-500 mt-1">Schedule & publish across all platforms</p>
          </div>
          <div className="flex gap-2">
            <Link href="/studio/campaigns/ai" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 no-underline"><Zap className="w-4 h-4" /> AI Campaigns</Link>
            <button onClick={() => setActiveTab('compose')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"><Plus className="w-4 h-4" /> New Post</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div> : (
          <>{activeTab === 'queue' && renderQueue()}{activeTab === 'compose' && renderCompose()}{activeTab === 'accounts' && renderAccounts()}{activeTab === 'analytics' && renderAnalytics()}</>
        )}
      </div>
    </AppLayout>
  );
}
