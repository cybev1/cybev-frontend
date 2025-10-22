// ============================================
// FILE: src/pages/profile/[username].jsx
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { blogAPI, followAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  User, Eye, BookOpen, Heart, TrendingUp, Users, UserPlus, UserCheck
} from 'lucide-react';

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [blogs, setBlogs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    following: 0
  });
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchUserBlogs();
    }
  }, [username]);

  useEffect(() => {
    if (userProfile && currentUser && userProfile._id !== currentUser._id) {
      checkFollowStatus();
    }
  }, [userProfile, currentUser]);

  const checkFollowStatus = async () => {
    try {
      const response = await followAPI.checkFollowing(userProfile._id);
      if (response.data.ok) {
        setIsFollowing(response.data.isFollowing);
      }
    } catch (error) {
      console.error('Failed to check follow status');
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      router.push('/auth/login');
      return;
    }

    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userProfile._id);
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
        toast.success(`Unfollowed ${username}`);
      } else {
        await followAPI.followUser(userProfile._id);
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        toast.success(`Following ${username}`);
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  const fetchUserBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getBlogs({ author: username });
      if (response.data.ok) {
        const userBlogs = response.data.blogs;
        setBlogs(userBlogs);

        if (userBlogs.length > 0 && userBlogs[0].author) {
          setUserProfile(userBlogs[0].author);
        }

        const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);

        setStats({
          totalBlogs: userBlogs.length,
          totalViews,
          totalLikes,
          followers: userBlogs[0]?.author?.followerCount || 0,
          following: userBlogs[0]?.author?.followingCount || 0
        });
      }
    } catch (error) {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    );
  }

  const displayName = userProfile?.name || username || 'User';
  const isOwnProfile = currentUser && userProfile && currentUser._id === userProfile._id;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-purple-600 text-5xl font-bold shadow-xl">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h1 className="text-4xl font-bold">{displayName}</h1>
                  {!isOwnProfile && currentUser && (
                    <button
                      onClick={handleFollowToggle}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isFollowing
                          ? 'bg-white/20 hover:bg-white/30'
                          : 'bg-white text-purple-600 hover:bg-gray-100'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-purple-100 mb-4">@{username}</p>
                <p className="text-purple-100 mb-4">{userProfile?.bio || 'Content Creator & Writer'}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{stats.totalBlogs} blogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{stats.totalViews} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{stats.totalLikes} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{stats.followers} followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{stats.following} following</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Blogs</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Views</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Likes</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLikes}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Published Articles</h2>
            <span className="text-gray-500">{stats.totalBlogs} posts</span>
          </div>

          {blogs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs yet</h3>
              <p className="text-gray-500">This user hasn't published any blogs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog._id}`}>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer h-full">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3">
                      {blog.category}
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors">
                      {blog.title}
                    </h3>

                    <div
                      className="text-gray-600 text-sm mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                      }}
                    />

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {blog.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {blog.likes?.length || 0}
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
