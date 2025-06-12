
import React, { useState } from 'react';
import StakingProgress from './StakingProgress';
import UnlockReward from './UnlockReward';
import { Lock, ArrowUpRight } from 'lucide-react';

export default function FullStakingModule() {
  const [staked, setStaked] = useState(100);
  const [input, setInput] = useState('');
  const [reward, setReward] = useState(12.5);
  const [stakeStart, setStakeStart] = useState(Date.now());

  const handleStake = () => {
    const amount = parseFloat(input);
    if (!isNaN(amount) && amount > 0) {
      setStaked(prev => prev + amount);
      setReward(prev => prev + (amount * 0.05));
      setStakeStart(Date.now());
      setInput('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mt-10">
      <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2">
        <Lock size={18} /> CYBEV Staking Vault
      </h2>
      <p className="text-sm mb-2">You currently have <strong>{staked} CYBV</strong> staked.</p>
      <p className="text-sm mb-4">Estimated reward: <span className="text-green-600">{reward.toFixed(2)} CYBV</span></p>

      <div className="flex gap-2 mb-6">
        <input
          type="number"
          placeholder="Enter amount to stake"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 text-sm"
        />
        <button
          onClick={handleStake}
          className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
        >
          <ArrowUpRight size={14} /> Stake
        </button>
      </div>

      <StakingProgress start={stakeStart} durationDays={30} />
      <UnlockReward start={stakeStart} durationDays={30} />
    </div>
  );
}
