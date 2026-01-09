// ============================================
// FILE: src/pages/payment/domain-callback.jsx
// Domain Payment Callback - v6.4
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Globe, AlertTriangle, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function DomainCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [domain, setDomain] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.query.reference) verifyPayment(router.query.reference);
  }, [router.query.reference]);

  const verifyPayment = async (reference) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }

      const res = await axios.get(`${API_URL}/api/domain-payments/verify/${reference}`, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.ok && res.data.status === 'success') {
        setStatus('success');
        setDomain(res.data.domain);
      } else {
        setStatus('failed');
        setError(res.data.message || 'Payment verification failed');
      }
    } catch (err) {
      setStatus('failed');
      setError(err.response?.data?.error || 'Payment verification failed');
    }
  };

  return (
    <>
      <Head><title>Payment {status === 'verifying' ? 'Processing' : status === 'success' ? 'Successful' : 'Failed'} | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center"><Loader2 className="w-10 h-10 text-purple-600 animate-spin" /></div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying Payment</h1>
              <p className="text-gray-500">Please wait...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"><CheckCircle className="w-12 h-12 text-green-600" /></div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Domain Registered! 🎉</h1>
              <p className="text-gray-500 mb-6">Your domain is now active and configured.</p>
              {domain && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3"><Globe className="w-5 h-5 text-purple-600" /><span className="font-bold text-lg text-gray-900 dark:text-white">{domain.domain}</span></div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Status</span><p className="font-medium text-green-600">Active</p></div>
                    <div><span className="text-gray-500">Expires</span><p className="font-medium text-gray-900 dark:text-white">{domain.expiresAt ? new Date(domain.expiresAt).toLocaleDateString() : 'N/A'}</p></div>
                  </div>
                  {domain.dnsConfigured && <div className="mt-3 pt-3 border-t dark:border-gray-600"><span className="text-sm text-green-600 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" />DNS configured</span></div>}
                </div>
              )}
              <div className="space-y-3">
                <button onClick={() => router.push('/settings/domains')} className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">Manage Domain<ArrowRight className="w-4 h-4" /></button>
                <button onClick={() => router.push('/studio/sites/new')} className="w-full py-3 border dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium">Create Website</button>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"><XCircle className="w-12 h-12 text-red-600" /></div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h1>
              <p className="text-gray-500 mb-6">{error || 'Could not verify payment. Please try again.'}</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start gap-2"><AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" /><div className="text-sm text-yellow-700 dark:text-yellow-400"><p className="font-medium mb-1">If you were charged:</p><p>Contact support with your payment reference.</p></div></div>
              </div>
              <div className="space-y-3">
                <button onClick={() => router.push('/settings/domains')} className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium">Try Again</button>
                <button onClick={() => router.push('/feed')} className="w-full py-3 border dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium">Back to Feed</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
