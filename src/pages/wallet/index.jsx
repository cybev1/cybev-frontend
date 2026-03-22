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

const PLAN_ICONS = { free: Star, starter: Zap, pro: Crown, business: Shield, superuser: Sparkles };
const PLAN_COLORS = {
  free: { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'text-gray-600', btn: 'bg-gray-200 text-gray-700' },
  starter: { bg: 'bg-blue-50', border: 'border-blue-300', accent: 'text-blue-600', btn: 'bg-blue-600 text-white hover:bg-blue-700' },
  pro: { bg: 'bg-purple-50', border: 'border-purple-300', accent: 'text-purple-600', btn: 'bg-purple-600 text-white hover:bg-purple-700' },
  business: { bg: 'bg-amber-50', border: 'border-amber-300', accent: 'text-amber-600', btn: 'bg-amber-500 text-white hover:bg-amber-600' },
  superuser: { bg: 'bg-gradient-to-br from-purple-50 to-pink-50', border: 'border-purple-400', accent: 'text-purple-700', btn: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' }
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
  const [fundProvider, setFundProvider] = useState('flutterwave');
  const [subscribingPlan, setSubscribingPlan] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState(''); // per-plan processing // 'flutterwave' or 'espees'

  // Auto-detect local currency from timezone
  const detectCurrency = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Accra') || tz.includes('Africa/Accra')) return 'GHS';
      if (tz.includes('Lagos') || tz.includes('Africa/Lagos')) return 'NGN';
      if (tz.includes('Nairobi') || tz.includes('Africa/Nairobi')) return 'KES';
      if (tz.includes('Africa/')) return 'USD'; // other African countries default USD
    } catch {}
    return 'USD';
  };
  const [fundCurrency, setFundCurrency] = useState(detectCurrency);

  useEffect(() => { fetchWallet(); }, []);

  // Check for funded/subscribed callback
  useEffect(() => {
    const { funded, transaction_id, tx_ref, subscribed, provider, payment_ref } = router.query;
    if (funded && (transaction_id || tx_ref || payment_ref)) {
      const ref = payment_ref || transaction_id || tx_ref;
      const prov = provider || 'flutterwave';
      verifyFunding(ref, prov);
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

  const verifyFunding = async (ref, prov = 'flutterwave') => {
    try {
      setProcessing(true);
      const { data } = await api.post('/api/wallet/fund/verify', { reference: ref, transactionId: ref, provider: prov });
      if (data.ok) { alert(data.message || 'Wallet funded!'); fetchWallet(); }
    } catch (err) { console.error('Verify error:', err); }
    finally { setProcessing(false); router.replace('/wallet', undefined, { shallow: true }); }
  };

  const handleFund = async () => {
    const amt = parseFloat(fundAmount);
    if (!amt || amt < 1) return alert('Minimum amount is 1');
    try {
      setProcessing(true);
      const { data } = await api.post('/api/wallet/fund', { amount: amt, currency: fundCurrency, provider: fundProvider });
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

  const handleTransfer = async () => {
    if (!transferTo.trim()) return alert('Enter a username or email');
    const amt = parseInt(transferAmount);
    if (!amt || amt < 10) return alert('Minimum transfer is 10 credits');
    if (amt > (wallet?.credits || 0)) return alert(`You only have ${wallet?.credits || 0} credits`);
    if (!confirm(`Send ${amt.toLocaleString()} credits to "${transferTo}"?`)) return;
    try {
      setProcessing(true);
      const { data } = await api.post('/api/wallet/transfer', { recipient: transferTo.trim(), amount: amt, note: transferNote.trim() });
      if (data.ok) {
        alert(data.message);
        fetchWallet();
        setShowTransfer(false);
        setTransferTo(''); setTransferAmount(''); setTransferNote('');
      } else alert(data.error);
    } catch (err) { alert(err?.response?.data?.error || 'Transfer failed'); }
    finally { setProcessing(false); }
  };

  const handleSubscribe = async (plan) => {
    try {
      setSubscribingPlan(plan);
      const { data } = await api.post('/api/wallet/subscribe', { plan, currency: fundCurrency });
      if (data.needsPayment && data.paymentLink) {
        window.location.href = data.paymentLink;
      } else if (data.ok) {
        alert(data.message);
        fetchWallet();
      } else {
        alert(data.error || 'Failed');
      }
    } catch (err) { alert(err?.response?.data?.error || 'Subscription failed'); }
    finally { setSubscribingPlan(null); }
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
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setShowBuyCredits(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                <Plus size={14} /> Buy
              </button>
              <button onClick={() => setShowTransfer(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
                <Send size={14} /> Send
              </button>
              <button onClick={handleDailyClaim} disabled={!canClaimDaily()}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 rounded-full text-sm font-medium transition-colors">
                <Gift size={14} /> {canClaimDaily() ? 'Daily' : '✓'}
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
          <div className="space-y-4">
            {/* Currency selector for plans */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Pay with:</span>
              {[
                { code: 'USD', label: '🇺🇸 USD (Card)', flag: '💳' },
                { code: 'GHS', label: '🇬🇭 GHS (MoMo/Card)', flag: '📱' },
                { code: 'NGN', label: '🇳🇬 NGN (MoMo/Card)', flag: '📱' },
                { code: 'KES', label: '🇰🇪 KES (M-Pesa/Card)', flag: '📱' },
              ].map(c => (
                <button key={c.code} onClick={() => setFundCurrency(c.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    fundCurrency === c.code ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{c.label}</button>
              ))}
            </div>
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
                  {!isCurrent && plan.price > 0 && (() => {
                    const rates = { USD: 1, GHS: 16, NGN: 1600, KES: 155 };
                    const localPrice = Math.ceil(plan.price * (rates[fundCurrency] || 1) * 100) / 100;
                    const priceLabel = fundCurrency === 'USD' 
                      ? `$${plan.price}` 
                      : `${localPrice.toLocaleString()} ${fundCurrency} (~$${plan.price})`;
                    const isSubscribing = subscribingPlan === key;
                    return (
                      <button onClick={() => handleSubscribe(key)} disabled={!!subscribingPlan}
                        className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${colors.btn} disabled:opacity-50`}>
                        {isSubscribing ? 'Processing...' : `Subscribe — ${priceLabel}/mo`}
                      </button>
                    );
                  })()}
                  {isCurrent && plan.price > 0 && (
                    <p className="text-center text-sm text-green-600 font-medium">✓ Active until {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : 'N/A'}</p>
                  )}
                </div>
              );
            })}

            {/* Managed Campaign — Contact Us */}
            <div className="rounded-2xl p-5 border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center text-center">
              <Users size={28} className="text-blue-500 mb-2" />
              <h3 className="font-bold text-lg text-gray-900 mb-1">Need Us to Manage Everything?</h3>
              <p className="text-sm text-gray-500 mb-3">Our team manages your campaigns, content, socials, and growth — so you can focus on what matters.</p>
              <a href="mailto:hello@cybev.io?subject=Managed%20Campaign%20Inquiry" 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
                Contact Us
              </a>
              <p className="text-xs text-gray-400 mt-2">Custom pricing based on your needs</p>
            </div>

          </div>
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

            {/* Smart Upgrade Banner — only for free users */}
            {(!subscription?.plan || subscription?.plan === 'free') && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={20} />
                    <h3 className="font-bold text-lg">Unlock the Full Power of CYBEV</h3>
                  </div>
                  <p className="text-purple-100 text-sm mb-3">Start your 7-day free trial — make unlimited AI videos, movies, music, and grow your audience 10x faster.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab('plans')} className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors">
                      Start Free Trial
                    </button>
                    <button onClick={() => setActiveTab('plans')} className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                      See Plans
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Plans Overview */}
            {plans && Object.keys(plans).length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Upgrade Your Plan</h3>
                  <button onClick={() => setActiveTab('plans')} className="text-purple-600 text-sm font-medium">See all plans</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(plans).map(([key, p]) => {
                    const isCurrent = (subscription?.plan || 'free') === key;
                    const colors = key === 'free' ? 'bg-gray-50 border-gray-200' : key === 'starter' ? 'bg-blue-50 border-blue-200' : key === 'pro' ? 'bg-purple-50 border-purple-200' : key === 'superuser' ? 'bg-purple-50 border-purple-300' : 'bg-amber-50 border-amber-200';
                    return (
                      <div key={key} className={`rounded-xl p-3 border-2 text-center ${isCurrent ? 'border-green-500 bg-green-50' : colors}`}>
                        <p className="text-xs font-bold uppercase text-gray-500">{p.name}</p>
                        <p className="text-lg font-black text-gray-900">{p.price === 0 ? 'Free' : `$${p.price}`}</p>
                        {p.price > 0 && <p className="text-[10px] text-gray-400">/month</p>}
                        {isCurrent ? (
                          <span className="text-[10px] text-green-600 font-bold">✓ CURRENT</span>
                        ) : p.price > 0 ? (
                          <button onClick={() => { setActiveTab('plans'); }}
                            className="mt-1 px-3 py-1 bg-purple-600 text-white rounded-full text-[10px] font-bold hover:bg-purple-700">
                            Upgrade
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
            <h2 className="text-lg font-bold text-gray-900 mb-2">Fund Wallet</h2>
            <p className="text-sm text-gray-500 mb-4">Add funds via card, mobile money (MoMo), bank transfer, or Espees.</p>

            {/* Payment Gateway Selector */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setFundProvider('flutterwave')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                  fundProvider === 'flutterwave' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                <span className="text-base">💳</span> Card / MoMo
              </button>
              <button onClick={() => setFundProvider('espees')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                  fundProvider === 'espees' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                <span className="text-base">🪙</span> Pay with Espees
              </button>
            </div>

            {/* Currency Selector (only for Flutterwave) */}
            {fundProvider === 'flutterwave' && (
            <div className="flex gap-2 mb-4">
              {[
                { code: 'GHS', flag: '🇬🇭' },
                { code: 'NGN', flag: '🇳🇬' },
                { code: 'USD', flag: '🇺🇸' },
                { code: 'KES', flag: '🇰🇪' },
              ].map(c => (
                <button key={c.code} onClick={() => { setFundCurrency(c.code); setFundAmount(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    fundCurrency === c.code ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
            )} {/* end flutterwave currency selector */}

            {/* Quick Amounts */}
            <div className="flex gap-2 mb-4">
              {fundProvider === 'espees' ? (
                [5, 10, 25, 50, 100].map(amt => (
                  <button key={amt} onClick={() => setFundAmount(String(amt))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      fundAmount === String(amt) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    ${amt}
                  </button>
                ))
              ) : (
                (fundCurrency === 'GHS' ? [20, 50, 100, 200, 500] :
                  fundCurrency === 'NGN' ? [2000, 5000, 10000, 25000, 50000] :
                  fundCurrency === 'KES' ? [500, 1000, 2500, 5000, 10000] :
                  [5, 10, 25, 50, 100]
                ).map(amt => (
                  <button key={amt} onClick={() => setFundAmount(String(amt))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      fundAmount === String(amt) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    {fundCurrency === 'USD' ? '$' : ''}{amt.toLocaleString()}
                  </button>
                ))
              )}
            </div>

            <input type="number" min="1" step="0.01" placeholder={fundProvider === 'espees' ? 'Enter USD amount...' : `Enter ${fundCurrency} amount...`}
              value={fundAmount} onChange={e => setFundAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-2 outline-none focus:ring-2 focus:ring-green-500" />
            {fundProvider !== 'espees' && fundAmount && fundCurrency !== 'USD' && (
              <p className="text-xs text-gray-500 mb-2 text-center">
                ≈ ${(parseFloat(fundAmount) / (fundCurrency === 'GHS' ? 16 : fundCurrency === 'NGN' ? 1600 : fundCurrency === 'KES' ? 155 : 1)).toFixed(2)} USD
              </p>
            )}
            {fundProvider === 'espees' && <p className="text-xs text-blue-600 mb-3 text-center font-medium">🪙 Pay with Espees digital currency</p>}
            {fundProvider !== 'espees' && fundCurrency === 'GHS' && <p className="text-xs text-green-600 mb-3 text-center font-medium">📱 MoMo • 💳 Card • 🏦 Bank Transfer</p>}
            {fundProvider !== 'espees' && fundCurrency === 'NGN' && <p className="text-xs text-green-600 mb-3 text-center font-medium">💳 Card • 🏦 Bank Transfer • USSD</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowFund(false)} className="flex-1 py-3 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleFund} disabled={processing || !fundAmount}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors">
                {processing ? 'Processing...' : fundProvider === 'espees' 
                  ? `Pay $${fundAmount || '0'} with Espees` 
                  : `Pay ${fundCurrency === 'USD' ? '$' : ''}${fundAmount || '0'} ${fundCurrency}`}
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

      {/* ─── Transfer Credits Modal ─── */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTransfer(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-2">
              <Send size={20} className="text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Send Credits</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Transfer credits to another CYBEV user. Min 10 credits.</p>

            {/* Recipient */}
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Recipient username or email</label>
            <input type="text" placeholder="@username or email..."
              value={transferTo} onChange={e => setTransferTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-purple-500" />

            {/* Quick Amounts */}
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Amount</label>
            <div className="flex gap-2 mb-3">
              {[50, 100, 500, 1000].map(amt => (
                <button key={amt} onClick={() => setTransferAmount(String(amt))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    transferAmount === String(amt) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
            <input type="number" min="10" step="1" placeholder="Enter amount..."
              value={transferAmount} onChange={e => setTransferAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-1 outline-none focus:ring-2 focus:ring-purple-500" />
            <p className="text-xs text-gray-400 mb-3">Your balance: {credits.toLocaleString()} credits</p>

            {/* Note */}
            <input type="text" placeholder="Add a note (optional)" maxLength={100}
              value={transferNote} onChange={e => setTransferNote(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-purple-500 text-sm" />

            <div className="flex gap-3">
              <button onClick={() => setShowTransfer(false)} className="flex-1 py-3 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleTransfer} disabled={processing || !transferTo || !transferAmount || parseInt(transferAmount) > credits}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {processing ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send {transferAmount ? parseInt(transferAmount).toLocaleString() : ''} Credits</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
