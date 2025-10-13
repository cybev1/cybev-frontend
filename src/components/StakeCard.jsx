
import { useState } from 'react';
import axios from 'axios';

export default function StakeCard() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/stake', { amount });
      setMessage(`✅ Staked successfully. Tx: ${res.data.txHash}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Staking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Stake CYBV Tokens</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full p-2 mb-4 rounded border dark:bg-gray-800"
      />
      <button
        onClick={handleStake}
        disabled={loading || !amount}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Staking...' : 'Stake'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
