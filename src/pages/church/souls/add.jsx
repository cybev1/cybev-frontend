// ============================================
// FILE: src/pages/church/souls/add.jsx
// Add Soul - Enhanced with CE Zones
// VERSION: 2.0.0 - Zone Selection + Better UX
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Heart, UserPlus, Phone, Mail, MapPin, User, Save,
  Loader2, CheckCircle, Church, ArrowLeft, Globe, Search
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function AddSoul() {
  const router = useRouter();
  const { orgId, zoneId } = router.query; // Pre-select if coming from org page
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Data
  const [myOrgs, setMyOrgs] = useState([]);
  const [ceZones, setCeZones] = useState([]);
  const [zoneSearch, setZoneSearch] = useState('');
  
  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    city: '',
    country: '',
    gender: '',
    ageGroup: '',
    salvationType: 'first_time',
    howTheyHeard: '',
    howTheyHeardDetails: '',
    organizationId: orgId || '',
    ceZoneId: zoneId || '',
    notes: '',
    prayerRequest: ''
  });

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchMyOrgs();
    fetchCEZones();
  }, []);

  useEffect(() => {
    if (orgId) setForm(f => ({ ...f, organizationId: orgId }));
    if (zoneId) setForm(f => ({ ...f, ceZoneId: zoneId }));
  }, [orgId, zoneId]);

  const fetchMyOrgs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/organizations`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setMyOrgs(data.organizations || []);
      }
    } catch (err) {
      console.error('Fetch orgs error:', err);
    }
  };

  const fetchCEZones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/zones?category=zone`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setCeZones(data.zones || []);
      }
    } catch (err) {
      console.error('Fetch zones error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.firstName.trim()) {
      setError('First name is required');
      return;
    }
    
    if (!form.phone && !form.email) {
      setError('Phone number or email is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/church/souls`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          whatsapp: form.whatsapp || form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
          gender: form.gender || undefined,
          ageGroup: form.ageGroup || undefined,
          salvationType: form.salvationType,
          howTheyHeard: form.howTheyHeard || undefined,
          howTheyHeardDetails: form.howTheyHeardDetails || undefined,
          organizationId: form.organizationId || undefined,
          ceZoneId: form.ceZoneId || undefined,
          notes: form.notes,
          prayerRequest: form.prayerRequest
        })
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/church/souls');
        }, 2000);
      } else {
        setError(data.error || 'Failed to add soul');
      }
    } catch (err) {
      console.error('Add soul error:', err);
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  // Filter zones by search
  const filteredZones = ceZones.filter(zone =>
    zone.name.toLowerCase().includes(zoneSearch.toLowerCase())
  );

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Soul Added! 🙏</h2>
          <p className="text-gray-500 mb-6">
            {form.firstName} {form.lastName} has been added to the Soul Tracker.
          </p>
          <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto" />
          <p className="text-sm text-gray-400 mt-4">Redirecting to souls list...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Add Soul - CYBEV Church</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <Link href="/church/souls" className="inline-flex items-center gap-2 text-pink-200 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Soul Tracker
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8" />
              Add New Soul
            </h1>
            <p className="text-pink-100 mt-1">Record a new convert for follow-up and discipleship</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-pink-500" />
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group
                  </label>
                  <select
                    name="ageGroup"
                    value={form.ageGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select Age Group</option>
                    <option value="child">Child (0-12)</option>
                    <option value="teen">Teen (13-19)</option>
                    <option value="young_adult">Young Adult (20-35)</option>
                    <option value="adult">Adult (36-55)</option>
                    <option value="senior">Senior (56+)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Lagos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nigeria"
                  />
                </div>
              </div>
            </div>

            {/* Salvation Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Salvation Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salvation Type
                  </label>
                  <select
                    name="salvationType"
                    value={form.salvationType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="first_time">First Time Salvation</option>
                    <option value="rededication">Rededication</option>
                    <option value="transfer">Transfer from another church</option>
                    <option value="water_baptism">Water Baptism</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How They Heard About Us
                  </label>
                  <select
                    name="howTheyHeard"
                    value={form.howTheyHeard}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select Option</option>
                    <option value="service">Church Service</option>
                    <option value="crusade">Crusade/Outreach</option>
                    <option value="online">Online/Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="tv">LoveWorld TV</option>
                    <option value="radio">Radio</option>
                    <option value="rhapsody">Rhapsody of Realities</option>
                    <option value="healing_school">Healing School</option>
                    <option value="teevo">TeeVo</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {form.howTheyHeard === 'other' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Please specify
                  </label>
                  <input
                    type="text"
                    name="howTheyHeardDetails"
                    value={form.howTheyHeardDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500"
                    placeholder="How they heard about the church..."
                  />
                </div>
              )}
            </div>

            {/* Assignment */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Church className="w-5 h-5 text-purple-500" />
                Assignment
              </h2>

              <div className="space-y-4">
                {/* Organization Selection */}
                {myOrgs.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign to Organization
                    </label>
                    <select
                      name="organizationId"
                      value={form.organizationId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Organization</option>
                      {myOrgs.map(org => (
                        <option key={org._id} value={org._id}>
                          {org.name} ({org.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Zone Selection (if no organization selected) */}
                {!form.organizationId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Or Select CE Zone Directly
                    </label>
                    
                    {/* Zone Search */}
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={zoneSearch}
                        onChange={(e) => setZoneSearch(e.target.value)}
                        placeholder="Search zones..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <select
                      name="ceZoneId"
                      value={form.ceZoneId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                      size={5}
                    >
                      <option value="">Select Zone</option>
                      {filteredZones.map(zone => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredZones.length} zones available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Notes
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Any additional notes about this person..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prayer Request
                  </label>
                  <textarea
                    name="prayerRequest"
                    value={form.prayerRequest}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Any prayer requests..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Link href="/church/souls" className="flex-1">
                <button
                  type="button"
                  className="w-full py-4 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Soul
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
