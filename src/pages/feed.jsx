// ============================================
// FILE: src/pages/feed.jsx
// CYBEV Social-Blogging Platform - Facebook-Style Feed
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Users, Video, Bell, Menu, Search, MessageCircle, Plus,
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Send,
  Image as ImageIcon, Smile, Camera, X, Edit, Trash2, Pin, Flag,
  Copy, ExternalLink, Globe, Loader2, Sparkles, Radio, Play
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Emoji Reactions
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-500' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-orange-500' }
];

// ==========================================
// TOP NAVIGATION BAR (Facebook-style)
// ==========================================
function TopNavBar({ user }) {
  const router = useRouter();
  
  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed">
          <h1 className="text-2xl font-bold text-purple-600 cursor-pointer">CYBEV</h1>
        </Link>
        
        {/* Center Nav Icons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/feed">
            <button className="px-8 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-purple-600 border-b-2 border-purple-600">
              <Home className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/discover">
            <button className="px-8 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
              <Users className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/live">
            <button className="px-8 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 relative">
              <Video className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/groups">
            <button className="px-8 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
              <Users className="w-6 h-6" />
            </button>
          </Link>
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/studio')}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            onClick={() => router.push('/search')}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            onClick={() => router.push('/messages')}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 relative"
          >
            <MessageCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
          </button>
          <button 
            onClick={() => router.push('/notifications')}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            onClick={() => router.push('/settings')}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// POST COMPOSER (Facebook-style)
// ==========================================
function PostComposer({ user, onOpenAI }) {
  const router = useRouter();
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
      <div className="flex items-center gap-3">
        {/* Profile Picture */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
          ) : (
            user?.name?.[0] || 'U'
          )}
        </div>
        
        {/* Input */}
        <button 
          onClick={() => router.push('/studio')}
          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-4 py-2.5 text-left text-gray-500 transition-colors"
        >
          Write a short blog or article...
        </button>
        
        {/* Gallery Icon */}
        <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-green-500" />
        </button>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => router.push('/live/start')}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-sm font-medium"
        >
          <Radio className="w-5 h-5 text-red-500" />
          <span>Live video</span>
        </button>
        <button 
          onClick={() => router.push('/studio')}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-sm font-medium"
        >
          <ImageIcon className="w-5 h-5 text-green-500" />
          <span>Photo/video</span>
        </button>
        <button 
          onClick={onOpenAI}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-sm font-medium"
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>AI Blog</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// STORIES SECTION (Facebook-style rectangular)
// ==========================================
function StoriesSection({ user, stories = [] }) {
  const router = useRouter();
  
  // Demo stories
  const displayStories = [
    { id: 'create', isCreate: true, user: user },
    { id: 1, user: { name: 'Deborah Toh', profilePicture: null }, image: '/api/placeholder/150/250', hasNew: true },
    { id: 2, user: { name: 'Sonia Mds', profilePicture: null }, image: '/api/placeholder/150/250', hasNew: true },
    { id: 3, user: { name: 'Prince D', profilePicture: null }, image: '/api/placeholder/150/250', hasNew: false },
    { id: 4, user: { name: 'Jane Doe', profilePicture: null }, image: '/api/placeholder/150/250', hasNew: true },
    ...stories
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {displayStories.map((story, idx) => (
          <div 
            key={story.id} 
            onClick={() => story.isCreate ? router.push('/stories/create') : router.push(`/stories/${story.id}`)}
            className="flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden relative cursor-pointer group"
          >
            {story.isCreate ? (
              /* Create Story Card */
              <div className="w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {/* User's profile image as background */}
                <div className="h-3/4 bg-gradient-to-br from-purple-400 to-pink-400 relative">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {user?.name?.[0] || 'U'}
                    </div>
                  )}
                </div>
                {/* Create button and text */}
                <div className="h-1/4 flex flex-col items-center justify-center bg-white dark:bg-gray-800 relative">
                  <div className="absolute -top-4 w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white mt-2">Create story</span>
                </div>
              </div>
            ) : (
              /* User Story Card */
              <div className="w-full h-full relative">
                {/* Story Image/Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  idx % 3 === 0 ? 'from-orange-400 to-red-500' : 
                  idx % 3 === 1 ? 'from-blue-400 to-purple-500' : 
                  'from-green-400 to-teal-500'
                }`}>
                  {story.image && (
                    <img src={story.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Profile Picture Ring */}
                <div className="absolute top-3 left-3">
                  <div className={`w-10 h-10 rounded-full p-0.5 ${story.hasNew ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gray-400'}`}>
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-0.5">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                        {story.user?.profilePicture ? (
                          <img src={story.user.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          story.user?.name?.[0] || 'U'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Name */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-semibold truncate drop-shadow-lg">
                    {story.user?.name || 'User'}
                  </p>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            )}
          </div>
        ))}
      </div>
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
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Comments</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
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
                  {comment.author?.name?.[0] || comment.authorName?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author?.name || comment.authorName}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.content}</p>
                  </div>
                  <div className="flex gap-4 mt-1 ml-3 text-xs text-gray-500">
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    <button className="font-semibold hover:underline">Like</button>
                    <button className="font-semibold hover:underline">Reply</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
// FEED POST CARD (Facebook-style)
// ==========================================
function FeedCard({ item, currentUserId, onRefresh }) {
  const router = useRouter();
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [reactions, setReactions] = useState(item.reactions || {});
  const [likesCount, setLikesCount] = useState(item.likes?.length || item.likesCount || 0);
  const [isPinned, setIsPinned] = useState(item.isPinned || false);
  const reactionTimeout = useRef(null);

  const isBlog = item.contentType === 'blog' || item.title;
  const authorId = item.author?._id || item.author || item.authorId?._id || item.authorId;
  const isOwner = currentUserId && (String(authorId) === String(currentUserId));

  // Check existing reactions
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

  // Handle reaction (accumulates)
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
        if (response.data.userReactions) {
          setUserReactions(response.data.userReactions);
        }
      }
    } catch {
      setUserReactions(prev => ({ ...prev, [type]: hadThisReaction }));
      if (type === 'like') {
        setLikesCount(prev => hadThisReaction ? prev + 1 : prev - 1);
      }
    }
    setShowReactions(false);
  };

  // Handle actions
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

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } else {
      const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
      };
      window.open(urls[platform], '_blank');
    }
    setShowShareMenu(false);
  };

  const author = item.author || item.authorId || {};
  const authorName = author.name || author.username || 'Anonymous';
  const authorAvatar = author.avatar || author.profileImage || author.profilePicture;
  const images = item.images || item.media || (item.featuredImage ? [item.featuredImage] : []);
  const commentsCount = item.commentsCount || item.comments?.length || 0;
  const totalReactions = reactions ? Object.values(reactions).reduce((sum, arr) => sum + (arr?.length || 0), 0) : likesCount;

  // Get active reaction emoji
  const activeReaction = Object.keys(userReactions).find(key => userReactions[key]);
  const activeReactionData = REACTIONS.find(r => r.type === activeReaction);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4">
      {/* Header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
            {authorAvatar ? (
              <img src={authorAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              authorName[0]?.toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${author.username || authorId}`}>
                <span className="font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">{authorName}</span>
              </Link>
              {isPinned && <Pin className="w-4 h-4 text-purple-500" />}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        
        {/* More Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
          
          {showMoreMenu && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] z-50">
              <button onClick={() => { router.push(`/blog/${item._id}`); setShowMoreMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <ExternalLink className="w-5 h-5" /> Open post
              </button>
              {isOwner && (
                <>
                  <button onClick={handlePin}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Pin className="w-5 h-5" /> {isPinned ? 'Unpin' : 'Pin to profile'}
                  </button>
                  <button onClick={() => { router.push(`/blog/edit/${item._id}`); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Edit className="w-5 h-5" /> Edit post
                  </button>
                  <button onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
                    <Trash2 className="w-5 h-5" /> Delete post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {item.title && (
          <h3 
            onClick={() => router.push(`/blog/${item._id}`)}
            className="text-lg font-bold text-gray-900 dark:text-white mb-2 cursor-pointer hover:underline"
          >
            {item.title}
          </h3>
        )}
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {item.excerpt || item.content?.replace(/<[^>]*>/g, '').slice(0, 400)}
          {item.content?.length > 400 && (
            <span 
              onClick={() => router.push(`/blog/${item._id}`)}
              className="text-gray-500 cursor-pointer hover:underline"
            > ...See more</span>
          )}
        </p>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div 
          onClick={() => router.push(`/blog/${item._id}`)}
          className={`cursor-pointer ${images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}
        >
          {images.slice(0, 4).map((img, idx) => (
            <div key={idx} className={`relative ${images.length === 1 ? 'aspect-video' : 'aspect-square'} bg-gray-200 dark:bg-gray-800`}>
              <img src={img} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
              {idx === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">+{images.length - 4}</span>
                </div>
              )}
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
                  <span key={type} className="text-base">{REACTIONS.find(r => r.type === type)?.emoji}</span>
                ))}
                {totalReactions > 0 && Object.keys(reactions || {}).length === 0 && <span>👍</span>}
              </div>
              <span className="ml-1">{totalReactions}</span>
            </>
          )}
        </div>
        <div className="flex gap-4">
          {commentsCount > 0 && <span>{commentsCount} comments</span>}
          {item.shares?.total > 0 && <span>{item.shares.total} shares</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-1 flex items-center justify-around relative">
        {/* Like Button with Reactions */}
        <div 
          className="relative flex-1"
          onMouseEnter={() => { clearTimeout(reactionTimeout.current); setShowReactions(true); }}
          onMouseLeave={() => { reactionTimeout.current = setTimeout(() => setShowReactions(false), 500); }}
        >
          <button 
            onClick={(e) => handleReaction(e, 'like')}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm ${
              activeReaction ? activeReactionData?.color || 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {activeReaction ? (
              <span className="text-lg">{activeReactionData?.emoji}</span>
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span>{activeReaction ? activeReactionData?.label : 'Like'}</span>
          </button>
          
          {/* Reaction Picker */}
          {showReactions && (
            <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1 flex gap-1 z-50">
              {REACTIONS.map(r => (
                <button 
                  key={r.type}
                  onClick={(e) => handleReaction(e, r.type)}
                  className={`p-1.5 hover:scale-125 transition-transform rounded-full ${userReactions[r.type] ? 'bg-gray-200 dark:bg-gray-700 ring-2 ring-purple-500' : ''}`}
                  title={r.label}
                >
                  <span className="text-2xl">{r.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button 
          onClick={() => setShowComments(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 font-semibold text-sm"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <div className="relative flex-1">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 font-semibold text-sm"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          
          {showShareMenu && (
            <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[150px] z-50">
              <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                <Copy className="w-4 h-4" /> Copy link
              </button>
              <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                <span className="w-4 text-blue-600 font-bold">f</span> Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                <span className="w-4 font-bold">𝕏</span> Twitter
              </button>
              <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                <span className="w-4">💬</span> WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal isOpen={showComments} onClose={() => setShowComments(false)} blogId={item._id} />
    </div>
  );
}

// ==========================================
// AI BLOG MODAL
// ==========================================
function AIBlogModal({ isOpen, onClose, onSuccess }) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('technology');
  const [generating, setGenerating] = useState(false);

  const niches = ['technology', 'business', 'health', 'lifestyle', 'education', 'finance', 'entertainment'];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/content/create-blog', {
        topic, niche, tone: 'professional', length: 'medium', targetAudience: 'general'
      }, { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 });

      if (response.data.success) {
        toast.success(`Blog created! +${response.data.tokensEarned || 50} CYBEV earned!`);
        
        const publishResponse = await api.post('/api/content/publish-blog', {
          blogData: { ...response.data.data, niche }
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (publishResponse.data.success) {
          toast.success('Published!');
          onClose();
          if (onSuccess) onSuccess();
          router.push(`/blog/${publishResponse.data.data.blogId}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" /> AI Blog Generator
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Future of Web3 in Africa"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select value={niche} onChange={e => setNiche(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500">
              {niches.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
            </select>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
            <p className="text-purple-700 dark:text-purple-300 text-sm">✨ Earn 50-100 CYBEV tokens for quality content!</p>
          </div>
          
          <button onClick={handleGenerate} disabled={generating || !topic.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {generating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Blog</>}
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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch {}
    }
    
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      // Allow viewing feed without login
    }
    
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/feed?tab=latest', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFeed(response.data.feed || response.data.posts || response.data.items || []);
    } catch {
      try {
        const blogsRes = await api.get('/api/blogs');
        setFeed(blogsRes.data.data?.blogs || blogsRes.data.blogs || []);
      } catch {}
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>CYBEV - Social Blogging Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
        {/* Top Navigation */}
        <TopNavBar user={user} />

        {/* Main Content */}
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          {/* Post Composer */}
          <PostComposer user={user} onOpenAI={() => setShowAIModal(true)} />
          
          {/* Stories */}
          <StoriesSection user={user} />

          {/* Feed */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : feed.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share something!</p>
              <button onClick={() => setShowAIModal(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                Create with AI
              </button>
            </div>
          ) : (
            feed.map(item => (
              <FeedCard key={item._id} item={item} currentUserId={user?._id || user?.id} onRefresh={fetchFeed} />
            ))
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="p-3 text-purple-600"><Home className="w-6 h-6" /></button>
          </Link>
          <Link href="/discover">
            <button className="p-3 text-gray-500"><Users className="w-6 h-6" /></button>
          </Link>
          <button onClick={() => router.push('/studio')} className="p-3 bg-purple-600 rounded-full -mt-6 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </button>
          <Link href="/live">
            <button className="p-3 text-gray-500"><Video className="w-6 h-6" /></button>
          </Link>
          <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
            <button className="p-3 text-gray-500"><Menu className="w-6 h-6" /></button>
          </Link>
        </div>
      </div>

      {/* AI Blog Modal */}
      <AIBlogModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onSuccess={fetchFeed} />
    </>
  );
}
