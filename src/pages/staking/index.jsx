// ============================================
// FILE: src/pages/staking/index.jsx
// PATH: cybev-frontend/src/pages/staking/index.jsx
// PURPOSE: Staking dashboard - stake, unstake, rewards
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Coins,
  TrendingUp,
  Clock,
  Lock,
  Unlock,
  Gift,
  Wallet,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Info,
  ChevronRight,
  Award,
  Zap,
  Shield,
  Calculator,
  X,
  Loader2,
  Check,
  AlertTriangle
} from 'lucide-react';
import api from '@/lib/api';

// Pool Card Component
function PoolCard({ pool, onStake, userStake }) {
  const [expanded, setExpanded] = useState(false);

  const getPoolIcon = () => {
    switch (pool.icon) {
      case '🌊': return <Zap className="w-6 h-6" />;
      case '🔥': return <TrendingUp className="w-6 h-6" />;
      case '💎': return <Award className="w-6 h-6" />;
      case '👑': return <Shield className="w-6 h-6" />;
      default: return <Coins className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white/50 rounded-2xl border border-gray-200 overflow-hidden hover:border-purple-500/40 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-900"
              style={{ backgroundColor: pool.color || '#8B5CF6' }}
            >
              {getPoolIcon()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{pool.name}</h3>
              <p className="text-gray-500 text-sm">{pool.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-400">{pool.apy}%</p>
            <p className="text-gray-500 text-sm">APY</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-xs">Lock Period</p>
            <p className="text-gray-900 font-medium">
              {pool.lockPeriod === 0 ? 'Flexible' : `${pool.lockPeriod} days`}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Min Stake</p>
            <p className="text-gray-900 font-medium">{pool.minStake} CYBEV</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Staked</p>
            <p className="text-gray-900 font-medium">{(pool.totalStaked || 0).toLocaleString()}</p>
          </div>
        </div>

        {userStake && (
          <div className="bg-purple-500/10 rounded-xl p-3 mb-4">
            <p className="text-purple-600 text-sm mb-1">Your Stake</p>
            <p className="text-gray-900 font-bold">{userStake.amount.toLocaleString()} CYBEV</p>
            {userStake.pendingRewards > 0 && (
              <p className="text-green-400 text-sm">+{userStake.pendingRewards.toFixed(4)} pending rewards</p>
            )}
          </div>
        )}

        <button
          onClick={() => onStake(pool)}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          {userStake ? 'Stake More' : 'Stake Now'}
        </button>
      </div>

      {/* Expanded Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 bg-gray-50 text-gray-500 text-sm flex items-center justify-center gap-2 hover:text-gray-900 transition-colors"
      >
        {expanded ? 'Hide Details' : 'Show Details'}
        <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Early Withdrawal Penalty</span>
            <span className="text-gray-900">{pool.earlyWithdrawalPenalty}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Compound Frequency</span>
            <span className="text-gray-900 capitalize">{pool.compoundFrequency || 'Daily'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Stakers</span>
            <span className="text-gray-900">{pool.totalStakers || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Active Stake Card
function ActiveStakeCard({ stake, onUnstake, onClaim, onCompound }) {
  const now = new Date();
  const endDate = new Date(stake.endDate);
  const isLocked = now < endDate && stake.pool?.lockPeriod > 0;
  const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-900 text-lg"
            style={{ backgroundColor: stake.pool?.color || '#8B5CF6' }}
          >
            {stake.pool?.icon || '💎'}
          </div>
          <div>
            <h4 className="text-gray-900 font-medium">{stake.pool?.name || 'Unknown Pool'}</h4>
            <p className="text-gray-500 text-sm">{stake.pool?.apy}% APY</p>
          </div>
        </div>
        {isLocked ? (
          <span className="flex items-center gap-1 text-yellow-400 text-sm">
            <Lock className="w-4 h-4" />
            {daysRemaining}d left
          </span>
        ) : (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <Unlock className="w-4 h-4" />
            Unlocked
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-xs">Staked Amount</p>
          <p className="text-gray-900 font-bold">{stake.amount.toLocaleString()} CYBEV</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Pending Rewards</p>
          <p className="text-green-400 font-bold">+{(stake.pendingRewards || 0).toFixed(4)} CYBEV</p>
        </div>
      </div>

      <div className="flex gap-2">
        {stake.pendingRewards > 0 && (
          <>
            <button
              onClick={() => onClaim(stake)}
              className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <Gift className="w-4 h-4" />
              Claim
            </button>
            <button
              onClick={() => onCompound(stake)}
              className="flex-1 py-2 bg-purple-500/20 text-purple-600 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Compound
            </button>
          </>
        )}
        <button
          onClick={() => onUnstake(stake)}
          className="flex-1 py-2 bg-gray-700 text-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
        >
          <ArrowDown className="w-4 h-4" />
          Unstake
        </button>
      </div>

      {isLocked && (
        <p className="text-yellow-400/80 text-xs mt-3 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Early withdrawal will incur {stake.pool?.earlyWithdrawalPenalty}% penalty
        </p>
      )}
    </div>
  );
}

// Calculator Component
function StakingCalculator({ pools }) {
  const [amount, setAmount] = useState('1000');
  const [selectedPool, setSelectedPool] = useState(pools[0]?._id || '');
  const [duration, setDuration] = useState(365);

  const pool = pools.find(p => p._id === selectedPool);
  const apy = pool?.apy || 0;
  const dailyRate = apy / 100 / 365;
  const totalRewards = parseFloat(amount || 0) * dailyRate * duration;
  const finalAmount = parseFloat(amount || 0) + totalRewards;

  return (
    <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-purple-600" />
        Rewards Calculator
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-500 text-sm mb-2">Amount to Stake</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-700 border border-gray-300 rounded-xl px-4 py-3 pr-20 text-gray-900 focus:border-purple-500 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">CYBEV</span>
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-2">Pool</label>
          <select
            value={selectedPool}
            onChange={(e) => setSelectedPool(e.target.value)}
            className="w-full bg-gray-700 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none"
          >
            {pools.map((p) => (
              <option key={p._id} value={p._id}>{p.name} - {p.apy}% APY</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-2">Duration: {duration} days</label>
          <input
            type="range"
            min="30"
            max="365"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Rewards</span>
            <span className="text-green-400 font-bold">+{totalRewards.toFixed(2)} CYBEV</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Value</span>
            <span className="text-gray-900 font-bold">{finalAmount.toFixed(2)} CYBEV</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StakingDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pools, setPools] = useState([]);
  const [userStakes, setUserStakes] = useState([]);
  const [totals, setTotals] = useState({ totalStaked: 0, pendingRewards: 0, claimedRewards: 0 });
  const [platformStats, setPlatformStats] = useState({});
  
  // Modals
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [selectedStake, setSelectedStake] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  // Sample pools for demo
  const samplePools = [
    { _id: '1', name: 'Flexible', description: 'No lock period', apy: 5, minStake: 10, lockPeriod: 0, earlyWithdrawalPenalty: 0, totalStaked: 125000, totalStakers: 340, icon: '🌊', color: '#3B82F6' },
    { _id: '2', name: '30 Day', description: 'Lock for 30 days', apy: 10, minStake: 100, lockPeriod: 30, earlyWithdrawalPenalty: 10, totalStaked: 450000, totalStakers: 120, icon: '🔥', color: '#F59E0B' },
    { _id: '3', name: '90 Day', description: 'Lock for 90 days', apy: 15, minStake: 500, lockPeriod: 90, earlyWithdrawalPenalty: 15, totalStaked: 890000, totalStakers: 85, icon: '💎', color: '#8B5CF6' },
    { _id: '4', name: '180 Day', description: 'Maximum returns', apy: 25, minStake: 1000, lockPeriod: 180, earlyWithdrawalPenalty: 20, totalStaked: 2100000, totalStakers: 45, icon: '👑', color: '#EC4899' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Fetch pools
      const poolsRes = await api.get('/api/staking/pools', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (poolsRes.data.ok) {
        setPools(poolsRes.data.pools);
      } else {
        setPools(samplePools);
      }

      // Fetch user stakes
      const stakesRes = await api.get('/api/staking/my-stakes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (stakesRes.data.ok) {
        setUserStakes(stakesRes.data.stakes);
        setTotals(stakesRes.data.totals);
      }

      // Fetch platform stats
      const statsRes = await api.get('/api/staking/platform-stats');
      if (statsRes.data.ok) {
        setPlatformStats(statsRes.data.stats);
      }
    } catch (error) {
      console.log('Using sample data');
      setPools(samplePools);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) < selectedPool.minStake) {
      alert(`Minimum stake is ${selectedPool.minStake} CYBEV`);
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/staking/stake', {
        poolId: selectedPool._id,
        amount: parseFloat(stakeAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert('Staked successfully!');
        fetchData();
        setShowStakeModal(false);
        setStakeAmount('');
      }
    } catch (error) {
      console.error('Stake error:', error);
      alert('Failed to stake. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleUnstake = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/staking/unstake/${selectedStake._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert(`Unstaked ${response.data.withdrawAmount} CYBEV` + 
          (response.data.penalty > 0 ? ` (${response.data.penalty} penalty applied)` : ''));
        fetchData();
        setShowUnstakeModal(false);
      }
    } catch (error) {
      console.error('Unstake error:', error);
      alert('Failed to unstake. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClaim = async (stake) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/staking/claim/${stake._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert(`Claimed ${response.data.claimedAmount.toFixed(4)} CYBEV!`);
        fetchData();
      }
    } catch (error) {
      console.error('Claim error:', error);
      alert('Failed to claim rewards.');
    }
  };

  const handleCompound = async (stake) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/staking/compound/${stake._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert(`Compounded ${response.data.compoundedAmount.toFixed(4)} CYBEV!`);
        fetchData();
      }
    } catch (error) {
      console.error('Compound error:', error);
      alert('Failed to compound rewards.');
    }
  };

  const openStakeModal = (pool) => {
    setSelectedPool(pool);
    setShowStakeModal(true);
  };

  const openUnstakeModal = (stake) => {
    setSelectedStake(stake);
    setShowUnstakeModal(true);
  };

  // Get user stake for each pool
  const getUserStakeForPool = (poolId) => {
    return userStakes.find(s => s.pool?._id === poolId && s.status === 'active');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Staking - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Coins className="w-8 h-8 text-purple-600" />
            Staking Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Stake your CYBEV tokens to earn passive rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Wallet className="w-5 h-5" />
              <span>Total Staked</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totals.totalStaked.toLocaleString()}</p>
            <p className="text-white/60 text-sm">CYBEV</p>
          </div>

          <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Gift className="w-5 h-5 text-green-400" />
              <span>Pending Rewards</span>
            </div>
            <p className="text-3xl font-bold text-green-400">+{totals.pendingRewards.toFixed(4)}</p>
            <p className="text-gray-500 text-sm">CYBEV</p>
          </div>

          <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Check className="w-5 h-5 text-blue-400" />
              <span>Claimed Rewards</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totals.claimedRewards.toFixed(2)}</p>
            <p className="text-gray-500 text-sm">CYBEV</p>
          </div>

          <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Platform TVL</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{(platformStats.totalStaked || 0).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">CYBEV</p>
          </div>
        </div>

        {/* Active Stakes */}
        {userStakes.filter(s => s.status === 'active').length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              Your Active Stakes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userStakes.filter(s => s.status === 'active').map((stake) => (
                <ActiveStakeCard
                  key={stake._id}
                  stake={stake}
                  onUnstake={openUnstakeModal}
                  onClaim={handleClaim}
                  onCompound={handleCompound}
                />
              ))}
            </div>
          </div>
        )}

        {/* Staking Pools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Staking Pools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pools.map((pool) => (
                <PoolCard
                  key={pool._id}
                  pool={pool}
                  onStake={openStakeModal}
                  userStake={getUserStakeForPool(pool._id)}
                />
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div>
            <StakingCalculator pools={pools} />
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Stake in {selectedPool.name}</h2>
              <button
                onClick={() => setShowStakeModal(false)}
                className="p-2 hover:bg-white rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">APY</span>
                <span className="text-green-400 font-bold">{selectedPool.apy}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Lock Period</span>
                <span className="text-gray-900">{selectedPool.lockPeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Min Stake</span>
                <span className="text-gray-900">{selectedPool.minStake} CYBEV</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-500 mb-2">Amount to Stake</label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-20 text-gray-900 focus:border-purple-500 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">CYBEV</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                disabled={processing}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Stake'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unstake Modal */}
      {showUnstakeModal && selectedStake && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Unstake</h2>
              <button
                onClick={() => setShowUnstakeModal(false)}
                className="p-2 hover:bg-white rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Staked Amount</span>
                <span className="text-gray-900 font-bold">{selectedStake.amount} CYBEV</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Pending Rewards</span>
                <span className="text-green-400">{(selectedStake.pendingRewards || 0).toFixed(4)} CYBEV</span>
              </div>
            </div>

            {new Date() < new Date(selectedStake.endDate) && selectedStake.pool?.lockPeriod > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <p className="text-yellow-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Early Withdrawal Warning
                </p>
                <p className="text-yellow-400/80 text-sm mt-1">
                  You will lose {selectedStake.pool.earlyWithdrawalPenalty}% of your staked amount and all pending rewards.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnstakeModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUnstake}
                disabled={processing}
                className="flex-1 py-3 bg-red-500 text-gray-900 rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Unstake'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}