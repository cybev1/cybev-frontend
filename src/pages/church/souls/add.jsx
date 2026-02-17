// ============================================
// FILE: src/pages/church/souls/add.jsx
// PURPOSE: Add New Soul with CE Zone & Church Selection
// VERSION: 3.2 - FIXED zone click selection + church cascade
// DEPLOY TO: cybev-frontend-main/src/pages/church/souls/add.jsx
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, User, Phone, Mail,
  MapPin, Heart, MessageSquare, Globe, Building, ChevronDown, Plus, X, Search
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

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

// Salvation types
const SALVATION_TYPES = [
  { value: 'first_time', label: 'First Time Salvation' },
  { value: 'rededication', label: 'Rededication' },
  { value: 'holy_ghost', label: 'Holy Ghost Baptism' },
  { value: 'healing', label: 'Healing Testimony' },
  { value: 'testimony', label: 'General Testimony' }
];

// How they heard options
const HOW_THEY_HEARD = [
  { value: 'rhapsody', label: 'Rhapsody of Realities' },
  { value: 'healing_school', label: 'Healing School' },
  { value: 'healing_streams', label: 'Healing Streams' },
  { value: 'teevo', label: 'Teevo' },
  { value: 'loveworld_tv', label: 'LoveWorld TV' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'friend_family', label: 'Friend/Family' },
  { value: 'crusade', label: 'Crusade/Outreach' },
  { value: 'church_service', label: 'Church Service' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Other' }
];

// Age groups
const AGE_GROUPS = [
  { value: 'child', label: 'Child (0-12)' },
  { value: 'teen', label: 'Teen (13-17)' },
  { value: 'young_adult', label: 'Young Adult (18-25)' },
  { value: 'adult', label: 'Adult (26-45)' },
  { value: 'middle_age', label: 'Middle Age (46-60)' },
  { value: 'senior', label: 'Senior (60+)' }
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

export default function AddSoulPage() {
  const router = useRouter();
  const { orgId, zoneId } = router.query;
  
  // Refs for click outside handling
  const zoneDropdownRef = useRef(null);
  const churchDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    gender: '',
    ageGroup: '',
    address: '',
    city: '',
    state: '',
    country: '',
    salvationType: 'first_time',
    howTheyHeard: '',
    howTheyHeardDetails: '',
    prayerRequest: '',
    notes: '',
    organizationId: orgId || '',
    churchId: '',
    ceZoneId: ''
  });

  // CE Zones state
  const [ceZones, setCeZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [zoneSearch, setZoneSearch] = useState('');
  const [zoneCategory, setZoneCategory] = useState('zone'); // Default to main zones
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);

  // Churches state
  const [churches, setChurches] = useState([]);
  const [filteredChurches, setFilteredChurches] = useState([]);
  const [churchSearch, setChurchSearch] = useState('');
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [showChurchDropdown, setShowChurchDropdown] = useState(false);
  const [loadingChurches, setLoadingChurches] = useState(false);

  // Quick create church modal
  const [showCreateChurch, setShowCreateChurch] = useState(false);
  const [newChurchName, setNewChurchName] = useState('');
  const [creatingChurch, setCreatingChurch] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(event.target)) {
        setShowZoneDropdown(false);
      }
      if (churchDropdownRef.current && !churchDropdownRef.current.contains(event.target)) {
        setShowChurchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCEZones();
    if (orgId) {
      setFormData(prev => ({ ...prev, organizationId: orgId }));
    }
    if (zoneId) {
      setFormData(prev => ({ ...prev, ceZoneId: zoneId }));
    }
  }, [orgId, zoneId]);

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

  // Filter churches when search changes
  useEffect(() => {
    let filtered = [...churches];
    
    if (churchSearch.trim()) {
      const query = churchSearch.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredChurches(filtered);
  }, [churches, churchSearch]);

  // Fetch churches when zone is selected
  useEffect(() => {
    if (selectedZone) {
      fetchChurchesInZone(selectedZone.id);
    } else {
      setChurches([]);
      setFilteredChurches([]);
      setSelectedChurch(null);
    }
  }, [selectedZone]);

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
        // Default filter to main zones
        setFilteredZones(data.zones?.filter(z => z.category === 'zone') || []);
      }
    } catch (err) {
      console.error('Failed to fetch zones:', err);
    } finally {
      setLoadingZones(false);
    }
  };

  const fetchChurchesInZone = async (zoneId) => {
    setLoadingChurches(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch all churches (they may or may not have ceZoneId set yet)
      const res = await fetch(`${API}/api/church/organizations/available-parents?type=church`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        // Filter churches that match this zone OR have no zone set
        const zoneChurches = (data.organizations || []).filter(org => 
          org.ceZone?.id === zoneId || !org.ceZone
        );
        setChurches(zoneChurches);
        setFilteredChurches(zoneChurches);
      }
    } catch (err) {
      console.error('Failed to fetch churches:', err);
    } finally {
      setLoadingChurches(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // FIXED: Zone selection handler
  const handleSelectZone = (zone) => {
    console.log('Selecting zone:', zone);
    setSelectedZone(zone);
    setFormData(prev => ({ ...prev, ceZoneId: zone.id }));
    setShowZoneDropdown(false);
    setZoneSearch('');
    // Reset church selection when zone changes
    setSelectedChurch(null);
    setFormData(prev => ({ ...prev, churchId: '', organizationId: '' }));
  };

  const handleClearZone = () => {
    setSelectedZone(null);
    setFormData(prev => ({ ...prev, ceZoneId: '', churchId: '', organizationId: '' }));
    setSelectedChurch(null);
    setChurches([]);
    setFilteredChurches([]);
  };

  // FIXED: Church selection handler
  const handleSelectChurch = (church) => {
    console.log('Selecting church:', church);
    setSelectedChurch(church);
    setFormData(prev => ({ ...prev, churchId: church._id, organizationId: church._id }));
    setShowChurchDropdown(false);
    setChurchSearch('');
  };

  const handleClearChurch = () => {
    setSelectedChurch(null);
    setFormData(prev => ({ ...prev, churchId: '', organizationId: '' }));
  };

  const createQuickChurch = async () => {
    if (!newChurchName.trim() || !selectedZone) return;
    
    setCreatingChurch(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newChurchName.trim(),
          type: 'church',
          ministry: 'christ_embassy',
          ceZone: {
            id: selectedZone.id,
            name: selectedZone.name,
            category: selectedZone.category
          }
        })
      });

      const data = await res.json();
      if (data.ok) {
        const newChurch = data.org || data.organization;
        // Add to churches list and select it
        setChurches(prev => [newChurch, ...prev]);
        setFilteredChurches(prev => [newChurch, ...prev]);
        handleSelectChurch(newChurch);
        setShowCreateChurch(false);
        setNewChurchName('');
      } else {
        setError(data.error || 'Failed to create church');
      }
    } catch (err) {
      setError('Failed to create church');
    } finally {
      setCreatingChurch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.firstName.trim()) {
      setError('First name is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Build payload with CE Zone data
      const payload = {
        ...formData,
        ceZone: selectedZone ? {
          id: selectedZone.id,
          name: selectedZone.name,
          category: selectedZone.category
        } : null
      };

      const res = await fetch(`${API}/api/church/souls`, {
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
          router.push('/church/souls');
        }, 1500);
      } else {
        setError(data.error || 'Failed to add soul');
      }
    } catch (err) {
      setError('Failed to add soul. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Add Soul | CYBEV Church</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/church/souls" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Soul</h1>
            <p className="text-gray-500">Record a new convert or testimony</p>
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
            <p className="text-green-700">Soul added successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Age Group</option>
                  {AGE_GROUPS.map(age => (
                    <option key={age.value} value={age.value}>{age.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Salvation Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Salvation Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salvation Type</label>
                <select
                  name="salvationType"
                  value={formData.salvationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {SALVATION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How They Heard About Us</label>
                <select
                  name="howTheyHeard"
                  value={formData.howTheyHeard}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Option</option>
                  {HOW_THEY_HEARD.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Assignment - CE Zone & Church */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>
            </div>
            
            {/* CE Zone Selection */}
            <div className="mb-4" ref={zoneDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select CE Zone
              </label>
              
              {selectedZone ? (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-600" />
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
              ) : (
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="👆 Click here to select a zone..."
                        value={zoneSearch}
                        onChange={(e) => setZoneSearch(e.target.value)}
                        onFocus={() => setShowZoneDropdown(true)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>
                    <select
                      value={zoneCategory}
                      onChange={(e) => setZoneCategory(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {ZONE_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {showZoneDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {loadingZones ? (
                        <div className="p-4 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                        </div>
                      ) : filteredZones.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No zones found
                        </div>
                      ) : (
                        filteredZones.map(zone => (
                          <div
                            key={zone.id}
                            onClick={() => handleSelectZone(zone)}
                            className="w-full p-3 text-left hover:bg-purple-50 flex items-center gap-3 border-b border-gray-100 last:border-0 cursor-pointer"
                          >
                            <Globe className="w-4 h-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{zone.name}</p>
                              <p className="text-xs text-gray-500">{getCategoryLabel(zone.category)}</p>
                            </div>
                            {selectedZone?.id === zone.id && (
                              <CheckCircle className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {filteredZones.length} zones available
              </p>
            </div>

            {/* Church Selection - Only visible when zone is selected */}
            {selectedZone && (
              <div className="mt-4" ref={churchDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Church <span className="text-gray-400">(Optional - or create new)</span>
                </label>
                
                {selectedChurch ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">{selectedChurch.name}</p>
                        {selectedChurch.leaderName && (
                          <p className="text-sm text-blue-600">
                            {selectedChurch.leaderTitle || ''} {selectedChurch.leaderName}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearChurch}
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      <X className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="👆 Click to select or search church..."
                          value={churchSearch}
                          onChange={(e) => setChurchSearch(e.target.value)}
                          onFocus={() => setShowChurchDropdown(true)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCreateChurch(true)}
                        className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Create Church</span>
                      </button>
                    </div>
                    
                    {showChurchDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {loadingChurches ? (
                          <div className="p-4 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                          </div>
                        ) : filteredChurches.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <p>No churches found</p>
                            <button
                              type="button"
                              onClick={() => {
                                setShowChurchDropdown(false);
                                setShowCreateChurch(true);
                              }}
                              className="mt-2 text-purple-600 hover:underline flex items-center justify-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Create a new church
                            </button>
                          </div>
                        ) : (
                          filteredChurches.map(church => (
                            <div
                              key={church._id}
                              onClick={() => handleSelectChurch(church)}
                              className="w-full p-3 text-left hover:bg-blue-50 flex items-center gap-3 border-b border-gray-100 last:border-0 cursor-pointer"
                            >
                              <Building className="w-4 h-4 text-gray-400" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{church.name}</p>
                                {church.leaderName && (
                                  <p className="text-xs text-gray-500">
                                    {church.leaderTitle || ''} {church.leaderName}
                                  </p>
                                )}
                              </div>
                              {selectedChurch?._id === church._id && (
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {churches.length} churches in {selectedZone.name}
                </p>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Additional Notes</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes about this person..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Request</label>
                <textarea
                  name="prayerRequest"
                  value={formData.prayerRequest}
                  onChange={handleChange}
                  placeholder="Any prayer requests..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/church/souls"
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        {/* Quick Create Church Modal */}
        {showCreateChurch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Quick Create Church</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateChurch(false);
                    setNewChurchName('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Create a new church in <strong className="text-purple-600">{selectedZone?.name}</strong>
              </p>
              <input
                type="text"
                value={newChurchName}
                onChange={(e) => setNewChurchName(e.target.value)}
                placeholder="Enter church name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateChurch(false);
                    setNewChurchName('');
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createQuickChurch}
                  disabled={!newChurchName.trim() || creatingChurch}
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creatingChurch ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create Church
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
