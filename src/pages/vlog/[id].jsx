// ============================================
// FILE: src/pages/vlog/[id].jsx
// Vlog Viewer Page - Instagram/TikTok style
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Volume2, VolumeX, Play, Pause, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Relative time utility
function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}

export default function VlogViewerPage() {
  const router = useRouter();
  const { id } = router.query;
  const videoRef = useRef(null);
  
  const [vlog, setVlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchVlog();
    }
  }, [id]);

  const fetchVlog = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
      const response = await fetch(`${baseUrl}/api/vlogs/${id}`);
      const data = await response.json();
      
      if (data?.success && data?.vlog) {
        setVlog(data.vlog);
        setLikesCount(data.vlog.likes?.length || data.vlog.reactions?.like?.length || 0);
        
        // Track view
        try {
          const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
          fetch(`${baseUrl}/api/vlogs/${id}/view`, { 
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
        } catch {}
      } else {
        toast.error('Vlog not found');
        router.push('/feed');
      }
    } catch (error) {
      console.error('Fetch vlog error:', error);
      toast.error('Failed to load vlog');
      router.push('/feed');
    }
    setLoading(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
      
      const response = await fetch(`${baseUrl}/api/vlogs/${id}/react`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ type: 'like' })
      });
      
      if (response.ok) {
        if (liked) {
          setLikesCount(prev => Math.max(0, prev - 1));
        } else {
          setLikesCount(prev => prev + 1);
        }
        setLiked(!liked);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like');
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/vlog/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vlog) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-900">
        <p>Vlog not found</p>
      </div>
    );
  }

  const author = vlog.user || {};

  return (
    <>
      <Head>
        <title>{vlog.caption || 'Vlog'} | CYBEV</title>
      </Head>

      <div className="fixed inset-0 bg-gray-900">
        {/* Video Player */}
        <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
          {vlog.videoUrl ? (
            <video
              ref={videoRef}
              src={vlog.videoUrl}
              className="w-full h-full object-contain"
              loop
              playsInline
              autoPlay
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${vlog.backgroundGradient || 'from-purple-500 to-pink-500'} flex items-center justify-center`}>
              <p className="text-gray-900 text-xl px-8 text-center">{vlog.caption || 'No video'}</p>
            </div>
          )}
          
          {/* Play/Pause overlay */}
          {!isPlaying && vlog.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
              <div className="w-20 h-20 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-gray-900 fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2 text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-gray-900">
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-32 z-10 flex flex-col items-center gap-6">
          {/* Profile */}
          <Link href={`/profile/${author.username || author._id}`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 cursor-pointer">
              <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                {author.profilePicture || author.avatar ? (
                  <img src={author.profilePicture || author.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-900 font-bold">
                    {author.name?.[0] || 'U'}
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Like */}
          <button onClick={handleLike} className="flex flex-col items-center">
            <div className={`p-2 rounded-full ${liked ? 'bg-red-500/20' : 'bg-white/10'}`}>
              <Heart className={`w-7 h-7 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </div>
            <span className="text-gray-900 text-xs mt-1">{likesCount}</span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-white/10">
              <MessageCircle className="w-7 h-7 text-gray-900" />
            </div>
            <span className="text-gray-900 text-xs mt-1">{vlog.commentsCount || 0}</span>
          </button>

          {/* Share */}
          <button onClick={handleShare} className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-white/10">
              <Share2 className="w-7 h-7 text-gray-900" />
            </div>
            <span className="text-gray-900 text-xs mt-1">Share</span>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4 pb-8">
          <div className="max-w-sm">
            {/* Author */}
            <Link href={`/profile/${author.username || author._id}`}>
              <div className="flex items-center gap-2 mb-2 cursor-pointer">
                <span className="text-gray-900 font-semibold">{author.name || author.username}</span>
                <span className="text-white/60 text-sm">· {getRelativeTime(vlog.createdAt)}</span>
              </div>
            </Link>
            
            {/* Caption */}
            {vlog.caption && (
              <p className="text-gray-900 text-sm mb-2">{vlog.caption}</p>
            )}
            
            {/* Hashtags */}
            {vlog.hashtags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {vlog.hashtags.map((tag, i) => (
                  <span key={i} className="text-white/80 text-sm">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
