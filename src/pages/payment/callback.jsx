// ============================================
// FILE: src/pages/payment/callback.jsx
// Payment Callback/Verification Page
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Home,
  RefreshCw,
  Receipt
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function PaymentCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.isReady) {
      verifyPayment();
    }
  }, [router.isReady]);

  const verifyPayment = async () => {
    try {
      const { 
        provider, 
        reference, 
        transaction_id, 
        tx_ref, 
        trxref,
        session_id,
        checkoutId
      } = router.query;

      // Determine reference based on provider
      let paymentRef = reference || transaction_id || tx_ref || trxref || session_id || checkoutId;
      let paymentProvider = provider;

      // Auto-detect provider from query params
      if (!paymentProvider) {
        if (tx_ref) paymentProvider = 'flutterwave';
        else if (trxref) paymentProvider = 'paystack';
        else if (session_id) paymentProvider = 'stripe';
        else if (checkoutId) paymentProvider = 'hubtel';
      }

      if (!paymentRef || !paymentProvider) {
        setStatus('failed');
        setError('Missing payment information');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/payments/verify/${paymentProvider}/${paymentRef}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        setStatus('success');
        setTransaction(response.data.transaction);
      } else {
        setStatus('failed');
        setError(response.data.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
      setError(error.response?.data?.error || 'Failed to verify payment');
    }
  };

  return (
    <>
      <Head>
        <title>Payment {status === 'success' ? 'Successful' : status === 'failed' ? 'Failed' : 'Processing'} | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Status Icon */}
          <div className={`p-8 text-center ${
            status === 'success' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
            status === 'failed' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
            'bg-gradient-to-br from-purple-500 to-pink-600'
          }`}>
            {status === 'verifying' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Loader2 className="w-20 h-20 text-white mx-auto" />
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-white mx-auto" />
              </motion.div>
            )}
            {status === 'failed' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <XCircle className="w-20 h-20 text-white mx-auto" />
              </motion.div>
            )}
            
            <h1 className="text-2xl font-bold text-white mt-4">
              {status === 'verifying' && 'Verifying Payment...'}
              {status === 'success' && 'Payment Successful!'}
              {status === 'failed' && 'Payment Failed'}
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            {status === 'verifying' && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Please wait while we verify your payment...
              </p>
            )}

            {status === 'success' && transaction && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Amount</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {transaction.currency} {transaction.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {transaction.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Reference</span>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {transaction.reference?.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
                      Completed
                    </span>
                  </div>
                </div>

                <p className="text-center text-gray-600 dark:text-gray-400">
                  Thank you for your support! 🎉
                </p>
              </div>
            )}

            {status === 'failed' && (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error || 'Something went wrong with your payment.'}
                </p>
                <button
                  onClick={verifyPayment}
                  className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Link
                href="/feed"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              {status === 'success' && (
                <Link
                  href="/wallet"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Receipt className="w-5 h-5" />
                  View Wallet
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
