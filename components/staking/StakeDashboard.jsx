import React from 'react';

export default function StakeDashboard() {
  return (
    <div className="p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900 mt-4">
      <h2 className="text-xl font-bold mb-2">Your Current Stake</h2>
      <p>Staked: 5000 CYBV</p>
      <p>Unlocks in: 12 days</p>
      <p>Rewards Earned: 320 CYBV</p>
      <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Claim Rewards</button>
    </div>
  );
}