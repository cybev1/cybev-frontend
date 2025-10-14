import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('📤 Sending login to:', `${API_URL}/auth/login`);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      console.log('✅ Login successful:', response.data);
      
      localStorage.setItem('token', response.data.token);
      
      const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });

      if (profileResponse.data.hasCompletedOnboarding) {
        router.push('/studio');
      } else {
        router.push('/onboarding');
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <button 
          onClick={() => router.push('/auth/choice')} 
          className="mb-6 text-gray-600 hover:text-blue-600 transition flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 text-sm">Sign in to continue creating</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                placeholder="••••••••"
                required
              />
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-lg shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In 🚀'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => alert('Google auth coming soon!')}
              className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition active:scale-95"
            >
              <span className="text-2xl">🔵</span>
            </button>
            <button 
              onClick={() => alert('Wallet connection coming soon!')}
              className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition active:scale-95"
            >
              <span className="text-2xl">👛</span>
            </button>
            <button 
              onClick={() => alert('Twitter auth coming soon!')}
              className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition active:scale-95"
            >
              <span className="text-2xl">🐦</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => router.push('/auth/signup')} 
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
