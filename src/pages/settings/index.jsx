// ============================================
// FILE: src/pages/settings/index.jsx
// PATH: cybev-frontend/src/pages/settings/index.jsx
// PURPOSE: Main settings page with all user preferences
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Smartphone,
  Eye,
  Moon,
  Sun,
  Wallet,
  Link as LinkIcon,
  Trash2,
  Camera,
  Save
} from 'lucide-react';
import api from '@/lib/api';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    email: ''
  });
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    tips: true,
    marketing: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          username: parsedUser.username || '',
          bio: parsedUser.bio || '',
          email: parsedUser.email || ''
        });
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cybev_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        // Update localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const settingsSections = [
    { id: 'account', label: 'Account', icon: User, description: 'Manage your account details' },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, description: 'Control your privacy settings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage notification preferences' },
    { id: 'domain', label: 'Custom Domain', icon: Globe, description: 'Set up your custom domain', link: '/settings/domain' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize how CYBEV looks' },
    { id: 'wallet', label: 'Wallet & Payments', icon: Wallet, description: 'Manage your CYBEV tokens' },
    { id: 'connections', label: 'Connected Accounts', icon: LinkIcon, description: 'Manage linked social accounts' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, description: 'Get help with CYBEV' }
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Settings - CYBEV</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account and preferences</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name || 'User'}</p>
                    <p className="text-gray-400 text-sm">@{user?.username || 'username'}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {settingsSections.map((section) => (
                  section.link ? (
                    <Link key={section.id} href={section.link}>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-purple-500/10 hover:text-white transition-all">
                        <section.icon className="w-5 h-5" />
                        <span>{section.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span>{section.label}</span>
                    </button>
                  )
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
              
              {/* Account Settings */}
              {activeSection === 'account' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Display Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Email</label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="flex-1 bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-3 text-gray-400"
                        />
                        {user?.isEmailVerified ? (
                          <span className="px-4 py-3 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center">
                            <Shield className="w-4 h-4 mr-2" /> Verified
                          </span>
                        ) : (
                          <button className="px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30">
                            Verify
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Bio</label>
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="w-full bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none resize-none"
                      />
                    </div>

                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Private Profile</p>
                        <p className="text-gray-400 text-sm">Only approved followers can see your posts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Change Password</p>
                        <p className="text-gray-400 text-sm">Update your password regularly</p>
                      </div>
                      <button className="px-4 py-2 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10">
                        Change
                      </button>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <p className="text-red-400 font-medium">Delete Account</p>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">Permanently delete your account and all data. This action cannot be undone.</p>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {Object.entries({
                      likes: { label: 'Likes', desc: 'When someone likes your content' },
                      comments: { label: 'Comments', desc: 'When someone comments on your content' },
                      follows: { label: 'New Followers', desc: 'When someone follows you' },
                      mentions: { label: 'Mentions', desc: 'When someone mentions you' },
                      messages: { label: 'Messages', desc: 'When you receive a direct message' },
                      tips: { label: 'Tips & Earnings', desc: 'When you receive tips or earnings' },
                      marketing: { label: 'Marketing Emails', desc: 'News, updates, and promotions' }
                    }).map(([key, item]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notifications[key]}
                            onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeSection === 'appearance' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Appearance</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-white font-medium mb-4">Theme</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setDarkMode(true)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            darkMode ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <Moon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-white">Dark Mode</p>
                        </button>
                        <button
                          onClick={() => setDarkMode(false)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            !darkMode ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                          <p className="text-white">Light Mode</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Settings */}
              {activeSection === 'wallet' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Wallet & Payments</h2>
                  
                  <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 mb-6">
                    <p className="text-gray-400 text-sm mb-2">CYBEV Token Balance</p>
                    <p className="text-4xl font-bold text-white">0 CYBEV</p>
                    <p className="text-gray-400 text-sm mt-2">≈ $0.00 USD</p>
                  </div>

                  <div className="space-y-4">
                    <Link href="/wallet">
                      <button className="w-full flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-purple-400" />
                          <span className="text-white">Go to Wallet</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Connected Accounts */}
              {activeSection === 'connections' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Connected Accounts</h2>
                  <p className="text-gray-400 mb-6">Connect your social accounts to enable cross-posting and analytics.</p>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Facebook', color: 'bg-blue-600', icon: 'F' },
                      { name: 'Instagram', color: 'bg-gradient-to-r from-purple-600 to-pink-600', icon: 'IG' },
                      { name: 'YouTube', color: 'bg-red-600', icon: 'YT' },
                      { name: 'TikTok', color: 'bg-black border border-gray-700', icon: 'TT' },
                      { name: 'X (Twitter)', color: 'bg-gray-800', icon: 'X' },
                      { name: 'KingsChat', color: 'bg-yellow-600', icon: 'KC' }
                    ].map((account) => (
                      <div key={account.name} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                            {account.icon}
                          </div>
                          <span className="text-white">{account.name}</span>
                        </div>
                        <button className="px-4 py-2 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help & Support */}
              {activeSection === 'help' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Help & Support</h2>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Help Center', desc: 'Browse FAQs and guides' },
                      { title: 'Contact Support', desc: 'Get help from our team' },
                      { title: 'Terms of Service', desc: 'Read our terms' },
                      { title: 'Privacy Policy', desc: 'Read our privacy policy' }
                    ].map((item) => (
                      <button key={item.title} className="w-full text-left p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </button>
                    ))}
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
