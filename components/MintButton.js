import { useEffect, useState } from 'react';
import HasTier from './HasTier';

export default function MintButton({ onMint }) {
  const [hasFreeMint, setHasFreeMint] = useState(true); // mock toggle

  useEffect(() => {
    const lastMint = localStorage.getItem('lastFreeMint');
    if (lastMint) {
      const days = (Date.now() - new Date(lastMint)) / (1000 * 60 * 60 * 24);
      setHasFreeMint(days >= 30);
    }
  }, []);

  const handleMint = () => {
    if (hasFreeMint) {
      localStorage.setItem('lastFreeMint', new Date().toISOString());
      alert('✅ Minted for Free! Tier Perk');
    } else {
      alert('🪙 Minted using tokens (₡50)');
    }
    onMint();
  };

  return (
    <div className="mt-6">
      <HasTier min="Gold">
        <button onClick={handleMint} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
          {hasFreeMint ? 'Mint Free (Gold+ Tier Perk)' : 'Mint (₡50)'}
        </button>
      </HasTier>
    </div>
  );
}