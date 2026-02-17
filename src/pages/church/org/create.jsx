// ============================================
// FILE: src/pages/church/org/create.jsx
// PURPOSE: Create New Organization with Ministry Selection & CE Zones
// VERSION: 3.0 - Ministry Selection + CE Zones Support
// DEPLOY TO: cybev-frontend-main/src/pages/church/org/create.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, Plus, X, ChevronRight,
  Search, Globe, MapPin, Building, ChevronDown
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

// Ministry options
const MINISTRIES = [
  { 
    value: 'christ_embassy', 
    label: 'Christ Embassy', 
    description: 'Loveworld Inc. / Christ Embassy churches and ministries',
    icon: '⛪'
  },
  { 
    value: 'others', 
    label: 'Other Ministry', 
    description: 'Other churches and religious organizations',
    icon: '🏛️'
  }
];

// Organization types
const ORG_TYPES = [
  { value: 'church', label: 'Church', description: 'Local church congregation', icon: '⛪', level: 1 },
  { value: 'fellowship', label: 'Fellowship', description: 'Group of cells within a church', icon: '🤝', level: 2 },
  { value: 'cell', label: 'Cell', description: 'Small group meeting', icon: '🏠', level: 3 },
  { value: 'biblestudy', label: 'Bible Study', description: 'Bible study group', icon: '📖', level: 4 }
];

// Zone categories for filtering
const ZONE_CATEGORIES = [
  { value: 'all', label: 'All Zones' },
  { value: 'zone', label: 'Main Zones' },
  { value: 'blw', label: 'BLW Zones' },
  { value: 'ministry', label: 'Ministry Zones' },
  { value: 'ism', label: 'ISM Zones' },
  { value: 'department', label: 'Departments' }
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

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: '',
    type: 'church',
    description: '',
    motto: '',
    parentId: '',
    colorTheme: 'purple',
    leaderName: '',
    leaderTitle: '',
    ministry: 'christ_embassy',
    customMinistry: '',
    ceZoneId: '',
    contact: { email: '', phone: '', address: '', city: '', state: '', country: '' }
  });

  // CE Zones state
  const [ceZones, setCeZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [zoneSearch, setZoneSearch] = useState('');
  const [zoneCategory, setZoneCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);
  const [loadingZones, setLoadingZones] = useState(false);

  // All organizations from API
  const [allOrgs, setAllOrgs] = useState([]);
  
  // Cascading selections
  const [selectedParentOrg, setSelectedParentOrg] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Quick create parent modal
  const [showCreateParent, setShowCreateParent] = useState(false);
  const [createParentType, setCreateParentType] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [creatingParent, setCreatingParent] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchOrganizations();
    if (formData.ministry === 'christ_embassy') {
      fetchCEZones();
    }
  }, []);

  useEffect(() => {
    if (parentId) setFormData(prev => ({ ...prev, parentId }));
    if (queryType) setFormData(prev => ({ ...prev, type: queryType }));
  }, [parentId, queryType]);

  // Filter zones when search or category changes
  useEffect(() => {
    let filtered = [...ceZones];
    
    if (zoneCategory !== 'all') {
      filtered = filtered.filter(z => z.category === zoneCategory);
    }
    
    if (zoneSearch.trim()) {
      const query = zoneSearch.toLowerCase();
      filtered = filtered.filter(z => 
        z.name.toLowerCase().includes(query) ||
        z.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredZones(filtered);
  }, [ceZones, zoneSearch, zoneCategory]);

  const fetchCEZones = async () => {
    setLoadingZones(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/zones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setCeZones(data.zones || []);
        setFilteredZones(data.zones || []);
      }
    } catch (err) {
      console.error('Error fetching CE zones:', err);
    } finally {
      setLoadingZones(false);
    }
  };

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations/available-parents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setAllOrgs(data.organizations || []);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      // Fallback
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/api/church/organizations/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.ok) {
          setAllOrgs(data.organizations || data.orgs || []);
        }
      } catch (e) {
        console.error('Fallback failed:', e);
      }
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

  const selectZone = (zone) => {
    setSelectedZone(zone);
    setFormData(prev => ({ ...prev, ceZoneId: zone.id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Build payload
      const payload = {
        ...formData,
        // Include CE zone data if selected
        ceZone: selectedZone ? {
          id: selectedZone.id,
          name: selectedZone.name,
          category: selectedZone.category
        } : null
      };
      
      const res = await fetch(`${API}/api/church/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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

  // Quick create a parent organization
  const handleCreateParent = async () => {
    if (!newParentName.trim() || !createParentType) return;
    
    setCreatingParent(true);
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
          type: createParentType,
          ministry: formData.ministry,
          ceZone: selectedZone ? {
            id: selectedZone.id,
            name: selectedZone.name,
            category: selectedZone.category
          } : null
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        const newOrg = data.organization || data.org;
        setAllOrgs(prev => [...prev, newOrg]);
        setSelectedParentOrg(newOrg._id);
        setFormData(prev => ({ ...prev, parentId: newOrg._id }));
        setShowCreateParent(false);
        setNewParentName('');
      } else {
        alert(data.error || 'Failed to create');
      }
    } catch (err) {
      alert('Error creating organization');
    } finally {
      setCreatingParent(false);
    }
  };

  const openCreateParentModal = (type) => {
    setCreateParentType(type);
    setNewParentName('');
    setShowCreateParent(true);
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.ministry;
      case 2: return formData.ministry === 'others' || (formData.ministry === 'christ_embassy' && selectedZone);
      case 3: return formData.type;
      case 4: return formData.name.trim();
      case 5: return true;
      default: return true;
    }
  };

  // Get available parent organizations based on type and zone
  const getAvailableParents = () => {
    let parents = allOrgs.filter(org => {
      // Filter by ministry
      if (formData.ministry === 'christ_embassy' && org.ministry !== 'christ_embassy') return false;
      
      // Filter by zone if selected
      if (selectedZone && org.ceZone?.id !== selectedZone.id) return false;
      
      return true;
    });

    // Filter by type hierarchy
    const typeOrder = ['zone', 'church', 'fellowship', 'cell', 'biblestudy'];
    const currentTypeIndex = typeOrder.indexOf(formData.type);
    
    if (currentTypeIndex > 0) {
      // Can only have parents that are higher in hierarchy
      parents = parents.filter(org => {
        const orgTypeIndex = typeOrder.indexOf(org.type);
        return orgTypeIndex < currentTypeIndex;
      });
    }

    return parents;
  };

  const selectedType = ORG_TYPES.find(t => t.value === formData.type);

  return (
    <AppLayout>
      <Head>
        <title>Create Organization | CYBEV Church</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/church" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Organization</h1>
            <p className="text-gray-500">Set up a new church, cell, or ministry group</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep ? 'bg-purple-600 text-white' :
                  step === currentStep ? 'bg-purple-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 ${
                    step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Ministry</span>
            <span>Zone</span>
            <span>Type</span>
            <span>Details</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <p className="text-green-700">Organization created successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Ministry Selection */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Ministry</h2>
              <p className="text-gray-500 text-sm mb-6">Choose the ministry this organization belongs to</p>
              
              <div className="space-y-4">
                {MINISTRIES.map(ministry => (
                  <button
                    key={ministry.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, ministry: ministry.value }));
                      if (ministry.value === 'christ_embassy') {
                        fetchCEZones();
                      }
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      formData.ministry === ministry.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{ministry.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{ministry.label}</p>
                        <p className="text-sm text-gray-500">{ministry.description}</p>
                      </div>
                      {formData.ministry === ministry.value && (
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {formData.ministry === 'others' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ministry/Denomination Name
                  </label>
                  <input
                    type="text"
                    name="customMinistry"
                    value={formData.customMinistry}
                    onChange={handleChange}
                    placeholder="e.g., Baptist, Methodist, RCCG..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: CE Zone Selection (only for Christ Embassy) */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {formData.ministry === 'christ_embassy' ? 'Select Zone' : 'Location'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {formData.ministry === 'christ_embassy' 
                  ? 'Choose the Christ Embassy zone this organization belongs to'
                  : 'Specify the location of your organization'}
              </p>
              
              {formData.ministry === 'christ_embassy' ? (
                <>
                  {/* Zone Search and Filter */}
                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search zones..."
                        value={zoneSearch}
                        onChange={(e) => setZoneSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={zoneCategory}
                      onChange={(e) => setZoneCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {ZONE_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Zone Display */}
                  {selectedZone && (
                    <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-purple-900">{selectedZone.name}</p>
                          <p className="text-sm text-purple-600 capitalize">{selectedZone.category} Zone</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedZone(null);
                          setFormData(prev => ({ ...prev, ceZoneId: '' }));
                        }}
                        className="p-1 hover:bg-purple-100 rounded"
                      >
                        <X className="w-5 h-5 text-purple-600" />
                      </button>
                    </div>
                  )}

                  {/* Zones List */}
                  {loadingZones ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                      {filteredZones.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Globe className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p>No zones found</p>
                          <p className="text-sm">Try adjusting your search</p>
                        </div>
                      ) : (
                        filteredZones.map(zone => (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => selectZone(zone)}
                            className={`w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                              selectedZone?.id === zone.id ? 'bg-purple-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Globe className={`w-5 h-5 ${
                                selectedZone?.id === zone.id ? 'text-purple-600' : 'text-gray-400'
                              }`} />
                              <div>
                                <p className="font-medium text-gray-900">{zone.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{zone.category}</p>
                              </div>
                            </div>
                            {selectedZone?.id === zone.id && (
                              <CheckCircle className="w-5 h-5 text-purple-600" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-3">
                    {filteredZones.length} of {ceZones.length} zones shown
                  </p>
                </>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="contact.city"
                      value={formData.contact.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
                    <input
                      type="text"
                      name="contact.state"
                      value={formData.contact.state}
                      onChange={handleChange}
                      placeholder="State or Region"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="contact.country"
                      value={formData.contact.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Organization Type */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Organization Type</h2>
              <p className="text-gray-500 text-sm mb-6">What type of organization are you creating?</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {ORG_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      formData.type === type.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      {formData.type === type.value && (
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Parent Organization Selection */}
              {formData.type !== 'church' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Parent Organization (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => openCreateParentModal(
                        formData.type === 'cell' ? 'fellowship' :
                        formData.type === 'biblestudy' ? 'cell' : 'church'
                      )}
                      className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Create New
                    </button>
                  </div>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">-- No Parent (Standalone) --</option>
                    {getAvailableParents().map(org => (
                      <option key={org._id} value={org._id}>
                        {org.name} ({org.type})
                        {org.ceZone?.name ? ` - ${org.ceZone.name}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Organization Details */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Organization Details</h2>
              <p className="text-gray-500 text-sm mb-6">Provide basic information about your {selectedType?.label.toLowerCase()}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedType?.label} Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={`e.g., Christ Embassy ${formData.contact.city || 'Lagos'} - Main`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your organization..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leader Name</label>
                    <input
                      type="text"
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleChange}
                      placeholder="Full name of the leader"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leader Title</label>
                    <select
                      name="leaderTitle"
                      value={formData.leaderTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">-- Select Title --</option>
                      <option value="Pastor">Pastor</option>
                      <option value="Deacon">Deacon</option>
                      <option value="Deaconess">Deaconess</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Elder">Elder</option>
                      <option value="Minister">Minister</option>
                      <option value="Evangelist">Evangelist</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motto (Optional)</label>
                  <input
                    type="text"
                    name="motto"
                    value={formData.motto}
                    onChange={handleChange}
                    placeholder="Organization motto or slogan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Color Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
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
              </div>
            </div>
          )}

          {/* Step 5: Contact Information */}
          {currentStep === 5 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-500 text-sm mb-6">How can people reach this organization?</p>
              
              <div className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="contact.address"
                    value={formData.contact.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ministry:</span>
                      <span className="font-medium text-gray-900">
                        {formData.ministry === 'christ_embassy' ? 'Christ Embassy' : formData.customMinistry || 'Other'}
                      </span>
                    </div>
                    {selectedZone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Zone:</span>
                        <span className="font-medium text-gray-900">{selectedZone.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-900">{selectedType?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900">{formData.name || '-'}</span>
                    </div>
                    {formData.leaderName && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Leader:</span>
                        <span className="font-medium text-gray-900">
                          {formData.leaderTitle} {formData.leaderName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <Link href="/church" className="px-6 py-3 text-gray-600 hover:text-gray-900">
                Cancel
              </Link>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
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
            )}
          </div>
        </form>
      </div>

      {/* Quick Create Parent Modal */}
      {showCreateParent && createParentType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Create New {ORG_TYPES.find(t => t.value === createParentType)?.label || createParentType}
              </h3>
              <button onClick={() => setShowCreateParent(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Quickly create a parent organization.
            </p>

            <input
              type="text"
              value={newParentName}
              onChange={(e) => setNewParentName(e.target.value)}
              placeholder={`${ORG_TYPES.find(t => t.value === createParentType)?.label || 'Organization'} name...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateParent(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
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
