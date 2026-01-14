import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authAPI } from '@/lib/api';
import {
  Mail,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Inbox
} from 'lucide-react';

export default function VerifyEmailNotice() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [resending, setResending] = useState(false);
  const [resentCount, setResentCount] = useState(0);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // If already verified, redirect to onboarding or dashboard
        if (parsedUser.isEmailVerified) {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/auth/login');
      }
    } else {
      // No user data, redirect to login
      router.push('/auth/login');
    }
  }, [router]);

  const handleResend = async () => {
    if (!user?.email) {
      toast.error('Email address not found');
      return;
    }

    if (resentCount >= 3) {
      toast.error('Too many requests. Please try again later.');
      return;
    }

    setResending(true);

    try {
      const response = await authAPI.resendVerification(user.email);

      if (response.data.success) {
        toast.success('✅ Verification email sent! Check your inbox.');
        setResentCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('❌ Resend error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send verification email';
      toast.error(errorMsg);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Verify Your Email
          </h1>
          <p className="text-gray-600">One last step to unlock all features!</p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-100 p-8"
        >
          {/* Email Icon */}
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Check Your Inbox
            </h2>
            <p className="text-gray-600 mb-2">
              We sent a verification link to:
            </p>
            <p className="text-lg font-bold text-purple-600 mb-4 break-all">
              {user.email}
            </p>
            
            {/* Enhanced Spam Notice */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <Inbox className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left text-sm text-amber-900">
                  <p className="font-bold text-base mb-2">📬 Can't find the email?</p>
                  <ul className="list-none space-y-2 text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">1.</span>
                      <span><strong>Check your SPAM/Junk folder</strong> - emails often end up there</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">2.</span>
                      <span>Search for emails from <strong>info@cybev.io</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">3.</span>
                      <span>Wait 2-3 minutes - delivery can take time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">4.</span>
                      <span>Make sure <strong>{user.email}</strong> is correct</span>
                    </li>
                  </ul>
                  <p className="mt-3 text-amber-700 font-semibold bg-amber-100 rounded-lg p-2 text-center">
                    💡 If found in spam, mark it as "Not Spam" to receive future emails!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Resend Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResend}
              disabled={resending || resentCount >= 3}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Resend Verification Email
                </>
              )}
            </motion.button>

            {resentCount > 0 && (
              <p className="text-sm text-center text-gray-600">
                {resentCount >= 3 ? (
                  <span className="text-red-600 font-semibold">
                    ⚠️ Maximum resend attempts reached
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    ✅ Email sent! ({resentCount}/3)
                  </span>
                )}
              </p>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Why Verify */}
          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Why verify your email?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Access all CYBEV features</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Create and manage content</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Earn tokens and rewards</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Secure your account</span>
              </li>
            </ul>
          </div>
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
