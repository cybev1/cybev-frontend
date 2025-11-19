import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import axios from 'axios';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  TrendingUp,
  Sparkles,
  User,
  Tag,
  ArrowLeft
} from 'lucide-react';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/${slug}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    setLiked(!liked);
    // TODO: Call API to like/unlike
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.content?.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-12 h-12 text-purple-600" />
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  if (!blog) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-800 mb-4">Blog Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find this blog post.</p>
            <button
              onClick={() => router.push('/feed')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white hover:opacity-90 transition-opacity"
            >
              ← Back to Feed
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        {/* Header with back button */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => router.push('/feed')}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Feed
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-8 md:p-12 shadow-xl mb-6"
          >
            {/* Category & AI Badge */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {blog.category && (
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold text-sm">
                  {blog.category}
                </span>
              )}
              {blog.isAIGenerated && (
                <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Generated
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {blog.title}
              </span>
            </h1>

            {/* Author & Meta Info */}
            <div className="flex items-center gap-6 flex-wrap mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                  {blog.authorName?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="font-semibold text-gray-800">@{blog.authorName || 'Anonymous'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>

              {blog.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime} min read</span>
                </div>
              )}

              {blog.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
              <div className="text-center">
                <div className="text-2xl font-black text-purple-600">
                  {blog.viralityScore || 0}/100
                </div>
                <div className="text-xs text-gray-600 font-semibold">Virality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-yellow-600">
                  {blog.tokensEarned || 0} 🪙
                </div>
                <div className="text-xs text-gray-600 font-semibold">Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-pink-600">
                  {blog.likeCount || blog.likes?.length || 0} ❤️
                </div>
                <div className="text-xs text-gray-600 font-semibold">Likes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all ${
                  liked
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-purple-100 hover:border-purple-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-white text-gray-700 border-2 border-purple-100 hover:border-purple-300 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-3 rounded-2xl font-bold transition-all ${
                  bookmarked
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-purple-100 hover:border-purple-300'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-8 md:p-12 shadow-xl mb-6"
          >
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-black prose-headings:bg-gradient-to-r prose-headings:from-purple-600 prose-headings:to-pink-600 prose-headings:bg-clip-text prose-headings:text-transparent
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-li:my-1
                prose-img:rounded-2xl prose-img:shadow-lg
                prose-code:bg-purple-100 prose-code:text-purple-700 prose-code:px-2 prose-code:py-1 prose-code:rounded
              "
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </motion.div>

          {/* Comments Section (Placeholder) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-8 shadow-xl"
          >
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              Comments
            </h3>
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">Comments coming soon!</p>
              <p className="text-sm">Be the first to share your thoughts</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
