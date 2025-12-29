// ============================================
// FILE: src/pages/wallet/index.jsx
// PATH: cybev-frontend/src/pages/wallet/index.jsx
// PURPOSE: User wallet page for CYBEV tokens
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Wallet,
  Send,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  TrendingUp,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Gift,
  Zap,
  History,
  CreditCard
} from 'lucide-react';
import api from '@/lib/api';

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);

  // Wallet address - in production, this comes from Web3 connection
  const walletAddress = user?.walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0Ab3e';

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
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    // Fetch wallet data
    fetchWalletData();
    setLoading(false);
  }, [router]);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      // Fetch balance
      const balanceRes = await api.get('/api/rewards/balance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (balanceRes.data.ok) {
        setBalance(balanceRes.data.balance || 0);
      }

      // Fetch transactions
      const txRes = await api.get('/api/rewards/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (txRes.data.ok) {
        setTransactions(txRes.data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sample transactions if no real data
  const displayTransactions = transactions.length > 0 ? transactions : [
    { id: 1, type: 'received', amount: 100, from: 'Content Reward', date: new Date().toISOString(), status: 'completed' },
    { id: 2, type: 'received', amount: 50, from: 'Tip from creator', date: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Wallet - CYBEV</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
            <p className="text-gray-400">Manage your CYBEV tokens and transactions</p>
          </div>
          <button 
            onClick={fetchWalletData}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-purple-200 text-sm mb-2">Total Balance</p>
              <p className="text-5xl font-bold text-white mb-2">{balance.toLocaleString()} CYBEV</p>
              <p className="text-purple-200">≈ ${(balance * 0.01).toFixed(2)} USD</p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors backdrop-blur-sm">
                <Send className="w-5 h-5" />
                Send
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors">
                <Download className="w-5 h-5" />
                Receive
              </button>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="relative mt-6 p-4 bg-black/20 rounded-xl backdrop-blur-sm">
            <p className="text-purple-200 text-sm mb-2">Wallet Address</p>
            <div className="flex items-center gap-3">
              <code className="text-white font-mono text-sm truncate flex-1">{walletAddress}</code>
              <button 
                onClick={copyAddress} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
              </button>
              <a 
                href={`https://polygonscan.com/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Zap, label: 'Stake', desc: 'Earn rewards', color: 'green' },
            { icon: Gift, label: 'Tip', desc: 'Support creators', color: 'yellow' },
            { icon: TrendingUp, label: 'Trade', desc: 'Buy/Sell tokens', color: 'blue' },
            { icon: Coins, label: 'Earn', desc: 'Create & earn', color: 'purple' }
          ].map((action) => (
            <button 
              key={action.label}
              className="p-4 bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105 text-center group"
            >
              <div className={`w-12 h-12 bg-${action.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 text-${action.color}-400`} />
              </div>
              <p className="text-white font-medium">{action.label}</p>
              <p className="text-gray-400 text-sm">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'transactions', 'staking', 'earnings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ArrowDownLeft, label: 'Total Received', value: `${balance} CYBEV`, color: 'green' },
              { icon: ArrowUpRight, label: 'Total Sent', value: '0 CYBEV', color: 'red' },
              { icon: Zap, label: 'Staked', value: '0 CYBEV', color: 'purple' }
            ].map((stat) => (
              <div key={stat.label} className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </h3>
            </div>
            <div className="divide-y divide-purple-500/10">
              {displayTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-purple-500/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'received' ? 'bg-green-500/20' :
                      tx.type === 'sent' ? 'bg-red-500/20' : 'bg-purple-500/20'
                    }`}>
                      {tx.type === 'received' ? <ArrowDownLeft className="w-5 h-5 text-green-400" /> :
                       tx.type === 'sent' ? <ArrowUpRight className="w-5 h-5 text-red-400" /> :
                       <Zap className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{tx.type}</p>
                      <p className="text-gray-400 text-sm">{tx.from || tx.to || 'Staking Pool'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.type === 'received' ? 'text-green-400' :
                      tx.type === 'sent' ? 'text-red-400' : 'text-purple-400'
                    }`}>
                      {tx.type === 'sent' ? '-' : '+'}{tx.amount} CYBEV
                    </p>
                    <p className="text-gray-500 text-sm">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staking' && (
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Stake CYBEV Tokens</h3>
              <p className="text-gray-400 mb-6">Earn up to 15% APY by staking your tokens. The longer you stake, the more you earn!</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { period: '30 Days', apy: '5%' },
                  { period: '90 Days', apy: '10%' },
                  { period: '180 Days', apy: '15%' }
                ].map((plan) => (
                  <div key={plan.period} className="p-4 bg-gray-800/50 rounded-lg border border-purple-500/20">
                    <p className="text-purple-400 font-bold text-lg">{plan.apy}</p>
                    <p className="text-gray-400 text-sm">{plan.period}</p>
                  </div>
                ))}
              </div>
              
              <button className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                Start Staking
              </button>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Earning Dashboard</h3>
              <p className="text-gray-400 mb-6">Track your content earnings and rewards from the CYBEV platform.</p>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Views', value: '0', color: 'blue' },
                  { label: 'Tips', value: '0', color: 'green' },
                  { label: 'Subs', value: '0', color: 'purple' }
                ].map((stat) => (
                  <div key={stat.label} className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
