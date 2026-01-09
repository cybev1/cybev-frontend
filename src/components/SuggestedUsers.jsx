// ============================================
// FILE: src/components/SuggestedUsers.jsx
// Who to Follow / Suggested Users Component
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Loader2, Users } from 'lucide-react';
import axios from 'axios';
import FollowButton from './FollowButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function SuggestedUsers({ 
  limit = 5, 
  showTitle = true,
  showRefresh = true,
  className = '' 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/follow/suggestions`, {
        params: { limit },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ok) {
        setSuggestions(res.data.suggestions);
      }
    } catch (err) {
      console.error('Fetch suggestions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = (userId, isFollowing) => {
    if (isFollowing) {
      // Remove from suggestions when followed
      setSuggestions(suggestions.filter(u => u._id !== userId));
    }
  };

  if (loading) {
    return (
      <div className={`bg-white/5 rounded-2xl border border-purple-500/20 p-4 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white/5 rounded-2xl border border-purple-500/20 p-4 ${className}`}>
      {/* Header */}
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Who to Follow
          </h3>
          {showRefresh && (
            <button
              onClick={fetchSuggestions}
              className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
              title="Refresh suggestions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3"
          >
            {/* Avatar */}
            <Link href={`/profile/${user.username}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden cursor-pointer flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-sm">{user.name?.[0]}</span>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${user.username}`}>
                <p className="text-white font-medium text-sm truncate hover:underline cursor-pointer">
                  {user.name}
                </p>
              </Link>
              <p className="text-gray-500 text-xs truncate">
                {user.mutualCount > 0 
                  ? `${user.mutualCount} mutual${user.mutualCount > 1 ? 's' : ''}`
                  : `${user.followersCount || 0} followers`}
              </p>
            </div>

            {/* Follow Button */}
            <FollowButton
              userId={user._id}
              initialIsFollowing={false}
              size="small"
              onFollowChange={(isFollowing) => handleFollowChange(user._id, isFollowing)}
            />
          </div>
        ))}
      </div>

      {/* See All */}
      <Link href="/explore">
        <button className="w-full mt-4 py-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
          See more suggestions
        </button>
      </Link>
    </div>
  );
}

// Compact inline version
export function SuggestedUsersInline({ limit = 3 }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/follow/suggestions`, {
          params: { limit },
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.ok) {
          setSuggestions(res.data.suggestions);
        }
      } catch (err) {
        console.error('Fetch suggestions error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [limit]);

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      {suggestions.map((user) => (
        <Link key={user._id} href={`/profile/${user.username}`}>
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {user.name?.[0]}
                  </div>
                )}
              </div>
            </div>
            <p className="text-white text-xs font-medium truncate max-w-[80px]">
              {user.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
