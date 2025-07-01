import { useState } from 'react';

export default function StakePage() {
  const [amount, setAmount] = useState('');
  const [staked, setStaked] = useState(120.00);
  const [message, setMessage] = useState('');

  const handleStake = async () => {
    const res = await fetch('/api/stake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    setMessage(data.message);
    setStaked(prev => prev + parseFloat(amount));
    setAmount('');
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">📈 Stake Your CYBV Tokens</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">Total Staked: <strong>₿ {staked.toFixed(2)}</strong></p>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-md border"
      />
      <button
        onClick={handleStake}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Stake Now
      </button>
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
}