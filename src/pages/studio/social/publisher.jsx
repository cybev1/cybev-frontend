// ============================================
// FILE: src/pages/studio/social/publisher.jsx
// PATH: cybev-frontend/src/pages/studio/social/publisher.jsx
// PURPOSE: Social Auto-Publisher — cross-platform scheduling & publishing
// VERSION: 1.0.0
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
  Globe, Settings, Zap, Filter, ChevronDown, MoreVertical, Edit3,
  Facebook, Instagram, Youtube, Twitter, Linkedin
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const PLATFORM_META = {
  facebook:  { name: 'Facebook',     emoji: '📘', color: '#1877F2', icon: '📘' },
  instagram: { name: 'Instagram',    emoji: '📸', color: '#E4405F', icon: '📸' },
  youtube:   { name: 'YouTube',      emoji: '📺', color: '#FF0000', icon: '📺' },
  tiktok:    { name: 'TikTok',       emoji: '🎵', color: '#000000', icon: '🎵' },
  twitter:   { name: 'X / Twitter',  emoji: '🐦', color: '#1DA1F2', icon: '🐦' },
  linkedin:  { name: 'LinkedIn',     emoji: '💼', color: '#0A66C2', icon: '💼' },
  kingschat: { name: 'KingsChat',    emoji: '👑', color: '#FFD700', icon: '👑' },
  ceflix:    { name: 'CeFlix',       emoji: '🎬', color: '#FF6B00', icon: '🎬' },
};

const STATUS_MAP = {
  scheduled:  { color: '#3b82f6', bg: '#3b82f622', label: 'Scheduled' },
  publishing: { color: '#f59e0b', bg: '#f59e0b22', label: 'Publishing' },
  completed:  { color: '#10b981', bg: '#10b98122', label: 'Completed' },
  partial:    { color: '#f59e0b', bg: '#f59e0b22', label: 'Partial' },
  failed:     { color: '#ef4444', bg: '#ef444422', label: 'Failed' },
  cancelled:  { color: '#6b7280', bg: '#6b728022', label: 'Cancelled' },
  pending:    { color: '#3b82f6', bg: '#3b82f622', label: 'Pending' },
  published:  { color: '#10b981', bg: '#10b98122', label: 'Published' },
  skipped:    { color: '#6b7280', bg: '#6b728022', label: 'Skipped' },
};

export default function SocialPublisher() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('queue'); // queue, accounts, compose, analytics
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [queue, setQueue] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');

  // Compose form state
  const [compose, setCompose] = useState({
    text: '', title: '', link: '', hashtags: '',
    platforms: [], scheduledFor: '', mediaUrls: [],
  });
  const [composing, setComposing] = useState(false);

  // Connect form state
  const [connectForm, setConnectForm] = useState({
    platform: '', accountName: '', accessToken: '', username: ''
  });
  const [connecting, setConnecting] = useState(false);

  const getAuth = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('cybev_token')}` }
  });
  const authJson = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('cybev_token')}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchAll();
    // Check URL params for OAuth callback
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected')) {
      setActiveTab('accounts');
      fetchAccounts();
    }
    if (params.get('error')) {
      alert(`Connection failed: ${params.get('error')}`);
    }
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchAccounts(), fetchQueue(), fetchPlatforms()]);
    setLoading(false);
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API}/api/social-publisher/accounts`, getAuth());
      const data = await res.json();
      if (data.ok) setAccounts(data.accounts || []);
    } catch (err) { console.error('Fetch accounts:', err); }
  };

  const fetchQueue = async () => {
    try {
      const url = filterStatus
        ? `${API}/api/social-publisher/queue?status=${filterStatus}&limit=50`
        : `${API}/api/social-publisher/queue?limit=50`;
      const res = await fetch(url, getAuth());
      const data = await res.json();
      if (data.ok) { setQueue(data.posts || []); setQueueTotal(data.total || 0); }
    } catch (err) { console.error('Fetch queue:', err); }
  };

  const fetchPlatforms = async () => {
    try {
      const res = await fetch(`${API}/api/social-publisher/platforms`, getAuth());
      const data = await res.json();
      if (data.ok) setPlatforms(data.platforms || []);
    } catch (err) { console.error('Fetch platforms:', err); }
  };

  useEffect(() => { fetchQueue(); }, [filterStatus]);

  // ─── Actions ───

  const connectPlatformOAuth = async (platform) => {
    try {
      const res = await fetch(`${API}/api/social-publisher/oauth/${platform}/url`, getAuth());
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'OAuth not configured for this platform. Use manual connection.');
        setConnectForm(f => ({ ...f, platform }));
        setActiveTab('accounts');
      }
    } catch (err) {
      alert('Failed to start OAuth. Use manual connection instead.');
    }
  };

  const connectManual = async () => {
    if (!connectForm.platform || !connectForm.accountName) return;
    setConnecting(true);
    try {
      const res = await fetch(`${API}/api/social-publisher/accounts`, {
        method: 'POST', ...authJson(),
        body: JSON.stringify(connectForm)
      });
      const data = await res.json();
      if (data.ok) {
        setConnectForm({ platform: '', accountName: '', accessToken: '', username: '' });
        fetchAccounts();
      } else {
        alert(data.error);
      }
    } catch (err) { alert('Connection failed'); }
    finally { setConnecting(false); }
  };

  const disconnectAccount = async (id) => {
    if (!confirm('Disconnect this account?')) return;
    await fetch(`${API}/api/social-publisher/accounts/${id}`, { method: 'DELETE', ...getAuth() });
    fetchAccounts();
  };

  const testAccount = async (id) => {
    const res = await fetch(`${API}/api/social-publisher/accounts/${id}/test`, { method: 'POST', ...getAuth() });
    const data = await res.json();
    alert(data.success ? `✅ ${data.message}` : `❌ ${data.message}`);
    fetchAccounts();
  };

  const schedulePost = async () => {
    if (!compose.text) return;
    if (compose.platforms.length === 0) return alert('Select at least one platform');
    setComposing(true);
    try {
      const res = await fetch(`${API}/api/social-publisher/queue`, {
        method: 'POST', ...authJson(),
        body: JSON.stringify({
          platforms: compose.platforms.map(p => ({ platform: p })),
          content: {
            text: compose.text,
            title: compose.title,
            link: compose.link,
            hashtags: compose.hashtags ? compose.hashtags.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`) : [],
          },
          scheduledFor: compose.scheduledFor || new Date().toISOString(),
          type: 'post',
        })
      });
      const data = await res.json();
      if (data.ok) {
        setCompose({ text: '', title: '', link: '', hashtags: '', platforms: [], scheduledFor: '', mediaUrls: [] });
        setActiveTab('queue');
        fetchQueue();
      } else {
        alert(data.error);
      }
    } catch (err) { alert('Failed to schedule'); }
    finally { setComposing(false); }
  };

  const publishNow = async (id) => {
    await fetch(`${API}/api/social-publisher/queue/${id}/publish-now`, { method: 'POST', ...getAuth() });
    fetchQueue();
  };

  const cancelPost = async (id) => {
    await fetch(`${API}/api/social-publisher/queue/${id}`, { method: 'DELETE', ...getAuth() });
    fetchQueue();
  };

  // ─── Tab: Queue ───
  const renderQueue = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <p style={{ color: '#9ca3af', margin: 0, fontSize: 13 }}>{queueTotal} total posts in queue</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {['', 'scheduled', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              ...chipBtn, background: filterStatus === s ? '#8b5cf622' : '#2a2a4a',
              color: filterStatus === s ? '#c4b5fd' : '#9ca3af',
              border: `1px solid ${filterStatus === s ? '#8b5cf6' : '#3a3a5a'}`
            }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {queue.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, background: '#1a1a2e', borderRadius: 14, border: '1px solid #2a2a4a' }}>
          <Calendar size={40} style={{ color: '#6b7280', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: '#9ca3af' }}>No posts in queue. Compose a post or generate from a campaign.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <button onClick={() => setActiveTab('compose')} style={btnPrimary}><Plus size={16} /> Compose Post</button>
            <Link href="/studio/campaigns/ai" style={{ ...btnGhost, textDecoration: 'none' }}>
              <Zap size={16} /> AI Campaign
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {queue.map(post => {
            const st = STATUS_MAP[post.status] || STATUS_MAP.scheduled;
            return (
              <div key={post._id} style={{ background: '#1a1a2e', borderRadius: 12, padding: 16, border: '1px solid #2a2a4a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {post.content?.title && (
                      <h4 style={{ color: '#fff', margin: '0 0 4px', fontSize: 14 }}>{post.content.title}</h4>
                    )}
                    <p style={{ color: '#d1d5db', fontSize: 13, margin: '0 0 8px', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                      overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {post.content?.text}
                    </p>

                    {/* Platform results */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                      {post.platforms?.map((p, i) => {
                        const meta = PLATFORM_META[p.platform] || { emoji: '🌐', name: p.platform };
                        const pst = STATUS_MAP[p.status] || STATUS_MAP.pending;
                        return (
                          <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 500,
                            background: pst.bg, color: pst.color, border: `1px solid ${pst.color}33`
                          }}>
                            {meta.emoji} {meta.name}
                            {p.status === 'published' && <CheckCircle size={10} />}
                            {p.status === 'failed' && <XCircle size={10} />}
                          </span>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: 12, color: '#6b7280', fontSize: 11 }}>
                      <span><Clock size={11} style={{ verticalAlign: 'middle' }} /> {new Date(post.scheduledFor).toLocaleString()}</span>
                      {post.campaign && <span>From campaign</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 600,
                      background: st.bg, color: st.color
                    }}>{st.label}</span>
                    {post.status === 'scheduled' && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        <button onClick={() => publishNow(post._id)} style={{ ...btnSmall, color: '#10b981' }} title="Publish now">
                          <Play size={13} />
                        </button>
                        <button onClick={() => cancelPost(post._id)} style={{ ...btnSmall, color: '#ef4444' }} title="Cancel">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                    {post.platforms?.some(p => p.postUrl) && (
                      <a href={post.platforms.find(p => p.postUrl)?.postUrl} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#8b5cf6', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        View <ExternalLink size={10} />
                      </a>
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

  // ─── Tab: Accounts ───
  const renderAccounts = () => (
    <div>
      <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Connected Platforms</h3>

      {accounts.length > 0 && (
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          {accounts.map(acc => {
            const meta = PLATFORM_META[acc.platform] || { emoji: '🌐', name: acc.platform, color: '#6b7280' };
            return (
              <div key={acc._id} style={{
                background: '#1a1a2e', borderRadius: 12, padding: 16, border: '1px solid #2a2a4a',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: meta.color + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                  }}>{meta.emoji}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{acc.accountName}</div>
                    <div style={{ color: '#9ca3af', fontSize: 12 }}>
                      {meta.name} {acc.username ? `• @${acc.username}` : ''} • <span style={{
                        color: acc.status === 'active' ? '#10b981' : acc.status === 'error' ? '#ef4444' : '#f59e0b'
                      }}>{acc.status}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => testAccount(acc._id)} style={btnGhost} title="Test connection">
                    <RefreshCw size={14} /> Test
                  </button>
                  <button onClick={() => disconnectAccount(acc._id)} style={{ ...btnGhost, color: '#ef4444', borderColor: '#ef444433' }}>
                    <Unlink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Platform */}
      <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Add Platform</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
        {Object.entries(PLATFORM_META).map(([id, meta]) => {
          const isConnected = accounts.some(a => a.platform === id && a.status === 'active');
          return (
            <button key={id} onClick={() => {
              if (['facebook', 'youtube', 'twitter', 'tiktok', 'linkedin'].includes(id)) {
                connectPlatformOAuth(id);
              } else {
                setConnectForm(f => ({ ...f, platform: id }));
              }
            }}
              style={{
                background: isConnected ? `${meta.color}11` : '#1a1a2e',
                border: `1px solid ${isConnected ? meta.color + '44' : '#2a2a4a'}`,
                borderRadius: 12, padding: 16, cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = meta.color; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = isConnected ? meta.color + '44' : '#2a2a4a'; }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{meta.emoji}</div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{meta.name}</div>
              {isConnected && <div style={{ color: '#10b981', fontSize: 11, marginTop: 4 }}>✓ Connected</div>}
            </button>
          );
        })}
      </div>

      {/* Manual Connect Form */}
      {connectForm.platform && (
        <div style={{ background: '#1a1a2e', borderRadius: 14, padding: 20, border: '1px solid #8b5cf644', maxWidth: 480 }}>
          <h4 style={{ color: '#fff', margin: '0 0 12px' }}>
            {PLATFORM_META[connectForm.platform]?.emoji} Connect {PLATFORM_META[connectForm.platform]?.name}
          </h4>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={labelStyle}>Account Name</label>
              <input value={connectForm.accountName} onChange={e => setConnectForm(f => ({ ...f, accountName: e.target.value }))}
                placeholder="e.g., My Page Name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Username (optional)</label>
              <input value={connectForm.username} onChange={e => setConnectForm(f => ({ ...f, username: e.target.value }))}
                placeholder="@username" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Access Token / API Key</label>
              <input type="password" value={connectForm.accessToken}
                onChange={e => setConnectForm(f => ({ ...f, accessToken: e.target.value }))}
                placeholder="Paste your token here" style={inputStyle} />
              <p style={{ color: '#6b7280', fontSize: 11, marginTop: 4 }}>
                For Facebook: use a Page Access Token. For Twitter: use a Bearer Token. For others: use an API key.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={connectManual} disabled={!connectForm.accountName || connecting} style={{
                ...btnPrimary, opacity: !connectForm.accountName ? 0.5 : 1
              }}>
                {connecting ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
                Connect
              </button>
              <button onClick={() => setConnectForm({ platform: '', accountName: '', accessToken: '', username: '' })}
                style={btnGhost}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── Tab: Compose ───
  const renderCompose = () => (
    <div style={{ maxWidth: 600 }}>
      <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Compose & Schedule Post</h3>

      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={labelStyle}>Post Title (optional)</label>
          <input value={compose.title} onChange={e => setCompose(f => ({ ...f, title: e.target.value }))}
            placeholder="Title for blog shares" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Content *</label>
          <textarea value={compose.text} onChange={e => setCompose(f => ({ ...f, text: e.target.value }))}
            placeholder="Write your post content here..."
            rows={6} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
          <div style={{ textAlign: 'right', color: '#6b7280', fontSize: 11, marginTop: 4 }}>
            {compose.text.length} chars {compose.text.length > 280 && '(exceeds Twitter limit)'}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Link (optional)</label>
          <input value={compose.link} onChange={e => setCompose(f => ({ ...f, link: e.target.value }))}
            placeholder="https://cybev.io/blog/..." style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Hashtags (comma or space separated)</label>
          <input value={compose.hashtags} onChange={e => setCompose(f => ({ ...f, hashtags: e.target.value }))}
            placeholder="#CYBEV #WhereCreatorsConnect" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Publish To</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(PLATFORM_META).map(([id, meta]) => {
              const isConnected = accounts.some(a => a.platform === id && a.status === 'active');
              const isSelected = compose.platforms.includes(id);
              return (
                <button key={id}
                  onClick={() => setCompose(f => ({
                    ...f, platforms: isSelected ? f.platforms.filter(x => x !== id) : [...f.platforms, id]
                  }))}
                  style={{
                    ...chipBtn,
                    background: isSelected ? meta.color + '22' : '#2a2a4a',
                    color: isSelected ? '#fff' : isConnected ? '#ccc' : '#6b7280',
                    border: `1px solid ${isSelected ? meta.color : '#3a3a5a'}`,
                    opacity: isConnected || id === 'cybev' ? 1 : 0.5
                  }}>
                  {meta.emoji} {meta.name}
                  {!isConnected && id !== 'cybev' && <span style={{ fontSize: 10, color: '#f59e0b' }}> (not connected)</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Schedule For</label>
          <input type="datetime-local" value={compose.scheduledFor}
            onChange={e => setCompose(f => ({ ...f, scheduledFor: e.target.value }))}
            style={inputStyle} />
          <p style={{ color: '#6b7280', fontSize: 11, marginTop: 4 }}>Leave empty to publish immediately</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={schedulePost} disabled={!compose.text || compose.platforms.length === 0 || composing}
            style={{ ...btnPrimary, flex: 1, justifyContent: 'center', opacity: (!compose.text || compose.platforms.length === 0) ? 0.5 : 1 }}>
            {composing ? <Loader2 size={16} className="animate-spin" /> : compose.scheduledFor ? <Clock size={16} /> : <Send size={16} />}
            {compose.scheduledFor ? 'Schedule Post' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Tab: Analytics ───
  const renderAnalytics = () => {
    const published = queue.filter(p => p.status === 'completed' || p.status === 'partial');
    const failed = queue.filter(p => p.status === 'failed');
    const scheduled = queue.filter(p => p.status === 'scheduled');

    const platformStats = {};
    queue.forEach(post => {
      post.platforms?.forEach(p => {
        if (!platformStats[p.platform]) platformStats[p.platform] = { published: 0, failed: 0, total: 0 };
        platformStats[p.platform].total++;
        if (p.status === 'published') platformStats[p.platform].published++;
        if (p.status === 'failed') platformStats[p.platform].failed++;
      });
    });

    return (
      <div>
        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Publishing Analytics</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          <StatCard icon={Send} label="Total Posts" value={queue.length} color="#8b5cf6" />
          <StatCard icon={CheckCircle} label="Published" value={published.length} color="#10b981" />
          <StatCard icon={Clock} label="Scheduled" value={scheduled.length} color="#3b82f6" />
          <StatCard icon={XCircle} label="Failed" value={failed.length} color="#ef4444" />
          <StatCard icon={Globe} label="Platforms" value={accounts.length} color="#f59e0b" />
        </div>

        {Object.keys(platformStats).length > 0 && (
          <>
            <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Per Platform</h4>
            <div style={{ display: 'grid', gap: 8 }}>
              {Object.entries(platformStats).map(([platform, stats]) => {
                const meta = PLATFORM_META[platform] || { emoji: '🌐', name: platform, color: '#6b7280' };
                const pct = stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0;
                return (
                  <div key={platform} style={{
                    background: '#1a1a2e', borderRadius: 10, padding: 14, border: '1px solid #2a2a4a',
                    display: 'flex', alignItems: 'center', gap: 12
                  }}>
                    <span style={{ fontSize: 24 }}>{meta.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>{meta.name}</span>
                        <span style={{ color: '#9ca3af', fontSize: 12 }}>{stats.published}/{stats.total} published</span>
                      </div>
                      <div style={{ height: 6, background: '#2a2a4a', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: meta.color, borderRadius: 3, transition: 'width 0.5s' }} />
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

  // ─── Main Render ───
  const tabs = [
    { id: 'queue', label: 'Queue', icon: Clock, count: queueTotal },
    { id: 'compose', label: 'Compose', icon: Edit3 },
    { id: 'accounts', label: 'Accounts', icon: Globe, count: accounts.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <AppLayout>
      <Head><title>Social Publisher | CYBEV Studio</title></Head>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: 0 }}>Social Publisher</h1>
            <p style={{ color: '#9ca3af', marginTop: 4, fontSize: 13 }}>Schedule & publish across all platforms</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/studio/campaigns/ai" style={{ ...btnGhost, textDecoration: 'none' }}>
              <Zap size={16} /> AI Campaigns
            </Link>
            <button onClick={() => setActiveTab('compose')} style={btnPrimary}>
              <Plus size={16} /> New Post
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid #2a2a4a', paddingBottom: 4, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
              background: activeTab === tab.id ? '#8b5cf622' : 'transparent',
              color: activeTab === tab.id ? '#c4b5fd' : '#9ca3af',
              border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? '#8b5cf6' : 'transparent'}`,
              cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap'
            }}>
              <tab.icon size={15} /> {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  background: activeTab === tab.id ? '#8b5cf6' : '#2a2a4a',
                  color: activeTab === tab.id ? '#fff' : '#9ca3af',
                  padding: '1px 7px', borderRadius: 10, fontSize: 11, fontWeight: 600
                }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#8b5cf6' }} />
          </div>
        ) : (
          <>
            {activeTab === 'queue' && renderQueue()}
            {activeTab === 'compose' && renderCompose()}
            {activeTab === 'accounts' && renderAccounts()}
            {activeTab === 'analytics' && renderAnalytics()}
          </>
        )}
      </div>
    </AppLayout>
  );
}

// ─── Shared Components ───
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: '#1a1a2e', borderRadius: 12, padding: 16,
      border: `1px solid ${color}22`, textAlign: 'center'
    }}>
      <Icon size={20} style={{ color, margin: '0 auto 8px', display: 'block' }} />
      <div style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div>
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
const btnSmall = {
  background: 'none', border: '1px solid #2a2a4a', borderRadius: 6,
  cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center'
};
const chipBtn = {
  padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12,
  fontWeight: 500, border: '1px solid #3a3a5a', background: '#2a2a4a', color: '#ccc',
};
const labelStyle = { display: 'block', color: '#9ca3af', fontSize: 13, marginBottom: 6, fontWeight: 500 };
const inputStyle = {
  width: '100%', padding: '10px 14px', background: '#12122a', border: '1px solid #2a2a4a',
  borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
