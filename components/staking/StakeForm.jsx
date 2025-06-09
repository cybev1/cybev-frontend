import React, { useState } from 'react';
import { stakeTokens } from '@/hooks/useStake';
import { toast } from 'react-toastify';

export default function StakeForm() {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(7);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await stakeTokens(parseFloat(amount), parseInt(lockPeriod));
      toast.success('Stake successful!');
    } catch (err) {
      toast.error('Error staking tokens: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Stake CYBV Tokens</h2>
      <input
        type="number"
        placeholder="Enter amount"
        className="w-full p-2 rounded mb-2 border"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        className="w-full p-2 rounded mb-2 border"
        value={lockPeriod}
        onChange={(e) => setLockPeriod(e.target.value)}
      >
        <option value="7">Bronze - 7 days</option>
        <option value="14">Silver - 14 days</option>
        <option value="30">Gold - 30 days</option>
        <option value="90">Diamond - 90 days</option>
      </select>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Processing...' : 'Stake Now'}
      </button>
    </div>
  );
}