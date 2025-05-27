import { useEffect, useState } from 'react';
import HasTier from './HasTier';

export default function MintButton({ postId, onMint }) {
  const [hasFreeMint, setHasFreeMint] = useState(true);

  useEffect(() => {
    const lastMint = localStorage.getItem('lastFreeMint');
    if (lastMint) {
      const days = (Date.now() - new Date(lastMint)) / (1000 * 60 * 60 * 24);
      setHasFreeMint(days >= 30);
    }
  }, []);

  const handleMint = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });

      const data = await res.json();
      if (res.ok) {
        if (hasFreeMint) {
          localStorage.setItem('lastFreeMint', new Date().toISOString());
          alert('✅ Minted for Free! Tier Perk');
        } else {
          alert('🪙 Minted using tokens (₡50)');
        }
        onMint(); // update post status
      } else {
        alert(data.message || 'Mint failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className="mt-4">
      <HasTier min="Gold">
        <button onClick={handleMint} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
          {hasFreeMint ? 'Mint Free (Gold+)' : 'Mint (₡50)'}
        </button>
      </HasTier>
    </div>
  );
}