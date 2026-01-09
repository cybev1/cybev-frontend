// ============================================
// FILE: src/pages/groups/[id].jsx
// Group Detail Page - Facebook-like
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Users,
  Settings,
  MoreHorizontal,
  Image,
  Video,
  FileText,
  BarChart2,
  Calendar,
  Globe,
  Lock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Pin,
  Trash2,
  Send,
  Loader2,
  ArrowLeft,
  UserPlus,
  LogOut,
  Shield,
  Bell,
  BellOff,
  Check,
  X,
  Camera
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function PostCard({ post, onLike, onComment, onDelete, onPin, isAdmin, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await onComment(post._id, comment);
      setComment('');
    } finally {
      setSubmitting(false);
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
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-start gap-3">
        <Link href={`/profile/${post.author?.username}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden cursor-pointer">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold">{post.author?.name?.[0]}</span>
            )}
          </div>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.author?.username}`}>
              <span className="text-white font-semibold hover:underline cursor-pointer">
                {post.author?.name}
              </span>
            </Link>
            {post.isPinned && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{timeAgo(post.createdAt)}</p>
        </div>
        
        {(isAdmin || post.author?._id === currentUserId) && (
          <div className="relative group">
            <button className="p-2 hover:bg-white/10 rounded-lg">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[150px]">
              {isAdmin && (
                <button
                  onClick={() => onPin(post._id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 text-left"
                >
                  <Pin className="w-4 h-4" />
                  {post.isPinned ? 'Unpin' : 'Pin Post'}
                </button>
              )}
              <button
                onClick={() => onDelete(post._id)}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 text-left"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-white whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.media?.length > 0 && (
        <div className="px-4 pb-4">
          <div className={`grid gap-2 ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media.map((m, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                {m.type === 'image' ? (
                  <img src={m.url} alt="" className="w-full h-auto" />
                ) : m.type === 'video' ? (
                  <video src={m.url} controls className="w-full" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Poll */}
      {post.postType === 'poll' && post.poll && (
        <div className="px-4 pb-4">
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">{post.poll.question}</h4>
            <div className="space-y-2">
              {post.poll.options?.map((opt, i) => {
                const totalVotes = post.poll.options.reduce((sum, o) => sum + (o.votes?.length || 0), 0);
                const percent = totalVotes > 0 ? Math.round((opt.votes?.length || 0) / totalVotes * 100) : 0;
                return (
                  <div key={i} className="relative">
                    <div 
                      className="absolute inset-0 bg-purple-600/30 rounded-lg transition-all"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative flex items-center justify-between px-4 py-2">
                      <span className="text-white">{opt.text}</span>
                      <span className="text-gray-400 text-sm">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-t border-purple-500/20 flex items-center justify-between text-sm text-gray-500">
        <span>{post.likeCount || 0} likes</span>
        <span>{post.commentCount || 0} comments</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t border-purple-500/20 flex items-center gap-1">
        <button
          onClick={() => onLike(post._id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
            post.isLiked ? 'text-pink-500' : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
          Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-400 hover:bg-white/5 rounded-lg"
        >
          <MessageCircle className="w-5 h-5" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-400 hover:bg-white/5 rounded-lg">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 py-4 border-t border-purple-500/20">
          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-white/5 border border-purple-500/30 rounded-full text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!comment.trim() || submitting}
              className="p-2 bg-purple-600 text-white rounded-full disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.slice(0, 5).map((c, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {c.author?.avatar ? (
                    <img src={c.author.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xs font-bold">{c.author?.name?.[0]}</span>
                  )}
                </div>
                <div className="flex-1 bg-white/5 rounded-2xl px-3 py-2">
                  <p className="text-white text-sm font-semibold">{c.author?.name}</p>
                  <p className="text-gray-300 text-sm">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GroupDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user._id || user.id);
  }, []);

  useEffect(() => {
    if (id) {
      fetchGroup();
      fetchPosts();
    }
  }, [id]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchGroup = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/groups/${id}`, getAuth());
      if (res.data.ok) {
        setGroup(res.data.group);
        if (res.data.group.members) {
          setMembers(res.data.group.members.filter(m => m.status === 'active'));
        }
      }
    } catch (err) {
      console.error('Fetch group error:', err);
      if (err.response?.status === 404) {
        router.push('/groups');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/groups/${id}/posts`, getAuth());
      if (res.data.ok) {
        setPosts(res.data.posts);
      }
    } catch (err) {}
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await axios.post(`${API_URL}/api/groups/${id}/join`, {}, getAuth());
      if (res.data.ok) {
        fetchGroup();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    try {
      await axios.post(`${API_URL}/api/groups/${id}/leave`, {}, getAuth());
      router.push('/groups');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to leave');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setPosting(true);
    try {
      const res = await axios.post(`${API_URL}/api/groups/${id}/posts`, {
        content: postContent
      }, getAuth());
      if (res.data.ok) {
        setPostContent('');
        fetchPosts();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/api/groups/${id}/posts/${postId}/like`, {}, getAuth());
      fetchPosts();
    } catch (err) {}
  };

  const handleComment = async (postId, content) => {
    try {
      await axios.post(`${API_URL}/api/groups/${id}/posts/${postId}/comment`, { content }, getAuth());
      fetchPosts();
    } catch (err) {}
  };

  const handleDelete = async (postId) => {
    if (!confirm('Delete this post?')) return;
    try {
      await axios.delete(`${API_URL}/api/groups/${id}/posts/${postId}`, getAuth());
      fetchPosts();
    } catch (err) {}
  };

  const handlePin = async (postId) => {
    try {
      await axios.post(`${API_URL}/api/groups/${id}/posts/${postId}/pin`, {}, getAuth());
      fetchPosts();
    } catch (err) {}
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!group) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Group not found</h2>
          <Link href="/groups">
            <button className="text-purple-400 hover:underline">Back to Groups</button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const privacyIcon = {
    public: <Globe className="w-4 h-4" />,
    private: <Lock className="w-4 h-4" />,
    secret: <Eye className="w-4 h-4" />
  };

  return (
    <AppLayout>
      <Head>
        <title>{group.name} - CYBEV Groups</title>
      </Head>

      {/* Cover & Header */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-purple-600 to-pink-600">
          {group.coverImage && (
            <img src={group.coverImage} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 md:-mt-20">
            {/* Group Avatar */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-gray-900 flex items-center justify-center overflow-hidden">
              {group.avatar ? (
                <img src={group.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-12 h-12 md:w-16 md:h-16 text-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h1>
                {group.isVerified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  {privacyIcon[group.privacy]}
                  <span className="capitalize">{group.privacy} Group</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {group.stats?.memberCount || 0} members
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-4">
              {group.isMember ? (
                <>
                  <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLeave}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-red-500/20 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Leave
                  </button>
                  {group.isAdmin && (
                    <Link href={`/groups/${id}/settings`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                        <Settings className="w-4 h-4" />
                        Manage
                      </button>
                    </Link>
                  )}
                </>
              ) : group.hasPendingRequest ? (
                <button disabled className="px-6 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                  Request Pending
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg"
                >
                  {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {group.privacy === 'private' ? 'Request to Join' : 'Join Group'}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-purple-500/20 mt-4">
            {['posts', 'about', 'members'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="capitalize">{tab}</span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'posts' && (
              <div className="space-y-4">
                {/* Create Post */}
                {group.isMember && (
                  <form onSubmit={handlePost} className="bg-white/5 rounded-2xl border border-purple-500/20 p-4">
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Write something..."
                      rows={3}
                      className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                      <div className="flex gap-2">
                        <button type="button" className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                          <Image className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                          <Video className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                          <BarChart2 className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={!postContent.trim() || posting}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
                      >
                        {posting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Post
                      </button>
                    </div>
                  </form>
                )}

                {/* Posts List */}
                {posts.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-purple-500/20">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No posts yet</p>
                    {group.isMember && (
                      <p className="text-gray-500 text-sm mt-1">Be the first to post!</p>
                    )}
                  </div>
                ) : (
                  posts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      isAdmin={group.isAdmin}
                      currentUserId={currentUserId}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4">About this group</h2>
                <p className="text-gray-300 whitespace-pre-wrap mb-6">
                  {group.description || 'No description provided.'}
                </p>

                {group.rules?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Group Rules</h3>
                    <div className="space-y-3">
                      {group.rules.map((rule, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-4">
                          <p className="text-white font-medium">{i + 1}. {rule.title}</p>
                          {rule.description && (
                            <p className="text-gray-400 text-sm mt-1">{rule.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {group.tags?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Members ({members.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {members.map((m, i) => (
                    <Link key={i} href={`/profile/${m.user?.username}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                          {m.user?.avatar ? (
                            <img src={m.user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold">{m.user?.name?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{m.user?.name}</p>
                          <p className="text-gray-500 text-xs capitalize">{m.role}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* About Card */}
            <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-4">
              <h3 className="text-white font-semibold mb-3">About</h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                {group.description || 'No description'}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  {privacyIcon[group.privacy]}
                  <span className="capitalize">{group.privacy}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  {group.stats?.memberCount || 0} members
                </div>
                {group.category && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-lg">{CATEGORIES.find(c => c.id === group.category)?.icon || '📌'}</span>
                    <span className="capitalize">{group.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admins */}
            {group.admins?.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-4">
                <h3 className="text-white font-semibold mb-3">Admins</h3>
                <div className="space-y-2">
                  {group.admins.map((admin, i) => (
                    <Link key={i} href={`/profile/${admin.username}`}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                          {admin.avatar ? (
                            <img src={admin.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-sm">{admin.name?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{admin.name}</p>
                          <p className="text-purple-400 text-xs flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Admin
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

const CATEGORIES = [
  { id: 'general', name: 'General', icon: '💬' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'health', name: 'Health', icon: '💪' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
  { id: 'religion', name: 'Faith', icon: '🙏' },
  { id: 'other', name: 'Other', icon: '📌' }
];
