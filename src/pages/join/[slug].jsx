/**
 * ============================================
 * FILE: [slug].jsx
 * PATH: cybev-frontend-main/src/pages/join/[slug].jsx
 * VERSION: 2.0.0 - Simplified Registration Form
 * UPDATED: 2026-01-24
 * FEATURES:
 *   - Simple single-page form (6 fields only)
 *   - Title, Name, Email, Phone, Country
 *   - Quick registration in under 30 seconds
 *   - Users can update profile later
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Heart, User, Phone, Mail, Loader2, CheckCircle, AlertCircle,
  Globe, Home, Layers, Grid3X3, BookOpen, Building, MapPin
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Simplified title options
const TITLES = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Pastor', label: 'Pastor' },
  { value: 'Rev', label: 'Rev' },
  { value: 'Apostle', label: 'Apostle' },
  { value: 'Prophet', label: 'Prophet' },
  { value: 'Evangelist', label: 'Evangelist' },
  { value: 'Bro', label: 'Bro' },
  { value: 'Sis', label: 'Sis' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Deacon', label: 'Deacon' },
  { value: 'Deaconess', label: 'Deaconess' },
  { value: 'Elder', label: 'Elder' },
  { value: 'custom', label: 'Other...' }
];

// Common countries
const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Uganda', 'Tanzania',
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
  'India', 'Australia', 'Netherlands', 'Italy', 'Spain', 'Brazil',
  'Cameroon', 'Zimbabwe', 'Zambia', 'Botswana', 'Malawi', 'Rwanda',
  'Ethiopia', 'Egypt', 'Morocco', 'UAE', 'Saudi Arabia', 'Qatar',
  'Singapore', 'Malaysia', 'Philippines', 'Japan', 'South Korea', 'China',
  'Mexico', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Other'
].sort();

const ORG_CONFIG = {
  zone: { icon: Globe, color: 'from-indigo-500 to-purple-600', label: 'Zone' },
  church: { icon: Home, color: 'from-purple-500 to-pink-600', label: 'Church' },
  fellowship: { icon: Layers, color: 'from-green-500 to-teal-600', label: 'Fellowship' },
  cell: { icon: Grid3X3, color: 'from-blue-500 to-cyan-600', label: 'Cell' },
  biblestudy: { icon: BookOpen, color: 'from-amber-500 to-orange-600', label: 'Bible Study' }
};

export default function JoinOrganizationPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [org, setOrg] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    title: 'Mr',
    customTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: ''
  });

  useEffect(() => {
    if (slug) fetchOrg();
  }, [slug]);

  const fetchOrg = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/church/register/${slug}`);
      const data = await res.json();
      
      if (!data.ok) {
        setError(data.error || 'Organization not found');
        return;
      }
      setOrg(data.organization);
    } catch (err) {
      setError('Failed to load registration page');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.firstName.trim()) {
      setError('Please enter your first name');
      return;
    }
    if (!form.phone.trim() && !form.email.trim()) {
      setError('Please enter your phone number or email');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/church/register/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          title: form.title === 'custom' ? form.customTitle : form.title,
          // Set defaults for optional fields
          isSaved: true,
          enrollInFoundationSchool: true,
          joinedHow: 'online'
        })
      });
      
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setResult(data);
      setSuccess(true);

      // Store auth token if new user
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const config = org ? ORG_CONFIG[org.type] || ORG_CONFIG.church : ORG_CONFIG.church;
  const OrgIcon = config.icon;

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  // Error - Not found
  if (error && !org) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Unavailable</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/" className="text-purple-600 hover:underline">Go to CYBEV Home</Link>
        </div>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome! 🎉</h1>
          <p className="text-gray-600 mb-6">
            You have successfully joined <strong>{org.name}</strong>
          </p>
          
          {result?.user?.isNewUser && (
            <div className="bg-white rounded-2xl p-5 mb-6 text-left shadow-lg border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Your CYBEV Account
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{result.user.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Username:</span>
                  <span className="font-medium">@{result.user.username}</span>
                </p>
                {result.loginCredentials?.tempPassword && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-800 text-xs mb-1">Your temporary password:</p>
                    <p className="font-mono font-bold text-amber-900">{result.loginCredentials.tempPassword}</p>
                    <p className="text-amber-600 text-xs mt-1">Please change after login</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-6">
            You can update your profile details anytime from your dashboard.
          </p>

          <div className="space-y-3">
            {result?.token ? (
              <button
                onClick={() => router.push('/church')}
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 shadow-lg"
              >
                Go to Dashboard
              </button>
            ) : (
              <Link href="/auth/login" className="block w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 shadow-lg text-center">
                Login to CYBEV
              </Link>
            )}
            <Link href="/" className="block w-full py-3 text-gray-600 hover:text-gray-900 text-center">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Join {org?.name} | CYBEV</title>
        <meta name="description" content={`Register to join ${org?.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} text-white`}>
          <div className="max-w-lg mx-auto px-4 py-10 text-center">
            {org?.logo ? (
              <img src={org.logo} alt="" className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-white/20 shadow-lg" />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <OrgIcon className="w-10 h-10" />
              </div>
            )}
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-2">
              {config.label}
            </span>
            <h1 className="text-2xl font-bold">{org?.name}</h1>
            {org?.motto && <p className="text-white/80 text-sm mt-1">{org.motto}</p>}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-lg mx-auto px-4 py-8 -mt-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">Join Us</h2>
              <p className="text-gray-500 text-sm">Fill in your details to register</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Title */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <select
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  {TITLES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              
              {form.title === 'custom' ? (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Title</label>
                  <input
                    type="text"
                    value={form.customTitle}
                    onChange={(e) => handleChange('customTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your title"
                  />
                </div>
              ) : (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="John"
                    required
                  />
                </div>
              )}
            </div>

            {/* First Name (when custom title) & Last Name */}
            {form.title === 'custom' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Doe"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="john@example.com"
              />
              <p className="text-xs text-gray-400 mt-1">Used to create your CYBEV account</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                placeholder="+234 800 000 0000"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Country
              </label>
              <select
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Join {org?.name?.split(' ')[0]}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-purple-600 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Powered by <Link href="/" className="text-purple-600 hover:underline font-medium">CYBEV</Link>
          </p>
        </div>
      </div>
    </>
  );
}
