// ============================================
// FILE: src/pages/church/org/[id]/edit.jsx
// PURPOSE: Edit Organization Page
// VERSION: 1.0 - Edit org details including leader name
// DEPLOY TO: cybev-frontend-main/src/pages/church/org/[id]/edit.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, X, User, Building, Mail, Phone, MapPin
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const ORG_TYPES = [
  { value: 'zone', label: 'Zone', icon: '🌍' },
  { value: 'church', label: 'Church', icon: '⛪' },
  { value: 'fellowship', label: 'Fellowship', icon: '🤝' },
  { value: 'cell', label: 'Cell', icon: '🏠' },
  { value: 'biblestudy', label: 'Bible Study', icon: '📖' }
];

const COLOR_THEMES = [
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' }
];

const LEADER_TITLES = [
  'Pastor', 'Reverend', 'Deacon', 'Deaconess', 'Elder', 
  'Brother', 'Sister', 'Minister', 'Evangelist', 'Bishop', 
  'Apostle', 'Prophet', 'Leader'
];

export default function EditOrganizationPage() {
  const router = useRouter();
  const { id } = router.query;

  const [org, setOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    motto: '',
    colorTheme: 'purple',
    leaderName: '',
    leaderTitle: '',
    contact: { email: '', phone: '', address: '' }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (id) fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.ok) {
        const orgData = data.org || data.organization;
        setOrg(orgData);
        setCanEdit(data.permissions?.canEdit || orgData.canManage);
        
        setFormData({
          name: orgData.name || '',
          description: orgData.description || '',
          motto: orgData.motto || '',
          colorTheme: orgData.colorTheme || 'purple',
          leaderName: orgData.leaderName || '',
          leaderTitle: orgData.leaderTitle || '',
          contact: {
            email: orgData.contact?.email || '',
            phone: orgData.contact?.phone || '',
            address: orgData.contact?.address || ''
          }
        });
      } else {
        setError(data.error || 'Failed to load organization');
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/church/org/${id}`);
        }, 1500);
      } else {
        setError(data.error || 'Failed to update organization');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  if (!org) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Organization Not Found</h2>
            <p className="text-red-600 mb-4">{error || 'The organization could not be loaded.'}</p>
            <Link href="/church" className="text-purple-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!canEdit) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Denied</h2>
            <p className="text-yellow-600 mb-4">You don't have permission to edit this organization.</p>
            <Link href={`/church/org/${id}`} className="text-purple-600 hover:underline">
              ← Back to Organization
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const orgType = ORG_TYPES.find(t => t.value === org.type);

  return (
    <AppLayout>
      <Head>
        <title>Edit {org.name} | CYBEV Church</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/church/org/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{orgType?.icon}</span>
              <h1 className="text-2xl font-bold text-gray-900">Edit {org.name}</h1>
            </div>
            <p className="text-gray-500">Update your {orgType?.label?.toLowerCase()} information</p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Changes saved successfully!</p>
              <p className="text-sm text-green-600">Redirecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motto</label>
                <input
                  type="text"
                  name="motto"
                  value={formData.motto}
                  onChange={handleChange}
                  placeholder="e.g., Reaching the world with the Gospel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Leader Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Leader Information
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              The actual leader of this {orgType?.label?.toLowerCase()} (may be different from who created it on CYBEV)
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leader Title</label>
                <select
                  name="leaderTitle"
                  value={formData.leaderTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Select Title --</option>
                  {LEADER_TITLES.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leader Full Name</label>
                <input
                  type="text"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleChange}
                  placeholder="e.g., Earnest Omoleme"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            {org.leader && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Created by:</strong> {org.leader.name || org.leader.username || 'Unknown'} (CYBEV Account)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  This person manages the organization on CYBEV. The leader name above is for display purposes.
                </p>
              </div>
            )}
          </div>

          {/* Color Theme */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Theme</h2>
            <div className="flex flex-wrap gap-3">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, colorTheme: theme.value }))}
                  className={`w-10 h-10 rounded-full ${theme.class} transition transform ${
                    formData.colorTheme === theme.value
                      ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={theme.label}
                />
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <input
                    type="email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Address
                </label>
                <input
                  type="text"
                  name="contact.address"
                  value={formData.contact.address}
                  onChange={handleChange}
                  placeholder="123 Church Street, City, Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <Link href={`/church/org/${id}`} className="px-6 py-3 text-gray-600 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !formData.name || success}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
              ) : success ? (
                <><CheckCircle className="w-5 h-5" /> Saved!</>
              ) : (
                <><Save className="w-5 h-5" /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
