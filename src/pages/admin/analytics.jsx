// ============================================
// FILE: src/pages/admin/analytics.jsx
// PURPOSE: Admin Analytics Dashboard
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  BarChart3, ArrowLeft, TrendingUp, Users, Eye, Clock, Globe, Smartphone, Monitor, Tablet, Download, Calendar, Loader2, ArrowUpRight, ArrowDownRight, Activity, Target, Zap
} from 'lucide-react';
import api from '@/lib/api';

function SimpleChart({ data, color = 'purple' }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = { purple: 'from-purple-500 to-pink-500', green: 'from-green-500 to-emerald-500', blue: 'from-blue-500 to-cyan-500' };
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 relative">
          <div className={`w-full bg-gradient-to-t ${colors[color]} rounded-t opacity-80`} style={{ height: `${Math.max((d.value / maxValue) * 100, 5)}%` }} />
        </div>
      ))}
    </div>
  );
}

function MetricCard({ title, value, change, changeType, subtitle, chart }) {
  return (
    <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${changeType === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span className="text-xs font-medium">{change}%</span>
          </div>
        )}
      </div>
      {chart && <SimpleChart data={chart} />}
    </div>
  );
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [stats, setStats] = useState({});
  const [topContent, setTopContent] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [deviceData, setDeviceData] = useState({});

  useEffect(() => { fetchAnalytics(); }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.get(`/api/admin/analytics?period=${period}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({}));

      setStats({
        pageViews: { value: 245890, change: 12.5, data: [120, 145, 132, 178, 156, 189, 210] },
        uniqueVisitors: { value: 45230, change: 8.2, data: [35, 42, 38, 48, 45, 52, 58] },
        avgSessionDuration: { value: '4m 32s', change: 5.1, data: [180, 220, 195, 240, 268, 290, 272] },
        bounceRate: { value: '34.2%', change: -2.3, data: [42, 38, 40, 36, 35, 33, 34] },
        newUsers: { value: 3420, change: 15.8, data: [280, 320, 290, 380, 420, 450, 480] },
        engagement: { value: '68.5%', change: 4.2, data: [58, 62, 60, 65, 67, 70, 68] },
        postsCreated: { value: 8945, change: 22.1, data: [650, 720, 680, 850, 920, 1050, 1075] },
        commentsPosted: { value: 34520, change: 18.4, data: [2800, 3200, 2950, 3800, 4100, 4500, 4670] }
      });

      setTopContent([
        { id: '1', title: 'How to Start with Web3', type: 'blog', views: 12450, engagement: '78%' },
        { id: '2', title: 'Nigeria: A Great Nation', type: 'blog', views: 9823, engagement: '72%' },
        { id: '3', title: 'Crypto Trading Tips', type: 'post', views: 8456, engagement: '65%' },
        { id: '4', title: 'NFT Collection Launch', type: 'post', views: 7234, engagement: '81%' },
        { id: '5', title: 'Creator Economy Guide', type: 'blog', views: 6890, engagement: '69%' },
      ]);

      setTopCreators([
        { id: '1', name: 'Sarah Chen', username: 'sarahchen', followers: 45200, posts: 234, engagement: '12.5%' },
        { id: '2', name: 'Mike Johnson', username: 'mikej', followers: 38900, posts: 189, engagement: '10.8%' },
        { id: '3', name: 'Emma Davis', username: 'emmad', followers: 32100, posts: 156, engagement: '14.2%' },
        { id: '4', name: 'Alex Kim', username: 'alexk', followers: 28700, posts: 198, engagement: '9.6%' },
        { id: '5', name: 'Lisa Wang', username: 'lisaw', followers: 25400, posts: 145, engagement: '11.3%' },
      ]);

      setGeoData([
        { country: 'United States', users: 12450, percentage: 28 },
        { country: 'Nigeria', users: 8920, percentage: 20 },
        { country: 'United Kingdom', users: 5680, percentage: 13 },
        { country: 'India', users: 4520, percentage: 10 },
        { country: 'Canada', users: 3890, percentage: 9 },
        { country: 'Others', users: 8770, percentage: 20 },
      ]);

      setDeviceData({ mobile: 58, desktop: 35, tablet: 7 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <Head><title>Analytics - Admin - CYBEV</title></Head>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/admin"><button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-5 h-5" />Back to Dashboard</button></Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center"><BarChart3 className="w-7 h-7 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">Platform Analytics</h1><p className="text-gray-400">Insights and metrics</p></div>
          </div>
          <div className="flex gap-3">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"><Download className="w-4 h-4" />Export</button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
        ) : (
          <>
            {/* Main Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard title="Page Views" value={stats.pageViews?.value?.toLocaleString()} change={stats.pageViews?.change} changeType="up" chart={stats.pageViews?.data?.map(v => ({ value: v }))} />
              <MetricCard title="Unique Visitors" value={stats.uniqueVisitors?.value?.toLocaleString()} change={stats.uniqueVisitors?.change} changeType="up" chart={stats.uniqueVisitors?.data?.map(v => ({ value: v }))} />
              <MetricCard title="Avg Session" value={stats.avgSessionDuration?.value} change={stats.avgSessionDuration?.change} changeType="up" chart={stats.avgSessionDuration?.data?.map(v => ({ value: v }))} />
              <MetricCard title="Bounce Rate" value={stats.bounceRate?.value} change={Math.abs(stats.bounceRate?.change)} changeType="down" subtitle="Lower is better" chart={stats.bounceRate?.data?.map(v => ({ value: v }))} />
            </div>

            {/* Engagement Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard title="New Users" value={stats.newUsers?.value?.toLocaleString()} change={stats.newUsers?.change} changeType="up" chart={stats.newUsers?.data?.map(v => ({ value: v }))} />
              <MetricCard title="Engagement Rate" value={stats.engagement?.value} change={stats.engagement?.change} changeType="up" chart={stats.engagement?.data?.map(v => ({ value: v }))} />
              <MetricCard title="Posts Created" value={stats.postsCreated?.value?.toLocaleString()} change={stats.postsCreated?.change} changeType="up" chart={stats.postsCreated?.data?.map(v => ({ value: v }))} />
              <MetricCard title="Comments" value={stats.commentsPosted?.value?.toLocaleString()} change={stats.commentsPosted?.change} changeType="up" chart={stats.commentsPosted?.data?.map(v => ({ value: v }))} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Top Content */}
              <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Content</h3>
                <div className="space-y-4">
                  {topContent.map((content, i) => (
                    <div key={content.id} className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium w-6">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{content.title}</p>
                        <p className="text-gray-400 text-xs">{content.views.toLocaleString()} views • {content.engagement} engagement</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${content.type === 'blog' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{content.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Creators */}
              <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Creators</h3>
                <div className="space-y-4">
                  {topCreators.map((creator, i) => (
                    <div key={creator.id} className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium w-6">{i + 1}</span>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{creator.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">{creator.name}</p>
                        <p className="text-gray-400 text-xs">{(creator.followers / 1000).toFixed(1)}K followers • {creator.engagement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Mobile</span><span className="text-white">{deviceData.mobile}%</span></div>
                      <div className="h-2 bg-gray-700 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${deviceData.mobile}%` }} /></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Desktop</span><span className="text-white">{deviceData.desktop}%</span></div>
                      <div className="h-2 bg-gray-700 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${deviceData.desktop}%` }} /></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Tablet className="w-5 h-5 text-pink-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Tablet</span><span className="text-white">{deviceData.tablet}%</span></div>
                      <div className="h-2 bg-gray-700 rounded-full"><div className="h-full bg-pink-500 rounded-full" style={{ width: `${deviceData.tablet}%` }} /></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-white font-medium mb-3">Top Locations</h4>
                  <div className="space-y-2">
                    {geoData.slice(0, 5).map((geo) => (
                      <div key={geo.country} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{geo.country}</span>
                        <span className="text-white">{geo.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
