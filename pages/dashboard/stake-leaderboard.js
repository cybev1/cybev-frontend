import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

export default function StakeLeaderboard() {
  const [topStakers, setTopStakers] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/stakes/leaderboard')
      .then(res => res.json())
      .then(data => {
        setTopStakers(data.top || []);
        setTotal(data.totalStaked || 0);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800 text-center">CYBEV Staking Leaderboard</h1>
        <Card>
          <h2 className="text-xl font-semibold mb-2">🌍 Total Staked Platform-Wide</h2>
          <p className="text-2xl text-blue-700 font-bold">₡{total.toLocaleString()}</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold mb-4">🏆 Top 10 Stakers</h2>
          <ol className="space-y-2 list-decimal list-inside text-sm">
            {topStakers.map((user, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span>{user.username || 'User'}</span>
                <span className="text-blue-700 font-semibold">₡{user.totalStaked}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}