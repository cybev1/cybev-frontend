import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { followAPI } from '@/lib/api';
import FollowButton from './FollowButton';

/**
 * SuggestedUsers
 * - Backend: GET /api/follow/suggestions
 */
export default function SuggestedUsers({ title = 'Suggested Creators', limit = 5 }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data } = await followAPI.getSuggestions();
      if (data?.ok) {
        const list = Array.isArray(data.suggestions) ? data.suggestions : [];
        setUsers(list.slice(0, limit));
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-6 shadow-xl">
      <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        {title}
      </h3>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-100 rounded mt-2" />
                </div>
              </div>
              <div className="h-9 w-20 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-sm text-gray-600">
          No suggestions yet. Engage more to get personalized recommendations.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => {
            const displayName = u?.name || u?.username || u?.email?.split('@')?.[0] || 'Creator';
            const username = u?.username || displayName.toLowerCase().replace(/\s+/g, '');
            const initial = (displayName?.[0] || 'C').toUpperCase();

            return (
              <div key={u._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-800 truncate">@{username}</div>
                    <div className="text-xs text-gray-600 truncate">{displayName}</div>
                  </div>
                </div>

                <FollowButton
                  userId={u._id}
                  username={username}
                  size="sm"
                  className="flex-shrink-0"
                  onChange={() => fetchSuggestions()}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
