
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    setTopUsers([
      { name: 'Jane Doe', earnings: 1200, badge: '🏆 Gold' },
      { name: 'John Smith', earnings: 980, badge: '🥈 Silver' },
      { name: 'Alice Green', earnings: 870, badge: '🥉 Bronze' }
    ]);
  }, []);

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🏆 Top Creators</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-3">Rank</th>
              <th className="py-2 px-3">User</th>
              <th className="py-2 px-3">Earnings</th>
              <th className="py-2 px-3">Badge</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">{index + 1}</td>
                <td className="py-2 px-3">{user.name}</td>
                <td className="py-2 px-3">₿ {user.earnings} CYBV</td>
                <td className="py-2 px-3">{user.badge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
