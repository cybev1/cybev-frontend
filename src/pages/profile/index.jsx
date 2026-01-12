// ============================================
// FILE: src/pages/profile/index.jsx
// CYBEV Profile Page - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  Settings, Edit3, Camera, MapPin, Link as LinkIcon, Calendar, Grid, Bookmark, Heart,
  Users, Mail, ExternalLink, Loader2, Plus, Share2, MoreHorizontal, Check, X, Coins
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, tokens: 0 });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }
      const res = await api.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.ok || res.data.user) {
        const userData = res.data.user || res.data;
        setUser(userData);
        setStats({
          posts: userData.postsCount || userData.blogCount || 0,
          followers: userData.followersCount || userData.followers?.length || 0,
          following: userData.followingCount || userData.following?.length || 0,
          tokens: userData.tokenBalance || userData.cybevTokens || 0
        });
        localStorage.setItem('user', JSON.stringify(userData));
      }
      // Fetch user's posts
      const postsRes = await api.get('/api/blogs/my', { headers: { Authorization: `Bearer ${token}` } });
      setPosts(postsRes.data.blogs || postsRes.data || []);
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: Grid },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'liked', label: 'Liked', icon: Heart }
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head><title>{user?.name || 'Profile'} | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        {/* Cover Photo */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 to-pink-600">
          {user?.coverPhoto && <img src={user.coverPhoto} alt="" className="w-full h-full object-cover" />}
          <button className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
            <Camera className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Avatar */}
                <div className="relative -mt-20 md:-mt-24">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-lg">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0] || 'U'
                    )}
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                      <p className="text-gray-500">@{user?.username}</p>
                      {user?.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        {user?.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user.location}</span>
                        )}
                        {user?.website && (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-600 hover:underline">
                            <LinkIcon className="w-4 h-4" />{user.website.replace(/https?:\/\//, '')}
                          </a>
                        )}
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/settings">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />Edit Profile
                        </button>
                      </Link>
                      <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                        <Share2 className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.followers}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.following}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{stats.tokens}</p>
                  <p className="text-sm text-gray-500">CYBEV</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex border-b border-gray-100">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
                    activeTab === tab.id ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <tab.icon className="w-5 h-5" />{tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === 'posts' && (
                posts.length === 0 ? (
                  <div className="text-center py-12">
                    <Grid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">Share your first post with the world!</p>
                    <Link href="/studio">
                      <button className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                        <Plus className="w-4 h-4 inline mr-2" />Create Post
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {posts.map(post => (
                      <Link key={post._id} href={`/blog/${post._id}`}>
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer">
                          {post.featuredImage ? (
                            <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                              <Grid className="w-8 h-8 text-purple-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex items-center gap-4 text-white">
                              <span className="flex items-center gap-1"><Heart className="w-5 h-5" />{post.likesCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}
              {activeTab === 'saved' && (
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No saved posts</h3>
                  <p className="text-gray-500">Posts you save will appear here</p>
                </div>
              )}
              {activeTab === 'liked' && (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No liked posts</h3>
                  <p className="text-gray-500">Posts you like will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
