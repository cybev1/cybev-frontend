// ============================================
// FILE: src/pages/settings/index.jsx
// Settings Page with Theme Selection & Account Linking
// VERSION: 5.0 - Phase 3 Update
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Camera,
  Save,
  Loader2,
  Check,
  X,
  Link2,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSelector } from '@/components/UI/ThemeToggle';

// Social provider icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const SECTIONS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'connections', label: 'Connected Accounts', icon: Link2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
];

export default function Settings() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    email: ''
  });
  
  const [linkedProviders, setLinkedProviders] = useState([]);
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    tips: true,
    marketing: false
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data.ok && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          username: userData.username || '',
          bio: userData.bio || '',
          email: userData.email || ''
        });
        setLinkedProviders(userData.linkedProviders || ['email']);
        if (userData.preferences?.notifications) {
          setNotifications(userData.preferences.notifications);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cybev_token');
    localStorage.removeItem('user');
    localStorage.removeItem('cybev_theme');
    router.push('/auth/login');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/api/user/profile', formData);
      
      if (response.data.ok || response.data.success) {
        localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
        toast.success('Profile updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const response = await api.put('/api/user/preferences', { notifications });
      
      if (response.data.ok || response.data.success) {
        toast.success('Notification preferences saved!');
      }
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.ok || response.data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleLinkProvider = (provider) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
    window.location.href = `${API_URL}/api/auth/${provider}?link=true`;
  };

  const handleUnlinkProvider = async (provider) => {
    if (linkedProviders.length <= 1) {
      toast.error('You need at least one login method');
      return;
    }

    try {
      const response = await api.delete(`/api/auth/unlink/${provider}`);
      
      if (response.data.ok) {
        setLinkedProviders(linkedProviders.filter(p => p !== provider));
        toast.success(`${provider} disconnected`);
      }
    } catch (error) {
      toast.error('Failed to disconnect account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Settings | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                <ChevronRight className="w-5 h-5 rotate-180 text-gray-600 dark:text-gray-400" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <nav className="md:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-l-4 border-purple-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-l-4 border-transparent"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                
                {/* Account Section */}
                {activeSection === 'account' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Settings</h2>
                    
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user?.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 outline-none transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 outline-none transition"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={3}
                          maxLength={500}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 outline-none transition resize-none"
                        />
                        <p className="text-xs text-gray-500 text-right">{formData.bio.length}/500</p>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                )}

                {/* Appearance Section */}
                {activeSection === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance</h2>
                    <p className="text-gray-600 dark:text-gray-400">Choose how CYBEV looks for you</p>
                    
                    <ThemeSelector />
                  </div>
                )}

                {/* Connected Accounts Section */}
                {activeSection === 'connections' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Connected Accounts</h2>
                    <p className="text-gray-600 dark:text-gray-400">Link accounts for faster sign-in</p>
                    
                    <div className="space-y-3">
                      {/* Email */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Email & Password</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                          Connected
                        </span>
                      </div>

                      {/* Google */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-500">
                            <GoogleIcon />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Google</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {linkedProviders.includes('google') ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {linkedProviders.includes('google') ? (
                          <button
                            onClick={() => handleUnlinkProvider('google')}
                            className="px-3 py-1.5 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLinkProvider('google')}
                            className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                          >
                            Connect
                          </button>
                        )}
                      </div>

                      {/* Facebook */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-500">
                            <FacebookIcon />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Facebook</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {linkedProviders.includes('facebook') ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {linkedProviders.includes('facebook') ? (
                          <button
                            onClick={() => handleUnlinkProvider('facebook')}
                            className="px-3 py-1.5 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLinkProvider('facebook')}
                            className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                          >
                            Connect
                          </button>
                        )}
                      </div>

                      {/* Apple */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <AppleIcon />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Apple</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {linkedProviders.includes('apple') ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {linkedProviders.includes('apple') ? (
                          <button
                            onClick={() => handleUnlinkProvider('apple')}
                            className="px-3 py-1.5 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLinkProvider('apple')}
                            className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'likes', label: 'Likes', desc: 'When someone likes your content' },
                        { key: 'comments', label: 'Comments', desc: 'When someone comments on your posts' },
                        { key: 'follows', label: 'New Followers', desc: 'When someone follows you' },
                        { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                        { key: 'messages', label: 'Direct Messages', desc: 'When you receive a new message' },
                        { key: 'tips', label: 'Tips & Donations', desc: 'When you receive tips' },
                        { key: 'marketing', label: 'Marketing Emails', desc: 'Updates about new features' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                            className={`w-12 h-7 rounded-full transition-colors relative ${
                              notifications[item.key] ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                notifications[item.key] ? 'left-6' : 'left-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Preferences
                    </button>
                  </div>
                )}

                {/* Privacy & Security Section */}
                {activeSection === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Privacy & Security</h2>
                    
                    {/* Change Password */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Change Password</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleChangePassword}
                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                        Update Password
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl space-y-4">
                      <h3 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
