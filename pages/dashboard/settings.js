import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

export default function AccountSettings() {
  const [vault, setVault] = useState({ balance: 750, earnings: 1200 });
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      alert('✅ Tokens withdrawn to your wallet (simulated)');
      setWithdrawing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800">Account Settings & Token Vault</h1>

        <Card>
          <h2 className="text-xl font-semibold mb-2">🪙 Token Wallet</h2>
          <p><strong>Current Balance:</strong> ₡{vault.balance}</p>
          <p><strong>Total Earned:</strong> ₡{vault.earnings}</p>
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            {withdrawing ? 'Processing...' : 'Withdraw Tokens'}
          </button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-2">🔒 Account Info</h2>
          <p>Email: user@cybev.io (demo)</p>
          <p>Wallet ID: 0x123...abc</p>
        </Card>
      </div>
    </div>
  );
}