// ============================================
// FILE: src/pages/settings/index.jsx
// CYBEV Settings Page - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  User, Bell, Shield, Globe, Palette, CreditCard, HelpCircle, LogOut, ChevronRight,
  Camera, Loader2, Check, Mail, Lock, Eye, EyeOff, Smartphone, Moon, Sun
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'profile', label: 'Edit Profile', icon: User, description: 'Update your name, bio, and avatar', href: '/settings/profile' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure notification preferences', href: '/settings/notifications' },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield, description: 'Manage your privacy settings' },
  { id: 'domains', label: 'Custom Domains', icon: Globe, description: 'Manage your custom domains', href: '/settings/domains' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and display settings' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Subscription and payment methods' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, description: 'Get help and contact support' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({ name: '', username: '', email: '', bio: '', location: '', website: '' });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/login'); return; }
      const res = await api.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const userData = res.data.user || res.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.put('/api/users/update-profile', formData, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.ok || res.data.success) {
        toast.success('Profile updated!');
        localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cybev_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
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
      <Head><title>Settings | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-2">
              {MENU_ITEMS.map(item => (
                <button key={item.id}
                  onClick={() => item.href ? router.push(item.href) : setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                    activeSection === item.id ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors mt-4">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              {activeSection === 'profile' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Edit Profile</h2>
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.[0] || 'U'
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">@{user?.username}</p>
                    </div>
                  </div>
                  {/* Form */}
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={formData.email} disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
                        placeholder="Tell us about yourself..." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                          placeholder="City, Country" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                          placeholder="https://yoursite.com" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button onClick={handleSave} disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-lg">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === 'appearance' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Appearance</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium text-gray-900">Light Mode</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-500">Dark mode coming soon!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
