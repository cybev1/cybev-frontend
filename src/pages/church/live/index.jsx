// ============================================
// FILE: pages/church/live/index.jsx
// Live Stream Integration - Connect Streaming to Church
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Video, Play, Radio, Users, Eye, Clock, Calendar,
  ArrowLeft, Settings, Plus, ExternalLink, Copy,
  Check, Loader2, Pause, Square, MoreHorizontal,
  Globe, Share2, MessageSquare, Heart, Zap, Wifi,
  WifiOff, RefreshCw, AlertCircle, CheckCircle,
  ChevronRight, Link2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function LiveIndicator({ isLive }) {
  return isLive ? (
    <span className="flex items-center gap-2 px-3 py-1 bg-red-500 text-gray-900 rounded-full text-sm font-medium animate-pulse">
      <Radio className="w-4 h-4" />
      LIVE
    </span>
  ) : (
    <span className="flex items-center gap-2 px-3 py-1 bg-gray-500 text-gray-900 rounded-full text-sm font-medium">
      <WifiOff className="w-4 h-4" />
      Offline
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color = 'purple' }) {
  const colors = {
    purple: 'from-purple-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    red: 'from-red-500 to-rose-600'
  };

  return (
    <div className="bg-white dark:bg-white rounded-xl p-4 border border-gray-100 dark:border-gray-200">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-gray-900" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function StreamCard({ stream, onSelect }) {
  const [copied, setCopied] = useState(false);

  const copyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://cybev.io/live/${stream._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={() => onSelect(stream)}
      className="bg-white dark:bg-white rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-200 hover:shadow-lg transition cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-50">
        {stream.thumbnail ? (
          <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-16 h-16 text-gray-700" />
          </div>
        )}
        
        {/* Live Badge */}
        <div className="absolute top-3 left-3">
          <LiveIndicator isLive={stream.status === 'live'} />
        </div>

        {/* Duration / Viewers */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {stream.status === 'live' && stream.viewerCount > 0 && (
            <span className="px-2 py-1 bg-gray-900/70 text-gray-900 rounded text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {stream.viewerCount}
            </span>
          )}
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-gray-900/30">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-900 fill-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-1 line-clamp-1">
          {stream.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {stream.status === 'live' 
            ? 'Live now' 
            : new Date(stream.scheduledFor || stream.createdAt).toLocaleDateString()}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {stream.organization && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-600 rounded-full">
                {stream.organization.name}
              </span>
            )}
          </div>
          
          <button
            onClick={copyLink}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-100"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateStreamModal({ isOpen, onClose, orgs, onCreate, loading }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    organizationId: '',
    scheduledFor: '',
    isPublic: true,
    autoPublishToFeed: true
  });

  useEffect(() => {
    if (orgs.length > 0 && !form.organizationId) {
      setForm(f => ({ ...f, organizationId: orgs[0]._id }));
    }
  }, [orgs]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            Create Live Stream
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Stream Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
              placeholder="Sunday Service Live"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 resize-none"
              placeholder="Join us for worship..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Organization
            </label>
            <select
              value={form.organizationId}
              onChange={(e) => setForm(f => ({ ...f, organizationId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
            >
              {orgs.map(org => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Schedule For (Optional)
            </label>
            <input
              type="datetime-local"
              value={form.scheduledFor}
              onChange={(e) => setForm(f => ({ ...f, scheduledFor: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setForm(f => ({ ...f, isPublic: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-900">Public Stream</span>
                <p className="text-sm text-gray-500">Anyone can watch</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.autoPublishToFeed}
                onChange={(e) => setForm(f => ({ ...f, autoPublishToFeed: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-900">Auto-publish to CYBEV Feed</span>
                <p className="text-sm text-gray-500">Share stream as a post when live</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.title}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-gray-900 hover:from-red-600 hover:to-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Create Stream
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StreamDetailsModal({ stream, onClose, onGoLive, onEndStream, loading }) {
  const [copied, setCopied] = useState({ streamKey: false, rtmpUrl: false });

  if (!stream) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [field]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [field]: false })), 2000);
  };

  const streamUrl = `https://cybev.io/live/${stream._id}`;
  const embedCode = `<iframe src="${streamUrl}/embed" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-white rounded-2xl w-full max-w-2xl shadow-xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-200">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900">
              {stream.title}
            </h3>
            <LiveIndicator isLive={stream.status === 'live'} />
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stream Preview */}
          <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
            {stream.status === 'live' ? (
              <video 
                src={stream.playbackUrl}
                controls
                autoPlay
                muted
                className="w-full h-full"
              />
            ) : (
              <div className="text-center text-gray-500">
                <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Stream is offline</p>
              </div>
            )}
          </div>

          {/* Stream URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
              Stream URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={streamUrl}
                readOnly
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-900"
              />
              <button
                onClick={() => copyToClipboard(streamUrl, 'url')}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-600 rounded-xl hover:bg-purple-200"
              >
                {copied.url ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <a href={streamUrl} target="_blank" rel="noopener noreferrer">
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">
                  <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-600" />
                </button>
              </a>
            </div>
          </div>

          {/* RTMP Settings (for streaming software) */}
          <div className="bg-gray-50 dark:bg-gray-100 rounded-xl p-4 space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Streaming Software Settings
            </h4>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">RTMP URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stream.rtmpUrl || 'rtmp://live.cybev.io/stream'}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-300 bg-white dark:bg-white"
                />
                <button
                  onClick={() => copyToClipboard(stream.rtmpUrl || 'rtmp://live.cybev.io/stream', 'rtmpUrl')}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
                >
                  {copied.rtmpUrl ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Stream Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={stream.streamKey || 'sk_live_xxxxxxxxxxxx'}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-300 bg-white dark:bg-white"
                />
                <button
                  onClick={() => copyToClipboard(stream.streamKey || 'sk_live_xxxxxxxxxxxx', 'streamKey')}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
                >
                  {copied.streamKey ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
              Embed Code
            </label>
            <div className="relative">
              <textarea
                value={embedCode}
                readOnly
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-900 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(embedCode, 'embed')}
                className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-600 rounded-lg shadow"
              >
                {copied.embed ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Stats when live */}
          {stream.status === 'live' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                <Eye className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{stream.viewerCount || 0}</p>
                <p className="text-xs text-gray-500">Viewers</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">
                  {Math.floor((Date.now() - new Date(stream.startedAt).getTime()) / 60000)} min
                </p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 text-center">
                <Heart className="w-6 h-6 text-pink-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{stream.reactions || 0}</p>
                <p className="text-xs text-gray-500">Reactions</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {stream.status === 'live' ? (
              <button
                onClick={() => onEndStream(stream._id)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-gray-900 hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-5 h-5" />}
                End Stream
              </button>
            ) : (
              <button
                onClick={() => onGoLive(stream._id)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-gray-900 hover:from-red-600 hover:to-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Radio className="w-5 h-5" />}
                Go Live
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveStreamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myOrgs, setMyOrgs] = useState([]);
  const [streams, setStreams] = useState([]);
  const [liveCount, setLiveCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, live, scheduled, past

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch orgs
      const orgsRes = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const orgsData = await orgsRes.json();
      if (orgsData.ok) {
        setMyOrgs(orgsData.orgs || []);
      }

      // Fetch streams (using existing live routes)
      const streamsRes = await fetch(`${API_URL}/api/live?limit=20`, getAuth());
      const streamsData = await streamsRes.json();
      if (streamsData.success || streamsData.ok) {
        setStreams(streamsData.streams || streamsData.data || []);
        setLiveCount((streamsData.streams || streamsData.data || []).filter(s => s.status === 'live').length);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    }
    setLoading(false);
  };

  const handleCreateStream = async (formData) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/live`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          siteSubdomain: formData.organizationId,
          isPublic: formData.isPublic,
          scheduledFor: formData.scheduledFor || undefined,
          metadata: {
            organizationId: formData.organizationId,
            autoPublishToFeed: formData.autoPublishToFeed
          }
        })
      });
      const data = await res.json();
      if (data.success || data.ok) {
        setShowCreateModal(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to create stream');
      }
    } catch (err) {
      console.error('Create stream error:', err);
    }
    setActionLoading(false);
  };

  const handleGoLive = async (streamId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/live/${streamId}/start`, {
        method: 'POST',
        ...getAuth()
      });
      const data = await res.json();
      if (data.success || data.ok) {
        fetchData();
        setSelectedStream(null);
      } else {
        alert(data.error || 'Failed to start stream');
      }
    } catch (err) {
      console.error('Go live error:', err);
    }
    setActionLoading(false);
  };

  const handleEndStream = async (streamId) => {
    if (!confirm('Are you sure you want to end this stream?')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/live/${streamId}/end`, {
        method: 'POST',
        ...getAuth()
      });
      const data = await res.json();
      if (data.success || data.ok) {
        fetchData();
        setSelectedStream(null);
      } else {
        alert(data.error || 'Failed to end stream');
      }
    } catch (err) {
      console.error('End stream error:', err);
    }
    setActionLoading(false);
  };

  // Filter streams
  const filteredStreams = streams.filter(s => {
    if (filter === 'live') return s.status === 'live';
    if (filter === 'scheduled') return s.status === 'scheduled';
    if (filter === 'past') return s.status === 'ended' || s.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Live Streaming - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-red-200 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Video className="w-8 h-8" />
                Live Streaming
              </h1>
              <p className="text-red-100 mt-1">Broadcast services and connect with your congregation</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-red-50 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Stream
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-5 h-5 text-red-200" />
                <span className="text-red-200 text-sm">Currently Live</span>
              </div>
              <p className="text-3xl font-bold">{liveCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-red-200" />
                <span className="text-red-200 text-sm">Total Viewers</span>
              </div>
              <p className="text-3xl font-bold">
                {streams.filter(s => s.status === 'live').reduce((sum, s) => sum + (s.viewerCount || 0), 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-red-200" />
                <span className="text-red-200 text-sm">Scheduled</span>
              </div>
              <p className="text-3xl font-bold">
                {streams.filter(s => s.status === 'scheduled').length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-red-200" />
                <span className="text-red-200 text-sm">Total Streams</span>
              </div>
              <p className="text-3xl font-bold">{streams.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'All Streams' },
            { id: 'live', label: 'Live Now', count: liveCount },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'past', label: 'Past Streams' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
                filter === tab.id
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-white dark:bg-white text-gray-600 dark:text-gray-600 border border-gray-200 dark:border-gray-200'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-gray-900 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}

          <button
            onClick={fetchData}
            className="ml-auto p-2 rounded-xl border border-gray-200 dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-100"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Streams Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : filteredStreams.length === 0 ? (
          <div className="bg-white dark:bg-white rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-200">
            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900 mb-2">
              {filter === 'live' ? 'No Live Streams' : 'No Streams Yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'live' 
                ? 'Start a live stream to connect with your congregation'
                : 'Create your first stream to get started'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-gray-900 rounded-xl font-semibold hover:from-red-600 hover:to-rose-700"
            >
              Create Stream
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map(stream => (
              <StreamCard
                key={stream._id}
                stream={stream}
                onSelect={setSelectedStream}
              />
            ))}
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-gray-900">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Quick Tips for Great Streams
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">📹 Setup</h4>
              <p className="text-gray-500 text-sm">
                Use OBS Studio or Streamlabs. Copy your RTMP URL and Stream Key from the stream settings.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎤 Audio</h4>
              <p className="text-gray-500 text-sm">
                Good audio is crucial. Use a dedicated microphone and test levels before going live.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📱 Engage</h4>
              <p className="text-gray-500 text-sm">
                Enable auto-publish to share your stream on CYBEV feed and reach more people.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateStreamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        orgs={myOrgs}
        onCreate={handleCreateStream}
        loading={actionLoading}
      />

      <StreamDetailsModal
        stream={selectedStream}
        onClose={() => setSelectedStream(null)}
        onGoLive={handleGoLive}
        onEndStream={handleEndStream}
        loading={actionLoading}
      />
    </div>
  );
}
