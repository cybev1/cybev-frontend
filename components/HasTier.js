import { useEffect, useState } from 'react';

function getTierRank(tier) {
  switch (tier) {
    case '💎 Diamond': return 4;
    case '🥇 Gold': return 3;
    case '🥈 Silver': return 2;
    case '🥉 Bronze': return 1;
    default: return 0;
  }
}

export default function HasTier({ min, children }) {
  const [tier, setTier] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/stakes/user`, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        const total = data.reduce((sum, s) => sum + s.amount, 0);
        const rank = getTierRank(
          total >= 1000 ? '💎 Diamond' :
          total >= 500 ? '🥇 Gold' :
          total >= 100 ? '🥈 Silver' :
          '🥉 Bronze'
        );
        setTier(rank);
      });
  }, []);

  const required = getTierRank(min);
  return tier >= required ? children : null;
}