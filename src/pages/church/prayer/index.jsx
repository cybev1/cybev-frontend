// ============================================
// FILE: pages/church/prayer/index.jsx
// Prayer Wall - Requests, Pray Button, Testimonies
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Heart, Plus, MessageSquare, Users, Clock, Filter,
  ArrowLeft, Loader2, Send, CheckCircle, Star, Flame,
  Lock, Globe, MoreHorizontal, Flag, Trash2, Share2,
  BookOpen, Sparkles, Hand, X, ThumbsUp
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const categoryConfig = {
  healing: { label: 'Healing', icon: '🏥', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  family: { label: 'Family', icon: '👨‍👩‍👧‍👦', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  finances: { label: 'Finances', icon: '💰', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  guidance: { label: 'Guidance', icon: '🧭', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  salvation: { label: 'Salvation', icon: '✝️', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  marriage: { label: 'Marriage', icon: '💒', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  work: { label: 'Work/Career', icon: '💼', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  protection: { label: 'Protection', icon: '🛡️', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  thanksgiving: { label: 'Thanksgiving', icon: '🙏', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  other: { label: 'Other', icon: '📿', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' }
};

function PrayerCard({ prayer, onPray, onTestimony, isPraying, currentUserId }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const category = categoryConfig[prayer.category] || categoryConfig.other;
  const hasPrayed = prayer.prayedBy?.some(p => p.user === currentUserId || p.user?._id === currentUserId);
  const isOwner = prayer.user?._id === currentUserId || prayer.user === currentUserId;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 ${
      prayer.isAnswered ? 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {prayer.isAnonymous ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
          ) : (
            <img
              src={prayer.user?.profilePicture || '/default-avatar.png'}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {prayer.isAnonymous ? 'Anonymous' : prayer.user?.name || prayer.user?.username}
            </p>
            <p className="text-xs text-gray-500">{timeAgo(prayer.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
            {category.icon} {category.label}
          </span>
          {prayer.isUrgent && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white flex items-center gap-1">
              <Flame className="w-3 h-3" /> Urgent
            </span>
          )}
          {prayer.isAnswered && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500 text-white flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Answered
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
        {prayer.request}
      </p>

      {/* Scripture */}
      {prayer.scripture && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 mb-4 border-l-4 border-purple-500">
          <p className="text-sm text-purple-700 dark:text-purple-300 italic">
            "{prayer.scripture.text}"
          </p>
          <p className="text-xs text-purple-500 mt-1">— {prayer.scripture.reference}</p>
        </div>
      )}

      {/* Testimony */}
      {prayer.testimony && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 mb-4 border-l-4 border-green-500">
          <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-1 mb-1">
            <Sparkles className="w-4 h-4" /> Testimony
          </p>
          <p className="text-sm text-green-600 dark:text-green-300">{prayer.testimony}</p>
        </div>
      )}

      {/* Stats & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPray(prayer._id)}
            disabled={isPraying}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
              hasPrayed
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-700'
            }`}
          >
            {isPraying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Hand className="w-4 h-4" />
            )}
            {hasPrayed ? 'Prayed' : 'Pray'}
            <span className="text-sm">({prayer.prayerCount || 0})</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{prayer.comments?.length || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && !prayer.isAnswered && (
            <button
              onClick={() => onTestimony(prayer)}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Add Testimony
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Share2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && prayer.comments?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
          {prayer.comments.slice(0, 5).map((comment, i) => (
            <div key={i} className="flex gap-3">
              <img
                src={comment.user?.profilePicture || '/default-avatar.png'}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.user?.name || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatePrayerModal({ isOpen, onClose, onCreate, loading }) {
  const [form, setForm] = useState({
    request: '',
    category: 'other',
    isAnonymous: false,
    isUrgent: false,
    isPublic: true,
    scripture: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-500" />
            Submit Prayer Request
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prayer Request *
            </label>
            <textarea
              value={form.request}
              onChange={(e) => setForm(f => ({ ...f, request: e.target.value }))}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Share your prayer request..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(categoryConfig).slice(0, 10).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: key }))}
                  className={`p-2 rounded-xl border-2 text-center transition ${
                    form.category === key
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <span className="text-xl">{config.icon}</span>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{config.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scripture (Optional)
            </label>
            <input
              type="text"
              value={form.scripture}
              onChange={(e) => setForm(f => ({ ...f, scripture: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="e.g., Philippians 4:6"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-purple-600"
              />
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Post Anonymously</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isUrgent}
                onChange={(e) => setForm(f => ({ ...f, isUrgent: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-purple-600"
              />
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Urgent</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.request.trim()}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Submit Prayer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TestimonyModal({ isOpen, onClose, prayer, onSubmit, loading }) {
  const [testimony, setTestimony] = useState('');

  if (!isOpen || !prayer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Testimony!</h3>
          <p className="text-gray-500 mt-1">God answered your prayer - share how!</p>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Original Request:</p>
            <p className="text-gray-700 dark:text-gray-300">{prayer.request}</p>
          </div>

          <textarea
            value={testimony}
            onChange={(e) => setTestimony(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
            placeholder="Share how God answered your prayer..."
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(prayer._id, testimony)}
              disabled={loading || !testimony.trim()}
              className="flex-1 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              Share Testimony
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrayerWall() {
  const [loading, setLoading] = useState(true);
  const [prayers, setPrayers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [testimonyPrayer, setTestimonyPrayer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [prayingId, setPrayingId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [stats, setStats] = useState({ total: 0, answered: 0, praying: 0 });

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);
    fetchPrayers();
  }, [filter, categoryFilter]);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(filter === 'urgent' && { urgent: 'true' }),
        ...(filter === 'answered' && { answered: 'true' }),
        ...(filter === 'mine' && { mine: 'true' }),
        ...(categoryFilter && { category: categoryFilter })
      });

      const res = await fetch(`${API_URL}/api/church/prayers?${params}`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setPrayers(data.prayers || []);
        setStats({
          total: data.total || data.prayers?.length || 0,
          answered: data.answered || 0,
          praying: data.totalPrayers || 0
        });
      }
    } catch (err) {
      console.error('Fetch prayers error:', err);
    }
    setLoading(false);
  };

  const handleCreatePrayer = async (formData) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/prayers`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.ok) {
        setShowCreateModal(false);
        fetchPrayers();
      } else {
        alert(data.error || 'Failed to submit prayer');
      }
    } catch (err) {
      console.error('Create prayer error:', err);
    }
    setActionLoading(false);
  };

  const handlePray = async (prayerId) => {
    setPrayingId(prayerId);
    try {
      const res = await fetch(`${API_URL}/api/church/prayers/${prayerId}/pray`, {
        method: 'POST',
        ...getAuth()
      });
      const data = await res.json();
      if (data.ok) {
        setPrayers(prev => prev.map(p =>
          p._id === prayerId
            ? { ...p, prayerCount: data.prayerCount, prayedBy: [...(p.prayedBy || []), { user: currentUserId }] }
            : p
        ));
      }
    } catch (err) {
      console.error('Pray error:', err);
    }
    setPrayingId(null);
  };

  const handleTestimony = async (prayerId, testimony) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/prayers/${prayerId}/testimony`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ testimony })
      });
      const data = await res.json();
      if (data.ok) {
        setTestimonyPrayer(null);
        fetchPrayers();
      } else {
        alert(data.error || 'Failed to add testimony');
      }
    } catch (err) {
      console.error('Testimony error:', err);
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Prayer Wall - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
              <Heart className="w-8 h-8" />
              Prayer Wall
            </h1>
            <p className="text-purple-100">
              "The prayer of a righteous person is powerful and effective." - James 5:16
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-purple-200 text-sm">Prayer Requests</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.praying}</p>
              <p className="text-purple-200 text-sm">People Praying</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-300">{stats.answered}</p>
              <p className="text-purple-200 text-sm">Answered Prayers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Prayers' },
              { id: 'urgent', label: '🔥 Urgent' },
              { id: 'answered', label: '✅ Answered' },
              { id: 'mine', label: 'My Prayers' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  filter === f.id
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Submit Prayer
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              !categoryFilter
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            All Categories
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                categoryFilter === key
                  ? config.color
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prayer List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : prayers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Prayer Requests Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to share a prayer request with the community
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
            >
              Submit Prayer Request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map(prayer => (
              <PrayerCard
                key={prayer._id}
                prayer={prayer}
                onPray={handlePray}
                onTestimony={setTestimonyPrayer}
                isPraying={prayingId === prayer._id}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePrayerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePrayer}
        loading={actionLoading}
      />

      <TestimonyModal
        isOpen={!!testimonyPrayer}
        onClose={() => setTestimonyPrayer(null)}
        prayer={testimonyPrayer}
        onSubmit={handleTestimony}
        loading={actionLoading}
      />
    </div>
  );
}
