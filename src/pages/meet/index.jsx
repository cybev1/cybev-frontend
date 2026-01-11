// ============================================
// FILE: src/pages/meet/index.jsx
// PURPOSE: CYBEV Meet - Video Conferencing Dashboard
// Mobile-first design for PlayStore/AppStore
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Users, Plus,
  Calendar, Clock, Copy, Share2, Settings, ChevronRight,
  Monitor, Link as LinkIcon, MoreVertical, Play, History
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function MeetDashboard() {
  const router = useRouter();
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickJoinCode, setQuickJoinCode] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/meet/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setUpcomingMeetings(data.upcoming || []);
        setRecentMeetings(data.recent || []);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const startInstantMeeting = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/meet/instant`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.ok && data.roomId) {
        router.push(`/meet/${data.roomId}`);
      }
    } catch (err) {
      console.error('Error starting meeting:', err);
      alert('Failed to start meeting');
    }
  };

  const joinMeeting = () => {
    if (quickJoinCode.trim()) {
      // Extract room ID from URL or use as-is
      let roomId = quickJoinCode.trim();
      if (roomId.includes('/')) {
        roomId = roomId.split('/').pop();
      }
      router.push(`/meet/${roomId}`);
    }
  };

  const copyMeetingLink = (roomId) => {
    const link = `${window.location.origin}/meet/${roomId}`;
    navigator.clipboard.writeText(link);
    alert('Meeting link copied!');
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return `Today at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout>
      <Head>
        <title>CYBEV Meet | Video Conferencing</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Video className="w-7 h-7 text-purple-600" />
              CYBEV Meet
            </h1>
            <p className="text-gray-500 text-sm">Video conferencing for everyone</p>
          </div>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Start Instant Meeting */}
          <button
            onClick={startInstantMeeting}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl text-white shadow-lg active:scale-95 transition"
          >
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Video className="w-7 h-7" />
            </div>
            <span className="font-semibold">New Meeting</span>
            <span className="text-xs text-white/70 mt-1">Start instantly</span>
          </button>

          {/* Schedule Meeting */}
          <Link
            href="/meet/schedule"
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm active:scale-95 transition"
          >
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Schedule</span>
            <span className="text-xs text-gray-500 mt-1">Plan ahead</span>
          </Link>
        </div>

        {/* Join Meeting Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter meeting code or link"
                value={quickJoinCode}
                onChange={(e) => setQuickJoinCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinMeeting()}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={joinMeeting}
              disabled={!quickJoinCode.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition"
            >
              Join
            </button>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Upcoming
            </h2>
            <Link href="/meet/schedule" className="text-sm text-purple-600 hover:underline">
              + Schedule
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : upcomingMeetings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming meetings</p>
              <Link
                href="/meet/schedule"
                className="inline-flex items-center gap-2 mt-4 text-purple-600 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Schedule a meeting
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map(meeting => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  formatDate={formatDate}
                  onCopy={() => copyMeetingLink(meeting.roomId)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Meetings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-gray-500" />
              Recent
            </h2>
          </div>

          {recentMeetings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <Video className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Your meeting history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentMeetings.slice(0, 5).map(meeting => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{meeting.title || 'Quick Meeting'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(meeting.endedAt || meeting.createdAt).toLocaleDateString()}
                        {meeting.duration && ` • ${Math.round(meeting.duration / 60)} min`}
                      </p>
                    </div>
                  </div>
                  {meeting.recording?.url && (
                    <Link
                      href={meeting.recording.url}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                    >
                      <Play className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Features Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">CYBEV Meet Features</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Up to 100 participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>Screen sharing</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>HD video quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>No time limits</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Meeting Card Component
function MeetingCard({ meeting, formatDate, onCopy }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const isStartingSoon = () => {
    const start = new Date(meeting.schedule?.startTime);
    const now = new Date();
    const diff = start - now;
    return diff > 0 && diff < 15 * 60 * 1000; // Within 15 minutes
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {meeting.title || 'Meeting'}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(meeting.schedule?.startTime || meeting.createdAt)}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-40 z-20">
                  <button
                    onClick={() => { onCopy(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4" /> Copy Link
                  </button>
                  <button
                    onClick={() => { 
                      navigator.share?.({ 
                        title: meeting.title,
                        url: `${window.location.origin}/meet/${meeting.roomId}`
                      });
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {meeting.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {meeting.description}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/meet/${meeting.roomId}`)}
            className={`flex-1 py-2.5 rounded-lg font-medium text-center transition ${
              isStartingSoon()
                ? 'bg-green-600 text-white animate-pulse'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isStartingSoon() ? 'Join Now' : 'Join'}
          </button>
          <button
            onClick={onCopy}
            className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Copy className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {meeting.participants?.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white dark:border-gray-800 flex items-center justify-center"
                >
                  <span className="text-xs text-purple-600 font-medium">
                    {p.name?.[0] || p.email?.[0] || '?'}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''} invited
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
