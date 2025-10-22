// ============================================
// FILE: src/pages/feed.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { feedAPI, followAPI } from '@/lib/api';
import { Sparkles, Users, TrendingUp, Eye, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';

export default function FeedPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('mixed');
  const [blogs, setBlogs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchFeed();
    fetchSuggestions();
  }, [activeTab, page]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'following') {
        response = await feedAPI.getFollowingFeed({ page, limit: 10 });
      } else {
        response = await feedAPI.getMixedFeed({ page, limit: 10 });
      }

      if (response.data.ok) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await followAPI.getSuggestions({ limit: 5 });
      if (data.ok) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const tabs = [
    { id: 'mixed', label: 'For You', icon: Sparkles },
    { id: 'following', label: 'Following', icon: Users },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setPage(1);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <FeedSkeleton />
              ) : blogs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeTab === 'following' ? 'No Posts from Following' : 'No Posts Available'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'following'
                      ? 'Follow users to see their posts here'
                      : 'Be the first to create a post!'}
                  </p>
                  <Link href="/blog">
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                      Discover Users
                    </button>
                  </Link>
                </div>
              ) : (
                blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)
              )}

              {/* Load More */}
              {blogs.length >= 10 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setPage(page + 1)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Suggested Users */}
              {suggestions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Suggested Users
                  </h3>
                  <div className="space-y-4">
                    {suggestions.map(user => (
                      <Link key={user._id} href={`/profile/${user.username}`}>
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{user.name}</p>
                            <p className="text-xs text-gray-600">@{user.username}</p>
                            <p className="text-xs text-gray-500">{user.followerCount || 0} followers</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/blog/create">
                    <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left">
                      ✍️ Write a Post
                    </button>
                  </Link>
                  <Link href="/blog">
                    <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left">
                      🔍 Explore Blogs
                    </button>
                  </Link>
                  <Link href="/bookmarks">
                    <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left">
                      🔖 My Bookmarks
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function BlogCard({ blog }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
      {/* Author Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-100">
        <Link href={`/profile/${blog.author?.username || 'user'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">
            {blog.author?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Link>
        <div className="flex-1">
          <Link href={`/profile/${blog.author?.username || 'user'}`}>
            <p className="font-semibold hover:text-purple-600 transition-colors cursor-pointer">
              {blog.author?.name || 'Unknown'}
            </p>
          </Link>
          <p className="text-sm text-gray-600">
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <Link href={`/blog/${blog._id}`}>
        <div className="p-6 cursor-pointer">
          <h2 className="text-2xl font-bold mb-3 hover:text-purple-600 transition-colors">
            {blog.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {blog.content?.replace(/<[^>]*>/g, '').substring(0, 200)}...
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm">{blog.views || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">{blog.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{blog.commentCount || 0}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
    </>
  );
}
