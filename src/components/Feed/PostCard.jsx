import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark,
  Eye, Flame, Coins, Sparkles, Pin, Radio, TrendingUp, Award,
  Edit, Trash2, MoreHorizontal, X, Save, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function PostCard({ post, isAIGenerated = false, isPinned = false, isLive = false, onUpdate, onDelete }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [loading, setLoading] = useState(false);

  const reactions = [
    { emoji: '❤️', name: 'love', color: 'text-red-500' },
    { emoji: '😮', name: 'wow', color: 'text-pink-500' },
    { emoji: '🔥', name: 'fire', color: 'text-orange-500' },
    { emoji: '😊', name: 'happy', color: 'text-yellow-500' },
    { emoji: '🎉', name: 'celebrate', color: 'text-purple-500' },
    { emoji: '💯', name: 'perfect', color: 'text-green-500' }
  ];

  // Check if current user owns this post
  const getCurrentUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user._id;
      }
    } catch (e) {
      console.error('Failed to parse user:', e);
    }
    return null;
  };

  const currentUserId = getCurrentUserId();
  const isOwner = post.authorId?._id === currentUserId || 
                  post.authorId === currentUserId;

  const handleReaction = (reaction) => {
    setSelectedReaction(reaction);
    setLiked(true);
    setShowReactions(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title || 'Check out this post on CYBEV',
        text: post.content?.substring(0, 100) || '',
        url: window.location.origin + `/post/${post._id}`
      });
    } else {
      alert('🔗 Share functionality coming soon!');
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      alert('Content cannot be empty!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io/api';

      const response = await fetch(`${API_URL}/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: editContent })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Post updated successfully!');
        setShowEditModal(false);
        if (onUpdate) onUpdate(data.post);
        window.location.reload(); // Refresh to show updated post
      } else {
        throw new Error(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('❌ Edit error:', error);
      alert('Failed to update post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io/api';

      const response = await fetch(`${API_URL}/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Post deleted successfully!');
        if (onDelete) onDelete(post._id);
        window.location.reload(); // Refresh feed
      } else {
        throw new Error(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Failed to delete post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get display image - check both featuredImage and images array
  const getDisplayImage = () => {
    if (post.featuredImage) {
      return post.featuredImage;
    }
    if (post.images && post.images.length > 0) {
      return post.images[0].url;
    }
    return null;
  };

  const displayImage = getDisplayImage();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border-2 border-purple-100 overflow-hidden hover:border-purple-300 hover:shadow-2xl transition-all shadow-xl"
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            {/* Author Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                {post.authorName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 truncate">
                    {post.authorName || 'Anonymous'}
                  </span>
                  {isAIGenerated && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-full text-xs font-semibold text-gray-600 border border-purple-200">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </span>
                  )}
                  {isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                  {isLive && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded-full text-xs font-bold text-white animate-pulse">
                      <Radio className="w-3 h-3" />
                      LIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{formatTime(post.createdAt || new Date())}</span>
                  {post.readTime && (
                    <>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* More Options - Owner Only */}
            {isOwner && (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>

                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl border-2 border-purple-200 shadow-xl overflow-hidden z-50 min-w-[150px]"
                  >
                    <button
                      onClick={() => {
                        setShowEditModal(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-purple-50 transition-colors w-full text-left"
                    >
                      <Edit className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-gray-700">Edit</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left border-t border-gray-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-gray-700">Delete</span>
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Post Title */}
          {post.title && (
            <h3 
              className="text-xl md:text-2xl font-black mb-3 cursor-pointer hover:opacity-80 transition-opacity line-clamp-2"
              onClick={() => router.push(`/blog/${post._id || post.slug}`)}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h3>
          )}

          {/* Post Content Preview */}
          {post.content && (
            <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-3">
              {stripHtml(post.content)}
            </p>
          )}
        </div>

        {/* Featured Image - Auto-fit with color-matched background */}
        {displayImage && (
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
              <Image
                src={displayImage}
                alt={post.title || 'Post image'}
                fill
                className="object-contain" /* Changed from cover to contain */
                unoptimized
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            {isAIGenerated && (
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1.5 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                AI Generated
              </div>
            )}
          </div>
        )}

        {/* Multiple Images Grid */}
        {post.images && post.images.length > 1 && (
          <div className={`px-4 pb-4 grid gap-2 ${
            post.images.length === 2 ? 'grid-cols-2' : 
            post.images.length === 3 ? 'grid-cols-3' : 
            'grid-cols-2'
          }`}>
            {post.images.slice(1, 5).map((img, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                <Image
                  src={img.url}
                  alt={img.alt || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {index === 3 && post.images.length > 5 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-2xl font-bold">
                    +{post.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2">
            {post.tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-200 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 5 && (
              <span className="px-2 py-1 text-xs text-purple-400">
                +{post.tags.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Stats Bar */}
        {(post.viralityScore || post.tokensEarned) && (
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs md:text-sm">
              {post.viralityScore && (
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="font-semibold text-gray-800">{post.viralityScore}/100</span>
                  <span className="text-gray-600">Virality</span>
                </div>
              )}
              {post.tokensEarned && (
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-gray-800">{post.tokensEarned}</span>
                  <span className="text-gray-600">tokens</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
            {post.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(post.views || 0)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(post.likes?.length || post.likeCount || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(post.comments?.length || post.commentCount || 0)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Like */}
            <div className="relative flex-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setTimeout(() => setShowReactions(false), 200)}
                onClick={() => {
                  if (!liked) {
                    handleReaction(reactions[0]);
                  } else {
                    setLiked(false);
                    setSelectedReaction(null);
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                  liked
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                {selectedReaction ? (
                  <span className="text-xl">{selectedReaction.emoji}</span>
                ) : (
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                )}
                <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
              </motion.button>

              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute bottom-full left-0 mb-2 p-2 bg-white backdrop-blur-lg rounded-xl border-2 border-purple-200 shadow-xl flex gap-1 z-50"
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  {reactions.map((reaction) => (
                    <motion.button
                      key={reaction.name}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReaction(reaction)}
                      className="text-2xl hover:bg-purple-50 rounded-lg p-1.5 transition-colors"
                    >
                      {reaction.emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Comment */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('💬 Comments coming soon!')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 transition-all shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Comment</span>
            </motion.button>

            {/* Share */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 transition-all shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </motion.button>

            {/* Bookmark */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-3 rounded-2xl font-bold transition-all shadow-lg ${
                bookmarked
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[200px] text-lg resize-none border-2 border-purple-100 rounded-xl p-4 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                maxLength={5000}
              />
              <div className="text-sm text-right text-gray-500 mt-2">
                {5000 - editContent.length} characters remaining
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// Helper functions
function formatTime(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffMs = now - postDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return postDate.toLocaleDateString();
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function stripHtml(html) {
  if (typeof window === 'undefined') return html;
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
