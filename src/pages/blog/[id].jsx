// ============================================
// FILE: src/pages/blog/[id].jsx
// PATH: cybev-frontend/src/pages/blog/[id].jsx
// PURPOSE: Blog detail page with SERVER-SIDE Open Graph meta tags
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
  ArrowLeft,
  Send,
  X,
  Loader2,
  Calendar
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
    { name: 'Copy Link', action: () => { navigator.clipboard.writeText(url); alert('Link copied!'); onClose(); }, color: 'bg-gray-600', icon: '📋' },
    { name: 'Twitter', action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`), color: 'bg-black', icon: '𝕏' },
    { name: 'Facebook', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`), color: 'bg-blue-600', icon: 'f' },
    { name: 'LinkedIn', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`), color: 'bg-blue-700', icon: 'in' },
    { name: 'WhatsApp', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`), color: 'bg-green-500', icon: '📱' },
    { name: 'Telegram', action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`), color: 'bg-sky-500', icon: '✈️' }
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
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          {image && <img src={image} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />}
          <p className="text-white font-medium line-clamp-2">{title}</p>
          <p className="text-gray-400 text-sm truncate">{url}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {shareLinks.map((link) => (
            <button key={link.name} onClick={link.action} className={`${link.color} text-white p-3 rounded-xl flex flex-col items-center gap-2 hover:opacity-90`}>
              <span className="text-xl">{link.icon}</span>
              <span className="text-xs">{link.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ⭐ SERVER-SIDE RENDERING for proper OG tags
export async function getServerSideProps(context) {
  const { id } = context.params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cybev.io';
  
  let blog = null;

  try {
    const response = await fetch(`${baseUrl}/api/blogs/${id}`);
    const data = await response.json();
    if (data.ok || data.success || data.blog) {
      blog = data.blog || data;
    }
  } catch (err) {
    console.error('Failed to fetch blog:', err);
  }

  // Try posts endpoint if blog not found
  if (!blog) {
    try {
      const response = await fetch(`${baseUrl}/api/posts/${id}`);
      const data = await response.json();
      if (data.ok || data.success || data.post) {
        blog = data.post || data;
      }
    } catch (err) {}
  }

  // Generate OG data from the fetched blog
  const rawContent = blog?.content || blog?.body || '';
  const description = blog?.excerpt || stripHtml(rawContent).substring(0, 160) || 'Read this article on CYBEV';
  
  // Image priority: featuredImage > coverImage > image > images[0] > extracted from content > default
  const image = blog?.featuredImage || 
                blog?.coverImage || 
                blog?.image || 
                (blog?.images && blog?.images[0]) ||
                extractFirstImage(rawContent) || 
                `${siteUrl}/og-default.png`;

  const author = blog?.author || blog?.authorId || {};
  const authorName = author?.name || blog?.authorName || 'CYBEV User';

  return {
    props: {
      blog: blog || null,
      ogData: {
        title: blog?.title || 'Blog Post',
        description,
        image,
        url: `${siteUrl}/blog/${id}`,
        authorName
      },
      blogId: id
    }
  };
}

export default function BlogDetail({ blog: initialBlog, ogData, blogId }) {
  const router = useRouter();
  const [blog, setBlog] = useState(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comments, setComments] = useState(initialBlog?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!initialBlog && blogId) {
      fetchBlog();
    }
  }, [blogId, initialBlog]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/blogs/${blogId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.ok || response.data.success || response.data.blog) {
        setBlog(response.data.blog || response.data);
        setComments(response.data.blog?.comments || response.data.comments || []);
      }
    } catch (err) {
      console.error('Fetch blog error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type) => {
    if (userReaction === type) setUserReaction(null);
    else setUserReaction(type);
    setShowReactions(false);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setComments([...comments, { _id: Date.now(), content: newComment, author: { name: userData.name || 'You' }, createdAt: new Date() }]);
    setNewComment('');
    setSubmittingComment(false);
  };

  const author = blog?.author || blog?.authorId || {};
  const authorName = author.name || blog?.authorName || 'Anonymous';

  if (loading) {
    return (
      <AppLayout>
        <Head><title>Loading... - CYBEV</title></Head>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!blog) {
    return (
      <AppLayout>
        <Head><title>Blog Not Found - CYBEV</title></Head>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Not Found</h1>
          <Link href="/feed"><button className="px-6 py-3 bg-purple-500 text-white rounded-lg">Back to Feed</button></Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        {/* ⭐ These OG tags are now rendered server-side! */}
        <title>{ogData.title} - CYBEV</title>
        <meta name="description" content={ogData.description} />
        <link rel="canonical" href={ogData.url} />

        {/* Open Graph / Facebook - THE KEY FOR SOCIAL SHARING */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={ogData.url} />
        <meta property="og:title" content={ogData.title} />
        <meta property="og:description" content={ogData.description} />
        <meta property="og:image" content={ogData.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CYBEV" />
        <meta property="article:author" content={ogData.authorName} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogData.title} />
        <meta name="twitter:description" content={ogData.description} />
        <meta name="twitter:image" content={ogData.image} />
      </Head>

      <article className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/feed">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back to Feed
          </button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{blog.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/profile/${author.username || 'user'}`}>
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                  {author.avatar ? <img src={author.avatar} alt="" className="w-full h-full object-cover" /> : authorName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{authorName}</p>
                  <p className="text-gray-400 text-sm">@{author.username || 'user'}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4 text-gray-400 text-sm ml-auto">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views || 0}</span>
            </div>
          </div>

          {/* Featured Image */}
          {ogData.image && !ogData.image.includes('og-default') && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img src={ogData.image} alt={blog.title} className="w-full max-h-[500px] object-cover" />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-purple-500/20 mb-8">
          <div className="flex items-center justify-around">
            <div className="relative">
              <button onClick={() => handleReaction('like')} onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setTimeout(() => setShowReactions(false), 200)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${userReaction ? 'text-purple-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                {userReaction ? <span className="text-xl">{REACTIONS.find(r => r.type === userReaction)?.emoji}</span> : <Heart className="w-5 h-5" />}
                <span>{userReaction ? REACTIONS.find(r => r.type === userReaction)?.label : 'Like'}</span>
              </button>
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-full px-3 py-2 flex gap-1 shadow-xl border border-gray-700 z-20"
                  onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
                  {REACTIONS.map((r) => (
                    <button key={r.type} onClick={() => handleReaction(r.type)} className="text-2xl hover:scale-125 transition-transform p-1">{r.emoji}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-700/50">
              <MessageCircle className="w-5 h-5" /><span>{comments.length}</span>
            </button>
            <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-700/50">
              <Share2 className="w-5 h-5" /><span>Share</span>
            </button>
            <button onClick={() => setBookmarked(!bookmarked)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${bookmarked ? 'text-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-yellow-400' : ''}`} /><span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        <section className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6">Comments ({comments.length})</h3>
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 flex gap-2">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Write a comment..." className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none" />
              <button onClick={handleComment} disabled={!newComment.trim() || submittingComment} className="p-2.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50">
                {submittingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {comments.length === 0 ? <p className="text-gray-500 text-center py-8">No comments yet.</p> : comments.map((c, i) => (
              <div key={c._id || i} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">{(c.author?.name || 'U')[0]}</div>
                <div className="flex-1 bg-gray-900 rounded-2xl px-4 py-3">
                  <p className="text-white font-medium">{c.author?.name || 'User'}</p>
                  <p className="text-gray-300">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} url={ogData.url} title={ogData.title} image={ogData.image} />
    </AppLayout>
  );
}
