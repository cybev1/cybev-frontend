// ============================================
// FILE: src/pages/church/org/create.jsx
// PURPOSE: Create New Organization Page
// DEPLOY TO: cybev-frontend-main/src/pages/church/org/create.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Building, Church, Users, Target, BookOpen,
  Palette, Save, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const ORG_TYPES = [
  { value: 'zone', label: 'Zone', description: 'Regional collection of churches', icon: '🌍', color: 'bg-blue-500' },
  { value: 'church', label: 'Church', description: 'Local church congregation', icon: '⛪', color: 'bg-purple-500' },
  { value: 'fellowship', label: 'Fellowship', description: 'Group of cells within a church', icon: '🤝', color: 'bg-green-500' },
  { value: 'cell', label: 'Cell', description: 'Small group meeting', icon: '🏠', color: 'bg-orange-500' },
  { value: 'biblestudy', label: 'Bible Study', description: 'Bible study group', icon: '📖', color: 'bg-teal-500' }
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

export default function CreateOrganizationPage() {
  const router = useRouter();
  const { parentId } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    type: 'church',
    description: '',
    motto: '',
    parentId: parentId || '',
    colorTheme: 'purple',
    contact: {
      email: '',
      phone: '',
      address: ''
    }
  });

  const [parentOrgs, setParentOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchParentOrganizations();
  }, []);

  useEffect(() => {
    if (parentId) {
      setFormData(prev => ({ ...prev, parentId }));
    }
  }, [parentId]);

  const fetchParentOrganizations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setParentOrgs(data.organizations || data.orgs || []);
      }
    } catch (err) {
      console.error('Error fetching parent organizations:', err);
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
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
        // Redirect to the new organization
        setTimeout(() => {
          const orgId = data.organization?._id || data.org?._id;
          router.push(`/church/org/${orgId}`);
        }, 1500);
      } else {
        setError(data.error || 'Failed to create organization');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = ORG_TYPES.find(t => t.value === formData.type);

  // Get valid parent types based on selected type
  const getValidParentTypes = () => {
    const hierarchy = { zone: 0, church: 1, fellowship: 2, cell: 3, biblestudy: 4 };
    const currentLevel = hierarchy[formData.type];
    return parentOrgs.filter(org => hierarchy[org.type] < currentLevel);
  };

  return (
    <AppLayout>
      <Head>
        <title>Create Organization | CYBEV Church</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/church"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Organization</h1>
            <p className="text-gray-500">Set up a new church, fellowship, cell, or group</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Organization created successfully!</p>
              <p className="text-sm text-green-600">Redirecting to your new organization...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Organization Type */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {ORG_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value, parentId: '' }))}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    formData.type === type.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{type.icon}</span>
                  <span className="font-medium text-sm block">{type.label}</span>
                </button>
              ))}
            </div>
            {selectedType && (
              <p className="mt-3 text-sm text-gray-500">{selectedType.description}</p>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
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
                  placeholder="e.g., Christ Embassy Lagos Zone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of your organization..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motto (Optional)
                </label>
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

          {/* Parent Organization */}
          {formData.type !== 'zone' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Parent Organization</h2>
              <p className="text-sm text-gray-500 mb-4">
                Select which organization this {formData.type} belongs to (optional)
              </p>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">No parent (standalone)</option>
                {getValidParentTypes().map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name} ({org.type})
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information (Optional)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
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

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <Link
              href="/church"
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.name || success}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Created!
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
      </div>
    </AppLayout>
  );
}
