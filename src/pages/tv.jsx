// ============================================
// FILE: src/pages/tv.jsx
// TV/Watch Page - Live Streams & Vlogs
// VERSION: 2.0 - FIXED vlog thumbnails display
// FIXES:
//   - Shows video preview when no thumbnail
//   - Auto-generates thumbnail from Cloudinary video URL
//   - Fallback to video element when thumbnail fails
//   - Proper vlog card display
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, Play, Radio, Users, Eye, Clock, Pin, 
  PinOff, MoreVertical, Plus, Tv, Video, Loader2,
  Settings, Share2, Flag, ExternalLink, Volume2, VolumeX
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Helper: Generate thumbnail URL from Cloudinary video URL
const generateThumbnailFromVideoUrl = (videoUrl) => {
  if (!videoUrl) return null;
  
  try {
    // Cloudinary video URL: https://res.cloudinary.com/{cloud}/video/upload/{version}/{path}.{ext}
    // Thumbnail URL: https://res.cloudinary.com/{cloud}/video/upload/so_1,w_400,h_400,c_fill/{version}/{path}.jpg
    
    const url = new URL(videoUrl);
    const pathParts = url.pathname.split('/');
    
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Insert transformation after 'upload'
    pathParts.splice(uploadIndex + 1, 0, 'so_1,w_400,h_400,c_fill');
    
    // Change extension to jpg
    const lastPart = pathParts[pathParts.length - 1];
    pathParts[pathParts.length - 1] = lastPart.replace(/\.[^.]+$/, '.jpg');
    
    url.pathname = pathParts.join('/');
    return url.toString();
  } catch (e) {
    return null;
  }
};

export default function TVPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('vlogs'); // Default to vlogs
  const [liveStreams, setLiveStreams] = useState([]);
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pinnedStreams, setPinnedStreams] = useState([]);
  const [showStreamOptions, setShowStreamOptions] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const u = JSON.parse(userData);
      setUser(u);
      setIsAdmin(u.role === 'admin' || u.isAdmin);
    }
    fetchContent();
    
    const interval = setInterval(fetchLiveStreams, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    await Promise.all([fetchLiveStreams(), fetchVlogs()]);
    setLoading(false);
  };

  const fetchLiveStreams = async () => {
    try {
      const response = await api.get('/api/live/active');
      if (response.data?.streams) {
        const pinned = response.data.streams.filter(s => s.isPinned);
        const regular = response.data.streams.filter(s => !s.isPinned);
        setPinnedStreams(pinned);
        setLiveStreams(regular);
      }
    } catch (error) {
      console.log('Could not fetch live streams:', error.message);
      setPinnedStreams([]);
      setLiveStreams([]);
    }
  };

  const fetchVlogs = async () => {
    try {
      const response = await api.get('/api/vlogs?limit=50');
      console.log('Vlogs response:', response.data);
      if (response.data?.vlogs) {
        setVlogs(response.data.vlogs);
      }
    } catch (error) {
      console.log('Could not fetch vlogs:', error.message);
      setVlogs([]);
    }
  };

  const handlePinStream = async (streamId, currentlyPinned) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${streamId}/pin`, 
        { isPinned: !currentlyPinned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(currentlyPinned ? 'Stream unpinned' : 'Stream pinned to top');
      fetchLiveStreams();
      setShowStreamOptions(null);
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  const getViewerCount = (stream) => {
    if (typeof stream.viewerCount === 'number') return stream.viewerCount;
    if (Array.isArray(stream.viewers)) return stream.viewers.length;
    if (typeof stream.viewers === 'number') return stream.viewers;
    return 0;
  };

  const formatViewers = (count) => {
    if (count >= 1000000) return `${(count/1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count/1000).toFixed(1)}K`;
    return count?.toString() || '0';
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allLiveStreams = [...pinnedStreams, ...liveStreams];

  return (
    <>
      <Head>
        <title>TV - Live Streams & Vlogs | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <button className="p-2 hover:bg-gray-100 rounded-full -ml-2">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <Tv className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-xl text-gray-900">TV</span>
              </div>
            </div>
            
            <Link href="/live/go-live">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
                <Radio className="w-4 h-4" />
                Go Live
              </button>
            </Link>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-6">
              {[
                { id: 'live', label: 'Live Now', icon: Radio, count: allLiveStreams.length },
                { id: 'vlogs', label: 'Vlogs', icon: Video, count: vlogs.length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition font-medium ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      tab.id === 'live' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : activeTab === 'live' ? (
            <div className="space-y-8">
              {/* Pinned Streams */}
              {pinnedStreams.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Pin className="w-5 h-5 text-purple-600" />
                    Pinned Streams
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pinnedStreams.map(stream => (
                      <StreamCard 
                        key={stream._id} 
                        stream={stream}
                        isAdmin={isAdmin}
                        isPinned={true}
                        onPin={() => handlePinStream(stream._id, true)}
                        showOptions={showStreamOptions === stream._id}
                        onToggleOptions={() => setShowStreamOptions(showStreamOptions === stream._id ? null : stream._id)}
                        getViewerCount={getViewerCount}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Live Streams */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Live Now</h2>
                {liveStreams.length === 0 && pinnedStreams.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <Radio className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">No live streams</h3>
                    <p className="text-gray-500 mb-6">Be the first to go live!</p>
                    <Link href="/live/go-live">
                      <button className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
                        Start Streaming
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liveStreams.map(stream => (
                      <StreamCard 
                        key={stream._id} 
                        stream={stream}
                        isAdmin={isAdmin}
                        isPinned={false}
                        onPin={() => handlePinStream(stream._id, false)}
                        showOptions={showStreamOptions === stream._id}
                        onToggleOptions={() => setShowStreamOptions(showStreamOptions === stream._id ? null : stream._id)}
                        getViewerCount={getViewerCount}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Vlogs Tab - FIXED
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Vlogs</h2>
              {vlogs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No vlogs yet</h3>
                  <p className="text-gray-500 mb-6">Create your first vlog!</p>
                  <Link href="/vlog/create">
                    <button className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                      Create Vlog
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vlogs.map(vlog => (
                    <VlogCard 
                      key={vlog._id} 
                      vlog={vlog}
                      formatViewers={formatViewers}
                      formatDuration={formatDuration}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </button>
          </Link>
          
          <Link href="/groups">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">Groups</span>
            </button>
          </Link>
          
          <Link href="/vlog/create">
            <button className="relative -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-7 h-7 text-white" />
              </div>
            </button>
          </Link>
          
          <button className="flex flex-col items-center py-2 px-4 text-purple-600">
            <Tv className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">TV</span>
          </button>
          
          <Link href="/menu">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs mt-1">Menu</span>
            </button>
          </Link>
        </nav>
      </div>
    </>
  );
}

// ==========================================
// VLOG CARD - FIXED to show video preview
// ==========================================
function VlogCard({ vlog, formatViewers, formatDuration }) {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Get the best available thumbnail
  const getThumbnail = () => {
    // 1. Direct thumbnail URL
    if (vlog.thumbnailUrl && !thumbnailError) return vlog.thumbnailUrl;
    
    // 2. Generate from video URL
    if (vlog.videoUrl) {
      const generated = generateThumbnailFromVideoUrl(vlog.videoUrl);
      if (generated && !thumbnailError) return generated;
    }
    
    // 3. No thumbnail available - will show video preview
    return null;
  };

  const thumbnail = getThumbnail();
  const author = vlog.user || vlog.author;

  // Handle hover to show video preview
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!thumbnail && vlog.videoUrl) {
      setShowVideo(true);
    }
    // Try to play video preview
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onClick={() => router.push(`/vlog/${vlog._id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition cursor-pointer group"
    >
      {/* Thumbnail/Video Preview */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {/* Show thumbnail image if available */}
        {thumbnail && !showVideo && (
          <img 
            src={thumbnail} 
            alt={vlog.caption || 'Vlog'} 
            className="w-full h-full object-cover"
            onError={() => {
              setThumbnailError(true);
              setShowVideo(true);
            }}
          />
        )}
        
        {/* Show video preview if no thumbnail OR on hover */}
        {(showVideo || (!thumbnail && vlog.videoUrl)) && vlog.videoUrl && (
          <video
            ref={videoRef}
            src={vlog.videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        
        {/* Fallback gradient if nothing else works */}
        {!thumbnail && !vlog.videoUrl && (
          <div className={`w-full h-full bg-gradient-to-br ${vlog.backgroundGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center`}>
            <Video className="w-12 h-12 text-white/50" />
          </div>
        )}
        
        {/* Play icon overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition ${isHovering ? 'bg-black/20' : 'bg-black/0'}`}>
          <div className={`w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition ${isHovering ? 'scale-110' : 'scale-100'}`}>
            <Play className="w-7 h-7 text-purple-600 fill-purple-600 ml-1" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs font-medium">
          {formatDuration(vlog.duration)}
        </div>
      </div>
      
      {/* Info */}
      <div className="p-3">
        {/* Caption */}
        {vlog.caption && (
          <p className="text-gray-900 font-medium line-clamp-2 mb-2">{vlog.caption}</p>
        )}
        
        {/* Author & Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {/* Author avatar */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
              {author?.profilePicture || author?.avatar ? (
                <img src={author.profilePicture || author.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{author?.name?.[0] || 'U'}</span>
              )}
            </div>
            <span className="truncate max-w-[100px]">{author?.name || author?.username || 'User'}</span>
          </div>
          
          {/* Views */}
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{formatViewers(vlog.viewsCount || vlog.views?.length || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stream Card Component
function StreamCard({ stream, isAdmin, isPinned, onPin, showOptions, onToggleOptions, getViewerCount }) {
  const router = useRouter();
  
  const formatStreamTime = (date) => {
    if (!date) return '';
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const viewerCount = getViewerCount ? getViewerCount(stream) : 
    (Array.isArray(stream.viewers) ? stream.viewers.length : 
    (typeof stream.viewers === 'number' ? stream.viewers : 
    (stream.viewerCount || 0)));

  const getThumbnail = () => {
    if (stream.thumbnail) return stream.thumbnail;
    if (stream.playbackUrls?.thumbnail) return stream.playbackUrls.thumbnail;
    if (stream.muxPlaybackId) {
      return `https://image.mux.com/${stream.muxPlaybackId}/thumbnail.jpg?time=5`;
    }
    return null;
  };

  const thumbnailUrl = getThumbnail();

  return (
    <div 
      className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer relative ${
        isPinned ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-200'
      }`}
      onClick={() => router.push(`/live/${stream._id}`)}
    >
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={stream.title || 'Live Stream'} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Radio className="w-8 h-8 text-red-500 animate-pulse mx-auto" />
              <span className="text-gray-500 text-xs mt-1 block">Live</span>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-red-500 rounded text-white text-xs font-bold">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
          {isPinned && (
            <div className="px-2 py-1 bg-purple-600 rounded text-white text-xs font-bold flex items-center gap-1">
              <Pin className="w-3 h-3" />
              Pinned
            </div>
          )}
        </div>
        
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 rounded text-white text-xs">
          <Eye className="w-3 h-3" />
          {viewerCount}
        </div>
        
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/50 rounded text-white text-xs">
          <Clock className="w-3 h-3" />
          {formatStreamTime(stream.startedAt)}
        </div>
        
        {isAdmin && (
          <div className="absolute bottom-2 right-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleOptions(); }}
              className="p-1 bg-black/50 rounded text-white hover:bg-black/70"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showOptions && (
              <div className="absolute bottom-full right-0 mb-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(); }}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  {isPinned ? 'Unpin' : 'Pin to Top'}
                </button>
                <button className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{stream.title || 'Live Stream'}</h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            {stream.streamer?.profilePicture ? (
              <img src={stream.streamer.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">{stream.streamer?.name?.[0] || 'U'}</span>
            )}
          </div>
          <span className="text-gray-600 text-sm">{stream.streamer?.name || 'Unknown'}</span>
          {stream.streamer?.isAdmin && (
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded font-medium">Admin</span>
          )}
        </div>
      </div>
    </div>
  );
}
