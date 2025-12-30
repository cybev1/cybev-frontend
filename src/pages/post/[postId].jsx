// ============================================
// FILE: src/pages/post/[postId].jsx
// PATH: cybev-frontend/src/pages/post/[postId].jsx
// PURPOSE: Post detail page with SERVER-SIDE Open Graph meta tags
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

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' }
];

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// Share Modal
function ShareModal({ isOpen, onClose, url, title, image }) {
  if (!isOpen) return null;

  const shareLinks = [
    { name: 'Copy', action: () => { navigator.clipboard.writeText(url); alert('Copied!'); onClose(); }, color: 'bg-gray-600', icon: '📋' },
    { name: 'Twitter', action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`), color: 'bg-black', icon: '𝕏' },
    { name: 'Facebook', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`), color: 'bg-blue-600', icon: 'f' },
    { name: 'LinkedIn', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`), color: 'bg-blue-700', icon: 'in' },
    { name: 'WhatsApp', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`), color: 'bg-green-500', icon: '📱' },
    { name: 'Telegram', action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`), color: 'bg-sky-500', icon: '✈️' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Share Post</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          {image && <img src={image} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />}
          <p className="text-white font-medium line-clamp-2">{title}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {shareLinks.map((link) => (
            <button key={link.name} onClick={link.action} className={`${link.color} text-white p-3 rounded-xl flex flex-col items-center gap-2`}>
              <span className="text-xl">{link.icon}</span>
              <span className="text-xs">{link.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ⭐ SERVER-SIDE RENDERING - This is the key for Facebook/Twitter to see the OG tags!
export async function getServerSideProps(context) {
  const { postId } = context.params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cybev.io';
  
  let post = null;

  try {
    const response = await fetch(`${baseUrl}/api/posts/${postId}`);
    const data = await response.json();
    if (data.ok || data.success || data.post) {
      post = data.post || data;
    }
  } catch (err) {
    console.error('Failed to fetch post:', err);
  }

  // Generate OG data from fetched post
  const content = post?.content || post?.body || post?.text || '';
  const title = post?.title || stripHtml(content).substring(0, 60) || 'Post on CYBEV';
  const description = post?.excerpt || stripHtml(content).substring(0, 160) || 'Check out this post on CYBEV';
  
  // Image priority: first image in images array > image field > featuredImage > default
  const image = (post?.images && post?.images.length > 0 && post?.images[0]) ||
                post?.image ||
                post?.featuredImage ||
                `${siteUrl}/og-default.png`;

  const author = post?.author || post?.authorId || {};
  const authorName = author?.name || post?.authorName || 'CYBEV User';

  return {
    props: {
      post: post || null,
      ogData: {
        title,
        description,
        image,
        url: `${siteUrl}/post/${postId}`,
        authorName
      },
      postId
    }
  };
}

export default function PostDetail({ post: initialPost, ogData, postId }) {
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comments, setComments] = useState(initialPost?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialPost && postId) {
      fetchPost();
    }
  }, [postId, initialPost]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/posts/${postId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.ok || response.data.success || response.data.post) {
        setPost(response.data.post || response.data);
        setComments(response.data.post?.comments || response.data.comments || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = (type) => {
    setUserReaction(userReaction === type ? null : type);
    setShowReactions(false);
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setComments([...comments, { _id: Date.now(), content: newComment, author: { name: user.name || 'You' }, createdAt: new Date() }]);
    setNewComment('');
    setSubmitting(false);
  };

  const author = post?.author || post?.authorId || {};
  const authorName = author.name || post?.authorName || 'Anonymous';
  const images = post?.images || (post?.image ? [post.image] : []);

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

  if (!post) {
    return (
      <AppLayout>
        <Head><title>Post Not Found - CYBEV</title></Head>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <Link href="/feed"><button className="px-6 py-3 bg-purple-500 text-white rounded-lg">Back to Feed</button></Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        {/* ⭐ Server-side rendered OG tags for social sharing */}
        <title>{ogData.title} - CYBEV</title>
        <meta name="description" content={ogData.description} />
        <link rel="canonical" href={ogData.url} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={ogData.url} />
        <meta property="og:title" content={ogData.title} />
        <meta property="og:description" content={ogData.description} />
        <meta property="og:image" content={ogData.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CYBEV" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogData.title} />
        <meta name="twitter:description" content={ogData.description} />
        <meta name="twitter:image" content={ogData.image} />
      </Head>

      <article className="max-w-3xl mx-auto px-4 py-6">
        {/* Back */}
        <Link href="/feed">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back to Feed
          </button>
        </Link>

        {/* Post Card */}
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden">
          {/* Author Header */}
          <div className="p-4 flex items-center gap-3">
            <Link href={`/profile/${author.username || 'user'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer">
                {author.avatar ? <img src={author.avatar} alt="" className="w-full h-full object-cover" /> : authorName[0]?.toUpperCase()}
              </div>
            </Link>
            <div className="flex-1">
              <p className="text-white font-semibold">{authorName}</p>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                @{author.username || 'user'} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            {post.title && <h1 className="text-2xl font-bold text-white mb-3">{post.title}</h1>}
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content || post.body || post.text}</p>
          </div>

          {/* Images */}
          {images.length > 0 && (
            <div className={`grid gap-1 ${images.length === 1 ? '' : images.length === 2 ? 'grid-cols-2' : images.length === 3 ? 'grid-cols-2' : 'grid-cols-2'}`}>
              {images.slice(0, 4).map((img, i) => (
                <div key={i} className={`relative ${images.length === 3 && i === 0 ? 'row-span-2' : ''}`}>
                  <img src={img} alt="" className="w-full h-64 object-cover" />
                  {i === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{images.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="px-4 py-3 border-t border-gray-700/50 flex items-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {post.views || 0} views</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.likes || 0} likes</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {comments.length} comments</span>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-t border-gray-700/50 flex items-center justify-around">
            <div className="relative">
              <button onClick={() => handleReaction('like')} onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setTimeout(() => setShowReactions(false), 200)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${userReaction ? 'text-purple-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                {userReaction ? <span className="text-xl">{REACTIONS.find(r => r.type === userReaction)?.emoji}</span> : <Heart className="w-5 h-5" />}
                <span className="hidden sm:inline">{userReaction ? REACTIONS.find(r => r.type === userReaction)?.label : 'Like'}</span>
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
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50">
              <MessageCircle className="w-5 h-5" /><span className="hidden sm:inline">Comment</span>
            </button>
            <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50">
              <Share2 className="w-5 h-5" /><span className="hidden sm:inline">Share</span>
            </button>
            <button onClick={() => setBookmarked(!bookmarked)} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bookmarked ? 'text-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'}`}>
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-yellow-400' : ''}`} /><span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6 bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Comments ({comments.length})</h3>
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 flex gap-2">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Write a comment..." className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none" />
              <button onClick={handleComment} disabled={!newComment.trim() || submitting} className="p-2.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
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
        </div>
      </article>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} url={ogData.url} title={ogData.title} image={ogData.image} />
    </AppLayout>
  );
}
