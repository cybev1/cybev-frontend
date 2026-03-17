// ============================================
// FILE: src/pages/watch-party/[id]/analytics.jsx
// Watch Party Analytics Dashboard
// VERSION: 1.0
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  ArrowLeft, Eye, Users, Clock, MessageCircle, Share2, Rocket,
  TrendingUp, Globe, Heart, Tv, Radio, ExternalLink, ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

function formatCount(n) {
  if (!n || n === 0) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function formatDuration(min) {
  if (!min) return '0m';
  if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
  return `${min}m`;
}

const COLORS = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'];

function StatCard({ icon: Icon, label, value, sub, color = '#7c3aed', trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-5 ${className}`}>
      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function WatchPartyAnalytics() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data: res } = await api.get(`/api/watch-party/${id}/analytics`);
        setData(res);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-3">{error || 'Analytics not available'}</p>
          <button onClick={() => router.back()} className="text-purple-600 font-medium text-sm hover:underline">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const { party, stats, charts } = data;
  const isLive = party.status === 'live';
  const isEnded = party.status === 'ended';

  return (
    <>
      <Head>
        <title>Analytics: {party.title} — CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => router.push(`/watch-party/${id}`)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-900 text-sm sm:text-base truncate">{party.title}</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {isLive && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-bold text-[10px]">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
                  </span>
                )}
                {isEnded && <span className="text-gray-400">Ended</span>}
                <span>Host: {party.host?.displayName || party.host?.username || 'Unknown'}</span>
              </div>
            </div>
            <Link href={`/watch-party/${id}`}>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">
                <ExternalLink className="w-3.5 h-3.5" /> View Party
              </button>
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-5 sm:py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <StatCard icon={Eye} label="Peak Viewers" value={formatCount(stats.peakViewers)} color="#7c3aed" />
            <StatCard icon={Users} label="Total Views" value={formatCount(stats.totalViews)} color="#3b82f6" />
            <StatCard icon={Clock} label="Duration" value={formatDuration(stats.durationMinutes)} color="#10b981" />
            <StatCard icon={MessageCircle} label="Chat Messages" value={formatCount(stats.chatMessageCount)} sub={`${stats.uniqueChatters} unique chatters`} color="#f59e0b" />
            <StatCard icon={Heart} label="Reactions" value={formatCount(stats.reactionCount)} color="#ec4899" />
            <StatCard icon={Share2} label="Shares" value={formatCount(stats.shareCount)} color="#06b6d4" />
          </div>

          {/* Viewer Chart */}
          {charts.viewerTimeline?.length > 1 && (
            <ChartCard title="Viewer Count Over Time" className="mb-5">
              <div className="h-56 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.viewerTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="minute"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickFormatter={(v) => v >= 60 ? `${Math.floor(v / 60)}h${v % 60 ? v % 60 + 'm' : ''}` : `${v}m`}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={formatCount} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }}
                      formatter={(v) => [formatCount(v), 'Viewers']}
                      labelFormatter={(v) => `${v} min`}
                    />
                    <Area type="monotone" dataKey="viewers" stroke="#7c3aed" strokeWidth={2.5} fill="url(#viewerGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}

          {/* Two column charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Chat Activity */}
            {charts.chatTimeline?.length > 1 && (
              <ChartCard title="Chat Activity">
                <div className="h-48 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.chatTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="minute" tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `${v}m`} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }}
                        formatter={(v) => [v, 'Messages']}
                        labelFormatter={(v) => `${v} min`}
                      />
                      <Bar dataKey="messages" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            )}

            {/* Top Reactions */}
            {charts.topReactions?.length > 0 && (
              <ChartCard title="Top Reactions">
                <div className="space-y-2.5">
                  {charts.topReactions.map((r, i) => {
                    const maxCount = charts.topReactions[0]?.count || 1;
                    const pct = Math.round((r.count / maxCount) * 100);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xl w-8 text-center">{r.emoji}</span>
                        <div className="flex-1">
                          <div className="h-7 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full flex items-center pl-3 text-white text-xs font-bold"
                              style={{ width: `${Math.max(pct, 12)}%`, backgroundColor: COLORS[i % COLORS.length] }}
                            >
                              {r.count}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>
            )}
          </div>

          {/* Country Breakdown */}
          {charts.countryBreakdown?.length > 0 && (
            <ChartCard title="Viewer Geography" className="mb-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {charts.countryBreakdown.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <Globe className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{c.country}</p>
                      <p className="text-[11px] text-gray-500">{formatCount(c.count)} viewers</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* Boost Stats */}
          {(stats.boostedViewers > 0 || stats.totalBoostedEver > 0) && (
            <ChartCard title="Boost Performance" className="mb-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-purple-700">{formatCount(stats.boostedViewers)}</p>
                  <p className="text-xs text-purple-500">Current Boosted</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-amber-700">{formatCount(stats.totalBoostedEver)}</p>
                  <p className="text-xs text-amber-500">Total Boosted Ever</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-blue-700">{formatCount(stats.totalViews)}</p>
                  <p className="text-xs text-blue-500">Total Views</p>
                </div>
              </div>
            </ChartCard>
          )}

          {/* Summary bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>Created: {new Date(party.createdAt).toLocaleDateString()}</span>
            {party.startedAt && <span>Started: {new Date(party.startedAt).toLocaleTimeString()}</span>}
            {party.endedAt && <span>Ended: {new Date(party.endedAt).toLocaleTimeString()}</span>}
            <span>Privacy: {party.privacy}</span>
            <span>Source: {party.videoSource?.type || 'url'}</span>
            {stats.publishedToFeed && <span className="text-green-600 font-semibold">✓ Published to Feed</span>}
          </div>
        </div>
      </div>
    </>
  );
}
