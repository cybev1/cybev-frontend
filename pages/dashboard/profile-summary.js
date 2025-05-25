import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

function getTier(amount) {
  if (amount >= 1000) return '💎 Diamond';
  if (amount >= 500) return '🥇 Gold';
  if (amount >= 100) return '🥈 Silver';
  return '🥉 Bronze';
}

export default function ProfileSummary() {
  const [totalStaked, setTotalStaked] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/stakes/user', {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        const total = data.reduce((acc, cur) => acc + cur.amount, 0);
        setTotalStaked(total);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800 text-center">My CYBEV Profile</h1>
        <Card>
          <h2 className="text-xl font-semibold mb-2">Staking Tier</h2>
          <p className="text-lg">You are ranked: <strong>{getTier(totalStaked)}</strong></p>
          <p>Total Staked: ₡{totalStaked}</p>
        </Card>
      </div>
    </div>
  );
}