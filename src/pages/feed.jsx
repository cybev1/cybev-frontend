// ============================================
// FILE: src/pages/feed.jsx
// CYBEV Social-Blogging Platform - Complete Feed
// Features: VLOG, TV, PIN POST, Ads, Groups, Websites
// FIX: AI Blog Builder → AI Website Builder /studio/sites/new
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Users, Tv, Bell, Menu, Search, MessageCircle, Plus,
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Send,
  Image as ImageIcon, X, Edit, Trash2, Pin, Flag, Copy, ExternalLink,
  Globe, Loader2, Sparkles, Radio, Play, Monitor, Building, Wand2, UserPlus
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// ==========================================
// MARKDOWN UTILITIES (inline to avoid import issues)
// ==========================================
function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[\-\*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/```[^`]+```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[\-\*]{3,}$/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImages(markdown) {
  if (!markdown) return [];
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    images.push({ alt: match[1], url: match[2] });
  }
  return images;
}

// ==========================================
// RELATIVE TIME UTILITY
// ==========================================
function getRelativeTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSecs < 5) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

// Emoji Reactions
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-600' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-500' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-orange-500' }
];

// ==========================================
// TOP NAVIGATION BAR
// ==========================================
function TopNavBar({ user }) {
  const router = useRouter();
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed">
          <h1 className="text-2xl font-bold text-purple-600 cursor-pointer">CYBEV</h1>
        </Link>
        
        {/* Center Nav Icons */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/feed">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 text-purple-600 border-b-2 border-purple-600" title="Home">
              <Home className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/groups">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Groups">
              <Users className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/tv">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 text-gray-500" title="CYBEV TV">
              <Tv className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/studio">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Studio">
              <Building className="w-6 h-6" />
            </button>
          </Link>
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/studio')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200" title="Create">
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={() => router.push('/search')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200" title="Search">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={() => router.push('/messages')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 relative" title="Messages">
            <MessageCircle className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
          </button>
          <button onClick={() => router.push('/notifications')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200" title="Notifications">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// POST COMPOSER - FIX: AI Website Builder link
// ==========================================
function PostComposer({ user, onOpenAI }) {
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 p-4">
      <div className="flex items-center gap-3">
        <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-purple-300 transition">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white">{user?.name?.[0] || 'U'}</span>
            )}
          </div>
        </Link>
        <button 
          onClick={() => router.push('/studio')}
          className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 text-left text-gray-600 transition-colors"
        >
          Write a short blog or article...
        </button>
        <button onClick={() => router.push('/studio')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-green-600" />
        </button>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button 
          onClick={() => router.push('/live/go-live')}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700 text-sm font-medium"
        >
          <Radio className="w-5 h-5 text-red-500" />
          <span>Live video</span>
        </button>
        <button 
          onClick={() => router.push('/studio?mode=ai')}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700 text-sm font-medium"
        >
          <Wand2 className="w-5 h-5 text-purple-600" />
          <span>Write with AI</span>
        </button>
        {/* FIX: Changed from AI Blog Builder to AI Website Builder */}
        <button 
          onClick={() => router.push('/studio/sites/new')}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700 text-sm font-medium"
        >
          <Globe className="w-5 h-5 text-pink-500" />
          <span>AI Website Builder</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// VLOG SECTION (with API integration)
// ==========================================
function VlogSection({ user }) {
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await api.get('/api/vlogs/feed');
      if (response.data?.success) {
        const fetchedStories = response.data.stories || [];
        // Always ensure we have at least 6 frames for good UX
        if (fetchedStories.length < 6) {
          const placeholders = [
            { user: { _id: 'p1', name: 'Add Story' }, vlogs: [], hasUnviewed: false, gradient: 'from-gray-300 to-gray-400', isPlaceholder: true },
            { user: { _id: 'p2', name: 'Add Story' }, vlogs: [], hasUnviewed: false, gradient: 'from-gray-300 to-gray-400', isPlaceholder: true },
            { user: { _id: 'p3', name: 'Add Story' }, vlogs: [], hasUnviewed: false, gradient: 'from-gray-300 to-gray-400', isPlaceholder: true },
          ];
          setStories([...fetchedStories, ...placeholders.slice(0, Math.max(0, 4 - fetchedStories.length))]);
        } else {
          setStories(fetchedStories);
        }
      }
    } catch (error) {
      // Fallback placeholder data - show empty frames
      setStories([
        { user: { _id: '1', name: 'Deborah T' }, vlogs: [], hasUnviewed: true, gradient: 'from-blue-400 to-cyan-500' },
        { user: { _id: '2', name: 'Sonia M' }, vlogs: [], hasUnviewed: false, gradient: 'from-green-400 to-teal-500' },
        { user: { _id: '3', name: 'Prince D' }, vlogs: [], hasUnviewed: true, gradient: 'from-orange-400 to-red-500' },
        { user: { _id: '4', name: 'Jane D' }, vlogs: [], hasUnviewed: false, gradient: 'from-purple-400 to-indigo-500' },
        { user: { _id: '5', name: 'Add Story' }, vlogs: [], hasUnviewed: false, gradient: 'from-gray-300 to-gray-400', isPlaceholder: true },
      ]);
    }
    setLoading(false);
  };

  const colors = ['from-pink-400 to-purple-500', 'from-blue-400 to-cyan-500', 'from-green-400 to-teal-500', 'from-orange-400 to-red-500', 'from-purple-400 to-indigo-500', 'from-yellow-400 to-orange-500'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Vlogs</h3>
        <Link href="/tv">
          <span className="text-purple-600 text-sm font-medium cursor-pointer hover:underline">See all</span>
        </Link>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Create Vlog Card */}
        <div 
          onClick={() => router.push('/vlog/create')}
          className="flex-shrink-0 w-28 h-44 rounded-xl overflow-hidden relative cursor-pointer group shadow-sm"
        >
          <div className="w-full h-full bg-white border-2 border-gray-200">
            <div className={`h-3/4 bg-gradient-to-br ${colors[0]} relative`}>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.[0] || 'P'}
                </div>
              )}
            </div>
            <div className="h-1/4 flex flex-col items-center justify-center bg-white relative">
              <div className="absolute -top-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-900 mt-2">Create Vlog</span>
            </div>
          </div>
        </div>

        {/* User Stories */}
        {stories.map((story, idx) => (
          <div 
            key={story.user?._id || idx} 
            onClick={() => {
              if (story.isPlaceholder) {
                router.push('/vlog/create');
              } else if (story.vlogs?.[0]?._id) {
                router.push(`/vlog/${story.vlogs[0]._id}`);
              } else {
                toast.info('No vlog available');
              }
            }}
            className={`flex-shrink-0 w-28 h-44 rounded-xl overflow-hidden relative cursor-pointer group shadow-sm ${story.isPlaceholder ? 'opacity-60' : ''}`}
          >
            <div className="w-full h-full relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient || colors[(idx + 1) % colors.length]}`} />
              {story.vlogs?.[0]?.thumbnailUrl && (
                <img src={story.vlogs[0].thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Profile Ring */}
              <div className="absolute top-2 left-2">
                <div className={`w-9 h-9 rounded-full p-0.5 ${story.hasUnviewed ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-400'}`}>
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    {story.user?.profilePicture || story.user?.avatar ? (
                      <img src={story.user.profilePicture || story.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${colors[(idx + 2) % colors.length]} flex items-center justify-center text-white text-xs font-bold`}>
                        {story.isPlaceholder ? '+' : (story.user?.name?.[0] || 'U')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Play Icon */}
              {!story.isPlaceholder && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              )}
              
              {/* Name */}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate drop-shadow">{story.user?.name || story.user?.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// SUGGESTED FOLLOWS SECTION
// ==========================================
function SuggestedFollows({ currentUserId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState({});
  const [followLoading, setFollowLoading] = useState({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/follow/suggestions?limit=5', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data?.success || response.data?.suggestions) {
        const users = response.data.suggestions || [];
        setSuggestions(users);
        
        // Check follow status for each user
        if (token && users.length > 0) {
          const states = {};
          for (const user of users) {
            try {
              const checkRes = await api.get(`/api/follow/check/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              states[user._id] = checkRes.data?.following || checkRes.data?.isFollowing || false;
            } catch {
              states[user._id] = false;
            }
          }
          setFollowingStates(states);
        }
      }
    } catch (error) {
      console.log('Suggestions fetch error:', error);
    }
    setLoading(false);
  };

  const handleFollow = async (userId, userName) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.info('Please login to follow');
      return;
    }

    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      if (followingStates[userId]) {
        // Unfollow
        await api.delete(`/api/follow/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowingStates(prev => ({ ...prev, [userId]: false }));
        toast.success(`Unfollowed ${userName}`);
      } else {
        // Follow
        await api.post(`/api/follow/${userId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowingStates(prev => ({ ...prev, [userId]: true }));
        toast.success(`Following ${userName}!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update follow status');
    }
    
    setFollowLoading(prev => ({ ...prev, [userId]: false }));
  };

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Suggested for you</h3>
        <Link href="/explore">
          <span className="text-purple-600 text-xs font-medium cursor-pointer hover:underline">See All</span>
        </Link>
      </div>
      
      <div className="space-y-3">
        {suggestions.slice(0, 5).map(user => (
          <div key={user._id} className="flex items-center justify-between">
            <Link href={`/profile/${user.username || user._id}`}>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  {user.profilePicture || user.avatar ? (
                    <img src={user.profilePicture || user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold">{user.name?.[0] || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm hover:underline">{user.name || user.username}</p>
                  <p className="text-gray-500 text-xs">{user.bio ? user.bio.slice(0, 25) + '...' : 'New to CYBEV'}</p>
                </div>
              </div>
            </Link>
            <button
              onClick={() => handleFollow(user._id, user.name || user.username)}
              disabled={followLoading[user._id]}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                followingStates[user._id]
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {followLoading[user._id] ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : followingStates[user._id] ? (
                'Following'
              ) : (
                'Follow'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// AD CARD
// ==========================================
function AdCard({ position }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 mb-4 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium">Sponsored</span>
        <button className="text-xs text-gray-400 hover:text-gray-600">×</button>
      </div>
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
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
// PINNED POST INDICATOR
// ==========================================
function PinnedBadge() {
  return (
    <div className="flex items-center gap-1 text-purple-600 text-xs font-medium mb-2">
      <Pin className="w-3.5 h-3.5" />
      <span>Pinned Post</span>
    </div>
  );
}

// ==========================================
// COMMENTS MODAL
// ==========================================
function CommentsModal({ isOpen, onClose, blogId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && blogId) fetchComments();
  }, [isOpen, blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/comments/blog/${blogId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to comment');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/api/comments', {
        content: newComment.trim(),
        blogId: blogId
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.ok || response.data.comment) {
        setComments(prev => [response.data.comment, ...prev]);
        setNewComment('');
        toast.success('Comment posted!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Comments</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {comment.author?.name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900">{comment.author?.name || comment.authorName}</p>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                  <div className="flex gap-4 mt-1 ml-3 text-xs text-gray-500">
                    <span>{getRelativeTime(comment.createdAt)}</span>
                    <button className="font-semibold hover:underline">Like</button>
                    <button className="font-semibold hover:underline">Reply</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" disabled={submitting || !newComment.trim()}
              className="text-purple-600 font-semibold text-sm disabled:opacity-50">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// FEED POST CARD
// ==========================================
function FeedCard({ item, currentUserId, isAdmin, onRefresh, isPinnedPost }) {
  const router = useRouter();
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTimelineShare, setShowTimelineShare] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [reactions, setReactions] = useState(item.reactions || {});
  const [likesCount, setLikesCount] = useState(item.likes?.length || item.likesCount || 0);
  const [isPinned, setIsPinned] = useState(item.isPinned || isPinnedPost);
  const [isSharedToTimeline, setIsSharedToTimeline] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const reactionTimeout = useRef(null);

  const isBlog = item.contentType === 'blog' || item.title;
  const isLivePost = item.isLive || item.contentType === 'live';
  const authorId = item.author?._id || item.author || item.authorId?._id || item.authorId;
  const isOwner = currentUserId && (String(authorId) === String(currentUserId));

  // Check follow status on mount
  useEffect(() => {
    if (currentUserId && authorId && !isOwner) {
      checkFollowStatus();
    }
  }, [currentUserId, authorId]);

  const checkFollowStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (!token) return;
      const response = await api.get(`/api/follow/check/${authorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Check both 'following' and 'isFollowing' fields for compatibility
      setIsFollowing(response.data?.following || response.data?.isFollowing || false);
    } catch {}
  };

  const handleFollow = async (e) => {
    e.stopPropagation();
    if (!currentUserId) {
      toast.info('Please login to follow');
      return;
    }
    if (isOwner) return;
    
    setFollowLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (isFollowing) {
        await api.delete(`/api/follow/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await api.post(`/api/follow/${authorId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(true);
        toast.success('Following!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed');
    }
    setFollowLoading(false);
  };

  useEffect(() => {
    if (currentUserId && item.reactions) {
      const myReactions = {};
      for (const [type, users] of Object.entries(item.reactions)) {
        if (users?.some(id => String(id) === String(currentUserId))) {
          myReactions[type] = true;
        }
      }
      setUserReactions(myReactions);
    }
    if (currentUserId && item.likes?.some(id => String(id) === String(currentUserId))) {
      setUserReactions(prev => ({ ...prev, like: true }));
    }
  }, [currentUserId, item]);

  const handleReaction = async (e, type) => {
    e.stopPropagation();
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to react');
      return;
    }

    const hadThisReaction = userReactions[type];
    setUserReactions(prev => ({ ...prev, [type]: !hadThisReaction }));
    
    if (type === 'like') {
      setLikesCount(prev => hadThisReaction ? prev - 1 : prev + 1);
    }

    try {
      const response = await api.post(`/api/blogs/${item._id}/react`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.ok) {
        setReactions(response.data.reactions || {});
        if (response.data.userReactions) setUserReactions(response.data.userReactions);
      }
    } catch {
      setUserReactions(prev => ({ ...prev, [type]: hadThisReaction }));
      if (type === 'like') setLikesCount(prev => hadThisReaction ? prev + 1 : prev - 1);
    }
    setShowReactions(false);
  };

  const handlePin = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    try {
      const response = await api.post(`/api/blogs/${item._id}/pin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.ok) {
        setIsPinned(response.data.isPinned);
        toast.success(response.data.message);
      }
    } catch {
      toast.error('Failed to pin');
    }
    setShowMoreMenu(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    try {
      await api.delete(`/api/blogs/${item._id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Deleted!');
      if (onRefresh) onRefresh();
    } catch {
      toast.error('Failed to delete');
    }
    setShowMoreMenu(false);
  };

  const handleShare = async (platform) => {
    const shareUrl = `${window.location.origin}/blog/${item._id}`;
    const shareTitle = item.title || 'Check this out on CYBEV!';
    const shareDesc = item.excerpt || '';

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } else if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareDesc, url: shareUrl });
      } catch {}
    } else {
      const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + '\n\n' + shareUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
        email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent('Check out this article:\n\n' + shareTitle + '\n\n' + shareUrl)}`
      };
      if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
    
    // Track share
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/blogs/${item._id}/share`, { platform }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }).catch(() => {});
    } catch {}
  };

  // For shared posts, show original author; for regular posts, show author
  const author = item.isSharedPost ? (item.originalAuthor || item.author || {}) : (item.author || item.authorId || {});
  const authorName = author.name || author.username || item.authorName || 'Anonymous';
  const authorAvatar = author.profilePicture || author.avatar || author.profileImage || author.image || null;
  
  // Get images from multiple sources including markdown content
  const getImages = () => {
    let imgs = [];
    
    // Check for featuredImage first (most important)
    if (item.featuredImage) {
      const featImg = typeof item.featuredImage === 'string' ? item.featuredImage : item.featuredImage.url;
      if (featImg) imgs.push(featImg);
    }
    
    // Add from images array
    if (item.images?.length > 0) {
      item.images.forEach(img => {
        const imgUrl = typeof img === 'string' ? img : img.url;
        if (imgUrl && !imgs.includes(imgUrl)) imgs.push(imgUrl);
      });
    }
    
    // Add from media array
    if (item.media?.length > 0) {
      item.media.forEach(m => {
        const mediaUrl = typeof m === 'string' ? m : m.url;
        if (mediaUrl && !imgs.includes(mediaUrl)) imgs.push(mediaUrl);
      });
    }
    
    // Extract images from markdown content if no images found
    if (imgs.length === 0 && item.content) {
      const markdownImages = extractImages(item.content);
      markdownImages.forEach(img => {
        if (img.url && !imgs.includes(img.url)) imgs.push(img.url);
      });
    }
    
    return imgs;
  };
  
  const images = getImages();
  const commentsCount = item.commentsCount || item.comments?.length || 0;
  const totalReactions = reactions ? Object.values(reactions).reduce((sum, arr) => sum + (arr?.length || 0), 0) : likesCount;
  const activeReaction = Object.keys(userReactions).find(key => userReactions[key]);
  const activeReactionData = REACTIONS.find(r => r.type === activeReaction);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
      {/* Shared Post Banner */}
      {item.isSharedPost && item.sharedBy && (
        <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center gap-2 text-gray-600 text-sm">
          <Share2 className="w-4 h-4 text-purple-500" />
          <Link href={`/profile/${item.sharedBy.username || item.sharedBy._id}`}>
            <span className="font-medium text-gray-800 hover:underline cursor-pointer">
              {item.sharedBy.name || item.sharedBy.username}
            </span>
          </Link>
          <span>shared this</span>
          {item.shareComment && (
            <span className="italic text-gray-500">"{item.shareComment.slice(0, 50)}{item.shareComment.length > 50 ? '...' : ''}"</span>
          )}
        </div>
      )}
      
      {/* Pinned Badge */}
      {isPinned && (
        <div className="px-4 pt-3">
          <PinnedBadge />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
            {authorAvatar ? (
              <img src={authorAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white">{authorName[0]?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${author.username || authorId}`}>
                <span className="font-semibold text-gray-900 hover:underline cursor-pointer">{authorName}</span>
              </Link>
              {/* Follow Button */}
              {!isOwner && currentUserId && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`px-2 py-0.5 text-xs font-semibold rounded transition ${
                    isFollowing
                      ? 'text-gray-600 hover:text-gray-800'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  {followLoading ? '...' : isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>{getRelativeTime(item.createdAt)}</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
              {isLivePost && (
                <>
                  <span>·</span>
                  <span className="px-1.5 py-0.5 bg-red-500 text-white rounded text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                </>
              )}
              {isBlog && !isLivePost && (
                <>
                  <span>·</span>
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">Blog</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* More Menu */}
        <div className="relative">
          <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
          
          {showMoreMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
              <button onClick={() => { router.push(`/blog/${item._id}`); setShowMoreMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <ExternalLink className="w-4 h-4" /> Open post
              </button>
              
              {/* Pin - Admin can pin on feed, Owner can pin on their timeline */}
              {(isAdmin || isOwner) && (
                <button onClick={handlePin}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                  <Pin className="w-4 h-4" /> {isPinned ? 'Unpin' : isAdmin ? 'Pin to Feed' : 'Pin to Profile'}
                </button>
              )}
              
              {isOwner && (
                <>
                  <button onClick={() => { router.push(`/blog/edit/${item._id}`); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                    <Edit className="w-4 h-4" /> Edit post
                  </button>
                  <button onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-red-600 text-sm">
                    <Trash2 className="w-4 h-4" /> Delete post
                  </button>
                </>
              )}
              
              {!isOwner && (
                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                  <Flag className="w-4 h-4" /> Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {item.title && (
          <h3 onClick={() => router.push(isLivePost ? `/live/${item.liveStreamId || item._id}` : `/blog/${item._id}`)}
            className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-purple-600">
            {item.title}
          </h3>
        )}
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {(() => {
            // Get clean text preview (strip markdown and HTML)
            const rawContent = item.excerpt || item.content || '';
            const cleanText = stripMarkdown(rawContent.replace(/<[^>]*>/g, '')).slice(0, 400);
            return cleanText;
          })()}
          {(item.content?.length > 400 || item.excerpt?.length > 400) && (
            <span onClick={() => router.push(`/blog/${item._id}`)}
              className="text-purple-600 cursor-pointer hover:underline font-medium"> ...See more</span>
          )}
        </p>
      </div>

      {/* Watch Live Button */}
      {isLivePost && (
        <div className="px-4 pb-3">
          <button
            onClick={() => router.push(`/live/${item.liveStreamId || item._id}`)}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-pink-600 transition"
          >
            <Radio className="w-5 h-5" />
            <span>Watch Live Now</span>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </button>
        </div>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div onClick={() => router.push(`/blog/${item._id}`)}
          className={`cursor-pointer ${images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}>
          {images.slice(0, 4).map((img, idx) => (
            <div key={idx} className={`relative ${images.length === 1 ? 'aspect-video' : 'aspect-square'} bg-gray-100`}>
              <img src={img} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
            </div>
          ))}
        </div>
      )}

      {/* Reaction & Comment Count */}
      <div className="flex items-center justify-between px-4 py-2 text-gray-500 text-sm">
        <div className="flex items-center gap-1">
          {totalReactions > 0 && (
            <>
              <div className="flex -space-x-1">
                {Object.entries(reactions || {}).filter(([_, users]) => users?.length > 0).slice(0, 3).map(([type]) => (
                  <span key={type} className="text-sm">{REACTIONS.find(r => r.type === type)?.emoji}</span>
                ))}
                {totalReactions > 0 && Object.keys(reactions || {}).length === 0 && <span>👍</span>}
              </div>
              <span className="ml-1 text-gray-600">{totalReactions}</span>
            </>
          )}
        </div>
        <div className="flex gap-3 text-gray-500 text-xs">
          {item.views > 0 && <span className="flex items-center gap-1">👁️ {item.views}</span>}
          {commentsCount > 0 && <span className="flex items-center gap-1">💬 {commentsCount}</span>}
          {(item.shares?.total > 0 || item.sharesCount > 0) && <span className="flex items-center gap-1">↗️ {item.shares?.total || item.sharesCount}</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 px-4 py-1 flex items-center justify-around relative">
        {/* Like with Reactions */}
        <div className="relative flex-1"
          onMouseEnter={() => { clearTimeout(reactionTimeout.current); setShowReactions(true); }}
          onMouseLeave={() => { reactionTimeout.current = setTimeout(() => setShowReactions(false), 500); }}>
          <button onClick={(e) => handleReaction(e, 'like')}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 font-medium text-sm ${
              activeReaction ? activeReactionData?.color || 'text-blue-600' : 'text-gray-600'
            }`}>
            {activeReaction ? (
              <span className="text-lg">{activeReactionData?.emoji}</span>
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span>{activeReaction ? activeReactionData?.label : 'Like'}</span>
          </button>
          
          {showReactions && (
            <div className="absolute bottom-12 left-0 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1 flex gap-1 z-50">
              {REACTIONS.map(r => (
                <button key={r.type} onClick={(e) => handleReaction(e, r.type)}
                  className={`p-1.5 hover:scale-125 transition-transform rounded-full ${userReactions[r.type] ? 'bg-purple-100 ring-2 ring-purple-500' : ''}`}
                  title={r.label}>
                  <span className="text-xl">{r.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment */}
        <button onClick={() => setShowComments(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm">
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>

        {/* Share */}
        <div className="relative flex-1">
          <button onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          
          {showShareMenu && (
            <div className="absolute bottom-12 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
              <div className="px-3 py-1 text-xs text-gray-500 font-medium uppercase">Share</div>
              
              {/* Share to My Timeline - FIRST option */}
              <button onClick={() => { setShowShareMenu(false); setShowTimelineShare(true); }} 
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 text-purple-700 text-sm font-medium border-b border-gray-100">
                <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">📋</span> 
                Share to My Timeline
              </button>
              
              {typeof navigator !== 'undefined' && navigator.share && (
                <button onClick={() => handleShare('native')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                  <Share2 className="w-4 h-4 text-purple-600" /> Share...
                </button>
              )}
              
              <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <Copy className="w-4 h-4 text-gray-600" /> Copy link
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">f</span> Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <span className="w-4 h-4 text-sky-500">𝕏</span> Twitter / X
              </button>
              <button onClick={() => handleShare('linkedin')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <span className="w-4 h-4 rounded bg-blue-700 text-white text-xs flex items-center justify-center font-bold">in</span> LinkedIn
              </button>
              <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <span className="w-4 h-4 text-green-500">📱</span> WhatsApp
              </button>
              <button onClick={() => handleShare('telegram')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <span className="w-4 h-4 text-blue-500">✈️</span> Telegram
              </button>
              <button onClick={() => handleShare('reddit')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <span className="w-4 h-4 text-orange-500">🔴</span> Reddit
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button onClick={() => handleShare('email')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                <span className="w-4 h-4 text-gray-600">📧</span> Email
              </button>
            </div>
          )}
        </div>
      </div>

      <CommentsModal isOpen={showComments} onClose={() => setShowComments(false)} blogId={item._id} />
      <ShareToTimelineModal 
        isOpen={showTimelineShare} 
        onClose={() => setShowTimelineShare(false)} 
        item={item}
        onSuccess={() => { setIsSharedToTimeline(true); onRefresh?.(); }}
      />
    </div>
  );
}

// ==========================================
// SHARE TO TIMELINE MODAL
// ==========================================
function ShareToTimelineModal({ isOpen, onClose, item, onSuccess }) {
  const [comment, setComment] = useState('');
  const [sharing, setSharing] = useState(false);
  const [visibility, setVisibility] = useState('public');
  
  if (!isOpen) return null;
  
  const author = item.author || item.authorId || {};
  const authorName = author.name || author.username || 'Anonymous';
  const featuredImage = typeof item.featuredImage === 'string' ? item.featuredImage : item.featuredImage?.url;
  const images = item.images || [];
  const displayImage = featuredImage || images[0];
  
  const handleShare = async () => {
    setSharing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      if (!token) {
        toast.info('Please login to share to your timeline');
        setSharing(false);
        return;
      }
      
      const response = await api.post('/api/share/timeline', {
        blogId: item._id,
        comment: comment.trim(),
        visibility
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('🎉 Shared to your timeline!');
        onSuccess?.();
        onClose();
        setComment('');
      } else {
        toast.error(response.data.error || 'Failed to share');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to share');
    }
    setSharing(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Share to Timeline</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Say something about this..."
            className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
          
          {/* Post Preview */}
          <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {authorName[0]}
              </div>
              <span className="text-sm font-medium text-gray-900">{authorName}</span>
            </div>
            {item.title && <p className="text-sm font-semibold text-gray-900 mb-1">{item.title}</p>}
            {displayImage && (
              <img src={displayImage} alt="" className="w-full h-32 object-cover rounded mt-2" />
            )}
          </div>
          
          {/* Visibility */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Visibility:</span>
            <select
              value={visibility}
              onChange={e => setVisibility(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="public">🌍 Public</option>
              <option value="followers">👥 Followers Only</option>
              <option value="private">🔒 Only Me</option>
            </select>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Share Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// AI BLOG BUILDER MODAL (kept for backward compatibility)
// ==========================================
function AIBlogBuilderModal({ isOpen, onClose, onSuccess }) {
  const router = useRouter();
  
  if (!isOpen) return null;
  
  // Redirect to new AI Website Builder instead
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 text-center" onClick={e => e.stopPropagation()}>
        <Globe className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Website Builder</h3>
        <p className="text-gray-600 mb-6">Create beautiful websites with AI assistance</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button 
            onClick={() => { onClose(); router.push('/studio/sites/new'); }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
          >
            Create Website
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
  const [showAIModal, setShowAIModal] = useState(false);
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
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Try multiple endpoints
      let feedData = [];
      
      // Try /api/feed first
      try {
        const response = await api.get('/api/feed?tab=latest', { headers });
        feedData = response.data.feed || response.data.posts || response.data.items || [];
      } catch (feedError) {
        console.log('Feed endpoint failed, trying blogs:', feedError.message);
      }
      
      // If feed is empty, try /api/blogs
      if (feedData.length === 0) {
        try {
          const blogsRes = await api.get('/api/blogs?status=published&limit=50', { headers });
          feedData = blogsRes.data.data?.blogs || blogsRes.data.blogs || blogsRes.data || [];
          
          // Add contentType to each blog
          feedData = feedData.map(blog => ({
            ...blog,
            contentType: 'blog'
          }));
        } catch (blogsError) {
          console.log('Blogs endpoint also failed:', blogsError.message);
        }
      }
      
      setFeed(feedData);
    } catch (error) {
      console.error('Feed fetch error:', error);
      setFeed([]);
    }
    setLoading(false);
  };

  // Insert ads at positions 3, 8, 15, etc.
  const feedWithAds = [];
  feed.forEach((item, idx) => {
    // First item might be pinned
    if (idx === 0 && item.isPinned) {
      feedWithAds.push({ ...item, isPinnedPost: true });
    } else {
      feedWithAds.push(item);
    }
    
    // Insert ad after positions 2, 7, 14 (so after 3rd, 8th, 15th posts)
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
          <PostComposer user={user} onOpenAI={() => setShowAIModal(true)} />
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
              <button onClick={() => router.push('/studio/sites/new')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                Create with AI
              </button>
            </div>
          ) : (
            feedWithAds.map((item, idx) => (
              <React.Fragment key={item._id || `item-${idx}`}>
                {item.isAd ? (
                  <AdCard key={`ad-${item.position}`} position={item.position} />
                ) : (
                  <FeedCard 
                    item={item} 
                    currentUserId={user?._id || user?.id} 
                    isAdmin={isAdmin}
                    onRefresh={fetchFeed}
                    isPinnedPost={item.isPinnedPost}
                  />
                )}
                {/* Show Suggested Follows after 3rd post */}
                {idx === 2 && <SuggestedFollows currentUserId={user?._id || user?.id} />}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="p-3 text-purple-600"><Home className="w-6 h-6" /></button>
          </Link>
          <Link href="/groups">
            <button className="p-3 text-gray-500"><Users className="w-6 h-6" /></button>
          </Link>
          <button onClick={() => router.push('/studio')} className="p-3 bg-purple-600 rounded-full -mt-6 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </button>
          <Link href="/studio">
            <button className="p-3 text-gray-500"><Building className="w-6 h-6" /></button>
          </Link>
          <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
            <button className="p-3 text-gray-500"><Menu className="w-6 h-6" /></button>
          </Link>
        </div>
      </div>

      <AIBlogBuilderModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onSuccess={fetchFeed} />
    </>
  );
}
