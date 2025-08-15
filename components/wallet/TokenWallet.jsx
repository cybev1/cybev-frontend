import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TokenWallet() {
  const [balance, setBalance] = useState('0');
  const [staking, setStaking] = useState({ staked: '0', rewards: '0' });
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      // Check if user has MetaMask or similar wallet
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWallet(accounts[0]);
        localStorage.setItem('cybev_wallet', accounts[0]);
        await loadTokenData(accounts[0]);
      } else {
        // Create demo wallet for users without MetaMask
        const demoWallet = localStorage.getItem('cybev_wallet') || 
                          `0x${Math.random().toString(16).substr(2, 40)}`;
        localStorage.setItem('cybev_wallet', demoWallet);
        setWallet(demoWallet);
        await loadTokenData(demoWallet);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const loadTokenData = async (walletAddress) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('cybev_token');
      
      const [balanceRes, stakingRes, transactionsRes] = await Promise.all([
        fetch(`/api/token/balance?wallet=${walletAddress}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }),
        fetch(`/api/token/staking-info?wallet=${walletAddress}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }),
        fetch(`/api/token/transactions?wallet=${walletAddress}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
      ]);
      
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setBalance(balanceData.balance || '0');
        localStorage.setItem('cybev_balance', balanceData.balance || '0');
      }
      
      if (stakingRes.ok) {
        const stakingData = await stakingRes.json();
        setStaking({
          staked: stakingData.staked || '0',
          rewards: stakingData.rewards || '0'
        });
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);
      }
      
    } catch (error) {
      console.error('Failed to load token data:', error);
      // Use mock data for development
      setBalance('125.50');
      setStaking({ staked: '50.00', rewards: '12.75' });
      setTransactions([
        { id: 1, type: 'earned', amount: 5, reason: 'Blog post created', timestamp: '2h ago' },
        { id: 2, type: 'earned', amount: 25, reason: 'Blog created', timestamp: '1d ago' },
        { id: 3, type: 'spent', amount: -10, reason: 'Post boosted', timestamp: '2d ago' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const earnTokens = async (action) => {
    try {
      const token = localStorage.getItem('cybev_token');
      const response = await fetch('/api/token/earn', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ wallet, action })
      });
      
      const data = await response.json();
      if (data.success) {
        const newBalance = (parseFloat(balance) + data.earned).toFixed(2);
        setBalance(newBalance);
        localStorage.setItem('cybev_balance', newBalance);
        toast.success(`🎉 Earned ${data.earned} CYBV tokens!`);
        
        // Add transaction to list
        setTransactions(prev => [{
          id: Date.now(),
          type: 'earned',
          amount: data.earned,
          reason: action.replace('_', ' '),
          timestamp: 'now'
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      toast.error('Earning failed');
    }
  };

  const stakeTokens = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount to stake');
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(balance)) {
      toast.error('Insufficient balance');
      return;
    }

    setStakeLoading(true);
    try {
      const token = localStorage.getItem('cybev_token');
      const response = await fetch('/api/token/stake', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ wallet, amount: stakeAmount })
      });
      
      const data = await response.json();
      if (data.success) {
        await loadTokenData(wallet);
        setStakeAmount('');
        setShowStakeModal(false);
        toast.success(`✅ Staked ${stakeAmount} CYBV tokens!`);
      } else {
        toast.error(data.error || 'Staking failed');
      }
    } catch (error) {
      toast.error('Staking failed');
    } finally {
      setStakeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">CYBV Wallet</h2>
          <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
            {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'No wallet'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 rounded-lg p-4 cursor-pointer"
          >
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-2xl font-bold">{parseFloat(balance).toFixed(2)} CYBV</p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 rounded-lg p-4 cursor-pointer"
          >
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-2xl font-bold">{parseFloat(balance).toFixed(2)} CYBV</p>
            <p className="text-xs opacity-60">≈ ${(parseFloat(balance) * 0.25).toFixed(2)} USD</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 rounded-lg p-4 cursor-pointer"
          >
            <p className="text-sm opacity-80">Staked</p>
            <p className="text-2xl font-bold">{parseFloat(staking.staked).toFixed(2)} CYBV</p>
            <p className="text-xs opacity-60">Earning rewards</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 rounded-lg p-4 cursor-pointer"
          >
            <p className="text-sm opacity-80">Rewards</p>
            <p className="text-2xl font-bold">{parseFloat(staking.rewards).toFixed(2)} CYBV</p>
            <p className="text-xs opacity-60">Ready to claim</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => earnTokens('daily_login')}
            className="bg-green-500 hover:bg-green-600 py-3 px-4 rounded-lg font-medium transition-all hover:scale-105"
          >
            📅 Daily Check-in (+1 CYBV)
          </button>
          
          <button
            onClick={() => setShowStakeModal(true)}
            disabled={parseFloat(balance) < 10}
            className="bg-yellow-500 hover:bg-yellow-600 py-3 px-4 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💰 Stake Tokens
          </button>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => loadTokenData(wallet)}
            className="text-sm underline hover:no-underline opacity-80"
          >
            🔄 Refresh Balance
          </button>
          
          <div className="text-xs opacity-60">
            Last updated: just now
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mt-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    tx.type === 'earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'earned' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {tx.reason}
                    </p>
                    <p className="text-xs text-gray-500">{tx.timestamp}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  tx.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'earned' ? '+' : ''}{tx.amount} CYBV
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💳</div>
            <p>No transactions yet</p>
            <p className="text-sm">Start earning by creating content!</p>
          </div>
        )}
      </motion.div>

      {/* Earning Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl p-6 mt-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💡 How to Earn CYBV Tokens</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>📝 Create Blog Post</span>
              <span className="font-bold text-green-600">+5 CYBV</span>
            </div>
            <div className="flex justify-between">
              <span>🏗️ Create Blog</span>
              <span className="font-bold text-green-600">+25 CYBV</span>
            </div>
            <div className="flex justify-between">
              <span>🎨 Mint NFT</span>
              <span className="font-bold text-green-600">+10 CYBV</span>
            </div>
            <div className="flex justify-between">
              <span>👥 Referral</span>
              <span className="font-bold text-green-600">+50 CYBV</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>❤️ Like Post</span>
              <span className="font-bold text-green-600">+1 CYBV</span>
            </div>
            <div className="flex justify-between">
              <span>💬 Comment</span>
              <span className="font-bold text-green-600">+2 CYBV</span>
            </div>
            <div className="flex justify-between">
              <span>🔗 Share Content</span>
              <span className="font-bold text-green-600">+3 CYBV</span>
            </div>
            <div className="flex justify-between">
              <span>📅 Daily Login</span>
              <span className="font-bold text-green-600">+1 CYBV</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Stake CYBV Tokens</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount to Stake
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter amount"
                min="1"
                max={balance}
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {balance} CYBV | Minimum: 1 CYBV
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Staking Benefits</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Earn 12% APY on staked tokens</li>
                <li>• Get boosted content visibility</li>
                <li>• Access to premium features</li>
                <li>• Participate in DAO governance</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 py-3 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={stakeTokens}
                disabled={stakeLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {stakeLoading ? 'Staking...' : 'Stake Tokens'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}