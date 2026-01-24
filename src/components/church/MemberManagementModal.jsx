/**
 * ============================================
 * FILE: MemberManagementModal.jsx
 * PATH: cybev-frontend-main/src/components/church/MemberManagementModal.jsx
 * VERSION: 1.0.0 - Comprehensive Member Management
 * UPDATED: 2026-01-24
 * FEATURES:
 *   - Add/Edit member form
 *   - All fields: Title, Personal, Spiritual, Professional
 *   - Foundation School status
 *   - Social media URLs
 *   - Export functionality
 * ============================================
 */

import { useState, useEffect } from 'react';
import {
  X, User, Phone, Mail, MapPin, Briefcase, Heart, BookOpen,
  Calendar, Users, Save, Loader2, ChevronDown, Link as LinkIcon,
  Facebook, Instagram, Twitter, Linkedin, AlertCircle
} from 'lucide-react';

// Title options
const TITLES = [
  { value: 'GO', label: 'General Overseer (GO)' },
  { value: 'Bishop', label: 'Bishop' },
  { value: 'Archbishop', label: 'Archbishop' },
  { value: 'Rev', label: 'Reverend (Rev)' },
  { value: 'Pastor', label: 'Pastor' },
  { value: 'Evangelist', label: 'Evangelist' },
  { value: 'Prophet', label: 'Prophet' },
  { value: 'Apostle', label: 'Apostle' },
  { value: 'Deacon', label: 'Deacon' },
  { value: 'Deaconess', label: 'Deaconess' },
  { value: 'Elder', label: 'Elder' },
  { value: 'Minister', label: 'Minister' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Prof', label: 'Prof' },
  { value: 'Engr', label: 'Engr' },
  { value: 'Barr', label: 'Barr' },
  { value: 'Chief', label: 'Chief' },
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Bro', label: 'Brother (Bro)' },
  { value: 'Sis', label: 'Sister (Sis)' },
  { value: 'custom', label: 'Custom Title...' }
];

const ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'worker', label: 'Worker' },
  { value: 'cell_leader', label: 'Cell Leader' },
  { value: 'fellowship_leader', label: 'Fellowship Leader' },
  { value: 'leader', label: 'Leader' },
  { value: 'assistant_leader', label: 'Assistant Leader' },
  { value: 'associate_pastor', label: 'Associate Pastor' },
  { value: 'pastor', label: 'Pastor' },
  { value: 'admin', label: 'Admin' }
];

const FS_STATUS = [
  { value: 'not_enrolled', label: 'Not Enrolled' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'graduated', label: 'Graduated' }
];

const DEPARTMENTS = [
  'Choir', 'Ushering', 'Protocol', 'Media', 'Technical', 'Children',
  'Youth', 'Women', 'Men', 'Prayer', 'Evangelism', 'Welfare',
  'Follow-up', 'Hospitality', 'Security', 'Cleaning', 'Transport', 'Other'
];

export default function MemberManagementModal({
  isOpen,
  onClose,
  onSave,
  member = null, // null for new, object for edit
  orgId,
  childOrgs = [] // For assigning to cells/fellowships
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Personal
    title: 'Bro',
    customTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    weddingAnniversary: '',
    
    // Address
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    
    // Church Role
    role: 'member',
    department: '',
    localChurch: '',
    cell: '',
    fellowship: '',
    membershipId: '',
    joinedAt: '',
    joinedHow: '',
    previousChurch: '',
    
    // Spiritual
    isSaved: true,
    salvationDate: '',
    baptismDate: '',
    baptismType: 'none',
    foundationSchool: {
      enrolled: false,
      status: 'not_enrolled',
      graduationDate: '',
      batchNumber: ''
    },
    
    // Professional
    profession: '',
    employer: '',
    skills: '',
    
    // Social Media
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      tiktok: '',
      youtube: ''
    },
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    
    // Other
    notes: '',
    tags: '',
    status: 'active'
  });

  // Initialize form with member data if editing
  useEffect(() => {
    if (member) {
      setFormData({
        ...formData,
        ...member,
        address: member.address || formData.address,
        socialMedia: member.socialMedia || formData.socialMedia,
        emergencyContact: member.emergencyContact || formData.emergencyContact,
        foundationSchool: member.foundationSchool || formData.foundationSchool,
        skills: Array.isArray(member.skills) ? member.skills.join(', ') : member.skills || '',
        tags: Array.isArray(member.tags) ? member.tags.join(', ') : member.tags || '',
        dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
        salvationDate: member.salvationDate ? new Date(member.salvationDate).toISOString().split('T')[0] : '',
        baptismDate: member.baptismDate ? new Date(member.baptismDate).toISOString().split('T')[0] : '',
        joinedAt: member.joinedAt ? new Date(member.joinedAt).toISOString().split('T')[0] : '',
        weddingAnniversary: member.weddingAnniversary ? new Date(member.weddingAnniversary).toISOString().split('T')[0] : ''
      });
    } else {
      // Reset form for new member
      setFormData({
        title: 'Bro',
        customTitle: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: '',
        gender: '',
        dateOfBirth: '',
        maritalStatus: '',
        weddingAnniversary: '',
        address: { street: '', city: '', state: '', country: '', postalCode: '' },
        role: 'member',
        department: '',
        localChurch: '',
        cell: '',
        fellowship: '',
        membershipId: '',
        joinedAt: new Date().toISOString().split('T')[0],
        joinedHow: '',
        previousChurch: '',
        isSaved: true,
        salvationDate: '',
        baptismDate: '',
        baptismType: 'none',
        foundationSchool: { enrolled: false, status: 'not_enrolled', graduationDate: '', batchNumber: '' },
        profession: '',
        employer: '',
        skills: '',
        socialMedia: { facebook: '', instagram: '', twitter: '', linkedin: '', tiktok: '', youtube: '' },
        emergencyContact: { name: '', relationship: '', phone: '' },
        notes: '',
        tags: '',
        status: 'active'
      });
    }
    setErrors({});
    setActiveTab('personal');
  }, [member, isOpen]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.phone = 'Phone or email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'church', label: 'Church', icon: Users },
    { id: 'spiritual', label: 'Spiritual', icon: Heart },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'social', label: 'Social', icon: LinkIcon },
    { id: 'other', label: 'Other', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {member ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-3 border-b-2 text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </div>
          )}

          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              {/* Title & Name */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <select
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {TITLES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                {formData.title === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Title</label>
                    <input
                      type="text"
                      value={formData.customTitle}
                      onChange={(e) => handleChange('customTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Enter title"
                    />
                  </div>
                )}
                <div className={formData.title === 'custom' ? '' : 'col-span-2'}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="+234..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="+234..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                {formData.maritalStatus === 'married' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anniversary</label>
                    <input
                      type="date"
                      value={formData.weddingAnniversary}
                      onChange={(e) => handleChange('weddingAnniversary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleChange('address.street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2"
                  placeholder="Street address"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleChange('address.city', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleChange('address.state', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleChange('address.country', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Church Tab */}
          {activeTab === 'church' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {childOrgs.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cell</label>
                    <select
                      value={formData.cell}
                      onChange={(e) => handleChange('cell', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">Select Cell</option>
                      {childOrgs.filter(o => o.type === 'cell').map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fellowship</label>
                    <select
                      value={formData.fellowship}
                      onChange={(e) => handleChange('fellowship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">Select Fellowship</option>
                      {childOrgs.filter(o => o.type === 'fellowship').map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership ID</label>
                  <input
                    type="text"
                    value={formData.membershipId}
                    onChange={(e) => handleChange('membershipId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., MEM-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                  <input
                    type="date"
                    value={formData.joinedAt}
                    onChange={(e) => handleChange('joinedAt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How They Joined</label>
                  <select
                    value={formData.joinedHow}
                    onChange={(e) => handleChange('joinedHow', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="new_convert">New Convert</option>
                    <option value="transfer">Transfer</option>
                    <option value="water_baptism">Water Baptism</option>
                    <option value="invitation">Invitation</option>
                    <option value="walked_in">Walked In</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Church (if transfer)</label>
                <input
                  type="text"
                  value={formData.previousChurch}
                  onChange={(e) => handleChange('previousChurch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Name of previous church"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="transferred">Transferred</option>
                  <option value="deceased">Deceased</option>
                </select>
              </div>
            </div>
          )}

          {/* Spiritual Tab */}
          {activeTab === 'spiritual' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="isSaved"
                    checked={formData.isSaved}
                    onChange={(e) => handleChange('isSaved', e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <label htmlFor="isSaved" className="font-medium text-gray-900">
                    Born Again / Saved
                  </label>
                </div>
                {formData.isSaved && (
                  <div className="ml-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salvation Date</label>
                    <input
                      type="date"
                      value={formData.salvationDate}
                      onChange={(e) => handleChange('salvationDate', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baptism Type</label>
                  <select
                    value={formData.baptismType}
                    onChange={(e) => handleChange('baptismType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="none">Not Baptized</option>
                    <option value="water">Water Baptism</option>
                    <option value="holy_spirit">Holy Spirit Baptism</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                {formData.baptismType !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baptism Date</label>
                    <input
                      type="date"
                      value={formData.baptismDate}
                      onChange={(e) => handleChange('baptismDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Foundation School Section */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Foundation School
                </h4>
                
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="fsEnrolled"
                    checked={formData.foundationSchool.enrolled}
                    onChange={(e) => handleChange('foundationSchool.enrolled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <label htmlFor="fsEnrolled" className="font-medium text-gray-900">
                    Enrolled in Foundation School
                  </label>
                </div>

                {formData.foundationSchool.enrolled && (
                  <div className="grid grid-cols-3 gap-4 ml-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.foundationSchool.status}
                        onChange={(e) => handleChange('foundationSchool.status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      >
                        {FS_STATUS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                      <input
                        type="text"
                        value={formData.foundationSchool.batchNumber}
                        onChange={(e) => handleChange('foundationSchool.batchNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        placeholder="e.g., Batch 5"
                      />
                    </div>
                    {formData.foundationSchool.status === 'graduated' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                        <input
                          type="date"
                          value={formData.foundationSchool.graduationDate}
                          onChange={(e) => handleChange('foundationSchool.graduationDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession/Occupation</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => handleChange('profession', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employer/Company</label>
                  <input
                    type="text"
                    value={formData.employer}
                    onChange={(e) => handleChange('employer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., Google Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Graphics Design, Video Editing, Web Development"
                />
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Facebook className="w-4 h-4 inline mr-1 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleChange('socialMedia.facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Instagram className="w-4 h-4 inline mr-1 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleChange('socialMedia.instagram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Twitter className="w-4 h-4 inline mr-1 text-sky-500" />
                    Twitter/X
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleChange('socialMedia.twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Linkedin className="w-4 h-4 inline mr-1 text-blue-700" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) => handleChange('socialMedia.linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={formData.socialMedia.tiktok}
                    onChange={(e) => handleChange('socialMedia.tiktok', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                  <input
                    type="url"
                    value={formData.socialMedia.youtube}
                    onChange={(e) => handleChange('socialMedia.youtube', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="https://youtube.com/@channel"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other Tab */}
          {activeTab === 'other' && (
            <div className="space-y-4">
              {/* Emergency Contact */}
              <div className="p-4 bg-red-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleChange('emergencyContact.name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleChange('emergencyContact.relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="e.g., Spouse, Parent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleChange('emergencyContact.phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., first_timer, volunteer, choir"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  rows={4}
                  placeholder="Any additional notes about this member..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {member ? 'Update Member' : 'Add Member'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
