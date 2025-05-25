import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

function getTierLabel(amount) {
  if (amount >= 1000) return '💎 Diamond';
  if (amount >= 500) return '🥇 Gold';
  if (amount >= 100) return '🥈 Silver';
  return '🥉 Bronze';
}

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
    <div className="min-h-screen p-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-900">CYBEV Staking Leaderboard</h1>
        <Card>
          <h2 className="text-xl font-semibold mb-2">🌍 Total Platform Staked</h2>
          <p className="text-3xl font-bold text-blue-700">₡{total.toLocaleString()}</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold mb-4">🏆 Top 10 Stakers + Tiers</h2>
          <ol className="space-y-2 list-decimal list-inside text-sm">
            {topStakers.map((user, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-1">
                <span>{user.username || 'Anonymous'}</span>
                <span className="text-blue-700 font-semibold flex items-center gap-2">
                  ₡{user.totalStaked} <span>{getTierLabel(user.totalStaked)}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}