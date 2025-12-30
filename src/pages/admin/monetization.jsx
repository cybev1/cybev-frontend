// ============================================
// FILE: src/pages/admin/monetization.jsx
// PURPOSE: Admin Monetization Settings & Management
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  TrendingUp, ArrowLeft, DollarSign, CreditCard, Star, Crown, Gift, Percent, Settings, CheckCircle, Edit, Plus, Trash2, Loader2, Users, BarChart3, Zap
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminMonetization() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [stats, setStats] = useState({});
  const [plans, setPlans] = useState([]);
  const [adsSettings, setAdsSettings] = useState({});
  const [creatorSettings, setCreatorSettings] = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      setStats({
        totalSubscribers: 2450,
        monthlyRevenue: 28500,
        avgRevenuePerUser: 11.63,
        conversionRate: 8.5,
        activeCreators: 342,
        totalTips: 8420,
        adRevenue: 5200,
        nftSales: 3160
      });

      setPlans([
        { id: '1', name: 'Free', price: 0, interval: 'month', features: ['5 posts/day', 'Basic analytics', 'Community access'], subscribers: 45230, active: true },
        { id: '2', name: 'Pro', price: 9.99, interval: 'month', features: ['Unlimited posts', 'Advanced analytics', 'Priority support', 'Custom domain', 'No ads'], subscribers: 1890, active: true },
        { id: '3', name: 'Creator', price: 19.99, interval: 'month', features: ['All Pro features', 'Monetization tools', 'NFT minting', 'Revenue share', 'API access'], subscribers: 560, active: true },
        { id: '4', name: 'Annual Pro', price: 99.99, interval: 'year', features: ['All Pro features', '2 months free'], subscribers: 420, active: true },
      ]);

      setAdsSettings({
        enabled: true,
        adTypes: { banner: true, interstitial: false, native: true, video: true },
        frequency: { minInterval: 3, maxPerSession: 5 },
        targeting: { location: true, interests: true, behavior: true },
        revenue: { cpm: 2.50, fillRate: 78 }
      });

      setCreatorSettings({
        revenueShare: 80,
        minPayout: 50,
        payoutSchedule: 'monthly',
        tippingEnabled: true,
        minTip: 1,
        maxTip: 500,
        subscriptionsEnabled: true
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <Head><title>Monetization - Admin - CYBEV</title></Head>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/admin"><button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-5 h-5" />Back to Dashboard</button></Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center"><TrendingUp className="w-7 h-7 text-white" /></div>
          <div><h1 className="text-2xl font-bold text-white">Monetization</h1><p className="text-gray-400">Manage subscriptions, ads & creator earnings</p></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 p-4">
            <Crown className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalSubscribers?.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Premium Subscribers</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-4">
            <DollarSign className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">${stats.monthlyRevenue?.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Monthly Revenue</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-4">
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.activeCreators}</p>
            <p className="text-gray-400 text-sm">Active Creators</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-4">
            <Percent className="w-6 h-6 text-pink-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
            <p className="text-gray-400 text-sm">Conversion Rate</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
          {[
            { id: 'subscriptions', label: 'Subscription Plans', icon: Crown },
            { id: 'ads', label: 'Ad Settings', icon: BarChart3 },
            { id: 'creators', label: 'Creator Earnings', icon: Star },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
        ) : (
          <>
            {/* Subscription Plans */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Subscription Plans</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"><Plus className="w-4 h-4" />Add Plan</button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className={`rounded-2xl border p-6 ${plan.price === 0 ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold">{plan.name}</h4>
                        <button className="p-1 hover:bg-gray-700 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">/{plan.interval}</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400" />{feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-gray-400 text-sm">{plan.subscribers.toLocaleString()} subscribers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Settings */}
            {activeTab === 'ads' && (
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Advertising Settings</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">Ads Enabled</span>
                      <button className={`relative w-12 h-7 rounded-full transition-colors ${adsSettings.enabled ? 'bg-green-500' : 'bg-gray-600'}`}>
                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${adsSettings.enabled ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-4">Ad Types</h4>
                      <div className="space-y-3">
                        {Object.entries(adsSettings.adTypes || {}).map(([type, enabled]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-gray-300 capitalize">{type} Ads</span>
                            <button className={`relative w-10 h-6 rounded-full ${enabled ? 'bg-purple-500' : 'bg-gray-600'}`}>
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'left-4' : 'left-0.5'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-4">Performance</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between"><span className="text-gray-400">Average CPM</span><span className="text-white">${adsSettings.revenue?.cpm}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Fill Rate</span><span className="text-white">{adsSettings.revenue?.fillRate}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Monthly Revenue</span><span className="text-green-400">${stats.adRevenue?.toLocaleString()}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Creator Earnings */}
            {activeTab === 'creators' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-4">
                    <Gift className="w-6 h-6 text-pink-400 mb-2" />
                    <p className="text-2xl font-bold text-white">${stats.totalTips?.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Total Tips This Month</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-4">
                    <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                    <p className="text-2xl font-bold text-white">${stats.nftSales?.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">NFT Sales This Month</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-4">
                    <Percent className="w-6 h-6 text-green-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{creatorSettings.revenueShare}%</p>
                    <p className="text-gray-400 text-sm">Creator Revenue Share</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Creator Payout Settings</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Revenue Share (%)</label>
                        <input type="number" value={creatorSettings.revenueShare} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Minimum Payout ($)</label>
                        <input type="number" value={creatorSettings.minPayout} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Payout Schedule</label>
                        <select value={creatorSettings.payoutSchedule} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white">
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                        <span className="text-gray-300">Enable Tipping</span>
                        <button className={`relative w-10 h-6 rounded-full ${creatorSettings.tippingEnabled ? 'bg-purple-500' : 'bg-gray-600'}`}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full ${creatorSettings.tippingEnabled ? 'left-4' : 'left-0.5'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                        <span className="text-gray-300">Enable Creator Subscriptions</span>
                        <button className={`relative w-10 h-6 rounded-full ${creatorSettings.subscriptionsEnabled ? 'bg-purple-500' : 'bg-gray-600'}`}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full ${creatorSettings.subscriptionsEnabled ? 'left-4' : 'left-0.5'}`} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Min Tip ($)</label>
                          <input type="number" value={creatorSettings.minTip} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white" />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Max Tip ($)</label>
                          <input type="number" value={creatorSettings.maxTip} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600">Save Settings</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
