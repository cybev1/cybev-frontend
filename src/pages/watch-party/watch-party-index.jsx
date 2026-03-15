// ============================================
// FILE: index.jsx
// PATH: /src/pages/watch-party/index.jsx
// CYBEV Watch Party — Browse & Create
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import api from '@/lib/api';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Play, Plus, Users, Clock, Eye, Search, Filter, Tv,
  Calendar, Globe, Lock, UserCheck, Loader2, Radio, Copy
} from 'lucide-react';

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone can join' },
  { value: 'followers', label: 'Followers', icon: UserCheck, desc: 'Only followers' },
  { value: 'private', label: 'Private', icon: Lock, desc: 'Invite only' }
];

const VIDEO_SOURCES = [
  { value: 'url', label: 'Video URL (MP4)' },
  { value: 'hls', label: 'Live Stream URL (HLS/m3u8)' },
  { value: 'youtube', label: 'YouTube URL' },
  { value: 'vlog', label: 'My Vlogs' },
  { value: 'rtmp', label: 'Stream from OBS/vMix (RTMP)' }
];

function PartyCard({ party, onJoin }) {
  // Use server-computed activeViewers (includes boosted + synthetic) with fallback
  const activeViewers = party.activeViewers || (party.participants || []).filter(p => p.isActive).length;
  const isLive = party.status === 'live';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900">
        {party.coverImage || party.videoSource?.thumbnail ? (
          <img
            src={party.coverImage || party.videoSource.thumbnail}
            alt={party.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Branded default thumbnail — much richer than a bare icon */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #7c3aed 70%, #a855f7 100%)' }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
              <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-pink-500 rounded-full blur-3xl" />
              <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3 border border-white/20">
                <Play size={20} className="text-white ml-0.5" />
              </div>
              <p className="text-white font-bold text-sm leading-tight line-clamp-2 max-w-[200px]">{party.title}</p>
              <p className="text-purple-200 text-xs mt-1.5 opacity-80">Watch Party • CYBEV</p>
            </div>
          </div>
        )}
        {/* Live badge */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">
            <Radio size={12} className="animate-pulse" />
            LIVE
          </div>
        )}
        {!isLive && party.status === 'scheduled' && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
            <Calendar size={12} />
            SCHEDULED
          </div>
        )}
        {/* Viewer count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
          <Eye size={12} />
          {activeViewers >= 1000000 ? `${(activeViewers / 1000000).toFixed(1).replace(/\.0$/, '')}M`
            : activeViewers >= 1000 ? `${(activeViewers / 1000).toFixed(1).replace(/\.0$/, '')}K`
            : activeViewers} watching
        </div>
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={24} className="text-purple-600 ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{party.title}</h3>
        {party.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{party.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-100 overflow-hidden">
              {party.host?.avatar ? (
                <img src={party.host.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-purple-600 font-bold">
                  {(party.host?.displayName || party.host?.username || '?')[0].toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {party.host?.displayName || party.host?.username || 'Anonymous'}
            </span>
          </div>
          <button
            onClick={() => onJoin(party._id)}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-colors"
          >
            {isLive ? 'Join' : 'View'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WatchPartyIndex() {
  const router = useRouter();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');

  // Create form
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoSourceType: 'url',
    videoUrl: '',
    privacy: 'public',
    maxParticipants: 50,
    coverImage: ''
  });
  const [creating, setCreating] = useState(false);
  const [rtmpInfo, setRtmpInfo] = useState(null);
  const [loadingRtmp, setLoadingRtmp] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Handle cover image file upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file');
    if (file.size > 10 * 1024 * 1024) return alert('Image must be under 10MB');

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'watch-party-covers');
      formData.append('type', 'image');
      const { data } = await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, coverImage: data.url || data.secure_url || data.imageUrl || '' }));
    } catch (err) {
      console.error('Cover upload failed:', err);
      alert('Failed to upload image. Try again.');
    } finally {
      setUploadingCover(false);
    }
  };

  // Fetch RTMP stream key when RTMP source is selected
  const fetchStreamKey = async () => {
    try {
      setLoadingRtmp(true);
      // Try new multi-provider endpoint first, fallback to old Mux endpoint
      let data;
      try {
        const res = await api.post('/api/stream-gen/create', {
          title: form.title || 'Watch Party Stream',
          lowLatency: true
        });
        data = res.data;
      } catch (e1) {
        // Fallback to old endpoint
        console.log('stream-gen failed, trying /api/live/generate-key');
        const res = await api.post('/api/live/generate-key', {
          keyType: 'obs',
          title: form.title || 'Watch Party Stream'
        });
        data = res.data;
      }

      if (!data.success || !data.streamKey) {
        alert(data.error || 'Failed to generate stream key. Check your Mux or Livepeer configuration.');
        return;
      }
      setRtmpInfo({
        streamKey: data.streamKey,
        rtmpUrl: data.rtmpUrl || 'rtmps://global-live.mux.com:443/app',
        playbackId: data.playbackId,
        playbackUrl: data.playbackUrl,
        streamId: data.streamId,
        provider: data.provider || 'mux'
      });
    } catch (err) {
      console.error('Failed to generate stream key:', err);
      alert(err?.response?.data?.error || 'Failed to generate stream key. Make sure Mux or Livepeer is configured.');
    } finally {
      setLoadingRtmp(false);
    }
  };

  const fetchParties = useCallback(async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? 'all' : filter;
      const { data } = await api.get(`/api/watch-party?status=${status}&limit=50`);
      setParties(data.parties || []);
    } catch (err) {
      console.error('Failed to fetch watch parties:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchParties(); }, [fetchParties]);

  // Check if user is logged in
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('token');

  useEffect(() => { fetchParties(); }, [fetchParties]);

  const handleJoin = (partyId) => {
    router.push(`/watch-party/${partyId}`);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    if (form.videoSourceType !== 'rtmp' && !form.videoUrl.trim()) return;
    try {
      setCreating(true);
      let videoSource;

      if (form.videoSourceType === 'rtmp' && rtmpInfo) {
        videoSource = {
          type: 'mux', // keep 'mux' type for HLS player compatibility
          muxPlaybackId: rtmpInfo.playbackId,
          url: rtmpInfo.playbackUrl
            || (rtmpInfo.provider === 'livepeer' && rtmpInfo.playbackId
              ? `https://livepeercdn.studio/hls/${rtmpInfo.playbackId}/index.m3u8`
              : rtmpInfo.playbackId
                ? `https://stream.mux.com/${rtmpInfo.playbackId}.m3u8`
                : ''),
          title: form.title,
          provider: rtmpInfo.provider
        };
      } else {
        videoSource = {
          type: form.videoSourceType === 'hls' ? 'url' : form.videoSourceType,
          url: form.videoUrl,
          title: form.title
        };
        // HLS streams: also set as mux type so player uses HLS.js
        if (form.videoSourceType === 'hls' || form.videoUrl.includes('.m3u8')) {
          videoSource.type = 'url'; // the room player detects .m3u8 in any URL
        }
        if (form.videoSourceType === 'youtube') {
          const ytMatch = form.videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (ytMatch) videoSource.thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
        }
      }

      const { data } = await api.post('/api/watch-party', {
        title: form.title,
        description: form.description,
        videoSource,
        privacy: form.privacy,
        maxParticipants: parseInt(form.maxParticipants),
        coverImage: form.coverImage || videoSource.thumbnail || '',
        publishToFeed: true
      });
      router.push(`/watch-party/${data._id}`);
    } catch (err) {
      console.error('Failed to create watch party:', err);
      alert(err?.response?.data?.error || 'Failed to create watch party');
    } finally {
      setCreating(false);
    }
  };

  const filteredParties = parties.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <Head>
        <title>Watch Parties — CYBEV</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tv className="text-purple-600" size={28} />
              Watch Parties
            </h1>
            <p className="text-gray-500 mt-1">Watch together in real-time with friends</p>
          </div>
          {isLoggedIn ? (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors"
            >
              <Plus size={18} />
              Create Party
            </button>
          ) : (
            <button
              onClick={() => router.push('/auth/login')}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors"
            >
              Sign in to Create
            </button>
          )}
        </div>

        {/* Create Form */}
        {showCreate && isLoggedIn && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create a Watch Party</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text" maxLength={200} placeholder="Movie Night with the Squad 🍿"
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  rows={2} maxLength={1000} placeholder="What are we watching?"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Source</label>
                <select
                  value={form.videoSourceType} onChange={e => setForm({...form, videoSourceType: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  {VIDEO_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                {form.videoSourceType === 'rtmp' ? (
                  <div className="space-y-3">
                    {!rtmpInfo ? (
                      <button onClick={fetchStreamKey} disabled={loadingRtmp}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                        {loadingRtmp ? <Loader2 size={16} className="animate-spin" /> : <Radio size={16} />}
                        {loadingRtmp ? 'Generating...' : 'Generate Stream Key'}
                      </button>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            via {rtmpInfo.provider === 'livepeer' ? 'Livepeer' : 'Mux'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">RTMP URL:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-white px-2 py-1.5 rounded border text-xs break-all">{rtmpInfo.rtmpUrl}</code>
                            <button onClick={() => { navigator.clipboard.writeText(rtmpInfo.rtmpUrl); }} className="p-1.5 hover:bg-gray-200 rounded"><Copy size={14} /></button>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Stream Key:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-white px-2 py-1.5 rounded border text-xs break-all">{rtmpInfo.streamKey}</code>
                            <button onClick={() => { navigator.clipboard.writeText(rtmpInfo.streamKey); }} className="p-1.5 hover:bg-gray-200 rounded"><Copy size={14} /></button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Open OBS → Settings → Stream → Service: <strong>Custom</strong> → paste Server URL and Stream Key above. 
                          Start streaming in OBS first, then click "Start Party".
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder={
                        form.videoSourceType === 'hls'
                          ? 'https://example.com/stream/chunklist.m3u8'
                          : form.videoSourceType === 'youtube'
                            ? 'https://youtube.com/watch?v=...'
                            : 'https://example.com/video.mp4'
                      }
                      value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                    {form.videoSourceType === 'hls' && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        Paste any .m3u8 HLS stream URL. Works with church streams, live TV, CDN streams, etc.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                <div className="flex gap-2">
                  {PRIVACY_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setForm({...form, privacy: opt.value})}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.privacy === opt.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <opt.icon size={14} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Viewers</label>
                <input
                  type="number" min={2} max={500000}
                  value={form.maxParticipants} onChange={e => setForm({...form, maxParticipants: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image <span className="text-gray-400 font-normal">(optional — used as thumbnail)</span>
              </label>
              {form.coverImage ? (
                <div className="relative inline-block">
                  <div className="w-full max-w-xs h-36 rounded-xl overflow-hidden border-2 border-purple-200">
                    <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, coverImage: '' }))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  uploadingCover ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }`}>
                  {uploadingCover ? (
                    <div className="flex items-center gap-2 text-purple-600">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                        <Plus size={20} className="text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-500">Click to upload cover image</span>
                      <span className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP • Max 10MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              )}
              <p className="text-xs text-gray-400 mt-1">Shown on party listing, feed, and when shared on social media</p>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowCreate(false)}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={creating || !form.title.trim() || (form.videoSourceType !== 'rtmp' && !form.videoUrl.trim()) || (form.videoSourceType === 'rtmp' && !rtmpInfo)}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-full font-medium transition-colors"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                {creating ? 'Creating...' : 'Start Party'}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="flex gap-2">
            {['live', 'scheduled', 'all'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'live' && '🔴 '}{f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search parties..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Party Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-purple-600" />
          </div>
        ) : filteredParties.length === 0 ? (
          <div className="text-center py-20">
            <Tv size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No watch parties yet</h3>
            <p className="text-gray-500 mb-4">Be the first to start one!</p>
            <button onClick={() => setShowCreate(true)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors"
            >
              Create Watch Party
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredParties.map(party => (
              <PartyCard key={party._id} party={party} onJoin={handleJoin} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
