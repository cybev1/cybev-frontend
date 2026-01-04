// ============================================
// FILE: src/pages/live/[streamId].jsx
// Live Stream Viewer Page with Mux HLS Support
// FIXED: HLS connection, Share button, Viewer count, Comments
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
  ThumbsUp, Sparkles, X, Copy, Twitter, Facebook, Link as LinkIcon
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Quick reactions for live chat
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
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hlsReady, setHlsReady] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [hlsRetryCount, setHlsRetryCount] = useState(0);
  
  // Chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  // Viewers - FIXED: Now properly a number
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
    return stream.playbackUrls?.hls || 
      (stream.muxPlaybackId ? `https://stream.mux.com/${stream.muxPlaybackId}.m3u8` : null);
  }, [stream?.playbackUrls?.hls, stream?.muxPlaybackId]);

  // Get thumbnail URL
  const thumbnailUrl = useMemo(() => {
    if (!stream) return null;
    return stream.thumbnail || 
      stream.playbackUrls?.thumbnail || 
      (stream.muxPlaybackId ? `https://image.mux.com/${stream.muxPlaybackId}/thumbnail.jpg?time=5` : null);
  }, [stream]);

  // FIXED: Helper to get viewer count
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
      
      // Poll for updates
      const interval = setInterval(() => {
        fetchMessages();
        updateViewerCount();
      }, 3000);
      
      return () => {
        clearInterval(interval);
        leaveStream();
      };
    }
  }, [id]);

  useEffect(() => {
    // Scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchStream = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/live/${id}`);
      console.log('Stream response:', response.data);
      
      if (response.data?.success && response.data?.stream) {
        const streamData = response.data.stream;
        setStream(streamData);
        // FIXED: Properly get viewer count
        setViewerCount(getViewerCount(streamData.viewers));
        setMessages(streamData.comments || []);
        
        if (user && streamData.streamer?._id) {
          checkFollowStatus(streamData.streamer._id);
        }
      } else if (response.data?.stream) {
        setStream(response.data.stream);
        setViewerCount(getViewerCount(response.data.stream.viewers));
        setMessages(response.data.stream.comments || []);
      } else {
        setVideoError('Stream not found');
      }
    } catch (error) {
      console.error('Fetch stream error:', error);
      setVideoError('Failed to load stream');
    }
    setLoading(false);
  };

  // Initialize HLS player with retry logic
  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return;
    
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
      }
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          // Retry configuration
          manifestLoadingMaxRetry: 6,
          manifestLoadingRetryDelay: 2000,
          levelLoadingMaxRetry: 6,
          levelLoadingRetryDelay: 2000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 2000,
        });
        
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ HLS manifest loaded');
          setHlsReady(true);
          setVideoError(null);
          setHlsRetryCount(0);
          videoRef.current?.play().catch(() => {});
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, trying to recover...');
                if (hlsRetryCount < 5) {
                  setHlsRetryCount(prev => prev + 1);
                  setTimeout(() => hls.startLoad(), 2000);
                } else {
                  setVideoError('Stream not available. The streamer may still be connecting...');
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, trying to recover...');
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
        // Safari native HLS support
        videoRef.current.src = hlsUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setHlsReady(true);
          videoRef.current?.play().catch(() => {});
        });
        videoRef.current.addEventListener('error', () => {
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
  }, [hlsUrl]);

  const joinStream = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${id}/join`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
  };

  const leaveStream = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${id}/leave`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/live/${id}`);
      if (response.data?.stream?.comments) {
        setMessages(response.data.stream.comments);
      }
    } catch {}
  };

  const updateViewerCount = async () => {
    try {
      const response = await api.get(`/api/live/${id}`);
      if (response.data?.stream) {
        // FIXED: Properly get viewer count
        setViewerCount(getViewerCount(response.data.stream.viewers));
      }
    } catch {}
  };

  const checkFollowStatus = async (streamerId) => {
    if (!streamerId) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/follow/check/${streamerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(response.data?.following || response.data?.isFollowing || false);
    } catch {}
  };

  const handleFollow = async () => {
    if (!user) {
      toast.info('Please login to follow');
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (isFollowing) {
        await api.delete(`/api/follow/${stream.streamer._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await api.post(`/api/follow/${stream.streamer._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(true);
        toast.success('Following!');
      }
    } catch {
      toast.error('Failed to update follow');
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    
    if (!user) {
      toast.info('Please login to chat');
      return;
    }
    
    setSendingMessage(true);
    const messageContent = newMessage.trim();
    setNewMessage('');
    
    // Optimistic update
    const tempMessage = {
      _id: Date.now().toString(),
      user: { name: user.name, profilePicture: user.profilePicture },
      content: messageContent,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/live/${id}/comment`, 
        { content: messageContent }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data?.success) {
        console.log('Comment sent successfully');
      }
    } catch (error) {
      console.error('Failed to send comment:', error);
      toast.error('Failed to send message');
    }
    setSendingMessage(false);
  };

  const sendQuickReaction = (emoji) => {
    // Add floating reaction
    const reactionId = Date.now();
    setFloatingReactions(prev => [...prev, { id: reactionId, emoji }]);
    
    // Remove after animation
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== reactionId));
    }, 2000);
    
    // Send to chat
    if (user) {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      api.post(`/api/live/${id}/comment`, { content: emoji }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
  };

  // FIXED: Share functionality
  const handleShare = () => {
    setShowShareModal(true);
  };

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

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔴 LIVE: ${shareTitle}`)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `🔴 LIVE: ${shareTitle}`,
          url: shareUrl
        });
        setShowShareModal(false);
      } catch {}
    } else {
      copyLink();
    }
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
    setVideoError(null);
    setHlsRetryCount(0);
    setHlsReady(false);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    // Re-trigger the useEffect by fetching stream again
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
  const hasHlsStream = !!hlsUrl;
  const isMuxStream = stream.streamType === 'mux' || stream.muxPlaybackId;

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
      />

      <div ref={containerRef} className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
        {/* Video Section */}
        <div className="flex-1 flex flex-col">
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
                
                {/* Loading overlay - shows while connecting */}
                {!hlsReady && !videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                      <p className="text-white font-medium">Connecting to stream...</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {hlsRetryCount > 0 ? `Attempt ${hlsRetryCount + 1}...` : 'Please wait'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Error overlay with retry */}
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center max-w-md px-4">
                      <p className="text-red-400 mb-2">{videoError}</p>
                      <p className="text-gray-400 text-sm mb-4">
                        The stream might still be initializing. Try again in a moment.
                      </p>
                      <button 
                        onClick={retryConnection}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Retry Connection
                      </button>
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
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-lg text-white text-sm font-bold">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-black/50 rounded-lg text-white text-sm">
                    <Eye className="w-4 h-4" />
                    {viewerCount}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-black/50 rounded-lg text-white text-sm">
                    <Clock className="w-4 h-4" />
                    {formatDuration(stream.startedAt)}
                  </div>
                </div>
                
                {/* Floating Reactions */}
                <div className="absolute bottom-20 right-4 flex flex-col-reverse gap-2 pointer-events-none">
                  {floatingReactions.map(reaction => (
                    <div
                      key={reaction.id}
                      className="text-4xl animate-bounce"
                      style={{ animation: 'floatUp 2s ease-out forwards' }}
                    >
                      {reaction.emoji}
                    </div>
                  ))}
                </div>
              </div>
            ) : isEnded ? (
              /* Stream ended */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">Stream has ended</p>
                  {stream.recordingUrl && (
                    <Link href={stream.recordingUrl}>
                      <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Watch Recording
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              /* Fallback: show streamer info */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-center p-4">
                <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  {stream.streamer?.profilePicture ? (
                    <img src={stream.streamer.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {stream.streamer?.name?.[0] || 'L'}
                    </span>
                  )}
                </div>
                <h2 className="text-white text-xl font-bold mb-2">{stream.title || 'Live Stream'}</h2>
                <p className="text-white/70 text-sm mb-4">
                  {stream.streamer?.name || 'Streamer'} is live
                </p>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  Stream is active
                </div>
              </div>
            )}
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-white hover:bg-white/20 rounded-full"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-2 rounded-full lg:hidden ${showChat ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/20'}`}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-white hover:bg-white/20 rounded-full"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Stream Info */}
          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <h1 className="text-xl font-bold text-white mb-3">{stream.title || 'Live Stream'}</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${stream.streamer?.username || stream.streamer?._id}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden cursor-pointer">
                    {stream.streamer?.profilePicture ? (
                      <img src={stream.streamer.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {stream.streamer?.name?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                </Link>
                <div>
                  <Link href={`/profile/${stream.streamer?.username || stream.streamer?._id}`}>
                    <h3 className="font-semibold text-white hover:underline cursor-pointer">
                      {stream.streamer?.name || 'Streamer'}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm">
                    {stream.streamer?.followers?.length || stream.streamer?.followersCount || 0} followers
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {stream.streamer?._id !== user?._id && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                      isFollowing
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
                {/* FIXED: Share button now works */}
                <button 
                  onClick={handleShare}
                  className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Section */}
        {showChat && (
          <div className="w-full lg:w-96 bg-gray-800 flex flex-col border-l border-gray-700">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-white">Live Chat</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowViewers(!showViewers)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded lg:hidden" onClick={() => setShowChat(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '400px' }}>
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Be the first to say hi!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={msg._id || index} className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {msg.user?.profilePicture ? (
                        <img src={msg.user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-xs font-bold">
                          {msg.user?.name?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-purple-400 text-sm">
                          {msg.user?.name || 'User'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-white text-sm break-words">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Quick Reactions */}
            <div className="px-4 py-2 border-t border-gray-700 flex items-center gap-1 overflow-x-auto">
              {QUICK_REACTIONS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => sendQuickReaction(emoji)}
                  className="text-xl p-2 hover:bg-gray-700 rounded transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {/* Chat Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
              {user ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    maxLength={200}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Login to Chat
                  </button>
                </Link>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Share Stream</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={shareNative}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <Copy className="w-5 h-5" />
                Copy Link
              </button>
              
              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <Twitter className="w-5 h-5" />
                Share on Twitter
              </button>
              
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <Facebook className="w-5 h-5" />
                Share on Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }
      `}</style>
    </>
  );
}
