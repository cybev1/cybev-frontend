import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Mail,
  Lock,
  User,
  UserCircle,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Zap,
  Heart,
  Globe,
  Shield,
  CheckCircle
} from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldFocus, setFieldFocus] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io/api';

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    console.log('📤 Sending registration to:', `${API_URL}/api/auth/register`);

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Registration successful:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/onboarding');
      }
      
    } catch (err) {
      console.error('❌ Registration error:', err.response?.data);
      
      // Handle specific errors
      if (err.response?.data?.error === 'Email already exists') {
        setError('This email is already registered. Try signing in instead, or use a different email.');
      } else if (err.response?.data?.error?.includes('username')) {
        setError('This username is taken. Please try a different one.');
      } else if (err.response?.data?.message === 'User already exists') {
        setError('An account with this email or username already exists. Try signing in instead.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
      />

      <div className="max-w-md w-full relative z-10">
        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.push('/auth/choice')} 
          className="mb-6 text-gray-600 hover:text-blue-600 transition flex items-center gap-2 font-semibold"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-blue-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="relative inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black mb-2"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Create Your Account
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600"
            >
              Join the creator revolution 🚀
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1">Oops!</strong>
                {error}
                {error.includes('email is already registered') && (
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="block mt-2 text-blue-600 font-semibold hover:underline"
                  >
                    → Sign in instead
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  onFocus={() => setFieldFocus('name')}
                  onBlur={() => setFieldFocus('')}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                    fieldFocus === 'name'
                      ? 'border-blue-500 shadow-lg shadow-blue-100'
                      : 'border-gray-200'
                  } focus:outline-none`}
                  placeholder="John Doe"
                  required
                />
              </div>
            </motion.div>

            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({
                    ...formData, 
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                  })}
                  onFocus={() => setFieldFocus('username')}
                  onBlur={() => setFieldFocus('')}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                    fieldFocus === 'username'
                      ? 'border-blue-500 shadow-lg shadow-blue-100'
                      : 'border-gray-200'
                  } focus:outline-none`}
                  placeholder="johndoe"
                  required
                  minLength={3}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Lowercase letters, numbers, and underscores only</p>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  onFocus={() => setFieldFocus('email')}
                  onBlur={() => setFieldFocus('')}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                    fieldFocus === 'email'
                      ? 'border-blue-500 shadow-lg shadow-blue-100'
                      : 'border-gray-200'
                  } focus:outline-none`}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                💡 Gmail tip: Use youremail+anything@gmail.com for multiple accounts
              </p>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  onFocus={() => setFieldFocus('password')}
                  onBlur={() => setFieldFocus('')}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                    fieldFocus === 'password'
                      ? 'border-blue-500 shadow-lg shadow-blue-100'
                      : 'border-gray-200'
                  } focus:outline-none`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Minimum 6 characters</p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm font-semibold text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { icon: '🔵', name: 'Google', color: 'hover:border-blue-400 hover:bg-blue-50' },
              { icon: '💰', name: 'Wallet', color: 'hover:border-purple-400 hover:bg-purple-50' },
              { icon: '🐦', name: 'Twitter', color: 'hover:border-cyan-400 hover:bg-cyan-50' }
            ].map((social, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert(`${social.name} auth coming soon!`)}
                className={`p-4 rounded-xl bg-white border-2 border-gray-200 ${social.color} shadow-md hover:shadow-lg transition-all`}
              >
                <span className="text-3xl">{social.icon}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 pt-6 border-t-2 border-gray-100"
          >
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-semibold">Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Web3 Ready</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="font-semibold">AI Powered</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Sign In Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-gray-600 mt-6"
        >
          Already have an account?{' '}
          <button 
            onClick={() => router.push('/auth/login')} 
            className="text-blue-600 font-bold hover:underline"
          >
            Sign In
          </button>
        </motion.p>
      </div>
    </div>
  );
}
