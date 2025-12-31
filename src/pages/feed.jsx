// ============================================
// FILE: src/pages/feed.jsx
// COMPLETE: Pin, Emoji Reactions, Comments, Like, Share, Edit/Delete
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import { 
  Clock, TrendingUp, Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Eye, Sparkles, Loader2, X, Edit, Trash2, Flag, Copy, ExternalLink, Pin, Send
} from 'lucide-react';

// Emoji Reactions Config
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

// AI Blog Generator Modal
function AIBlogModal({ isOpen, onClose }) {
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
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        toast.success(`Blog created! You earned ${response.data.tokensEarned || 50} tokens!`);
        
        const publishResponse = await api.post('/api/content/publish-blog', {
          blogData: { ...response.data.data, niche }
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (publishResponse.data.success) {
          toast.success('Blog published!');
          onClose();
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

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Topic *</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of AI in Healthcare"
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
          <button onClick={handleGenerate} disabled={generating || !topic.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {generating ? <><Loader2 className="w-5 h-5 animate-spin" />Generating...</> : <><Sparkles className="w-5 h-5" />Generate Blog</>}
          </button>
        </div>
        {generating && <p className="text-center text-gray-400 text-sm mt-4">This may take up to 2 minutes...</p>}
      </div>
    </div>
  );
}

// Comments Modal
function CommentsModal({ isOpen, onClose, blogId, blogTitle }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && blogId) {
      fetchComments();
    }
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
        content: newComment,
        blogId
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.ok) {
        setComments(prev => [response.data.comment, ...prev]);
        setNewComment('');
        toast.success('Comment posted!');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Comments</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
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
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {comment.author?.name?.[0] || comment.authorName?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{comment.author?.name || comment.authorName}</span>
                    <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
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

// Feed Post Card with ALL Features
function FeedCard({ item, onLike, onBookmark, currentUserId, onDelete, onRefresh }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes?.length || item.likesCount || 0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [reactions, setReactions] = useState(item.reactions || {});
  const [isPinned, setIsPinned] = useState(item.isPinned || false);
  const reactionRef = useRef(null);
  const reactionTimeout = useRef(null);

  const isBlog = item.contentType === 'blog' || item.title;
  const authorId = item.author?._id || item.author || item.authorId?._id || item.authorId;
  const isOwner = currentUserId && (String(authorId) === String(currentUserId));

  // Check if user already reacted
  useEffect(() => {
    if (currentUserId && item.reactions) {
      for (const [type, users] of Object.entries(item.reactions)) {
        if (users?.some(id => String(id) === String(currentUserId))) {
          setUserReaction(type);
          break;
        }
      }
    }
    if (currentUserId && item.likes?.some(id => String(id) === String(currentUserId))) {
      setLiked(true);
    }
  }, [currentUserId, item]);

  // Handle Like (simple toggle)
  const handleLike = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to like');
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await api.post(`/api/blogs/${item._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
    }
  };

  // Handle Emoji Reaction
  const handleReaction = async (e, type) => {
    e.stopPropagation();
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to react');
      return;
    }

    const wasReacted = userReaction === type;
    setUserReaction(wasReacted ? null : type);
    setShowReactions(false);

    try {
      const response = await api.post(`/api/blogs/${item._id}/react`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.ok) {
        setReactions(response.data.reactions);
        setLikesCount(response.data.likeCount);
      }
    } catch (error) {
      setUserReaction(wasReacted ? type : null);
      toast.error('Failed to react');
    }
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
    } catch (error) {
      toast.error('Failed to pin post');
    }
    setShowMoreMenu(false);
  };

  // Handle Bookmark
  const handleBookmark = async (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    try {
      await onBookmark(item._id, 'blog');
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch {
      setBookmarked(bookmarked);
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
    if (!confirm('Are you sure you want to delete this?')) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.delete(`/api/blogs/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted successfully!');
      if (onDelete) onDelete(item._id);
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

  // Get dominant reaction
  const getDominantReaction = () => {
    if (!reactions || Object.keys(reactions).length === 0) return null;
    let max = 0, dominant = null;
    for (const [type, users] of Object.entries(reactions)) {
      if (users?.length > max) {
        max = users.length;
        dominant = type;
      }
    }
    return dominant;
  };

  const dominantReaction = getDominantReaction();
  const totalReactions = reactions ? Object.values(reactions).reduce((sum, arr) => sum + (arr?.length || 0), 0) : 0;

  return (
    <div onClick={handleCardClick}
      className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-5 cursor-pointer hover:border-purple-500/40 transition-colors relative">
      
      {/* Pinned Badge */}
      {isPinned && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
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
            {Object.entries(reactions).filter(([_, users]) => users?.length > 0).slice(0, 3).map(([type]) => (
              <span key={type} className="text-base">{REACTIONS.find(r => r.type === type)?.emoji}</span>
            ))}
          </div>
          <span>{totalReactions}</span>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center gap-1">
          {/* Like/React Button */}
          <div className="relative" ref={reactionRef}
            onMouseEnter={() => { clearTimeout(reactionTimeout.current); setShowReactions(true); }}
            onMouseLeave={() => { reactionTimeout.current = setTimeout(() => setShowReactions(false), 300); }}>
            <button onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${liked || userReaction ? 'text-pink-500' : 'text-gray-400 hover:bg-gray-700'}`}>
              {userReaction ? (
                <span className="text-lg">{REACTIONS.find(r => r.type === userReaction)?.emoji}</span>
              ) : (
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              )}
              <span>{likesCount}</span>
            </button>
            
            {/* Emoji Picker */}
            {showReactions && (
              <div className="absolute bottom-12 left-0 bg-gray-800 border border-purple-500/30 rounded-full px-2 py-1 shadow-2xl z-50 flex gap-1"
                onClick={e => e.stopPropagation()}>
                {REACTIONS.map(r => (
                  <button key={r.type} onClick={e => handleReaction(e, r.type)}
                    className={`p-1.5 hover:scale-125 transition-transform rounded-full ${userReaction === r.type ? 'bg-purple-500/30' : 'hover:bg-gray-700'}`}
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

// Main Feed Component
export default function Feed() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('latest');
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch {}
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
      try {
        const blogsRes = await api.get('/api/blogs');
        setFeed(blogsRes.data.data?.blogs || blogsRes.data.blogs || []);
      } catch {}
    }
    setLoading(false);
  };

  const handleLike = async (id) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) return toast.error('Please login');
    await api.post(`/api/blogs/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
  };

  const handleBookmark = async (id) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) return toast.error('Please login');
    await api.post('/api/bookmarks', { itemId: id, itemType: 'blog' }, { headers: { Authorization: `Bearer ${token}` } });
  };

  const handleDelete = (id) => setFeed(prev => prev.filter(item => item._id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Post Composer */}
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-4 mb-6">
          <div className="flex items-center gap-3">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
            )}
            <input type="text" placeholder="What's on your mind?" onClick={() => router.push('/post/create')} readOnly
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none cursor-pointer" />
            <button onClick={() => setShowAIModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30">
              <Sparkles className="w-4 h-4" /> AI Blog
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { id: 'latest', label: 'Latest', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'following', label: 'Following', icon: Users }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
        ) : feed.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-400">No posts yet. Be the first!</p></div>
        ) : (
          <div className="space-y-4">
            {feed.map(item => (
              <FeedCard key={item._id} item={item} onLike={handleLike} onBookmark={handleBookmark}
                currentUserId={user?._id || user?.id} onDelete={handleDelete} onRefresh={fetchFeed} />
            ))}
          </div>
        )}
      </div>

      <AIBlogModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </div>
  );
}
