// ============================================
// FILE: src/components/Live/StreamDonation.jsx
// Stream Donation / Super Chat Component
// VERSION: 1.0
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Heart,
  Sparkles,
  X,
  Loader2,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Donation tiers with colors
const DONATION_TIERS = {
  NGN: [
    { amount: 500, color: '#6b7280', label: 'Basic' },
    { amount: 1000, color: '#3b82f6', label: 'Blue' },
    { amount: 2000, color: '#10b981', label: 'Green' },
    { amount: 5000, color: '#f59e0b', label: 'Gold' },
    { amount: 10000, color: '#ef4444', label: 'Super' }
  ],
  USD: [
    { amount: 2, color: '#6b7280', label: 'Basic' },
    { amount: 5, color: '#3b82f6', label: 'Blue' },
    { amount: 10, color: '#10b981', label: 'Green' },
    { amount: 20, color: '#f59e0b', label: 'Gold' },
    { amount: 50, color: '#ef4444', label: 'Super' }
  ],
  GHS: [
    { amount: 20, color: '#6b7280', label: 'Basic' },
    { amount: 50, color: '#3b82f6', label: 'Blue' },
    { amount: 100, color: '#10b981', label: 'Green' },
    { amount: 200, color: '#f59e0b', label: 'Gold' },
    { amount: 500, color: '#ef4444', label: 'Super' }
  ]
};

const CURRENCY_SYMBOLS = {
  NGN: '₦',
  USD: '$',
  GHS: '₵'
};

// Donation Button (triggers modal)
export function DonationButton({ streamId, hostName, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
    >
      <Gift className="w-4 h-4" />
      Send Super Chat
    </button>
  );
}

// Donation Modal
export function DonationModal({ isOpen, onClose, streamId, host }) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const tiers = DONATION_TIERS[currency] || DONATION_TIERS.USD;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  const getTierColor = (amt) => {
    const tier = [...tiers].reverse().find(t => amt >= t.amount);
    return tier?.color || '#6b7280';
  };

  const handleDonate = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/stream-schedule/donate`,
        {
          streamId,
          amount: numAmount,
          currency,
          message,
          isAnonymous
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok && response.data.payment?.url) {
        window.location.href = response.data.payment.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to process donation');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div 
            className="p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${getTierColor(parseFloat(amount) || 0)}, ${getTierColor((parseFloat(amount) || 0) * 1.5)})` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                <span className="font-bold text-lg">Super Chat</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/90">
              Support {host?.name || 'the streamer'} with a highlighted message!
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Currency */}
            <div className="flex gap-2">
              {Object.keys(CURRENCY_SYMBOLS).map((cur) => (
                <button
                  key={cur}
                  onClick={() => {
                    setCurrency(cur);
                    setAmount('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currency === cur
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {CURRENCY_SYMBOLS[cur]} {cur}
                </button>
              ))}
            </div>

            {/* Quick Amounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Select
              </label>
              <div className="flex flex-wrap gap-2">
                {tiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => setAmount(tier.amount.toString())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      amount === tier.amount.toString()
                        ? 'ring-2 ring-offset-2'
                        : 'hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: tier.color + '20',
                      color: tier.color,
                      borderColor: tier.color,
                      ...(amount === tier.amount.toString() && { ringColor: tier.color })
                    }}
                  >
                    {symbol}{tier.amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline" /> Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  {symbol}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-3 text-xl font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MessageCircle className="w-4 h-4 inline" /> Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message will be highlighted on stream..."
                rows={2}
                maxLength={200}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{message.length}/200</p>
            </div>

            {/* Anonymous */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-purple-600"
              />
              <span className="text-gray-700 dark:text-gray-300">Send anonymously</span>
            </label>

            {/* Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div 
                className="p-4 rounded-xl text-white"
                style={{ backgroundColor: getTierColor(parseFloat(amount)) }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">
                    {isAnonymous ? 'Anonymous' : 'You'}
                  </span>
                  <span className="text-white/80">
                    {symbol}{parseFloat(amount).toLocaleString()}
                  </span>
                </div>
                {message && <p className="text-white/90">{message}</p>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={handleDonate}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Send {symbol}{parseFloat(amount || 0).toLocaleString()}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Super Chat Display (shows in chat)
export function SuperChatMessage({ donation }) {
  const amount = donation.amount || 0;
  const currency = donation.currency || 'NGN';
  const tiers = DONATION_TIERS[currency] || DONATION_TIERS.NGN;
  const symbol = CURRENCY_SYMBOLS[currency] || '₦';
  
  const tier = [...tiers].reverse().find(t => amount >= t.amount);
  const color = tier?.color || '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="rounded-xl overflow-hidden mb-3"
      style={{ backgroundColor: color }}
    >
      <div className="p-3 text-white">
        <div className="flex items-center gap-2 mb-1">
          <img
            src={donation.donor?.avatar || '/default-avatar.png'}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <span className="font-bold">
            {donation.isAnonymous ? 'Anonymous' : donation.displayName || donation.donor?.name}
          </span>
          <span className="ml-auto font-bold">
            {symbol}{amount.toLocaleString()}
          </span>
        </div>
        {donation.message && (
          <p className="text-white/90 text-sm">{donation.message}</p>
        )}
      </div>
    </motion.div>
  );
}

// Donations List (for host dashboard)
export function DonationsList({ donations = [], totalAmount = 0, currency = 'NGN' }) {
  const symbol = CURRENCY_SYMBOLS[currency] || '₦';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-pink-500" />
          Stream Donations
        </h3>
        <span className="text-lg font-bold text-green-600">
          {symbol}{totalAmount.toLocaleString()}
        </span>
      </div>

      {donations.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {donations.map((donation, index) => (
            <div
              key={donation._id || index}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <img
                src={donation.donor?.avatar || '/default-avatar.png'}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {donation.isAnonymous ? 'Anonymous' : donation.donor?.name}
                </p>
                {donation.message && (
                  <p className="text-sm text-gray-500 truncate">{donation.message}</p>
                )}
              </div>
              <span className="font-bold text-green-600">
                {CURRENCY_SYMBOLS[donation.currency] || '₦'}{donation.amount?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No donations yet</p>
      )}
    </div>
  );
}

export default { DonationButton, DonationModal, SuperChatMessage, DonationsList };
