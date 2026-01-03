// ============================================
// FILE: src/pages/tv.jsx
// CYBEV TV - Watch Live Streams & Videos
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Tv, Radio, Play, Users, Clock, Search, Filter, ArrowLeft, Eye, Heart, MessageCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function TVPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('live');
  const [liveStreams, setLiveStreams] = useState([]);
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'live') {
        const response = await api.get('/api/live/active');
        setLiveStreams(response.data?.streams || []);
      } else {
        const response = await api.get('/api/vlogs?limit=20');
        setVlogs(response.data?.vlogs || []);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'live', label: 'Live Now', icon: Radio },
    { id: 'vlogs', label: 'Vlogs', icon: Play },
  ];

  return (
    <>
      <Head>
        <title>TV | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <Tv className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-xl text-gray-900">CYBEV TV</span>
              </div>
            </div>
            
            <Link href="/live/go-live">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
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
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-semibold transition ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.id === 'live' && liveStreams.length > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {liveStreams.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === 'live' ? (
            /* Live Streams */
            <div>
              {liveStreams.length === 0 ? (
                <div className="text-center py-20">
                  <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Live Streams</h3>
                  <p className="text-gray-500 mb-6">Be the first to go live!</p>
                  <Link href="/live/go-live">
                    <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
                      Start Streaming
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveStreams.map(stream => (
                    <Link key={stream._id} href={`/live/watch/${stream._id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                        <div className="relative aspect-video bg-gray-900">
                          {stream.thumbnail ? (
                            <img src={stream.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                              <Radio className="w-12 h-12 text-white" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex items-center gap-2">
                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              LIVE
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {stream.viewerCount || 0}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{stream.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {stream.host?.name?.[0] || 'U'}
                            </div>
                            <span className="text-sm text-gray-600">{stream.host?.name || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Vlogs */
            <div>
              {vlogs.length === 0 ? (
                <div className="text-center py-20">
                  <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vlogs Yet</h3>
                  <p className="text-gray-500 mb-6">Share your first video!</p>
                  <Link href="/vlog/create">
                    <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                      Create Vlog
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vlogs.map(vlog => (
                    <Link key={vlog._id} href={`/vlog/${vlog._id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                        <div className="relative aspect-video bg-gray-900">
                          {vlog.thumbnailUrl || vlog.videoUrl ? (
                            <img 
                              src={vlog.thumbnailUrl || vlog.videoUrl} 
                              alt="" 
                              className="w-full h-full object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${vlog.backgroundGradient || 'from-purple-500 to-pink-500'}`}>
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition bg-black/30">
                            <div className="w-14 h-14 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
                              <Play className="w-7 h-7 text-white fill-white" />
                            </div>
                          </div>
                          {vlog.duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                              {Math.floor(vlog.duration / 60)}:{String(vlog.duration % 60).padStart(2, '0')}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-gray-900 text-sm line-clamp-2">{vlog.caption || 'No caption'}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden flex items-center justify-center">
                                {vlog.user?.profilePicture ? (
                                  <img src={vlog.user.profilePicture} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-white text-xs font-bold">{vlog.user?.name?.[0] || 'U'}</span>
                                )}
                              </div>
                              <span className="text-xs text-gray-600">{vlog.user?.name || 'Unknown'}</span>
                            </div>
                            <span className="text-xs text-gray-400">{getRelativeTime(vlog.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {vlog.viewsCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {vlog.likes?.length || 0}
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
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </button>
          </Link>
          
          <Link href="/explore">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">Explore</span>
            </button>
          </Link>
          
          <Link href="/create">
            <button className="relative -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
          </Link>
          
          <button className="flex flex-col items-center py-2 px-4 text-purple-600">
            <Tv className="w-6 h-6" />
            <span className="text-xs mt-1">TV</span>
          </button>
          
          <Link href="/menu">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
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
