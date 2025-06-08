import React, { useEffect, useState } from 'react';
import { getStakeStatus, unstakeTokens } from '@/hooks/useStake';

export default function StakeDashboard() {
  const [stake, setStake] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await getStakeStatus();
      if (data.length > 0) setStake(data[0]);
    };
    fetchStatus();
  }, []);

  const handleUnstake = async () => {
    try {
      await unstakeTokens(stake._id);
      alert('Unstaked successfully!');
    } catch (err) {
      alert('Error unstaking: ' + err.message);
    }
  };

  if (!stake) return <p className="text-center mt-4">No active stakes</p>;

  const start = new Date(stake.startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + stake.lockPeriod);
  const remaining = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900 mt-4">
      <h2 className="text-xl font-bold mb-2">Your Current Stake</h2>
      <p>Staked: {stake.amount} CYBV</p>
      <p>Unlocks in: {remaining > 0 ? remaining + ' days' : 'Unlocked'}</p>
      <p>Rewards Earned: {stake.rewardsEarned} CYBV</p>
      {remaining <= 0 && (
        <button
          onClick={handleUnstake}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          Claim Rewards
        </button>
      )}
    </div>
  );
}