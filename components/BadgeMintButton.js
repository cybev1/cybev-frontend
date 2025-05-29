import { useState } from 'react';

export default function BadgeMintButton({ onMint }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMint = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/tier/mint-badge`, {
        method: 'POST',
        headers: { Authorization: token }
      });

      const data = await res.json();
      if (res.ok) {
        onMint(data);
      } else {
        setError(data.message || 'Minting failed');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleMint}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Minting...' : 'Mint Tier Badge'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}