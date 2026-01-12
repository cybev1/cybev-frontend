// ============================================
// FILE: src/pages/wallet/index.jsx
// CYBEV Wallet - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import {
  Coins, ArrowUpRight, ArrowDownLeft, Plus, Send, Clock, ChevronRight,
  Loader2, TrendingUp, Gift, Award, Sparkles, CreditCard, RefreshCw
} from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState({ balance: 0, pending: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWallet(); }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }
      const res = await api.get('/api/wallet', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.ok || res.data.wallet) {
        setWallet(res.data.wallet || { balance: res.data.balance || 0, pending: res.data.pending || 0 });
        setTransactions(res.data.transactions || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const EARN_OPTIONS = [
    { icon: Sparkles, label: 'Create Content', description: 'Earn 50-200 CYBEV per post', href: '/studio', color: '#7c3aed' },
    { icon: Gift, label: 'Daily Check-in', description: 'Earn 10 CYBEV daily', href: '#', color: '#10b981' },
    { icon: Award, label: 'Refer Friends', description: 'Earn 100 CYBEV per referral', href: '/invite', color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head><title>Wallet | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl mb-6"
            style={{ boxShadow: '0 10px 40px rgba(124, 58, 237, 0.3)' }}>
            <p className="text-purple-200 text-sm font-medium mb-1">Total Balance</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h1 className="text-4xl font-bold">{wallet.balance?.toLocaleString() || 0}</h1>
              <span className="text-lg text-purple-200">CYBEV</span>
            </div>
            {wallet.pending > 0 && (
              <p className="text-sm text-purple-200 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {wallet.pending} pending
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />Send
              </button>
              <button className="flex-1 py-3 bg-white/20 backdrop-blur rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                <ArrowDownLeft className="w-5 h-5" />Receive
              </button>
              <button className="flex-1 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />Buy
              </button>
            </div>
          </div>

          {/* Earn More */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Earn More CYBEV</h2>
            <div className="space-y-3">
              {EARN_OPTIONS.map((option, i) => (
                <Link key={i} href={option.href}>
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${option.color}15` }}>
                      <option.icon className="w-6 h-6" style={{ color: option.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Transaction History</h2>
              <button className="text-purple-600 text-sm font-medium hover:underline">View All</button>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Coins className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-500">Start creating content to earn CYBEV!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.slice(0, 10).map((tx, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{tx.description || tx.type}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{tx.amount} CYBEV
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
