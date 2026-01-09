// ============================================
// FILE: src/pages/groups/index.jsx
// Groups Discovery & Listing Page - FIXED
// FIX: Changed Grid3X3 to LayoutGrid (valid icon)
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Users,
  Plus,
  Search,
  Globe,
  Lock,
  Eye,
  ChevronRight,
  Loader2,
  Filter,
  LayoutGrid,
  List,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🌐' },
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

function GroupCard({ group, onJoin }) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);

  const handleJoin = async (e) => {
    e.stopPropagation();
    setJoining(true);
    try {
      await onJoin(group._id);
    } finally {
      setJoining(false);
    }
  };

  const privacyIcon = {
    public: <Globe className="w-4 h-4" />,
    private: <Lock className="w-4 h-4" />,
    secret: <Eye className="w-4 h-4" />
  };

  return (
    <div
      onClick={() => router.push(`/groups/${group.slug || group._id}`)}
      className="bg-white/5 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden cursor-pointer hover:border-purple-500/40 transition-all group"
    >
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
        {group.coverImage && (
          <img src={group.coverImage} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Privacy Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 rounded-full flex items-center gap-1 text-white text-xs">
          {privacyIcon[group.privacy]}
          <span className="capitalize">{group.privacy}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Avatar */}
        <div className="flex items-start gap-3 -mt-10 mb-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-gray-900 flex items-center justify-center overflow-hidden">
            {group.avatar ? (
              <img src={group.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-8 h-8 text-white" />
            )}
          </div>
        </div>

        {/* Info */}
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
          {group.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {group.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {group.stats?.memberCount || 0} members
          </span>
          {group.category && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
              {group.category}
            </span>
          )}
        </div>

        {/* Action Button */}
        {group.isMember ? (
          <Link href={`/groups/${group.slug || group._id}`}>
            <button className="w-full py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
              View Group
            </button>
          </Link>
        ) : group.hasPendingRequest ? (
          <button disabled className="w-full py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium">
            Request Pending
          </button>
        ) : (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {group.privacy === 'private' ? 'Request to Join' : 'Join Group'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchGroups();
    fetchMyGroups();
  }, [activeTab, category, sort]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab === 'my' ? 'my' : 'discover',
        category: category !== 'all' ? category : '',
        sort,
        limit: '50'
      });
      if (search) params.set('search', search);

      const res = await axios.get(`${API_URL}/api/groups?${params}`, getAuth());
      if (res.data.ok) {
        setGroups(res.data.groups);
      }
    } catch (err) {
      console.error('Fetch groups error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/groups?type=joined&limit=10`, getAuth());
      if (res.data.ok) {
        setMyGroups(res.data.groups);
      }
    } catch (err) {}
  };

  const handleJoin = async (groupId) => {
    try {
      const res = await axios.post(`${API_URL}/api/groups/${groupId}/join`, {}, getAuth());
      if (res.data.ok) {
        if (res.data.status === 'joined') {
          router.push(`/groups/${groupId}`);
        } else {
          // Refresh to show pending status
          fetchGroups();
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join group');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGroups();
  };

  return (
    <AppLayout>
      <Head>
        <title>Groups - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Groups</h1>
            <p className="text-gray-400">Connect with communities that share your interests</p>
          </div>
          <Link href="/groups/create">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tabs */}
            <div className="bg-white/5 rounded-xl border border-purple-500/20 p-4 mb-4">
              <div className="space-y-1">
                {[
                  { id: 'discover', label: 'Discover', icon: TrendingUp },
                  { id: 'joined', label: 'Your Groups', icon: Users },
                  { id: 'my', label: 'Groups You Manage', icon: Star }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white/5 rounded-xl border border-purple-500/20 p-4">
              <h3 className="text-white font-semibold mb-3">Categories</h3>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      category === cat.id
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* My Groups Quick Access */}
            {myGroups.length > 0 && (
              <div className="bg-white/5 rounded-xl border border-purple-500/20 p-4 mt-4">
                <h3 className="text-white font-semibold mb-3">Quick Access</h3>
                <div className="space-y-2">
                  {myGroups.slice(0, 5).map(group => (
                    <Link key={group._id} href={`/groups/${group.slug || group._id}`}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                          {group.avatar ? (
                            <img src={group.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{group.name}</p>
                          <p className="text-gray-500 text-xs">{group.stats?.memberCount || 0} members</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search & Filters */}
            <div className="bg-white/5 rounded-xl border border-purple-500/20 p-4 mb-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search groups..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="popular" className="bg-gray-900">Most Popular</option>
                  <option value="recent" className="bg-gray-900">Recently Created</option>
                  <option value="active" className="bg-gray-900">Most Active</option>
                  <option value="alphabetical" className="bg-gray-900">A-Z</option>
                </select>
                <div className="flex border border-purple-500/30 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Groups Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No groups found</h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === 'my' 
                    ? "You haven't created any groups yet" 
                    : activeTab === 'joined'
                    ? "You haven't joined any groups yet"
                    : "Try a different search or category"}
                </p>
                <Link href="/groups/create">
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold">
                    Create a Group
                  </button>
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-4' 
                : 'space-y-4'
              }>
                {groups.map(group => (
                  <GroupCard key={group._id} group={group} onJoin={handleJoin} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
