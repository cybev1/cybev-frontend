// ============================================
// FILE: src/pages/meet/index.jsx
// Meet Dashboard - Video Conferencing
// VERSION: 1.0.0 - NEW FEATURE
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import { Video, Plus, Users, Calendar, Clock, Copy, Check, Loader2, ArrowLeft } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function MeetDashboard() {
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/meet/my-meetings`, getAuth());
      const data = await res.json();
      if (data.meetings) {
        setMeetings(data.meetings);
      }
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/meet/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuth().headers },
        body: JSON.stringify({ title: 'Instant Meeting' })
      });
      const data = await res.json();
      if (data.meeting) {
        router.push(`/meet/${data.meeting.roomId}`);
      } else {
        alert(data.error || 'Failed to create meeting');
      }
    } catch (err) {
      alert('Failed to create meeting');
    } finally {
      setCreating(false);
    }
  };

  const joinMeeting = () => {
    if (!joinCode.trim()) {
      alert('Please enter a meeting code');
      return;
    }
    router.push(`/meet/${joinCode.trim()}`);
  };

  const copyLink = (roomId) => {
    navigator.clipboard.writeText(`https://cybev.io/meet/${roomId}`);
    setCopied(roomId);
    setTimeout(() => setCopied(null), 2000);
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' && new Date(m.scheduledAt) > new Date());
  const recentMeetings = meetings.filter(m => m.status === 'ended' || (m.status === 'scheduled' && new Date(m.scheduledAt) <= new Date()));

  return (
    <AppLayout>
      <Head>
        <title>Meet - CYBEV</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/studio" className="text-purple-600 hover:underline text-sm mb-2 inline-block">
            ← Back to Studio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 mb-2">Meet</h1>
          <p className="text-gray-600 dark:text-gray-500">Start or join video meetings instantly</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* New Meeting */}
          <div className="bg-white dark:bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">New Meeting</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Start an instant video meeting</p>
            <button
              onClick={createMeeting}
              disabled={creating}
              className="w-full py-2.5 bg-purple-600 text-gray-900 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {creating ? 'Creating...' : 'Start Now'}
            </button>
          </div>

          {/* Join Meeting */}
          <div className="bg-white dark:bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">Join Meeting</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Enter a meeting code to join</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                onKeyDown={(e) => e.key === 'Enter' && joinMeeting()}
              />
              <button
                onClick={joinMeeting}
                className="px-4 py-2.5 bg-blue-600 text-gray-900 rounded-lg font-medium hover:bg-blue-700"
              >
                Join
              </button>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white dark:bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">Schedule</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Plan a meeting for later</p>
            <Link href="/meet/schedule">
              <button className="w-full py-2.5 bg-green-600 text-gray-900 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </button>
            </Link>
          </div>
        </div>

        {/* Meetings List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-white dark:bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-200">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-2">No meetings yet</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Start your first meeting or schedule one for later</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming */}
            {upcomingMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-4">Upcoming Meetings</h2>
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting._id} className="bg-white dark:bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Video className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-900">{meeting.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(meeting.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyLink(meeting.roomId)}
                          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
                        >
                          {copied === meeting.roomId ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <Link href={`/meet/${meeting.roomId}`}>
                          <button className="px-4 py-2 bg-purple-600 text-gray-900 rounded-lg text-sm font-medium hover:bg-purple-700">
                            Join
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            {recentMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-4">Recent Meetings</h2>
                <div className="space-y-3">
                  {recentMeetings.slice(0, 5).map((meeting) => (
                    <div key={meeting._id} className="bg-white dark:bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-200 flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Video className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-900">{meeting.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(meeting.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-500 rounded-full text-xs">
                        Ended
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
