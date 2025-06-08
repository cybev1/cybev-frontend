import React from 'react';

export default function StakeForm() {
  return (
    <div className="p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Stake CYBV Tokens</h2>
      <input type="number" placeholder="Enter amount" className="w-full p-2 rounded mb-2 border" />
      <select className="w-full p-2 rounded mb-2 border">
        <option>Bronze - 7 days</option>
        <option>Silver - 14 days</option>
        <option>Gold - 30 days</option>
        <option>Diamond - 90 days</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Stake Now</button>
    </div>
  );
}