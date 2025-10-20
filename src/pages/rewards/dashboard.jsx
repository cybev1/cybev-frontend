import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { rewardAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  Coins, TrendingUp, Award, Zap, Gift, Calendar,
  Trophy, Target, Flame, Clock, ArrowUp, Check
} from 'lucide-react';

export default function RewardsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view rewards');
      router.push('/auth/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [walletRes, statsRes, transactionsRes, achievementsRes, leaderboardRes] = await Promise.all([
        rewardAPI.getWallet(),
        rewardAPI.getStats(),
        rewardAPI.getTransactions({ limit: 10 }),
        rewardAPI.getAchievements(),
        rewardAPI.getLeaderboard({ type: 'tokens', limit: 10 })
      ]);

      if (walletRes.data.ok) setWallet(walletRes.data.wallet);
      if (statsRes.data.ok) setStats(statsRes.data.stats);
      if (transactionsRes.data.ok) setTransactions(transactionsRes.data.transactions);
      if (achievementsRes.data.ok) setAchievements(achievementsRes.data.achievements);
      if (leaderboardRes.data.ok) setLeaderboard(leaderboardRes.data.leaderboard);
    } catch (error) {
      toast.error('Failed to load rewards data');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimBonus = async () => {
    setClaiming(true);
    try {
      const response = await rewardAPI.claimDailyBonus();
      if (response.data.ok) {
        toast.success(`🎉 ${response.data.message}`);
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to claim bonus');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <ArrowUp className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{label}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  const TransactionItem = ({ transaction }) => {
    const icons = {
      BLOG_POST: PenTool,
      BLOG_LIKE: Heart,
      DOMAIN_SETUP: Globe,
      BONUS: Gift
    };
    const Icon = icons[transaction.type] || Coins;

    return (
      <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Icon className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{transaction.description}</p>
            <p className="text-gray-400 text-xs">
              {new Date(transaction.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-green-400 font-semibold">
          +{transaction.amount} tokens
        </div>
      </div>
    );
  };

  const AchievementCard = ({ achievement }) => (
    <div className={`bg-white/10 backdrop-blur-lg border ${achievement.unlocked ? 'border-yellow-500/50' : 'border-white/20'} rounded-xl p-4 hover:bg-white/15 transition-all ${!achievement.unlocked && 'opacity-50'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 ${achievement.unlocked ? 'bg-yellow-500/20' : 'bg-white/10'} rounded-lg`}>
          <Award className={`w-6 h-6 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`} />
        </div>
        {achievement.unlocked && (
          <div className="p-1 bg-green-500/20 rounded-full">
            <Check className="w-4 h-4 text-green-400" />
          </div>
        )}
      </div>
      <h4 className="text-white font-semibold mb-1">{achievement.name}</h4>
      <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 text-sm font-medium">{achievement.reward} tokens</span>
      </div>
    </div>
  );

  const LeaderboardItem = ({ user, rank, tokens }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${rank <= 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-white/10'} font-bold text-white text-sm`}>
          {rank}
        </div>
        <div>
          <p className="text-white font-medium">{user?.name || 'Anonymous'}</p>
          <p className="text-gray-400 text-xs">{user?.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-yellow-400 font-semibold">
        <Coins className="w-4 h-4" />
        {tokens}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Rewards Dashboard</h1>
              <p className="text-gray-400">Track your earnings and achievements</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-400 text-sm">Total Balance</span>
              </div>
              <p className="text-4xl font-bold text-white">{wallet?.balance || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Bonus Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Gift className="w-12 h-12 text-purple-400" />
            <div>
              <h3 className="text-white font-semibold text-lg">Daily Bonus Available!</h3>
              <p className="text-gray-300">Claim your free 10 tokens today</p>
            </div>
          </div>
          <button
            onClick={handleClaimBonus}
            disabled={claiming}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {claiming ? 'Claiming...' : 'Claim Now'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            label="Total Earned"
            value={stats?.totalEarned || 0}
            color="green"
            trend="+12%"
          />
          <StatCard
            icon={Target}
            label="Blogs Published"
            value={stats?.blogCount || 0}
            color="blue"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${stats?.currentStreak || 0} days`}
            color="orange"
          />
          <StatCard
            icon={Trophy}
            label="Achievements"
            value={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`}
            color="yellow"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Transactions & Achievements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Transactions */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Coins className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction, idx) => (
                    <TransactionItem key={idx} transaction={transaction} />
                  ))}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Achievements</h2>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, idx) => (
                  <AchievementCard key={idx} achievement={achievement} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Leaderboard */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Your Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Total Views</span>
                  <span className="text-white font-semibold">{stats?.totalViews || 0}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Total Likes</span>
                  <span className="text-white font-semibold">{stats?.totalLikes || 0}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Longest Streak</span>
                  <span className="text-white font-semibold">{stats?.longestStreak || 0} days</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-400">Tokens Earned</span>
                  <span className="text-yellow-400 font-semibold">{stats?.totalEarned || 0}</span>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Top Earners</h2>
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((item, idx) => (
                  <LeaderboardItem
                    key={idx}
                    user={item.user}
                    rank={idx + 1}
                    tokens={item.totalEarned}
                  />
                ))}
              </div>
            </div>

            {/* Earning Tips */}
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">Earning Tips</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Publish blogs to earn 50 tokens each</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Get 5 tokens for each like on your posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Maintain daily posting streak for bonuses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Unlock achievements for extra rewards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Connect custom domain for 200 tokens</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}