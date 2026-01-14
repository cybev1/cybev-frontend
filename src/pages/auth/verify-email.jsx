import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authAPI } from '@/lib/api';
import {
  Mail,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Inbox
} from 'lucide-react';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  // ✅ AUTO-VERIFY when token is present in URL
  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    setVerifying(true);
    setError('');

    try {
      const response = await authAPI.verifyEmail(token);

      if (response.data.success) {
        setVerified(true);
        toast.success('✅ Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err) {
      console.error('❌ Verification error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.';
      setError(errorMsg);
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    const email = prompt('Enter your email address:');
    if (!email) return;

    setResending(true);

    try {
      const response = await authAPI.resendVerification(email);

      if (response.data.success) {
        toast.success('✅ Verification email sent! Check your inbox and spam folder.');
      }
    } catch (err) {
      console.error('❌ Resend error:', err);
      toast.error(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setResending(false);
    }
  };

  // NO TOKEN - Show instructions with spam notice
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Verification Token</h1>
          <p className="text-gray-600 mb-4">Please check your email for the verification link.</p>
          
          {/* Enhanced Spam Notice */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Inbox className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-900 mb-2">📬 Can't find the email?</p>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• <strong>Check your SPAM/Junk folder</strong></li>
                  <li>• Search for emails from <strong>info@cybev.io</strong></li>
                  <li>• Wait 2-3 minutes for delivery</li>
                </ul>
                <p className="mt-2 text-xs text-amber-700 bg-amber-100 rounded p-1.5 text-center">
                  💡 If found in spam, mark as "Not Spam"
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleResend}
            disabled={resending}
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: verified ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Email Verification
          </h1>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-100 p-8"
        >
          {verifying ? (
            // VERIFYING STATE
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Verifying...</h3>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          ) : verified ? (
            // SUCCESS STATE
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email Verified! 🎉</h3>
              <p className="text-gray-600 mb-4">
                Your email has been successfully verified.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to login...
              </p>
              <button
                onClick={() => router.push('/auth/login')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                Go to Login
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : error ? (
            // ERROR STATE
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              
              {/* Spam notice on error */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-left text-sm">
                <p className="text-amber-800">
                  <strong>💡 Tip:</strong> Check your spam folder for a new verification email, or request one below.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={verifyEmail}
                  className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Help Text */}
        <p className="text-center mt-6 text-gray-600">
          Need help?{' '}
          <a 
            href="mailto:support@cybev.io" 
            className="font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
