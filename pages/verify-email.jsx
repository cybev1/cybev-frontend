
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (!token) return;

    axios.get(`https://api.cybev.io/api/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <>
      <Head>
        <title>Verify Email – CYBEV.IO</title>
        <meta name="description" content="Email verification status for your CYBEV.IO account." />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-black text-center px-4">
        <div className="bg-white dark:bg-gray-800 p-10 rounded shadow max-w-md w-full">
          {status === 'verifying' && <p className="text-blue-500">Verifying your email...</p>}
          {status === 'success' && <p className="text-green-600 font-semibold text-lg">✅ Email verified successfully! You can now log in.</p>}
          {status === 'error' && <p className="text-red-500 font-semibold text-lg">❌ Verification failed. The token may be invalid or expired.</p>}
        </div>
      </div>
    </>
  );
}
