// ============================================
// FILE: src/pages/blog/[id].jsx
// Blog Detail Page with SSR for Social Sharing
// FIXED: Server-side rendering for OG meta tags
// FIXED: Replaced BookmarkCheck with Bookmark (fill style)
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Heart, MessageSquare, Share2, Bookmark, Clock, Eye,
  Copy, Twitter, Facebook, Linkedin, Send, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

// ==========================================
// MARKDOWN UTILITIES
// ==========================================
function markdownToHtml(markdown) {
  if (!markdown) return '';
  let html = markdown;
  
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
    '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-md" loading="lazy" /><figcaption class="text-center text-gray-500 text-sm mt-2 italic">$1</figcaption></figure>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" class="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold text-gray-800 mt-6 mb-3">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 rounded-r-lg italic text-gray-700">$1</blockquote>');
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="ml-6 list-disc text-gray-700 mb-2">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal text-gray-700 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-6 list-disc[^>]*>.*?<\/li>\n?)+/g, '<ul class="my-4">$&</ul>');
  html = html.replace(/(<li class="ml-6 list-decimal[^>]*>.*?<\/li>\n?)+/g, '<ol class="my-4">$&</ol>');
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-2 py-0.5 rounded text-sm">$1</code>');
  html = html.replace(/^(\-{3,}|\*{3,})$/gm, '<hr class="my-8 border-gray-300" />');
  
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol') || 
        para.startsWith('<blockquote') || para.startsWith('<pre') || para.startsWith('<hr') ||
        para.startsWith('<figure') || para.startsWith('<li')) return para;
    if (para) return `<p class="text-gray-700 leading-relaxed mb-4">${para}</p>`;
    return '';
  }).join('\n');
  
  html = html.replace(/([^>])\n([^<])/g, '$1<br/>$2');
  html = html.replace(/<p[^>]*>\s*<em[^>]*>Photo:.*?<\/em>\s*<\/p>/gi, '');
  return html;
}

function stripMarkdown(text) {
  if (!text) return '';
  return text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1').replace(/_([^_]+)_/g, '$1').replace(/^>\s+/gm, '')
    .replace(/^[\-\*]\s+/gm, '').replace(/^\d+\.\s+/gm, '').replace(/```[^`]+```/g, '')
    .replace(/`([^`]+)`/g, '$1').replace(/^[\-\*]{3,}$/gm, '').replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-600' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-500' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-orange-500' }
];

// ==========================================
// SERVER-SIDE RENDERING for OG Meta Tags
// This is CRITICAL for Facebook/Twitter/LinkedIn previews
// ==========================================
export async function getServerSideProps(context) {
  const { id } = context.params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
  
  try {
    const response = await fetch(`${API_URL}/api/blogs/${id}`);
    if (!response.ok) return { notFound: true };
    
    const data = await response.json();
    const blog = data.blog || data.data || data;
    
    // Extract featured image - PRIORITY ORDER (article image FIRST)
    let ogImage = null;
    
    // 1. Check featuredImage object/string
    if (blog.featuredImage) {
      ogImage = typeof blog.featuredImage === 'string' ? blog.featuredImage : blog.featuredImage.url;
    }
    
    // 2. Check images array
    if (!ogImage && blog.images?.length > 0) {
      const firstImg = blog.images[0];
      ogImage = typeof firstImg === 'string' ? firstImg : firstImg.url;
    }
    
    // 3. Check media array
    if (!ogImage && blog.media?.length > 0) {
      const firstMedia = blog.media[0];
      ogImage = typeof firstMedia === 'string' ? firstMedia : firstMedia.url;
    }
    
    // 4. Extract from markdown content
    if (!ogImage && blog.content) {
      const imgMatch = blog.content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) ogImage = imgMatch[2];
    }
    
    // 5. LAST RESORT - default OG image
    if (!ogImage) ogImage = 'https://cybev.io/og-default.png';
    
    const author = blog.author || {};
    const authorName = author.name || author.username || blog.authorName || 'CYBEV Creator';
    const description = blog.seo?.metaDescription || blog.excerpt || stripMarkdown(blog.content || '').slice(0, 160);
    
    return {
      props: {
        blog: {
          _id: blog._id,
          title: blog.title || 'Untitled',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          featuredImage: ogImage,
          author: { _id: author._id || null, name: authorName, avatar: author.profilePicture || author.avatar || null },
          createdAt: blog.createdAt || new Date().toISOString(),
          readTime: blog.readTime || '5 min',
          views: blog.views || 0,
          shares: blog.shares || { total: 0 },
          reactions: blog.reactions || {},
          tags: blog.tags || [],
          isAIGenerated: blog.isAIGenerated || false
        },
        ogData: {
          title: blog.title || 'CYBEV Blog',
          description: description,
          image: ogImage,
          url: `https://cybev.io/blog/${id}`,
          author: authorName
        }
      }
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return { notFound: true };
  }
}

// ==========================================
// BLOG PAGE COMPONENT
// ==========================================
export default function BlogDetailPage({ blog, ogData }) {
  const router = useRouter();
  const id = blog?._id;
  
  const [user, setUser] = useState(null);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  const [viewCount, setViewCount] = useState(blog?.views || 0);
  const [shareCount, setShareCount] = useState(blog?.shares?.total || 0);
  const [api, setApi] = useState(null);
  const [showTimelineShare, setShowTimelineShare] = useState(false);
  const [timelineComment, setTimelineComment] = useState('');
  const [sharingToTimeline, setSharingToTimeline] = useState(false);
  
  useEffect(() => {
    import('@/lib/api').then(module => setApi(module.default)).catch(() => {});
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    trackView();
    fetchCommentsInitial();
  }, []);
  
  const fetchCommentsInitial = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/comments/blog/${id}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch {}
  };
  
  const trackView = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/blogs/${id}/view`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
  };
  
  const handleShareToTimeline = async () => {
    if (!user) { toast.info('Please login to share to your timeline'); return; }
    setSharingToTimeline(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/share/timeline`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ blogId: id, comment: timelineComment })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('🎉 Shared to your timeline!');
        setShowTimelineShare(false);
        setTimelineComment('');
        setShareCount(prev => prev + 1);
      } else {
        toast.error(data.error || 'Failed to share');
      }
    } catch (error) {
      toast.error('Failed to share to timeline');
    }
    setSharingToTimeline(false);
  };
  
  useEffect(() => {
    if (id && api) { fetchComments(); checkBookmark(); }
  }, [id, api]);
  
  const fetchComments = async () => {
    if (!api) return;
    try {
      const response = await api.get(`/api/comments/blog/${id}`);
      setComments(response.data.comments || []);
    } catch {}
  };
  
  const checkBookmark = async () => {
    if (!api) return;
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) return;
    try {
      const response = await api.get(`/api/bookmarks/check/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBookmarked(response.data.bookmarked);
    } catch {}
  };
  
  const handleReaction = async (type) => {
    if (!user) { toast.info('Please login to react'); return; }
    if (!api) {
      // Fallback to fetch if api not loaded
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/blogs/${id}/react`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ type })
        });
        const data = await response.json();
        if (data.success) {
          setActiveReaction(activeReaction === type ? null : type);
          toast.success(activeReaction === type ? 'Reaction removed' : `Reacted with ${type}!`);
        }
      } catch (error) { 
        console.error('Reaction error:', error);
        toast.error('Failed to react'); 
      }
      return;
    }
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/blogs/${id}/react`, { type }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data?.success) {
        setActiveReaction(activeReaction === type ? null : type);
        toast.success(activeReaction === type ? 'Reaction removed' : `Reacted with ${type}!`);
      }
    } catch (error) { 
      console.error('Reaction error:', error);
      toast.error('Failed to react'); 
    }
  };
  
  const handleBookmark = async () => {
    if (!user) { toast.info('Please login to bookmark'); return; }
    if (!api) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (bookmarked) {
        await api.delete(`/api/bookmarks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        await api.post('/api/bookmarks', { postId: id, postType: 'blog' }, { headers: { Authorization: `Bearer ${token}` } });
        setBookmarked(true);
        toast.success('Added to bookmarks');
      }
    } catch { toast.error('Bookmark failed'); }
  };
  
  const handleShare = async (platform) => {
    const { url, title, description, image } = ogData;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + '\n\n' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article:\n\n' + title + '\n\n' + url)}`
    };
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } else if (platform === 'native' && navigator.share) {
      try { await navigator.share({ title, text: description, url }); } catch {}
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
    
    // Track share
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/blogs/${id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ platform })
      });
      setShareCount(prev => prev + 1);
    } catch {}
  };
  
  const submitComment = async () => {
    if (!newComment.trim() || !user) {
      if (!user) toast.info('Please login to comment');
      return;
    }
    setSubmittingComment(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          blogId: id, 
          content: newComment.trim(),
          authorName: user.name 
        })
      });
      const data = await response.json();
      if (data.comment || data.success) {
        const newCommentObj = data.comment || {
          _id: Date.now(),
          content: newComment.trim(),
          user: { name: user.name, profilePicture: user.profilePicture },
          createdAt: new Date().toISOString()
        };
        setComments([newCommentObj, ...comments]);
        setNewComment('');
        toast.success('Comment added!');
      } else {
        toast.error(data.error || 'Failed to add comment');
      }
    } catch (error) { 
      console.error('Comment error:', error);
      toast.error('Failed to add comment'); 
    }
    setSubmittingComment(false);
  };
  
  const totalReactions = blog?.reactions ? Object.values(blog.reactions).reduce((sum, arr) => sum + (arr?.length || 0), 0) : 0;
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const authorAvatar = blog.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || 'U')}&background=7c3aed&color=fff`;
  
  if (!blog) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h1>
      <Link href="/feed"><button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Back to Feed</button></Link>
    </div>
  );
  
  return (
    <>
      {/* SSR HEAD - Facebook/Twitter crawlers see this */}
      <Head>
        <title>{ogData.title} | CYBEV</title>
        <meta name="description" content={ogData.description} />
        
        {/* Open Graph - CRITICAL for Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={ogData.url} />
        <meta property="og:title" content={ogData.title} />
        <meta property="og:description" content={ogData.description} />
        <meta property="og:image" content={ogData.image} />
        <meta property="og:image:secure_url" content={ogData.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={ogData.title} />
        <meta property="og:site_name" content="CYBEV" />
        <meta property="article:author" content={ogData.author} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogData.title} />
        <meta name="twitter:description" content={ogData.description} />
        <meta name="twitter:image" content={ogData.image} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" /><span className="hidden sm:inline">Back</span>
            </button>
            <Link href="/feed"><h1 className="text-xl font-bold text-purple-600 cursor-pointer">CYBEV</h1></Link>
            <div className="flex items-center gap-2">
              <button onClick={handleBookmark} className={`p-2 rounded-full hover:bg-gray-100 ${bookmarked ? 'text-purple-600' : 'text-gray-600'}`}>
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              <div className="relative">
                <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 py-1 text-xs text-gray-500 font-medium uppercase">Share</div>
                    
                    {/* Share to My Timeline - FIRST option */}
                    <button onClick={() => { setShowShareMenu(false); setShowTimelineShare(true); }} 
                      className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 text-purple-700 font-medium border-b border-gray-100">
                      <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-sm">📋</span> 
                      Share to My Timeline
                    </button>
                    
                    <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Copy className="w-5 h-5 text-gray-500" /> Copy link
                    </button>
                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Twitter className="w-5 h-5 text-blue-400" /> Twitter
                    </button>
                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Facebook className="w-5 h-5 text-blue-600" /> Facebook
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Linkedin className="w-5 h-5 text-blue-700" /> LinkedIn
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <span className="text-green-500">💬</span> WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Featured Image */}
          {blog.featuredImage && !blog.featuredImage.includes('og-default') && (
            <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
              <img src={blog.featuredImage} alt={blog.title} className="w-full h-64 md:h-96 object-cover" />
            </div>
          )}
          
          {/* Title & Meta */}
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{blog.title}</h1>
          
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <Link href={`/profile/${blog.author?._id || ''}`}>
              <img src={authorAvatar} alt={blog.author?.name} className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80" />
            </Link>
            <div className="flex-1">
              <Link href={`/profile/${blog.author?._id || ''}`}>
                <p className="font-semibold text-gray-900 hover:text-purple-600 cursor-pointer">{blog.author?.name}</p>
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{formatDate(blog.createdAt)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readTime}</span>
                {blog.isAIGenerated && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-purple-600">✨ AI Generated</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Blog Content */}
          <article className="prose prose-lg max-w-none blog-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content) }} />
          
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 mb-6">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer">#{tag}</span>
              ))}
            </div>
          )}
          
          {/* Stats Bar */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200 mb-6">
            <div className="flex items-center gap-1">
              {totalReactions > 0 && (
                <>
                  <div className="flex -space-x-1">
                    {Object.entries(blog.reactions || {}).filter(([_, users]) => users?.length > 0).slice(0, 3).map(([type]) => (
                      <span key={type} className="text-lg">{REACTIONS.find(r => r.type === type)?.emoji || '👍'}</span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{totalReactions}</span>
                </>
              )}
            </div>
            <div className="text-gray-500 text-sm">{comments.length} comments · {shareCount} shares · {viewCount} views</div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-around py-2 mb-6 relative">
            <div className="relative" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
              <button onClick={() => handleReaction('like')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium ${activeReaction ? REACTIONS.find(r => r.type === activeReaction)?.color || 'text-blue-600' : 'text-gray-600'}`}>
                {activeReaction ? <span className="text-xl">{REACTIONS.find(r => r.type === activeReaction)?.emoji}</span> : <Heart className="w-5 h-5" />}
                <span>Like</span>
              </button>
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 flex gap-1 bg-white rounded-full shadow-lg px-2 py-1 border border-gray-200">
                  {REACTIONS.map(r => (
                    <button key={r.type} onClick={() => handleReaction(r.type)} className="text-2xl hover:scale-125 transition-transform p-1" title={r.label}>{r.emoji}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
              <MessageSquare className="w-5 h-5" /><span>Comment</span>
            </button>
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
              <Share2 className="w-5 h-5" /><span>Share</span>
            </button>
          </div>
          
          {/* Comments */}
          {showComments && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Comments ({comments.length})</h3>
              {user ? (
                <div className="flex gap-3 mb-6">
                  <img src={user.profilePicture || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7c3aed&color=fff`} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" rows={2} />
                    <button onClick={submitComment} disabled={!newComment.trim() || submittingComment} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
                      {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Post
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 mb-4"><Link href="/login" className="text-purple-600 hover:underline">Login</Link> to comment</p>
              )}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No comments yet. Be the first!</p>
                ) : comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img src={comment.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || comment.authorName || 'U')}&background=7c3aed&color=fff`} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-gray-900 text-sm">{comment.user?.name || comment.authorName || 'Anonymous'}</p>
                      <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                      <p className="text-gray-400 text-xs mt-2">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Share to Timeline Modal */}
      {showTimelineShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowTimelineShare(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Share to Your Timeline</h2>
              <button onClick={() => setShowTimelineShare(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <span className="text-gray-500 text-xl">×</span>
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={timelineComment}
                onChange={(e) => setTimelineComment(e.target.value)}
                placeholder="Say something about this..."
                className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-gray-400 mt-1">{timelineComment.length}/500</div>
            </div>
            <div className="mx-4 mb-4 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{blog.title}</h4>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{blog.excerpt || stripMarkdown(blog.content).slice(0, 100)}...</p>
              </div>
              {ogData.image && !ogData.image.includes('og-default') && (
                <img src={ogData.image} alt="" className="w-full h-32 object-cover" />
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={handleShareToTimeline} disabled={sharingToTimeline}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {sharingToTimeline ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sharing...</>
                ) : (
                  <><Share2 className="w-5 h-5" /> Share to Timeline</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .blog-content h1,.blog-content h2{font-size:1.5rem;font-weight:700;color:#111827;margin:2rem 0 1rem}
        .blog-content h3{font-size:1.25rem;font-weight:600;color:#1f2937;margin:1.5rem 0 .75rem}
        .blog-content p{color:#374151;line-height:1.75;margin-bottom:1rem}
        .blog-content img{width:100%;border-radius:.75rem;margin:1.5rem 0}
        .blog-content figure{margin:1.5rem 0}
        .blog-content figcaption{text-align:center;color:#6b7280;font-size:.875rem;margin-top:.5rem;font-style:italic}
        .blog-content ul,.blog-content ol{margin:1rem 0;padding-left:1.5rem}
        .blog-content li{color:#374151;margin-bottom:.5rem}
        .blog-content blockquote{border-left:4px solid #7c3aed;padding:1rem;margin:1.5rem 0;background:#f3f4f6;border-radius:0 .5rem .5rem 0}
        .blog-content a{color:#7c3aed;text-decoration:underline}
      `}</style>
    </>
  );
}
