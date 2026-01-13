// ============================================
// FILE: src/pages/settings/index.jsx
// CYBEV Settings Page - Clean White Design v8.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  User, Bell, Shield, Globe, Palette, CreditCard, HelpCircle, LogOut, ChevronRight,
  Camera, Loader2, Check, Mail, Lock, Eye, EyeOff, Smartphone, Moon, Sun,
  Key, Trash2, Download, AlertTriangle, MessageCircle, FileText, ExternalLink
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
  const [activeSection, setActiveSection] = useState('privacy');
  const [formData, setFormData] = useState({ name: '', username: '', email: '', bio: '', location: '', website: '' });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    allowTagging: true,
    showOnlineStatus: true,
    showActivity: true
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true
  });

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
      if (userData.preferences) {
        setPrivacySettings(prev => ({
          ...prev,
          ...userData.preferences.privacy
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await api.put('/api/users/preferences', { privacy: privacySettings }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Privacy settings updated!');
    } catch (err) {
      toast.error('Failed to update settings');
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

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirm1) return;
    const confirm2 = window.prompt('Type DELETE to confirm:');
    if (confirm2 !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }
    toast.info('Account deletion feature coming soon. Please contact support.');
  };

  const handleExportData = async () => {
    toast.info('Preparing your data export...');
    try {
      const token = localStorage.getItem('token');
      // For now, just show a message - implement actual export later
      toast.success('Data export will be sent to your email within 24 hours.');
    } catch {
      toast.error('Failed to request data export');
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
              {/* Privacy & Security */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" /> Privacy Settings
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Profile Visibility</p>
                          <p className="text-sm text-gray-500">Who can see your profile</p>
                        </div>
                        <select value={privacySettings.profileVisibility}
                          onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                          <option value="public">Public</option>
                          <option value="followers">Followers Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      
                      {[
                        { key: 'showEmail', label: 'Show Email', desc: 'Display your email on your profile' },
                        { key: 'showLocation', label: 'Show Location', desc: 'Display your location on your profile' },
                        { key: 'allowMessages', label: 'Allow Messages', desc: 'Let others send you direct messages' },
                        { key: 'allowTagging', label: 'Allow Tagging', desc: 'Let others tag you in posts' },
                        { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Let others see when you are online' },
                        { key: 'showActivity', label: 'Show Activity', desc: 'Let others see your recent activity' }
                      ].map(setting => (
                        <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">{setting.label}</p>
                            <p className="text-sm text-gray-500">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={privacySettings[setting.key]}
                              onChange={(e) => setPrivacySettings({...privacySettings, [setting.key]: e.target.checked})}
                              className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleSavePrivacy} disabled={saving}
                      className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save Privacy Settings
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Key className="w-5 h-5 text-purple-600" /> Security
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                          Coming Soon
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Login Alerts</p>
                          <p className="text-sm text-gray-500">Get notified of new logins</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={securitySettings.loginAlerts}
                            onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})}
                            className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-500">Update your password</p>
                        </div>
                        <button onClick={() => router.push('/auth/reset-password')}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                    <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Danger Zone
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Export Your Data</p>
                          <p className="text-sm text-gray-500">Download all your data</p>
                        </div>
                        <button onClick={handleExportData}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Download className="w-4 h-4" /> Export
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-red-600">Delete Account</p>
                          <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                        </div>
                        <button onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeSection === 'appearance' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" /> Appearance
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium text-gray-900">Light Mode</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl opacity-50">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-gray-900">Dark Mode</span>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">Coming Soon</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing */}
              {activeSection === 'billing' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-600" /> Your Plan
                    </h2>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
                      <p className="text-sm opacity-80">Current Plan</p>
                      <h3 className="text-2xl font-bold">Free</h3>
                      <p className="text-sm mt-2 opacity-80">Basic features included</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" /> Unlimited posts
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" /> Basic analytics
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" /> Community support
                      </div>
                    </div>
                    <button className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90">
                      Upgrade to Pro - Coming Soon
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h2>
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No payment methods added</p>
                      <button className="mt-4 px-6 py-2 border border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50">
                        Add Payment Method
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Billing History</h2>
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No billing history yet</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Help & Support */}
              {activeSection === 'help' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-purple-600" /> Help & Support
                    </h2>
                    <div className="space-y-4">
                      <a href="https://docs.cybev.io" target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Documentation</p>
                            <p className="text-sm text-gray-500">Learn how to use CYBEV</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                      
                      <a href="mailto:support@cybev.io"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email Support</p>
                            <p className="text-sm text-gray-500">support@cybev.io</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                      
                      <a href="https://twitter.com/cybev_io" target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Twitter / X</p>
                            <p className="text-sm text-gray-500">@cybev_io</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {[
                        { q: 'How do I verify my email?', a: 'Check your inbox for a verification email and click the link.' },
                        { q: 'How do I earn tokens?', a: 'Create content, engage with posts, and complete daily activities.' },
                        { q: 'How do I connect my wallet?', a: 'Go to the Wallet page and click "Connect Wallet" to link your crypto wallet.' },
                        { q: 'How do I delete my account?', a: 'Go to Privacy & Security settings and scroll to the Danger Zone section.' }
                      ].map((faq, i) => (
                        <details key={i} className="group">
                          <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                            <span className="font-medium text-gray-900">{faq.q}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                          </summary>
                          <p className="p-4 text-gray-600 text-sm">{faq.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 text-center">
                    <p className="text-gray-500 text-sm">CYBEV v1.0.0</p>
                    <p className="text-gray-400 text-xs mt-1">© 2025 CYBEV. All rights reserved.</p>
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
