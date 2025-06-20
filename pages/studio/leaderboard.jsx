
import { useEffect, useState } from 'react';

export default function SuperBloggerLeaderboard() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch('/api/analytics/leaderboard');
      const json = await res.json();
      if (json.success) setRankings(json.data);
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🏆 Super Blogger Leaderboard</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading leaderboard...</p>
      ) : rankings.length === 0 ? (
        <p className="text-center text-gray-400">No rankings available.</p>
      ) : (
        <div className="overflow-auto bg-white dark:bg-gray-900 shadow rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Blogger</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Shares</th>
                <th className="px-4 py-3">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((user, i) => (
                <tr key={user.username} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 font-bold text-blue-600">#{i + 1}</td>
                  <td className="px-4 py-3 font-medium">@{user.username}</td>
                  <td className="px-4 py-3">{user.views}</td>
                  <td className="px-4 py-3">{user.shares}</td>
                  <td className="px-4 py-3 text-green-600">${user.earnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
