// ============================================
// FILE: [id].jsx
// PATH: /src/pages/live/[id].jsx
// CYBEV TV 2.0 — Live Stream Viewer with Chat
// ============================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';
import api from '@/lib/api';
import {
  ArrowLeft, Radio, Eye, Heart, Share2, Send, Users,
  MessageCircle, X, Flag, ThumbsUp, Volume2, VolumeX,
  Maximize, Minimize, Crown, Loader2, UserPlus, Play
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
const REACTION_EMOJIS = ['❤️', '🔥', '👏', '😂', '🎉', '😮', '💯', '🙌'];

function ChatMessage({ msg }) {
  if (msg.type === 'system') {
    return <div className="text-center text-[11px] text-gray-500 py-1 italic">{msg.text}</div>;
  }
  return (
    <div className="flex gap-2 py-1 px-2 rounded hover:bg-white/5 group">
      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {msg.avatar ? (
          <img src={msg.avatar} className="w-full h-full object-cover" alt="" />
        ) : (
          <span className="text-[10px] text-purple-400 font-bold">{(msg.username || '?')[0].toUpperCase()}</span>
        )}
      </div>
      <div className="min-w-0">
        <span className="text-purple-400 text-xs font-semibold mr-1.5">{msg.username}</span>
        <span className="text-gray-300 text-sm break-words">{msg.text}</span>
      </div>
    </div>
  );
}

function FloatingEmoji({ emoji, id, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 2200);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <div className="absolute pointer-events-none text-2xl"
      style={{
        left: `${Math.random() * 70 + 15}%`,
        bottom: '15%',
        animation: 'floatUp 2.2s ease-out forwards'
      }}
    >
      {emoji}
    </div>
  );
}

export default function LiveStreamViewer() {
  const router = useRouter();
  const { streamId } = router.query;

  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  };

  // Fetch stream data
  useEffect(() => {
    if (!streamId) return;
    const fetchStream = async () => {
      try {
        // Try livestream endpoint first, fallback to vlog
        let res;
        try {
          res = await api.get(`/api/streams/${streamId}`);
        } catch {
          res = await api.get(`/api/vlogs/${streamId}`);
        }
        setStream(res.data);
        setViewerCount(res.data.viewerCount || res.data.views || 0);
      } catch (err) {
        console.error('Failed to load stream:', err);
        setError('Stream not found');
      } finally {
        setLoading(false);
      }
    };
    fetchStream();
  }, [streamId]);

  // Socket.io for live chat
  useEffect(() => {
    if (!streamId || !stream) return;
    const user = getUser();
    if (!user) return;

    const socket = io(`${API_URL}/live-chat`, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-stream', {
        streamId,
        userId: user._id,
        username: user.displayName || user.username,
        avatar: user.avatar || ''
      });
    });

    socket.on('chat-message', (msg) => {
      setChatMessages(prev => [...prev.slice(-300), msg]);
    });

    socket.on('viewer-count', ({ count }) => {
      setViewerCount(count);
    });

    socket.on('reaction', ({ emoji, username }) => {
      const id = Date.now() + Math.random();
      setFloatingEmojis(prev => [...prev, { id, emoji }]);
    });

    socket.on('stream-ended', () => {
      setStream(prev => prev ? { ...prev, status: 'ended' } : prev);
    });

    return () => {
      socket.emit('leave-stream', { streamId });
      socket.disconnect();
    };
  }, [streamId, stream]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const user = getUser();
    socketRef.current?.emit('chat-message', {
      streamId,
      text: chatInput.trim(),
      username: user?.displayName || user?.username,
      avatar: user?.avatar
    });
    setChatInput('');
  };

  const sendReaction = (emoji) => {
    socketRef.current?.emit('reaction', { streamId, emoji });
    const id = Date.now() + Math.random();
    setFloatingEmojis(prev => [...prev, { id, emoji }]);
  };

  const removeEmoji = useCallback((id) => {
    setFloatingEmojis(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleFollow = async () => {
    if (!stream?.host?._id && !stream?.author?._id) return;
    try {
      const targetId = stream.host?._id || stream.author?._id;
      if (isFollowing) {
        await api.delete(`/api/follow/${targetId}`);
      } else {
        await api.post(`/api/follow/${targetId}`);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/api/vlogs/${streamId}/react`, { type: 'like' });
      setLiked(!liked);
    } catch {}
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/live/${streamId}`);
    alert('Link copied!');
  };

  // Get video source URL
  const getVideoSrc = () => {
    if (!stream) return '';
    if (stream.muxPlaybackId) return `https://stream.mux.com/${stream.muxPlaybackId}.m3u8`;
    if (stream.rtmpUrl) return stream.rtmpUrl;
    if (stream.videoUrl) return stream.videoUrl;
    if (stream.url) return stream.url;
    return '';
  };

  const hostUser = stream?.host || stream?.author || {};
  const isLive = stream?.status === 'live';
  const isEnded = stream?.status === 'ended' || stream?.status === 'saved';

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-purple-500" />
    </div>
  );

  if (error || !stream) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
      <p className="text-xl">{error || 'Stream not found'}</p>
      <Link href="/tv" className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">Back to TV</Link>
    </div>
  );

  return (
    <>
      <Head>
        <title>{stream.title || 'Live Stream'} — CYBEV TV</title>
      </Head>
      <style jsx global>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 0.8; transform: translateY(-80px) scale(1.15); }
          100% { opacity: 0; transform: translateY(-180px) scale(0.7); }
        }
      `}</style>

      <div ref={containerRef} className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">
        {/* Video + Info Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/80 border-b border-gray-800">
            <button onClick={() => router.push('/tv')} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-semibold text-sm truncate">{stream.title}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                {isLive ? (
                  <span className="flex items-center gap-1 text-red-400"><Radio size={11} className="animate-pulse" /> LIVE</span>
                ) : (
                  <span className="text-gray-500">{isEnded ? 'Ended' : 'VOD'}</span>
                )}
                <span className="flex items-center gap-1"><Eye size={11} /> {viewerCount}</span>
              </div>
            </div>
            <button onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg ${showChat ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:text-white'}`}
            >
              <MessageCircle size={18} />
            </button>
          </div>

          {/* Video Player */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px]">
            {getVideoSrc() ? (
              <video
                ref={videoRef}
                src={getVideoSrc()}
                autoPlay
                playsInline
                muted={muted}
                controls={false}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Play size={48} className="text-gray-600" />
                <p className="text-sm">{isLive ? 'Connecting to stream...' : 'Video unavailable'}</p>
              </div>
            )}

            {/* Floating reactions */}
            {floatingEmojis.map(e => (
              <FloatingEmoji key={e.id} id={e.id} emoji={e.emoji} onDone={removeEmoji} />
            ))}

            {/* Controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-10 pb-3 px-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setMuted(!muted)} className="text-white/70 hover:text-white">
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button onClick={toggleFullscreen} className="text-white/70 hover:text-white">
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>

            {/* Ended overlay */}
            {isEnded && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-3">
                <p className="text-xl font-bold">Stream Ended</p>
                <Link href="/tv" className="px-5 py-2 bg-purple-600 rounded-full font-medium hover:bg-purple-700">
                  Back to TV
                </Link>
              </div>
            )}
          </div>

          {/* Stream Info Bar */}
          <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 overflow-hidden flex-shrink-0">
                  {hostUser.avatar ? (
                    <img src={hostUser.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-purple-400 font-bold">
                      {(hostUser.displayName || hostUser.username || '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{hostUser.displayName || hostUser.username}</p>
                  <p className="text-gray-400 text-xs">{viewerCount} viewers</p>
                </div>
                <button onClick={handleFollow}
                  className={`ml-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isFollowing ? 'bg-gray-700 text-gray-300' : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleLike}
                  className={`p-2 rounded-full transition-colors ${liked ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button onClick={copyShareLink} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Reaction bar */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => sendReaction(emoji)}
                  className="text-lg hover:scale-125 active:scale-90 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900 flex flex-col h-72 lg:h-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <h3 className="text-white font-semibold text-sm">Live Chat</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={12} /> {viewerCount}</span>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-white lg:hidden">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-1 py-2">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <MessageCircle size={24} className="mx-auto mb-2 text-gray-600" />
                  Chat is empty. Say something!
                </div>
              )}
              {chatMessages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendChat(); }}
                  placeholder="Send a message..."
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
          </div>
        )}
      </div>
    </>
  );
}
