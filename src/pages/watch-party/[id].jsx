// =============================================
// FILE: [id].jsx
// PATH: /src/pages/watch-party/[id].jsx
// VERSION: v2.1.0
// CYBEV Watch Party Room — Synchronized Viewing
// Features: LIVE Badge Overlay, Viewer Count,
//           Invite Friends Modal, Share (Web Share API),
//           Publish to Feed, End Party Modal,
//           Admin Boost Panel, Live Chat, Reactions,
//           HLS/Mux/YouTube/RTMP, Co-host Roles
// FIXES: Stray JSX bracket breaking LiveBadge,
//        Inline dark styles (light-mode-only _app.jsx),
//        Facebook-style LIVE badge with CYBEV branding
// STACK: Next.js (Pages Router) + Socket.io + Tailwind
// BACKEND: api.cybev.io/api/watch-party/*
// AUTHOR: @prince
// UPDATED: 2026-03-13
// =============================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import io from 'socket.io-client';
import api from '@/lib/api';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Send, Users, MessageCircle, X, ArrowLeft, Radio,
  Crown, Shield, Eye, Share2, MoreVertical, LogOut,
  ChevronDown, ChevronUp, Settings, Copy,
  // v2.0 additions
  UserPlus, Search, Rocket, Megaphone, PhoneOff,
  Check, ExternalLink, Bell, Star, Flame, AlertTriangle
} from 'lucide-react';

const REACTION_EMOJIS = ['🔥', '❤️', '😂', '👏', '🎉', '😮', '💯', '🙌', '😍', '💀', '🤣', '👀'];
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ─── Floating Reaction Component ───
function FloatingReaction({ emoji, id, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), 2000);
    return () => clearTimeout(timer);
  }, [id, onDone]);

  const left = Math.random() * 80 + 10; // 10-90%
  return (
    <div
      className="absolute pointer-events-none text-3xl animate-bounce"
      style={{
        left: `${left}%`,
        bottom: '20%',
        animation: 'floatUp 2s ease-out forwards',
      }}
    >
      {emoji}
    </div>
  );
}

// ─── Chat Message Component ───
function ChatMsg({ msg }) {
  if (msg.type === 'system') {
    return (
      <div className="text-center text-xs text-gray-400 py-1">
        {msg.text}
      </div>
    );
  }
  return (
    <div className="flex gap-2 py-1.5 hover:bg-white/5 px-2 rounded">
      <div className="w-6 h-6 rounded-full bg-purple-500/30 flex-shrink-0 flex items-center justify-center text-[10px] text-purple-300 font-bold overflow-hidden">
        {msg.avatar ? (
          <img src={msg.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          (msg.username || '?')[0].toUpperCase()
        )}
      </div>
      <div className="min-w-0">
        <span className="text-purple-400 text-xs font-semibold mr-1.5">{msg.username}</span>
        <span className="text-gray-200 text-sm break-words">{msg.text}</span>
      </div>
    </div>
  );
}

// ─── LIVE Badge Overlay (Facebook Live style) ───
function LiveBadgeOverlay({ isLive, viewerCount }) {
  return (
    <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
      {/* CYBEV logo pill */}
      <div className="flex items-center gap-1 bg-purple-600 rounded px-1.5 py-0.5">
        <span className="text-white text-[10px] font-bold tracking-wide">CYBEV</span>
      </div>
      {/* LIVE pill */}
      <div className={`flex items-center gap-1.5 rounded px-2 py-0.5 ${
        isLive ? 'bg-red-600' : 'bg-gray-600'
      }`}>
        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
        )}
        <span className="text-white text-xs font-bold tracking-wider">
          {isLive ? 'LIVE' : 'ENDED'}
        </span>
      </div>
      {/* Viewer count pill */}
      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5">
        <Eye size={13} className="text-white" />
        <span className="text-white text-xs font-bold">
          {viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}K` : viewerCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Invite Friends Modal ───
function InviteModal({ isOpen, onClose, partyId }) {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const [invited, setInvited] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api.get(`/api/users/friends?search=${search}`)
      .then(({ data }) => setFriends(data.friends || data || []))
      .catch(() => setFriends([]))
      .finally(() => setLoading(false));
  }, [isOpen, search]);

  const handleInvite = async (userId) => {
    try {
      await api.post(`/api/watch-party/${partyId}/invite`, { userId });
      setInvited(prev => new Set([...prev, userId]));
    } catch (err) {
      console.error('Invite failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="w-full sm:max-w-md max-h-[80vh] bg-gray-900 rounded-t-2xl sm:rounded-2xl flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <UserPlus size={18} /> Invite Friends
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2.5 border border-gray-700 focus-within:border-purple-500 transition-colors">
            <Search size={16} className="text-gray-500 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
              placeholder="Search friends..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Friends list */}
        <div className="flex-1 overflow-y-auto px-4 pb-2 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : friends.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">
              {search ? 'No friends found' : 'Loading friends...'}
            </p>
          ) : (
            friends.map(friend => (
              <div key={friend._id} className="flex items-center justify-between py-2.5 border-b border-gray-800/50 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden">
                      {friend.profilePicture || friend.avatar ? (
                        <img src={friend.profilePicture || friend.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-purple-300 text-xs font-bold">
                          {(friend.displayName || friend.username || '?')[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    {friend.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{friend.displayName || friend.username}</p>
                    <p className="text-gray-500 text-xs truncate">@{friend.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleInvite(friend._id)}
                  disabled={invited.has(friend._id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 flex-shrink-0 ${
                    invited.has(friend._id)
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-default'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {invited.has(friend._id) ? <><Check size={12} /> Sent</> : 'Invite'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Invite link footer */}
        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-gray-500 text-xs mb-2 font-medium">Or share invite link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : 'https://cybev.io'}/watch-party/${partyId}`}
              className="flex-1 bg-gray-800 text-gray-400 text-xs px-3 py-2 rounded-lg border border-gray-700 font-mono truncate"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/watch-party/${partyId}`);
              }}
              className="flex items-center gap-1 text-xs font-medium px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors flex-shrink-0"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Boost Panel ───
// Matches backend: POST /api/watch-party/:id/boost
// Payload: { viewers, viewCount, comments[], reactions[] }
const BOOST_COMMENTS = [
  "This is amazing! 🔥", "God bless you pastor! 🙏", "Watching from Nigeria 🇳🇬",
  "Hallelujah! Glory to God!", "So powerful! Thank you Jesus 🙌",
  "Watching from South Africa 🇿🇦", "This is a blessing!", "Amen! 🙏🙏🙏",
  "Powerful word! 🔥🔥", "Thank you for this! Watching from Ghana 🇬🇭",
  "I receive it in Jesus name!", "Glory!!! 🎉", "Watching from UK 🇬🇧",
  "This changed my life!", "What a time to be alive! 🙌",
  "Watching from the US 🇺🇸", "So blessed by this stream", "Wow! Incredible!",
  "I'm sharing this with everyone!", "Praise the Lord! 🎶",
  "Watching from India 🇮🇳", "God is good all the time!", "Thank you CYBEV! ❤️",
  "Best platform ever!", "Watching with my family 👨‍👩‍👧‍👦",
];

const BOOST_PRESETS = [
  { label: 'Light', viewers: 50, viewCount: 100, comments: 5, reactions: 10, color: 'blue' },
  { label: 'Medium', viewers: 250, viewCount: 500, comments: 15, reactions: 30, color: 'purple' },
  { label: 'Heavy', viewers: 1000, viewCount: 2000, comments: 25, reactions: 50, color: 'orange' },
  { label: 'Viral 🚀', viewers: 5000, viewCount: 10000, comments: 25, reactions: 100, color: 'red' },
];

const REACTION_EMOJIS_BOOST = ['🔥', '❤️', '😂', '👏', '🎉', '😮', '💯', '🙌', '😍', '🤣', '👀'];

function AdminBoostPanel({ isOpen, onClose, partyId, socketRef }) {
  const [tab, setTab] = useState('presets'); // presets | custom
  const [viewers, setViewers] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [reactionCount, setReactionCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]); // track boosts applied

  // Generate random comments from template pool
  const generateComments = (count) => {
    const shuffled = [...BOOST_COMMENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  // Generate random reactions
  const generateReactions = (count) => {
    return Array.from({ length: count }, () =>
      REACTION_EMOJIS_BOOST[Math.floor(Math.random() * REACTION_EMOJIS_BOOST.length)]
    );
  };

  const handleBoost = async (v, vc, cc, rc) => {
    setSubmitting(true);
    setResult(null);
    try {
      const payload = {
        viewers: v || 0,
        viewCount: vc || 0,
        comments: cc > 0 ? generateComments(cc) : [],
        reactions: rc > 0 ? generateReactions(rc) : [],
      };
      const { data } = await api.post(`/api/watch-party/${partyId}/boost`, payload);
      setResult({ ok: true, msg: data.message || 'Boost applied!' });
      setHistory(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        viewers: v, comments: cc, reactions: rc
      }]);
      // Refresh socket viewer count for instant UI update
      socketRef?.current?.emit('request-sync', { partyId });
    } catch (err) {
      setResult({ ok: false, msg: err.response?.data?.error || 'Boost failed. Are you admin?' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreset = (preset) => {
    handleBoost(preset.viewers, preset.viewCount, preset.comments, preset.reactions);
  };

  const handleCustomBoost = () => {
    handleBoost(viewers, viewCount, commentCount, reactionCount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-2xl border-t border-yellow-500/20 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))', backgroundColor: '#111827' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 sticky top-0 bg-gray-900 z-10" style={{ backgroundColor: '#111827' }}>
        <div className="flex items-center gap-2 text-yellow-400">
          <Rocket size={18} />
          <span className="font-bold text-sm">Admin Boost Panel</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-4">
        {[
          { id: 'presets', label: '⚡ Quick Presets' },
          { id: 'custom', label: '🎛️ Custom Boost' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              tab === t.id
                ? 'text-yellow-400 border-yellow-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3">
        {tab === 'presets' ? (
          /* ─── Quick Presets ─── */
          <div className="space-y-3">
            <p className="text-gray-500 text-xs">One-tap boost with Special Users. Viewers + comments + reactions added instantly.</p>
            <div className="grid grid-cols-2 gap-2">
              {BOOST_PRESETS.map(preset => (
                <button key={preset.label} onClick={() => handlePreset(preset)} disabled={submitting}
                  className={`relative p-3 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${
                    preset.color === 'blue' ? 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10' :
                    preset.color === 'purple' ? 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10' :
                    preset.color === 'orange' ? 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10' :
                    'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
                  }`}
                >
                  <div className={`text-sm font-bold mb-1.5 ${
                    preset.color === 'blue' ? 'text-blue-400' :
                    preset.color === 'purple' ? 'text-purple-400' :
                    preset.color === 'orange' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {preset.label}
                  </div>
                  <div className="space-y-0.5 text-[11px] text-gray-400">
                    <div>👥 +{preset.viewers.toLocaleString()} viewers</div>
                    <div>👁 +{preset.viewCount.toLocaleString()} views</div>
                    <div>💬 +{preset.comments} comments</div>
                    <div>🔥 +{preset.reactions} reactions</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ─── Custom Boost ─── */
          <div className="space-y-4">
            <p className="text-gray-500 text-xs">Fine-tune boost numbers. Comments are auto-generated from Special Users.</p>

            {/* Viewers */}
            <div>
              <label className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-2 block">
                👥 Boost Viewers
              </label>
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 5000, 10000].map(v => (
                  <button key={v} onClick={() => setViewers(v)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      viewers === v
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    +{v >= 1000 ? `${v / 1000}K` : v}
                  </button>
                ))}
              </div>
              <input
                type="number" min="0" value={viewers}
                onChange={e => setViewers(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-yellow-500"
                style={{ backgroundColor: '#1f2937' }}
                placeholder="Custom viewer count..."
              />
            </div>

            {/* View Count */}
            <div>
              <label className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-2 block">
                👁 Synthetic Views
              </label>
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 2000, 5000, 10000].map(v => (
                  <button key={v} onClick={() => setViewCount(v)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      viewCount === v
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    +{v >= 1000 ? `${v / 1000}K` : v}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-2 block">
                💬 Auto-Comments (from Special Users)
              </label>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 25].map(c => (
                  <button key={c} onClick={() => setCommentCount(c)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      commentCount === c
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    +{c}
                  </button>
                ))}
              </div>
            </div>

            {/* Reactions */}
            <div>
              <label className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-2 block">
                🔥 Reaction Burst
              </label>
              <div className="flex gap-2 flex-wrap">
                {[10, 25, 50, 100].map(r => (
                  <button key={r} onClick={() => setReactionCount(r)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      reactionCount === r
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    +{r}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {(viewers > 0 || viewCount > 0 || commentCount > 0 || reactionCount > 0) && (
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700" style={{ backgroundColor: '#1a2332' }}>
                <div className="text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Boost Summary</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300">
                  {viewers > 0 && <span>👥 +{viewers.toLocaleString()} viewers</span>}
                  {viewCount > 0 && <span>👁 +{viewCount.toLocaleString()} views</span>}
                  {commentCount > 0 && <span>💬 +{commentCount} comments</span>}
                  {reactionCount > 0 && <span>🔥 +{reactionCount} reactions</span>}
                </div>
              </div>
            )}

            {/* Apply */}
            <button onClick={handleCustomBoost} disabled={submitting || (viewers === 0 && viewCount === 0 && commentCount === 0 && reactionCount === 0)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              {submitting ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><Rocket size={16} /> Apply Boost</>
              )}
            </button>
          </div>
        )}

        {/* Result message */}
        {result && (
          <div className={`mt-3 text-center text-sm font-medium py-2 rounded-lg ${
            result.ok ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
          }`}>
            {result.msg}
          </div>
        )}

        {/* Boost History */}
        {history.length > 0 && (
          <div className="mt-3 border-t border-gray-800 pt-3">
            <div className="text-[11px] font-semibold text-gray-500 uppercase mb-2">Boost History (this session)</div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {history.slice().reverse().map((h, i) => (
                <div key={i} className="text-[11px] text-gray-500 flex items-center gap-2">
                  <span className="text-gray-600">{h.time}</span>
                  <span>👥{h.viewers}</span>
                  <span>💬{h.comments}</span>
                  <span>🔥{h.reactions}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── End Party Confirmation Modal ───
function EndPartyModal({ isOpen, onClose, onConfirm, viewerCount }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 text-center animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-white text-lg font-bold mb-2">End Watch Party?</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          This will end the party for {viewerCount > 0 ? `all ${viewerCount} viewer${viewerCount !== 1 ? 's' : ''}` : 'everyone'}.
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm border border-gray-700 transition-colors"
          >
            Keep Going
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors"
          >
            End Party
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WatchPartyRoom() {
  const router = useRouter();
  const { id: partyId } = router.query;

  // State
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [isCoHost, setIsCoHost] = useState(false);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [activeViewers, setActiveViewers] = useState(0);

  // Reactions
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [showReactions, setShowReactions] = useState(false);

  // v2.0 — New UI state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBoostPanel, setShowBoostPanel] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const isSyncingRef = useRef(false); // prevent feedback loops
  const hlsRef = useRef(null);
  const [hlsLoaded, setHlsLoaded] = useState(false);

  // Get current user from localStorage
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch { return null; }
  };

  // ─── Fetch party data ───
  useEffect(() => {
    if (!partyId) return;
    const fetchParty = async () => {
      try {
        const { data } = await api.get(`/api/watch-party/${partyId}`);
        setParty(data);
        setChatMessages(data.chatMessages || []);
        setParticipants(data.participants?.filter(p => p.isActive) || []);
        setActiveViewers(data.activeViewers || 0);

        const user = getUser();
        if (user) {
          setIsHost(data.host?._id === user._id || data.host === user._id);
          const myPart = data.participants?.find(p =>
            (p.user?._id || p.user) === user._id
          );
          setIsCoHost(myPart?.role === 'co-host');
        }

        // Apply initial playback state
        if (data.playbackState) {
          setIsPlaying(data.playbackState.isPlaying);
          setCurrentTime(data.playbackState.currentTime);
        }
      } catch (err) {
        console.error('Failed to fetch party:', err);
        setError('Watch party not found');
      } finally {
        setLoading(false);
      }
    };
    fetchParty();
  }, [partyId]);

  // ─── Join party via REST ───
  useEffect(() => {
    if (!partyId || !party) return;
    const joinParty = async () => {
      try {
        await api.post(`/api/watch-party/${partyId}/join`);
      } catch (err) {
        console.error('Failed to join party:', err);
      }
    };
    joinParty();
  }, [partyId, party]);

  // ─── Socket.io connection ───
  useEffect(() => {
    if (!partyId || !party) return;
    const user = getUser();
    if (!user) return;

    const socket = io(`${API_URL}/watch-party`, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🎬 Connected to watch party socket');
      socket.emit('join-room', {
        partyId,
        userId: user._id,
        username: user.displayName || user.username,
        avatar: user.avatar || ''
      });
    });

    // Sync playback state from host
    socket.on('sync-state', ({ playbackState, activeViewers: av, participants: parts }) => {
      if (playbackState) {
        isSyncingRef.current = true;
        setIsPlaying(playbackState.isPlaying);
        setCurrentTime(playbackState.currentTime);
        if (videoRef.current) {
          videoRef.current.currentTime = playbackState.currentTime;
          if (playbackState.isPlaying) videoRef.current.play().catch(() => {});
          else videoRef.current.pause();
        }
        setTimeout(() => { isSyncingRef.current = false; }, 500);
      }
      if (av !== undefined) setActiveViewers(av);
      if (parts) setParticipants(parts);
    });

    // Force seek
    socket.on('force-seek', ({ currentTime: ct }) => {
      isSyncingRef.current = true;
      if (videoRef.current) videoRef.current.currentTime = ct;
      setCurrentTime(ct);
      setTimeout(() => { isSyncingRef.current = false; }, 500);
    });

    // Chat messages
    socket.on('chat-message', (msg) => {
      setChatMessages(prev => [...prev.slice(-200), msg]);
    });

    // Reactions
    socket.on('reaction', ({ emoji, username }) => {
      const id = Date.now() + Math.random();
      setFloatingReactions(prev => [...prev, { id, emoji }]);
    });

    // User joined/left
    socket.on('user-joined', ({ username, activeViewers: av }) => {
      setActiveViewers(av);
    });
    socket.on('user-left', ({ username, activeViewers: av }) => {
      setActiveViewers(av);
    });

    // Role changes
    socket.on('role-changed', ({ targetUserId, role }) => {
      const user = getUser();
      if (user && targetUserId === user._id) {
        setIsCoHost(role === 'co-host');
      }
    });

    // Party ended
    socket.on('party-ended', () => {
      setParty(prev => prev ? { ...prev, status: 'ended' } : prev);
    });

    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
    });

    return () => {
      socket.emit('leave-room', { partyId });
      socket.disconnect();
    };
  }, [partyId, party]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ─── Video event handlers ───
  const handlePlayPause = () => {
    if (!isHost && !isCoHost) return;
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
      socketRef.current?.emit('sync-playback', { partyId, isPlaying: true, currentTime: video.currentTime });
    } else {
      video.pause();
      setIsPlaying(false);
      socketRef.current?.emit('sync-playback', { partyId, isPlaying: false, currentTime: video.currentTime });
    }
  };

  const handleSeek = (e) => {
    if (!isHost && !isCoHost) return;
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const newTime = pct * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    socketRef.current?.emit('seek', { partyId, currentTime: newTime });
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSyncingRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Apply initial state from party
      if (party?.playbackState) {
        videoRef.current.currentTime = party.playbackState.currentTime;
        if (party.playbackState.isPlaying) videoRef.current.play().catch(() => {});
      }
    }
  };

  const toggleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    }
  };

  // Auto-hide controls
  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  // ─── Chat ───
  const sendChat = () => {
    if (!chatInput.trim()) return;
    socketRef.current?.emit('chat-message', { partyId, text: chatInput.trim() });
    setChatInput('');
  };

  // ─── Reactions ───
  const sendReaction = (emoji) => {
    socketRef.current?.emit('reaction', { partyId, emoji });
    // Also show locally immediately
    const id = Date.now() + Math.random();
    setFloatingReactions(prev => [...prev, { id, emoji }]);
  };

  const removeReaction = useCallback((id) => {
    setFloatingReactions(prev => prev.filter(r => r.id !== id));
  }, []);

  // ─── Leave party ───
  const handleLeave = async () => {
    try { await api.post(`/api/watch-party/${partyId}/leave`); } catch {}
    router.push('/watch-party');
  };

  // ─── End party (host only) ─── (v2: uses modal)
  const handleEndParty = async () => {
    try {
      await api.post(`/api/watch-party/${partyId}/end`);
      socketRef.current?.emit('end-party', { partyId });
      setShowEndModal(false);
      router.push('/watch-party');
    } catch (err) {
      console.error('Failed to end party:', err);
    }
  };

  // ─── Format time ───
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ─── Copy invite link ─── (v2: Web Share API with fallback)
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/watch-party/${partyId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: party?.title || 'Watch Party on CYBEV',
          text: 'Join my Watch Party on CYBEV! 🎉',
          url: shareUrl,
        });
        return;
      } catch {}
    }
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // ─── Publish to feed ─── (v2)
  const handlePublish = async () => {
    setPublishLoading(true);
    try {
      await api.post(`/api/watch-party/${partyId}/publish`);
      setPublished(true);
    } catch (err) {
      console.error('Publish to feed failed:', err);
    } finally {
      setPublishLoading(false);
    }
  };

  // Get video source URL
  const getVideoSrc = () => {
    if (!party?.videoSource) return '';
    if (party.videoSource.type === 'url') return party.videoSource.url;
    if (party.videoSource.type === 'vlog' && party.videoSource.url) return party.videoSource.url;
    if (party.videoSource.type === 'mux' && party.videoSource.muxPlaybackId) {
      return `https://stream.mux.com/${party.videoSource.muxPlaybackId}.m3u8`;
    }
    return party.videoSource.url || '';
  };

  // Check if YouTube
  const isYouTube = party?.videoSource?.type === 'youtube';
  // Check if HLS stream (.m3u8) — works for Mux, Livepeer, or any HLS URL
  const videoSrc = getVideoSrc();
  const isHLS = !isYouTube && videoSrc && (
    videoSrc.includes('.m3u8') ||
    party?.videoSource?.type === 'mux' ||
    videoSrc.includes('livepeercdn') ||
    videoSrc.includes('/chunklist') ||
    videoSrc.includes('/playlist')
  );
  const getYouTubeEmbedUrl = () => {
    const url = party?.videoSource?.url || '';
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&enablejsapi=1` : '';
  };

  // ─── HLS.js for any .m3u8 stream (Mux, Livepeer, custom HLS URLs) ───
  useEffect(() => {
    if (!isHLS || !videoRef.current || !videoSrc) return;

    const initHls = () => {
      if (typeof window === 'undefined' || !window.Hls) {
        setTimeout(initHls, 500);
        return;
      }
      const Hls = window.Hls;
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          manifestLoadingMaxRetry: 10,
          manifestLoadingRetryDelay: 2000,
        });
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal && data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            setTimeout(() => hls.startLoad(), 3000);
          }
        });
        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        videoRef.current.src = videoSrc;
        videoRef.current.play().catch(() => {});
      }
    };

    if (hlsLoaded) initHls();
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [isHLS, hlsLoaded, party, videoSrc]);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center" style={{ backgroundColor: '#030712' }}>
      <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error || !party) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4" style={{ backgroundColor: '#030712' }}>
      <p className="text-xl">{error || 'Party not found'}</p>
      <button onClick={() => router.push('/watch-party')} className="px-4 py-2 bg-purple-600 rounded-lg">
        Back to Parties
      </button>
    </div>
  );

  const canControl = isHost || isCoHost;
  const isEnded = party.status === 'ended';

  return (
    <>
      <Head>
        <title>{party.title} — Watch Party — CYBEV</title>
      </Head>

      {/* Float-up + slide-up animations */}
      <style jsx global>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 0.8; transform: translateY(-100px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-200px) scale(0.8); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row" style={{ backgroundColor: '#030712', color: '#f9fafb' }}>
        {/* ─── Video Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border-b border-gray-800" style={{ backgroundColor: '#111827', borderColor: '#1f2937' }}>
            <button onClick={handleLeave} className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-semibold truncate text-sm sm:text-base">{party.title}</h1>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  {isEnded ? <Eye size={10} /> : <Radio size={10} className="text-red-500 animate-pulse" />}
                  {isEnded ? 'Ended' : 'Live'}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={10} /> {activeViewers}
                </span>
                <span className="hidden sm:inline">Host: {party.host?.displayName || party.host?.username}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* v2: Invite friends */}
              {!isEnded && (
                <button onClick={() => setShowInviteModal(true)}
                  className="text-gray-400 hover:text-white p-1.5 sm:p-2" title="Invite friends">
                  <UserPlus size={16} />
                </button>
              )}

              {/* v2: Share (Web Share API) */}
              <button onClick={handleShare}
                className="text-gray-400 hover:text-white p-1.5 sm:p-2" title={linkCopied ? 'Copied!' : 'Share'}>
                {linkCopied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
              </button>

              {/* v2: Publish to feed (host only) */}
              {isHost && !isEnded && (
                <button onClick={handlePublish} disabled={publishLoading || published}
                  className={`text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                    published
                      ? 'text-green-400 border-green-500/30 bg-green-500/10 cursor-default'
                      : 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10'
                  }`}
                  title="Publish to feed"
                >
                  <Megaphone size={12} />
                  {published ? 'Published' : publishLoading ? '...' : 'Publish'}
                </button>
              )}

              {/* Chat toggle */}
              <button onClick={() => setShowChat(!showChat)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${showChat ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:text-white'}`}
              >
                <MessageCircle size={16} />
              </button>

              {/* v2: Admin boost — visible to any admin, not just host */}
              {getUser()?.isAdmin && !isEnded && (
                <button onClick={() => setShowBoostPanel(!showBoostPanel)}
                  className="text-yellow-400 hover:text-yellow-300 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/10 transition-colors flex items-center gap-1"
                  title="Boost party"
                >
                  <Rocket size={14} />
                  <span className="hidden sm:inline">Boost</span>
                </button>
              )}

              {/* v2: End party (host, uses modal now) */}
              {isHost && !isEnded && (
                <button onClick={() => setShowEndModal(true)}
                  className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  End
                </button>
              )}
            </div>
          </div>

          {/* Video Player */}
          <div
            ref={playerContainerRef}
            className="relative flex-1 bg-black flex items-center justify-center cursor-pointer min-h-[200px] sm:min-h-[300px]"
            onMouseMove={showControlsTemporarily}
            onTouchStart={showControlsTemporarily}
            onClick={() => { if (canControl) handlePlayPause(); }}
          >
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl()}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                src={isHLS ? undefined : getVideoSrc()}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  if (isHost) socketRef.current?.emit('sync-playback', { partyId, isPlaying: false, currentTime: duration });
                }}
                playsInline
                muted={muted}
                volume={volume}
              />
            )}

            {/* v2: LIVE Badge Overlay (Facebook Live style) */}
            <LiveBadgeOverlay isLive={!isEnded} viewerCount={activeViewers} />

            {/* Floating Reactions */}
            {floatingReactions.map(r => (
              <FloatingReaction key={r.id} id={r.id} emoji={r.emoji} onDone={removeReaction} />
            ))}

            {/* Not host overlay */}
            {!canControl && !isYouTube && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-gray-300 px-4 py-2 rounded-full text-xs backdrop-blur-sm">
                Only the host can control playback
              </div>
            )}

            {/* Video Controls (non-YouTube) */}
            {!isYouTube && showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-12 pb-3 px-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group"
                  onClick={handleSeek}
                >
                  <div className="h-full bg-purple-500 rounded-full relative transition-all"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {canControl && (
                      <button onClick={handlePlayPause} className="text-white hover:text-purple-400 transition-colors">
                        {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                      </button>
                    )}
                    <button onClick={() => setMuted(!muted)} className="text-white hover:text-purple-400 transition-colors">
                      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <span className="text-white text-xs tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={toggleFullscreen} className="text-white hover:text-purple-400 transition-colors">
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Ended overlay */}
            {isEnded && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-4">
                <p className="text-2xl font-bold">Watch Party Ended</p>
                <button onClick={() => router.push('/watch-party')}
                  className="px-6 py-2.5 bg-purple-600 rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  Browse Parties
                </button>
              </div>
            )}
          </div>

          {/* Reaction Bar */}
          {!isEnded && (
            <div className="bg-gray-900 border-t border-gray-800 px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto" style={{ backgroundColor: '#111827', borderColor: '#1f2937', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => sendReaction(emoji)}
                  className="text-2xl sm:text-xl p-1.5 sm:p-1 hover:scale-125 active:scale-90 transition-transform flex-shrink-0"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Chat Sidebar ─── */}
        {showChat && (
          <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900 flex flex-col h-[50vh] lg:h-auto" style={{ backgroundColor: '#111827', borderColor: '#1f2937' }}>
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex gap-3">
                <button onClick={() => setShowParticipants(false)}
                  className={`text-sm font-medium transition-colors ${!showParticipants ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Chat
                </button>
                <button onClick={() => setShowParticipants(true)}
                  className={`text-sm font-medium flex items-center gap-1 transition-colors ${showParticipants ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Users size={14} /> {activeViewers}
                </button>
              </div>
              <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-white lg:hidden">
                <X size={18} />
              </button>
            </div>

            {showParticipants ? (
              /* Participants list */
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5">
                    <div className="w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px] text-purple-300 font-bold overflow-hidden">
                      {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : (p.username || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 flex-1 truncate">{p.username}</span>
                    {p.role === 'host' && <Crown size={14} className="text-yellow-500" />}
                    {p.role === 'co-host' && <Shield size={14} className="text-blue-400" />}
                  </div>
                ))}
              </div>
            ) : (
              /* Chat messages */
              <>
                <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
                  {chatMessages.map((msg, i) => <ChatMsg key={i} msg={msg} />)}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat input */}
                {!isEnded && (
                  <div className="p-3 border-t border-gray-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') sendChat(); }}
                        placeholder="Say something..."
                        maxLength={500}
                        className="flex-1 bg-gray-800 text-white placeholder-gray-500 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <button onClick={sendChat} disabled={!chatInput.trim()}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* v2: Invite Friends Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        partyId={partyId}
      />

      {/* v2: Admin Boost Panel */}
      <AdminBoostPanel
        isOpen={showBoostPanel}
        onClose={() => setShowBoostPanel(false)}
        partyId={partyId}
        socketRef={socketRef}
      />

      {/* v2: End Party Confirmation Modal */}
      <EndPartyModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={handleEndParty}
        viewerCount={activeViewers}
      />

      {/* HLS.js for Mux/RTMP stream playback */}
      <Script
        src="https://cdn.jsdelivr.net/npm/hls.js@latest"
        strategy="afterInteractive"
        onLoad={() => setHlsLoaded(true)}
      />
    </>
  );
}
