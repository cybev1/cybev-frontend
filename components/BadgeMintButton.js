import { useState } from 'react';

export default function BadgeMintButton() {
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mint = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_BASE}/api/tier/mint-badge\`, {
        method: 'POST',
        headers: { Authorization: token }
      });

      const data = await res.json();
      if (res.ok) {
        setBadge(data);
      } else {
        setError(data.message || 'Mint failed');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <button
        onClick={mint}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Minting Badge...' : '🎖️ Mint Tier Badge'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {badge && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-blue-800">{badge.metadata.title}</h3>
          <p className="text-gray-700 text-sm">{badge.metadata.description}</p>
          <img
            src={badge.metadata.image}
            alt={badge.metadata.title}
            className="mt-2 w-32 h-32 mx-auto object-contain"
          />
        </div>
      )}
    </div>
  );
}