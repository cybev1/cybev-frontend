// ============================================
// FILE: src/pages/live/[streamId].jsx
// Live Stream Viewer Page with Mux HLS Support
// FIXED: HLS connection, better status checking, debugging
// ============================================

import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';
import {
  ArrowLeft, Heart, MessageCircle, Share2, Users, Eye,
  Send, Gift, Flag, Volume2, VolumeX, Maximize2, Minimize2,
  MoreVertical, UserPlus, Clock, Loader2, Play, Pause,
  ThumbsUp, Sparkles, X, Copy, Twitter, Facebook, Link as LinkIcon,
  RefreshCw, AlertCircle, Wifi
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

const QUICK_REACTIONS = ['❤️', '🔥', '👏', '😂', '😮', '🎉', '💯', '👍'];

export default function LiveStreamPage() {
  const router = useRouter();
  const { streamId } = router.query;
  const id = streamId;
  
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Video controls
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hlsReady, setHlsReady] = useState(false);
  const [hlsLoaded, setHlsLoaded] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [hlsRetryCount, setHlsRetryCount] = useState(0);
  const [streamStatus, setStreamStatus] = useState('unknown'); // unknown, active, idle, disconnected
  
  // Chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  // Viewers
  const [viewerCount, setViewerCount] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  
  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Reactions
  const [floatingReactions, setFloatingReactions] = useState([]);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const chatContainerRef = useRef(null);
  const containerRef = useRef(null);

  // Compute HLS URL from stream data
  const hlsUrl = useMemo(() => {
    if (!stream) return null;
    
    // Try multiple sources for playback URL
    const url = stream.playbackUrls?.hls || 
      (stream.muxPlaybackId ? `https://stream.mux.com/${stream.muxPlaybackId}.m3u8` : null);
    
    console.log('📺 Computed HLS URL:', url);
    console.log('📺 Stream data:', { 
      playbackUrls: stream.playbackUrls, 
      muxPlaybackId: stream.muxPlaybackId,
      status: stream.status,
      isActive: stream.isActive
    });
    
    return url;
  }, [stream?.playbackUrls?.hls, stream?.muxPlaybackId]);

  // Get thumbnail URL
  const thumbnailUrl = useMemo(() => {
    if (!stream) return null;
    return stream.thumbnail || 
      stream.playbackUrls?.thumbnail || 
      (stream.muxPlaybackId ? `https://image.mux.com/${stream.muxPlaybackId}/thumbnail.jpg?time=5` : null);
  }, [stream]);

  // Helper to get viewer count
  const getViewerCount = (data) => {
    if (typeof data === 'number') return data;
    if (Array.isArray(data)) return data.length;
    return 0;
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchStream();
      joinStream();
      
      // Poll for updates every 5 seconds
      const interval = setInterval(() => {
        fetchStreamUpdate();
      }, 5000);
      
      return () => {
        clearInterval(interval);
        leaveStream();
      };
    }
  }, [id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchStream = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/live/${id}`);
      console.log('🎬 Full stream response:', response.data);
      
      if (response.data?.success && response.data?.stream) {
        const streamData = response.data.stream;
        setStream(streamData);
        setViewerCount(getViewerCount(streamData.viewers));
        setMessages(streamData.comments || []);
        setStreamStatus(streamData.status || 'unknown');
        
        if (user && streamData.streamer?._id) {
          checkFollowStatus(streamData.streamer._id);
        }
      } else if (response.data?.stream) {
        setStream(response.data.stream);
        setViewerCount(getViewerCount(response.data.stream.viewers));
        setMessages(response.data.stream.comments || []);
        setStreamStatus(response.data.stream.status || 'unknown');
      } else {
        setVideoError('Stream not found');
      }
    } catch (error) {
      console.error('Fetch stream error:', error);
      setVideoError('Failed to load stream');
    }
    setLoading(false);
  };

  const fetchStreamUpdate = async () => {
    try {
      const response = await api.get(`/api/live/${id}`);
      if (response.data?.stream) {
        const s = response.data.stream;
        setViewerCount(getViewerCount(s.viewers));
        setMessages(s.comments || []);
        setStreamStatus(s.status || 'unknown');
        
        // Update stream if status changed
        if (s.status !== stream?.status) {
          setStream(s);
        }
      }
    } catch {}
  };

  // Initialize HLS player
  useEffect(() => {
    if (!hlsUrl || !videoRef.current || !hlsLoaded) {
      console.log('⏳ Waiting for HLS init...', { hlsUrl: !!hlsUrl, videoRef: !!videoRef.current, hlsLoaded });
      return;
    }
    
    console.log('🎬 Initializing HLS player with URL:', hlsUrl);
    
    const initHls = () => {
      if (typeof window === 'undefined' || !window.Hls) {
        console.log('HLS.js not yet loaded, retrying...');
        setTimeout(initHls, 500);
        return;
      }
      
      const Hls = window.Hls;
      
      // Clean up existing instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          manifestLoadingMaxRetry: 10,
          manifestLoadingRetryDelay: 2000,
          levelLoadingMaxRetry: 10,
          levelLoadingRetryDelay: 2000,
          fragLoadingMaxRetry: 10,
          fragLoadingRetryDelay: 2000,
        });
        
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ HLS manifest loaded successfully!');
          setHlsReady(true);
          setVideoError(null);
          setHlsRetryCount(0);
          videoRef.current?.play().catch((e) => {
            console.log('Autoplay blocked:', e);
          });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('❌ HLS error:', data.type, data.details, data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, retry attempt:', hlsRetryCount);
                if (hlsRetryCount < 10) {
                  setHlsRetryCount(prev => prev + 1);
                  setTimeout(() => {
                    console.log('Retrying HLS load...');
                    hls.startLoad();
                  }, 3000);
                } else {
                  setVideoError('Stream not available. The streamer may still be connecting or has ended.');
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, attempting recovery...');
                hls.recoverMediaError();
                break;
              default:
                setVideoError('Stream unavailable');
                hls.destroy();
                break;
            }
          }
        });
        
        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        videoRef.current.src = hlsUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          console.log('✅ Safari HLS loaded');
          setHlsReady(true);
          videoRef.current?.play().catch(() => {});
        });
        videoRef.current.addEventListener('error', (e) => {
          console.error('Safari HLS error:', e);
          setVideoError('Stream not available');
        });
      } else {
        setVideoError('HLS not supported in this browser');
      }
    };
    
    initHls();
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [hlsUrl, hlsLoaded]);

  const joinStream = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${id}/join`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (e) {
      console.log('Join stream error:', e);
    }
  };

  const leaveStream = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${id}/leave`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
  };

  const checkFollowStatus = async (streamerId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (!token) return;
      const response = await api.get(`/api/follow/check/${streamerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(response.data?.isFollowing || false);
    } catch {}
  };

  const handleFollow = async () => {
    if (!user || !stream?.streamer?._id) {
      toast.error('Please login to follow');
      return;
    }
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const endpoint = isFollowing 
        ? `/api/follow/unfollow/${stream.streamer._id}`
        : `/api/follow/${stream.streamer._id}`;
      await api.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed' : 'Following!');
    } catch {
      toast.error('Failed to update follow');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;
    if (!user) {
      toast.error('Please login to chat');
      return;
    }
    
    setSendingMessage(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${id}/comment`, 
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      fetchStreamUpdate();
    } catch {
      toast.error('Failed to send message');
    }
    setSendingMessage(false);
  };

  const sendReaction = async (emoji) => {
    const reactionId = Date.now();
    setFloatingReactions(prev => [...prev.slice(-10), { id: reactionId, emoji }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== reactionId));
    }, 2000);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${id}/reaction`, { emoji }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
  };

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = stream?.title || 'Live Stream';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
      setShowShareModal(false);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔴 LIVE: ${shareTitle}`)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (startDate) => {
    if (!startDate) return '0:00';
    const mins = Math.floor((Date.now() - new Date(startDate)) / 60000);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0) return `${hours}h ${remainingMins}m`;
    return `${mins}m`;
  };

  // Retry HLS connection
  const retryConnection = () => {
    console.log('🔄 Retrying connection...');
    setVideoError(null);
    setHlsRetryCount(0);
    setHlsReady(false);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    fetchStream();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Stream not found</h1>
        <Link href="/tv">
          <button className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">
            Back to TV
          </button>
        </Link>
      </div>
    );
  }

  const isEnded = stream.status === 'ended' || stream.status === 'saved';
  const isLive = stream.status === 'live' && stream.isActive;
  const hasHlsStream = !!hlsUrl;

  return (
    <>
      <Head>
        <title>{stream.title || 'Live Stream'} - CYBEV</title>
        <meta property="og:title" content={stream.title || 'Live Stream'} />
        <meta property="og:description" content={`Watch ${stream.streamer?.name || 'this'} live on CYBEV`} />
        {thumbnailUrl && <meta property="og:image" content={thumbnailUrl} />}
      </Head>
      
      {/* Load HLS.js */}
      <Script
        src="https://cdn.jsdelivr.net/npm/hls.js@latest"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('✅ HLS.js script loaded');
          setHlsLoaded(true);
        }}
      />

      <div ref={containerRef} className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
        {/* Video Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/tv">
                <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-white font-semibold truncate max-w-xs">{stream.title}</h1>
                <p className="text-gray-400 text-sm">{stream.streamer?.name || stream.streamer?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="relative bg-black aspect-video lg:aspect-auto lg:flex-1">
            {hasHlsStream && !isEnded ? (
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain bg-black"
                  autoPlay
                  playsInline
                  muted={isMuted}
                  poster={thumbnailUrl}
                  onClick={() => setIsMuted(!isMuted)}
                />
                
                {/* Loading overlay */}
                {!hlsReady && !videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                      <p className="text-white font-medium">Connecting to stream...</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {hlsRetryCount > 0 ? `Attempt ${hlsRetryCount + 1}/10...` : 'Please wait'}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Stream status: {streamStatus} | HLS: {hlsLoaded ? 'Ready' : 'Loading'}
                      </p>
                      {hlsRetryCount >= 3 && (
                        <button 
                          onClick={retryConnection}
                          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retry Now
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Error overlay */}
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center max-w-md px-4">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400 mb-2">{videoError}</p>
                      <p className="text-gray-400 text-sm mb-4">
                        The stream might still be initializing or has ended.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={retryConnection}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retry
                        </button>
                        <Link href="/tv">
                          <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                            Back to TV
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Unmute hint */}
                {hlsReady && isMuted && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsMuted(false)}
                  >
                    <div className="bg-black/60 px-4 py-2 rounded-lg flex items-center gap-2 text-white">
                      <VolumeX className="w-5 h-5" />
                      <span>Click to unmute</span>
                    </div>
                  </div>
                )}
                
                {/* Live indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  {isLive && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-lg text-white text-sm font-bold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-black/50 rounded-lg text-white text-sm">
                    <Eye className="w-4 h-4" />
                    {viewerCount}
                  </div>
                  {stream.startedAt && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-black/50 rounded-lg text-white text-sm">
                      <Clock className="w-4 h-4" />
                      {formatDuration(stream.startedAt)}
                    </div>
                  )}
                </div>
                
                {/* Floating Reactions */}
                <div className="absolute bottom-20 right-4 flex flex-col-reverse gap-2 pointer-events-none">
                  {floatingReactions.map(reaction => (
                    <div
                      key={reaction.id}
                      className="text-4xl animate-bounce"
                    >
                      {reaction.emoji}
                    </div>
                  ))}
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ) : isEnded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg mb-2">Stream has ended</p>
                  {stream.recordingUrl && (
                    <a href={stream.recordingUrl} target="_blank" rel="noopener noreferrer">
                      <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Watch Recording
                      </button>
                    </a>
                  )}
                  <Link href="/tv">
                    <button className="mt-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 block mx-auto">
                      Back to TV
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <Wifi className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-white">Waiting for stream...</p>
                  <p className="text-gray-400 text-sm mt-2">Status: {streamStatus}</p>
                </div>
              </div>
            )}

            {/* Quick Reactions */}
            <div className="absolute bottom-20 left-4 flex gap-2">
              {QUICK_REACTIONS.slice(0, 4).map(emoji => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-lg hover:bg-black/70 hover:scale-110 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Streamer Info */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${stream.streamer?.username || stream.streamer?._id}`}>
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                  {stream.streamer?.profilePicture ? (
                    <img src={stream.streamer.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    stream.streamer?.name?.[0] || 'U'
                  )}
                </div>
              </Link>
              <div>
                <p className="text-white font-semibold">{stream.streamer?.name || stream.streamer?.username}</p>
                <p className="text-gray-400 text-sm">{stream.streamer?.followers?.length || 0} followers</p>
              </div>
            </div>
            
            {user && user._id !== stream.streamer?._id && (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isFollowing ? 'bg-gray-700 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className={`lg:w-96 bg-gray-800 flex flex-col ${showChat ? '' : 'hidden lg:flex'}`}>
          <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </h2>
            <span className="text-gray-400 text-sm">{messages.length} messages</span>
          </div>
          
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96 lg:max-h-none"
          >
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages yet. Be the first!</p>
            ) : (
              messages.map((msg, i) => (
                <div key={msg._id || i} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs overflow-hidden">
                    {msg.user?.profilePicture ? (
                      <img src={msg.user.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      msg.user?.name?.[0] || '?'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-sm font-medium">{msg.user?.name || msg.user?.username || 'User'}</span>
                      <span className="text-gray-500 text-xs">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-white text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={user ? "Say something..." : "Login to chat"}
                disabled={!user}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-full placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!user || !newMessage.trim() || sendingMessage}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
              >
                {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Share Stream</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600">
                <LinkIcon className="w-5 h-5" />
                Copy Link
              </button>
              <button onClick={shareTwitter} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
                <Twitter className="w-5 h-5" />
                Share on Twitter
              </button>
              <button onClick={shareFacebook} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-800 rounded-lg text-white hover:bg-blue-900">
                <Facebook className="w-5 h-5" />
                Share on Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-100px); }
        }
      `}</style>
    </>
  );
}
