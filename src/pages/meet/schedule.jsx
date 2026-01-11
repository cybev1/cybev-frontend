// ============================================
// FILE: schedule.jsx
// PATH: cybev-frontend/src/pages/meet/schedule.jsx
// PURPOSE: Schedule a CYBEV Meet
// VERSION: 1.0.0
// GITHUB: https://github.com/cybev1/cybev-frontend
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft, Calendar, Clock, Users, Copy, Mail, Check, Loader2 } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function ScheduleMeeting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '10:00',
    duration: 60,
    participants: '',
    waitingRoom: false,
    muteOnEntry: false
  });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert('Please enter title and date');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const startTime = new Date(`${form.date}T${form.startTime}`);
      const endTime = new Date(startTime.getTime() + form.duration * 60000);

      const participants = form.participants
        .split(',')
        .map(e => e.trim())
        .filter(Boolean)
        .map(email => ({ email }));

      const res = await fetch(`${API}/api/meet/schedule`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          participants,
          settings: {
            waitingRoom: form.waitingRoom,
            muteOnEntry: form.muteOnEntry
          }
        })
      });

      const data = await res.json();
      if (data.ok) {
        setCreated(data);
      } else {
        alert(data.error || 'Failed to schedule');
      }
    } catch (err) {
      alert('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(created?.joinUrl || '');
    alert('Link copied!');
  };

  if (created) {
    return (
      <AppLayout>
        <Head><title>Meeting Scheduled | CYBEV Meet</title></Head>
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Meeting Scheduled!</h1>
            <p className="text-gray-500">{created.meeting?.title}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-gray-900 dark:text-white">
                {new Date(created.meeting?.schedule?.startTime).toLocaleString()}
              </span>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-4">
              <p className="text-sm text-gray-500 mb-1">Meeting Link</p>
              <p className="text-purple-600 break-all">{created.joinUrl}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium">
                <Copy className="w-5 h-5" /> Copy Link
              </button>
              <button onClick={() => router.push('/meet')}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium">
                Done
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head><title>Schedule Meeting | CYBEV Meet</title></Head>
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Schedule Meeting</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meeting Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Team Standup"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional meeting description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
            <select value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-1" /> Invite Participants (optional)
            </label>
            <textarea value={form.participants} onChange={(e) => setForm(f => ({ ...f, participants: e.target.value }))}
              placeholder="Enter emails separated by commas"
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.waitingRoom} onChange={(e) => setForm(f => ({ ...f, waitingRoom: e.target.checked }))}
                className="w-5 h-5 accent-purple-600" />
              <span className="text-gray-700 dark:text-gray-300">Enable waiting room</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.muteOnEntry} onChange={(e) => setForm(f => ({ ...f, muteOnEntry: e.target.checked }))}
                className="w-5 h-5 accent-purple-600" />
              <span className="text-gray-700 dark:text-gray-300">Mute participants on entry</span>
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
