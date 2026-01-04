// ============================================
// FILE: src/components/ProfileEditModal.jsx
// Profile Editing Modal with all fields
// ============================================

import { useState, useEffect, useRef } from 'react';
import {
  X, Camera, Loader2, User, Mail, MapPin, Link as LinkIcon,
  Calendar, Briefcase, Globe, Twitter, Instagram, Github,
  Linkedin, Youtube, AtSign, Check
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function ProfileEditModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    occupation: '',
    birthday: '',
    email: '',
    phone: '',
    // Social links
    twitter: '',
    instagram: '',
    linkedin: '',
    github: '',
    youtube: '',
    tiktok: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        occupation: user.occupation || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '',
        email: user.email || '',
        phone: user.phone || '',
        twitter: user.socialLinks?.twitter || user.twitter || '',
        instagram: user.socialLinks?.instagram || user.instagram || '',
        linkedin: user.socialLinks?.linkedin || user.linkedin || '',
        github: user.socialLinks?.github || user.github || '',
        youtube: user.socialLinks?.youtube || user.youtube || '',
        tiktok: user.socialLinks?.tiktok || user.tiktok || ''
      });
      setProfilePreview(user.profilePicture || user.avatar || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check username availability
    if (name === 'username' && value !== user?.username) {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setCheckingUsername(true);
    try {
      const response = await api.get(`/api/users/check-username/${username}`);
      setUsernameAvailable(response.data?.available);
    } catch {
      setUsernameAvailable(null);
    }
    setCheckingUsername(false);
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }
    
    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setProfilePreview(e.target.result);
    reader.readAsDataURL(file);
    
    // Upload
    setUploadingProfile(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/upload/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data?.url) {
        setProfilePreview(response.data.url);
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      toast.error('Failed to upload profile picture');
    }
    setUploadingProfile(false);
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }
    
    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target.result);
    reader.readAsDataURL(file);
    
    // Upload
    setUploadingCover(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/upload/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data?.url) {
        setCoverPreview(response.data.url);
        toast.success('Cover image updated!');
      }
    } catch (error) {
      toast.error('Failed to upload cover image');
    }
    setUploadingCover(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (formData.username !== user?.username && usernameAvailable === false) {
      toast.error('Username is not available');
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      const updateData = {
        name: formData.name.trim(),
        bio: formData.bio?.trim(),
        location: formData.location?.trim(),
        website: formData.website?.trim(),
        occupation: formData.occupation?.trim(),
        birthday: formData.birthday,
        phone: formData.phone?.trim(),
        socialLinks: {
          twitter: formData.twitter?.trim(),
          instagram: formData.instagram?.trim(),
          linkedin: formData.linkedin?.trim(),
          github: formData.github?.trim(),
          youtube: formData.youtube?.trim(),
          tiktok: formData.tiktok?.trim()
        },
        profilePicture: profilePreview,
        coverImage: coverPreview
      };
      
      // Only include username if changed
      if (formData.username !== user?.username && usernameAvailable) {
        updateData.username = formData.username.trim().toLowerCase();
      }
      
      const response = await api.put('/api/users/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.user || response.data?.success) {
        const updatedUser = response.data.user || { ...user, ...updateData };
        
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newUserData = { ...storedUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(newUserData));
        
        toast.success('Profile updated successfully!');
        onUpdate?.(updatedUser);
        onClose();
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'images', label: 'Images', icon: Camera }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-4">
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 border-b-2 font-medium text-sm transition ${
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
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="username"
                    minLength={3}
                  />
                  {checkingUsername && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                  )}
                  {!checkingUsername && usernameAvailable === true && formData.username !== user?.username && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                  {!checkingUsername && usernameAvailable === false && (
                    <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                {usernameAvailable === false && (
                  <p className="text-red-500 text-xs mt-1">Username is already taken</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-400 mt-1">{formData.bio?.length || 0}/160</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="What do you do?"
                  />
                </div>
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter / X
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="@username or full URL"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="@username or full URL"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="LinkedIn profile URL"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="@username or full URL"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="YouTube channel URL"
                  />
                </div>
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                  <input
                    type="text"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="@username or full URL"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div 
                  className="relative h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverPreview && (
                    <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    {uploadingCover ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <div className="text-white text-center">
                        <Camera className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-sm">Change Cover</span>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 1500x500px</p>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div 
                    className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden cursor-pointer group"
                    onClick={() => profileInputRef.current?.click()}
                  >
                    {profilePreview ? (
                      <img src={profilePreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {formData.name?.[0] || 'U'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      {uploadingProfile ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Click to change</p>
                    <p className="text-xs">Square image, at least 200x200px</p>
                  </div>
                </div>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingProfile || uploadingCover}
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
