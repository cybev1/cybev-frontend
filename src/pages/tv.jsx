// ============================================
// FILE: src/pages/tv.jsx
// TV/Watch Page - Live Streams & Vlogs
// Features: Admin pinning, Live indicators, RTMP support
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, Play, Radio, Users, Eye, Clock, Pin, 
  PinOff, MoreVertical, Plus, Tv, Video, Loader2,
  Settings, Share2, Flag, ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function TVPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('live');
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
    
    // Refresh live streams periodically
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
        // Separate pinned and regular streams
        const pinned = response.data.streams.filter(s => s.isPinned);
        const regular = response.data.streams.filter(s => !s.isPinned);
        setPinnedStreams(pinned);
        setLiveStreams(regular);
      }
    } catch (error) {
      console.log('Using demo live streams');
      // Demo data
      const demoStreams = [
        {
          _id: 'l1',
          title: 'Building a Web3 App Live!',
          streamer: { _id: 'admin1', name: 'CYBEV Official', username: 'cybev', profilePicture: null, isAdmin: true },
          viewers: 234,
          thumbnail: null,
          startedAt: new Date(Date.now() - 45 * 60000),
          isPinned: true,
          isAdminStream: true
        },
        {
          _id: 'l2',
          title: 'Coding Session - React Native',
          streamer: { _id: 'u1', name: 'Sarah Dev', username: 'sarahdev', profilePicture: null },
          viewers: 89,
          thumbnail: null,
          startedAt: new Date(Date.now() - 20 * 60000),
          isPinned: false
        },
        {
          _id: 'l3',
          title: 'Q&A Session',
          streamer: { _id: 'u2', name: 'Mike Tech', username: 'miketech', profilePicture: null },
          viewers: 45,
          thumbnail: null,
          startedAt: new Date(Date.now() - 10 * 60000),
          isPinned: false
        }
      ];
      setPinnedStreams(demoStreams.filter(s => s.isPinned));
      setLiveStreams(demoStreams.filter(s => !s.isPinned));
    }
  };

  const fetchVlogs = async () => {
    try {
      const response = await api.get('/api/vlogs?limit=20');
      if (response.data?.vlogs) {
        setVlogs(response.data.vlogs);
      }
    } catch (error) {
      console.log('Using demo vlogs');
      setVlogs([
        { _id: 'v1', caption: 'My First Vlog', user: { name: 'Creator 1' }, viewsCount: 1200, duration: 125 },
        { _id: 'v2', caption: 'Tech Tips', user: { name: 'Creator 2' }, viewsCount: 890, duration: 180 },
      ]);
    }
  };

  const handlePinStream = async (streamId, currentlyPinned) => {
    if (!isAdmin) {
      toast.error('Only admins can pin streams');
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${streamId}/pin`, { isPinned: !currentlyPinned }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(currentlyPinned ? 'Stream unpinned' : 'Stream pinned to top!');
      fetchLiveStreams();
    } catch (error) {
      toast.error('Failed to update pin status');
    }
    setShowStreamOptions(null);
  };

  const formatDuration = (seconds) => {
    if (!seconds || typeof seconds !== 'number') return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewers = (num) => {
    // Handle if num is an array (views array)
    const count = Array.isArray(num) ? num.length : (typeof num === 'number' ? num : 0);
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatStreamTime = (date) => {
    if (!date) return '';
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const allLiveStreams = [...pinnedStreams, ...liveStreams];

  return (
    <>
      <Head>
        <title>TV | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
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
                { id: 'vlogs', label: 'Vlogs', icon: Video },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-semibold transition ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : activeTab === 'live' ? (
            /* Live Streams */
            <div>
              {allLiveStreams.length === 0 ? (
                <div className="text-center py-20">
                  <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Live Streams</h3>
                  <p className="text-gray-500 mb-6">Be the first to go live!</p>
                  <Link href="/live/go-live">
                    <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
                      Start Streaming
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pinned Streams Section */}
                  {pinnedStreams.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Pin className="w-4 h-4 text-purple-600" />
                        <h2 className="font-semibold text-gray-900">Pinned Streams</h2>
                      </div>
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
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular Live Streams */}
                  {liveStreams.length > 0 && (
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-4">Live Now</h2>
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
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Vlogs Tab */
            <div>
              {vlogs.length === 0 ? (
                <div className="text-center py-20">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vlogs Yet</h3>
                  <p className="text-gray-500 mb-6">Create your first vlog!</p>
                  <Link href="/vlog/create">
                    <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                      Create Vlog
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vlogs.map(vlog => (
                    <Link href={`/vlog/${vlog._id}`} key={vlog._id}>
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 relative">
                          {vlog.thumbnailUrl && (
                            <img src={vlog.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                          </div>
                          {vlog.duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-white text-xs">
                              {formatDuration(vlog.duration)}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {typeof vlog.caption === 'string' ? vlog.caption : (vlog.title || 'Untitled')}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {vlog.user?.name || vlog.user?.username || vlog.creator?.name || 'Unknown'}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {formatViewers(vlog.viewsCount || vlog.views?.length || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
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
              <span className="text-xs mt-1 text-gray-600">Feed</span>
            </button>
          </Link>
          
          <Link href="/groups">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1 text-gray-600">Groups</span>
            </button>
          </Link>
          
          <Link href="/create">
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
              <span className="text-xs mt-1 text-gray-600">Menu</span>
            </button>
          </Link>
        </nav>
      </div>
    </>
  );
}

// Stream Card Component
function StreamCard({ stream, isAdmin, isPinned, onPin, showOptions, onToggleOptions }) {
  const router = useRouter();
  
  const formatStreamTime = (date) => {
    if (!date) return '';
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div 
      className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer relative ${
        isPinned ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-200'
      }`}
      onClick={() => router.push(`/live/${stream._id}`)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
        {stream.thumbnail && (
          <img src={stream.thumbnail} alt="" className="w-full h-full object-cover" />
        )}
        
        {/* Live Badge */}
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
        
        {/* Viewers */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 rounded text-white text-xs">
          <Eye className="w-3 h-3" />
          {stream.viewers || 0}
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/50 rounded text-white text-xs">
          <Clock className="w-3 h-3" />
          {formatStreamTime(stream.startedAt)}
        </div>
        
        {/* Admin Options */}
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
                <button className="w-full px-3 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  End Stream
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Info */}
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
