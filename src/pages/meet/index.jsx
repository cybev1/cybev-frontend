// ============================================
// FILE: index.jsx
// PATH: cybev-frontend/src/pages/meet/index.jsx
// PURPOSE: CYBEV Meet Dashboard
// VERSION: 1.0.0
// GITHUB: https://github.com/cybev1/cybev-frontend
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Video, Plus, Calendar, Clock, Users, Copy, ChevronRight, Loader2 } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function MeetDashboard() {
  const router = useRouter();
  const [meetings, setMeetings] = useState({ upcoming: [], recent: [] });
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      const res = await fetch(`${API}/api/meet/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.ok) setMeetings({ upcoming: data.upcoming || [], recent: data.recent || [] });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const startMeeting = async () => {
    setStarting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/meet/instant`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.ok) router.push(`/meet/${data.roomId}`);
      else alert(data.error || 'Failed');
    } catch (err) { alert('Failed to start meeting'); }
    finally { setStarting(false); }
  };

  const joinMeeting = () => {
    if (!joinCode.trim()) return alert('Enter meeting code');
    let roomId = joinCode.trim();
    if (roomId.includes('/meet/')) roomId = roomId.split('/meet/').pop().split('?')[0];
    router.push(`/meet/${roomId}`);
  };

  return (
    <AppLayout>
      <Head><title>CYBEV Meet</title></Head>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">CYBEV Meet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button onClick={startMeeting} disabled={starting}
            className="flex items-center gap-4 p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl disabled:opacity-50">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              {starting ? <Loader2 className="w-7 h-7 animate-spin" /> : <Video className="w-7 h-7" />}
            </div>
            <div className="text-left">
              <p className="font-semibold text-lg">New Meeting</p>
              <p className="text-purple-200 text-sm">Start instant meeting</p>
            </div>
            <ChevronRight className="w-6 h-6 ml-auto" />
          </button>
          
          <Link href="/meet/schedule" className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-purple-300">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-lg text-gray-900 dark:text-white">Schedule</p>
              <p className="text-gray-500 text-sm">Plan future meeting</p>
            </div>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Join a Meeting</h2>
          <div className="flex gap-3">
            <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinMeeting()}
              placeholder="Enter meeting code or link"
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" />
            <button onClick={joinMeeting} className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium">Join</button>
          </div>
        </div>

        {meetings.upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" /> Upcoming
            </h2>
            <div className="space-y-3">
              {meetings.upcoming.map(m => (
                <div key={m._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{m.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(m.schedule?.startTime).toLocaleString()}</p>
                  </div>
                  <Link href={`/meet/${m.roomId}`} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg">Join</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white">
          <h3 className="font-semibold text-lg mb-2">CYBEV Meet Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Up to 100 participants</div>
            <div className="flex items-center gap-2"><Video className="w-4 h-4" /> HD Video & Audio</div>
            <div className="flex items-center gap-2"><Copy className="w-4 h-4" /> Screen Sharing</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Unlimited Duration</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
