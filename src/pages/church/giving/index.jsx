// ============================================
// FILE: pages/church/giving/index.jsx
// Giving & Donations - Tithe, Offering, Payment
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Heart, DollarSign, CreditCard, Building2, Gift,
  ArrowLeft, Loader2, TrendingUp, Calendar, Clock,
  CheckCircle, Star, Repeat, Plus, History, Download,
  ChevronRight, Wallet, Banknote, Smartphone, Globe
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const givingTypes = [
  { id: 'tithe', label: 'Tithe', icon: '⛪', description: '10% of your income', color: 'from-purple-500 to-indigo-600' },
  { id: 'offering', label: 'Offering', icon: '🎁', description: 'General offering', color: 'from-green-500 to-emerald-600' },
  { id: 'thanksgiving', label: 'Thanksgiving', icon: '🙏', description: 'Gratitude offering', color: 'from-yellow-500 to-orange-500' },
  { id: 'missions', label: 'Missions', icon: '🌍', description: 'Support missions', color: 'from-blue-500 to-cyan-600' },
  { id: 'building', label: 'Building Fund', icon: '🏗️', description: 'Church building', color: 'from-orange-500 to-red-500' },
  { id: 'special', label: 'Special Seed', icon: '🌱', description: 'Special projects', color: 'from-pink-500 to-rose-600' }
];

const paymentMethods = [
  { id: 'card', label: 'Debit/Credit Card', icon: CreditCard, description: 'Visa, Mastercard' },
  { id: 'mobile', label: 'Mobile Money', icon: Smartphone, description: 'MTN, Vodafone, AirtelTigo' },
  { id: 'bank', label: 'Bank Transfer', icon: Building2, description: 'Direct transfer' },
  { id: 'ussd', label: 'USSD', icon: Banknote, description: '*170# / *110#' }
];

const quickAmounts = [50, 100, 200, 500, 1000, 2000];

function GivingTypeCard({ type, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(type.id)}
      className={`p-4 rounded-2xl border-2 text-left transition group ${
        selected
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{type.icon}</span>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{type.label}</p>
          <p className="text-sm text-gray-500">{type.description}</p>
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-purple-500 ml-auto" />}
      </div>
    </button>
  );
}

function TransactionCard({ transaction }) {
  const type = givingTypes.find(t => t.id === transaction.type) || givingTypes[1];
  
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white text-xl`}>
        {type.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">{type.label}</p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 dark:text-white">
          {transaction.currency} {transaction.amount.toLocaleString()}
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          transaction.status === 'completed' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : transaction.status === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
        }`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );
}

export default function GivingPage() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Type, 2: Amount, 3: Payment, 4: Confirm
  const [myOrgs, setMyOrgs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalGiven: 0, thisMonth: 0, streak: 0 });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    type: 'tithe',
    amount: '',
    currency: 'GHS',
    organizationId: '',
    paymentMethod: 'mobile',
    isRecurring: false,
    frequency: 'monthly',
    note: '',
    isAnonymous: false
  });

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch orgs
      const orgsRes = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const orgsData = await orgsRes.json();
      if (orgsData.ok && orgsData.orgs?.length > 0) {
        const churches = orgsData.orgs.filter(o => o.type === 'church' || o.type === 'zone');
        setMyOrgs(churches);
        if (churches.length > 0) {
          setForm(f => ({ ...f, organizationId: churches[0]._id }));
        }
      }

      // Fetch giving history
      const historyRes = await fetch(`${API_URL}/api/church/giving/history`, getAuth());
      const historyData = await historyRes.json();
      if (historyData.ok) {
        setTransactions(historyData.transactions || []);
        setStats({
          totalGiven: historyData.totalGiven || 0,
          thisMonth: historyData.thisMonth || 0,
          streak: historyData.streak || 0
        });
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/church/giving`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          type: form.type,
          amount: parseFloat(form.amount),
          currency: form.currency,
          organization: form.organizationId,
          paymentMethod: form.paymentMethod,
          isRecurring: form.isRecurring,
          frequency: form.frequency,
          note: form.note,
          isAnonymous: form.isAnonymous
        })
      });

      const data = await res.json();
      
      if (data.ok) {
        // Handle payment redirect if needed
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          setSuccess(true);
          fetchData();
        }
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment processing failed');
    }
    setProcessing(false);
  };

  const selectedType = givingTypes.find(t => t.id === form.type) || givingTypes[0];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You for Giving!
          </h2>
          <p className="text-gray-500 mb-6">
            Your {selectedType.label.toLowerCase()} of {form.currency} {parseFloat(form.amount).toLocaleString()} has been received.
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6">
            <p className="text-purple-700 dark:text-purple-300 italic">
              "Give, and it will be given to you. A good measure, pressed down, shaken together and running over."
            </p>
            <p className="text-sm text-purple-500 mt-1">— Luke 6:38</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setSuccess(false); setStep(1); setForm(f => ({ ...f, amount: '' })); }}
              className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600"
            >
              Give Again
            </button>
            <Link href="/church" className="flex-1">
              <button className="w-full py-3 rounded-xl font-semibold bg-purple-600 text-white">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Giving - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Heart className="w-8 h-8" />
                Online Giving
              </h1>
              <p className="text-green-100 mt-1">Give your tithes and offerings securely</p>
            </div>

            <Link href="/church/giving/history">
              <button className="px-4 py-2 bg-white/20 rounded-xl font-medium hover:bg-white/30 flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-2xl font-bold">GHS {stats.totalGiven.toLocaleString()}</p>
              <p className="text-green-200 text-sm">Total Given</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-2xl font-bold">GHS {stats.thisMonth.toLocaleString()}</p>
              <p className="text-green-200 text-sm">This Month</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-green-200 text-sm">Month Streak 🔥</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Type */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  1. Select Giving Type
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {givingTypes.map(type => (
                    <GivingTypeCard
                      key={type.id}
                      type={type}
                      selected={form.type === type.id}
                      onSelect={(id) => setForm(f => ({ ...f, type: id }))}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Amount */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  2. Enter Amount
                </h2>

                {/* Selected Type Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedType.color} text-white mb-6`}>
                  <span>{selectedType.icon}</span>
                  <span className="font-medium">{selectedType.label}</span>
                </div>

                {/* Organization */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Church / Organization
                  </label>
                  <select
                    value={form.organizationId}
                    onChange={(e) => setForm(f => ({ ...f, organizationId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    {myOrgs.map(org => (
                      <option key={org._id} value={org._id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <select
                      value={form.currency}
                      onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent font-semibold text-gray-700 dark:text-gray-300"
                    >
                      <option value="GHS">GHS</option>
                      <option value="USD">USD</option>
                      <option value="NGN">NGN</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                      className="w-full pl-20 pr-4 py-4 text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-6 gap-2 mb-6">
                  {quickAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setForm(f => ({ ...f, amount: amt.toString() }))}
                      className={`py-2 rounded-lg font-medium transition ${
                        form.amount === amt.toString()
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                {/* Recurring */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isRecurring}
                      onChange={(e) => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600"
                    />
                    <Repeat className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Make this recurring</p>
                      <p className="text-sm text-gray-500">Automatically give each month</p>
                    </div>
                  </label>
                  {form.isRecurring && (
                    <select
                      value={form.frequency}
                      onChange={(e) => setForm(f => ({ ...f, frequency: e.target.value }))}
                      className="mt-3 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  )}
                </div>

                {/* Note */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                    placeholder="Add a note..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.amount || parseFloat(form.amount) <= 0}
                    className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  3. Payment Method
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setForm(f => ({ ...f, paymentMethod: method.id }))}
                        className={`p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                          form.paymentMethod === method.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          form.paymentMethod === method.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{method.label}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        {form.paymentMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-purple-500 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Anonymous Option */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={form.isAnonymous}
                    onChange={(e) => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Give Anonymously</p>
                    <p className="text-sm text-gray-500">Your name won't be displayed</p>
                  </div>
                </label>

                {/* Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium">{selectedType.icon} {selectedType.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium">{form.currency} {parseFloat(form.amount || 0).toLocaleString()}</span>
                    </div>
                    {form.isRecurring && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Frequency</span>
                        <span className="font-medium capitalize">{form.frequency}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-purple-700">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-purple-600 text-lg">
                        {form.currency} {parseFloat(form.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Give {form.currency} {parseFloat(form.amount || 0).toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scripture */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
              <Star className="w-8 h-8 mb-3 opacity-80" />
              <p className="italic mb-2">
                "Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this," says the LORD Almighty, "and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it."
              </p>
              <p className="text-purple-200 text-sm">— Malachi 3:10</p>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                Recent Giving
                <Link href="/church/giving/history">
                  <span className="text-sm text-purple-600 font-normal">View All</span>
                </Link>
              </h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No giving history yet</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx, i) => (
                    <TransactionCard key={i} transaction={tx} />
                  ))}
                </div>
              )}
            </div>

            {/* Secure Badge */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Secure Giving</p>
                <p className="text-xs text-gray-500">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
