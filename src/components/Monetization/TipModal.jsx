// ============================================
// FILE: src/components/Monetization/TipModal.jsx
// Tip & Donate Modal Component
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Gift,
  Loader2,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Preset amounts
const PRESET_AMOUNTS = {
  NGN: [500, 1000, 2000, 5000, 10000],
  USD: [5, 10, 20, 50, 100],
  GHS: [20, 50, 100, 200, 500],
  GBP: [5, 10, 20, 50, 100],
  EUR: [5, 10, 20, 50, 100]
};

// Currency symbols
const CURRENCY_SYMBOLS = {
  NGN: '₦',
  USD: '$',
  GHS: '₵',
  GBP: '£',
  EUR: '€'
};

// Provider icons/names
const PROVIDERS = {
  flutterwave: { name: 'Flutterwave', icon: '🦋', currencies: ['NGN', 'USD', 'GHS', 'GBP', 'EUR'] },
  paystack: { name: 'Paystack', icon: '💳', currencies: ['NGN', 'GHS', 'USD'] },
  stripe: { name: 'Stripe', icon: '💎', currencies: ['USD', 'EUR', 'GBP'] },
  hubtel: { name: 'Hubtel', icon: '📱', currencies: ['GHS'] }
};

export default function TipModal({ 
  isOpen, 
  onClose, 
  recipient, 
  type = 'tip' // 'tip' or 'donation'
}) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [provider, setProvider] = useState('');
  const [availableProviders, setAvailableProviders] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('amount'); // 'amount', 'provider', 'processing'

  // Fetch available providers
  useEffect(() => {
    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen]);

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payments/providers`);
      setAvailableProviders(response.data.providers);
      setProvider(response.data.default || '');
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  // Filter providers by currency
  const getProvidersForCurrency = () => {
    return Object.entries(PROVIDERS)
      .filter(([key, val]) => availableProviders[key] && val.currencies.includes(currency))
      .map(([key, val]) => ({ id: key, ...val }));
  };

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!provider) {
      toast.error('Please select a payment method');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'tip' ? '/api/payments/tip' : '/api/payments/donate';

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        {
          recipientId: recipient._id || recipient.id,
          amount: parseFloat(amount),
          currency,
          message,
          anonymous,
          provider
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok && response.data.payment?.url) {
        // Redirect to payment page
        window.location.href = response.data.payment.url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Failed to process payment');
      setStep('amount');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setAmount('');
    setMessage('');
    setAnonymous(false);
    setStep('amount');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const presets = PRESET_AMOUNTS[currency] || PRESET_AMOUNTS.USD;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const providersForCurrency = getProvidersForCurrency();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4">
              {recipient?.avatar ? (
                <img 
                  src={recipient.avatar} 
                  alt={recipient.name}
                  className="w-16 h-16 rounded-full border-2 border-white/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl font-bold">{recipient?.name?.[0]}</span>
                </div>
              )}
              <div>
                <p className="text-white/80 text-sm">
                  {type === 'tip' ? 'Send a tip to' : 'Donate to'}
                </p>
                <h3 className="text-xl font-bold">{recipient?.name}</h3>
                <p className="text-white/70 text-sm">@{recipient?.username}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'amount' && (
              <div className="space-y-6">
                {/* Currency Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(CURRENCY_SYMBOLS).map((cur) => (
                      <button
                        key={cur}
                        onClick={() => setCurrency(cur)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currency === cur
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {CURRENCY_SYMBOLS[cur]} {cur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                      {symbol}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Preset Amounts */}
                <div className="flex gap-2 flex-wrap">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAmountSelect(preset)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        amount === preset.toString()
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-2 border-purple-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {symbol}{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Say something nice to ${recipient?.name}...`}
                    rows={2}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Anonymous Toggle (for donations) */}
                {type === 'donation' && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Make this donation anonymous
                    </span>
                  </label>
                )}

                {/* Continue Button */}
                <button
                  onClick={() => setStep('provider')}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 'provider' && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {symbol}{parseFloat(amount).toLocaleString()}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {type === 'tip' ? 'Tip' : 'Donation'} to @{recipient?.username}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Payment Method
                  </label>
                  <div className="space-y-2">
                    {providersForCurrency.length > 0 ? (
                      providersForCurrency.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setProvider(p.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                            provider === p.id
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <span className="text-2xl">{p.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Cards, Mobile Money, Bank Transfer
                            </p>
                          </div>
                          {provider === p.id && (
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No payment providers available for {currency}</p>
                        <button
                          onClick={() => {
                            setCurrency('NGN');
                            setStep('amount');
                          }}
                          className="mt-3 text-purple-600 hover:underline"
                        >
                          Try a different currency
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('amount')}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!provider || loading}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Pay {symbol}{parseFloat(amount).toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Redirecting to payment...
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Please wait while we set up your payment
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
