// ============================================
// FILE: src/pages/feed.jsx
// CYBEV Social-Blogging Platform Feed
// Features: Stories, Greeting, Comments, Reactions, Pin, Share, Edit/Delete
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Clock, TrendingUp, Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Eye, Sparkles, Plus, Image as ImageIcon, Video, Loader2, RefreshCw, X, Send, 
  Wand2, Edit, Trash2, Pin, Flag, Copy, ExternalLink, Play, Radio, ChevronRight
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// ==========================================
// EMOJI REACTIONS CONFIG
// ==========================================
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'clap', emoji: '👏', label: 'Clap' }
];

// ==========================================
// GREETING HEADER COMPONENT
// ==========================================
function GreetingHeader({ user }) {
  const [greeting, setGreeting] = useState('');
  
  const quotes = [
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
  ];
  
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const emoji = greeting.includes('Morning') ? '🌅' : greeting.includes('Afternoon') ? '☀️' : '🌙';

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 mb-6 border border-purple-500/20">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-2xl md:text-3xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {greeting}, {user?.name || user?.username || 'Creator'}!
          </span>
        </h1>
        <span className="text-2xl">{emoji}</span>
      </div>
      <p className="text-gray-400 italic">"{quote.text}"</p>
      <p className="text-gray-500 text-sm mt-1">— {quote.author}</p>
    </div>
  );
}

// ==========================================
// STORIES STRIP COMPONENT
// ==========================================
function StoriesStrip({ user, stories = [] }) {
  const router = useRouter();
  
  // Demo stories if none provided
  const displayStories = stories.length > 0 ? stories : [
    { id: 'create', isCreate: true },
    { id: 1, user: { name: 'Prince', username: 'prince' }, hasNew: true },
    { id: 2, user: { name: 'Jane', username: 'jane' }, hasNew: true },
    { id: 3, user: { name: 'Chris', username: 'chris' }, hasNew: false },
    { id: 4, user: { name: 'Sarah', username: 'sarah' }, hasNew: true },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Stories</h3>
        <Link href="/live">
          <span className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300 cursor-pointer">
            <Radio className="w-4 h-4" /> Go Live <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {displayStories.map((story, idx) => (
          <div key={story.id} className="flex-shrink-0 text-center">
            {story.isCreate ? (
              <div 
                onClick={() => router.push('/live/start')}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <Plus className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div 
                onClick={() => router.push(`/live/${story.id}`)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 cursor-pointer hover:scale-105 transition-transform ${
                  story.hasNew 
                    ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' 
                    : 'bg-gray-600'
                }`}
              >
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {story.user?.profilePicture ? (
                    <img src={story.user.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    story.user?.name?.[0] || 'U'
                  )}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1 truncate w-16 md:w-20">
              {story.isCreate ? 'Your Story' : story.user?.name || 'User'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// QUICK ACTION BUTTONS
// ==========================================
function QuickActions({ onAIBlog, onShortBlog }) {
  const router = useRouter();
  
  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      <button 
        onClick={() => router.push('/live/start')}
        className="flex flex-col items-center gap-1 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-colors"
      >
        <Radio className="w-5 h-5 text-red-400" />
        <span className="text-xs text-gray-400">Go Live</span>
      </button>
      <button 
        onClick={() => router.push('/studio')}
        className="flex flex-col items-center gap-1 p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/20 transition-colors"
      >
        <Edit className="w-5 h-5 text-purple-400" />
        <span className="text-xs text-gray-400">Studio</span>
      </button>
      <button 
        onClick={onAIBlog}
        className="flex flex-col items-center gap-1 p-3 bg-pink-500/10 hover:bg-pink-500/20 rounded-xl border border-pink-500/20 transition-colors"
      >
        <Wand2 className="w-5 h-5 text-pink-400" />
        <span className="text-xs text-gray-400">AI Blog</span>
      </button>
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex flex-col items-center gap-1 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 transition-colors"
      >
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <span className="text-xs text-gray-400">Dashboard</span>
      </button>
    </div>
  );
}

// ==========================================
// SHORT BLOG POST COMPOSER (Blog-Socialized)
// ==========================================
function ShortBlogComposer({ onPost, user }) {
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await onPost(content);
      setContent('');
      toast.success('Short blog posted!');
    } catch {
      toast.error('Failed to post');
    }
    setPosting(false);
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.name?.[0] || user?.username?.[0] || 'U'
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a quick thought or micro-blog..."
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none min-h-[60px]"
            rows={2}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-purple-400">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-purple-400">
                <Video className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim() || posting}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Short Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// AI BLOG GENERATOR MODAL
// ==========================================
function AIBlogModal({ isOpen, onClose, onSuccess }) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('technology');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generating, setGenerating] = useState(false);

  const niches = ['technology', 'business', 'health', 'lifestyle', 'education', 'finance', 'entertainment', 'food', 'travel', 'science'];
  const tones = ['professional', 'casual', 'friendly', 'formal', 'humorous'];
  const lengths = ['short', 'medium', 'long'];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/content/create-blog', {
        topic, niche, tone, length, targetAudience: 'general'
      }, { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 });

      if (response.data.success) {
        const tokensEarned = response.data.tokensEarned || 50;
        toast.success(`Blog created! +${tokensEarned} CYBEV tokens earned!`);
        
        // Publish the blog
        const publishResponse = await api.post('/api/content/publish-blog', {
          blogData: { ...response.data.data, niche }
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (publishResponse.data.success) {
          toast.success('Blog published to your feed!');
          onClose();
          if (onSuccess) onSuccess();
          router.push(`/blog/${publishResponse.data.data.blogId}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate blog');
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AI Blog Generator
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">Generate a professional blog post with AI and earn CYBEV tokens!</p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Topic *</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of Web3 in Africa"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Niche</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none">
              {niches.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none">
                {tones.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Length</label>
              <select value={length} onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none">
                {lengths.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              You'll earn 50-100 CYBEV tokens for creating quality content!
            </p>
          </div>

          <button onClick={handleGenerate} disabled={generating || !topic.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {generating ? <><Loader2 className="w-5 h-5 animate-spin" />Generating (up to 2 min)...</> : <><Wand2 className="w-5 h-5" />Generate & Earn Tokens</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMMENTS MODAL
// ==========================================
function CommentsModal({ isOpen, onClose, blogId, blogTitle }) {
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
      // Correct endpoint: GET /api/comments/blog/:blogId
      const response = await api.get(`/api/comments/blog/${blogId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      // Don't show error toast for empty comments
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
      // Correct endpoint: POST /api/comments with blogId in body
      const response = await api.post('/api/comments', {
        content: newComment.trim(),
        blogId: blogId
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (response.data.ok || response.data.comment) {
        // Add new comment to top of list
        const newCommentData = response.data.comment;
        setComments(prev => [newCommentData, ...prev]);
        setNewComment('');
        toast.success('Comment posted!');
      }
    } catch (error) {
      console.error('Comment error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to post comment';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Comments {comments.length > 0 && `(${comments.length})`}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {comment.author?.name?.[0] || comment.authorName?.[0] || 'U'}
                </div>
                <div className="flex-1 bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{comment.author?.name || comment.authorName || 'Anonymous'}</span>
                    <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                  
                  {/* Replies if any */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l border-gray-700 space-y-2">
                      {comment.replies.map(reply => (
                        <div key={reply._id} className="flex gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {reply.author?.name?.[0] || reply.authorName?.[0] || 'U'}
                          </div>
                          <div>
                            <span className="text-white font-medium text-xs">{reply.author?.name || reply.authorName}</span>
                            <p className="text-gray-400 text-xs">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
              maxLength={1000}
            />
            <button type="submit" disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl disabled:opacity-50 transition-colors">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// FEED CARD COMPONENT (Full Featured)
// ==========================================
function FeedCard({ item, currentUserId, onRefresh }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes?.length || item.likesCount || 0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [userReactions, setUserReactions] = useState({}); // Track ALL user's reactions
  const [reactions, setReactions] = useState(item.reactions || {});
  const [isPinned, setIsPinned] = useState(item.isPinned || false);
  const reactionTimeout = useRef(null);

  const isBlog = item.contentType === 'blog' || item.title;
  const authorId = item.author?._id || item.author || item.authorId?._id || item.authorId;
  const isOwner = currentUserId && (String(authorId) === String(currentUserId));

  // Check user's existing reactions on mount
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
      setLiked(true);
      setUserReactions(prev => ({ ...prev, like: true }));
    }
  }, [currentUserId, item]);

  // Handle Emoji Reaction (ACCUMULATES - doesn't replace)
  const handleReaction = async (e, type) => {
    e.stopPropagation();
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to react');
      return;
    }

    const hadThisReaction = userReactions[type];
    
    // Optimistically update
    setUserReactions(prev => ({
      ...prev,
      [type]: !hadThisReaction
    }));
    
    if (type === 'like') {
      setLiked(!hadThisReaction);
      setLikesCount(prev => hadThisReaction ? prev - 1 : prev + 1);
    }

    try {
      const response = await api.post(`/api/blogs/${item._id}/react`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.ok) {
        setReactions(response.data.reactions || {});
        if (response.data.likeCount !== undefined) {
          setLikesCount(response.data.likeCount);
        }
      }
    } catch (error) {
      // Revert on error
      setUserReactions(prev => ({
        ...prev,
        [type]: hadThisReaction
      }));
      if (type === 'like') {
        setLiked(hadThisReaction);
        setLikesCount(prev => hadThisReaction ? prev + 1 : prev - 1);
      }
      toast.error('Failed to react');
    }
    setShowReactions(false);
  };

  // Simple Like toggle
  const handleLike = async (e) => {
    e.stopPropagation();
    handleReaction(e, 'like');
  };

  // Handle Pin
  const handlePin = async (e) => {
    e.stopPropagation();
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
      toast.error('Failed to pin post');
    }
    setShowMoreMenu(false);
  };

  // Handle Bookmark
  const handleBookmark = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to bookmark');
      return;
    }
    
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    
    try {
      await api.post('/api/bookmarks', { 
        itemId: item._id, 
        itemType: 'blog' 
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(newBookmarked ? 'Added to bookmarks' : 'Removed from bookmarks');
    } catch {
      setBookmarked(!newBookmarked);
      toast.error('Failed to update bookmark');
    }
  };

  // Share handlers
  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
    setShowMoreMenu(false);
  };

  const handleSharePlatform = async (e, platform) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/blog/${item._id}`;
    const shareTitle = item.title || 'Check this out on CYBEV!';

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/blogs/${item._id}/share`, { platform }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } else {
      const urls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
      };
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  // More menu handlers
  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowMoreMenu(!showMoreMenu);
    setShowShareMenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/blog/edit/${item._id}`);
    setShowMoreMenu(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.delete(`/api/blogs/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Post deleted!');
      if (onRefresh) onRefresh();
    } catch {
      toast.error('Failed to delete');
    }
    setShowMoreMenu(false);
  };

  const handleCardClick = () => router.push(`/blog/${item._id}`);

  const author = item.author || item.authorId || {};
  const authorName = author.name || author.username || 'Anonymous';
  const authorUsername = author.username || 'user';
  const authorAvatar = author.avatar || author.profileImage || author.profilePicture;
  const images = item.images || item.media || (item.featuredImage ? [item.featuredImage] : []);
  const commentsCount = item.commentsCount || item.comments?.length || 0;

  // Calculate total reactions
  const totalReactions = reactions ? Object.values(reactions).reduce((sum, arr) => sum + (arr?.length || 0), 0) : 0;

  // Get top 3 reaction types for display
  const topReactions = Object.entries(reactions || {})
    .filter(([_, users]) => users?.length > 0)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);

  return (
    <div onClick={handleCardClick}
      className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-5 cursor-pointer hover:border-purple-500/40 transition-colors relative">
      
      {/* Pinned Badge */}
      {isPinned && (
        <div className="absolute top-3 right-14 flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
          <Pin className="w-3 h-3" /> Pinned
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {authorName[0]?.toUpperCase() || 'A'}
            </div>
          )}
          <div>
            <p className="text-white font-medium">{authorName}</p>
            <p className="text-gray-400 text-sm">
              @{authorUsername} · {new Date(item.createdAt).toLocaleDateString()}
              {isBlog && <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">Blog</span>}
            </p>
          </div>
        </div>
        
        {/* 3-Dots Menu */}
        <div className="relative">
          <button onClick={handleMoreClick} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          
          {showMoreMenu && (
            <div className="absolute right-0 top-10 bg-gray-800 border border-purple-500/30 rounded-xl py-2 shadow-2xl z-50 min-w-[160px]"
              onClick={e => e.stopPropagation()}>
              <button onClick={e => { e.stopPropagation(); window.open(`/blog/${item._id}`, '_blank'); setShowMoreMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm">
                <ExternalLink className="w-4 h-4" /> Open in new tab
              </button>
              
              {isOwner && (
                <>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button onClick={handlePin}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm">
                    <Pin className="w-4 h-4" /> {isPinned ? 'Unpin Post' : 'Pin to Profile'}
                  </button>
                  <button onClick={handleEdit}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/20 text-red-400 text-sm">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </>
              )}
              
              {!isOwner && (
                <>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button onClick={e => { e.stopPropagation(); toast.success('Report submitted'); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/20 text-red-400 text-sm">
                    <Flag className="w-4 h-4" /> Report
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {item.title && <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>}
      <p className="text-gray-300 mb-4 line-clamp-3">
        {item.excerpt || item.content?.replace(/<[^>]*>/g, '').slice(0, 280)}
        {(item.content?.length > 280) && <span className="text-purple-400 ml-1">Read more</span>}
      </p>

      {/* Images */}
      {images.length > 0 && (
        <div className={`rounded-xl overflow-hidden mb-4 ${images.length > 1 ? 'grid grid-cols-2 gap-1' : ''}`}>
          {images.slice(0, 4).map((img, idx) => (
            <div key={idx} className={`relative ${images.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
              <img src={img} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
            </div>
          ))}
        </div>
      )}

      {/* Reaction Summary */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
          <div className="flex -space-x-1">
            {topReactions.map(([type]) => (
              <span key={type} className="text-base bg-gray-700 rounded-full p-0.5">{REACTIONS.find(r => r.type === type)?.emoji}</span>
            ))}
          </div>
          <span>{totalReactions} reaction{totalReactions !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center gap-1">
          {/* Like/React Button with hover reactions */}
          <div className="relative"
            onMouseEnter={() => { clearTimeout(reactionTimeout.current); setShowReactions(true); }}
            onMouseLeave={() => { reactionTimeout.current = setTimeout(() => setShowReactions(false), 300); }}>
            <button onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                Object.keys(userReactions).length > 0 ? 'text-pink-500' : 'text-gray-400 hover:bg-gray-700'
              }`}>
              {Object.keys(userReactions).length > 0 ? (
                <span className="text-lg">{REACTIONS.find(r => userReactions[r.type])?.emoji || '👍'}</span>
              ) : (
                <Heart className="w-5 h-5" />
              )}
              <span>{likesCount}</span>
            </button>
            
            {/* Emoji Picker */}
            {showReactions && (
              <div className="absolute bottom-12 left-0 bg-gray-800 border border-purple-500/30 rounded-full px-2 py-1 shadow-2xl z-50 flex gap-1"
                onClick={e => e.stopPropagation()}>
                {REACTIONS.map(r => (
                  <button key={r.type} onClick={e => handleReaction(e, r.type)}
                    className={`p-1.5 hover:scale-125 transition-transform rounded-full ${
                      userReactions[r.type] ? 'bg-purple-500/30 ring-2 ring-purple-400' : 'hover:bg-gray-700'
                    }`}
                    title={r.label}>
                    <span className="text-xl">{r.emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comment Button */}
          <button onClick={e => { e.stopPropagation(); setShowComments(true); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{commentsCount}</span>
          </button>

          {/* Views */}
          <div className="flex items-center gap-2 px-3 py-2 text-gray-400">
            <Eye className="w-5 h-5" />
            <span>{item.views || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}>
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
          
          {/* Share */}
          <div className="relative">
            <button onClick={handleShareClick} className="p-2 text-gray-400 hover:text-purple-400 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            
            {showShareMenu && (
              <div className="absolute right-0 bottom-12 bg-gray-800 border border-purple-500/30 rounded-xl py-2 shadow-2xl z-50 min-w-[160px]"
                onClick={e => e.stopPropagation()}>
                <p className="px-4 py-1 text-xs text-gray-500">Share to:</p>
                {[
                  { p: 'copy', icon: <Copy className="w-4 h-4" />, label: 'Copy Link' },
                  { p: 'twitter', icon: <span className="w-4 font-bold">𝕏</span>, label: 'Twitter' },
                  { p: 'facebook', icon: <span className="w-4 text-blue-500 font-bold">f</span>, label: 'Facebook' },
                  { p: 'whatsapp', icon: <span className="w-4">💬</span>, label: 'WhatsApp' },
                  { p: 'telegram', icon: <span className="w-4">✈️</span>, label: 'Telegram' }
                ].map(({ p, icon, label }) => (
                  <button key={p} onClick={e => handleSharePlatform(e, p)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-purple-500/20 text-gray-300 text-sm">
                    {icon} {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal isOpen={showComments} onClose={() => setShowComments(false)} blogId={item._id} blogTitle={item.title} />
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
  const [activeTab, setActiveTab] = useState('latest');
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }
    
    // Check if logged in
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      // Don't redirect, just show public feed
    }
    
    fetchFeed();
  }, [activeTab]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/feed?tab=${activeTab}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFeed(response.data.feed || response.data.posts || response.data.items || []);
    } catch {
      // Fallback to blogs
      try {
        const blogsRes = await api.get('/api/blogs');
        setFeed(blogsRes.data.data?.blogs || blogsRes.data.blogs || []);
      } catch {}
    }
    setLoading(false);
  };

  const handleShortBlogPost = async (content) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to post');
      router.push('/auth/login');
      return;
    }
    
    await api.post('/api/posts', { content, type: 'short-blog' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchFeed();
  };

  const tabs = [
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'following', label: 'Following', icon: Users }
  ];

  return (
    <AppLayout>
      <Head>
        <title>Feed - CYBEV Social Blogging</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Greeting Header */}
        {user && <GreetingHeader user={user} />}

        {/* Stories Strip */}
        <StoriesStrip user={user} />

        {/* Quick Actions */}
        <QuickActions onAIBlog={() => setShowAIModal(true)} />

        {/* Short Blog Composer */}
        {user && <ShortBlogComposer onPost={handleShortBlogPost} user={user} />}

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : feed.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-purple-500/20">
            <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 mb-4">Be the first to share your thoughts!</p>
            <button
              onClick={() => setShowAIModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30"
            >
              Create Your First Blog
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {feed.map((item) => (
              <FeedCard
                key={item._id}
                item={item}
                currentUserId={user?._id || user?.id}
                onRefresh={fetchFeed}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && feed.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={fetchFeed}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Feed
            </button>
          </div>
        )}
      </div>

      {/* AI Blog Modal */}
      <AIBlogModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onSuccess={fetchFeed} />
    </AppLayout>
  );
}
