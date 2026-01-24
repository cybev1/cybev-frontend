/**
 * ============================================
 * FILE: [slug].jsx
 * PATH: cybev-frontend-main/src/pages/join/[slug].jsx
 * VERSION: 1.0.0 - Public Organization Registration
 * UPDATED: 2026-01-24
 * FEATURES:
 *   - Public registration (no auth required)
 *   - Auto-create CYBEV account
 *   - Full comprehensive form with all fields
 *   - Mobile responsive design
 *   - Success redirect
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Heart, User, Phone, Mail, MapPin, Calendar, Briefcase, BookOpen,
  Loader2, Check, AlertCircle, Eye, EyeOff, ChevronRight, Lock,
  Facebook, Instagram, Twitter, Building, Users, Globe, Home,
  Layers, Grid3X3, UserPlus, CheckCircle, ArrowLeft, Share2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const TITLES = [
  { value: '', label: 'Select Title' },
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Bro', label: 'Brother' },
  { value: 'Sis', label: 'Sister' },
  { value: 'Pastor', label: 'Pastor' },
  { value: 'Evangelist', label: 'Evangelist' },
  { value: 'Deacon', label: 'Deacon' },
  { value: 'Deaconess', label: 'Deaconess' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Elder', label: 'Elder' }
];

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
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    // Step 1: Personal
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    // Address
    address: '',
    city: '',
    state: '',
    country: '',
    // Step 2: Spiritual & Account
    isSaved: true,
    salvationDate: '',
    baptismType: 'none',
    enrollInFoundationSchool: true,
    password: '',
    // Step 3: Professional & Social
    profession: '',
    employer: '',
    socialMedia: { facebook: '', instagram: '', twitter: '' },
    emergencyContact: { name: '', phone: '', relationship: '' },
    howDidYouHear: '',
    notes: ''
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
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.firstName.trim()) return 'First name is required';
      if (!form.phone.trim() && !form.email.trim()) return 'Phone or email is required';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep(step);
    if (err) { alert(err); return; }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep(step);
    if (err) { alert(err); return; }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/church/register/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-6">
            You have successfully joined <strong>{org.name}</strong>
          </p>
          
          {result?.user?.isNewUser && (
            <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-purple-800 mb-2">Your CYBEV Account</h3>
              <p className="text-purple-700 text-sm">Email: {result.user.email}</p>
              <p className="text-purple-700 text-sm">Username: @{result.user.username}</p>
              {result.loginCredentials?.tempPassword && (
                <p className="text-purple-700 text-sm mt-2">
                  Temporary Password: <code className="bg-purple-100 px-2 py-1 rounded">{result.loginCredentials.tempPassword}</code>
                  <br/><span className="text-xs">Please change after login</span>
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {result?.token ? (
              <button
                onClick={() => router.push('/church')}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
              >
                Go to Dashboard
              </button>
            ) : (
              <Link href="/auth/login" className="block w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 text-center">
                Login to CYBEV
              </Link>
            )}
            <Link href="/" className="block w-full py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-center">
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
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} text-white`}>
          <div className="max-w-2xl mx-auto px-4 py-10 text-center">
            {org?.logo ? (
              <img src={org.logo} alt="" className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-white/20" />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <OrgIcon className="w-10 h-10" />
              </div>
            )}
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-2">
              {config.label}
            </span>
            <h1 className="text-3xl font-bold">{org?.name}</h1>
            {org?.motto && <p className="text-white/80 mt-1">{org.motto}</p>}
            {org?.parent && (
              <p className="text-white/60 text-sm mt-2">Part of {org.parent.name}</p>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto px-4 -mt-5">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map(n => (
                <div key={n} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= n ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > n ? <Check className="w-4 h-4" /> : n}
                  </div>
                  {n < 3 && <div className={`w-12 h-1 mx-1 rounded ${step > n ? 'bg-purple-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
              <span>Personal</span>
              <span>Spiritual</span>
              <span>Complete</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-600" /> Personal Information
                </h2>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <select value={form.title} onChange={e => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl">
                      {TITLES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input type="text" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="John" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"><Phone className="w-4 h-4 inline" /> Phone *</label>
                    <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="+234..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"><Mail className="w-4 h-4 inline" /> Email</label>
                    <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="john@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select value={form.gender} onChange={e => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" value={form.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select value={form.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl">
                      <option value="">Select</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input type="tel" value={form.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="Same as phone?" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><MapPin className="w-4 h-4 inline" /> Address</label>
                  <input type="text" value={form.address} onChange={e => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl mb-2" placeholder="Street address" />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={form.city} onChange={e => handleChange('city', e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="City" />
                    <input type="text" value={form.state} onChange={e => handleChange('state', e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="State" />
                    <input type="text" value={form.country} onChange={e => handleChange('country', e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="Country" />
                  </div>
                </div>

                <button type="button" onClick={nextStep}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2">
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Spiritual & Account */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple-600" /> Spiritual & Account
                </h2>

                <div className="p-4 bg-purple-50 rounded-xl space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isSaved} onChange={e => handleChange('isSaved', e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded" />
                    <span className="font-medium text-gray-900">I am Born Again / Saved</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.enrollInFoundationSchool} onChange={e => handleChange('enrollInFoundationSchool', e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded" />
                    <span className="font-medium text-gray-900">
                      <BookOpen className="w-4 h-4 inline mr-1" /> Enroll me in Foundation School
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salvation Date</label>
                    <input type="date" value={form.salvationDate} onChange={e => handleChange('salvationDate', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baptism</label>
                    <select value={form.baptismType} onChange={e => handleChange('baptismType', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl">
                      <option value="none">Not Baptized</option>
                      <option value="water">Water Baptism</option>
                      <option value="holy_spirit">Holy Spirit</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                {form.email && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-600" /> Create CYBEV Account
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Set a password to access church features, foundation school, and more.
                    </p>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={form.password}
                        onChange={e => handleChange('password', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl pr-10"
                        placeholder="Password (min 6 chars) - or leave blank for auto" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to auto-generate password</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">
                    Back
                  </button>
                  <button type="button" onClick={nextStep}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Professional & Complete */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-purple-600" /> Additional Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                    <input type="text" value={form.profession} onChange={e => handleChange('profession', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="e.g., Teacher" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                    <input type="text" value={form.employer} onChange={e => handleChange('employer', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" placeholder="Company name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media (Optional)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <input type="text" value={form.socialMedia.facebook}
                        onChange={e => handleChange('socialMedia.facebook', e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Facebook" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-600 flex-shrink-0" />
                      <input type="text" value={form.socialMedia.instagram}
                        onChange={e => handleChange('socialMedia.instagram', e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Instagram" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="w-5 h-5 text-sky-500 flex-shrink-0" />
                      <input type="text" value={form.socialMedia.twitter}
                        onChange={e => handleChange('socialMedia.twitter', e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Twitter" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={form.emergencyContact.name}
                      onChange={e => handleChange('emergencyContact.name', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg" placeholder="Name" />
                    <input type="text" value={form.emergencyContact.relationship}
                      onChange={e => handleChange('emergencyContact.relationship', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg" placeholder="Relationship" />
                    <input type="tel" value={form.emergencyContact.phone}
                      onChange={e => handleChange('emergencyContact.phone', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg" placeholder="Phone" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                  <select value={form.howDidYouHear} onChange={e => handleChange('howDidYouHear', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl">
                    <option value="">Select</option>
                    <option value="friend">Friend/Family</option>
                    <option value="social_media">Social Media</option>
                    <option value="church">Church Service</option>
                    <option value="crusade">Crusade/Outreach</option>
                    <option value="online">Online Search</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Request / Notes</label>
                  <textarea value={form.notes} onChange={e => handleChange('notes', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" rows={3}
                    placeholder="Any prayer requests or notes..." />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">
                    Back
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</> : <><UserPlus className="w-5 h-5" /> Complete Registration</>}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Powered by <Link href="/" className="text-purple-600 hover:underline">CYBEV</Link>
          </p>
        </div>
      </div>
    </>
  );
}
