// ============================================
// FILE: src/pages/live/schedule.jsx
// Schedule Live Stream Page
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  Image as ImageIcon,
  Tag,
  Bell,
  X,
  Loader2,
  CheckCircle,
  ChevronLeft,
  Users,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { value: 'general', label: '🎯 General', color: 'bg-gray-500' },
  { value: 'gaming', label: '🎮 Gaming', color: 'bg-purple-500' },
  { value: 'music', label: '🎵 Music', color: 'bg-pink-500' },
  { value: 'art', label: '🎨 Art & Creative', color: 'bg-orange-500' },
  { value: 'education', label: '📚 Education', color: 'bg-blue-500' },
  { value: 'tech', label: '💻 Tech', color: 'bg-cyan-500' },
  { value: 'fitness', label: '💪 Fitness', color: 'bg-green-500' },
  { value: 'cooking', label: '🍳 Cooking', color: 'bg-yellow-500' },
  { value: 'talk', label: '💬 Talk Show', color: 'bg-indigo-500' },
  { value: 'news', label: '📰 News', color: 'bg-red-500' }
];

export default function ScheduleLive() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [myStreams, setMyStreams] = useState([]);
  const [loadingStreams, setLoadingStreams] = useState(true);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    category: 'general',
    tags: '',
    thumbnail: '',
    notifyFollowers: true
  });

  useEffect(() => {
    fetchMySchedule();
  }, []);

  const fetchMySchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/stream-schedule/my-schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyStreams(response.data.streams || []);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoadingStreams(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.date || !form.time) {
      toast.error('Please fill in title, date, and time');
      return;
    }

    const scheduledFor = new Date(`${form.date}T${form.time}`);
    if (scheduledFor <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/stream-schedule/schedule`,
        {
          title: form.title,
          description: form.description,
          scheduledFor: scheduledFor.toISOString(),
          duration: form.duration,
          category: form.category,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
          thumbnail: form.thumbnail,
          notifyFollowers: form.notifyFollowers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Stream scheduled successfully!');
      setForm({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        category: 'general',
        tags: '',
        thumbnail: '',
        notifyFollowers: true
      });
      fetchMySchedule();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to schedule stream');
    } finally {
      setLoading(false);
    }
  };

  const cancelStream = async (streamId) => {
    if (!confirm('Cancel this scheduled stream?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/stream-schedule/schedule/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Stream cancelled');
      fetchMySchedule();
    } catch (error) {
      toast.error('Failed to cancel stream');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Head>
        <title>Schedule Live Stream | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-50 border-b border-gray-200 dark:border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-600 mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-purple-600" />
              Schedule Live Stream
            </h1>
            <p className="text-gray-500 dark:text-gray-500 mt-1">
              Plan your streams ahead and notify your followers
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Schedule Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                    Stream Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="What's your stream about?"
                    maxLength={100}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Tell viewers what to expect..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      min={today}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
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
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                    Expected Duration
                  </label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat.value })}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          form.category === cat.value
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-white text-gray-700 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g., tutorial, beginner, live coding"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Notify Followers */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.notifyFollowers}
                    onChange={(e) => setForm({ ...form, notifyFollowers: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-600 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notify my followers about this stream
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Schedule Stream
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* My Scheduled Streams */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  My Scheduled Streams
                </h2>

                {loadingStreams ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  </div>
                ) : myStreams.filter(s => s.status === 'scheduled').length > 0 ? (
                  <div className="space-y-3">
                    {myStreams
                      .filter(s => s.status === 'scheduled')
                      .map((stream) => (
                        <div
                          key={stream._id}
                          className="p-4 bg-gray-50 dark:bg-white rounded-xl"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-900 truncate">
                                {stream.title}
                              </p>
                              <p className="text-sm text-purple-600 mt-1">
                                {formatDate(stream.scheduledFor)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-600 rounded-full">
                                  {CATEGORIES.find(c => c.value === stream.category)?.label || stream.category}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {stream.interestedUsers?.length || 0} interested
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => cancelStream(stream._id)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No scheduled streams</p>
                    <p className="text-sm mt-1">Schedule your first stream above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
