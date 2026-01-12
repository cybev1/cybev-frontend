// ============================================
// FILE: src/pages/profile/[username].jsx
// PURPOSE: Public User Profile Page (FIXED)
// Handles: /profile/prince, /profile/john, etc.
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import {
  MapPin, Calendar, Link as LinkIcon, Users, FileText, 
  Heart, Grid, Settings, ArrowLeft, UserPlus, UserMinus,
  Share2, MoreHorizontal, MessageCircle
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function UserProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Try multiple endpoints for compatibility
      let userData = null;
      let lastError = null;

      // Try /api/users/username/:username first
      try {
        const res = await axios.get(`${API}/api/users/username/${username}`, { headers });
        if (res.data.ok) userData = res.data.user;
      } catch (err) {
        lastError = err;
        console.log('Trying fallback endpoint...');
      }

      // Fallback to /api/users/:username
      if (!userData) {
        try {
          const res = await axios.get(`${API}/api/users/${username}`, { headers });
          if (res.data.ok) userData = res.data.user;
        } catch (err) {
          lastError = err;
          console.log('Trying another fallback...');
        }
      }

      // Fallback to /api/user/profile/:username
      if (!userData) {
        try {
          const res = await axios.get(`${API}/api/user/profile/${username}`, { headers });
          if (res.data.ok) userData = res.data.user;
        } catch (err) {
          lastError = err;
        }
      }

      if (!userData) {
        setError('User not found');
        setLoading(false);
        return;
      }

      setUser(userData);

      // Check if this is the current user's own profile
      if (token) {
        try {
          const meRes = await axios.get(`${API}/api/users/me`, { headers });
          if (meRes.data.ok && meRes.data.user) {
            const currentUser = meRes.data.user;
            setIsOwnProfile(
              currentUser._id === userData._id || 
              currentUser.id === userData._id ||
              currentUser.username?.toLowerCase() === username?.toLowerCase()
            );
          }
        } catch (err) {
          // Not logged in, that's fine
        }
      }

      // Fetch user's posts
      try {
        const postsRes = await axios.get(`${API}/api/posts/user/${userData._id || userData.id}`, { headers });
        if (postsRes.data.ok) {
          setPosts(postsRes.data.posts || []);
        }
      } catch (err) {
        console.log('Could not fetch posts');
      }

    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`${API}/api/follow/${user._id || user.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFollowing(!isFollowing);
      setUser(prev => ({
        ...prev,
        followersCount: isFollowing 
          ? (prev.followersCount || 0) - 1 
          : (prev.followersCount || 0) + 1
      }));
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count || 0;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-900 mb-2">
            User not found
          </h2>
          <p className="text-gray-500 mb-6">
            This user doesn't exist or has been removed.
          </p>
          <Link
            href="/feed"
            className="px-6 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700"
          >
            Go to Feed
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>{user.name || user.username} (@{user.username}) | CYBEV</title>
        <meta name="description" content={user.bio || `${user.name || user.username}'s profile on CYBEV`} />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 to-pink-600 rounded-b-xl overflow-hidden">
          {user.coverImage && (
            <img 
              src={user.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 md:px-6">
          {/* Avatar & Actions */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-900 text-4xl font-bold">
                    {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {isOwnProfile ? (
                <>
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="p-2 border border-gray-200 dark:border-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-50"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                        : 'bg-purple-600 text-gray-900 hover:bg-purple-700'
                    }`}
                  >
                    {isFollowing ? (
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
                  <Link
                    href={`/messages/${user.username}`}
                    className="p-2 border border-gray-200 dark:border-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  <button className="p-2 border border-gray-200 dark:border-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-50">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name & Username */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">
                {user.name || user.username}
              </h1>
              {user.isVerified && (
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
            </div>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-700 dark:text-gray-600 mb-4 whitespace-pre-wrap">{user.bio}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </span>
            )}
            {user.website && (
              <a 
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-600 hover:underline"
              >
                <LinkIcon className="w-4 h-4" />
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-gray-900">
                {formatCount(user.postsCount || posts.length)}
              </p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <Link href={`/profile/${user.username}/followers`} className="text-center hover:opacity-80">
              <p className="text-xl font-bold text-gray-900 dark:text-gray-900">
                {formatCount(user.followersCount || user.followerCount || 0)}
              </p>
              <p className="text-sm text-gray-500">Followers</p>
            </Link>
            <Link href={`/profile/${user.username}/following`} className="text-center hover:opacity-80">
              <p className="text-xl font-bold text-gray-900 dark:text-gray-900">
                {formatCount(user.followingCount || 0)}
              </p>
              <p className="text-sm text-gray-500">Following</p>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-200 mb-6">
            {[
              { id: 'posts', label: 'Posts', icon: Grid },
              { id: 'likes', label: 'Likes', icon: Heart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'posts' && (
            <div>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No posts yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                  {posts.map(post => (
                    <Link
                      key={post._id}
                      href={`/post/${post._id}`}
                      className="aspect-square bg-gray-100 dark:bg-white rounded-lg overflow-hidden hover:opacity-80 transition"
                    >
                      {post.media?.[0] ? (
                        <img src={post.media[0].url || post.media[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-2 text-xs text-gray-500">
                          {post.content?.slice(0, 50)}...
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">Liked posts will appear here</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
