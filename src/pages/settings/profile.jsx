// ============================================
// FILE: src/pages/settings/profile.jsx
// CYBEV Profile Settings - Facebook-like Full Profile
// VERSION: 1.0
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  User, Camera, Loader2, Check, ChevronLeft, MapPin, Globe, Building2,
  Briefcase, GraduationCap, Heart, Calendar, Phone, Mail, Link as LinkIcon,
  Home, Flag, Languages, Music, Film, Book, Trophy, Quote, Eye, EyeOff,
  Twitter, Instagram, Youtube, Github, Linkedin, Facebook, MessageCircle,
  Plus, X, Save, RefreshCw, Shield, Image as ImageIcon
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Countries list
const COUNTRIES = [
  'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'United States', 'United Kingdom',
  'Canada', 'India', 'Australia', 'Germany', 'France', 'Brazil', 'Mexico',
  'Egypt', 'Tanzania', 'Ethiopia', 'Uganda', 'Cameroon', 'Zimbabwe', 'Zambia',
  'Rwanda', 'Senegal', 'Ivory Coast', 'Angola', 'Mozambique', 'Japan', 'China',
  'South Korea', 'Indonesia', 'Philippines', 'Vietnam', 'Thailand', 'Malaysia',
  'Singapore', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Portugal', 'Poland',
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Switzerland', 'Austria',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Israel', 'Turkey', 'Pakistan',
  'Bangladesh', 'Sri Lanka', 'Nepal', 'Argentina', 'Chile', 'Colombia', 'Peru',
  'Venezuela', 'Ecuador', 'Jamaica', 'Trinidad and Tobago', 'Other'
].sort();

const GENDERS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const RELATIONSHIP_STATUSES = [
  { value: '', label: 'Prefer not to say' },
  { value: 'single', label: 'Single' },
  { value: 'in_relationship', label: 'In a relationship' },
  { value: 'engaged', label: 'Engaged' },
  { value: 'married', label: 'Married' },
  { value: 'complicated', label: "It's complicated" },
  { value: 'open', label: 'In an open relationship' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
  { value: 'divorced', label: 'Divorced' }
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe },
  { value: 'friends', label: 'Friends', icon: User },
  { value: 'only_me', label: 'Only Me', icon: EyeOff }
];

const SOCIAL_PLATFORMS = [
  { key: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@channel' },
  { key: 'tiktok', label: 'TikTok', icon: Music, placeholder: 'https://tiktok.com/@username' },
  { key: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'username#1234' },
  { key: 'telegram', label: 'Telegram', icon: MessageCircle, placeholder: '@username' },
  { key: 'whatsapp', label: 'WhatsApp', icon: Phone, placeholder: '+1234567890' },
  { key: 'website', label: 'Personal Website', icon: Globe, placeholder: 'https://yoursite.com' }
];

// Section component
function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Icon className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <ChevronLeft className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? '-rotate-90' : 'rotate-0'}`} />
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// Input with visibility selector
function PrivateInput({ label, value, onChange, type = 'text', placeholder, visibility, onVisibilityChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {visibility !== undefined && (
          <select value={visibility} onChange={(e) => onVisibilityChange(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-gray-50">
            {VISIBILITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        )}
      </div>
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" />
    </div>
  );
}

export default function ProfileSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    // Basic
    name: '',
    username: '',
    bio: '',
    avatar: '',
    coverImage: '',
    
    // Personal Info
    personalInfo: {
      firstName: '',
      lastName: '',
      middleName: '',
      nickname: '',
      dateOfBirth: '',
      gender: '',
      pronouns: '',
      phone: '',
      alternateEmail: '',
      currentCity: '',
      currentCountry: '',
      hometown: '',
      hometownCountry: '',
      occupation: '',
      company: '',
      jobTitle: '',
      industry: '',
      education: '',
      school: '',
      graduationYear: '',
      relationshipStatus: '',
      interests: [],
      skills: [],
      languages: [],
      aboutMe: '',
      religion: '',
      favoriteQuote: '',
      favoriteMusic: '',
      favoriteMovies: '',
      favoriteBooks: '',
      visibility: {
        dateOfBirth: 'friends',
        phone: 'only_me',
        email: 'friends',
        location: 'public',
        relationshipStatus: 'friends',
        workplace: 'public'
      }
    },
    
    // Social Links
    socialLinks: {
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: '',
      github: '',
      youtube: '',
      tiktok: '',
      discord: '',
      telegram: '',
      whatsapp: '',
      website: ''
    },
    
    // Location
    location: '',
    website: ''
  });

  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  useEffect(() => { fetchUser(); }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }
      
      const res = await api.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const userData = res.data.user || res.data;
      setUser(userData);
      
      // Populate form with existing data
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        avatar: userData.avatar || '',
        coverImage: userData.coverImage || '',
        location: userData.location || '',
        website: userData.website || '',
        personalInfo: {
          firstName: userData.personalInfo?.firstName || userData.name?.split(' ')[0] || '',
          lastName: userData.personalInfo?.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
          middleName: userData.personalInfo?.middleName || '',
          nickname: userData.personalInfo?.nickname || '',
          dateOfBirth: userData.personalInfo?.dateOfBirth ? new Date(userData.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
          gender: userData.personalInfo?.gender || '',
          pronouns: userData.personalInfo?.pronouns || '',
          phone: userData.personalInfo?.phone || '',
          alternateEmail: userData.personalInfo?.alternateEmail || '',
          currentCity: userData.personalInfo?.currentCity || userData.locationData?.providedCity || '',
          currentCountry: userData.personalInfo?.currentCountry || userData.locationData?.providedCountry || '',
          hometown: userData.personalInfo?.hometown || '',
          hometownCountry: userData.personalInfo?.hometownCountry || '',
          occupation: userData.personalInfo?.occupation || '',
          company: userData.personalInfo?.company || '',
          jobTitle: userData.personalInfo?.jobTitle || '',
          industry: userData.personalInfo?.industry || '',
          education: userData.personalInfo?.education || '',
          school: userData.personalInfo?.school || '',
          graduationYear: userData.personalInfo?.graduationYear || '',
          relationshipStatus: userData.personalInfo?.relationshipStatus || '',
          interests: userData.personalInfo?.interests || [],
          skills: userData.personalInfo?.skills || [],
          languages: userData.personalInfo?.languages || [],
          aboutMe: userData.personalInfo?.aboutMe || '',
          religion: userData.personalInfo?.religion || '',
          favoriteQuote: userData.personalInfo?.favoriteQuote || '',
          favoriteMusic: userData.personalInfo?.favoriteMusic || '',
          favoriteMovies: userData.personalInfo?.favoriteMovies || '',
          favoriteBooks: userData.personalInfo?.favoriteBooks || '',
          visibility: userData.personalInfo?.visibility || {
            dateOfBirth: 'friends',
            phone: 'only_me',
            email: 'friends',
            location: 'public',
            relationshipStatus: 'friends',
            workplace: 'public'
          }
        },
        socialLinks: {
          twitter: userData.socialLinks?.twitter || '',
          instagram: userData.socialLinks?.instagram || '',
          facebook: userData.socialLinks?.facebook || '',
          linkedin: userData.socialLinks?.linkedin || '',
          github: userData.socialLinks?.github || '',
          youtube: userData.socialLinks?.youtube || '',
          tiktok: userData.socialLinks?.tiktok || '',
          discord: userData.socialLinks?.discord || '',
          telegram: userData.socialLinks?.telegram || '',
          whatsapp: userData.socialLinks?.whatsapp || '',
          website: userData.socialLinks?.website || userData.website || ''
        }
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateVisibility = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        visibility: { ...prev.personalInfo.visibility, [field]: value }
      }
    }));
  };

  const updateSocialLink = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const addToList = (field, value, setter) => {
    if (!value.trim()) return;
    const currentList = formData.personalInfo[field] || [];
    if (!currentList.includes(value.trim())) {
      updatePersonalInfo(field, [...currentList, value.trim()]);
    }
    setter('');
  };

  const removeFromList = (field, value) => {
    const currentList = formData.personalInfo[field] || [];
    updatePersonalInfo(field, currentList.filter(item => item !== value));
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;
    
    const setUploading = type === 'avatar' ? setUploadingAvatar : setUploadingCover;
    setUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', type);
      
      const res = await api.post('/api/upload', formDataUpload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.url) {
        setFormData(prev => ({ ...prev, [type === 'avatar' ? 'avatar' : 'coverImage']: res.data.url }));
        toast.success(`${type === 'avatar' ? 'Profile picture' : 'Cover image'} uploaded!`);
      }
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Combine first + last name into name
      const fullName = `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim() || formData.name;
      
      // Update location from personal info
      const location = formData.personalInfo.currentCity && formData.personalInfo.currentCountry
        ? `${formData.personalInfo.currentCity}, ${formData.personalInfo.currentCountry}`
        : formData.location;
      
      const updateData = {
        name: fullName,
        username: formData.username,
        bio: formData.bio,
        avatar: formData.avatar,
        coverImage: formData.coverImage,
        location,
        website: formData.socialLinks.website || formData.website,
        personalInfo: formData.personalInfo,
        socialLinks: formData.socialLinks,
        locationData: {
          providedCity: formData.personalInfo.currentCity,
          providedCountry: formData.personalInfo.currentCountry,
          providedLocation: location
        }
      };
      
      const res = await api.put('/api/users/update-profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.ok || res.data.success || res.data.user) {
        toast.success('Profile updated successfully!');
        // Update local storage
        const updatedUser = { ...user, ...updateData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head><title>Edit Profile | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-xl">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-500 text-sm">Manage your public profile information</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 shadow-lg">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>

          {/* Cover & Avatar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500">
              {formData.coverImage && (
                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
              )}
              <button onClick={() => coverInputRef.current?.click()}
                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/50 text-white rounded-xl hover:bg-black/70 transition-colors">
                {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                Edit Cover
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => handleImageUpload(e.target.files[0], 'cover')} />
            </div>
            
            {/* Avatar & Basic Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 -mt-16 relative z-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        formData.name?.[0] || 'U'
                      )}
                    </div>
                  </div>
                  <button onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-1 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 shadow-lg">
                    {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  </button>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'avatar')} />
                </div>
                <div className="text-center sm:text-left mt-4 sm:mt-8">
                  <h2 className="text-xl font-bold text-gray-900">{formData.name || 'Your Name'}</h2>
                  <p className="text-gray-500">@{formData.username}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <Section title="Basic Information" icon={User}>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="First Name" value={formData.personalInfo.firstName}
                    onChange={(v) => updatePersonalInfo('firstName', v)} placeholder="John" />
                  <PrivateInput label="Last Name" value={formData.personalInfo.lastName}
                    onChange={(v) => updatePersonalInfo('lastName', v)} placeholder="Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Nickname" value={formData.personalInfo.nickname}
                    onChange={(v) => updatePersonalInfo('nickname', v)} placeholder="Johnny" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                      <input type="text" value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3} maxLength={500} placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{formData.bio.length}/500 characters</p>
                </div>
              </div>
            </Section>

            {/* Personal Details */}
            <Section title="Personal Details" icon={Heart}>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Date of Birth" type="date" value={formData.personalInfo.dateOfBirth}
                    onChange={(v) => updatePersonalInfo('dateOfBirth', v)}
                    visibility={formData.personalInfo.visibility.dateOfBirth}
                    onVisibilityChange={(v) => updateVisibility('dateOfBirth', v)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select value={formData.personalInfo.gender} onChange={(e) => updatePersonalInfo('gender', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white">
                      {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Pronouns" value={formData.personalInfo.pronouns}
                    onChange={(v) => updatePersonalInfo('pronouns', v)} placeholder="he/him, she/her, they/them" />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Relationship Status</label>
                      <select value={formData.personalInfo.visibility.relationshipStatus}
                        onChange={(e) => updateVisibility('relationshipStatus', e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-gray-50">
                        {VISIBILITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <select value={formData.personalInfo.relationshipStatus}
                      onChange={(e) => updatePersonalInfo('relationshipStatus', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white">
                      {RELATIONSHIP_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </Section>

            {/* Location */}
            <Section title="Places You've Lived" icon={MapPin}>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Home className="w-4 h-4" /> Current Location
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" value={formData.personalInfo.currentCity}
                      onChange={(e) => updatePersonalInfo('currentCity', e.target.value)}
                      placeholder="Lagos" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select value={formData.personalInfo.currentCountry}
                      onChange={(e) => updatePersonalInfo('currentCountry', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white">
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-6">
                  <Flag className="w-4 h-4" /> Hometown
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Hometown City" value={formData.personalInfo.hometown}
                    onChange={(v) => updatePersonalInfo('hometown', v)} placeholder="Your hometown" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hometown Country</label>
                    <select value={formData.personalInfo.hometownCountry}
                      onChange={(e) => updatePersonalInfo('hometownCountry', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white">
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </Section>

            {/* Work & Education */}
            <Section title="Work & Education" icon={Briefcase}>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Work
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Job Title" value={formData.personalInfo.jobTitle}
                    onChange={(v) => updatePersonalInfo('jobTitle', v)} placeholder="Software Engineer" />
                  <PrivateInput label="Company" value={formData.personalInfo.company}
                    onChange={(v) => updatePersonalInfo('company', v)} placeholder="Company name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Industry" value={formData.personalInfo.industry}
                    onChange={(v) => updatePersonalInfo('industry', v)} placeholder="Technology" />
                  <PrivateInput label="Occupation" value={formData.personalInfo.occupation}
                    onChange={(v) => updatePersonalInfo('occupation', v)} placeholder="Your occupation" />
                </div>
                
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-6">
                  <GraduationCap className="w-4 h-4" /> Education
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="School/University" value={formData.personalInfo.school}
                    onChange={(v) => updatePersonalInfo('school', v)} placeholder="University of Lagos" />
                  <PrivateInput label="Degree/Field" value={formData.personalInfo.education}
                    onChange={(v) => updatePersonalInfo('education', v)} placeholder="Computer Science" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Graduation Year" type="number" value={formData.personalInfo.graduationYear}
                    onChange={(v) => updatePersonalInfo('graduationYear', v)} placeholder="2020" />
                </div>
              </div>
            </Section>

            {/* Contact Information */}
            <Section title="Contact Information" icon={Phone}>
              <div className="space-y-4 pt-4">
                <PrivateInput label="Phone Number" type="tel" value={formData.personalInfo.phone}
                  onChange={(v) => updatePersonalInfo('phone', v)} placeholder="+234 xxx xxx xxxx"
                  visibility={formData.personalInfo.visibility.phone}
                  onVisibilityChange={(v) => updateVisibility('phone', v)} />
                <PrivateInput label="Alternate Email" type="email" value={formData.personalInfo.alternateEmail}
                  onChange={(v) => updatePersonalInfo('alternateEmail', v)} placeholder="alternate@email.com"
                  visibility={formData.personalInfo.visibility.email}
                  onVisibilityChange={(v) => updateVisibility('email', v)} />
              </div>
            </Section>

            {/* Interests & Skills */}
            <Section title="Interests & Skills" icon={Trophy}>
              <div className="space-y-4 pt-4">
                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.personalInfo.interests?.map((interest, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {interest}
                        <button onClick={() => removeFromList('interests', interest)} className="hover:text-purple-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('interests', newInterest, setNewInterest))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    <button onClick={() => addToList('interests', newInterest, setNewInterest)}
                      className="px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.personalInfo.skills?.map((skill, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill}
                        <button onClick={() => removeFromList('skills', skill)} className="hover:text-blue-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('skills', newSkill, setNewSkill))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    <button onClick={() => addToList('skills', newSkill, setNewSkill)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.personalInfo.languages?.map((lang, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {lang}
                        <button onClick={() => removeFromList('languages', lang)} className="hover:text-green-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add a language" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('languages', newLanguage, setNewLanguage))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900" />
                    <button onClick={() => addToList('languages', newLanguage, setNewLanguage)}
                      className="px-4 py-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Section>

            {/* Favorites */}
            <Section title="Favorites" icon={Quote} defaultOpen={false}>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Quote</label>
                  <textarea value={formData.personalInfo.favoriteQuote}
                    onChange={(e) => updatePersonalInfo('favoriteQuote', e.target.value)}
                    rows={2} maxLength={500} placeholder="Share your favorite quote..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <PrivateInput label="Favorite Music" value={formData.personalInfo.favoriteMusic}
                    onChange={(v) => updatePersonalInfo('favoriteMusic', v)} placeholder="Artists, genres..." />
                  <PrivateInput label="Favorite Movies" value={formData.personalInfo.favoriteMovies}
                    onChange={(v) => updatePersonalInfo('favoriteMovies', v)} placeholder="Movies, directors..." />
                </div>
                <PrivateInput label="Favorite Books" value={formData.personalInfo.favoriteBooks}
                  onChange={(v) => updatePersonalInfo('favoriteBooks', v)} placeholder="Books, authors..." />
              </div>
            </Section>

            {/* About Me */}
            <Section title="About Me" icon={User} defaultOpen={false}>
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Extended Bio</label>
                <textarea value={formData.personalInfo.aboutMe}
                  onChange={(e) => updatePersonalInfo('aboutMe', e.target.value)}
                  rows={6} maxLength={2000} placeholder="Tell your story in more detail..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none" />
                <p className="text-xs text-gray-400 mt-1">{(formData.personalInfo.aboutMe || '').length}/2000 characters</p>
              </div>
            </Section>

            {/* Social Links */}
            <Section title="Social Links" icon={LinkIcon}>
              <div className="space-y-3 pt-4">
                {SOCIAL_PLATFORMS.map(platform => (
                  <div key={platform.key} className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <platform.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <input type="text" value={formData.socialLinks[platform.key] || ''}
                      onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                      placeholder={platform.placeholder}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900" />
                  </div>
                ))}
              </div>
            </Section>

            {/* Save Button (Bottom) */}
            <div className="flex justify-end pt-4">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 shadow-lg">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
