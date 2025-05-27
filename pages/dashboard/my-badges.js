import { useEffect, useState } from 'react';

export default function MyBadges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(\`\${process.env.NEXT_PUBLIC_API_BASE}/api/tier/history\`, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setBadges(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load badge history');
        setLoading(false);
      });
  }, []);

  const getImageUrl = (tier) => {
    const name = tier.replace(/[^a-zA-Z]/g, '').toLowerCase();
    return \`https://cdn.cybev.io/badges/\${name}.png\`;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800">My Tier Badges</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && badges.length === 0 && <p>No badges minted yet.</p>}
        <ul className="space-y-4">
          {badges.map((b, i) => (
            <li key={i} className="bg-white p-4 rounded shadow flex items-center space-x-4">
              <img src={getImageUrl(b.tier)} alt={b.tier} className="w-16 h-16 object-contain" />
              <div>
                <h3 className="text-lg font-semibold text-blue-700">{b.tier} Tier</h3>
                <p className="text-sm text-gray-600">Minted on {new Date(b.mintedAt).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}