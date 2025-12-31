// ============================================
// FILE: src/pages/feed.jsx
// FIXED: Share menu + 3-dots Edit/Delete menu
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { 
  Clock, TrendingUp, Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Eye, Sparkles, Loader2, X, Edit, Trash2, Flag, Copy, ExternalLink
} from 'lucide-react';

// AI Blog Generator Modal
function AIBlogModal({ isOpen, onClose }) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('technology');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generating, setGenerating] = useState(false);

  const niches = [
    'technology', 'business', 'health', 'lifestyle', 'education',
    'finance', 'entertainment', 'food', 'travel', 'science'
  ];

  const tones = ['professional', 'casual', 'friendly', 'formal', 'humorous'];
  const lengths = ['short', 'medium', 'long'];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/content/create-blog', {
        topic,
        niche,
        tone,
        length,
        targetAudience: 'general'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Blog created! You earned ${response.data.tokensEarned || 50} tokens!`);
        
        // Publish the blog
        const publishResponse = await api.post('/api/content/publish-blog', {
          blogData: {
            ...response.data.data,
            niche
          }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (publishResponse.data.success) {
          toast.success('Blog published!');
          onClose();
          router.push(`/blog/${publishResponse.data.data.blogId}`);
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate blog');
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AI Blog Generator
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Topic *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of AI in Healthcare"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            >
              {niches.map(n => (
                <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              >
                {tones.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              >
                {lengths.map(l => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Blog
              </>
            )}
          </button>
        </div>

        {generating && (
          <p className="text-center text-gray-400 text-sm mt-4">
            This may take up to 2 minutes. Please wait...
          </p>
        )}
      </div>
    </div>
  );
}

// Feed Post Card with WORKING Share & 3-dots Menu
function FeedCard({ item, onLike, onBookmark, currentUserId, onDelete }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes?.length || item.likesCount || 0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isPost = item.contentType === 'post' || !item.title;
  const isBlog = item.contentType === 'blog' || item.title;
  
  // Check if current user is the author
  const authorId = item.author?._id || item.author || item.authorId?._id || item.authorId;
  const isOwner = currentUserId && (authorId === currentUserId || String(authorId) === String(currentUserId));

  const handleLike = async (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    try {
      await onLike(item._id, isBlog ? 'blog' : 'post');
    } catch {
      setLiked(liked);
      setLikesCount(prev => liked ? prev + 1 : prev - 1);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    try {
      await onBookmark(item._id, isBlog ? 'blog' : 'post');
    } catch {
      setBookmarked(bookmarked);
    }
  };

  // SHARE: Toggle menu on click
  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
    setShowMoreMenu(false);
  };

  // SHARE: Handle platform selection
  const handleSharePlatform = async (e, platform) => {
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/${isBlog ? 'blog' : 'post'}/${item._id}`;
    const shareTitle = item.title || item.content?.substring(0, 50) || 'Check this out on CYBEV!';
    
    // Track share
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/blogs/${item._id}/share`, { platform }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (err) {
      console.log('Share tracking:', err);
    }
    
    // Execute share action
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Link copied!');
      }
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank', 'width=600,height=400');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  // 3-DOTS: Toggle menu
  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowMoreMenu(!showMoreMenu);
    setShowShareMenu(false);
  };

  // 3-DOTS: Edit action
  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/blog/edit/${item._id}`);
    setShowMoreMenu(false);
  };

  // 3-DOTS: Delete action
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this?')) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const endpoint = isBlog ? `/api/blogs/${item._id}` : `/api/posts/${item._id}`;
      await api.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted successfully!');
      if (onDelete) onDelete(item._id);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    }
    setShowMoreMenu(false);
  };

  const handleCardClick = () => {
    if (isBlog) {
      router.push(`/blog/${item._id}`);
    } else {
      router.push(`/post/${item._id}`);
    }
  };

  const author = item.author || item.authorId || {};
  const authorName = author.name || author.username || 'Anonymous';
  const authorUsername = author.username || 'user';
  const authorAvatar = author.avatar || author.profileImage || author.profilePicture;

  const images = item.images || item.media || (item.featuredImage ? [item.featuredImage] : []) || (item.coverImage ? [item.coverImage] : []);

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-5 cursor-pointer hover:border-purple-500/40 transition-colors relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {authorName[0]?.toUpperCase() || 'A'}
            </div>
          )}
          <div>
            <p className="text-white font-medium">{authorName}</p>
            <p className="text-gray-400 text-sm">
              @{authorUsername} · {new Date(item.createdAt).toLocaleDateString()}
              {isBlog && <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">Blog</span>}
            </p>
          </div>
        </div>
        
        {/* 3-DOTS MENU BUTTON */}
        <div className="relative">
          <button
            onClick={handleMoreClick}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          
          {/* 3-DOTS DROPDOWN MENU */}
          {showMoreMenu && (
            <div 
              className="absolute right-0 top-10 bg-gray-800 border border-purple-500/30 rounded-xl py-2 shadow-2xl z-50 min-w-[160px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/${isBlog ? 'blog' : 'post'}/${item._id}`, '_blank');
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Open in new tab
              </button>
              
              {/* EDIT & DELETE - Only show if user is owner */}
              {isOwner && (
                <>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </>
              )}
              
              {/* Report - Only show if NOT owner */}
              {!isOwner && (
                <>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success('Report submitted. We will review this content.');
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
                  >
                    <Flag className="w-4 h-4" /> Report
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {item.title && (
        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
      )}
      
      <p className="text-gray-300 mb-4 line-clamp-3">
        {item.excerpt || item.content?.replace(/<[^>]*>/g, '').slice(0, 280)}
        {(item.content?.length > 280 || item.excerpt) && (
          <span className="text-purple-400 ml-1">Read more</span>
        )}
      </p>

      {/* Images */}
      {images.length > 0 && (
        <div className={`rounded-xl overflow-hidden mb-4 ${images.length > 1 ? 'grid grid-cols-2 gap-1' : ''}`}>
          {images.slice(0, 4).map((img, idx) => (
            <div key={idx} className={`relative ${images.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
              {idx === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">+{images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 ${liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'} transition-colors`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{item.commentsCount || item.comments?.length || 0}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400">
            <Eye className="w-5 h-5" />
            <span>{item.views || 0}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
          
          {/* SHARE BUTTON WITH DROPDOWN MENU */}
          <div className="relative">
            <button
              onClick={handleShareClick}
              className="p-2 text-gray-400 hover:text-purple-400 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            {/* SHARE DROPDOWN MENU */}
            {showShareMenu && (
              <div 
                className="absolute right-0 bottom-12 bg-gray-800 border border-purple-500/30 rounded-xl py-2 shadow-2xl z-50 min-w-[170px]"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="px-4 py-1 text-xs text-gray-500 font-medium">Share to:</p>
                <button
                  onClick={(e) => handleSharePlatform(e, 'copy')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
                >
                  <Copy className="w-4 h-4" /> Copy Link
                </button>
                <button
                  onClick={(e) => handleSharePlatform(e, 'twitter')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
                >
                  <span className="w-4 text-center font-bold">𝕏</span> Twitter / X
                </button>
                <button
                  onClick={(e) => handleSharePlatform(e, 'facebook')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
                >
                  <span className="w-4 text-center text-blue-500 font-bold">f</span> Facebook
                </button>
                <button
                  onClick={(e) => handleSharePlatform(e, 'whatsapp')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
                >
                  <span className="w-4 text-center">💬</span> WhatsApp
                </button>
                <button
                  onClick={(e) => handleSharePlatform(e, 'telegram')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
                >
                  <span className="w-4 text-center">✈️</span> Telegram
                </button>
                <button
                  onClick={(e) => handleSharePlatform(e, 'linkedin')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/20 text-gray-300 text-sm transition-colors"
                >
                  <span className="w-4 text-center text-blue-400 font-bold">in</span> LinkedIn
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Feed() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('latest');
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }
    fetchFeed();
  }, [activeTab]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/feed?tab=${activeTab}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFeed(response.data.feed || response.data.posts || response.data.items || []);
    } catch (err) {
      console.error('Feed error:', err);
      // Fallback to blogs
      try {
        const blogsRes = await api.get('/api/blogs');
        setFeed(blogsRes.data.data?.blogs || blogsRes.data.blogs || []);
      } catch {}
    }
    setLoading(false);
  };

  const handleLike = async (id, type) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to like');
      return;
    }
    
    const endpoint = type === 'blog' ? `/api/blogs/${id}/like` : `/api/posts/${id}/like`;
    await api.post(endpoint, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const handleBookmark = async (id, type) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      toast.error('Please login to bookmark');
      return;
    }
    
    await api.post('/api/bookmarks', { 
      itemId: id, 
      itemType: type 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Bookmark updated!');
  };

  const handleDeleteItem = (deletedId) => {
    setFeed(prev => prev.filter(item => item._id !== deletedId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Post Composer */}
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-4 mb-6">
          <div className="flex items-center gap-3">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
            )}
            <input
              type="text"
              placeholder="What's on your mind?"
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none cursor-pointer"
              onClick={() => router.push('/post/create')}
              readOnly
            />
            <button
              onClick={() => setShowAIModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Blog
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { id: 'latest', label: 'Latest', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'following', label: 'Following', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : feed.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feed.map(item => (
              <FeedCard
                key={item._id}
                item={item}
                onLike={handleLike}
                onBookmark={handleBookmark}
                currentUserId={user?._id || user?.id}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Blog Modal */}
      <AIBlogModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </div>
  );
}
