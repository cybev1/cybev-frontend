// ============================================
// FILE: src/pages/earnings/index.jsx
// Creator Earnings Dashboard
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Gift,
  Heart,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  Download,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Currency formatter
const formatCurrency = (amount, currency = 'NGN') => {
  const symbols = { NGN: '₦', USD: '$', GHS: '₵', GBP: '£', EUR: '€' };
  return `${symbols[currency] || ''}${amount?.toLocaleString() || '0'}`;
};

// Stat Card
function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-sm font-medium ${
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{value}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

// Transaction Item
function TransactionItem({ transaction }) {
  const typeConfig = {
    tip: { icon: Heart, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' },
    donation: { icon: Gift, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
    subscription: { icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' }
  };

  const config = typeConfig[transaction.type] || typeConfig.tip;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">
          {transaction.metadata?.anonymous ? 'Anonymous' : transaction.user?.name || 'Someone'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {transaction.metadata?.message || `Sent a ${transaction.type}`}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">
          +{formatCurrency(transaction.amount, transaction.currency)}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default function EarningsDashboard() {
  const router = useRouter();
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchEarnings();
    fetchUser();
  }, [period]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user || response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/payments/earnings?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEarnings(response.data);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <>
      <Head>
        <title>Earnings | CYBEV</title>
        <meta name="description" content="Track your creator earnings and payments" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-7 h-7 text-green-600" />
                  Earnings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Track your tips, donations, and revenue
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchEarnings}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
                
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium"
                >
                  {periodOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Balance Card */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 text-white">
                <p className="text-white/80 mb-2">Available Balance</p>
                <p className="text-4xl font-bold mb-4">
                  {formatCurrency(user?.walletBalance || 0, 'NGN')}
                </p>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Withdraw
                  </button>
                  <button className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Add Bank
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Tips Received"
                  value={formatCurrency(earnings?.earnings?.period?.tips || 0)}
                  icon={Heart}
                  color="bg-gradient-to-br from-pink-500 to-rose-600"
                />
                <StatCard
                  title="Donations"
                  value={formatCurrency(earnings?.earnings?.period?.donations || 0)}
                  icon={Gift}
                  color="bg-gradient-to-br from-purple-500 to-violet-600"
                />
                <StatCard
                  title="Subscriptions"
                  value={formatCurrency(earnings?.earnings?.period?.subscriptions || 0)}
                  icon={Users}
                  color="bg-gradient-to-br from-blue-500 to-cyan-600"
                />
                <StatCard
                  title="All-Time Earnings"
                  value={formatCurrency(earnings?.earnings?.allTime || 0)}
                  icon={TrendingUp}
                  color="bg-gradient-to-br from-green-500 to-emerald-600"
                  subtitle={`${earnings?.earnings?.transactionCount || 0} transactions`}
                />
              </div>

              {/* Recent Transactions */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Transactions
                  </h2>
                  <button 
                    onClick={() => router.push('/wallet/transactions')}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-6">
                  {earnings?.recentTransactions?.length > 0 ? (
                    <div className="space-y-2">
                      {earnings.recentTransactions.map((tx) => (
                        <TransactionItem key={tx._id} transaction={tx} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Wallet className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Share your profile to start receiving tips!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips for Earning More */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  💡 Tips to Earn More
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    Add a tip button to your profile and posts
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    Go live regularly - viewers can tip during streams
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    Create exclusive content for your supporters
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    Engage with your audience consistently
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
