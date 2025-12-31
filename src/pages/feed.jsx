// ============================================
// FILE: src/pages/feed.jsx
// PURPOSE: Feed page with AI Blog Generator button
// ============================================

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Clock, TrendingUp, Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Eye, Sparkles, Plus, Image as ImageIcon, Video, FileText, Loader2, RefreshCw,
  ChevronDown, X, Send, Wand2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Quick Post Composer
function QuickComposer({ onPost, user }) {
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await onPost(content);
      setContent('');
    } catch (err) {
      toast.error('Failed to post');
    }
    setPosting(false);
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {user?.name?.[0] || user?.username?.[0] || 'U'}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none min-h-[60px]"
            rows={2}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-purple-400">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-purple-400">
                <Video className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim() || posting}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Blog Generator Modal
function AIBlogModal({ isOpen, onClose }) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/blogs/generate', {
        topic,
        tone,
        length,
        autoPublish: false
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 120000 // 2 minute timeout for AI generation
      });

      if (response.data.ok && response.data.blog) {
        toast.success('Blog generated! Redirecting to editor...');
        onClose();
        // Navigate to edit the generated blog
        router.push(`/blog/edit/${response.data.blog._id}`);
      } else if (response.data.blogId) {
        toast.success('Blog generated!');
        onClose();
        router.push(`/blog/edit/${response.data.blogId}`);
      } else {
        throw new Error(response.data.error || 'Generation failed');
      }
    } catch (err) {
      console.error('AI generation error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to generate blog';
      toast.error(errorMsg);
    }
    setGenerating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Blog Generator</h3>
              <p className="text-gray-400 text-sm">Create a blog post with AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Topic / Title *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of Web3 Technology"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="educational">Educational</option>
              <option value="persuasive">Persuasive</option>
              <option value="storytelling">Storytelling</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Length</label>
            <div className="grid grid-cols-3 gap-2">
              {['short', 'medium', 'long'].map((len) => (
                <button
                  key={len}
                  onClick={() => setLength(len)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    length === len
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
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

// Feed Post Card
function FeedCard({ item, onLike, onBookmark }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes?.length || item.likesCount || 0);

  const isPost = item.contentType === 'post' || !item.title;
  const isBlog = item.contentType === 'blog' || item.title;

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

  const handleClick = () => {
    if (isBlog) {
      router.push(`/blog/${item._id}`);
    } else {
      router.push(`/post/${item._id}`);
    }
  };

  const author = item.author || item.authorId || {};
  const authorName = author.name || author.username || 'Anonymous';
  const authorUsername = author.username || 'user';
  const authorAvatar = author.avatar || author.profileImage;

  // Get images from various possible fields
  const images = item.images || item.media || (item.featuredImage ? [item.featuredImage] : []) || (item.coverImage ? [item.coverImage] : []);

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-5 cursor-pointer hover:border-purple-500/40 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {authorName[0]}
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
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
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

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 ${liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400">
            <MessageCircle className="w-5 h-5" />
            <span>{item.commentsCount || item.comments?.length || 0}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-green-400">
            <Eye className="w-5 h-5" />
            <span>{item.views || 0}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg ${bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-gray-400 hover:text-purple-400 rounded-lg"
          >
            <Share2 className="w-5 h-5" />
          </button>
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
      // Try blogs as fallback
      try {
        const blogsRes = await api.get('/api/blogs');
        setFeed(blogsRes.data.blogs || []);
      } catch {}
    }
    setLoading(false);
  };

  const handlePost = async (content) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    await api.post('/api/posts', { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Posted!');
    fetchFeed();
  };

  const handleLike = async (id, type) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    const endpoint = type === 'blog' ? `/api/blogs/${id}/like` : `/api/posts/${id}/like`;
    await api.post(endpoint, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const handleBookmark = async (id, type) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    await api.post('/api/bookmarks', { 
      contentId: id, 
      contentType: type 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Bookmarked!');
  };

  const tabs = [
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'following', label: 'Following', icon: Users }
  ];

  return (
    <AppLayout>
      <Head>
        <title>Feed - CYBEV</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Quick Composer */}
        {user && <QuickComposer onPost={handlePost} user={user} />}

        {/* Tabs with AI Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* AI Blog Generator Button */}
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">AI Blog</span>
          </button>
        </div>

        {/* Feed Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : feed.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No posts yet</p>
            <button
              onClick={() => setShowAIModal(true)}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {feed.map((item) => (
              <FeedCard
                key={item._id}
                item={item}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && feed.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={fetchFeed}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
              Load More
            </button>
          </div>
        )}
      </div>

      {/* AI Blog Modal */}
      <AIBlogModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </AppLayout>
  );
}
