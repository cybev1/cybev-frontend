// ============================================
// FILE: src/components/FollowersModal.jsx
// Modal to display followers/following lists
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Search, Loader2, UserMinus } from 'lucide-react';
import axios from 'axios';
import FollowButton from './FollowButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function FollowersModal({
  isOpen,
  onClose,
  userId,
  type = 'followers', // 'followers' or 'following'
  username
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user._id || user.id);
  }, []);

  useEffect(() => {
    if (isOpen && userId) {
      setUsers([]);
      setPage(1);
      fetchUsers(1, true);
    }
  }, [isOpen, userId, type]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchUsers = async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const endpoint = type === 'followers' 
        ? `${API_URL}/api/follow/${userId}/followers`
        : `${API_URL}/api/follow/${userId}/following`;
      
      const res = await axios.get(endpoint, {
        params: { page: pageNum, limit: 20, search },
        ...getAuth()
      });

      if (res.data.ok) {
        const newUsers = type === 'followers' ? res.data.followers : res.data.following;
        setUsers(reset ? newUsers : [...users, ...newUsers]);
        setTotal(res.data.pagination.total);
        setHasMore(pageNum < res.data.pagination.pages);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  const handleRemoveFollower = async (followerId) => {
    if (!confirm('Remove this follower? They won\'t be notified.')) return;
    
    try {
      await axios.delete(
        `${API_URL}/api/follow/${followerId}/remove-follower`,
        getAuth()
      );
      // Remove from list
      setUsers(users.filter(u => u._id !== followerId));
      setTotal(prev => prev - 1);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove follower');
    }
  };

  const handleFollowChange = (targetUserId, isFollowing) => {
    setUsers(users.map(u => 
      u._id === targetUserId ? { ...u, isFollowing } : u
    ));
  };

  if (!isOpen) return null;

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-purple-500/20 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h2 className="text-xl font-bold text-white capitalize">
            {type} {total > 0 && <span className="text-gray-400 font-normal">({total})</span>}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-purple-500/20">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </form>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {type === 'followers' 
                  ? 'No followers yet' 
                  : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
                >
                  {/* Avatar */}
                  <Link href={`/profile/${user.username}`} onClick={onClose}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden cursor-pointer">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold">{user.name?.[0]}</span>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${user.username}`} onClick={onClose}>
                      <p className="text-white font-semibold truncate hover:underline cursor-pointer">
                        {user.name}
                      </p>
                    </Link>
                    <p className="text-gray-500 text-sm truncate">@{user.username}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!user.isMe && (
                      <FollowButton
                        userId={user._id}
                        initialIsFollowing={user.isFollowing}
                        size="small"
                        onFollowChange={(isFollowing) => handleFollowChange(user._id, isFollowing)}
                      />
                    )}
                    
                    {/* Remove follower button (only for own profile's followers) */}
                    {type === 'followers' && isOwnProfile && !user.isMe && (
                      <button
                        onClick={() => handleRemoveFollower(user._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400"
                        title="Remove follower"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full py-3 text-purple-400 hover:text-purple-300 font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Load more'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
