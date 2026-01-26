// ============================================
// FILE: src/pages/church/org/create.jsx
// PURPOSE: Create New Organization Page
// VERSION: 2.0 - Shows existing orgs + create new parent
// DEPLOY TO: cybev-frontend-main/src/pages/church/org/create.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, Plus, X
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const ORG_TYPES = [
  { value: 'zone', label: 'Zone', description: 'Regional collection of churches', icon: '🌍', level: 0, parentType: null },
  { value: 'church', label: 'Church', description: 'Local church congregation', icon: '⛪', level: 1, parentType: 'zone' },
  { value: 'fellowship', label: 'Fellowship', description: 'Group of cells within a church', icon: '🤝', level: 2, parentType: 'church' },
  { value: 'cell', label: 'Cell', description: 'Small group meeting', icon: '🏠', level: 3, parentType: 'fellowship' },
  { value: 'biblestudy', label: 'Bible Study', description: 'Bible study group', icon: '📖', level: 4, parentType: 'cell' }
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
  const { parentId, type: queryType } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    type: 'church',
    description: '',
    motto: '',
    parentId: '',
    colorTheme: 'purple',
    contact: { email: '', phone: '', address: '' }
  });

  const [allOrgs, setAllOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Quick create parent modal
  const [showCreateParent, setShowCreateParent] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [creatingParent, setCreatingParent] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (parentId) setFormData(prev => ({ ...prev, parentId }));
    if (queryType) setFormData(prev => ({ ...prev, type: queryType }));
  }, [parentId, queryType]);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setAllOrgs(data.organizations || data.orgs || []);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
    } finally {
      setLoadingOrgs(false);
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

  const handleTypeChange = (newType) => {
    setFormData(prev => ({ ...prev, type: newType, parentId: '' }));
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

  // Get the recommended parent type for current org type
  const getRecommendedParentType = () => {
    const typeInfo = ORG_TYPES.find(t => t.value === formData.type);
    return typeInfo?.parentType || null;
  };

  // Get valid parent organizations (orgs with level < current type level)
  const getValidParentOrgs = () => {
    const currentTypeInfo = ORG_TYPES.find(t => t.value === formData.type);
    if (!currentTypeInfo) return [];
    return allOrgs.filter(org => {
      const orgTypeInfo = ORG_TYPES.find(t => t.value === org.type);
      return orgTypeInfo && orgTypeInfo.level < currentTypeInfo.level;
    });
  };

  // Group parent orgs by type for better display
  const getGroupedParentOrgs = () => {
    const validOrgs = getValidParentOrgs();
    const grouped = {};
    ORG_TYPES.forEach(type => {
      const orgsOfType = validOrgs.filter(org => org.type === type.value);
      if (orgsOfType.length > 0) {
        grouped[type.value] = { label: type.label, icon: type.icon, orgs: orgsOfType };
      }
    });
    return grouped;
  };

  // Quick create a parent organization
  const handleCreateParent = async () => {
    if (!newParentName.trim()) return;
    
    setCreatingParent(true);
    const parentType = getRecommendedParentType();
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newParentName,
          type: parentType,
          colorTheme: 'purple'
        })
      });

      const data = await res.json();

      if (data.ok) {
        const newOrg = data.organization || data.org;
        setAllOrgs(prev => [...prev, newOrg]);
        setFormData(prev => ({ ...prev, parentId: newOrg._id }));
        setShowCreateParent(false);
        setNewParentName('');
      } else {
        setError(data.error || 'Failed to create parent');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setCreatingParent(false);
    }
  };

  const selectedType = ORG_TYPES.find(t => t.value === formData.type);
  const recommendedParentType = getRecommendedParentType();
  const validParentOrgs = getValidParentOrgs();
  const groupedParentOrgs = getGroupedParentOrgs();
  const hasValidParents = validParentOrgs.length > 0;

  return (
    <AppLayout>
      <Head>
        <title>Create Organization | CYBEV Church</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/church" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Organization</h1>
            <p className="text-gray-500">Set up a new church, fellowship, cell, or group</p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Organization created successfully!</p>
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
          {/* Organization Type */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ORG_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value)}
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
                  placeholder={`e.g., ${selectedType?.label || 'Organization'} Name`}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Motto (Optional)</label>
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

          {/* Parent Organization - Only show if not Zone */}
          {formData.type !== 'zone' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Parent Organization</h2>
                  <p className="text-sm text-gray-500">
                    {recommendedParentType 
                      ? `Select a ${ORG_TYPES.find(t => t.value === recommendedParentType)?.label || 'parent'} for this ${selectedType?.label}`
                      : `Select which organization this ${selectedType?.label} belongs to`
                    }
                  </p>
                </div>
                {recommendedParentType && (
                  <button
                    type="button"
                    onClick={() => setShowCreateParent(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                  >
                    <Plus className="w-4 h-4" />
                    New {ORG_TYPES.find(t => t.value === recommendedParentType)?.label}
                  </button>
                )}
              </div>

              {loadingOrgs ? (
                <div className="flex items-center gap-2 text-gray-500 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading organizations...
                </div>
              ) : !hasValidParents ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    You don't have any {recommendedParentType ? ORG_TYPES.find(t => t.value === recommendedParentType)?.label + 's' : 'organizations'} yet.
                  </p>
                  {recommendedParentType && (
                    <button
                      type="button"
                      onClick={() => setShowCreateParent(true)}
                      className="mt-2 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                      Create a {ORG_TYPES.find(t => t.value === recommendedParentType)?.label} first
                    </button>
                  )}
                </div>
              ) : (
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Select Parent Organization --</option>
                  {Object.entries(groupedParentOrgs).map(([type, group]) => (
                    <optgroup key={type} label={`${group.icon} ${group.label}s`}>
                      {group.orgs.map((org) => (
                        <option key={org._id} value={org._id}>
                          {org.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
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

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact (Optional)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
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
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4">
            <Link href="/church" className="px-6 py-3 text-gray-600 hover:text-gray-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.name || success}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
              ) : success ? (
                <><CheckCircle className="w-5 h-5" /> Created!</>
              ) : (
                <><Save className="w-5 h-5" /> Create {selectedType?.label}</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Create Parent Modal */}
      {showCreateParent && recommendedParentType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Create New {ORG_TYPES.find(t => t.value === recommendedParentType)?.label}
              </h3>
              <button onClick={() => setShowCreateParent(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Quickly create a {ORG_TYPES.find(t => t.value === recommendedParentType)?.label.toLowerCase()} to be the parent of your {selectedType?.label.toLowerCase()}.
            </p>

            <input
              type="text"
              value={newParentName}
              onChange={(e) => setNewParentName(e.target.value)}
              placeholder={`${ORG_TYPES.find(t => t.value === recommendedParentType)?.label} name...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateParent(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateParent}
                disabled={!newParentName.trim() || creatingParent}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {creatingParent ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                ) : (
                  <><Plus className="w-4 h-4" /> Create</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
