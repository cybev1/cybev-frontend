import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    setLeaders([
      { username: 'Prince', earnings: 120.50 },
      { username: 'Deborah', earnings: 98.75 },
      { username: 'JohnDoe', earnings: 87.00 },
    ]);
  }, []);

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">🏆 Leaderboard</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-2xl">
        <ul className="divide-y divide-gray-300 dark:divide-gray-700">
          {leaders.map((user, i) => (
            <li key={user.username} className="py-3 flex justify-between">
              <span className="font-medium">{i + 1}. {user.username}</span>
              <span className="text-green-600 dark:text-green-400">₿ {user.earnings.toFixed(2)} CYBV</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
