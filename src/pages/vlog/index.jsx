// ============================================
// FILE: src/pages/vlog/index.jsx
// Vlog Feed - TikTok/Reels style vertical scroll
// VERSION: 1.0.0
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Heart, MessageCircle, Share2, Volume2, VolumeX, Play } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}

function VlogCard({ vlog, isActive, onLike }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(
    vlog.likes?.length || vlog.reactions?.like?.length || 0
  );

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => liked ? Math.max(0, prev - 1) : prev + 1);
    if (onLike) onLike(vlog._id);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/vlog/${vlog._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const author = vlog.user || vlog.author || {};

  return (
    <div className="relative w-full h-full bg-black snap-start" onClick={togglePlay}>
      {vlog.videoUrl ? (
        <video
          ref={videoRef}
          src={vlog.videoUrl}
          className="w-full h-full object-contain"
          loop
          playsInline
          muted={isMuted}
          poster={vlog.thumbnailUrl}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${vlog.backgroundGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center`}>
          <p className="text-white text-xl px-8 text-center">{vlog.caption || 'Vlog'}</p>
        </div>
      )}

      {/* Play overlay */}
      {!isPlaying && vlog.videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-16 h-16 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Mute button */}
      <button onClick={toggleMute} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full z-10">
        {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
      </button>

      {/* Right side actions */}
      <div className="absolute right-3 bottom-28 z-10 flex flex-col items-center gap-5">
        <Link href={`/profile/${author.username || author._id}`}>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-black overflow-hidden">
              {(author.profilePicture || author.avatar) ? (
                <img src={author.profilePicture || author.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                  {author.name?.[0] || 'U'}
                </div>
              )}
            </div>
          </div>
        </Link>

        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart className={`w-7 h-7 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          <span className="text-white text-xs mt-1">{likesCount}</span>
        </button>

        <button className="flex flex-col items-center">
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="text-white text-xs mt-1">{vlog.commentsCount || 0}</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center">
          <Share2 className="w-7 h-7 text-white" />
          <span className="text-white text-xs mt-1">Share</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-16 z-10 bg-gradient-to-t from-black/70 to-transparent p-4 pb-6">
        <Link href={`/profile/${author.username || author._id}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-semibold text-sm">{author.name || author.username || 'User'}</span>
            <span className="text-white/60 text-xs">· {getRelativeTime(vlog.createdAt)}</span>
          </div>
        </Link>
        {vlog.caption && (
          <p className="text-white text-sm line-clamp-2">{vlog.caption}</p>
        )}
        {vlog.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {vlog.hashtags.slice(0, 5).map((tag, i) => (
              <span key={i} className="text-white/80 text-xs">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VlogFeedPage() {
  const router = useRouter();
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = async (pageNum = 1) => {
    try {
      const response = await api.get('/api/vlogs', { params: { page: pageNum, limit: 20 } });
      if (response.data?.success) {
        const newVlogs = response.data.vlogs || [];
        if (pageNum === 1) {
          setVlogs(newVlogs);
        } else {
          setVlogs(prev => [...prev, ...newVlogs]);
        }
        setHasMore(response.data.hasMore || newVlogs.length === 20);
      }
    } catch (error) {
      console.error('Fetch vlogs error:', error);
      if (pageNum === 1) toast.error('Failed to load vlogs');
    }
    setLoading(false);
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }

    // Load more when near end
    if (newIndex >= vlogs.length - 3 && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVlogs(nextPage);
    }
  }, [activeIndex, vlogs.length, hasMore, loading, page]);

  const handleLike = async (vlogId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (!token) { toast.info('Please login'); return; }
      await api.post(`/api/vlogs/${vlogId}/react`, { type: 'like' });
    } catch {}
  };

  if (loading && vlogs.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Vlogs | CYBEV</title>
        <meta name="description" content="Watch short video content on CYBEV" />
      </Head>

      <div className="fixed inset-0 bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={() => router.back()} className="p-2 text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-bold text-lg">Vlogs</h1>
          <Link href="/vlog/create" className="p-2 text-white">
            <Plus className="w-6 h-6" />
          </Link>
        </div>

        {/* Vlog Feed */}
        {vlogs.length > 0 ? (
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="h-full overflow-y-scroll snap-y snap-mandatory"
            style={{ scrollSnapType: 'y mandatory' }}
          >
            {vlogs.map((vlog, index) => (
              <div key={vlog._id} className="h-full w-full snap-start" style={{ height: '100vh' }}>
                <VlogCard
                  vlog={vlog}
                  isActive={index === activeIndex}
                  onLike={handleLike}
                />
              </div>
            ))}

            {loading && (
              <div className="h-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <Play className="w-10 h-10 text-white/60" />
            </div>
            <p className="text-lg font-semibold mb-2">No Vlogs Yet</p>
            <p className="text-white/60 text-sm mb-6">Be the first to share a vlog!</p>
            <Link href="/vlog/create" className="px-6 py-3 bg-purple-600 rounded-full font-semibold hover:bg-purple-700 transition">
              Create Vlog
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
