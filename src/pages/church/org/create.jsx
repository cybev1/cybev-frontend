// ============================================
// FILE: src/pages/church/org/create.jsx
// PURPOSE: Create New Organization with Ministry Selection & CE Zones
// VERSION: 3.2 - FIXED zone selection + proper category labels
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
  { value: 'mvp', label: 'MVP Zones' },
  { value: 'ism', label: 'ISM Zones' },
  { value: 'digital', label: 'Digital Zones' },
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

// Helper to get proper category label
const getCategoryLabel = (category) => {
  switch(category) {
    case 'zone': return 'Main Zone';
    case 'blw': return 'BLW Zone';
    case 'ism': return 'ISM Zone';
    case 'mvp': return 'MVP Zone';
    case 'ministry': return 'Ministry Zone';
    case 'digital': return 'Digital Zone';
    case 'department': return 'Department';
    default: return category;
  }
};

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
      console.error('Failed to fetch zones:', err);
    } finally {
      setLoadingZones(false);
    }
  };

  const fetchOrganizations = async () => {
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
      console.error('Failed to fetch organizations:', err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // FIXED: Zone selection handler
  const handleSelectZone = (zone) => {
    console.log('Selecting zone:', zone);
    setSelectedZone(zone);
    setFormData(prev => ({ ...prev, ceZoneId: zone.id }));
  };

  // FIXED: Clear zone selection
  const handleClearZone = () => {
    setSelectedZone(null);
    setFormData(prev => ({ ...prev, ceZoneId: '' }));
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
      setError('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validation for each step
      if (currentStep === 1 && formData.ministry === 'others' && !formData.customMinistry.trim()) {
        setError('Please enter your ministry/denomination name');
        return;
      }
      if (currentStep === 2 && formData.ministry === 'christ_embassy' && !selectedZone) {
        setError('Please select a CE Zone');
        return;
      }
      setError('');
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setError('');
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.ministry && (formData.ministry !== 'others' || formData.customMinistry.trim());
      case 2: return formData.ministry !== 'christ_embassy' || selectedZone;
      case 3: return formData.type;
      case 4: return formData.name.trim();
      case 5: return true;
      default: return true;
    }
  };

  // Get available parent organizations based on selected type
  const getAvailableParents = () => {
    const hierarchy = { zone: 0, church: 1, fellowship: 2, cell: 3, biblestudy: 4 };
    const currentLevel = hierarchy[formData.type] || 1;
    
    // Filter orgs that can be parents (lower level number = higher in hierarchy)
    let parents = allOrgs.filter(org => {
      const orgLevel = hierarchy[org.type] || 0;
      return orgLevel < currentLevel;
    });

    // If CE zone is selected, prioritize orgs from that zone
    if (selectedZone) {
      parents = parents.filter(org => 
        org.ceZone?.id === selectedZone.id || !org.ceZone
      );
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
                        placeholder="🔍 Type to search or scroll to select zone..."
                        value={zoneSearch}
                        onChange={(e) => setZoneSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
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
                          <p className="text-sm text-purple-600">{getCategoryLabel(selectedZone.category)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearZone}
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
                          <div
                            key={zone.id}
                            onClick={() => handleSelectZone(zone)}
                            className={`w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                              selectedZone?.id === zone.id ? 'bg-purple-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Globe className={`w-5 h-5 ${
                                selectedZone?.id === zone.id ? 'text-purple-600' : 'text-gray-400'
                              }`} />
                              <div>
                                <p className="font-medium text-gray-900">{zone.name}</p>
                                <p className="text-xs text-gray-500">{getCategoryLabel(zone.category)}</p>
                              </div>
                            </div>
                            {selectedZone?.id === zone.id && (
                              <CheckCircle className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
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
              
              <div className="space-y-3">
                {ORG_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      formData.type === type.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      {formData.type === type.value && (
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Parent Organization Selection */}
              {formData.type !== 'church' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Organization <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">No Parent (Independent)</option>
                    {getAvailableParents().map(org => (
                      <option key={org._id} value={org._id}>
                        {org.name} ({org.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Basic Details */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Organization Details</h2>
              <p className="text-gray-500 text-sm mb-6">Enter the basic information</p>
              
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
                    placeholder={`e.g., Christ Embassy ${formData.contact.city || 'Lagos'}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leader Title</label>
                    <select
                      name="leaderTitle"
                      value={formData.leaderTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Title</option>
                      <option value="Pastor">Pastor</option>
                      <option value="Deacon">Deacon</option>
                      <option value="Deaconess">Deaconess</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Elder">Elder</option>
                      <option value="Reverend">Reverend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leader Name</label>
                    <input
                      type="text"
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleChange}
                      placeholder="Leader's full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your organization..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motto</label>
                  <input
                    type="text"
                    name="motto"
                    value={formData.motto}
                    onChange={handleChange}
                    placeholder="Organization motto or slogan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_THEMES.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, colorTheme: color.value }))}
                        className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-transform ${
                          formData.colorTheme === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                        }`}
                        title={color.label}
                      >
                        {formData.colorTheme === color.value && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </button>
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
              <p className="text-gray-500 text-sm mb-6">Add contact details (optional)</p>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="contact.email"
                      value={formData.contact.email}
                      onChange={handleChange}
                      placeholder="contact@church.com"
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
                      placeholder="+234 xxx xxxx"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {formData.ministry === 'christ_embassy' && (
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

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Ministry:</span> {formData.ministry === 'christ_embassy' ? 'Christ Embassy' : formData.customMinistry}</p>
                  {selectedZone && <p><span className="font-medium">Zone:</span> {selectedZone.name}</p>}
                  <p><span className="font-medium">Type:</span> {selectedType?.label}</p>
                  <p><span className="font-medium">Name:</span> {formData.name || 'Not set'}</p>
                  {formData.leaderName && <p><span className="font-medium">Leader:</span> {formData.leaderTitle} {formData.leaderName}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || success || !formData.name.trim()}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
