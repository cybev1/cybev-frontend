// ============================================
// FILE: src/pages/events/create.jsx
// Create Event Page
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import {
  Calendar,
  MapPin,
  Video,
  Globe,
  Clock,
  Image as ImageIcon,
  Users,
  Tag,
  Loader2,
  ArrowLeft,
  X
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { value: 'meetup', label: 'Meetup', icon: '👥' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'conference', label: 'Conference', icon: '🎤' },
  { value: 'webinar', label: 'Webinar', icon: '💻' },
  { value: 'party', label: 'Party', icon: '🎉' },
  { value: 'networking', label: 'Networking', icon: '🤝' },
  { value: 'educational', label: 'Educational', icon: '📚' },
  { value: 'religious', label: 'Religious', icon: '⛪' },
  { value: 'charity', label: 'Charity', icon: '❤️' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'concert', label: 'Concert', icon: '🎵' },
  { value: 'other', label: 'Other', icon: '📋' }
];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    coverImage: '',
    category: 'meetup',
    type: 'online',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: {
      name: '',
      address: '',
      city: '',
      country: ''
    },
    onlineDetails: {
      platform: 'cybev-live',
      link: ''
    },
    maxAttendees: 0,
    visibility: 'public',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login?redirect=/events/create');
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setForm(f => ({ ...f, coverImage: res.data.url }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && form.tags.length < 10) {
      setForm(f => ({
        ...f,
        tags: [...f.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setForm(f => ({
      ...f,
      tags: f.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      alert('Please enter an event title');
      return;
    }
    if (!form.startDate || !form.startTime) {
      alert('Please set a start date and time');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Combine date and time
      const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
      let endDateTime = null;
      if (form.endDate && form.endTime) {
        endDateTime = new Date(`${form.endDate}T${form.endTime}`);
      }

      const eventData = {
        title: form.title.trim(),
        description: form.description.trim(),
        coverImage: form.coverImage,
        category: form.category,
        type: form.type,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime?.toISOString(),
        timezone: form.timezone,
        visibility: form.visibility,
        maxAttendees: parseInt(form.maxAttendees) || 0,
        tags: form.tags,
        ...(form.type !== 'online' && { location: form.location }),
        ...(form.type !== 'in-person' && { onlineDetails: form.onlineDetails })
      };

      const res = await axios.post(`${API_URL}/api/events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push(`/events/${res.data.event._id}`);
    } catch (error) {
      console.error('Create event error:', error);
      alert(error.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Event | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">Create Event</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white dark:bg-white rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                Cover Image
              </label>
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {form.coverImage ? (
                  <>
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                      className="absolute top-2 right-2 p-1 bg-gray-900/50 rounded-full text-gray-900 hover:bg-gray-900/70"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                        <span className="text-gray-500 dark:text-gray-500">Click to upload cover image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white dark:bg-white rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-900">Event Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Give your event a name"
                  className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What's your event about?"
                  rows={4}
                  className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                      className={`p-3 rounded-lg border text-sm font-medium transition ${
                        form.category === cat.value
                          ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-600 dark:text-purple-600'
                          : 'border-gray-200 dark:border-gray-300 text-gray-700 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="block mt-1">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white dark:bg-white rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date & Time
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))}
                    className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))}
                    className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Event Type */}
            <div className="bg-white dark:bg-white rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-900">Event Type</h2>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'online', label: 'Online', icon: Video },
                  { value: 'in-person', label: 'In Person', icon: MapPin },
                  { value: 'hybrid', label: 'Hybrid', icon: Globe }
                ].map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: type.value }))}
                    className={`p-4 rounded-lg border text-center transition ${
                      form.type === type.value
                        ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-600 dark:text-purple-600'
                        : 'border-gray-200 dark:border-gray-300 text-gray-700 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-100'
                    }`}
                  >
                    <type.icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Location for in-person/hybrid */}
              {form.type !== 'online' && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-600">Location Details</h3>
                  <input
                    type="text"
                    value={form.location.name}
                    onChange={(e) => setForm(f => ({ ...f, location: { ...f.location, name: e.target.value } }))}
                    placeholder="Venue name"
                    className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  />
                  <input
                    type="text"
                    value={form.location.address}
                    onChange={(e) => setForm(f => ({ ...f, location: { ...f.location, address: e.target.value } }))}
                    placeholder="Address"
                    className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={form.location.city}
                      onChange={(e) => setForm(f => ({ ...f, location: { ...f.location, city: e.target.value } }))}
                      placeholder="City"
                      className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    />
                    <input
                      type="text"
                      value={form.location.country}
                      onChange={(e) => setForm(f => ({ ...f, location: { ...f.location, country: e.target.value } }))}
                      placeholder="Country"
                      className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    />
                  </div>
                </div>
              )}

              {/* Online details */}
              {form.type !== 'in-person' && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-600">Online Details</h3>
                  <select
                    value={form.onlineDetails.platform}
                    onChange={(e) => setForm(f => ({ ...f, onlineDetails: { ...f.onlineDetails, platform: e.target.value } }))}
                    className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  >
                    <option value="cybev-live">CYBEV Live Stream</option>
                    <option value="zoom">Zoom</option>
                    <option value="google-meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="discord">Discord</option>
                    <option value="other">Other</option>
                  </select>
                  {form.onlineDetails.platform !== 'cybev-live' && (
                    <input
                      type="url"
                      value={form.onlineDetails.link}
                      onChange={(e) => setForm(f => ({ ...f, onlineDetails: { ...f.onlineDetails, link: e.target.value } }))}
                      placeholder="Meeting link"
                      className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-white rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-900">Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                  Max Attendees (0 = unlimited)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.maxAttendees}
                  onChange={(e) => setForm(f => ({ ...f, maxAttendees: e.target.value }))}
                  className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                  Visibility
                </label>
                <select
                  value={form.visibility}
                  onChange={(e) => setForm(f => ({ ...f, visibility: e.target.value }))}
                  className="w-full px-4 py-3 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                >
                  <option value="public">Public - Anyone can see and join</option>
                  <option value="private">Private - Only invited users can join</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-600 rounded-full text-sm"
                      >
                        #{tag}
                        <button type="button" onClick={() => removeTag(i)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-purple-600 text-gray-900 font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Create Event
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
