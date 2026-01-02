// ============================================
// FILE: src/pages/blog/[id].jsx
// Blog Detail Page with Markdown Rendering
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Heart, MessageSquare, Share2, Bookmark, Clock, Eye,
  Calendar, User, Tag, MoreHorizontal, Edit, Trash2, Pin, Flag,
  Copy, Twitter, Facebook, Linkedin, Send, X, Loader2, BookmarkCheck
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// ==========================================
// MARKDOWN UTILITIES (inline to avoid import issues)
// ==========================================
function markdownToHtml(markdown) {
  if (!markdown) return '';
  let html = markdown;
  
  // Escape HTML entities first
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Images: ![alt](url) - MUST be before links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
    '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-md" loading="lazy" /><figcaption class="text-center text-gray-500 text-sm mt-2 italic">$1</figcaption></figure>');
  
  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" class="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Headers
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
  html = html.replace(/^&gt; (.+)$/gm, 
    '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 rounded-r-lg italic text-gray-700">$1</blockquote>');
  
  // Lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="ml-6 list-disc text-gray-700 mb-2">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal text-gray-700 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-6 list-disc[^>]*>.*?<\/li>\n?)+/g, '<ul class="my-4">$&</ul>');
  html = html.replace(/(<li class="ml-6 list-decimal[^>]*>.*?<\/li>\n?)+/g, '<ol class="my-4">$&</ol>');
  
  // Code
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-2 py-0.5 rounded text-sm">$1</code>');
  
  // Horizontal rule
  html = html.replace(/^(\-{3,}|\*{3,})$/gm, '<hr class="my-8 border-gray-300" />');
  
  // Paragraphs
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol') || 
        para.startsWith('<blockquote') || para.startsWith('<pre') || para.startsWith('<hr') ||
        para.startsWith('<figure') || para.startsWith('<li')) {
      return para;
    }
    if (para) return `<p class="text-gray-700 leading-relaxed mb-4">${para}</p>`;
    return '';
  }).join('\n');
  
  html = html.replace(/([^>])\n([^<])/g, '$1<br/>$2');
  html = html.replace(/<p[^>]*>\s*<em[^>]*>Photo:.*?<\/em>\s*<\/p>/gi, '');
  html = html.replace(/<em[^>]*>Photo:.*?<\/em>/gi, '');
  
  return html;
}

function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[\-\*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/```[^`]+```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[\-\*]{3,}$/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImages(markdown) {
  if (!markdown) return [];
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    images.push({ alt: match[1], url: match[2] });
  }
  return images;
}

// Emoji Reactions
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-600' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-500' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-orange-500' }
];

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);
  
  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);
  
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/blogs/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const blogData = response.data.blog || response.data.data || response.data;
      setBlog(blogData);
      
      // Check if bookmarked
      if (token) {
        try {
          const bookmarkRes = await api.get(`/api/bookmarks/check/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBookmarked(bookmarkRes.data.bookmarked);
        } catch {}
      }
      
      // Fetch comments
      try {
        const commentsRes = await api.get(`/api/comments/blog/${id}`);
        setComments(commentsRes.data.comments || []);
      } catch {}
      
      // Check user's reaction
      if (blogData.reactions && user) {
        for (const [type, users] of Object.entries(blogData.reactions)) {
          if (users?.includes(user._id || user.id)) {
            setActiveReaction(type);
            break;
          }
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      toast.error('Failed to load blog');
    }
    setLoading(false);
  };
  
  const handleReaction = async (type) => {
    if (!user) {
      toast.info('Please login to react');
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/reactions/blog/${id}`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setActiveReaction(activeReaction === type ? null : type);
      fetchBlog(); // Refresh to get updated counts
    } catch (error) {
      toast.error('Failed to react');
    }
  };
  
  const handleBookmark = async () => {
    if (!user) {
      toast.info('Please login to bookmark');
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      if (bookmarked) {
        await api.delete(`/api/bookmarks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        await api.post('/api/bookmarks', { postId: id, postType: 'blog' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarked(true);
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      toast.error('Bookmark failed');
    }
  };
  
  const handleShare = async (platform) => {
    const url = `https://cybev.io/blog/${id}`;
    const title = blog?.title || 'Check this out on CYBEV';
    const description = blog?.excerpt || blog?.seo?.metaDescription || '';
    const image = featuredImage || '';
    
    const shareUrls = {
      copy: null,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + '\n\n' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(image)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article:\n\n' + title + '\n\n' + url)}`,
      native: null
    };
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } else if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Share failed');
        }
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
    
    // Track share
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/blogs/${id}/share`, { platform }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
  };
  
  const submitComment = async () => {
    if (!newComment.trim() || !user) return;
    
    setSubmittingComment(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/comments/blog/${id}`, {
        content: newComment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
    setSubmittingComment(false);
  };
  
  // Calculate total reactions
  const totalReactions = blog?.reactions 
    ? Object.values(blog.reactions).reduce((sum, arr) => sum + (arr?.length || 0), 0)
    : (blog?.likes?.length || 0);
  
  // Get author info
  const author = blog?.author || {};
  const authorName = author.name || author.username || blog?.authorName || 'Anonymous';
  const authorAvatar = author.profilePicture || author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=7c3aed&color=fff`;
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get featured image
  const featuredImage = blog?.featuredImage?.url || blog?.featuredImage || 
    (blog?.images?.length > 0 ? blog.images[0] : null);
  
  // Render content with markdown
  const renderContent = () => {
    if (!blog?.content) return null;
    
    const htmlContent = markdownToHtml(blog.content);
    
    return (
      <div 
        className="prose prose-lg max-w-none blog-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h1>
        <Link href="/feed">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Back to Feed
          </button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{blog.title} | CYBEV</title>
        <meta name="description" content={blog.seo?.metaDescription || blog.excerpt || stripMarkdown(blog.content).slice(0, 160)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://cybev.io/blog/${blog._id}`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.seo?.metaDescription || blog.excerpt || stripMarkdown(blog.content).slice(0, 160)} />
        <meta property="og:image" content={featuredImage || 'https://cybev.io/og-default.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CYBEV" />
        <meta property="article:author" content={authorName} />
        <meta property="article:published_time" content={blog.createdAt} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://cybev.io/blog/${blog._id}`} />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.seo?.metaDescription || blog.excerpt || stripMarkdown(blog.content).slice(0, 160)} />
        <meta name="twitter:image" content={featuredImage || 'https://cybev.io/og-default.png'} />
        
        {/* LinkedIn */}
        <meta property="og:image:secure_url" content={featuredImage || 'https://cybev.io/og-default.png'} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <Link href="/feed">
              <h1 className="text-xl font-bold text-purple-600 cursor-pointer">CYBEV</h1>
            </Link>
            
            <div className="flex items-center gap-2">
              <button onClick={handleBookmark} 
                className={`p-2 rounded-full hover:bg-gray-100 ${bookmarked ? 'text-purple-600' : 'text-gray-600'}`}>
                {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button onClick={() => setShowShareMenu(!showShareMenu)} 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 py-1 text-xs text-gray-500 font-medium uppercase">Share to</div>
                    
                    {/* Native Share (mobile) */}
                    {typeof navigator !== 'undefined' && navigator.share && (
                      <button onClick={() => handleShare('native')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                        <Share2 className="w-4 h-4 text-purple-600" /> Share...
                      </button>
                    )}
                    
                    <button onClick={() => handleShare('copy')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Copy className="w-4 h-4 text-gray-600" /> Copy Link
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                    </button>
                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Twitter className="w-4 h-4 text-sky-500" /> Twitter / X
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </button>
                    <button onClick={() => handleShare('telegram')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                      Telegram
                    </button>
                    <button onClick={() => handleShare('reddit')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                      Reddit
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button onClick={() => handleShare('email')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Featured Image */}
          {featuredImage && (
            <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gray-200">
              <img 
                src={featuredImage} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Blog Badge */}
          {blog.isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mb-4">
              ✨ AI Generated
            </span>
          )}
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          
          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <Link href={`/profile/${author._id || author.id || 'user'}`}>
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900 hover:text-purple-600">{authorName}</p>
                  <p className="text-sm text-gray-500">{formatDate(blog.createdAt)}</p>
                </div>
              </div>
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 ml-auto">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime || '5 min'}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views || 0} views
              </span>
            </div>
          </div>
          
          {/* Content */}
          <article className="mb-8">
            {renderContent()}
          </article>
          
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-200">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Reactions & Stats */}
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
            
            <div className="text-gray-500 text-sm">
              {comments.length} comments · {blog.shares?.total || 0} shares
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-around py-2 mb-6 relative">
            {/* Like/React */}
            <div className="relative"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}>
              <button onClick={() => handleReaction('like')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium ${
                  activeReaction ? REACTIONS.find(r => r.type === activeReaction)?.color || 'text-blue-600' : 'text-gray-600'
                }`}>
                {activeReaction ? (
                  <span className="text-xl">{REACTIONS.find(r => r.type === activeReaction)?.emoji}</span>
                ) : (
                  <Heart className="w-5 h-5" />
                )}
                <span>Like</span>
              </button>
              
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 flex gap-1 bg-white rounded-full shadow-lg px-2 py-1 border border-gray-200">
                  {REACTIONS.map(r => (
                    <button key={r.type} onClick={() => handleReaction(r.type)}
                      className="text-2xl hover:scale-125 transition-transform p-1" title={r.label}>
                      {r.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
              <MessageSquare className="w-5 h-5" />
              <span>Comment</span>
            </button>
            
            <button onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
          
          {/* Comments Section */}
          {showComments && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Comments ({comments.length})</h3>
              
              {/* Comment Input */}
              {user ? (
                <div className="flex gap-3 mb-6">
                  <img src={user.profilePicture || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7c3aed&color=fff`}
                    alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={2}
                    />
                    <button onClick={submitComment} disabled={!newComment.trim() || submittingComment}
                      className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Post
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 mb-4">
                  <Link href="/login" className="text-purple-600 hover:underline">Login</Link> to comment
                </p>
              )}
              
              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <img src={comment.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'U')}&background=7c3aed&color=fff`}
                        alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900 text-sm">{comment.user?.name || comment.user?.username || 'Anonymous'}</p>
                        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                        <p className="text-gray-400 text-xs mt-2">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Custom Styles for Blog Content */}
      <style jsx global>{`
        .blog-content h1 { font-size: 2rem; font-weight: 700; color: #111827; margin-top: 2rem; margin-bottom: 1rem; }
        .blog-content h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin-top: 2rem; margin-bottom: 1rem; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .blog-content p { color: #374151; line-height: 1.75; margin-bottom: 1rem; }
        .blog-content img { width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; }
        .blog-content figure { margin: 1.5rem 0; }
        .blog-content figcaption { text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem; font-style: italic; }
        .blog-content ul, .blog-content ol { margin: 1rem 0; padding-left: 1.5rem; }
        .blog-content li { color: #374151; margin-bottom: 0.5rem; }
        .blog-content blockquote { border-left: 4px solid #7c3aed; padding-left: 1rem; margin: 1.5rem 0; background: #f3f4f6; padding: 1rem; border-radius: 0 0.5rem 0.5rem 0; }
        .blog-content a { color: #7c3aed; text-decoration: underline; }
        .blog-content a:hover { color: #6d28d9; }
        .blog-content strong { font-weight: 700; }
        .blog-content em { font-style: italic; }
        .blog-content code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; }
        .blog-content pre { background: #1f2937; color: #10b981; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.5rem 0; }
        .blog-content hr { border-color: #e5e7eb; margin: 2rem 0; }
      `}</style>
    </>
  );
}
