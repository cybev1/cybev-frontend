// ============================================
// FILE: src/pages/profile/index.jsx
// PURPOSE: User Profile Page - FIXED
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  User, Settings, Edit, Camera, MapPin, Calendar, Link as LinkIcon,
  Grid, BookOpen, Video, Heart, Users, Award, Share2, CheckCircle
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Try /api/users/me first
      let res = await fetch(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let data = await res.json();
      
      // If that fails, try /api/auth/me
      if (!data.ok || !data.user) {
        res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        data = await res.json();
      }
      
      if (data.ok && data.user) {
        setUser(data.user);
        setStats({
          posts: data.user.postsCount || 0,
          followers: data.user.followersCount || data.user.followers?.length || 0,
          following: data.user.followingCount || data.user.following?.length || 0
        });
        fetchUserPosts(data.user._id);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/posts?userId=${userId}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
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

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <User className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-500 mb-4">You need to be logged in to view your profile</p>
          <Link href="/auth/login" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Log In
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>{user.name || user.username} | CYBEV</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Cover */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 to-pink-600 rounded-b-xl">
          {user.coverImage && (
            <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover rounded-b-xl" />
          )}
        </div>

        {/* Profile Header */}
        <div className="px-4 md:px-6 pb-4 -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {(user.name || user.username)?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Name & Actions */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name || user.username}
                  </h1>
                  {user.isVerified && <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />}
                </div>
                <p className="text-gray-500">@{user.username}</p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <Link href="/settings/profile" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl">{user.bio}</p>}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            {user.location && (
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user.location}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCount(stats.posts)}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCount(stats.followers)}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCount(stats.following)}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mt-4">
          <div className="flex gap-1 px-4 overflow-x-auto">
            {[
              { id: 'posts', label: 'Posts', icon: Grid },
              { id: 'blogs', label: 'Blogs', icon: BookOpen },
              { id: 'videos', label: 'Videos', icon: Video },
              { id: 'likes', label: 'Likes', icon: Heart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Grid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No posts yet</p>
              <Link href="/post/create" className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {posts.map(post => (
                <Link key={post._id} href={`/post/${post._id}`} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hover:opacity-90">
                  {post.media?.[0] ? (
                    <img src={post.media[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <p className="text-xs text-gray-500 line-clamp-4 text-center">{post.content}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
