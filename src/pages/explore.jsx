// ============================================
// FILE: src/pages/explore.jsx
// Explore/Discover Users Page
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, Search, Users, UserPlus, UserCheck, 
  Loader2, Filter, TrendingUp, Sparkles
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [followingStates, setFollowingStates] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [activeTab, setActiveTab] = useState('suggested');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/follow/suggestions?limit=50', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data?.suggestions) {
        setSuggestions(response.data.suggestions);
        
        // Check follow status for each user
        if (token) {
          const states = {};
          for (const s of response.data.suggestions) {
            try {
              const checkRes = await api.get(`/api/follow/check/${s._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              states[s._id] = checkRes.data?.following || false;
            } catch {
              states[s._id] = false;
            }
          }
          setFollowingStates(states);
        }
      }
    } catch (error) {
      console.error('Fetch suggestions error:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const response = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data?.users || []);
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearching(false);
  };

  const handleFollow = async (userId, userName) => {
    if (!user) {
      toast.info('Please login to follow users');
      router.push('/login');
      return;
    }

    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const isFollowing = followingStates[userId];
      
      if (isFollowing) {
        await api.delete(`/api/follow/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowingStates(prev => ({ ...prev, [userId]: false }));
        toast.success(`Unfollowed ${userName}`);
      } else {
        await api.post(`/api/follow/${userId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowingStates(prev => ({ ...prev, [userId]: true }));
        toast.success(`Following ${userName}!`);
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to update follow status');
    }
    
    setFollowLoading(prev => ({ ...prev, [userId]: false }));
  };

  const displayUsers = searchQuery.trim() ? searchResults : suggestions;

  return (
    <>
      <Head>
        <title>Explore | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Explore</h1>
          </div>
        </header>

        {/* Search */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex gap-6">
              {[
                { id: 'suggested', label: 'Suggested', icon: Sparkles },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
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
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No users found' : 'No suggestions yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Check back later for suggestions'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {searchQuery ? `Results for "${searchQuery}"` : 'People you may know'}
                </h2>
                <span className="text-gray-500 text-sm">{displayUsers.length} users</span>
              </div>

              {/* User Cards */}
              {displayUsers.map(person => {
                const isFollowing = followingStates[person._id];
                const isLoading = followLoading[person._id];
                
                return (
                  <div
                    key={person._id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <Link href={`/profile/${person.username || person._id}`}>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 overflow-hidden cursor-pointer">
                          {person.profilePicture || person.avatar ? (
                            <img 
                              src={person.profilePicture || person.avatar} 
                              alt="" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                              {person.name?.[0] || 'U'}
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/profile/${person.username || person._id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-purple-600 cursor-pointer">
                            {person.name || person.username}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm">@{person.username || 'user'}</p>
                        {person.bio && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-1">{person.bio}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>{person.followersCount || 0} followers</span>
                          <span>{person.blogsCount || 0} posts</span>
                        </div>
                      </div>
                      
                      {/* Follow Button */}
                      <button
                        onClick={() => handleFollow(person._id, person.name)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
                          isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isFollowing ? (
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </button>
          </Link>
          
          <button className="flex flex-col items-center py-2 px-4 text-purple-600">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </button>
          
          <Link href="/create">
            <button className="relative -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
          </Link>
          
          <Link href="/tv">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs mt-1">TV</span>
            </button>
          </Link>
          
          <Link href="/menu">
            <button className="flex flex-col items-center py-2 px-4 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs mt-1">Menu</span>
            </button>
          </Link>
        </nav>
      </div>
    </>
  );
}
