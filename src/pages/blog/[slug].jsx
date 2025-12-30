// ============================================
// FILE: src/pages/blog/[slug].jsx
// PATH: cybev-frontend/src/pages/blog/[slug].jsx
// PURPOSE: Blog detail page with Open Graph meta tags
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Clock,
  ArrowLeft,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import api from '@/lib/api';

// Reactions
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' }
];

// Strip HTML for meta description
function stripHtml(html) {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  return text.replace(/\s+/g, ' ').trim();
}

// Extract first image from HTML
function extractFirstImage(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match ? match[1] : null;
}

// Share Modal Component
function ShareModal({ isOpen, onClose, url, title, image }) {
  if (!isOpen) return null;

  const shareLinks = [
    {
      name: 'Copy Link',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      action: () => {
        navigator.clipboard.writeText(url);
        alert('Link copied!');
        onClose();
      },
      color: 'bg-gray-600'
    },
    {
      name: 'Twitter / X',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=CYBEV,Web3`),
      color: 'bg-black'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
      color: 'bg-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
      color: 'bg-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n\n' + url)}`),
      color: 'bg-green-500'
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`),
      color: 'bg-sky-500'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Share this article</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          {image && (
            <img src={image} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
          )}
          <p className="text-white font-medium line-clamp-2">{title}</p>
          <p className="text-gray-400 text-sm truncate">{url}</p>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {shareLinks.map((link) => (
            <button
              key={link.name}
              onClick={link.action}
              className={`${link.color} text-white p-3 rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
            >
              {link.icon}
              <span className="text-xs">{link.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Generate meta data
  const getMetaImage = () => {
    if (!blog) return 'https://cybev.io/og-default.png';
    return blog.featuredImage || blog.coverImage || blog.image || extractFirstImage(blog.content) || 'https://cybev.io/og-default.png';
  };

  const getMetaDescription = () => {
    if (!blog) return 'Read this article on CYBEV - The Web3 Content Platform';
    const desc = blog.excerpt || stripHtml(blog.content);
    return desc.substring(0, 160);
  };

  const getCanonicalUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://cybev.io/blog/${slug}`;
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/blogs/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.ok || response.data.success) {
        setBlog(response.data.blog);
        setComments(response.data.blog.comments || []);
      } else {
        // Try /blogs endpoint
        const response2 = await api.get(`/blogs/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (response2.data.ok || response2.data.success || response2.data.blog) {
          setBlog(response2.data.blog || response2.data);
          setComments(response2.data.blog?.comments || response2.data.comments || []);
        } else {
          setError('Blog not found');
        }
      }
    } catch (err) {
      console.error('Fetch blog error:', err);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/reactions/blog/${blog._id}`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}

    if (userReaction === type) {
      setUserReaction(null);
    } else {
      setUserReaction(type);
    }
    setShowReactions(false);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await api.post(`/api/comments/${blog._id}`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newCommentObj = response.data.comment || {
        _id: Date.now(),
        content: newComment,
        author: { name: userData.name || 'You' },
        createdAt: new Date()
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');
    } catch (e) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setComments([...comments, {
        _id: Date.now(),
        content: newComment,
        author: { name: userData.name || 'You' },
        createdAt: new Date()
      }]);
      setNewComment('');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getReactionEmoji = () => {
    if (!userReaction) return null;
    return REACTIONS.find(r => r.type === userReaction)?.emoji || '👍';
  };

  const author = blog?.author || blog?.authorId || {};
  const authorName = author.name || blog?.authorName || 'Anonymous';

  if (loading) {
    return (
      <AppLayout>
        <Head>
          <title>Loading... - CYBEV</title>
        </Head>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (error || !blog) {
    return (
      <AppLayout>
        <Head>
          <title>Blog Not Found - CYBEV</title>
        </Head>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The blog you\'re looking for doesn\'t exist.'}</p>
          <Link href="/feed">
            <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Back to Feed
            </button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        {/* Primary Meta Tags */}
        <title>{blog.title} - CYBEV</title>
        <meta name="title" content={`${blog.title} - CYBEV`} />
        <meta name="description" content={getMetaDescription()} />
        <link rel="canonical" href={getCanonicalUrl()} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:image" content={getMetaImage()} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CYBEV" />
        <meta property="article:author" content={authorName} />
        <meta property="article:published_time" content={blog.createdAt} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={getCanonicalUrl()} />
        <meta property="twitter:title" content={blog.title} />
        <meta property="twitter:description" content={getMetaDescription()} />
        <meta property="twitter:image" content={getMetaImage()} />
        <meta name="twitter:creator" content="@cybev_io" />
      </Head>

      <article className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/feed">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Feed
          </button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Author & Meta */}
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/profile/${author.username || 'user'}`}>
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                  {author.avatar ? (
                    <img src={author.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    authorName[0]?.toUpperCase() || 'A'
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">{authorName}</p>
                  <p className="text-gray-400 text-sm">@{author.username || 'user'}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4 text-gray-400 text-sm ml-auto">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views || 0} views
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {(blog.featuredImage || blog.coverImage) && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={blog.featuredImage || blog.coverImage}
                alt={blog.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none mb-8
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-img:rounded-xl prose-img:mx-auto
            prose-blockquote:border-purple-500 prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl
            prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-purple-500/20 mb-8">
          <div className="flex items-center justify-around">
            {/* Like */}
            <div className="relative">
              <button
                onClick={() => handleReaction('like')}
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setTimeout(() => setShowReactions(false), 200)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                  userReaction ? 'text-purple-400' : 'text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                {userReaction ? (
                  <span className="text-xl">{getReactionEmoji()}</span>
                ) : (
                  <Heart className="w-5 h-5" />
                )}
                <span>{userReaction ? REACTIONS.find(r => r.type === userReaction)?.label : 'Like'}</span>
              </button>

              {showReactions && (
                <div
                  className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-full px-3 py-2 flex gap-1 shadow-xl border border-gray-700 z-20"
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  {REACTIONS.map((r) => (
                    <button
                      key={r.type}
                      onClick={() => handleReaction(r.type)}
                      className="text-2xl hover:scale-125 transition-transform p-1"
                      title={r.label}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comment */}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-700/50 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length} Comments</span>
            </button>

            {/* Share */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-700/50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                bookmarked ? 'text-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-yellow-400' : ''}`} />
              <span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Comments ({comments.length})</h3>

          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim() || submittingComment}
                className="p-2.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50"
              >
                {submittingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={comment._id || idx} className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                    {(comment.author?.name || comment.user?.name || comment.userName || 'U')[0]}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-900 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">
                          {comment.author?.name || comment.user?.name || comment.userName || 'User'}
                        </p>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </article>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={getCanonicalUrl()}
        title={blog.title}
        image={getMetaImage()}
      />
    </AppLayout>
  );
}
