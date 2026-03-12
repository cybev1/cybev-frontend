// ============================================
// FILE: index.jsx
// PATH: /src/pages/wallet/index.jsx
// CYBEV Wallet v2.0 — USD + Credits + Subscriptions
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import {
  DollarSign, Coins, ArrowUpRight, ArrowDownLeft, Plus, Send, Clock,
  Loader2, TrendingUp, Gift, Award, Sparkles, CreditCard, RefreshCw,
  Crown, Zap, Star, Check, ChevronRight, ArrowRight, Wallet,
  Calendar, Shield, Users, Eye, Download, Upload
} from 'lucide-react';

const PLAN_ICONS = { free: Star, pro: Zap, business: Crown, enterprise: Shield };
const PLAN_COLORS = {
  free: { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'text-gray-600', btn: 'bg-gray-200 text-gray-700' },
  pro: { bg: 'bg-purple-50', border: 'border-purple-300', accent: 'text-purple-600', btn: 'bg-purple-600 text-white hover:bg-purple-700' },
  business: { bg: 'bg-amber-50', border: 'border-amber-300', accent: 'text-amber-600', btn: 'bg-amber-500 text-white hover:bg-amber-600' },
  enterprise: { bg: 'bg-indigo-50', border: 'border-indigo-300', accent: 'text-indigo-600', btn: 'bg-indigo-600 text-white hover:bg-indigo-700' }
};

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState({});
  const [rates, setRates] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [showFund, setShowFund] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchWallet(); }, []);

  // Check for funded/subscribed callback
  useEffect(() => {
    const { funded, transaction_id, tx_ref, subscribed } = router.query;
    if (funded && (transaction_id || tx_ref)) {
      verifyFunding(transaction_id || tx_ref);
    }
  }, [router.query]);

  const fetchWallet = async () => {
    try {
      const { data } = await api.get('/api/wallet');
      if (data.ok || data.wallet) {
        setWallet(data.wallet || { usdBalance: 0, credits: data.balance || 0 });
        setSubscription(data.subscription || { plan: 'free' });
        setPlans(data.plans || {});
        setRates(data.rates || { creditRate: 100, cashoutRate: 80 });
        setTransactions(data.transactions || []);
      }
    } catch (err) { console.error('Wallet fetch error:', err); }
    finally { setLoading(false); }
  };

  const verifyFunding = async (ref) => {
    try {
      setProcessing(true);
      const { data } = await api.post('/api/wallet/fund/verify', { reference: ref, transactionId: ref });
      if (data.ok) { alert(data.message || 'Wallet funded!'); fetchWallet(); }
    } catch (err) { console.error('Verify error:', err); }
    finally { setProcessing(false); router.replace('/wallet', undefined, { shallow: true }); }
  };

  const handleFund = async () => {
    const amt = parseFloat(fundAmount);
    if (!amt || amt < 1) return alert('Minimum $1');
    try {
      setProcessing(true);
      const { data } = await api.post('/api/wallet/fund', { amount: amt, currency: 'USD' });
      if (data.paymentLink) window.location.href = data.paymentLink;
      else alert(data.error || 'Failed');
    } catch (err) { alert(err?.response?.data?.error || 'Funding failed'); }
    finally { setProcessing(false); }
  };

  const handleBuyCredits = async () => {
    const amt = parseFloat(buyAmount);
    if (!amt || amt < 0.5) return alert('Minimum $0.50');
    try {
      setProcessing(true);
      const { data } = await api.post('/api/wallet/buy-credits', { usdAmount: amt });
      if (data.ok) { alert(data.message); fetchWallet(); setShowBuyCredits(false); setBuyAmount(''); }
      else alert(data.error);
    } catch (err) { alert(err?.response?.data?.error || 'Failed'); }
    finally { setProcessing(false); }
  };

  const handleDailyClaim = async () => {
    try {
      const { data } = await api.post('/api/wallet/claim-daily');
      if (data.ok) { alert(data.message); fetchWallet(); }
      else alert(data.error);
    } catch (err) { alert(err?.response?.data?.error || 'Already claimed today!'); }
  };

  const handleSubscribe = async (plan) => {
    try {
      setProcessing(true);
      const { data } = await api.post('/api/wallet/subscribe', { plan });
      if (data.needsPayment && data.paymentLink) {
        window.location.href = data.paymentLink;
      } else if (data.ok) {
        alert(data.message);
        fetchWallet();
      } else {
        alert(data.error || 'Failed');
      }
    } catch (err) { alert(err?.response?.data?.error || 'Subscription failed'); }
    finally { setProcessing(false); }
  };

  const canClaimDaily = () => {
    if (!wallet?.lastDailyClaim) return true;
    const last = new Date(wallet.lastDailyClaim);
    return (Date.now() - last.getTime()) / 3600000 > 20;
  };

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>
    </AppLayout>
  );

  const usd = wallet?.usdBalance || 0;
  const credits = wallet?.credits || 0;
  const currentPlan = subscription?.plan || 'free';

  return (
    <AppLayout>
      <Head><title>Wallet — CYBEV</title></Head>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* ─── Balance Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* USD Balance */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
            <p className="text-green-100 text-sm font-medium mb-1 flex items-center gap-1"><DollarSign size={14} /> USD Balance</p>
            <p className="text-3xl font-bold">${usd.toFixed(2)}</p>
            <p className="text-green-200 text-xs mt-1">Real money • withdraw anytime</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowFund(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                <Plus size={14} /> Fund
              </button>
              <button onClick={() => router.push('/wallet?tab=withdraw')}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors">
                <Download size={14} /> Withdraw
              </button>
            </div>
          </div>

          {/* Credits Balance */}
          <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 text-white">
            <p className="text-purple-100 text-sm font-medium mb-1 flex items-center gap-1"><Coins size={14} /> Credits</p>
            <p className="text-3xl font-bold">{credits.toLocaleString()}</p>
            <p className="text-purple-200 text-xs mt-1">1 USD = {rates.creditRate || 100} credits</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowBuyCredits(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                <Plus size={14} /> Buy Credits
              </button>
              <button onClick={handleDailyClaim} disabled={!canClaimDaily()}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 rounded-full text-sm font-medium transition-colors">
                <Gift size={14} /> {canClaimDaily() ? 'Claim Daily' : 'Claimed ✓'}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Quick Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500">Total Earned</p>
            <p className="text-lg font-bold text-gray-900">{(wallet?.totalCreditsEarned || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500">Total Funded</p>
            <p className="text-lg font-bold text-green-600">${(wallet?.totalFunded || 0).toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500">Streak</p>
            <p className="text-lg font-bold text-orange-500">{wallet?.streaks?.current || 0} days 🔥</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500">Plan</p>
            <p className="text-lg font-bold text-purple-600 capitalize">{currentPlan}</p>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'plans', 'transactions', 'earn'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {tab === 'overview' ? '💰 Overview' : tab === 'plans' ? '👑 Plans' : tab === 'transactions' ? '📊 History' : '🎁 Earn'}
            </button>
          ))}
        </div>

        {/* ─── Plans Tab ─── */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(plans).map(([key, plan]) => {
              const Icon = PLAN_ICONS[key] || Star;
              const colors = PLAN_COLORS[key] || PLAN_COLORS.free;
              const isCurrent = currentPlan === key;
              return (
                <div key={key} className={`rounded-2xl p-5 border-2 ${isCurrent ? colors.border : 'border-gray-200'} ${colors.bg} relative`}>
                  {isCurrent && <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">CURRENT</div>}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={20} className={colors.accent} />
                    <h3 className={`font-bold text-lg ${colors.accent}`}>{plan.name}</h3>
                  </div>
                  <div className="mb-3">
                    {plan.price === 0 ? (
                      <span className="text-2xl font-bold text-gray-900">Free</span>
                    ) : (
                      <><span className="text-2xl font-bold text-gray-900">${plan.price}</span><span className="text-gray-500 text-sm">/month</span></>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{plan.monthlyCredits?.toLocaleString()} credits/month</p>
                  <ul className="space-y-1.5 mb-4">
                    {(plan.features || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && plan.price > 0 && (
                    <button onClick={() => handleSubscribe(key)} disabled={processing}
                      className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${colors.btn}`}>
                      {processing ? 'Processing...' : usd >= plan.price ? `Subscribe — $${plan.price}/mo` : `Pay $${plan.price} to Subscribe`}
                    </button>
                  )}
                  {isCurrent && plan.price > 0 && (
                    <p className="text-center text-sm text-green-600 font-medium">✓ Active until {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : 'N/A'}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Overview Tab ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><DollarSign size={18} className="text-green-600" /></div>
                  <div><p className="font-medium text-gray-900">USD Wallet</p><p className="text-gray-500">Fund with card, mobile money, or crypto. Withdraw anytime.</p></div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"><Coins size={18} className="text-purple-600" /></div>
                  <div><p className="font-medium text-gray-900">Credits</p><p className="text-gray-500">Earn by creating content, buy with USD. Use for AI Studio, tips, boosts.</p></div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"><Crown size={18} className="text-amber-600" /></div>
                  <div><p className="font-medium text-gray-900">Premium Plans</p><p className="text-gray-500">Get monthly credits, AI access, analytics, and more.</p></div>
                </div>
              </div>
            </div>

            {/* Recent transactions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <button onClick={() => setActiveTab('transactions')} className="text-purple-600 text-sm font-medium">See all</button>
              </div>
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No transactions yet</p>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 8).map((tx, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-50'}`}>
                          {tx.amount > 0 ? <ArrowDownLeft size={14} className="text-green-600" /> : <ArrowUpRight size={14} className="text-red-500" />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{tx.description}</p>
                          <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-medium text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.currency === 'USD' ? `$${Math.abs(tx.amount).toFixed(2)}` : `${Math.abs(tx.amount).toLocaleString()} credits`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Transactions Tab ─── */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-50'}`}>
                        {tx.amount > 0 ? <ArrowDownLeft size={16} className="text-green-600" /> : <ArrowUpRight size={16} className="text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          {new Date(tx.createdAt).toLocaleString()}
                          {tx.status === 'pending' && <span className="text-amber-500">• Pending</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.currency === 'USD' ? `$${Math.abs(tx.amount).toFixed(2)}` : `${Math.abs(tx.amount).toLocaleString()}`}
                      </span>
                      <p className="text-[10px] text-gray-400">{tx.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Earn Tab ─── */}
        {activeTab === 'earn' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Ways to Earn Credits</h3>
              <div className="space-y-3">
                {[
                  { label: 'Publish a blog post', credits: 50, icon: '📝' },
                  { label: 'Upload a vlog', credits: 30, icon: '🎬' },
                  { label: 'Create a social post', credits: 10, icon: '💬' },
                  { label: 'Get a like on content', credits: 2, icon: '❤️' },
                  { label: 'Get a share', credits: 5, icon: '🔗' },
                  { label: 'Daily login', credits: '5+', icon: '📅' },
                  { label: 'Refer a friend', credits: 100, icon: '👥' },
                  { label: 'Streak bonus (per day)', credits: 2, icon: '🔥' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">+{item.credits} credits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Fund Modal ─── */}
      {showFund && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFund(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Fund Wallet</h2>
            <p className="text-sm text-gray-500 mb-4">Add USD to your wallet via card, mobile money, or bank transfer.</p>
            <div className="flex gap-2 mb-4">
              {[5, 10, 25, 50, 100].map(amt => (
                <button key={amt} onClick={() => setFundAmount(String(amt))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    fundAmount === String(amt) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  ${amt}
                </button>
              ))}
            </div>
            <input type="number" min="1" step="0.01" placeholder="Or enter amount..."
              value={fundAmount} onChange={e => setFundAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-green-500" />
            <div className="flex gap-3">
              <button onClick={() => setShowFund(false)} className="flex-1 py-3 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleFund} disabled={processing || !fundAmount}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors">
                {processing ? 'Processing...' : `Fund $${fundAmount || '0'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Buy Credits Modal ─── */}
      {showBuyCredits && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBuyCredits(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Buy Credits</h2>
            <p className="text-sm text-gray-500 mb-4">1 USD = {rates.creditRate || 100} credits. Balance: ${usd.toFixed(2)}</p>
            <div className="flex gap-2 mb-4">
              {[1, 5, 10, 25].map(amt => (
                <button key={amt} onClick={() => setBuyAmount(String(amt))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    buyAmount === String(amt) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'
                  }`}>
                  <div>${amt}</div>
                  <div className="text-[10px] text-purple-500">{amt * (rates.creditRate || 100)} credits</div>
                </button>
              ))}
            </div>
            <input type="number" min="0.5" step="0.5" placeholder="USD amount..."
              value={buyAmount} onChange={e => setBuyAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-2 outline-none focus:ring-2 focus:ring-purple-500" />
            {buyAmount && (
              <p className="text-sm text-purple-600 mb-4 font-medium text-center">
                You'll get {Math.floor((parseFloat(buyAmount) || 0) * (rates.creditRate || 100)).toLocaleString()} credits
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowBuyCredits(false)} className="flex-1 py-3 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleBuyCredits} disabled={processing || !buyAmount || parseFloat(buyAmount) > usd}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors">
                {processing ? 'Processing...' : 'Buy Credits'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
