// ============================================
// FILE: src/pages/feed.jsx
// CYBEV Social Platform - FACEBOOK-LIKE FEED
// VERSION: 3.0 - Complete Facebook-like Experience
// FIXES:
//   - Vlogs show video previews and profile pictures
//   - Reactions work and show proper state
//   - View counts work
//   - Follow persists
//   - Facebook-like timeline with mixed content
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Users, Tv, Bell, Menu, Search, MessageCircle, Plus,
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Send,
  Image as ImageIcon, X, Edit, Trash2, Pin, Flag, Copy, ExternalLink,
  Globe, Loader2, Sparkles, Radio, Play, Monitor, Building, Wand2, UserPlus,
  ThumbsUp, Eye, UserCheck, Smile, ChevronDown
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// ==========================================
// EMOJI REACTIONS - Facebook Style
// ==========================================
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-600', bg: 'bg-blue-100' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500', bg: 'bg-red-100' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-orange-500', bg: 'bg-orange-100' }
];

// ==========================================
// UTILITIES
// ==========================================
function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

// ==========================================
// TOP NAVIGATION BAR
// ==========================================
function TopNavBar({ user }) {
  const router = useRouter();
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <Link href="/feed">
          <h1 className="text-2xl font-bold text-purple-600 cursor-pointer">CYBEV</h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          <NavButton href="/feed" icon={Home} active label="Home" />
          <NavButton href="/groups" icon={Users} label="Groups" />
          <NavButton href="/tv" icon={Tv} label="TV" />
          <NavButton href="/studio" icon={Building} label="Studio" />
        </div>
        
        <div className="flex items-center gap-2">
          <IconButton onClick={() => router.push('/studio')} icon={Plus} badge={null} />
          <IconButton onClick={() => router.push('/search')} icon={Search} />
          <IconButton onClick={() => router.push('/messages')} icon={MessageCircle} badge={3} />
          <IconButton onClick={() => router.push('/notifications')} icon={Bell} />
          <Link href={user?.username ? `/profile/${user.username}` : '/settings'}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer hover:ring-2 hover:ring-purple-300">
              {user?.profilePicture || user?.avatar ? (
                <img src={user.profilePicture || user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function NavButton({ href, icon: Icon, active, label }) {
  return (
    <Link href={href}>
      <button className={`px-6 py-2 rounded-lg hover:bg-gray-100 ${active ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`} title={label}>
        <Icon className="w-6 h-6" />
      </button>
    </Link>
  );
}

function IconButton({ onClick, icon: Icon, badge }) {
  return (
    <button onClick={onClick} className="relative w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
      <Icon className="w-5 h-5 text-gray-700" />
      {badge && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

// ==========================================
// POST COMPOSER
// ==========================================
function PostComposer({ user }) {
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 p-4">
      <div className="flex items-center gap-3">
        <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-300">
            {user?.profilePicture || user?.avatar ? (
              <img src={user.profilePicture || user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0] || 'U'
            )}
          </div>
        </Link>
        <button 
          onClick={() => router.push('/studio')}
          className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 text-left text-gray-500 transition"
        >
          What's on your mind, {user?.name?.split(' ')[0] || 'friend'}?
        </button>
        <button onClick={() => router.push('/studio')} className="p-2 hover:bg-gray-100 rounded-full">
          <ImageIcon className="w-6 h-6 text-green-500" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button onClick={() => router.push('/live/go-live')} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-gray-600 text-sm font-medium">
          <Radio className="w-5 h-5 text-red-500" />
          Live video
        </button>
        <button onClick={() => router.push('/studio/ai-blog')} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-gray-600 text-sm font-medium">
          <Wand2 className="w-5 h-5 text-purple-500" />
          Write with AI
        </button>
        <button onClick={() => router.push('/studio/sites/new')} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-gray-600 text-sm font-medium">
          <Globe className="w-5 h-5 text-blue-500" />
          AI Website
        </button>
      </div>
    </div>
  );
}

// ==========================================
// VLOGS SECTION - FIXED with Video Previews
// ==========================================

// Helper: Generate thumbnail URL from Cloudinary video URL
const generateThumbnailFromVideoUrl = (videoUrl) => {
  if (!videoUrl) return null;
  
  try {
    const url = new URL(videoUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    pathParts.splice(uploadIndex + 1, 0, 'so_1,w_300,h_400,c_fill');
    const lastPart = pathParts[pathParts.length - 1];
    pathParts[pathParts.length - 1] = lastPart.replace(/\.[^.]+$/, '.jpg');
    
    url.pathname = pathParts.join('/');
    return url.toString();
  } catch (e) {
    return null;
  }
};

function VlogSection({ user }) {
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.get('/api/vlogs/feed', { headers });
      console.log('Vlogs feed response:', response.data);
      if (response.data?.success || response.data?.stories) {
        setStories(response.data.stories || []);
      }
    } catch (error) {
      console.log('Vlogs fetch error:', error);
    }
    setLoading(false);
  };

  // Gradient colors for placeholder backgrounds
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Vlogs</h3>
        <Link href="/tv">
          <span className="text-purple-600 text-sm font-medium cursor-pointer hover:underline">See all</span>
        </Link>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {/* Create Vlog Card */}
        <div 
          onClick={() => router.push('/vlog/create')}
          className="flex-shrink-0 w-28 cursor-pointer group"
        >
          <div className="w-28 h-44 rounded-xl overflow-hidden relative shadow-sm border border-gray-200">
            {/* User's profile picture as background */}
            <div className="h-3/4 relative overflow-hidden">
              {user?.profilePicture || user?.avatar ? (
                <img 
                  src={user.profilePicture || user.avatar} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradients[0]} flex items-center justify-center text-white text-3xl font-bold`}>
                  {user?.name?.[0] || 'P'}
                </div>
              )}
            </div>
            <div className="h-1/4 bg-white flex flex-col items-center justify-center relative">
              <div className="absolute -top-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-900 mt-2">Create Vlog</span>
            </div>
          </div>
        </div>

        {/* User Stories with Video Previews */}
        {stories.length > 0 ? stories.map((story, idx) => (
          <VlogCard 
            key={story.user?._id || idx}
            story={story}
            gradient={gradients[(idx + 1) % gradients.length]}
            onClick={() => {
              if (story.vlogs?.[0]?._id) {
                router.push(`/vlog/${story.vlogs[0]._id}`);
              }
            }}
          />
        )) : (
          // Placeholder cards when no stories
          [...Array(4)].map((_, idx) => (
            <div 
              key={`placeholder-${idx}`}
              className="flex-shrink-0 w-28 h-44 rounded-xl overflow-hidden relative cursor-pointer opacity-50 hover:opacity-70 transition"
              onClick={() => router.push('/tv')}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[(idx + 1) % gradients.length]}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2">
                <div className="w-9 h-9 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                  <span className="text-gray-500 text-xs">+</span>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium">Explore</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VlogCard({ story, gradient, onClick }) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const hasUnviewed = story.hasUnviewed;
  const vlog = story.vlogs?.[0];
  
  // Get thumbnail - try multiple sources
  const getThumbnail = () => {
    if (!vlog) return null;
    
    // 1. Direct thumbnail URL
    if (vlog.thumbnailUrl && !thumbnailError) return vlog.thumbnailUrl;
    
    // 2. Generate from video URL (Cloudinary)
    if (vlog.videoUrl && !thumbnailError) {
      const generated = generateThumbnailFromVideoUrl(vlog.videoUrl);
      if (generated) return generated;
    }
    
    return null;
  };
  
  const thumbnail = getThumbnail();
  
  return (
    <div 
      onClick={onClick}
      className="flex-shrink-0 w-28 h-44 rounded-xl overflow-hidden relative cursor-pointer group shadow-sm"
    >
      {/* Background - Video thumbnail, video element, or gradient */}
      <div className="absolute inset-0">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt="" 
            className="w-full h-full object-cover"
            onError={() => setThumbnailError(true)}
          />
        ) : vlog?.videoUrl ? (
          // Fallback: Show video element as preview (first frame)
          <video 
            src={vlog.videoUrl} 
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Profile picture ring - shows viewed/unviewed state */}
      <div className="absolute top-2 left-2">
        <div className={`w-10 h-10 rounded-full p-0.5 ${hasUnviewed ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-400'}`}>
          <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
            {story.user?.profilePicture || story.user?.avatar ? (
              <img 
                src={story.user.profilePicture || story.user.avatar} 
                alt="" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold`}>
                {story.user?.name?.[0] || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Play button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </div>
      
      {/* Username */}
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-xs font-semibold truncate drop-shadow-lg">
          {story.user?.name || story.user?.username}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// FEED POST CARD - Facebook Style with Working Reactions
// ==========================================
function FeedCard({ item, currentUserId, isAdmin, onRefresh }) {
  const router = useRouter();
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [myReaction, setMyReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({
    total: item.likesCount || item.likes?.length || 0,
    types: item.reactions || {}
  });
  const [viewCount, setViewCount] = useState(item.views || item.viewCount || 0);
  const [commentCount, setCommentCount] = useState(item.commentCount || item.comments?.length || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const reactionTimeout = useRef(null);

  const authorId = item.author?._id || item.author || item.authorId?._id || item.authorId;
  const isOwner = currentUserId && String(authorId) === String(currentUserId);
  const authorName = item.author?.name || item.authorName || 'User';
  const authorUsername = item.author?.username || item.username;
  const authorAvatar = item.author?.avatar || item.author?.profilePicture || item.authorAvatar;

  // Check initial reaction and follow status
  useEffect(() => {
    if (currentUserId) {
      // Check if user has reacted
      if (item.reactions) {
        for (const [type, users] of Object.entries(item.reactions)) {
          if (users?.some(id => String(id) === String(currentUserId))) {
            setMyReaction(type);
            break;
          }
        }
      }
      if (item.likes?.some(id => String(id) === String(currentUserId))) {
        setMyReaction('like');
      }
      
      // Check follow status
      if (!isOwner && authorId) {
        checkFollowStatus();
      }
    }
  }, [currentUserId, item]);

  const checkFollowStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await api.get(`/api/follow/check/${authorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(res.data?.isFollowing || res.data?.following || false);
    } catch {}
  };

  const handleReaction = async (type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login to react');
      return;
    }

    const previousReaction = myReaction;
    const isRemoving = myReaction === type;
    
    // Optimistic update
    setMyReaction(isRemoving ? null : type);
    setReactionCounts(prev => ({
      ...prev,
      total: isRemoving ? Math.max(0, prev.total - 1) : (previousReaction ? prev.total : prev.total + 1)
    }));
    setShowReactions(false);

    try {
      await api.post(`/api/blogs/${item._id}/react`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // Revert on error
      setMyReaction(previousReaction);
      setReactionCounts(prev => ({
        ...prev,
        total: item.likesCount || item.likes?.length || 0
      }));
      toast.error('Failed to react');
    }
  };

  const handleFollow = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login to follow');
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/api/follow/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
      } else {
        await api.post(`/api/follow/${authorId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(true);
      }
    } catch (error) {
      toast.error('Failed to update follow');
    }
    setFollowLoading(false);
  };

  // Track view
  useEffect(() => {
    const trackView = async () => {
      try {
        const token = localStorage.getItem('token');
        await api.post(`/api/blogs/${item._id}/view`, {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
      } catch {}
    };
    
    const timer = setTimeout(trackView, 2000);
    return () => clearTimeout(timer);
  }, [item._id]);

  const getReactionDisplay = () => {
    if (!myReaction) return null;
    const reaction = REACTIONS.find(r => r.type === myReaction);
    return reaction;
  };

  const reactionDisplay = getReactionDisplay();
  const postUrl = `/blog/${item._id}`;
  const contentPreview = stripMarkdown(item.content || item.excerpt || '');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={authorUsername ? `/profile/${authorUsername}` : '#'}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-300">
              {authorAvatar ? (
                <img src={authorAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {authorName?.[0] || 'U'}
                </div>
              )}
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={authorUsername ? `/profile/${authorUsername}` : '#'}>
                <span className="font-semibold text-gray-900 hover:underline cursor-pointer">{authorName}</span>
              </Link>
              {!isOwner && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`text-sm font-semibold ${isFollowing ? 'text-gray-500' : 'text-purple-600 hover:text-purple-700'}`}
                >
                  {followLoading ? '...' : isFollowing ? '' : '• Follow'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{getRelativeTime(item.createdAt)}</span>
              <span>•</span>
              <Globe className="w-3 h-3" />
              {item.contentType === 'blog' && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Blog</span>}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Title & Content */}
      <Link href={postUrl}>
        <div className="px-4 cursor-pointer">
          {item.title && (
            <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-purple-600">{item.title}</h3>
          )}
          {contentPreview && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
              {contentPreview.slice(0, 250)}
              {contentPreview.length > 250 && '...'}
            </p>
          )}
        </div>
      </Link>

      {/* Image */}
      {(item.featuredImage || item.coverImage || item.media?.[0]) && (
        <Link href={postUrl}>
          <div className="relative cursor-pointer">
            <img 
              src={item.featuredImage || item.coverImage || item.media?.[0]?.url || item.media?.[0]} 
              alt={item.title || 'Post image'}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        </Link>
      )}

      {/* Stats Row */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-1">
          {reactionCounts.total > 0 && (
            <>
              <div className="flex -space-x-1">
                <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs">👍</span>
                <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">❤️</span>
              </div>
              <span className="ml-1">{reactionCounts.total}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{commentCount} comments</span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {viewCount} Views
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-around border-b border-gray-100">
        {/* Like Button with Reactions Popup */}
        <div className="relative flex-1">
          <button
            onMouseEnter={() => {
              reactionTimeout.current = setTimeout(() => setShowReactions(true), 500);
            }}
            onMouseLeave={() => {
              clearTimeout(reactionTimeout.current);
              setTimeout(() => setShowReactions(false), 300);
            }}
            onClick={() => handleReaction('like')}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition font-medium ${
              myReaction ? REACTIONS.find(r => r.type === myReaction)?.color || 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {reactionDisplay ? (
              <>
                <span className="text-xl">{reactionDisplay.emoji}</span>
                <span>{reactionDisplay.label}</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-5 h-5" />
                <span>Like</span>
              </>
            )}
          </button>
          
          {/* Reactions Popup */}
          {showReactions && (
            <div 
              className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 p-1.5 flex gap-1 z-50"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {REACTIONS.map(reaction => (
                <button
                  key={reaction.type}
                  onClick={() => handleReaction(reaction.type)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl hover:scale-125 transition-transform ${
                    myReaction === reaction.type ? reaction.bg : 'hover:bg-gray-100'
                  }`}
                  title={reaction.label}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 font-medium"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}${postUrl}`);
            toast.success('Link copied!');
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 font-medium"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentsSection blogId={item._id} onCommentAdded={() => setCommentCount(prev => prev + 1)} />
      )}
    </div>
  );
}

// ==========================================
// COMMENTS SECTION
// ==========================================
function CommentsSection({ blogId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/comments/blog/${blogId}`);
      setComments(res.data.comments || []);
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login to comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/api/comments', {
        content: newComment.trim(),
        blogId
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.ok || res.data.comment) {
        setComments(prev => [res.data.comment, ...prev]);
        setNewComment('');
        onCommentAdded?.();
      }
    } catch (error) {
      toast.error('Failed to post comment');
    }
    setSubmitting(false);
  };

  return (
    <div className="p-4 bg-gray-50">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-2 pr-10 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-600 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.slice(0, 3).map(comment => (
            <div key={comment._id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.author?.name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl px-3 py-2">
                  <p className="font-semibold text-sm text-gray-900">{comment.author?.name || 'User'}</p>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
                <div className="flex gap-4 mt-1 ml-3 text-xs text-gray-500">
                  <span>{getRelativeTime(comment.createdAt)}</span>
                  <button className="font-semibold hover:underline">Like</button>
                  <button className="font-semibold hover:underline">Reply</button>
                </div>
              </div>
            </div>
          ))}
          {comments.length > 3 && (
            <button className="text-purple-600 text-sm font-medium hover:underline ml-10">
              View all {comments.length} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// AD CARD
// ==========================================
function AdCard() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 mb-4 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium">Sponsored</span>
        <button className="text-xs text-gray-400 hover:text-gray-600">×</button>
      </div>
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Advertise on CYBEV</h4>
          <p className="text-sm text-gray-600 mt-1">Reach millions of readers with your brand</p>
          <button className="mt-2 px-4 py-1 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN FEED PAGE
// ==========================================
export default function Feed() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setIsAdmin(parsed.role === 'admin' || parsed.isAdmin);
      } catch {}
    }
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      let feedData = [];
      
      // Try feed endpoint first
      try {
        const res = await api.get('/api/feed?tab=latest', { headers });
        feedData = res.data.feed || res.data.posts || res.data.items || [];
      } catch (feedError) {
        console.log('Feed endpoint failed, trying blogs');
      }
      
      // Fallback to blogs
      if (feedData.length === 0) {
        try {
          const blogsRes = await api.get('/api/blogs?status=published&limit=50', { headers });
          feedData = (blogsRes.data.data?.blogs || blogsRes.data.blogs || blogsRes.data || [])
            .map(blog => ({ ...blog, contentType: 'blog' }));
        } catch {}
      }
      
      setFeed(feedData);
    } catch (error) {
      console.error('Feed fetch error:', error);
    }
    setLoading(false);
  };

  // Insert ads at intervals
  const feedWithAds = [];
  feed.forEach((item, idx) => {
    feedWithAds.push(item);
    if ([2, 7, 14].includes(idx)) {
      feedWithAds.push({ isAd: true, position: idx });
    }
  });

  return (
    <>
      <Head>
        <title>CYBEV - Social Blogging Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <TopNavBar user={user} />

        <div className="max-w-screen-sm mx-auto px-4 py-4 pb-20 md:pb-4">
          <PostComposer user={user} />
          <VlogSection user={user} />

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : feed.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share something!</p>
              <button onClick={() => router.push('/studio')} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                Create Post
              </button>
            </div>
          ) : (
            feedWithAds.map((item, idx) => (
              <React.Fragment key={item._id || `item-${idx}`}>
                {item.isAd ? (
                  <AdCard key={`ad-${item.position}`} />
                ) : (
                  <FeedCard 
                    item={item} 
                    currentUserId={user?._id || user?.id} 
                    isAdmin={isAdmin}
                    onRefresh={fetchFeed}
                  />
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed"><button className="p-3 text-purple-600"><Home className="w-6 h-6" /></button></Link>
          <Link href="/groups"><button className="p-3 text-gray-500"><Users className="w-6 h-6" /></button></Link>
          <button onClick={() => router.push('/studio')} className="p-3 bg-purple-600 rounded-full -mt-6 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </button>
          <Link href="/studio"><button className="p-3 text-gray-500"><Building className="w-6 h-6" /></button></Link>
          <Link href={user?.username ? `/profile/${user.username}` : '/settings'}><button className="p-3 text-gray-500"><Menu className="w-6 h-6" /></button></Link>
        </div>
      </div>
    </>
  );
}
