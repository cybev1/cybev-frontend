import React from 'react';

export default function TokenActions({ onMint, onStake }) {
  return (
    <div className="flex space-x-4 mt-2">
      <button onClick={onMint} className="px-3 py-1 bg-yellow-400 text-white rounded">Mint</button>
      <button onClick={onStake} className="px-3 py-1 bg-green-500 text-white rounded">Stake</button>
    </div>
  );
}
