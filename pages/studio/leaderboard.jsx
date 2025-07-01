
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaders(data))
      .catch(err => console.error('Leaderboard error:', err));
  }, []);

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🏆 Top Creators</h1>
      <div className="space-y-4">
        {leaders.map((user, index) => (
          <div key={index} className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 flex justify-between">
            <span className="font-semibold">{index + 1}. {user.username}</span>
            <span>₿ {user.earnings?.toFixed(2)} CYBV</span>
          </div>
        ))}
      </div>
    </div>
  );
}
