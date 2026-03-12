// ============================================
// FILE: [id].jsx
// PATH: /src/pages/watch-party/[id].jsx
// CYBEV Watch Party Room — Synchronized Viewing
// ============================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import io from 'socket.io-client';
import api from '@/lib/api';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Send, Users, MessageCircle, X, ArrowLeft, Radio,
  Crown, Shield, Eye, Share2, MoreVertical, LogOut,
  ChevronDown, ChevronUp, Settings, Copy
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

  // Refs
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const isSyncingRef = useRef(false); // prevent feedback loops

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

  // ─── End party (host only) ───
  const handleEndParty = async () => {
    if (!confirm('End this watch party for everyone?')) return;
    try {
      await api.post(`/api/watch-party/${partyId}/end`);
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

  // ─── Copy invite link ───
  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/watch-party/${partyId}`);
    alert('Invite link copied!');
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
  const getYouTubeEmbedUrl = () => {
    const url = party?.videoSource?.url || '';
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&enablejsapi=1` : '';
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error || !party) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
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

      {/* Float-up animation */}
      <style jsx global>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 0.8; transform: translateY(-100px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-200px) scale(0.8); }
        }
      `}</style>

      <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">
        {/* ─── Video Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
            <button onClick={handleLeave} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-semibold truncate">{party.title}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  {isEnded ? <Eye size={12} /> : <Radio size={12} className="text-red-500 animate-pulse" />}
                  {isEnded ? 'Ended' : 'Live'}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {activeViewers} watching
                </span>
                <span>Host: {party.host?.displayName || party.host?.username}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyInviteLink} className="text-gray-400 hover:text-white p-2" title="Copy invite link">
                <Share2 size={18} />
              </button>
              <button onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-lg transition-colors ${showChat ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:text-white'}`}
              >
                <MessageCircle size={18} />
              </button>
              {isHost && !isEnded && (
                <button onClick={handleEndParty}
                  className="text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1.5 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  End Party
                </button>
              )}
            </div>
          </div>

          {/* Video Player */}
          <div
            ref={playerContainerRef}
            className="relative flex-1 bg-black flex items-center justify-center cursor-pointer"
            onMouseMove={showControlsTemporarily}
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
                src={getVideoSrc()}
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
            <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
              {REACTION_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => sendReaction(emoji)}
                  className="text-xl hover:scale-125 active:scale-90 transition-transform flex-shrink-0"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Chat Sidebar ─── */}
        {showChat && (
          <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900 flex flex-col h-80 lg:h-auto">
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
    </>
  );
}
