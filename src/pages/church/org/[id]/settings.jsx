// ============================================
// FILE: pages/church/org/[id]/settings.jsx
// Organization Settings - Edit, Configure, Manage
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Church, Users, ArrowLeft, Save, Plus, Trash2, X,
  Settings, Globe, Mail, Phone, MapPin, Calendar,
  Image, Palette, Link as LinkIcon, Bell, Shield,
  Clock, Edit, Loader2, Check, AlertCircle, Copy,
  Share2, ExternalLink, QrCode, UserPlus, Building2,
  Facebook, Instagram, Twitter, Youtube
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const colorThemes = [
  { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
  { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
  { id: 'green', name: 'Green', class: 'bg-green-500' },
  { id: 'red', name: 'Red', class: 'bg-red-500' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
  { id: 'pink', name: 'Pink', class: 'bg-pink-500' },
  { id: 'indigo', name: 'Indigo', class: 'bg-indigo-500' },
  { id: 'teal', name: 'Teal', class: 'bg-teal-500' },
];

const days = [
  { id: 'sunday', name: 'Sunday' },
  { id: 'monday', name: 'Monday' },
  { id: 'tuesday', name: 'Tuesday' },
  { id: 'wednesday', name: 'Wednesday' },
  { id: 'thursday', name: 'Thursday' },
  { id: 'friday', name: 'Friday' },
  { id: 'saturday', name: 'Saturday' },
];

const meetingTypes = [
  { id: 'service', name: 'Service' },
  { id: 'prayer', name: 'Prayer Meeting' },
  { id: 'biblestudy', name: 'Bible Study' },
  { id: 'meeting', name: 'Cell Meeting' },
  { id: 'special', name: 'Special Event' },
];

function SettingsSection({ title, description, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, required, icon: Icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        )}
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
        />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
      />
    </div>
  );
}

function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-900">{label}</p>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function OrgSettingsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    motto: '',
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      city: '',
      state: '',
      country: ''
    },
    meetingSchedule: [],
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      website: ''
    },
    settings: {
      isPublic: true,
      allowJoinRequests: true,
      requireApproval: true,
      enableSoulTracker: true,
      enableFoundationSchool: true,
      enableStreaming: true
    },
    colorTheme: 'purple',
    logo: '',
    coverImage: ''
  });

  // Invite link
  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrg();
    }
  }, [id]);

  const fetchOrg = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/church/org/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.ok) {
        setOrg(data.org);
        setForm({
          name: data.org.name || '',
          description: data.org.description || '',
          motto: data.org.motto || '',
          contact: data.org.contact || {
            email: '', phone: '', whatsapp: '', address: '', city: '', state: '', country: ''
          },
          meetingSchedule: data.org.meetingSchedule || [],
          socialLinks: data.org.socialLinks || {
            facebook: '', instagram: '', twitter: '', youtube: '', tiktok: '', website: ''
          },
          settings: data.org.settings || {
            isPublic: true, allowJoinRequests: true, requireApproval: true,
            enableSoulTracker: true, enableFoundationSchool: true, enableStreaming: true
          },
          colorTheme: data.org.colorTheme || 'purple',
          logo: data.org.logo || '',
          coverImage: data.org.coverImage || ''
        });
        // Generate invite link
        setInviteLink(`${window.location.origin}/church/join/${data.org.slug || id}`);
      } else {
        setError(data.error || 'Failed to load organization');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/church/org/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess('Settings saved successfully!');
        setOrg(data.org);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateContact = (field, value) => {
    setForm(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const updateSocialLinks = (field, value) => {
    setForm(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
  };

  const updateSettings = (field, value) => {
    setForm(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  const addSchedule = () => {
    setForm(prev => ({
      ...prev,
      meetingSchedule: [
        ...prev.meetingSchedule,
        { day: 'sunday', time: '10:00 AM', title: '', type: 'service', isOnline: false, streamUrl: '' }
      ]
    }));
  };

  const updateSchedule = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      meetingSchedule: prev.meetingSchedule.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  const removeSchedule = (index) => {
    setForm(prev => ({
      ...prev,
      meetingSchedule: prev.meetingSchedule.filter((_, i) => i !== index)
    }));
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error && !org) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/church">
            <button className="px-6 py-2 bg-purple-600 text-gray-900 rounded-xl">
              Back to Church
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'social', label: 'Social', icon: Share2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'invite', label: 'Invite', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Settings - {org?.name || 'Organization'} | CYBEV</title>
      </Head>

      {/* Header */}
      <div className="bg-white dark:bg-white border-b border-gray-200 dark:border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/church/org/${id}`}>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-xl transition">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-500" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-900">
                  Organization Settings
                </h1>
                <p className="text-sm text-gray-500">{org?.name}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 transition"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(success || error) && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
              <Check className="w-5 h-5" />
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-white rounded-2xl border border-gray-100 dark:border-gray-200 p-2 sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                      activeTab === tab.id
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-600'
                        : 'text-gray-600 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-100/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <SettingsSection
                title="General Information"
                description="Basic details about your organization"
                icon={Church}
              >
                <div className="space-y-4">
                  <InputField
                    label="Organization Name"
                    value={form.name}
                    onChange={(v) => setForm(prev => ({ ...prev, name: v }))}
                    placeholder="Enter organization name"
                    required
                  />
                  <TextArea
                    label="Description"
                    value={form.description}
                    onChange={(v) => setForm(prev => ({ ...prev, description: v }))}
                    placeholder="Brief description of your organization"
                    rows={4}
                  />
                  <InputField
                    label="Motto / Slogan"
                    value={form.motto}
                    onChange={(v) => setForm(prev => ({ ...prev, motto: v }))}
                    placeholder="Your organization's motto"
                  />
                </div>
              </SettingsSection>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <SettingsSection
                title="Contact Information"
                description="How people can reach your organization"
                icon={Phone}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    label="Email"
                    type="email"
                    value={form.contact.email}
                    onChange={(v) => updateContact('email', v)}
                    placeholder="contact@church.org"
                    icon={Mail}
                  />
                  <InputField
                    label="Phone"
                    type="tel"
                    value={form.contact.phone}
                    onChange={(v) => updateContact('phone', v)}
                    placeholder="+1 234 567 8900"
                    icon={Phone}
                  />
                  <InputField
                    label="WhatsApp"
                    type="tel"
                    value={form.contact.whatsapp}
                    onChange={(v) => updateContact('whatsapp', v)}
                    placeholder="+1 234 567 8900"
                  />
                  <InputField
                    label="Website"
                    type="url"
                    value={form.socialLinks.website}
                    onChange={(v) => updateSocialLinks('website', v)}
                    placeholder="https://yourchurch.org"
                    icon={Globe}
                  />
                </div>
                <div className="mt-4 space-y-4">
                  <InputField
                    label="Address"
                    value={form.contact.address}
                    onChange={(v) => updateContact('address', v)}
                    placeholder="Street address"
                    icon={MapPin}
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <InputField
                      label="City"
                      value={form.contact.city}
                      onChange={(v) => updateContact('city', v)}
                      placeholder="City"
                    />
                    <InputField
                      label="State/Province"
                      value={form.contact.state}
                      onChange={(v) => updateContact('state', v)}
                      placeholder="State"
                    />
                    <InputField
                      label="Country"
                      value={form.contact.country}
                      onChange={(v) => updateContact('country', v)}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </SettingsSection>
            )}

            {/* Schedule Settings */}
            {activeTab === 'schedule' && (
              <SettingsSection
                title="Meeting Schedule"
                description="Regular meetings and services"
                icon={Calendar}
              >
                <div className="space-y-4">
                  {form.meetingSchedule.map((schedule, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-100 rounded-xl border border-gray-200 dark:border-gray-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-900">
                          Meeting {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeSchedule(index)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={schedule.title}
                            onChange={(e) => updateSchedule(index, 'title', e.target.value)}
                            placeholder="e.g., Sunday Service"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                            Type
                          </label>
                          <select
                            value={schedule.type}
                            onChange={(e) => updateSchedule(index, 'type', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                          >
                            {meetingTypes.map((type) => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                            Day
                          </label>
                          <select
                            value={schedule.day}
                            onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                          >
                            {days.map((day) => (
                              <option key={day.id} value={day.id}>{day.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                            Time
                          </label>
                          <input
                            type="text"
                            value={schedule.time}
                            onChange={(e) => updateSchedule(index, 'time', e.target.value)}
                            placeholder="10:00 AM"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schedule.isOnline}
                            onChange={(e) => updateSchedule(index, 'isOnline', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-600">Online/Hybrid</span>
                        </label>
                        {schedule.isOnline && (
                          <input
                            type="url"
                            value={schedule.streamUrl}
                            onChange={(e) => updateSchedule(index, 'streamUrl', e.target.value)}
                            placeholder="Stream URL"
                            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSchedule}
                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-300 rounded-xl text-gray-500 hover:text-purple-600 hover:border-purple-500 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Meeting
                  </button>
                </div>
              </SettingsSection>
            )}

            {/* Social Links */}
            {activeTab === 'social' && (
              <SettingsSection
                title="Social Media Links"
                description="Connect your social media accounts"
                icon={Share2}
              >
                <div className="space-y-4">
                  <InputField
                    label="Facebook"
                    value={form.socialLinks.facebook}
                    onChange={(v) => updateSocialLinks('facebook', v)}
                    placeholder="https://facebook.com/yourpage"
                    icon={Facebook}
                  />
                  <InputField
                    label="Instagram"
                    value={form.socialLinks.instagram}
                    onChange={(v) => updateSocialLinks('instagram', v)}
                    placeholder="https://instagram.com/yourpage"
                    icon={Instagram}
                  />
                  <InputField
                    label="Twitter / X"
                    value={form.socialLinks.twitter}
                    onChange={(v) => updateSocialLinks('twitter', v)}
                    placeholder="https://twitter.com/yourpage"
                    icon={Twitter}
                  />
                  <InputField
                    label="YouTube"
                    value={form.socialLinks.youtube}
                    onChange={(v) => updateSocialLinks('youtube', v)}
                    placeholder="https://youtube.com/@yourchannel"
                    icon={Youtube}
                  />
                  <InputField
                    label="TikTok"
                    value={form.socialLinks.tiktok}
                    onChange={(v) => updateSocialLinks('tiktok', v)}
                    placeholder="https://tiktok.com/@yourpage"
                  />
                </div>
              </SettingsSection>
            )}

            {/* Branding */}
            {activeTab === 'branding' && (
              <SettingsSection
                title="Branding"
                description="Customize your organization's appearance"
                icon={Palette}
              >
                <div className="space-y-6">
                  {/* Color Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-3">
                      Color Theme
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, colorTheme: theme.id }))}
                          className={`w-12 h-12 rounded-xl ${theme.class} transition-transform ${
                            form.colorTheme === theme.id
                              ? 'ring-2 ring-offset-2 ring-purple-500 scale-110'
                              : 'hover:scale-105'
                          }`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Logo URL */}
                  <InputField
                    label="Logo URL"
                    value={form.logo}
                    onChange={(v) => setForm(prev => ({ ...prev, logo: v }))}
                    placeholder="https://example.com/logo.png"
                    icon={Image}
                  />

                  {/* Cover Image URL */}
                  <InputField
                    label="Cover Image URL"
                    value={form.coverImage}
                    onChange={(v) => setForm(prev => ({ ...prev, coverImage: v }))}
                    placeholder="https://example.com/cover.jpg"
                    icon={Image}
                  />

                  {/* Preview */}
                  {(form.logo || form.coverImage) && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-3">
                        Preview
                      </label>
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-200">
                        {form.coverImage && (
                          <img
                            src={form.coverImage}
                            alt="Cover"
                            className="w-full h-32 object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        {form.logo && (
                          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-white dark:bg-white p-2 shadow-lg">
                            <img
                              src={form.logo}
                              alt="Logo"
                              className="w-full h-full object-contain"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SettingsSection>
            )}

            {/* Privacy & Features */}
            {activeTab === 'privacy' && (
              <SettingsSection
                title="Privacy & Features"
                description="Control who can access and what features are enabled"
                icon={Shield}
              >
                <div className="divide-y divide-gray-200 dark:divide-gray-200">
                  <ToggleSwitch
                    label="Public Organization"
                    description="Allow anyone to view this organization"
                    checked={form.settings.isPublic}
                    onChange={(v) => updateSettings('isPublic', v)}
                  />
                  <ToggleSwitch
                    label="Allow Join Requests"
                    description="Let people request to join"
                    checked={form.settings.allowJoinRequests}
                    onChange={(v) => updateSettings('allowJoinRequests', v)}
                  />
                  <ToggleSwitch
                    label="Require Approval"
                    description="Manually approve new members"
                    checked={form.settings.requireApproval}
                    onChange={(v) => updateSettings('requireApproval', v)}
                  />
                  <ToggleSwitch
                    label="Soul Tracker"
                    description="Enable soul winning and follow-up tracking"
                    checked={form.settings.enableSoulTracker}
                    onChange={(v) => updateSettings('enableSoulTracker', v)}
                  />
                  <ToggleSwitch
                    label="Foundation School"
                    description="Enable foundation school enrollment"
                    checked={form.settings.enableFoundationSchool}
                    onChange={(v) => updateSettings('enableFoundationSchool', v)}
                  />
                  <ToggleSwitch
                    label="Live Streaming"
                    description="Enable live streaming features"
                    checked={form.settings.enableStreaming}
                    onChange={(v) => updateSettings('enableStreaming', v)}
                  />
                </div>
              </SettingsSection>
            )}

            {/* Invite & Share */}
            {activeTab === 'invite' && (
              <SettingsSection
                title="Invite & Share"
                description="Invite people to join your organization"
                icon={UserPlus}
              >
                <div className="space-y-6">
                  {/* Invite Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                      Invite Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={copyInviteLink}
                        className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-xl flex items-center gap-2 transition"
                      >
                        {linkCopied ? (
                          <>
                            <Check className="w-5 h-5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Share this link to invite people to join your organization
                    </p>
                  </div>

                  {/* QR Code placeholder */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-100 rounded-xl text-center">
                    <QrCode className="w-16 h-16 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-500">
                      QR Code generation coming soon
                    </p>
                  </div>

                  {/* Create Website/Group CTA */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <Link href={`/church/website?orgId=${id}`}>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-lg transition">
                        <Globe className="w-10 h-10 text-purple-600 mb-3" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-900 mb-1">
                          Create Website
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-500">
                          Create a public website for your organization
                        </p>
                      </div>
                    </Link>
                    <Link href={`/groups/create?orgId=${id}&name=${encodeURIComponent(org?.name || '')}`}>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-lg transition">
                        <Users className="w-10 h-10 text-blue-600 mb-3" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-900 mb-1">
                          Create Group
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-500">
                          Create a CYBEV group for your members
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </SettingsSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
