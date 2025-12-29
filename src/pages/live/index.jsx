// ============================================
// FILE: src/pages/live/index.jsx
// PATH: cybev-frontend/src/pages/live/index.jsx
// PURPOSE: Live streaming hub - browse and start streams
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Video,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Radio,
  Zap,
  Clock,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Gift,
  Crown
} from 'lucide-react';
import api from '@/lib/api';

// Live Stream Card Component
function StreamCard({ stream, featured = false }) {
  return (
    <Link href={`/live/${stream._id || stream.id}`}>
      <div className={`group cursor-pointer ${featured ? 'col-span-2 row-span-2' : ''}`}>
        <div className="relative overflow-hidden rounded-xl">
          {/* Thumbnail */}
          <div className={`relative ${featured ? 'aspect-video' : 'aspect-video'}`}>
            {stream.thumbnail ? (
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Video className="w-16 h-16 text-white/50" />
              </div>
            )}
            
            {/* Live Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </span>
              <span className="px-2 py-1 bg-black/60 text-white text-xs rounded flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {stream.viewerCount || 0}
              </span>
            </div>

            {/* Duration */}
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 bg-black/60 text-white text-xs rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stream.duration || 'Starting'}
              </span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Stream Info */}
        <div className="mt-3 flex gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {stream.streamer?.name?.[0] || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
              {stream.title || 'Untitled Stream'}
            </h3>
            <p className="text-gray-400 text-sm truncate">{stream.streamer?.name || 'Anonymous'}</p>
            <p className="text-gray-500 text-sm">{stream.category || 'Just Chatting'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Categories
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid },
  { id: 'gaming', label: 'Gaming', icon: Zap },
  { id: 'music', label: 'Music', icon: Radio },
  { id: 'talk', label: 'Talk Shows', icon: MessageCircle },
  { id: 'creative', label: 'Creative', icon: Star },
  { id: 'education', label: 'Education', icon: Crown },
  { id: 'sports', label: 'Sports', icon: TrendingUp }
];

export default function LiveHub() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState([]);
  const [featuredStream, setFeaturedStream] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Sample streams for demo
  const sampleStreams = [
    {
      id: '1',
      title: 'Building a Web3 App Live! 🚀',
      streamer: { name: 'TechMaster', username: 'techmaster' },
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      viewerCount: 1234,
      duration: '2:45:30',
      category: 'Creative',
      isLive: true
    },
    {
      id: '2',
      title: 'Sunday Chill Music Session 🎵',
      streamer: { name: 'DJ Vibes', username: 'djvibes' },
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      viewerCount: 856,
      duration: '1:20:00',
      category: 'Music',
      isLive: true
    },
    {
      id: '3',
      title: 'Crypto Market Analysis',
      streamer: { name: 'CryptoGuru', username: 'cryptoguru' },
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      viewerCount: 2100,
      duration: '45:00',
      category: 'Education',
      isLive: true
    },
    {
      id: '4',
      title: 'Art Creation - Digital Painting',
      streamer: { name: 'ArtistPro', username: 'artistpro' },
      thumbnail: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      viewerCount: 445,
      duration: '3:10:00',
      category: 'Creative',
      isLive: true
    },
    {
      id: '5',
      title: 'Late Night Talk Show',
      streamer: { name: 'NightOwl', username: 'nightowl' },
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
      viewerCount: 678,
      duration: '55:00',
      category: 'Talk Shows',
      isLive: true
    },
    {
      id: '6',
      title: 'Gaming Session - New Release!',
      streamer: { name: 'ProGamer', username: 'progamer' },
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      viewerCount: 3200,
      duration: '4:20:00',
      category: 'Gaming',
      isLive: true
    }
  ];

  useEffect(() => {
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

    // Fetch live streams
    fetchStreams();
  }, [router]);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/live/streams', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok && response.data.streams?.length > 0) {
        setStreams(response.data.streams);
        setFeaturedStream(response.data.streams[0]);
      } else {
        // Use sample data
        setStreams(sampleStreams);
        setFeaturedStream(sampleStreams[0]);
      }
    } catch (error) {
      console.log('Using sample streams');
      setStreams(sampleStreams);
      setFeaturedStream(sampleStreams[0]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStreams = streams.filter(stream => {
    const matchesCategory = selectedCategory === 'all' || 
      stream.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      stream.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.streamer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartStream = () => {
    router.push('/live/start');
  };

  return (
    <AppLayout>
      <Head>
        <title>Live Streams - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Radio className="w-8 h-8 text-red-500" />
              Live Streams
            </h1>
            <p className="text-gray-400 mt-1">Watch and interact with live content creators</p>
          </div>

          <button
            onClick={handleStartStream}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Video className="w-5 h-5" />
            Go Live
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Stream */}
        {featuredStream && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Featured Stream
            </h2>
            <Link href={`/live/${featuredStream._id || featuredStream.id}`}>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                <div className="aspect-[21/9] relative">
                  {featuredStream.thumbnail ? (
                    <img
                      src={featuredStream.thumbnail}
                      alt={featuredStream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Live badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                    <span className="px-3 py-1.5 bg-black/60 text-white text-sm rounded-lg flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {featuredStream.viewerCount?.toLocaleString() || 0} watching
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-900">
                          {featuredStream.streamer?.name?.[0] || 'S'}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{featuredStream.title}</h3>
                          <p className="text-gray-300">{featuredStream.streamer?.name}</p>
                          <p className="text-gray-400 text-sm">{featuredStream.category}</p>
                        </div>
                      </div>
                      
                      <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
                        <Play className="w-5 h-5" />
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Stream Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredStreams.length === 0 ? (
          <div className="text-center py-20">
            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No streams found</h3>
            <p className="text-gray-400 mb-6">Be the first to go live!</p>
            <button
              onClick={handleStartStream}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium"
            >
              Start Streaming
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Live Now
              <span className="text-sm font-normal text-gray-400">({filteredStreams.length} streams)</span>
            </h2>
            
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredStreams.map((stream) => (
                <StreamCard key={stream._id || stream.id} stream={stream} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}