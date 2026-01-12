// ============================================
// FILE: pages/church/attendance/index.jsx
// Attendance Recording & Analytics
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  BarChart3, Users, UserPlus, Calendar, ChevronRight,
  ArrowLeft, Loader2, TrendingUp, Heart, Save, Plus,
  CheckCircle, Clock
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function StatCard({ label, value, icon: Icon, trend, color = 'purple' }) {
  const colors = {
    purple: 'from-purple-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    pink: 'from-pink-500 to-rose-600'
  };

  return (
    <div className="bg-white dark:bg-white rounded-xl p-5 border border-gray-100 dark:border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-gray-900" />
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function AttendanceForm({ orgs, onSubmit, loading }) {
  const [form, setForm] = useState({
    organizationId: '',
    date: new Date().toISOString().split('T')[0],
    serviceType: 'sunday',
    members: 0,
    visitors: 0,
    firstTimers: 0,
    children: 0,
    online: 0,
    soulsWon: 0,
    notes: ''
  });

  useEffect(() => {
    if (orgs.length > 0 && !form.organizationId) {
      setForm(f => ({ ...f, organizationId: orgs[0]._id }));
    }
  }, [orgs]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAttendance = form.members + form.visitors + form.firstTimers + form.children + form.online;
    onSubmit({ ...form, totalAttendance });
  };

  const totalAttendance = form.members + form.visitors + form.firstTimers + form.children + form.online;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-purple-500" />
        Record Attendance
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Organization
          </label>
          <select
            name="organizationId"
            value={form.organizationId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
          >
            {orgs.map(org => (
              <option key={org._id} value={org._id}>{org.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Service Type
          </label>
          <select
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
          >
            <option value="sunday">Sunday Service</option>
            <option value="midweek">Midweek Service</option>
            <option value="prayer">Prayer Service</option>
            <option value="biblestudy">Bible Study</option>
            <option value="special">Special Program</option>
          </select>
        </div>
      </div>

      {/* Attendance Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Members
          </label>
          <input
            type="number"
            name="members"
            value={form.members}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 text-center text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Visitors
          </label>
          <input
            type="number"
            name="visitors"
            value={form.visitors}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 text-center text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            First Timers
          </label>
          <input
            type="number"
            name="firstTimers"
            value={form.firstTimers}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-900 text-center text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Children
          </label>
          <input
            type="number"
            name="children"
            value={form.children}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 text-center text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Online
          </label>
          <input
            type="number"
            name="online"
            value={form.online}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 text-center text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-600 dark:text-pink-600 mb-1">
            Souls Won 🙏
          </label>
          <input
            type="number"
            name="soulsWon"
            value={form.soulsWon}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/20 text-gray-900 dark:text-gray-900 text-center text-lg font-semibold"
          />
        </div>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 mb-6 text-gray-900">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total Attendance</span>
          <span className="text-3xl font-bold">{totalAttendance}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 resize-none"
          placeholder="Any highlights or notes about this service..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-gray-900 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Attendance
          </>
        )}
      </button>
    </form>
  );
}

function RecentRecord({ record }) {
  const serviceLabels = {
    sunday: 'Sunday Service',
    midweek: 'Midweek Service',
    prayer: 'Prayer Service',
    biblestudy: 'Bible Study',
    special: 'Special Program'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-white rounded-xl border border-gray-100 dark:border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-900">
            {serviceLabels[record.serviceType] || 'Service'}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(record.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-gray-900 dark:text-gray-900">
          {record.totalAttendance}
        </p>
        {record.soulsWon > 0 && (
          <p className="text-sm text-pink-500">+{record.soulsWon} souls</p>
        )}
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myOrgs, setMyOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [stats, setStats] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchMyOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchStats();
    }
  }, [selectedOrg]);

  const fetchMyOrgs = async () => {
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
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/attendance/stats/${selectedOrg}`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setStats(data.stats);
        // For recent records, we'd need another endpoint or get from events
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/church/attendance`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchStats(); // Refresh stats
      } else {
        alert(data.error || 'Failed to save attendance');
      }
    } catch (err) {
      console.error('Save attendance error:', err);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Attendance - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-green-200 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Church Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Attendance
          </h1>
          <p className="text-green-100 mt-1">Record and track service attendance</p>
        </div>
      </div>

      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-gray-900 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5" />
          Attendance saved successfully!
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Organization Selector */}
        {myOrgs.length > 1 && (
          <div className="mb-6">
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
            >
              {myOrgs.map(org => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Avg Attendance"
              value={Math.round(stats.avgAttendance || 0)}
              icon={Users}
              color="purple"
            />
            <StatCard
              label="Total Services"
              value={stats.totalServices || 0}
              icon={Calendar}
              color="blue"
            />
            <StatCard
              label="Souls Won"
              value={stats.totalSoulsWon || 0}
              icon={Heart}
              color="pink"
            />
            <StatCard
              label="First Timers"
              value={stats.totalFirstTimers || 0}
              icon={UserPlus}
              color="green"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Record Form */}
          <AttendanceForm
            orgs={myOrgs}
            onSubmit={handleSubmit}
            loading={saving}
          />

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-gray-900">
              <h3 className="font-semibold text-lg mb-3">💡 Tips for Accurate Records</h3>
              <ul className="space-y-2 text-purple-100 text-sm">
                <li>• Count heads during worship for most accurate numbers</li>
                <li>• Separate first-timers from regular visitors</li>
                <li>• Include online viewers if you stream services</li>
                <li>• Record souls won during altar calls</li>
              </ul>
            </div>

            {/* Recent Records Preview */}
            <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Recent Records
              </h3>
              
              {recentRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No attendance records yet. Start by recording today's service!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentRecords.map((record, i) => (
                    <RecentRecord key={i} record={record} />
                  ))}
                </div>
              )}
            </div>

            {/* Growth Trend */}
            {stats?.weeklyTrend && stats.weeklyTrend.length > 0 && (
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Weekly Trend
                </h3>
                <div className="space-y-2">
                  {stats.weeklyTrend.slice(-6).map((week, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-20">Week {week._id?.split('-')[1]}</span>
                      <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, (week.avgAttendance / (stats.highestAttendance || 100)) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-900 w-12 text-right">
                        {Math.round(week.avgAttendance)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
