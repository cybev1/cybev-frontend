// ============================================
// FILE: src/pages/blog/[id].jsx
// Blog Detail Page with SSR for Social Sharing
// FIXED: Now properly renders HTML content from Quill editor
// FIXED: Detects HTML vs Markdown and handles both
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
// CONTENT UTILITIES - HTML & MARKDOWN
// ==========================================

// Check if content is already HTML (from Quill editor)
function isHtmlContent(content) {
  if (!content) return false;
  // Check for common HTML tags that Quill produces
  return /<(p|div|h[1-6]|ul|ol|li|img|blockquote|strong|em|a|br)\b[^>]*>/i.test(content);
}

// Process HTML content - just sanitize and add styling classes
function processHtmlContent(html) {
  if (!html) return '';
  
  // Add styling classes to HTML elements
  let processed = html
    // Headings
    .replace(/<h1([^>]*)>/gi, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6"$1>')
    .replace(/<h2([^>]*)>/gi, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4"$1>')
    .replace(/<h3([^>]*)>/gi, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4"$1>')
    .replace(/<h4([^>]*)>/gi, '<h4 class="text-lg font-semibold text-gray-800 mt-6 mb-3"$1>')
    // Paragraphs
    .replace(/<p([^>]*)>/gi, '<p class="text-gray-700 leading-relaxed mb-4"$1>')
    // Images
    .replace(/<img([^>]*)>/gi, '<img class="w-full rounded-lg shadow-md my-6"$1>')
    // Lists
    .replace(/<ul([^>]*)>/gi, '<ul class="my-4 list-disc pl-6"$1>')
    .replace(/<ol([^>]*)>/gi, '<ol class="my-4 list-decimal pl-6"$1>')
    .replace(/<li([^>]*)>/gi, '<li class="text-gray-700 mb-2"$1>')
    // Blockquotes
    .replace(/<blockquote([^>]*)>/gi, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 rounded-r-lg italic text-gray-700"$1>')
    // Links
    .replace(/<a([^>]*)>/gi, '<a class="text-purple-600 hover:underline"$1>')
    // Code
    .replace(/<pre([^>]*)>/gi, '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm"$1>')
    .replace(/<code([^>]*)>/gi, '<code class="bg-gray-100 text-pink-600 px-2 py-0.5 rounded text-sm"$1>');
  
  return processed;
}

// Convert Markdown to HTML (for old markdown content)
function markdownToHtml(markdown) {
  if (!markdown) return '';
  let html = markdown;
  
  // Escape HTML entities for markdown content
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
    '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-md" loading="lazy" /><figcaption class="text-center text-gray-500 text-sm mt-2 italic">$1</figcaption></figure>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" class="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Headings
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold text-gray-800 mt-6 mb-3">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>');
  
  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');
  
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 rounded-r-lg italic text-gray-700">$1</blockquote>');
  
  // Lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="ml-6 list-disc text-gray-700 mb-2">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal text-gray-700 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-6 list-disc[^>]*>.*?<\/li>\n?)+/g, '<ul class="my-4">$&</ul>');
  html = html.replace(/(<li class="ml-6 list-decimal[^>]*>.*?<\/li>\n?)+/g, '<ol class="my-4">$&</ol>');
  
  // Code
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-2 py-0.5 rounded text-sm">$1</code>');
  
  // Horizontal rules
  html = html.replace(/^(\-{3,}|\*{3,})$/gm, '<hr class="my-8 border-gray-300" />');
  
  // Paragraphs
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

// MAIN FUNCTION: Process content - auto-detects HTML vs Markdown
function processContent(content) {
  if (!content) return '';
  
  // If content is already HTML (from Quill/rich editor), just process it
  if (isHtmlContent(content)) {
    return processHtmlContent(content);
  }
  
  // Otherwise, convert markdown to HTML
  return markdownToHtml(content);
}

function stripMarkdown(text) {
  if (!text) return '';
  // First strip HTML tags if present
  text = text.replace(/<[^>]+>/g, ' ');
  // Then strip markdown
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
// ==========================================
export async function getServerSideProps(context) {
  const { id } = context.params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
  
  try {
    const response = await fetch(`${API_URL}/api/blogs/${id}`);
    if (!response.ok) return { notFound: true };
    
    const data = await response.json();
    const blog = data.blog || data.data || data;
    
    // Extract featured image
    let ogImage = null;
    
    if (blog.featuredImage) {
      ogImage = typeof blog.featuredImage === 'string' ? blog.featuredImage : blog.featuredImage.url;
    }
    
    if (!ogImage && blog.images?.length > 0) {
      const firstImg = blog.images[0];
      ogImage = typeof firstImg === 'string' ? firstImg : firstImg.url;
    }
    
    if (!ogImage && blog.media?.length > 0) {
      const firstMedia = blog.media[0];
      ogImage = typeof firstMedia === 'string' ? firstMedia : firstMedia.url;
    }
    
    // Extract image from HTML content
    if (!ogImage && blog.content) {
      // Check for HTML img tags first
      const htmlImgMatch = blog.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (htmlImgMatch) {
        ogImage = htmlImgMatch[1];
      } else {
        // Check for markdown images
        const mdImgMatch = blog.content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (mdImgMatch) ogImage = mdImgMatch[2];
      }
    }
    
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
          title: blog.seo?.metaTitle || blog.title || 'CYBEV Article',
          description,
          image: ogImage,
          url: `https://cybev.io/blog/${id}`
        }
      }
    };
  } catch (error) {
    console.error('getServerSideProps error:', error);
    return { notFound: true };
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export default function BlogPage({ blog, ogData }) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
  
  const [user, setUser] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [viewCount, setViewCount] = useState(blog?.views || 0);
  const [shareCount, setShareCount] = useState(blog?.shares?.total || 0);
  const [showTimelineShare, setShowTimelineShare] = useState(false);
  const [timelineComment, setTimelineComment] = useState('');
  const [sharingToTimeline, setSharingToTimeline] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    fetchComments();
    checkBookmark();
    checkUserReaction();
  }, [blog._id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/comments?targetType=blog&targetId=${blog._id}`);
      const data = await res.json();
      setComments(data.comments || data.data || []);
    } catch {}
  };

  const checkBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/bookmarks/check?contentType=blog&contentId=${blog._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIsBookmarked(data.isBookmarked);
    } catch {}
  };

  const checkUserReaction = async () => {
    const token = localStorage.getItem('token');
    if (!token || !blog.reactions) return;
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    try {
      const userData = JSON.parse(storedUser);
      for (const [type, users] of Object.entries(blog.reactions)) {
        if (users && Array.isArray(users) && users.some(u => (typeof u === 'string' ? u : u._id) === userData._id)) {
          setActiveReaction(type);
          break;
        }
      }
    } catch {}
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to bookmark');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contentType: 'blog', contentId: blog._id })
      });
      const data = await res.json();
      setIsBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? 'Bookmarked!' : 'Removed from bookmarks');
    } catch {
      toast.error('Failed to bookmark');
    }
  };

  const handleReaction = async (reactionType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to react');
      return;
    }
    try {
      await fetch(`${API_URL}/api/blogs/${blog._id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reactionType })
      });
      setActiveReaction(activeReaction === reactionType ? null : reactionType);
      setShowReactions(false);
    } catch {
      toast.error('Failed to react');
    }
  };

  const handleShare = async (platform) => {
    const url = `${window.location.origin}/blog/${blog._id}`;
    const title = blog.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } else if (platform === 'timeline') {
      setShowTimelineShare(true);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }

    // Track share
    try {
      await fetch(`${API_URL}/api/blogs/${blog._id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });
      setShareCount(prev => prev + 1);
    } catch {}

    setShowShareMenu(false);
  };

  const handleShareToTimeline = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to share');
      return;
    }
    
    setSharingToTimeline(true);
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          content: timelineComment || `Check out this article: "${blog.title}"`,
          sharedContent: {
            type: 'blog',
            id: blog._id,
            title: blog.title,
            excerpt: blog.excerpt || stripMarkdown(blog.content).slice(0, 150),
            image: ogData.image,
            url: `/blog/${blog._id}`
          }
        })
      });
      
      if (res.ok) {
        toast.success('Shared to your timeline!');
        setShowTimelineShare(false);
        setTimelineComment('');
        setShareCount(prev => prev + 1);
      } else {
        throw new Error('Share failed');
      }
    } catch (error) {
      toast.error('Failed to share');
    } finally {
      setSharingToTimeline(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to comment');
      return;
    }
    setSubmittingComment(true);
    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetType: 'blog', targetId: blog._id, content: newComment })
      });
      if (res.ok) {
        setNewComment('');
        fetchComments();
        toast.success('Comment posted!');
      }
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;
  }

  const authorAvatar = blog.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || 'U')}&background=7c3aed&color=fff`;
  const totalReactions = Object.values(blog.reactions || {}).reduce((sum, users) => sum + (users?.length || 0), 0);

  return (
    <>
      <Head>
        <title>{ogData.title} | CYBEV</title>
        <meta name="description" content={ogData.description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogData.title} />
        <meta property="og:description" content={ogData.description} />
        <meta property="og:image" content={ogData.image} />
        <meta property="og:url" content={ogData.url} />
        <meta property="og:site_name" content="CYBEV" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogData.title} />
        <meta name="twitter:description" content={ogData.description} />
        <meta name="twitter:image" content={ogData.image} />
        <link rel="canonical" href={ogData.url} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            
            <Link href="/" className="text-xl font-bold text-purple-600">CYBEV</Link>
            
            <div className="flex items-center gap-2">
              <button onClick={handleBookmark} className={`p-2 rounded-full hover:bg-gray-100 ${isBookmarked ? 'text-purple-600' : 'text-gray-600'}`}>
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <div className="relative">
                <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button onClick={() => handleShare('timeline')} className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center gap-3 text-purple-600 font-medium">
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
          
          {/* Blog Content - FIXED: Now properly renders HTML */}
          <article 
            className="prose prose-lg max-w-none blog-content" 
            dangerouslySetInnerHTML={{ __html: processContent(blog.content) }} 
          />
          
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
                <p className="text-center text-gray-500 mb-4"><Link href="/auth/login" className="text-purple-600 hover:underline">Login</Link> to comment</p>
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
                      <p className="text-gray-500 text-xs mt-2">{formatDate(comment.createdAt)}</p>
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
              <div className="text-xs text-gray-500 mt-1">{timelineComment.length}/500</div>
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
        .blog-content h1, .blog-content h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 2rem 0 1rem; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin: 1.5rem 0 0.75rem; }
        .blog-content p { color: #374151; line-height: 1.75; margin-bottom: 1rem; }
        .blog-content img { width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; }
        .blog-content figure { margin: 1.5rem 0; }
        .blog-content figcaption { text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem; font-style: italic; }
        .blog-content ul, .blog-content ol { margin: 1rem 0; padding-left: 1.5rem; }
        .blog-content li { color: #374151; margin-bottom: 0.5rem; }
        .blog-content blockquote { border-left: 4px solid #7c3aed; padding: 1rem; margin: 1.5rem 0; background: #f3f4f6; border-radius: 0 0.5rem 0.5rem 0; }
        .blog-content a { color: #7c3aed; text-decoration: underline; }
        .blog-content strong { font-weight: 700; }
        .blog-content em { font-style: italic; }
      `}</style>
    </>
  );
}
