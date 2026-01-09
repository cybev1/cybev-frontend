// ============================================
// FILE: src/pages/feed.jsx
// Feed Page - With Studio & Dashboard Navigation
// FIX: Added navigation buttons, fixed AI Blog Builder link
// ============================================

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Home,
  Users,
  Calendar,
  LayoutGrid,
  Plus,
  Search,
  MessageCircle,
  Bell,
  Radio,
  PenTool,
  Sparkles,
  Globe,
  Image as ImageIcon,
  Video,
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Loader2,
  ChevronRight,
  Layout,
  BarChart3,
  Bookmark,
  Heart,
  Send
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Navigation tabs
const NAV_TABS = [
  { id: 'home', icon: Home, label: 'Home', href: '/feed' },
  { id: 'groups', icon: Users, label: 'Groups', href: '/groups' },
  { id: 'events', icon: Calendar, label: 'Events', href: '/events' },
  { id: 'studio', icon: LayoutGrid, label: 'Studio', href: '/studio' },
];

// Quick action buttons
const QUICK_ACTIONS = [
  { id: 'live', icon: Radio, label: 'Live video', href: '/live/go-live', color: 'text-red-500' },
  { id: 'write', icon: PenTool, label: 'Write with AI', href: '/studio/ai-blog', color: 'text-purple-500' },
  { id: 'website', icon: Globe, label: 'AI Website Builder', href: '/studio/sites/new', color: 'text-pink-500' },
];

function PostCard({ post, onLike, onComment }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const author = post.author || post.authorId || {};
  const likeCount = post.likeCount || post.likes?.length || 0;
  const commentCount = post.commentCount || post.comments?.length || 0;

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(post._id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment?.(post._id, comment);
      setComment('');
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link href={`/profile/${author.username || 'user'}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            {author.avatar ? (
              <img src={author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {(author.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {author.name || 'User'}
                {author.isVerified && (
                  <span className="text-blue-500">✓</span>
                )}
              </h4>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                {timeAgo(post.createdAt)}
                {post.postType && post.postType !== 'post' && (
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full capitalize">
                    {post.postType}
                  </span>
                )}
              </p>
            </div>
          </div>
        </Link>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      {(post.title || post.content) && (
        <div className="px-4 pb-3">
          {post.title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {post.title}
            </h3>
          )}
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Media */}
      {(post.imageUrl || post.media?.[0]?.url) && (
        <div className="relative">
          <img
            src={post.imageUrl || post.media[0].url}
            alt=""
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* NFT Data */}
      {post.nftData && (
        <div className="mx-4 mb-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            NFT: {post.nftData.name}
            {post.nftData.price && (
              <span className="ml-auto">{post.nftData.price} {post.nftData.currency || 'ETH'}</span>
            )}
          </div>
        </div>
      )}

      {/* Website Data */}
      {post.websiteData && (
        <div className="mx-4 mb-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
            <Globe className="w-4 h-4" />
            Website: {post.websiteData.name}
            <a
              href={post.websiteData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-green-500 hover:underline"
            >
              Visit →
            </a>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-gray-500 text-sm border-t border-gray-100 dark:border-gray-700">
        <span>{likeCount > 0 && `${likeCount} likes`}</span>
        <span>{commentCount > 0 && `${commentCount} comments`}</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center justify-around border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            liked 
              ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <MessageSquare className="w-5 h-5" />
          Comment
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Comment Input */}
      {showComments && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="p-2 bg-purple-600 text-white rounded-full disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function VlogCard({ vlog }) {
  return (
    <Link href={vlog.isCreate ? '/vlog/create' : `/vlog/${vlog._id}`}>
      <div className="flex-shrink-0 w-28 cursor-pointer group">
        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
          {vlog.thumbnail ? (
            <img src={vlog.thumbnail} alt="" className="w-full h-full object-cover" />
          ) : vlog.isCreate ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
              <span className="text-4xl font-bold">{vlog.initial || 'P'}</span>
              <div className="absolute bottom-16 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="w-8 h-8 text-white/50" />
            </div>
          )}
          
          {/* User avatar overlay */}
          {vlog.author?.avatar && !vlog.isCreate && (
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-purple-500 overflow-hidden">
              <img src={vlog.author.avatar} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center truncate">
          {vlog.isCreate ? 'Create Vlog' : vlog.author?.name || 'User'}
        </p>
      </div>
    </Link>
  );
}

function StoryCard({ story }) {
  const isCreate = story.isCreate;
  
  return (
    <div className="flex-shrink-0 w-28 cursor-pointer group">
      <div className={`relative h-40 rounded-xl overflow-hidden ${
        isCreate 
          ? 'bg-gray-200 dark:bg-gray-700' 
          : 'bg-gradient-to-br from-orange-400 to-pink-500 ring-2 ring-orange-400'
      }`}>
        {story.image ? (
          <img src={story.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {isCreate && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
            <Plus className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center truncate">
        {isCreate ? 'Add Story' : story.author?.name || 'Story'}
      </p>
    </div>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    // Get current user
    const storedUser = localStorage.getItem('user') || localStorage.getItem('cybev_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    fetchFeed();
    fetchVlogs();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/feed`, getAuth());
      setPosts(res.data.posts || res.data || []);
    } catch (err) {
      console.error('Fetch feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/vlogs?limit=10`, getAuth());
      setVlogs(res.data.vlogs || res.data || []);
    } catch (err) {
      console.error('Fetch vlogs error:', err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setPosting(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/posts`,
        { content: postContent },
        getAuth()
      );
      if (res.data.post || res.data.ok) {
        setPosts([res.data.post || res.data, ...posts]);
        setPostContent('');
      }
    } catch (err) {
      console.error('Post error:', err);
      alert('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, getAuth());
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await axios.post(`${API_URL}/api/posts/${postId}/comment`, { content }, getAuth());
      fetchFeed(); // Refresh to show new comment
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Feed - CYBEV</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {NAV_TABS.map((tab) => (
            <Link key={tab.id} href={tab.href}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  (tab.id === 'home' && router.pathname === '/feed') || router.pathname.startsWith(tab.href)
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            </Link>
          ))}
          
          {/* Dashboard Button */}
          <Link href="/analytics">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </Link>
        </div>

        {/* Create Post Box */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <form onSubmit={handlePost}>
            <div className="flex items-start gap-3">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {(currentUser?.name || 'U')[0].toUpperCase()}
                </div>
              )}
              <input
                type="text"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write a short blog or article..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => router.push('/post/create')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ImageIcon className="w-6 h-6 text-green-500" />
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex items-center justify-around mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.id} href={action.href}>
                <button className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Vlogs/Stories Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Vlogs</h3>
            <Link href="/vlog">
              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
                See all
              </span>
            </Link>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Create Vlog Card */}
            <VlogCard 
              vlog={{ 
                isCreate: true, 
                initial: (currentUser?.name || 'P')[0].toUpperCase() 
              }} 
            />
            
            {/* Vlog Cards */}
            {vlogs.slice(0, 5).map((vlog) => (
              <VlogCard key={vlog._id} vlog={vlog} />
            ))}
            
            {/* Story placeholders */}
            {[1, 2, 3].map((i) => (
              <StoryCard key={`story-${i}`} story={{ isCreate: true }} />
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 mb-4">
              Be the first to share something!
            </p>
            <Link href="/studio/ai-blog">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Write with AI
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
