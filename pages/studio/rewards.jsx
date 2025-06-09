import React from 'react';
import BadgeMintPanel from '@/components/badge/BadgeMintPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎖️ Badge Rewards</h1>
        <p className="mb-6 text-gray-600">
          Stake CYBV tokens to earn exclusive tier badges and unlock platform benefits. Badges will be minted as NFTs to your wallet.
        </p>
        <BadgeMintPanel />
        <ToastContainer />
      </div>
    </div>
  );
}