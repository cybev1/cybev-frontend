// ============================================
// FILE: src/pages/live/[streamId].jsx
// PATH: cybev-frontend/src/pages/live/[streamId].jsx
// PURPOSE: Watch a live stream with chat and interactions
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Users,
  Eye,
  ThumbsUp,
  Send,
  MoreVertical,
  Flag,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ChevronLeft,
  Star,
  Zap,
  Crown,
  Sparkles,
  X
} from 'lucide-react';
import api from '@/lib/api';

export default function WatchStream() {
  const router = useRouter();
  const { streamId } = router.query;
  const videoRef = useRef(null);
  const chatRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Chat state
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  
  // Stream stats
  const [viewerCount, setViewerCount] = useState(0);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Sample messages for demo
  const sampleMessages = [
    { id: 1, user: 'CryptoFan', text: 'Great stream! 🔥', badge: 'sub' },
    { id: 2, user: 'TechEnthusiast', text: 'Can you explain that again?', badge: null },
    { id: 3, user: 'NewViewer', text: 'Just joined, what did I miss?', badge: null },
    { id: 4, user: 'ProMember', text: 'Amazing content as always!', badge: 'mod' },
    { id: 5, user: 'GiftGiver', text: '🎁 Sent 100 CYBEV tip!', badge: 'vip', isTip: true },
  ];

  // Emojis for reactions
  const EMOJIS = ['❤️', '🔥', '😂', '👏', '🎉', '💎', '🚀', '💯'];

  // Tip amounts
  const TIP_AMOUNTS = [10, 50, 100, 500, 1000];

  useEffect(() => {
    if (!streamId) return;

    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    fetchStream();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [streamId, router]);

  // Auto scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchStream = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/live/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setStream(response.data.stream);
        setViewerCount(response.data.stream.viewerCount || 150);
        setLikes(response.data.stream.likes || 45);
      }
    } catch (error) {
      console.log('Using sample stream');
      setStream({
        _id: streamId,
        title: 'Building a Web3 App Live! 🚀',
        description: 'Join me as we build a decentralized application from scratch!',
        streamer: { 
          _id: 'streamer1',
          name: 'TechMaster', 
          username: 'techmaster',
          followers: 12500
        },
        category: 'Technology',
        viewerCount: 1234,
        likes: 456,
        isLive: true
      });
      setViewerCount(1234);
      setLikes(456);
    }
    
    setMessages(sampleMessages);
    setLoading(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: user?.name || 'You',
      text: message,
      badge: null
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleTip = async (amount) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${streamId}/tip`, { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add tip message to chat
      const tipMessage = {
        id: Date.now(),
        user: user?.name || 'You',
        text: `🎁 Sent ${amount} CYBEV tip!`,
        badge: 'tip',
        isTip: true
      };
      setMessages(prev => [...prev, tipMessage]);
    } catch (error) {
      console.log('Tip sent (demo)');
    }
    
    setShowTipModal(false);
    alert(`Sent ${amount} CYBEV tip!`);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: stream?.title,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Stream link copied!');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'mod': return 'bg-green-500';
      case 'vip': return 'bg-yellow-500';
      case 'sub': return 'bg-purple-500';
      case 'tip': return 'bg-pink-500';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Stream not found</h1>
          <Link href="/live">
            <button className="px-6 py-3 bg-purple-500 text-white rounded-lg">
              Browse Streams
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{stream.title} - CYBEV Live</title>
      </Head>

      <div className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative bg-black aspect-video lg:aspect-auto lg:flex-1" ref={videoRef}>
            {/* Demo video placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Zap className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-gray-400">Live Stream Preview</p>
              </div>
            </div>

            {/* Top overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <Link href="/live">
                  <button className="p-2 bg-black/40 hover:bg-black/60 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                </Link>
                
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                  <span className="px-2 py-1 bg-black/40 text-white text-xs rounded flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {viewerCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-black/40 hover:bg-black/60 rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-black/40 hover:bg-black/60 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-black/40 hover:bg-black/60 rounded-lg transition-colors"
                  >
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating reactions */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-2">
              {EMOJIS.slice(0, 4).map((emoji, i) => (
                <button
                  key={i}
                  className="w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Stream Info */}
          <div className="p-4 bg-gray-950 border-t border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <Link href={`/profile/${stream.streamer?.username}`}>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer">
                    {stream.streamer?.name?.[0] || 'S'}
                  </div>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-white">{stream.title}</h1>
                  <Link href={`/profile/${stream.streamer?.username}`}>
                    <p className="text-purple-400 hover:underline cursor-pointer">{stream.streamer?.name}</p>
                  </Link>
                  <p className="text-gray-500 text-sm">{stream.category} • {stream.streamer?.followers?.toLocaleString() || 0} followers</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? 'bg-gray-700 text-white'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                
                <button
                  onClick={() => setShowTipModal(true)}
                  className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                  title="Send Tip"
                >
                  <Gift className="w-5 h-5" />
                </button>

                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                    hasLiked ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likes}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {stream.description && (
              <p className="mt-4 text-gray-400 text-sm">{stream.description}</p>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-96 bg-gray-950 border-l border-gray-800 flex flex-col h-[400px] lg:h-auto">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Live Chat
            </h2>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              {viewerCount}
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.isTip ? 'bg-gradient-to-r from-yellow-500/10 to-pink-500/10 -mx-4 px-4 py-2' : ''}`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                  {msg.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-medium text-sm">{msg.user}</span>
                    {msg.badge && (
                      <span className={`px-1.5 py-0.5 ${getBadgeColor(msg.badge)} text-white text-xs rounded`}>
                        {msg.badge.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${msg.isTip ? 'text-yellow-400 font-medium' : 'text-gray-300'}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
              />
              
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Emoji picker */}
            {showEmojis && (
              <div className="mt-2 p-2 bg-gray-800 rounded-lg flex flex-wrap gap-2">
                {EMOJIS.map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(prev => prev + emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Tip Modal */}
        {showTipModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-purple-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Gift className="w-6 h-6 text-yellow-400" />
                  Send a Tip
                </h2>
                <button
                  onClick={() => setShowTipModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-400 mb-6">Support {stream.streamer?.name} with CYBEV tokens!</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {TIP_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleTip(amount)}
                    className="p-4 bg-gray-800 hover:bg-purple-500/20 border border-gray-700 hover:border-purple-500 rounded-xl transition-colors text-center"
                  >
                    <p className="text-xl font-bold text-white">{amount}</p>
                    <p className="text-xs text-gray-400">CYBEV</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowTipModal(false)}
                className="w-full py-3 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
