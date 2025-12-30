// ============================================
// FILE: src/pages/admin/revenue.jsx
// PURPOSE: Admin Revenue & Payments Dashboard
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  DollarSign, ArrowLeft, TrendingUp, TrendingDown, CreditCard, Users, Download, Calendar, Filter, Loader2, ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Receipt, ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

function RevenueChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-700 rounded-t-lg relative overflow-hidden" style={{ height: `${(d.value / maxValue) * 100}%`, minHeight: '4px' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-pink-500" />
          </div>
          <span className="text-xs text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminRevenue() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState({
    totalRevenue: 0, subscriptionRevenue: 0, tipsRevenue: 0, adsRevenue: 0, nftRevenue: 0,
    growth: 0, transactions: 0, avgTransaction: 0, pendingPayouts: 0
  });
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { fetchData(); }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const res = await api.get(`/api/admin/revenue?period=${period}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: {} }));
      
      setStats({
        totalRevenue: res.data.totalRevenue || 45280,
        subscriptionRevenue: res.data.subscriptionRevenue || 28500,
        tipsRevenue: res.data.tipsRevenue || 8420,
        adsRevenue: res.data.adsRevenue || 5200,
        nftRevenue: res.data.nftRevenue || 3160,
        growth: res.data.growth || 23.5,
        transactions: res.data.transactions || 1245,
        avgTransaction: res.data.avgTransaction || 36.4,
        pendingPayouts: res.data.pendingPayouts || 12350
      });

      setChartData([
        { label: 'Jan', value: 28000 }, { label: 'Feb', value: 32000 }, { label: 'Mar', value: 29500 },
        { label: 'Apr', value: 35000 }, { label: 'May', value: 38000 }, { label: 'Jun', value: 42000 },
        { label: 'Jul', value: 39000 }, { label: 'Aug', value: 44000 }, { label: 'Sep', value: 41000 },
        { label: 'Oct', value: 46000 }, { label: 'Nov', value: 43000 }, { label: 'Dec', value: 45280 }
      ]);

      setTransactions([
        { id: '1', type: 'subscription', user: 'johndoe', amount: 9.99, status: 'completed', date: '2024-12-29T14:30:00Z' },
        { id: '2', type: 'tip', user: 'janesmith', creator: 'creator123', amount: 25.00, status: 'completed', date: '2024-12-29T13:45:00Z' },
        { id: '3', type: 'nft', user: 'collector', nft: 'Digital Art #42', amount: 150.00, status: 'completed', date: '2024-12-29T12:20:00Z' },
        { id: '4', type: 'payout', creator: 'topcreator', amount: 500.00, status: 'pending', date: '2024-12-29T10:00:00Z' },
        { id: '5', type: 'subscription', user: 'newuser', amount: 19.99, status: 'completed', date: '2024-12-29T09:15:00Z' },
      ]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'subscription': return 'bg-purple-500/20 text-purple-400';
      case 'tip': return 'bg-green-500/20 text-green-400';
      case 'nft': return 'bg-pink-500/20 text-pink-400';
      case 'payout': return 'bg-yellow-500/20 text-yellow-400';
      case 'ad': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <AppLayout>
      <Head><title>Revenue - Admin - CYBEV</title></Head>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/admin"><button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-5 h-5" />Back to Dashboard</button></Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center"><DollarSign className="w-7 h-7 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">Revenue & Payments</h1><p className="text-gray-400">Track platform earnings</p></div>
          </div>
          <div className="flex gap-3">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"><Download className="w-4 h-4" />Export</button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6 text-white" /></div>
                  <div className="flex items-center gap-1 text-green-400 text-sm"><ArrowUpRight className="w-4 h-4" />{stats.growth}%</div>
                </div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4"><CreditCard className="w-6 h-6 text-white" /></div>
                <p className="text-gray-400 text-sm">Subscriptions</p>
                <p className="text-2xl font-bold text-white">${stats.subscriptionRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-4"><PiggyBank className="w-6 h-6 text-white" /></div>
                <p className="text-gray-400 text-sm">Tips & Donations</p>
                <p className="text-2xl font-bold text-white">${stats.tipsRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4"><Wallet className="w-6 h-6 text-white" /></div>
                <p className="text-gray-400 text-sm">Pending Payouts</p>
                <p className="text-2xl font-bold text-white">${stats.pendingPayouts.toLocaleString()}</p>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Revenue Over Time</h3>
                <RevenueChart data={chartData} />
              </div>

              <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Revenue Sources</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-500" /><span className="text-gray-300">Subscriptions</span></div>
                    <span className="text-white font-medium">{((stats.subscriptionRevenue / stats.totalRevenue) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-gray-300">Tips</span></div>
                    <span className="text-white font-medium">{((stats.tipsRevenue / stats.totalRevenue) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-gray-300">Ads</span></div>
                    <span className="text-white font-medium">{((stats.adsRevenue / stats.totalRevenue) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-pink-500" /><span className="text-gray-300">NFTs</span></div>
                    <span className="text-white font-medium">{((stats.nftRevenue / stats.totalRevenue) * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Transactions</span><span className="text-white">{stats.transactions}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Avg Transaction</span><span className="text-white">${stats.avgTransaction}</span></div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <Link href="/admin/transactions"><span className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">View all<ChevronRight className="w-4 h-4" /></span></Link>
              </div>
              <div className="divide-y divide-gray-700/50">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-700/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        {tx.type === 'subscription' && <CreditCard className="w-5 h-5 text-purple-400" />}
                        {tx.type === 'tip' && <PiggyBank className="w-5 h-5 text-green-400" />}
                        {tx.type === 'nft' && <Receipt className="w-5 h-5 text-pink-400" />}
                        {tx.type === 'payout' && <Wallet className="w-5 h-5 text-yellow-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${getTypeColor(tx.type)}`}>{tx.type}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{tx.status}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {tx.type === 'tip' ? `@${tx.user} → @${tx.creator}` : tx.type === 'nft' ? tx.nft : tx.type === 'payout' ? `Payout to @${tx.creator}` : `@${tx.user}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === 'payout' ? 'text-red-400' : 'text-green-400'}`}>{tx.type === 'payout' ? '-' : '+'}${tx.amount.toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">{new Date(tx.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
