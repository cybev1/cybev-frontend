import React from 'react';

export default function TokenActions({ onMint, onStake }) {
  return (
    <div className="flex space-x-2 mt-2">
      <button onClick={onMint} className="text-sm px-2 py-1 bg-green-500 text-white rounded">Mint</button>
      <button onClick={onStake} className="text-sm px-2 py-1 bg-blue-500 text-white rounded">Stake</button>
    </div>
  );
}
