
import React, { useEffect, useState } from 'react';
import { Wallet, Coins, Gift } from 'lucide-react';
import { toast } from 'react-toastify';

export default function WalletDashboard() {
  const [balance, setBalance] = useState(0);
  const [claimable, setClaimable] = useState(0);
  const [loading, setLoading] = useState(false);
  const username = 'prince'; // Replace with actual session user in real setup

  useEffect(() => {
    fetch(`/api/wallet/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBalance(data.balance || 0);
          setClaimable(data.claimable || 0);
        }
      });
  }, []);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wallet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`🪙 Claimed ${data.amount} CYBV`);
        setClaimable(0);
        setBalance(prev => prev + data.amount);
      } else {
        toast.error(data.message || 'Nothing to claim');
      }
    } catch (e) {
      toast.error('Server error.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6"><Wallet size={28} /> My CYBEV Wallet</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Current Balance</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{balance.toFixed(2)} CYBV</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Claimable Rewards</h2>
          <p className="text-2xl text-blue-600 font-semibold mt-2">{claimable.toFixed(2)} CYBV</p>
          {claimable > 0 && (
            <button onClick={handleClaim} disabled={loading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Claiming...' : 'Claim Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
