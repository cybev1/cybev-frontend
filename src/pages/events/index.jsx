// ============================================
// FILE: src/pages/events/index.jsx
// Community Events Page
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Globe,
  Plus,
  Search,
  Filter,
  Clock,
  ChevronRight,
  CalendarDays,
  Loader2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'party', label: 'Party' },
  { value: 'networking', label: 'Networking' },
  { value: 'educational', label: 'Educational' },
  { value: 'religious', label: 'Religious' },
  { value: 'charity', label: 'Charity' },
  { value: 'other', label: 'Other' }
];

const EVENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In Person' },
  { value: 'hybrid', label: 'Hybrid' }
];

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    search: '',
    upcoming: true
  });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [filters, pagination.page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 12,
        upcoming: filters.upcoming,
        ...(filters.category && { category: filters.category }),
        ...(filters.type && { type: filters.type }),
        ...(filters.search && { search: filters.search })
      });

      const res = await axios.get(`${API_URL}/api/events?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setEvents(res.data.events || []);
      setPagination(res.data.pagination || { page: 1, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'online': return <Video className="w-4 h-4" />;
      case 'in-person': return <MapPin className="w-4 h-4" />;
      case 'hybrid': return <Globe className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Head>
        <title>Events | CYBEV</title>
        <meta name="description" content="Discover and join community events on CYBEV" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-7 h-7 text-purple-600" />
                  Events
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Discover meetups, workshops, and more
                </p>
              </div>
              <Link
                href="/events/create"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-fit"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setFilters(f => ({ ...f, upcoming: true }))}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filters.upcoming
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilters(f => ({ ...f, upcoming: false }))}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  !filters.upcoming
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Past
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category */}
            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Type */}
            <select
              value={filters.type}
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {EVENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {filters.upcoming ? 'Be the first to create an event!' : 'No past events match your criteria'}
              </p>
              <Link
                href="/events/create"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group"
                >
                  {/* Cover Image */}
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 relative">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-center shadow">
                      <div className="text-xs font-medium text-purple-600 uppercase">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {new Date(event.startDate).getDate()}
                      </div>
                    </div>
                    {/* Type Badge */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 text-white text-sm">
                      {getTypeIcon(event.type)}
                      <span className="capitalize">{event.type}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.startDate)}</span>
                      </div>
                      
                      {event.type === 'online' ? (
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <span>Online Event</span>
                        </div>
                      ) : event.location?.city && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location.city}{event.location.country && `, ${event.location.country}`}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.goingCount} going</span>
                        {event.interestedCount > 0 && (
                          <span className="text-gray-400">• {event.interestedCount} interested</span>
                        )}
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center gap-3">
                      <img
                        src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${event.organizer?.name || 'U'}&background=7c3aed&color=fff`}
                        alt={event.organizer?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        By <span className="text-gray-900 dark:text-white">{event.organizer?.name}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setPagination(p => ({ ...p, page }))}
                  className={`w-10 h-10 rounded-lg font-medium transition ${
                    pagination.page === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
