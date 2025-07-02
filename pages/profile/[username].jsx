
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function UserProfile() {
  const { query } = useRouter();
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    if (query.username) {
      fetch(`/api/badge/tier?wallet=${query.username}`)
        .then(res => res.json())
        .then(data => setBadge(data.tier || 'Unranked'));
    }
  }, [query.username]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{query.username}'s Profile</h1>
      {badge && (
        <div className="mt-2 text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded">
          Badge Tier: {badge}
        </div>
      )}
    </div>
  );
}
