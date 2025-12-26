import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { followAPI } from '@/lib/api';
import FollowButton from './FollowButton';

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await followAPI.getSuggestions();
        if (!mounted) return;
        setUsers(res.data?.users || []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || 'Failed to load suggestions');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Suggested for you</h3>
        <Link className="text-xs text-blue-400 hover:underline" href="/profile">
          View all
        </Link>
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading...
        </div>
      )}

      {!loading && error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      {!loading && !error && users.length === 0 && (
        <div className="mt-4 text-sm text-gray-400">No suggestions right now.</div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="mt-4 space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between gap-3">
              <Link href={`/profile/${u.username || u._id}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={u.displayName || u.username || 'User'}
                      src={u.avatar || '/default-avatar.png'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white">
                      {u.displayName || u.username || 'User'}
                    </div>
                    <div className="truncate text-xs text-gray-400">@{u.username || 'user'}</div>
                  </div>
                </div>
              </Link>

              <FollowButton targetUserId={u._id} initialIsFollowing={!!u.isFollowing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
