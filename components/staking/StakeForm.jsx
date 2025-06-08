import React, { useState } from 'react';
import { stakeTokens } from '@/hooks/useStake';

export default function StakeForm() {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(7);

  const handleSubmit = async () => {
    try {
      await stakeTokens(parseFloat(amount), parseInt(lockPeriod));
      alert('Stake successful!');
    } catch (err) {
      alert('Error staking tokens: ' + err.message);
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
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Stake Now
      </button>
    </div>
  );
}