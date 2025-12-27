// ============================================
// FILE: src/components/Web3/TokenStaking.jsx
// CYBEV Token Staking Interface
// ============================================
import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { 
  Coins, Lock, Unlock, TrendingUp, Clock, Gift,
  Loader2, AlertCircle, CheckCircle, ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const STAKING_TIERS = [
  { name: 'Bronze', minStake: 100, apy: 8, lockDays: 30, color: 'from-orange-600 to-orange-400' },
  { name: 'Silver', minStake: 500, apy: 12, lockDays: 90, color: 'from-gray-400 to-gray-300' },
  { name: 'Gold', minStake: 1000, apy: 18, lockDays: 180, color: 'from-yellow-500 to-yellow-300' },
  { name: 'Diamond', minStake: 5000, apy: 25, lockDays: 365, color: 'from-blue-400 to-purple-400' }
];

export default function TokenStaking() {
  const { wallet, isConnected, tokenBalance, connectWallet } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [stakingInfo, setStakingInfo] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [staking, setStaking] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (isConnected) {
      fetchStakingInfo();
    } else {
      setLoading(false);
    }
  }, [isConnected, wallet]);

  const fetchStakingInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/staking/info', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const data = await response.json();
        setStakingInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch staking info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!selectedTier) {
      toast.error('Please select a staking tier');
      return;
    }

    if (parseFloat(stakeAmount) < selectedTier.minStake) {
      toast.error(`Minimum stake for ${selectedTier.name} tier is ${selectedTier.minStake} CYBEV`);
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(tokenBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    setStaking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/staking/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(stakeAmount),
          tier: selectedTier.name,
          lockDays: selectedTier.lockDays,
          wallet
        })
      });

      const data = await response.json();

      if (data.ok || data.success) {
        toast.success(`✅ Staked ${stakeAmount} CYBEV in ${selectedTier.name} tier!`);
        setShowStakeModal(false);
        setStakeAmount('');
        setSelectedTier(null);
        fetchStakingInfo();
      } else {
        toast.error(data.error || 'Staking failed');
      }
    } catch (error) {
      console.error('Stake error:', error);
      toast.error('Failed to stake tokens');
    } finally {
      setStaking(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!stakingInfo?.pendingRewards || stakingInfo.pendingRewards <= 0) {
      toast.info('No rewards to claim');
      return;
    }

    setClaiming(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/staking/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.ok || data.success) {
        toast.success(`🎉 Claimed ${data.amount} CYBEV rewards!`);
        fetchStakingInfo();
      } else {
        toast.error(data.error || 'Failed to claim rewards');
      }
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Failed to claim rewards');
    } finally {
      setClaiming(false);
    }
  };

  const handleUnstake = async (stakeId) => {
    if (!confirm('Are you sure you want to unstake? Early unstaking may incur penalties.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/staking/unstake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stakeId })
      });

      const data = await response.json();

      if (data.ok || data.success) {
        toast.success('Tokens unstaked successfully');
        fetchStakingInfo();
      } else {
        toast.error(data.error || 'Failed to unstake');
      }
    } catch (error) {
      console.error('Unstake error:', error);
      toast.error('Failed to unstake');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Overview Card */}
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">CYBEV Staking</h2>
                <p className="text-gray-400 text-sm">Earn rewards by staking tokens</p>
              </div>
            </div>
            <button
              onClick={() => setShowStakeModal(true)}
              disabled={!isConnected}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Stake Now
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Total Staked</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stakingInfo?.totalStaked?.toLocaleString() || '0'} CYBEV
              </p>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">Pending Rewards</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {stakingInfo?.pendingRewards?.toFixed(2) || '0.00'} CYBEV
              </p>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Current APY</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {stakingInfo?.currentApy || '0'}%
              </p>
            </div>
          </div>

          {stakingInfo?.pendingRewards > 0 && (
            <button
              onClick={handleClaimRewards}
              disabled={claiming}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {claiming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  Claim {stakingInfo.pendingRewards.toFixed(2)} CYBEV Rewards
                </>
              )}
            </button>
          )}
        </div>

        {/* Active Stakes */}
        {stakingInfo?.activeStakes?.length > 0 && (
          <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              Active Stakes
            </h3>
            <div className="space-y-3">
              {stakingInfo.activeStakes.map((stake, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                      STAKING_TIERS.find(t => t.name === stake.tier)?.color || 'from-gray-500 to-gray-400'
                    }`}>
                      {stake.tier}
                    </div>
                    <div>
                      <p className="text-white font-medium">{stake.amount} CYBEV</p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Unlocks {new Date(stake.unlockDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">+{stake.earnedRewards?.toFixed(2) || '0.00'} CYBEV</p>
                    <button
                      onClick={() => handleUnstake(stake._id)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staking Tiers */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Staking Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAKING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors"
              >
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${tier.color} mb-4`} />
                <h4 className="text-white font-bold text-lg mb-2">{tier.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Stake</span>
                    <span className="text-white">{tier.minStake} CYBEV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">APY</span>
                    <span className="text-green-400 font-medium">{tier.apy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lock Period</span>
                    <span className="text-white">{tier.lockDays} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Stake CYBEV Tokens</h3>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Amount to Stake</label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => setStakeAmount(tokenBalance)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm hover:text-purple-300"
                >
                  MAX
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Available: {parseFloat(tokenBalance).toLocaleString()} CYBEV
              </p>
            </div>

            {/* Tier Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">Select Tier</label>
              <div className="grid grid-cols-2 gap-2">
                {STAKING_TIERS.map((tier) => (
                  <button
                    key={tier.name}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      selectedTier?.name === tier.name
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <p className="text-white font-medium">{tier.name}</p>
                    <p className="text-green-400 text-sm">{tier.apy}% APY</p>
                    <p className="text-gray-500 text-xs">{tier.lockDays} days</p>
                  </button>
                ))}
              </div>
            </div>

            {!isConnected && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 text-sm">Connect wallet to stake</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowStakeModal(false); setSelectedTier(null); }}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                disabled={staking || !selectedTier}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {staking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Staking...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Stake Tokens
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
