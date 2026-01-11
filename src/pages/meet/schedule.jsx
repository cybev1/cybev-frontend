// ============================================
// FILE: src/pages/meet/schedule.jsx
// PURPOSE: Schedule Meeting Page - Mobile Optimized
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, Clock, Users, Video, Lock,
  Globe, Copy, Mail, Plus, X, Check, Settings,
  Mic, MicOff, VideoOff, Link as LinkIcon
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function ScheduleMeeting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '09:00',
    duration: '60',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    participants: [],
    settings: {
      waitingRoom: false,
      requirePassword: false,
      password: '',
      muteOnEntry: false,
      videoOnEntry: true,
      allowRecording: true
    }
  });
  const [newParticipant, setNewParticipant] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date) {
      alert('Please fill in the meeting title and date');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const startTime = new Date(`${formData.date}T${formData.startTime}`);
      const endTime = new Date(startTime.getTime() + parseInt(formData.duration) * 60000);

      const res = await fetch(`${API}/api/meet/schedule`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          timezone: formData.timezone,
          participants: formData.participants.map(email => ({ email })),
          settings: formData.settings
        })
      });

      const data = await res.json();
      
      if (data.ok) {
        // Show success and copy link
        const link = `${window.location.origin}/meet/${data.roomId}`;
        await navigator.clipboard.writeText(link);
        alert(`Meeting scheduled! Link copied to clipboard:\n${link}`);
        router.push('/meet');
      } else {
        alert(data.error || 'Failed to schedule meeting');
      }
    } catch (err) {
      console.error('Schedule meeting error:', err);
      alert('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = () => {
    if (newParticipant && newParticipant.includes('@')) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant]
      }));
      setNewParticipant('');
    }
  };

  const removeParticipant = (email) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== email)
    }));
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <AppLayout>
      <Head>
        <title>Schedule Meeting | CYBEV Meet</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Schedule Meeting
            </h1>
            <p className="text-sm text-gray-500">Plan your video call</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              Meeting Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Weekly Team Standup"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's this meeting about?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Date & Time
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={today}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="Africa/Accra">Africa/Accra (GMT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Invite Participants <span className="text-gray-400 font-normal text-sm">(optional)</span>
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="email"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                placeholder="Enter email address"
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={addParticipant}
                className="px-4 py-3 bg-purple-600 text-white rounded-xl"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.participants.length > 0 && (
              <div className="space-y-2">
                {formData.participants.map((email, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeParticipant(email)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.participants.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                You can share the meeting link after scheduling
              </p>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Advanced Settings</span>
              </div>
              <div className={`transform transition ${showAdvanced ? 'rotate-180' : ''}`}>
                ▼
              </div>
            </button>

            {showAdvanced && (
              <div className="p-4 pt-0 space-y-4 border-t border-gray-100 dark:border-gray-700">
                {/* Waiting Room */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Waiting Room</p>
                      <p className="text-xs text-gray-500">Approve participants before they join</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={formData.settings.waitingRoom}
                    onChange={(v) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, waitingRoom: v }
                    }))}
                  />
                </div>

                {/* Mute on Entry */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MicOff className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Mute on Entry</p>
                      <p className="text-xs text-gray-500">Participants join muted</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={formData.settings.muteOnEntry}
                    onChange={(v) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, muteOnEntry: v }
                    }))}
                  />
                </div>

                {/* Video on Entry */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <VideoOff className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Video on Entry</p>
                      <p className="text-xs text-gray-500">Participants join with video on</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={formData.settings.videoOnEntry}
                    onChange={(v) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, videoOnEntry: v }
                    }))}
                  />
                </div>

                {/* Allow Recording */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Allow Recording</p>
                      <p className="text-xs text-gray-500">Host can record the meeting</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={formData.settings.allowRecording}
                    onChange={(v) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, allowRecording: v }
                    }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.date}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Schedule Meeting
              </>
            )}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition ${
        enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
