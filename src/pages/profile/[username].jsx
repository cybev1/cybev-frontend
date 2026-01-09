// ============================================
// FILE: src/pages/profile/[username].jsx
// User Profile Page with Follow System
// VERSION: 6.4.2
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import FollowButton from '@/components/FollowButton';
import FollowersModal from '@/components/FollowersModal';
import SuggestedUsers from '@/components/SuggestedUsers';
import {
  Camera,
  Settings,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Grid3X3,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Loader2,
  Edit3,
  Share2,
  Shield,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  // Modals
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers');
  
  // Cover image upload
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user._id || user.id);
  }, []);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Fetch user profile
      const res = await axios.get(`${API_URL}/api/users/username/${username}`, getAuth());
      
      if (res.data.ok || res.data.user) {
        const userData = res.data.user || res.data;
        setProfile(userData);
        
        // Check if own profile
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const ownProfile = currentUser._id === userData._id || currentUser.id === userData._id;
        setIsOwnProfile(ownProfile);
        
        // Fetch follow counts
        await fetchFollowCounts(userData._id);
        
        // Check if following (if not own profile)
        if (!ownProfile && currentUser._id) {
          await checkFollowStatus(userData._id);
        }
        
        // Fetch posts
        await fetchPosts(userData._id);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      if (err.response?.status === 404) {
        // User not found
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowCounts = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/follow/${userId}/counts`);
      if (res.data.ok) {
        setFollowersCount(res.data.followersCount);
        setFollowingCount(res.data.followingCount);
      }
    } catch (err) {
      // Use profile counts as fallback
      if (profile) {
        setFollowersCount(profile.followersCount || 0);
        setFollowingCount(profile.followingCount || 0);
      }
    }
  };

  const checkFollowStatus = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/follow/${userId}/status`, getAuth());
      if (res.data.ok) {
        setIsFollowing(res.data.isFollowing);
      }
    } catch (err) {
      console.error('Check follow status error:', err);
    }
  };

  const fetchPosts = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/posts/user/${userId}`, getAuth());
      if (res.data.ok || res.data.posts) {
        setPosts(res.data.posts || []);
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
    }
  };

  const handleFollowChange = (newIsFollowing, counts) => {
    setIsFollowing(newIsFollowing);
    if (counts?.targetFollowers !== undefined) {
      setFollowersCount(counts.targetFollowers);
    }
  };

  const openFollowersModal = (type) => {
    setFollowModalType(type);
    setShowFollowersModal(true);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large. Max 5MB.');
      return;
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'cover');

      const res = await axios.post(`${API_URL}/api/users/upload-cover`, formData, {
        ...getAuth(),
        headers: {
          ...getAuth().headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.ok || res.data.coverImage) {
        setProfile(prev => ({ ...prev, coverImage: res.data.coverImage || res.data.url }));
        
        // Update local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.coverImage = res.data.coverImage || res.data.url;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      console.error('Cover upload error:', err);
      alert('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
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

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
          <p className="text-gray-400 mb-6">This user doesn't exist or has been removed.</p>
          <Link href="/feed">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">
              Go to Feed
            </button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>{profile.name} (@{profile.username}) - CYBEV</title>
      </Head>

      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 to-pink-600">
        {profile.coverImage && (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        
        {/* Cover Upload Button */}
        {isOwnProfile && (
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm"
          >
            {uploadingCover ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            Edit Cover
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

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-16 mb-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-gray-900 overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name?.[0]}
                  </div>
                )}
              </div>
              {profile.isVerified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Info & Actions */}
            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {profile.name}
                    {profile.role === 'admin' && (
                      <Shield className="w-5 h-5 text-red-400" />
                    )}
                  </h1>
                  <p className="text-gray-400">@{profile.username}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {isOwnProfile ? (
                    <>
                      <Link href="/settings">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      </Link>
                      <Link href="/settings">
                        <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                          <Settings className="w-5 h-5" />
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <FollowButton
                        userId={profile._id}
                        initialIsFollowing={isFollowing}
                        onFollowChange={handleFollowChange}
                      />
                      <Link href={`/messages?user=${profile._id}`}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                      </Link>
                      <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{posts.length}</p>
            <p className="text-gray-400 text-sm">Posts</p>
          </div>
          <button 
            onClick={() => openFollowersModal('followers')}
            className="text-center hover:opacity-80"
          >
            <p className="text-xl font-bold text-white">{followersCount}</p>
            <p className="text-gray-400 text-sm">Followers</p>
          </button>
          <button 
            onClick={() => openFollowersModal('following')}
            className="text-center hover:opacity-80"
          >
            <p className="text-xl font-bold text-white">{followingCount}</p>
            <p className="text-gray-400 text-sm">Following</p>
          </button>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-white mb-4 whitespace-pre-wrap">{profile.bio}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </span>
          )}
          {profile.website && (
            <a 
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-400 hover:underline"
            >
              <LinkIcon className="w-4 h-4" />
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Joined {formatDate(profile.createdAt)}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-purple-500/20 mb-6">
          {[
            { id: 'posts', icon: Grid3X3, label: 'Posts' },
            { id: 'saved', icon: Bookmark, label: 'Saved' },
            { id: 'liked', icon: Heart, label: 'Liked' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 pb-8">
          {/* Posts */}
          <div className="lg:col-span-2">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-purple-500/20">
                <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No posts yet</p>
                {isOwnProfile && (
                  <Link href="/post/create">
                    <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">
                      Create your first post
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <Link key={post._id} href={`/post/${post._id}`}>
                    <div className="aspect-square bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group">
                      {post.media?.[0] ? (
                        <img 
                          src={post.media[0].url || post.media[0]} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <p className="text-white text-sm line-clamp-4">{post.content}</p>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <span className="flex items-center gap-1 text-white">
                          <Heart className="w-5 h-5 fill-white" />
                          {post.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-white">
                          <MessageCircle className="w-5 h-5 fill-white" />
                          {post.commentCount || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Suggested Users - Show only if not own profile */}
            {!isOwnProfile && <SuggestedUsers limit={5} />}
            
            {/* About Card */}
            <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-4">
              <h3 className="text-white font-semibold mb-3">About</h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-400">
                  {profile.bio || 'No bio yet'}
                </p>
                {profile.location && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Member since {formatDate(profile.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        userId={profile._id}
        type={followModalType}
        username={profile.username}
      />
    </AppLayout>
  );
}
