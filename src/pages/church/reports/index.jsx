// ============================================
// FILE: pages/church/reports/index.jsx
// Reports Dashboard - Charts, Growth Trends, Analytics
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  BarChart3, TrendingUp, Users, Heart, Calendar,
  ArrowLeft, Download, Filter, RefreshCw, Loader2,
  ChevronDown, Award, Target, Activity, PieChart,
  ArrowUpRight, ArrowDownRight, Clock, Percent
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Simple Chart Components (no external library needed)
function BarChart({ data, height = 200, color = '#8b5cf6' }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="flex items-end gap-2 justify-between" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div 
            className="w-full rounded-t-lg transition-all hover:opacity-80"
            style={{ 
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: color,
              minHeight: item.value > 0 ? '4px' : '0'
            }}
            title={`${item.label}: ${item.value}`}
          />
          <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, height = 200, color = '#10b981' }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / maxValue) * 100
  }));
  
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  return (
    <div className="relative" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {/* Area */}
        <path 
          d={`${pathD} L 100 100 L 0 100 Z`} 
          fill={color} 
          fillOpacity="0.1" 
        />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} />
        ))}
      </svg>
      {/* Labels */}
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-gray-500">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data, size = 160 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;
  
  const segments = data.map(d => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...d, startAngle, angle };
  });

  const getCoordinates = (angle, radius) => ({
    x: 50 + radius * Math.cos((angle * Math.PI) / 180),
    y: 50 + radius * Math.sin((angle * Math.PI) / 180)
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        {segments.map((seg, i) => {
          const start = getCoordinates(seg.startAngle, 40);
          const end = getCoordinates(seg.startAngle + seg.angle, 40);
          const largeArc = seg.angle > 180 ? 1 : 0;
          
          return (
            <path
              key={i}
              d={`M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArc} 1 ${end.x} ${end.y} Z`}
              fill={seg.color}
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold" fill="#1f2937">
          {total}
        </text>
        <text x="50" y="60" textAnchor="middle" className="text-xs" fill="#6b7280">
          Total
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-gray-600 dark:text-gray-400">{d.label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, color = 'purple', subtitle }) {
  const colors = {
    purple: 'from-purple-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    pink: 'from-pink-500 to-rose-600',
    orange: 'from-orange-500 to-amber-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function ConversionFunnel({ data }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="relative">
          <div className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
            <div className="flex-1">
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg flex items-center justify-end pr-3"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                >
                  <span className="text-white font-semibold text-sm">{item.value}</span>
                </div>
              </div>
            </div>
            <div className="w-16 text-right">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.percent}%
              </span>
            </div>
          </div>
          {i < data.length - 1 && (
            <div className="absolute left-32 top-10 text-gray-300 text-lg">↓</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [myOrgs, setMyOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [stats, setStats] = useState(null);
  const [soulStats, setSoulStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchStats();
    }
  }, [selectedOrg, dateRange]);

  const fetchOrgs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const data = await res.json();
      if (data.ok && data.orgs?.length > 0) {
        setMyOrgs(data.orgs);
        setSelectedOrg(data.orgs[0]._id);
      }
    } catch (err) {
      console.error('Fetch orgs error:', err);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      if (dateRange === '7d') startDate.setDate(endDate.getDate() - 7);
      else if (dateRange === '30d') startDate.setDate(endDate.getDate() - 30);
      else if (dateRange === '90d') startDate.setDate(endDate.getDate() - 90);
      else startDate.setFullYear(endDate.getFullYear() - 1);

      // Fetch soul stats
      const soulRes = await fetch(
        `${API_URL}/api/church/souls/stats/${selectedOrg}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        getAuth()
      );
      const soulData = await soulRes.json();
      if (soulData.ok) {
        setSoulStats(soulData);
      }

      // Fetch attendance stats
      const attRes = await fetch(
        `${API_URL}/api/church/attendance/stats/${selectedOrg}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        getAuth()
      );
      const attData = await attRes.json();
      if (attData.ok) {
        setAttendanceStats(attData);
      }

      // Get org details for base stats
      const orgRes = await fetch(`${API_URL}/api/church/org/${selectedOrg}`, getAuth());
      const orgData = await orgRes.json();
      if (orgData.ok) {
        setStats(orgData);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
    setLoading(false);
  };

  // Mock data for charts (will be replaced with real data)
  const weeklyTrendData = soulStats?.weeklyTrend?.map(w => ({
    label: `W${w._id?.split('-')[1] || ''}`,
    value: w.count || 0
  })) || [
    { label: 'W1', value: 12 },
    { label: 'W2', value: 18 },
    { label: 'W3', value: 15 },
    { label: 'W4', value: 22 },
    { label: 'W5', value: 28 },
    { label: 'W6', value: 25 }
  ];

  const attendanceTrendData = attendanceStats?.weeklyTrend?.map(w => ({
    label: `W${w._id?.split('-')[1] || ''}`,
    value: Math.round(w.avgAttendance || 0)
  })) || [
    { label: 'W1', value: 150 },
    { label: 'W2', value: 165 },
    { label: 'W3', value: 158 },
    { label: 'W4', value: 172 },
    { label: 'W5', value: 180 },
    { label: 'W6', value: 175 }
  ];

  const soulStatusData = soulStats?.stats ? [
    { label: 'New', value: soulStats.stats.new || 0, color: '#3b82f6' },
    { label: 'Follow-up', value: soulStats.stats.followup || 0, color: '#f97316' },
    { label: 'Attending', value: soulStats.stats.attending || 0, color: '#22c55e' },
    { label: 'Member', value: soulStats.stats.member || 0, color: '#8b5cf6' },
    { label: 'Graduated', value: soulStats.stats.graduated || 0, color: '#10b981' }
  ] : [
    { label: 'New', value: 45, color: '#3b82f6' },
    { label: 'Follow-up', value: 32, color: '#f97316' },
    { label: 'Attending', value: 28, color: '#22c55e' },
    { label: 'Member', value: 18, color: '#8b5cf6' },
    { label: 'Graduated', value: 12, color: '#10b981' }
  ];

  const totalSouls = soulStats?.stats?.total || soulStatusData.reduce((a, b) => a + b.value, 0);
  
  const funnelData = [
    { label: 'New Souls', value: soulStats?.stats?.new || 45, percent: 100, color: '#3b82f6' },
    { label: 'Contacted', value: soulStats?.stats?.contacted || 38, percent: 84, color: '#8b5cf6' },
    { label: 'Following Up', value: soulStats?.stats?.followup || 32, percent: 71, color: '#f97316' },
    { label: 'Attending', value: soulStats?.stats?.attending || 28, percent: 62, color: '#22c55e' },
    { label: 'Members', value: soulStats?.stats?.member || 18, percent: 40, color: '#10b981' }
  ];

  const conversionRate = totalSouls > 0 
    ? Math.round(((soulStats?.stats?.member || 18) / totalSouls) * 100) 
    : 40;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Reports - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8" />
                Reports & Analytics
              </h1>
              <p className="text-purple-100 mt-1">Track growth, attendance, and soul-winning progress</p>
            </div>

            <div className="flex gap-3">
              {/* Organization Selector */}
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="px-4 py-2 bg-white/20 rounded-xl text-white border border-white/30 focus:outline-none"
              >
                {myOrgs.map(org => (
                  <option key={org._id} value={org._id} className="text-gray-900">
                    {org.name}
                  </option>
                ))}
              </select>

              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/20 rounded-xl text-white border border-white/30 focus:outline-none"
              >
                <option value="7d" className="text-gray-900">Last 7 days</option>
                <option value="30d" className="text-gray-900">Last 30 days</option>
                <option value="90d" className="text-gray-900">Last 90 days</option>
                <option value="1y" className="text-gray-900">Last year</option>
              </select>

              <button
                onClick={fetchStats}
                className="px-4 py-2 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={Heart}
              label="Total Souls"
              value={totalSouls}
              change={12}
              color="pink"
              subtitle="All time"
            />
            <StatCard
              icon={Users}
              label="Avg Attendance"
              value={Math.round(attendanceStats?.stats?.avgAttendance || 165)}
              change={8}
              color="blue"
            />
            <StatCard
              icon={Target}
              label="First Timers"
              value={attendanceStats?.stats?.totalFirstTimers || 42}
              change={15}
              color="green"
            />
            <StatCard
              icon={Award}
              label="FS Graduates"
              value={soulStats?.stats?.graduated || stats?.org?.stats?.foundationSchoolGraduates || 12}
              color="purple"
            />
            <StatCard
              icon={Percent}
              label="Conversion Rate"
              value={`${conversionRate}%`}
              change={5}
              color="orange"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Soul Winning Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Soul Winning Trend</h3>
                  <p className="text-sm text-gray-500">Weekly new souls</p>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+23%</span>
                </div>
              </div>
              <BarChart data={weeklyTrendData} color="#ec4899" />
            </div>

            {/* Attendance Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Attendance Trend</h3>
                  <p className="text-sm text-gray-500">Weekly average</p>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+8%</span>
                </div>
              </div>
              <LineChart data={attendanceTrendData} color="#3b82f6" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Soul Status Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Soul Status Distribution</h3>
              <DonutChart data={soulStatusData} />
            </div>

            {/* Conversion Funnel */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Soul Conversion Funnel</h3>
              <ConversionFunnel data={funnelData} />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gender Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Male</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {soulStats?.stats?.male || 58}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Female</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {soulStats?.stats?.female || 77}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Service Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Highest Attendance</span>
                  <span className="font-bold text-gray-900 dark:text-white text-xl">
                    {attendanceStats?.stats?.highestAttendance || 210}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Services</span>
                  <span className="font-bold text-gray-900 dark:text-white text-xl">
                    {attendanceStats?.stats?.totalServices || 24}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Online Viewers</span>
                  <span className="font-bold text-gray-900 dark:text-white text-xl">
                    {attendanceStats?.stats?.totalOnline || 1250}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Export Reports</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </button>
                <button className="w-full py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export to Excel
                </button>
                <button className="w-full py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Report
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">{conversionRate}%</p>
                <p className="text-sm text-gray-500 mt-1">Soul → Member Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">
                  {Math.round((attendanceStats?.stats?.avgAttendance || 165) / (stats?.org?.memberCount || 200) * 100)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Attendance Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">
                  {Math.round((soulStats?.stats?.graduated || 12) / (soulStats?.stats?.foundation_school || 20 + soulStats?.stats?.graduated || 12) * 100) || 60}%
                </p>
                <p className="text-sm text-gray-500 mt-1">FS Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-pink-600">
                  {Math.round((totalSouls - (soulStats?.stats?.inactive || 5) - (soulStats?.stats?.lost || 3)) / totalSouls * 100) || 94}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Retention Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
