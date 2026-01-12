// ============================================
// FILE: src/pages/meet/schedule.jsx
// Schedule Meeting Page
// VERSION: 1.0.0 - NEW FEATURE
// ============================================

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import { Calendar, Clock, Users, Video, Loader2, Copy, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function ScheduleMeeting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const scheduleMeeting = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`);
      
      const res = await fetch(`${API_URL}/api/meet/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          scheduledAt: scheduledAt.toISOString(),
          duration: parseInt(formData.duration),
        })
      });

      const data = await res.json();
      
      if (data.meeting) {
        setScheduled(data.meeting);
      } else {
        alert(data.error || 'Failed to schedule meeting');
      }
    } catch (err) {
      alert('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (scheduled) {
      navigator.clipboard.writeText(`https://cybev.io/meet/${scheduled.roomId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <AppLayout>
      <Head>
        <title>Schedule Meeting - CYBEV</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/meet" className="text-purple-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Meet
        </Link>

        {!scheduled ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">Schedule a Meeting</h1>
            <p className="text-gray-600 dark:text-gray-500 mb-8">Plan a video meeting for a specific time</p>

            <form onSubmit={scheduleMeeting} className="bg-white dark:bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-200">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Team Standup"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What's this meeting about?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-gray-900 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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
          </>
        ) : (
          /* Success State */
          <div className="bg-white dark:bg-white rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">Meeting Scheduled!</h2>
            <p className="text-gray-600 dark:text-gray-500 mb-6">{scheduled.title}</p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 dark:text-gray-500">Meeting Link</span>
                <button
                  onClick={copyLink}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-gray-900 dark:text-gray-900 font-mono text-sm break-all">
                https://cybev.io/meet/{scheduled.roomId}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-500 mb-8">
              <Calendar className="w-4 h-4" />
              <span>{new Date(scheduled.scheduledAt).toLocaleString()}</span>
            </div>

            <div className="flex gap-3">
              <Link href="/meet" className="flex-1">
                <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-600 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                  Back to Meet
                </button>
              </Link>
              <Link href={`/meet/${scheduled.roomId}`} className="flex-1">
                <button className="w-full py-3 bg-purple-600 text-gray-900 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" />
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
