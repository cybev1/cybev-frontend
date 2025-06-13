
import React, { useState } from 'react';
import WalletDashboard from './WalletDashboard';
import TransactionHistory from './TransactionHistory';
import FullStakingModule from './FullStakingModule';
import WalletActivityLog from './WalletActivityLog';

const tabs = ['Balance', 'History', 'Staking'];

export default function WalletTabs() {
  const [active, setActive] = useState('Balance');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 rounded ${
              active === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === 'Balance' && (
        <>
          <WalletDashboard />
          <WalletActivityLog />
        </>
      )}
      {active === 'History' && (
        <>
          <TransactionHistory transactions={[
            { type: 'Referral Claim', amount: 25 },
            { type: 'Boost Earn', amount: 12.5 },
            { type: 'Mint Reward', amount: 10 }
          ]} />
          <WalletActivityLog />
        </>
      )}
      {active === 'Staking' && (
        <>
          <FullStakingModule />
          <WalletActivityLog />
        </>
      )}
    </div>
  );
}
