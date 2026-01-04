// ============================================
// FILE: src/pages/live/[id].jsx
// Live Stream Viewer Page
// Features: Video player, chat, reactions, viewer count
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Heart, MessageCircle, Share2, Users, Eye,
  Send, Gift, Flag, Volume2, VolumeX, Maximize2, Minimize2,
  MoreVertical, UserPlus, Clock, Loader2, Play, Pause,
  ThumbsUp, Sparkles, X
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Quick reactions for live chat
const QUICK_REACTIONS = ['❤️', '🔥', '👏', '😂', '😮', '🎉', '💯', '👍'];

export default function LiveStreamPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Video controls
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  // Viewers
  const [viewerCount, setViewerCount] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  
  // Reactions
  const [floatingReactions, setFloatingReactions] = useState([]);
  
  const videoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const containerRef = useRef(null);

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
        setViewerCount(streamData.viewers || 0);
        setMessages(streamData.comments || []);
        
        // Check if following streamer
        if (user && streamData.streamer?._id) {
          checkFollowStatus(streamData.streamer._id);
        }
      } else if (response.data?.stream) {
        // Handle case where success isn't explicitly returned
        setStream(response.data.stream);
        setViewerCount(response.data.stream.viewers || 0);
        setMessages(response.data.stream.comments || []);
      } else {
        console.log('No stream data, using demo');
        // Demo stream for testing
        setStream({
          _id: id,
          title: 'Live Stream',
          streamer: { _id: 'demo', name: 'Demo Streamer', username: 'demo', profilePicture: null },
          viewers: 0,
          startedAt: new Date(),
          status: 'live'
        });
      }
    } catch (error) {
      console.error('Fetch stream error:', error);
      // Demo stream for testing
      setStream({
        _id: id,
        title: 'Live Stream',
        streamer: { _id: 'demo', name: 'Demo Streamer', username: 'demo', profilePicture: null },
        viewers: 0,
        startedAt: new Date(),
        status: 'live'
      });
      setMessages([]);
    }
    setLoading(false);
  };

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
        setViewerCount(response.data.stream.viewers || 0);
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
      await api.post(`/api/live/${id}/comment`, { content: messageContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // Keep optimistic message even if API fails
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

  return (
    <>
      <Head>
        <title>{stream.title || 'Live Stream'} | CYBEV</title>
      </Head>

      <div ref={containerRef} className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
        {/* Video Section */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {/* Video placeholder - in real implementation, use HLS/WebRTC player */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              {isEnded ? (
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70">Stream has ended</p>
                  {stream.recordingUrl && (
                    <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Watch Recording
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Simulated video - replace with actual video element */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
                  
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
                </>
              )}
            </div>
            
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
                    {stream.streamer?.followersCount || 0} followers
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
                <button className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
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
