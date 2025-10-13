import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const badgeTiers = [
  { tier: 'Bronze', image: '/badges/bronze.png' },
  { tier: 'Silver', image: '/badges/silver.png' },
  { tier: 'Gold', image: '/badges/gold.png' },
  { tier: 'Diamond', image: '/badges/diamond.png' },
];

export default function MintBadge() {
  const [minting, setMinting] = useState(false);

  const handleMint = async (tier) => {
    setMinting(true);
    try {
      const res = await axios.post('/api/mintBadge', { tier });
      toast.success(`Minted ${tier} Badge! Token ID: ${res.data.tokenId}`);
    } catch (err) {
      toast.error('Minting failed');
    }
    setMinting(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mint Your Badge</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {badgeTiers.map(({ tier, image }) => (
          <div key={tier} className="rounded shadow p-4 text-center">
            <img src={image} alt={tier} className="w-20 h-20 mx-auto mb-2" />
            <h2 className="font-semibold">{tier} Badge</h2>
            <button
              onClick={() => handleMint(tier)}
              disabled={minting}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {minting ? 'Minting...' : 'Mint'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
