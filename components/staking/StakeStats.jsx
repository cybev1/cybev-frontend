import React from 'react';

export default function StakeStats() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="p-4 bg-green-100 dark:bg-green-900 rounded-2xl shadow text-center">
        <p className="text-sm">Total Staked</p>
        <p className="text-lg font-bold">7000 CYBV</p>
      </div>
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-2xl shadow text-center">
        <p className="text-sm">Rewards</p>
        <p className="text-lg font-bold">820 CYBV</p>
      </div>
    </div>
  );
}