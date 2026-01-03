// ============================================
// FILE: src/pages/profile/[username].jsx
// User Profile Page with Follow & Image Upload
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Settings, Edit, Camera, Users, Eye, Heart, BookOpen,
  Loader2, UserPlus, UserMinus, Share2, MoreHorizontal, ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Relative time utility
function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    blogs: 0,
    views: 0,
    likes: 0,
    followers: 0,
    following: 0
  });

  const isOwnProfile = currentUser && profileUser && 
    (currentUser._id === profileUser._id || currentUser.id === profileUser._id ||
     currentUser.username === profileUser.username);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    if (profileUser && currentUser && !isOwnProfile) {
      checkFollowStatus();
    }
  }, [profileUser, currentUser]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Try to fetch by username first
      const response = await api.get(`/api/users/profile/${username}`);
      
      if (response.data?.user || response.data) {
        const user = response.data.user || response.data;
        setProfileUser(user);
        setStats({
          blogs: user.blogsCount || response.data.blogsCount || 0,
          views: user.totalViews || response.data.totalViews || 0,
          likes: user.totalLikes || response.data.totalLikes || 0,
          followers: user.followersCount || user.followers?.length || 0,
          following: user.followingCount || user.following?.length || 0
        });
        
        // Fetch user's blogs
        fetchUserBlogs(user._id);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Profile not found');
      router.push('/feed');
    }
    setLoading(false);
  };

  const fetchUserBlogs = async (userId) => {
    try {
      const response = await api.get(`/api/blogs/user/${userId}?limit=10`);
      if (response.data?.blogs) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log('Blogs fetch error:', error);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (!token || !profileUser?._id) return;

      const response = await api.get(`/api/follow/check/${profileUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(response.data?.following || false);
    } catch (error) {
      console.log('Follow check error:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.info('Please login to follow');
      router.push('/login');
      return;
    }

    if (isOwnProfile) return;

    setFollowLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');

      if (isFollowing) {
        await api.delete(`/api/follow/${profileUser._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers: Math.max(0, prev.followers - 1) }));
        toast.success(`Unfollowed ${profileUser.name || profileUser.username}`);
      } else {
        await api.post(`/api/follow/${profileUser._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        toast.success(`Following ${profileUser.name || profileUser.username}!`);
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error(error.response?.data?.error || 'Failed to update follow status');
    }
    setFollowLoading(false);
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    setUploadingProfile(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/upload/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.url) {
        setProfileUser(prev => ({ ...prev, profilePicture: response.data.url }));
        // Update local storage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.profilePicture = response.data.url;
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      toast.error('Failed to upload profile picture');
    }
    setUploadingProfile(false);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    setUploadingCover(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/upload/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.url) {
        setProfileUser(prev => ({ ...prev, coverImage: response.data.url }));
        toast.success('Cover image updated!');
      }
    } catch (error) {
      toast.error('Failed to upload cover image');
    }
    setUploadingCover(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{profileUser.name || profileUser.username} | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-purple-600 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <span className="text-white font-bold text-xl cursor-pointer">CYBEV</span>
              </Link>
            </div>
            {isOwnProfile && (
              <Link href="/settings">
                <button className="text-white">
                  <Settings className="w-6 h-6" />
                </button>
              </Link>
            )}
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-500">
          {profileUser.coverImage && (
            <img
              src={profileUser.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          {isOwnProfile && (
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              {uploadingCover ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            </button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />
        </div>

        {/* Profile Info */}
        <div className="relative px-4 pb-4">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  {profileUser.profilePicture || profileUser.avatar ? (
                    <img
                      src={profileUser.profilePicture || profileUser.avatar}
                      alt={profileUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {(profileUser.name || profileUser.username)?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => profileInputRef.current?.click()}
                  disabled={uploadingProfile}
                  className="absolute bottom-1 right-1 p-2 bg-purple-600 rounded-full text-white shadow-lg hover:bg-purple-700"
                >
                  {uploadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
              )}
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Name & Username */}
          <div className="pt-20 text-center">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {profileUser.name || profileUser.username}
              </h1>
              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {followLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4" />
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
            <p className="text-gray-500">@{profileUser.username}</p>
            {profileUser.bio && (
              <p className="text-gray-700 mt-2">{profileUser.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{stats.blogs} blogs</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{stats.views} views</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Heart className="w-4 h-4" />
              <span>{stats.likes} likes</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600">
              <Users className="w-4 h-4" />
              <span>{stats.followers} followers</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600">
              <span>{stats.following} following</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-500 text-xs">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.blogs}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-500 text-xs">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <p className="text-gray-500 text-xs">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.likes}</p>
            </div>
          </div>
        </div>

        {/* Published Articles */}
        <div className="px-4 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Published Articles</h2>
            <span className="text-sm text-gray-500">{blogs.length} posts</span>
          </div>

          {blogs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No articles yet</p>
              {isOwnProfile && (
                <Link href="/studio">
                  <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold">
                    Write your first blog
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {blogs.map(blog => (
                <Link key={blog._id} href={`/blog/${blog._id}`}>
                  <div className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition">
                    <div className="flex gap-3">
                      {blog.featuredImage && (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{getRelativeTime(blog.createdAt)}</span>
                          <span>·</span>
                          <span>{blog.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </button>
          </Link>
          
          <Link href="/search">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs mt-1">Search</span>
            </button>
          </Link>
          
          <Link href="/create">
            <button className="relative -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
          </Link>
          
          <Link href="/notifications">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-xs mt-1">Alerts</span>
            </button>
          </Link>
          
          <button className="flex flex-col items-center py-2 px-4 text-purple-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </nav>
      </div>
    </>
  );
}
