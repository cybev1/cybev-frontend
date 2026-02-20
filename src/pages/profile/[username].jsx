// ============================================
// FILE: src/pages/profile/[username].jsx
// PURPOSE: User Profile Page - FACEBOOK STYLE
// VERSION: 4.0 - Complete Facebook-like UX
// FIXES:
//   - Profile picture below cover (like Facebook)
//   - Follow button persists and shows "Following"
//   - Raw HTML content properly rendered
//   - Working view counts
//   - Message button routes correctly
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import {
  MapPin, Calendar, Link as LinkIcon, Users, FileText, 
  Heart, Grid, Settings, ArrowLeft, UserPlus, UserCheck,
  Share2, MoreHorizontal, MessageCircle, Camera, Eye,
  Globe, Briefcase, GraduationCap, Home, ChevronDown
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
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

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

      // Get current user first
      let myUserId = null;
      if (token) {
        try {
          const meRes = await axios.get(`${API}/api/users/me`, { headers });
          if (meRes.data.ok && meRes.data.user) {
            const me = meRes.data.user;
            myUserId = me._id || me.id;
            setCurrentUserId(myUserId);
          }
        } catch (err) {
          console.log('Not logged in');
        }
      }

      // Try multiple endpoints for the target user
      let userData = null;

      const endpoints = [
        `${API}/api/users/username/${username}`,
        `${API}/api/users/${username}`,
        `${API}/api/user/profile/${username}`
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await axios.get(endpoint, { headers });
          if (res.data.ok || res.data.user) {
            userData = res.data.user || res.data;
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (!userData) {
        setError('User not found');
        setLoading(false);
        return;
      }

      setUser(userData);

      // Check if own profile
      const targetUserId = userData._id || userData.id;
      const isOwn = myUserId && (
        myUserId === targetUserId || 
        userData.username?.toLowerCase() === username?.toLowerCase()
      );
      setIsOwnProfile(isOwn);

      // Check follow status - IMPORTANT: This makes follow persist
      if (token && !isOwn && targetUserId) {
        try {
          const followRes = await axios.get(`${API}/api/follow/check/${targetUserId}`, { headers });
          const followStatus = followRes.data?.isFollowing || followRes.data?.following || false;
          setIsFollowing(followStatus);
          console.log('Follow status:', followStatus);
        } catch (err) {
          console.log('Could not check follow status');
        }
      }

      // Fetch user's posts
      try {
        const postsRes = await axios.get(`${API}/api/posts/user/${targetUserId}`, { headers });
        if (postsRes.data.ok) {
          setPosts(postsRes.data.posts || []);
        }
      } catch (err) {
        // Try blogs endpoint
        try {
          const blogsRes = await axios.get(`${API}/api/blogs/user/${targetUserId}`, { headers });
          setPosts(blogsRes.data.blogs || blogsRes.data || []);
        } catch {
          console.log('Could not fetch posts');
        }
      }

    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setFollowLoading(true);
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const userId = user._id || user.id;

      if (isFollowing) {
        // Unfollow
        await axios.delete(`${API}/api/follow/${userId}`, { headers });
        setIsFollowing(false);
        setUser(prev => ({
          ...prev,
          followersCount: Math.max(0, (prev.followersCount || 0) - 1)
        }));
      } else {
        // Follow
        await axios.post(`${API}/api/follow/${userId}`, {}, { headers });
        setIsFollowing(true);
        setUser(prev => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1
        }));
      }
    } catch (err) {
      console.error('Follow error:', err);
      // Revert on error
      setIsFollowing(prev => !prev);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    // Route to messages with this user
    router.push(`/messages?user=${user.username || user._id}`);
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count || 0;
  };

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
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
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-500 mb-6">This user doesn't exist or has been removed.</p>
          <Link href="/feed" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
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

      <div className="max-w-4xl mx-auto bg-white min-h-screen">
        {/* Cover Image - Full width */}
        <div className="relative h-48 sm:h-56 md:h-72 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-b-lg overflow-hidden">
          {user.coverImage && (
            <img 
              src={user.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Cover edit button for own profile */}
          {isOwnProfile && (
            <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg text-gray-800 text-sm font-medium shadow-lg transition">
              <Camera className="w-4 h-4" />
              Edit cover
            </button>
          )}
        </div>

        {/* Profile Section - FACEBOOK STYLE */}
        <div className="relative px-4 md:px-8 pb-4">
          {/* Profile Picture - Positioned BELOW cover, overlapping */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Avatar - Overlapping cover by moving up */}
              <div className="-mt-16 md:-mt-20 relative z-10">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl">
                  {user.avatar || user.profilePicture ? (
                    <img 
                      src={user.avatar || user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl md:text-6xl font-bold">
                      {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Camera icon for own profile */}
                {isOwnProfile && (
                  <button className="absolute bottom-1 right-1 w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center shadow-lg transition border-2 border-white">
                    <Camera className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>

              {/* Name & Username - Next to avatar on desktop */}
              <div className="mt-3 md:mt-0 md:mb-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user.name || user.username}
                  </h1>
                  {user.isVerified && (
                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  )}
                </div>
                <p className="text-gray-500 text-lg">@{user.username}</p>
              </div>
            </div>

            {/* Action Buttons - Right side on desktop */}
            <div className="flex items-center gap-2 mt-4 md:mt-0 md:mb-3">
              {isOwnProfile ? (
                <>
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                  >
                    Edit profile
                  </Link>
                  <Link
                    href="/settings"
                    className="p-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  >
                    <Settings className="w-5 h-5 text-gray-700" />
                  </Link>
                </>
              ) : (
                <>
                  {/* FOLLOW BUTTON - Facebook style with state persistence */}
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition min-w-[120px] justify-center ${
                      isFollowing
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {followLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserCheck className="w-5 h-5" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Follow
                      </>
                    )}
                  </button>
                  
                  {/* Message Button */}
                  <button
                    onClick={handleMessage}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message
                  </button>
                  
                  {/* More Options */}
                  <button className="p-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                    <MoreHorizontal className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-700 mt-4 text-base whitespace-pre-wrap max-w-2xl">{user.bio}</p>
          )}

          {/* Meta Info - Icons with text */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-gray-600 text-sm">
            {user.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-500" />
                {user.location}
              </span>
            )}
            {user.occupation && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-500" />
                {user.occupation}
              </span>
            )}
            {user.website && (
              <a 
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-purple-600 hover:underline"
              >
                <Globe className="w-4 h-4" />
                {user.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-500" />
              Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Stats - Followers/Following */}
          <div className="flex gap-5 mt-4">
            <Link href={`/profile/${user.username}/following`} className="hover:underline">
              <span className="font-bold text-gray-900">{formatCount(user.followingCount || 0)}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </Link>
            <Link href={`/profile/${user.username}/followers`} className="hover:underline">
              <span className="font-bold text-gray-900">{formatCount(user.followersCount || user.followerCount || 0)}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-2" />

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 md:px-8">
          {[
            { id: 'posts', label: 'Posts', icon: Grid },
            { id: 'likes', label: 'Likes', icon: Heart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-4 border-purple-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 bg-gray-50 min-h-[300px]">
          {activeTab === 'posts' && (
            <div>
              {posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No posts yet</p>
                  {isOwnProfile && (
                    <Link 
                      href="/studio" 
                      className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Create your first post
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {posts.map(post => (
                    <Link
                      key={post._id}
                      href={`/blog/${post._id}`}
                      className="aspect-square bg-white rounded-lg overflow-hidden hover:opacity-90 transition relative group shadow-sm"
                    >
                      {post.featuredImage || post.coverImage || post.media?.[0] ? (
                        <img 
                          src={post.featuredImage || post.coverImage || post.media?.[0]?.url || post.media?.[0]} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                          <p className="text-sm text-gray-600 text-center line-clamp-4">
                            {stripHtml(post.content || post.excerpt)?.slice(0, 100)}...
                          </p>
                        </div>
                      )}
                      
                      {/* Hover overlay with stats */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white">
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-5 h-5" />
                          <span className="font-semibold">{post.likesCount || post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-5 h-5" />
                          <span className="font-semibold">{post.views || post.viewCount || 0}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="text-center py-16 bg-white rounded-xl">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Liked posts will appear here</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
