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
import { markdownToHtml, stripMarkdown, extractImages } from '@/lib/markdown';

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
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      copy: null
    };
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
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
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.seo?.metaDescription || blog.excerpt || stripMarkdown(blog.content).slice(0, 160)} />
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Copy className="w-4 h-4" /> Copy Link
                    </button>
                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Twitter className="w-4 h-4" /> Twitter
                    </button>
                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Facebook className="w-4 h-4" /> Facebook
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Send className="w-4 h-4" /> WhatsApp
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
