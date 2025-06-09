import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BADGES = [
  {
    tier: 'bronze',
    name: '🥉 Bronze Badge',
    description: 'Stake 500 CYBV for 7 days',
    image: 'https://cdn.cybev.io/badges/bronze.png'
  },
  {
    tier: 'silver',
    name: '🥈 Silver Badge',
    description: 'Stake 2,000 CYBV for 14 days',
    image: 'https://cdn.cybev.io/badges/silver.png'
  },
  {
    tier: 'gold',
    name: '🥇 Gold Badge',
    description: 'Stake 5,000 CYBV for 30 days',
    image: 'https://cdn.cybev.io/badges/gold.png'
  },
  {
    tier: 'diamond',
    name: '💎 Diamond Badge',
    description: 'Stake 10,000 CYBV for 90 days',
    image: 'https://cdn.cybev.io/badges/diamond.png'
  }
];

export default function BadgeMintPanel() {
  const [minted, setMinted] = useState({});

  const handleMint = async (tier) => {
    const wallet = localStorage.getItem('wallet');
    if (!wallet) {
      toast.error('No wallet found in localStorage');
      return;
    }

    try {
      const res = await axios.post('/api/mint-badge', {
        tier,
        userWallet: wallet
      });

      if (res.data.success) {
        toast.success(`Minted ${tier} badge!`);
        setMinted((prev) => ({ ...prev, [tier]: true }));
      }
    } catch (err) {
      toast.error('Minting failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {BADGES.map((badge) => (
        <div key={badge.tier} className="p-4 rounded-xl shadow bg-white text-center">
          <img src={badge.image} alt={badge.name} className="h-32 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">{badge.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
          <button
            onClick={() => handleMint(badge.tier)}
            disabled={minted[badge.tier]}
            className={`px-4 py-2 rounded text-white ${
              minted[badge.tier] ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {minted[badge.tier] ? '✅ Minted' : 'Mint Badge'}
          </button>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
}