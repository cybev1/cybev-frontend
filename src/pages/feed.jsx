// ============================================
// FILE: src/pages/feed.jsx
// PATH: cybev-frontend/src/pages/feed.jsx
// PURPOSE: Social feed with functional engagement features
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Send,
  Image,
  Video,
  Smile,
  X,
  Eye,
  TrendingUp,
  Clock,
  ThumbsUp,
  Flame,
  Laugh,
  Frown,
  Angry
} from 'lucide-react';
import api from '@/lib/api';

// Reaction emoji mapping
const REACTIONS = {
  like: { icon: ThumbsUp, emoji: '👍', label: 'Like', color: 'text-blue-400' },
  love: { icon: Heart, emoji: '❤️', label: 'Love', color: 'text-red-400' },
  fire: { icon: Flame, emoji: '🔥', label: 'Fire', color: 'text-orange-400' },
  haha: { icon: Laugh, emoji: '😂', label: 'Haha', color: 'text-yellow-400' },
  wow: { icon: null, emoji: '😮', label: 'Wow', color: 'text-yellow-400' },
  sad: { icon: Frown, emoji: '😢', label: 'Sad', color: 'text-blue-400' },
  angry: { icon: Angry, emoji: '😠', label: 'Angry', color: 'text-red-400' }
};

// Post Card Component
function PostCard({ post, user, onUpdate }) {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [reactions, setReactions] = useState(post.reactions || {});
  const [userReactions, setUserReactions] = useState(post.userReactions || {});
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes?.length || 0);
  const [viewCount, setViewCount] = useState(post.views || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [isLiked, setIsLiked] = useState(post.hasLiked || post.isLiked || false);
  const [loading, setLoading] = useState(false);

  // Track view on mount
  useEffect(() => {
    trackView();
  }, []);

  const trackView = async () => {
    try {
      const response = await api.post(`/api/reactions/view/${post._id}`);
      if (response.data.ok && response.data.isNewView) {
        setViewCount(response.data.views);
      }
    } catch (error) {
      console.log('View tracking failed');
    }
  };

  const handleReaction = async (type = 'like') => {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const wasReacted = userReactions[type];
    setUserReactions(prev => ({ ...prev, [type]: !wasReacted }));
    
    if (type === 'like') {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/reactions/post/${post._id}`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setReactions(response.data.reactions || {});
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      // Revert on error
      setUserReactions(prev => ({ ...prev, [type]: wasReacted }));
      if (type === 'like') {
        setIsLiked(isLiked);
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      }
      console.error('Reaction failed:', error);
    } finally {
      setLoading(false);
      setShowReactions(false);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (isBookmarked) {
        await api.delete(`/api/bookmarks/${post._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/api/bookmarks', { postId: post._id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      setIsBookmarked(isBookmarked); // Revert
      console.error('Bookmark failed:', error);
    }
  };

  const handleShare = async (platform) => {
    const postUrl = `${window.location.origin}/blog/${post._id}`;
    
    // Track share
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/reactions/share/${post._id}`, { platform }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShareCount(prev => prev + 1);
    } catch (error) {
      console.log('Share tracking failed');
    }

    // Share action
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        alert('Link copied!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title || '')}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + postUrl)}`, '_blank');
        break;
    }
    
    setShowShareMenu(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      text: comment,
      author: user,
      createdAt: new Date().toISOString()
    };

    setComments(prev => [newComment, ...prev]);
    setComment('');

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/comments/${post._id}`, { text: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Comment failed:', error);
    }
  };

  // Calculate total reactions
  const totalReactions = Object.values(reactions).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <Link href={`/profile/${post.author?.username || post.authorUsername}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {post.author?.name?.[0] || post.authorName?.[0] || 'U'}
            </div>
            <div>
              <p className="text-white font-medium hover:text-purple-400 transition-colors">
                {post.author?.name || post.authorName || 'Unknown'}
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
        <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Post Content */}
      <Link href={`/blog/${post._id}`}>
        <div className="px-4 pb-3 cursor-pointer">
          {post.title && (
            <h3 className="text-lg font-bold text-white mb-2 hover:text-purple-400 transition-colors">
              {post.title}
            </h3>
          )}
          <p className="text-gray-300 line-clamp-3">
            {post.excerpt || post.content?.substring(0, 200) || post.text}
          </p>
        </div>
      </Link>

      {/* Post Image */}
      {post.coverImage && (
        <Link href={`/blog/${post._id}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-96 object-cover cursor-pointer"
          />
        </Link>
      )}

      {/* Stats Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-400 border-t border-purple-500/10">
        <div className="flex items-center gap-4">
          {totalReactions > 0 && (
            <span className="flex items-center gap-1">
              <span className="flex -space-x-1">
                {Object.entries(reactions).slice(0, 3).map(([type, users]) => (
                  users?.length > 0 && (
                    <span key={type} className="text-sm">{REACTIONS[type]?.emoji}</span>
                  )
                ))}
              </span>
              {totalReactions}
            </span>
          )}
          {viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {viewCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {comments.length > 0 && (
            <span>{comments.length} comments</span>
          )}
          {shareCount > 0 && (
            <span>{shareCount} shares</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-purple-500/10 flex items-center justify-between">
        {/* Like Button with Reactions */}
        <div className="relative">
          <button
            onClick={() => handleReaction('like')}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isLiked ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount || 'Like'}</span>
          </button>

          {/* Reactions Popup */}
          {showReactions && (
            <div 
              className="absolute bottom-full left-0 mb-2 bg-gray-900 rounded-full px-2 py-1 flex gap-1 border border-purple-500/20 shadow-xl"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {Object.entries(REACTIONS).map(([type, data]) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className={`p-2 hover:scale-125 transition-transform rounded-full hover:bg-purple-500/20 ${
                    userReactions[type] ? 'bg-purple-500/20 scale-110' : ''
                  }`}
                  title={data.label}
                >
                  <span className="text-xl">{data.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            showComments ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length || 'Comment'}</span>
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-purple-500/10 hover:text-white transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>

          {/* Share Menu */}
          {showShareMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-xl p-2 border border-purple-500/20 shadow-xl min-w-[150px]">
              {[
                { id: 'copy', label: '📋 Copy Link' },
                { id: 'twitter', label: '🐦 Twitter/X' },
                { id: 'facebook', label: '📘 Facebook' },
                { id: 'whatsapp', label: '💬 WhatsApp' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleShare(item.id)}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-lg transition-all ${
            isBookmarked ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-purple-500/10">
          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex gap-2 py-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-800/50 border border-purple-500/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="p-2 bg-purple-500 rounded-full text-white disabled:opacity-50 hover:bg-purple-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.author?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 bg-gray-800/30 rounded-xl px-3 py-2">
                  <p className="text-white text-sm font-medium">{c.author?.name || 'User'}</p>
                  <p className="text-gray-300 text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Create Post Component
function CreatePost({ user, onPostCreated }) {
  const [content, setContent] = useState('');
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/feed', { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setContent('');
        setShowFullEditor(false);
        if (onPostCreated) onPostCreated(response.data.post);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4 mb-6">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {user?.name?.[0] || 'U'}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setShowFullEditor(true)}
            placeholder="What's on your mind?"
            rows={showFullEditor ? 4 : 1}
            className="w-full bg-gray-800/50 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
          />
          
          {showFullEditor && (
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button type="button" className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-green-400" />
                </button>
                <button type="button" className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-blue-400" />
                </button>
                <button type="button" className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-yellow-400" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFullEditor(false);
                    setContent('');
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Feed Page
export default function Feed() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest'); // latest, trending, following

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

    fetchPosts();
  }, [router, filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Fetch from feed endpoint
      const response = await api.get(`/api/feed?sort=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setPosts(response.data.posts || response.data.feed || []);
      }
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      // Try blogs as fallback
      try {
        const blogsResponse = await api.get('/blogs?limit=20');
        if (blogsResponse.data.ok) {
          setPosts(blogsResponse.data.blogs || []);
        }
      } catch (blogError) {
        console.error('Failed to fetch blogs:', blogError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <AppLayout>
      <Head>
        <title>Feed - CYBEV</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'latest', label: 'Latest', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'following', label: 'Following', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Create Post */}
        <CreatePost user={user} onPostCreated={handlePostCreated} />

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} user={user} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
