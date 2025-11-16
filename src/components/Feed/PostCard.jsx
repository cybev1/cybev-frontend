import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Eye, Flame, Coins, Sparkles, Pin, Radio, TrendingUp, Award
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function PostCard({ post, isAIGenerated = false, isPinned = false, isLive = false }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);

  const reactions = [
    { emoji: '❤️', name: 'love', color: 'text-red-500' },
    { emoji: '😍', name: 'wow', color: 'text-pink-500' },
    { emoji: '🔥', name: 'fire', color: 'text-orange-500' },
    { emoji: '😊', name: 'happy', color: 'text-yellow-500' },
    { emoji: '🎉', name: 'celebrate', color: 'text-purple-500' },
    { emoji: '💯', name: 'perfect', color: 'text-green-500' }
  ];

  const handleReaction = (reaction) => {
    setSelectedReaction(reaction);
    setLiked(true);
    setShowReactions(false);
    // TODO: API call to save reaction
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary || post.content?.substring(0, 100),
        url: window.location.origin + `/blog/${post._id}`
      });
    } else {
      alert('📤 Share functionality coming soon!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 overflow-hidden hover:border-purple-300 hover:shadow-2xl transition-all shadow-xl"
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
                  @{post.authorName || 'Anonymous'}
                </span>
                {isAIGenerated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-full text-xs font-semibold text-gray-600 border border-purple-200">
                    <Sparkles className="w-3 h-3" />
                    AI
                  </span>
                )}
                {isPinned && (
                  <Pin className="w-4 h-4 text-yellow-400" />
                )}
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

          {/* More Options */}
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
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

        {/* Post Content Preview - Always show */}
        {post.content && (
          <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-3">
            {stripHtml(post.content)}
          </p>
        )}
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div 
          className="relative aspect-video md:aspect-[2/1] cursor-pointer overflow-hidden"
          onClick={() => router.push(`/blog/${post._id || post.slug}`)}
        >
          <Image
            src={post.featuredImage}
            alt={post.title || 'Post image'}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {isAIGenerated && (
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Generated in 30s
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2">
          {post.tags.slice(0, 5).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-600/20 rounded-lg text-xs font-semibold text-gray-600 hover:bg-purple-100 cursor-pointer transition-colors"
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

      {/* Stats Bar - Only show if AI generated */}
      {isAIGenerated && (post.viralityScore || post.tokensEarned) && (
        <div className="px-4 py-2 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs md:text-sm">
            {post.viralityScore && (
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-white">{post.viralityScore}/100</span>
                <span className="text-orange-300">Virality</span>
              </div>
            )}
            {post.tokensEarned && (
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold text-white">{post.tokensEarned}</span>
                <span className="text-yellow-300">tokens</span>
              </div>
            )}
            {post.viralityScore >= 90 && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-gray-600 font-semibold">Top Performer</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-t border-white/10">
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
            <span>{formatNumber(post.comments || 0)}</span>
          </div>
          {post.trending && (
            <div className="flex items-center gap-1 ml-auto text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">Trending</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          {/* Like with Reactions */}
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
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border border-white/20'
                  : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20 hover:border-purple-200'
              }`}
            >
              {selectedReaction ? (
                <span className="text-xl">{selectedReaction.emoji}</span>
              ) : (
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              )}
              <span className="hidden sm:inline">
                {liked ? 'Liked' : 'Like'}
              </span>
            </motion.button>

            {/* Reaction Picker */}
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute bottom-full left-0 mb-2 p-2 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl flex gap-1 z-50"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {reactions.map((reaction) => (
                  <motion.button
                    key={reaction.name}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReaction(reaction)}
                    className="text-2xl hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-white/10 text-white hover:bg-white/20 border-2 border-white/20 hover:border-purple-200 transition-all shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Comment</span>
          </motion.button>

          {/* Share */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-white/10 text-white hover:bg-white/20 border-2 border-white/20 hover:border-purple-200 transition-all shadow-lg"
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
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white border border-white/20'
                : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20 hover:border-purple-200'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
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
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
