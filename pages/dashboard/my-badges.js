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
      .then(data => setBadges(data))
      .catch(() => setError('Failed to fetch badges'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">My Tier Badge History</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <ul className="space-y-4">
          {badges.map((badge, idx) => (
            <li key={idx} className="p-4 bg-blue-50 border rounded">
              <p><strong>Tier:</strong> {badge.tier}</p>
              <p><strong>Earned On:</strong> {new Date(badge.timestamp).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}