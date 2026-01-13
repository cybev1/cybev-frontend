// ============================================
// FILE: src/pages/auth/signup.jsx
// CYBEV Signup Page - Clean White Design v8.0
// Added: Country/City with auto-detection
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, Loader2, Sparkles, Check, MapPin, Globe, Building2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Common countries list
const COUNTRIES = [
  'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'United States', 'United Kingdom', 
  'Canada', 'India', 'Australia', 'Germany', 'France', 'Brazil', 'Mexico',
  'Egypt', 'Tanzania', 'Ethiopia', 'Uganda', 'Cameroon', 'Zimbabwe', 'Zambia',
  'Rwanda', 'Senegal', 'Ivory Coast', 'Angola', 'Mozambique', 'Other'
].sort();

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    country: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

  // Auto-detect location on mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    setDetectingLocation(true);
    try {
      // Use ip-api.com for location detection (free, no API key)
      const response = await fetch('http://ip-api.com/json/?fields=status,country,city,regionName');
      const data = await response.json();
      
      if (data.status === 'success') {
        const detected = {
          country: data.country,
          city: data.city,
          region: data.regionName
        };
        setDetectedLocation(detected);
        
        // Auto-fill if fields are empty
        if (!formData.country && !formData.city) {
          setFormData(prev => ({
            ...prev,
            country: detected.country,
            city: detected.city
          }));
        }
      }
    } catch (error) {
      console.log('Location detection failed:', error);
      // Try backup geolocation API
      try {
        const backupResponse = await fetch('https://ipapi.co/json/');
        const backupData = await backupResponse.json();
        if (backupData.country_name) {
          const detected = {
            country: backupData.country_name,
            city: backupData.city,
            region: backupData.region
          };
          setDetectedLocation(detected);
          if (!formData.country && !formData.city) {
            setFormData(prev => ({
              ...prev,
              country: detected.country,
              city: detected.city
            }));
          }
        }
      } catch {
        // Silent fail - user can enter manually
      }
    } finally {
      setDetectingLocation(false);
    }
  };

  const passwordChecks = [
    { label: 'At least 8 characters', valid: formData.password.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(formData.password) },
    { label: 'Passwords match', valid: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        country: formData.country,
        city: formData.city
      });
      if (response.data.ok || response.data.success) {
        toast.success('Account created! Please check your email to verify.');
        router.push('/auth/verify-email-notice?email=' + encodeURIComponent(formData.email));
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const useDetectedLocation = () => {
    if (detectedLocation) {
      setFormData(prev => ({
        ...prev,
        country: detectedLocation.country,
        city: detectedLocation.city
      }));
    }
  };

  return (
    <>
      <Head><title>Sign Up | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account? <Link href="/auth/login" className="font-semibold text-purple-600 hover:text-purple-500">Sign in</Link>
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
            <button onClick={() => window.location.href = `${API_URL}/api/auth/google`}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-4">
              <GoogleIcon /> Continue with Google
            </button>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">or</span></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" placeholder="John Doe" required />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" placeholder="you@example.com" required />
                </div>
              </div>
              
              {/* Location Section */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" /> Your Location
                  </label>
                  {detectedLocation && (
                    <button type="button" onClick={useDetectedLocation} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Use detected
                    </button>
                  )}
                </div>
                
                {/* Detected location hint */}
                {detectingLocation ? (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Detecting your location...
                  </p>
                ) : detectedLocation ? (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Detected: {detectedLocation.city}, {detectedLocation.country}
                  </p>
                ) : null}
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Country */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-sm bg-white appearance-none">
                        <option value="">Select country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  {/* City */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-sm" placeholder="Your city" />
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400">
                  This helps us personalize your experience. You can update this anytime.
                </p>
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" placeholder="••••••••" required />
                </div>
              </div>
              
              {/* Password Checks */}
              <div className="space-y-2">
                {passwordChecks.map((check, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm ${check.valid ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className={`w-4 h-4 ${check.valid ? 'text-green-600' : 'text-gray-300'}`} />
                    {check.label}
                  </div>
                ))}
              </div>
              
              {error && <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
              
              <button type="submit" disabled={loading || !passwordChecks.every(c => c.valid)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create account <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our <Link href="/terms" className="text-purple-600 hover:underline">Terms</Link> and <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
}
