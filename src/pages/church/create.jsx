// ============================================
// FILE: pages/church/create.jsx
// Create Church Organization
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Church, Building2, Users, BookOpen, ArrowLeft,
  MapPin, Phone, Mail, Globe, Clock, Save, Loader2,
  CheckCircle, ChevronRight, Plus
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const orgTypes = [
  { 
    id: 'zone', 
    name: 'Zone', 
    description: 'Highest level - oversees multiple churches',
    icon: Globe,
    color: 'from-purple-500 to-indigo-600'
  },
  { 
    id: 'church', 
    name: 'Church', 
    description: 'A local church congregation',
    icon: Church,
    color: 'from-blue-500 to-cyan-600'
  },
  { 
    id: 'fellowship', 
    name: 'Fellowship', 
    description: 'A group within a church (e.g., Youth, Women)',
    icon: Users,
    color: 'from-green-500 to-emerald-600'
  },
  { 
    id: 'cell', 
    name: 'Cell', 
    description: 'Small group for fellowship and Bible study',
    icon: Building2,
    color: 'from-orange-500 to-amber-600'
  },
  { 
    id: 'biblestudy', 
    name: 'Bible Study Class', 
    description: 'Dedicated Bible study group',
    icon: BookOpen,
    color: 'from-pink-500 to-rose-600'
  }
];

const colorThemes = [
  { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
  { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
  { id: 'green', name: 'Green', class: 'bg-green-500' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
  { id: 'pink', name: 'Pink', class: 'bg-pink-500' },
  { id: 'red', name: 'Red', class: 'bg-red-500' },
  { id: 'teal', name: 'Teal', class: 'bg-teal-500' },
  { id: 'indigo', name: 'Indigo', class: 'bg-indigo-500' }
];

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function CreateOrganization() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [createdOrg, setCreatedOrg] = useState(null);
  
  const [myOrgs, setMyOrgs] = useState([]);
  
  const [form, setForm] = useState({
    type: '',
    name: '',
    description: '',
    motto: '',
    parentId: '',
    colorTheme: 'purple',
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      city: '',
      state: '',
      country: ''
    },
    meetingSchedule: []
  });

  const [newMeeting, setNewMeeting] = useState({
    day: 'sunday',
    time: '10:00',
    title: 'Sunday Service',
    type: 'service'
  });

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchMyOrgs();
  }, []);

  const fetchMyOrgs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setMyOrgs(data.orgs || []);
      }
    } catch (err) {
      console.error('Fetch orgs error:', err);
    }
  };

  const handleTypeSelect = (type) => {
    setForm(f => ({ ...f, type }));
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.replace('contact.', '');
      setForm(f => ({ ...f, contact: { ...f.contact, [field]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setError('');
  };

  const addMeeting = () => {
    setForm(f => ({
      ...f,
      meetingSchedule: [...f.meetingSchedule, { ...newMeeting }]
    }));
    setNewMeeting({ day: 'sunday', time: '10:00', title: '', type: 'service' });
  };

  const removeMeeting = (index) => {
    setForm(f => ({
      ...f,
      meetingSchedule: f.meetingSchedule.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name) {
      setError('Organization name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/church/org`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          type: form.type,
          name: form.name,
          description: form.description,
          motto: form.motto,
          parentId: form.parentId || undefined,
          colorTheme: form.colorTheme,
          contact: form.contact,
          meetingSchedule: form.meetingSchedule
        })
      });

      const data = await res.json();

      if (data.ok) {
        setCreatedOrg(data.org);
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to create organization');
      }
    } catch (err) {
      console.error('Create org error:', err);
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  // Get valid parent types based on selected type
  const getValidParents = () => {
    const hierarchy = { zone: -1, church: 0, fellowship: 1, cell: 2, biblestudy: 3 };
    const currentLevel = hierarchy[form.type];
    
    return myOrgs.filter(org => {
      const orgLevel = hierarchy[org.type];
      return orgLevel < currentLevel;
    });
  };

  if (success && createdOrg) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md w-full shadow-xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Organization Created!
          </h2>
          <p className="text-gray-500 mb-6">
            <strong>{createdOrg.name}</strong> has been created successfully.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/church/org/${createdOrg._id}`)}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
            >
              View Organization
            </button>
            <button
              onClick={() => router.push('/church')}
              className="w-full py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Create Organization - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Church Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Church className="w-8 h-8" />
            Create Organization
          </h1>
          <p className="text-purple-100 mt-1">Set up a new church, fellowship, cell, or group</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= s 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  step > s ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Type */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              What type of organization are you creating?
            </h2>
            
            <div className="grid gap-4">
              {orgTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 transition">
                          {type.name}
                        </h3>
                        <p className="text-gray-500 text-sm">{type.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
              {/* Parent Organization */}
              {form.type !== 'zone' && getValidParents().length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Parent Organization
                  </label>
                  <select
                    name="parentId"
                    value={form.parentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">None (Independent)</option>
                    {getValidParents().map(org => (
                      <option key={org._id} value={org._id}>
                        {org.name} ({org.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Christ Embassy Lagos Zone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Tell people about your organization..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Motto
                </label>
                <input
                  type="text"
                  name="motto"
                  value={form.motto}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Spreading the Gospel to the Nations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorThemes.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, colorTheme: color.id }))}
                      className={`w-10 h-10 rounded-full ${color.class} ${
                        form.colorTheme === color.id 
                          ? 'ring-4 ring-offset-2 ring-gray-400' 
                          : ''
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Contact & Schedule */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Contact & Meeting Schedule
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-500" />
                Contact Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="contact.email"
                    value={form.contact.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="contact@church.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={form.contact.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    name="contact.address"
                    value={form.contact.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="123 Church Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    name="contact.city"
                    value={form.contact.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Lagos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                  <input
                    type="text"
                    name="contact.country"
                    value={form.contact.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Nigeria"
                  />
                </div>
              </div>
            </div>

            {/* Meeting Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Meeting Schedule
              </h3>

              {/* Existing meetings */}
              {form.meetingSchedule.length > 0 && (
                <div className="space-y-2 mb-4">
                  {form.meetingSchedule.map((meeting, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{meeting.title}</span>
                        <span className="text-gray-500 ml-2">
                          {meeting.day.charAt(0).toUpperCase() + meeting.day.slice(1)} at {meeting.time}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMeeting(i)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new meeting */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select
                  value={newMeeting.day}
                  onChange={(e) => setNewMeeting(m => ({ ...m, day: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting(m => ({ ...m, time: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting(m => ({ ...m, title: e.target.value }))}
                  placeholder="Service name"
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={addMeeting}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Organization
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
