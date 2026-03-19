// ============================================
// FILE: src/pages/studio/social/publisher.jsx
// PATH: cybev-frontend/src/pages/studio/social/publisher.jsx
// PURPOSE: Social Publisher v2 — CYBEV auto-publish + copy-paste for external
// VERSION: 2.0.0 — White design system
// ============================================
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Send, Clock, Plus, Loader2, CheckCircle, XCircle, Copy, Check,
  ExternalLink, Edit3, Globe, Zap, BarChart3, Radio, FileText,
  Share2, ArrowRight, Sparkles, Image, Hash
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const PLATFORMS = [
  { id: 'cybev', name: 'CYBEV', emoji: '🌐', color: '#7c3aed', auto: true, link: 'https://cybev.io' },
  { id: 'facebook', name: 'Facebook', emoji: '📘', color: '#1877F2', auto: false, link: 'https://facebook.com' },
  { id: 'instagram', name: 'Instagram', emoji: '📸', color: '#E4405F', auto: false, link: 'https://instagram.com' },
  { id: 'twitter', name: 'X / Twitter', emoji: '🐦', color: '#1DA1F2', auto: false, link: 'https://twitter.com/compose/tweet' },
  { id: 'youtube', name: 'YouTube', emoji: '📺', color: '#FF0000', auto: false, link: 'https://studio.youtube.com' },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', color: '#000000', auto: false, link: 'https://tiktok.com/upload' },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', color: '#0A66C2', auto: false, link: 'https://linkedin.com/feed' },
  { id: 'kingschat', name: 'KingsChat', emoji: '👑', color: '#FFD700', auto: false, link: null },
];

export default function SocialPublisher() {
  const [activeTab, setActiveTab] = useState('compose');
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState([]);

  // Compose
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [category, setCategory] = useState('general');
  const [featuredImage, setFeaturedImage] = useState('');
  const [publishType, setPublishType] = useState('blog');

  // Formatted outputs
  const [formatted, setFormatted] = useState(null);
  const [formatting, setFormatting] = useState(false);
  const [cybevPublished, setCybevPublished] = useState(null);
  const [copiedPlatform, setCopiedPlatform] = useState('');
  const [publishing, setPublishing] = useState(false);

  const getAuth = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('cybev_token')}` }
  });
  const authJson = () => ({
    headers: { ...getAuth().headers, 'Content-Type': 'application/json' }
  });

  // ─── Publish to CYBEV ───
  const publishToCybev = async () => {
    if (!content.trim()) return alert('Write some content first');
    setPublishing(true);
    try {
      const res = await fetch(`${API}/api/social-publisher/publish-to-cybev`, {
        method: 'POST', ...authJson(),
        body: JSON.stringify({
          title, content, type: publishType,
          hashtags: hashtags.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`),
          category, featuredImage
        })
      });
      const data = await res.json();
      if (data.ok) {
        setCybevPublished(data);
        setPublished(prev => [{ platform: 'cybev', ...data, time: new Date() }, ...prev]);
      } else {
        alert(data.error || 'Publish failed');
      }
    } catch (err) { alert('Publish failed: ' + err.message); }
    finally { setPublishing(false); }
  };

  // ─── Format for all platforms ───
  const formatForPlatforms = async () => {
    if (!content.trim()) return alert('Write some content first');
    setFormatting(true);
    try {
      const res = await fetch(`${API}/api/social-publisher/format-for-platforms`, {
        method: 'POST', ...authJson(),
        body: JSON.stringify({
          content, title,
          hashtags: hashtags.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`),
          platforms: PLATFORMS.filter(p => !p.auto).map(p => p.id)
        })
      });
      const data = await res.json();
      if (data.ok) {
        setFormatted(data.formatted);
        setActiveTab('distribute');
      }
    } catch (err) { alert('Format failed: ' + err.message); }
    finally { setFormatting(false); }
  };

  // ─── Copy to clipboard ───
  const copyText = (text, platformId) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platformId);
    setPublished(prev => [{ platform: platformId, type: 'copied', time: new Date() }, ...prev]);
    setTimeout(() => setCopiedPlatform(''), 2000);
  };

  // ─── COMPOSE TAB ───
  const renderCompose = () => (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Post or article title"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Content *</label>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Write your content here. This will be formatted differently for each platform..."
            rows={8}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-vertical text-gray-900 leading-relaxed" />
          <p className="text-right text-[11px] text-gray-400 mt-0.5">{content.length} chars</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Hashtags</label>
            <input value={hashtags} onChange={e => setHashtags(e.target.value)}
              placeholder="#CYBEV #Tech #Creator"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white">
              {['general', 'technology', 'business', 'health', 'entertainment', 'faith', 'education', 'lifestyle', 'news', 'sports', 'music', 'food', 'travel'].map(c =>
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">Featured Image URL (optional)</label>
          <input value={featuredImage} onChange={e => setFeaturedImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase block mb-1.5">CYBEV Post Type</label>
          <div className="flex gap-2">
            {[{ id: 'blog', label: 'Blog Article', icon: FileText }, { id: 'post', label: 'Quick Post', icon: Share2 }].map(t => (
              <button key={t.id} onClick={() => setPublishType(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition ${
                  publishType === t.id ? 'bg-purple-50 text-purple-700 border-purple-400' : 'bg-white text-gray-500 border-gray-300'
                }`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={publishToCybev} disabled={!content.trim() || publishing}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition">
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish to CYBEV
          </button>
          <button onClick={formatForPlatforms} disabled={!content.trim() || formatting}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition">
            {formatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Format for All Platforms
          </button>
        </div>

        {/* CYBEV publish success */}
        {cybevPublished && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">Published to CYBEV!</p>
                <p className="text-xs text-green-600">{cybevPublished.message}</p>
              </div>
            </div>
            <a href={cybevPublished.postUrl} target="_blank" rel="noopener noreferrer"
              className="text-green-700 text-sm font-medium flex items-center gap-1 hover:underline">
              View <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );

  // ─── DISTRIBUTE TAB (copy-paste cards) ───
  const renderDistribute = () => {
    if (!formatted) return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
        <Share2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">Write content and click "Format for All Platforms" first</p>
        <button onClick={() => setActiveTab('compose')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
          Go to Compose
        </button>
      </div>
    );

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <p className="text-sm text-gray-700">
            <Sparkles className="w-4 h-4 inline text-purple-600 mr-1" />
            Content formatted for each platform. Click <strong>Copy</strong> then paste directly into each app.
          </p>
        </div>

        {PLATFORMS.filter(p => !p.auto && formatted[p.id]).map(platform => {
          const f = formatted[platform.id];
          const isCopied = copiedPlatform === platform.id;
          const text = f.text || f.description || '';

          return (
            <div key={platform.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Platform header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ borderLeftWidth: 4, borderLeftColor: platform.color }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{platform.emoji}</span>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{platform.name}</span>
                    {f.charLimit && <span className="text-[11px] text-gray-400 ml-2">{text.length}/{f.charLimit} chars</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyText(text, platform.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isCopied ? 'bg-green-100 text-green-700' : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}>
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                  {platform.link && (
                    <a href={platform.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 no-underline">
                      Open {platform.name} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Content preview */}
              <div className="p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">{text}</pre>
                
                {/* Thread preview for Twitter */}
                {f.thread && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-xs font-semibold text-blue-600 mb-2">Thread ({f.thread.length} tweets):</p>
                    {f.thread.map((tweet, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-2.5 mb-1.5 text-xs text-gray-700">
                        {tweet}
                      </div>
                    ))}
                    <button onClick={() => copyText(f.thread.join('\n\n---\n\n'), platform.id + '_thread')}
                      className="mt-1 text-xs text-blue-600 font-medium hover:underline">
                      Copy full thread
                    </button>
                  </div>
                )}

                {/* YouTube tags */}
                {f.tags && f.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {f.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px]">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {f.tips && (
                  <p className="mt-2 text-[11px] text-gray-400 italic">💡 {f.tips}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── HISTORY TAB ───
  const renderHistory = () => (
    <div>
      {published.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No publishing activity yet this session</p>
        </div>
      ) : (
        <div className="space-y-2">
          {published.map((item, i) => {
            const plat = PLATFORMS.find(p => p.id === item.platform) || PLATFORMS[0];
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-3.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{plat.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{plat.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.type === 'copied' ? 'Content copied' : 'Auto-published'} • {new Date(item.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.type === 'copied' ? (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-medium">Copied</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[11px] font-medium">Published</span>
                  )}
                  {item.postUrl && (
                    <a href={item.postUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-xs">
                      View <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ─── MAIN ───
  const tabs = [
    { id: 'compose', label: 'Compose', icon: Edit3 },
    { id: 'distribute', label: 'Distribute', icon: Share2, badge: formatted ? '✓' : null },
    { id: 'history', label: 'History', icon: Clock, badge: published.length > 0 ? published.length : null },
  ];

  return (
    <AppLayout>
      <Head><title>Social Publisher | CYBEV Studio</title></Head>
      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Radio className="w-7 h-7 text-pink-500" /> Social Publisher
            </h1>
            <p className="text-sm text-gray-500 mt-1">Auto-publish to CYBEV + format for all platforms</p>
          </div>
          <Link href="/studio/campaigns/ai" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 no-underline">
            <Zap className="w-4 h-4" /> AI Campaigns
          </Link>
        </div>

        <div className="flex gap-1 mb-5 border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id ? 'text-purple-600 border-purple-600' : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'compose' && renderCompose()}
        {activeTab === 'distribute' && renderDistribute()}
        {activeTab === 'history' && renderHistory()}

        {/* How it works */}
        <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">1</div>
              <div><p className="font-medium text-gray-900">Write once</p><p className="text-xs text-gray-500">Compose your content in the editor</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
              <div><p className="font-medium text-gray-900">Auto-format</p><p className="text-xs text-gray-500">AI optimizes for each platform's rules</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
              <div><p className="font-medium text-gray-900">Copy & post</p><p className="text-xs text-gray-500">CYBEV auto-publishes. Copy-paste for others</p></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
