
import React from 'react';

export default function SuperBloggerLeaderboard() {
  const leaders = [
    { username: 'PrinceD', earnings: 112.45, posts: 42 },
    { username: 'GraceN', earnings: 89.30, posts: 37 },
    { username: 'TechGuru', earnings: 74.15, posts: 28 },
    { username: 'GospelWriter', earnings: 63.90, posts: 30 },
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">🏆 Super Blogger Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Username</th>
              <th className="p-3">Earnings ($CYBEV)</th>
              <th className="p-3">Posts</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, i) => (
              <tr key={leader.username} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3 font-bold">#{i + 1}</td>
                <td className="p-3">{leader.username}</td>
                <td className="p-3">${leader.earnings.toFixed(2)}</td>
                <td className="p-3">{leader.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
