// ============================================
// FILE: src/components/Settings/NotificationPreferences.jsx
// Notification Preferences Settings Component
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Bell,
  Mail,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  MessageSquare,
  Coins,
  Newspaper,
  Megaphone,
  Loader2,
  Check,
  X
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Preference item component
function PreferenceToggle({ icon: Icon, label, description, value, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        disabled={disabled}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          value 
            ? 'bg-purple-600' 
            : 'bg-gray-200 dark:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );
}

export default function NotificationPreferences() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    // In-app
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    tips: true,
    // Email
    emailLikes: false,
    emailComments: true,
    emailFollows: true,
    emailMentions: true,
    emailMessages: false,
    emailDigest: true,
    marketing: false
  });

  // Fetch preferences
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/notifications/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key, value) => {
    // Optimistic update
    setPreferences(prev => ({ ...prev, [key]: value }));
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/notifications/preferences`,
        { [key]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Silent success - no toast for individual toggles
    } catch (error) {
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
      toast.error('Failed to update preference');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* In-App Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            In-App Notifications
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-4">
          <PreferenceToggle
            icon={Heart}
            label="Likes"
            description="When someone likes your content"
            value={preferences.likes}
            onChange={(v) => updatePreference('likes', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={MessageCircle}
            label="Comments"
            description="When someone comments on your post"
            value={preferences.comments}
            onChange={(v) => updatePreference('comments', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={UserPlus}
            label="New Followers"
            description="When someone follows you"
            value={preferences.follows}
            onChange={(v) => updatePreference('follows', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={AtSign}
            label="Mentions"
            description="When someone mentions you"
            value={preferences.mentions}
            onChange={(v) => updatePreference('mentions', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={MessageSquare}
            label="Messages"
            description="When you receive a direct message"
            value={preferences.messages}
            onChange={(v) => updatePreference('messages', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={Coins}
            label="Tips & Rewards"
            description="When you receive tips or earn tokens"
            value={preferences.tips}
            onChange={(v) => updatePreference('tips', v)}
            disabled={saving}
          />
        </div>
      </div>

      {/* Email Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Email Notifications
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-4">
          <PreferenceToggle
            icon={Heart}
            label="Likes"
            description="Email when someone likes your content"
            value={preferences.emailLikes}
            onChange={(v) => updatePreference('emailLikes', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={MessageCircle}
            label="Comments"
            description="Email when someone comments"
            value={preferences.emailComments}
            onChange={(v) => updatePreference('emailComments', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={UserPlus}
            label="New Followers"
            description="Email when someone follows you"
            value={preferences.emailFollows}
            onChange={(v) => updatePreference('emailFollows', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={AtSign}
            label="Mentions"
            description="Email when someone mentions you"
            value={preferences.emailMentions}
            onChange={(v) => updatePreference('emailMentions', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={MessageSquare}
            label="Messages"
            description="Email for unread messages"
            value={preferences.emailMessages}
            onChange={(v) => updatePreference('emailMessages', v)}
            disabled={saving}
          />
        </div>
      </div>

      {/* Digest & Marketing */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Digest & Updates
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-4">
          <PreferenceToggle
            icon={Newspaper}
            label="Weekly Digest"
            description="Summary of your weekly activity and stats"
            value={preferences.emailDigest}
            onChange={(v) => updatePreference('emailDigest', v)}
            disabled={saving}
          />
          <PreferenceToggle
            icon={Megaphone}
            label="Product Updates"
            description="News about new features and improvements"
            value={preferences.marketing}
            onChange={(v) => updatePreference('marketing', v)}
            disabled={saving}
          />
        </div>
      </div>

      {/* Save indicator */}
      {saving && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Saving...</span>
        </div>
      )}
    </div>
  );
}
