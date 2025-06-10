
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';

export default function TokenRewardsLeaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulate fetch from /api/analytics/tokens
    setUsers([
      {
        username: 'prince',
        tokens: 782.5,
        posts: 42
      },
      {
        username: 'cybevteam',
        tokens: 610.2,
        posts: 39
      },
      {
        username: 'faithwriter',
        tokens: 552.0,
        posts: 31
      }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🪙 Token Rewards Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <div key={user.username} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg relative">
            {index === 0 && (
              <div className="absolute top-2 right-2">
                <Coins className="text-yellow-500" size={28} />
              </div>
            )}
            <h2 className="text-xl font-bold text-blue-700">@{user.username}</h2>
            <p className="text-gray-500 text-sm mt-1">📝 {user.posts} Posts</p>
            <p className="text-green-600 font-bold text-lg mt-2">🪙 {user.tokens.toFixed(2)} CYBV</p>
            <div className="mt-4">
              <Link href={`/studio/profile/${user.username}`}>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  🔍 View Profile
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
