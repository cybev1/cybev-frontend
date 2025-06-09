import { useEffect, useState } from 'react';
import BadgeFilterTabs from '@/components/explorer/BadgeFilterTabs';
import ProfileBadgeDisplay from '@/components/profile/ProfileBadgeDisplay';
import Link from 'next/link';

export default function RankingsPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/users/leaderboard')
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  }, []);

  const filteredUsers = users.filter(
    user => filter === 'all' || user.badgeTier === filter
  );

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🏅 CYBEV Badge Rankings</h1>
          <Link href="/studio/leaderboard" className="text-blue-600 text-sm underline">View Super Blogger Leaderboard</Link>
        </div>

        <BadgeFilterTabs selected={filter} onChange={setFilter} />

        {filteredUsers.length === 0 ? (
          <p>No users found for this badge tier.</p>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.map((user, index) => (
              <li key={user._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar || 'https://cdn.cybev.io/default-avatar.png'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.username || user.name}</p>
                    <p className="text-sm text-gray-600">Points: {user.points || user.staked || 0}</p>
                  </div>
                </div>
                <ProfileBadgeDisplay badgeTier={user.badgeTier} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}