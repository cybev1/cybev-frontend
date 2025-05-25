import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

export default function Stake() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30');
  const [result, setResult] = useState(null);
  const [myStakes, setMyStakes] = useState([]);
  const [claimed, setClaimed] = useState({});

  const fetchStakes = () => {
    const token = localStorage.getItem('token');
    fetch('/api/stakes/user', {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => setMyStakes(Array.isArray(data) ? data : []))
      .catch(() => setMyStakes([]));
  };

  useEffect(() => {
    fetchStakes();
  }, []);

  const handleStake = () => {
    const rewardRates = { 30: 5, 60: 12, 90: 20 };
    const reward = (parseFloat(amount) * rewardRates[duration]) / 100;
    const unlockDate = new Date(Date.now() + parseInt(duration) * 86400000).toISOString();

    const token = localStorage.getItem('token');
    fetch('/api/stakes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ amount, duration: parseInt(duration), reward, unlockDate })
    })
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setAmount('');
        fetchStakes();
      });
  };

  const handleClaim = (id) => {
    setClaimed((prev) => ({ ...prev, [id]: true }));
    alert('✅ Reward claimed! (simulate)');
  };

  const isUnlocked = (date) => {
    return new Date(date) <= new Date();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800">Stake CYBEV Tokens</h1>
        <Card>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter amount to stake"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="30">30 Days - 5% APR</option>
              <option value="60">60 Days - 12% APR</option>
              <option value="90">90 Days - 20% APR</option>
            </select>
            <button
              onClick={handleStake}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Stake Tokens
            </button>
          </div>
        </Card>

        {result && (
          <Card>
            <h2 className="text-xl font-bold mb-2">Your Latest Stake</h2>
            <p><strong>Staked:</strong> ₡{result.amount}</p>
            <p><strong>Duration:</strong> {result.duration} days</p>
            <p><strong>Estimated Reward:</strong> ₡{result.reward}</p>
            <p><strong>Unlock Date:</strong> {new Date(result.unlockDate).toDateString()}</p>
          </Card>
        )}

        {myStakes.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold mb-2">Your Active Stakes</h2>
            <ul className="space-y-4 text-sm">
              {myStakes.map((s, i) => (
                <li key={i} className="border-b pb-3">
                  <p><strong>₡{s.amount}</strong> for {s.duration} days</p>
                  <p>Unlocks: {new Date(s.unlockDate).toLocaleDateString()}</p>
                  <p>Reward: ₡{s.reward}</p>
                  {isUnlocked(s.unlockDate) ? (
                    claimed[s._id] ? (
                      <p className="text-green-600 font-semibold">✅ Reward Claimed</p>
                    ) : (
                      <button
                        onClick={() => handleClaim(s._id)}
                        className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      >
                        Claim Reward
                      </button>
                    )
                  ) : (
                    <p className="text-gray-500">🔒 Locked</p>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}