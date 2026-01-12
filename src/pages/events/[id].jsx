// ============================================
// FILE: src/pages/events/[id].jsx
// Event Detail Page
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
  Clock,
  Share2,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Copy,
  Send
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/events/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setEvent(res.data.event);
    } catch (error) {
      console.error('Failed to fetch event:', error);
      if (error.response?.status === 404) {
        router.push('/events');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRsvp = async (status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/events/${id}`));
      return;
    }

    try {
      setRsvpLoading(true);
      const res = await axios.post(
        `${API_URL}/api/events/${id}/rsvp`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEvent(prev => ({
        ...prev,
        userRsvp: status === 'not-going' ? null : status,
        goingCount: res.data.goingCount,
        interestedCount: res.data.interestedCount
      }));
    } catch (error) {
      console.error('RSVP error:', error);
      alert(error.response?.data?.message || 'Failed to update RSVP');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/events/${id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvent(prev => ({
        ...prev,
        comments: [...(prev.comments || []), res.data.comment]
      }));
      setComment('');
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-900">Event not found</h2>
          <Link href="/events" className="text-purple-600 hover:underline mt-2 inline-block">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isPast = new Date(event.startDate) < new Date();
  const isCancelled = event.status === 'cancelled';

  return (
    <>
      <Head>
        <title>{event.title} | CYBEV Events</title>
        <meta name="description" content={event.description?.substring(0, 160)} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description?.substring(0, 160)} />
        {event.coverImage && <meta property="og:image" content={event.coverImage} />}
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
        {/* Cover Image */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-purple-600 to-pink-600">
          {event.coverImage && (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gray-900/30" />
          
          {/* Back button */}
          <Link
            href="/events"
            className="absolute top-4 left-4 p-2 bg-gray-900/50 backdrop-blur-sm rounded-full text-gray-900 hover:bg-gray-900/70 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-gray-900/50 backdrop-blur-sm rounded-full text-gray-900 hover:bg-gray-900/70 transition"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {event.isOrganizer && (
              <Link
                href={`/events/${id}/edit`}
                className="p-2 bg-gray-900/50 backdrop-blur-sm rounded-full text-gray-900 hover:bg-gray-900/70 transition"
              >
                <Edit className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Status Badge */}
          {(isPast || isCancelled) && (
            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
              isCancelled ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              {isCancelled ? 'Cancelled' : 'Past Event'}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-8">
          {/* Main Card */}
          <div className="bg-white dark:bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Title & Category */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-600 text-sm font-medium rounded-full capitalize mb-2">
                    {event.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-900">
                    {event.title}
                  </h1>
                </div>
              </div>

              {/* Date & Time */}
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-900">
                      {formatDate(event.startDate)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-500">
                      {formatTime(event.startDate)}
                      {event.endDate && ` - ${formatTime(event.endDate)}`}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {event.type === 'online' ? (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-900">Online Event</div>
                      <div className="text-sm text-gray-600 dark:text-gray-500">
                        {event.onlineDetails?.platform || 'Link will be shared'}
                      </div>
                    </div>
                  </div>
                ) : event.location?.name && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-900">{event.location.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-500">
                        {event.location.address || `${event.location.city}, ${event.location.country}`}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RSVP Buttons */}
              {!isPast && !isCancelled && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleRsvp(event.userRsvp === 'going' ? 'not-going' : 'going')}
                    disabled={rsvpLoading || event.isFull}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                      event.userRsvp === 'going'
                        ? 'bg-green-600 text-white'
                        : event.isFull
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-gray-900 hover:bg-purple-700'
                    }`}
                  >
                    {rsvpLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : event.userRsvp === 'going' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Users className="w-5 h-5" />
                    )}
                    {event.userRsvp === 'going' ? 'Going' : event.isFull ? 'Event Full' : 'I\'m Going'}
                  </button>
                  
                  <button
                    onClick={() => handleRsvp(event.userRsvp === 'interested' ? 'not-going' : 'interested')}
                    disabled={rsvpLoading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium border transition ${
                      event.userRsvp === 'interested'
                        ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-500 text-pink-600'
                        : 'border-gray-300 dark:border-gray-300 text-gray-700 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${event.userRsvp === 'interested' ? 'fill-current' : ''}`} />
                    Interested
                  </button>
                </div>
              )}

              {/* Attendee Count */}
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-500">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span><strong className="text-gray-900 dark:text-gray-900">{event.goingCount}</strong> going</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span><strong className="text-gray-900 dark:text-gray-900">{event.interestedCount}</strong> interested</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="px-6 py-4 border-t dark:border-gray-200">
                <h2 className="font-semibold text-gray-900 dark:text-gray-900 mb-3">About this event</h2>
                <div className="text-gray-700 dark:text-gray-600 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            )}

            {/* Organizer */}
            <div className="px-6 py-4 border-t dark:border-gray-200">
              <h2 className="font-semibold text-gray-900 dark:text-gray-900 mb-3">Organizer</h2>
              <Link
                href={`/profile/${event.organizer?.username}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${event.organizer?.name || 'U'}&background=7c3aed&color=fff`}
                  alt={event.organizer?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-900 group-hover:text-purple-600 transition">
                    {event.organizer?.name}
                  </div>
                  <div className="text-sm text-gray-500">@{event.organizer?.username}</div>
                </div>
              </Link>
            </div>

            {/* Attendees Preview */}
            {event.attendees?.length > 0 && (
              <div className="px-6 py-4 border-t dark:border-gray-200">
                <h2 className="font-semibold text-gray-900 dark:text-gray-900 mb-3">
                  Attendees ({event.goingCount})
                </h2>
                <div className="flex -space-x-2">
                  {event.attendees.slice(0, 10).map((attendee, i) => (
                    <img
                      key={i}
                      src={attendee.user?.avatar || `https://ui-avatars.com/api/?name=${attendee.user?.name || 'U'}&background=7c3aed&color=fff`}
                      alt={attendee.user?.name}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-200"
                      title={attendee.user?.name}
                    />
                  ))}
                  {event.goingCount > 10 && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-500">
                      +{event.goingCount - 10}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comments */}
            {event.allowComments && (
              <div className="px-6 py-4 border-t dark:border-gray-200">
                <h2 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">
                  Discussion ({event.comments?.length || 0})
                </h2>
                
                {/* Comment Form */}
                <form onSubmit={handleComment} className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 border dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="p-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {event.comments?.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <img
                        src={c.user?.avatar || `https://ui-avatars.com/api/?name=${c.user?.name || 'U'}&background=7c3aed&color=fff`}
                        alt={c.user?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                          <span className="font-medium text-gray-900 dark:text-gray-900">
                            {c.user?.name}
                          </span>
                          <p className="text-gray-700 dark:text-gray-600 mt-1">{c.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
