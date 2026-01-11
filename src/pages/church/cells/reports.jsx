// ============================================
// FILE: /church/cells/reports.jsx
// PURPOSE: Enhanced Cell Reports with 4 Meeting Types
// Based on Cell Ministry Manual
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Calendar, Users, BookOpen, Heart, Mic,
  TrendingUp, Filter, Download, ChevronDown, Check, X,
  Clock, MapPin, Target, Award, UserPlus, Search
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

// 4 Weekly Meeting Types from Cell Ministry Manual
const MEETING_TYPES = [
  {
    id: 'cell_meeting',
    name: 'Cell Meeting',
    icon: Users,
    color: '#7c3aed',
    description: 'Weekly cell fellowship and Bible study',
    day: 'Varies'
  },
  {
    id: 'outreach',
    name: 'Outreach/Evangelism',
    icon: Heart,
    color: '#ef4444',
    description: 'Soul winning and community outreach',
    day: 'Saturdays'
  },
  {
    id: 'follow_up',
    name: 'Follow-up/Consolidation',
    icon: UserPlus,
    color: '#10b981',
    description: 'New convert follow-up and discipleship',
    day: 'Varies'
  },
  {
    id: 'leaders_meeting',
    name: "Leaders' Meeting",
    icon: Award,
    color: '#f59e0b',
    description: 'Cell leader training and planning',
    day: 'Monthly'
  }
];

export default function CellReportsPage() {
  const router = useRouter();
  const { orgId, cellId } = router.query;

  const [reports, setReports] = useState([]);
  const [cells, setCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState(cellId || '');
  const [selectedMeetingType, setSelectedMeetingType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [showNewReport, setShowNewReport] = useState(false);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    totalAttendance: 0,
    soulsWon: 0,
    newMembers: 0
  });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (orgId) {
      fetchCells();
      fetchReports();
    }
  }, [orgId, selectedCell, selectedMeetingType, dateRange]);

  const fetchCells = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/org/${orgId}/cells`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setCells(data.cells || []);
    } catch (err) {
      console.error('Error fetching cells:', err);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `${API}/api/church/cell-reports?orgId=${orgId}`;
      if (selectedCell) url += `&cellId=${selectedCell}`;
      if (selectedMeetingType !== 'all') url += `&meetingType=${selectedMeetingType}`;
      url += `&range=${dateRange}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setReports(data.reports || []);
        calculateStats(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reportsList) => {
    const stats = reportsList.reduce((acc, report) => ({
      totalMeetings: acc.totalMeetings + 1,
      totalAttendance: acc.totalAttendance + (report.attendance?.total || 0),
      soulsWon: acc.soulsWon + (report.soulsWon || 0),
      newMembers: acc.newMembers + (report.newMembers || 0)
    }), { totalMeetings: 0, totalAttendance: 0, soulsWon: 0, newMembers: 0 });
    setStats(stats);
  };

  const exportReports = () => {
    const headers = ['Date', 'Cell', 'Meeting Type', 'Attendance', 'First Timers', 'Souls Won', 'Offerings', 'Notes'];
    const rows = reports.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.cell?.name || '',
      MEETING_TYPES.find(m => m.id === r.meetingType)?.name || r.meetingType,
      r.attendance?.total || 0,
      r.attendance?.firstTimers || 0,
      r.soulsWon || 0,
      r.offerings || 0,
      r.notes || ''
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cell-reports-${dateRange}.csv`;
    link.click();
  };

  return (
    <AppLayout>
      <Head>
        <title>Cell Reports | CYBEV Church</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href={`/church/org/${orgId}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cell Reports</h1>
              <p className="text-gray-500">Track weekly meetings and growth</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportReports}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowNewReport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              New Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Calendar}
            label="Total Meetings"
            value={stats.totalMeetings}
            color="purple"
          />
          <StatCard
            icon={Users}
            label="Total Attendance"
            value={stats.totalAttendance}
            color="blue"
          />
          <StatCard
            icon={Heart}
            label="Souls Won"
            value={stats.soulsWon}
            color="red"
          />
          <StatCard
            icon={UserPlus}
            label="New Members"
            value={stats.newMembers}
            color="green"
          />
        </div>

        {/* Meeting Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {MEETING_TYPES.map(type => {
            const typeReports = reports.filter(r => r.meetingType === type.id);
            const isSelected = selectedMeetingType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedMeetingType(isSelected ? 'all' : type.id)}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${type.color}15` }}
                >
                  <type.icon className="w-5 h-5" style={{ color: type.color }} />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{type.name}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: type.color }}>
                  {typeReports.length}
                </p>
                <p className="text-xs text-gray-500">{type.day}</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedCell}
            onChange={(e) => setSelectedCell(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="">All Cells</option>
            {cells.map(cell => (
              <option key={cell._id} value={cell._id}>{cell.name}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 mb-6">
              Start tracking your cell meetings
            </p>
            <button
              onClick={() => setShowNewReport(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Create First Report
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => {
              const meetingType = MEETING_TYPES.find(m => m.id === report.meetingType);
              return (
                <div
                  key={report._id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${meetingType?.color || '#7c3aed'}15` }}
                      >
                        {meetingType && <meetingType.icon className="w-6 h-6" style={{ color: meetingType.color }} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {meetingType?.name || 'Meeting'}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                            {report.cell?.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {report.venue && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {report.venue}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {report.attendance?.total || 0}
                        </p>
                        <p className="text-gray-500">Attendance</p>
                      </div>
                      {report.attendance?.firstTimers > 0 && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {report.attendance.firstTimers}
                          </p>
                          <p className="text-gray-500">First Timers</p>
                        </div>
                      )}
                      {report.soulsWon > 0 && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-500">
                            {report.soulsWon}
                          </p>
                          <p className="text-gray-500">Souls Won</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {report.notes && (
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                      {report.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Report Modal */}
      {showNewReport && (
        <NewReportModal
          orgId={orgId}
          cells={cells}
          onClose={() => setShowNewReport(false)}
          onSuccess={() => {
            setShowNewReport(false);
            fetchReports();
          }}
        />
      )}
    </AppLayout>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// New Report Modal
function NewReportModal({ orgId, cells, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    cellId: '',
    meetingType: 'cell_meeting',
    date: new Date().toISOString().split('T')[0],
    venue: '',
    attendance: {
      total: 0,
      members: 0,
      firstTimers: 0,
      children: 0
    },
    soulsWon: 0,
    newMembers: 0,
    offerings: 0,
    topic: '',
    notes: '',
    testimonies: ''
  });
  const [saving, setSaving] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/cell-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          orgId
        })
      });

      const data = await res.json();
      if (data.ok) {
        onSuccess();
      } else {
        alert(data.error || 'Failed to create report');
      }
    } catch (err) {
      console.error('Error creating report:', err);
      alert('Error creating report');
    } finally {
      setSaving(false);
    }
  };

  const updateAttendance = (field, value) => {
    const newAttendance = { ...formData.attendance, [field]: parseInt(value) || 0 };
    // Auto-calculate total
    newAttendance.total = newAttendance.members + newAttendance.firstTimers + newAttendance.children;
    setFormData(prev => ({ ...prev, attendance: newAttendance }));
  };

  const selectedMeetingType = MEETING_TYPES.find(m => m.id === formData.meetingType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Cell Report</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Meeting Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meeting Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MEETING_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, meetingType: type.id }))}
                  className={`p-3 rounded-lg border-2 text-left flex items-center gap-3 transition ${
                    formData.meetingType === type.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <type.icon className="w-5 h-5" style={{ color: type.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.day}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Cell Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cell <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cellId}
                onChange={(e) => setFormData(prev => ({ ...prev, cellId: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Select Cell</option>
                {cells.map(cell => (
                  <option key={cell._id} value={cell._id}>{cell.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Venue */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Venue/Location
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
              placeholder="Meeting location"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Attendance Section */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Attendance
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Members</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance.members}
                  onChange={(e) => updateAttendance('members', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">First Timers</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance.firstTimers}
                  onChange={(e) => updateAttendance('firstTimers', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Children</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance.children}
                  onChange={(e) => updateAttendance('children', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Total</label>
                <input
                  type="number"
                  value={formData.attendance.total}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Souls & Growth */}
          {(formData.meetingType === 'outreach' || formData.meetingType === 'follow_up') && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Soul Winning Results
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Souls Won</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.soulsWon}
                    onChange={(e) => setFormData(prev => ({ ...prev, soulsWon: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">New Members Added</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.newMembers}
                    onChange={(e) => setFormData(prev => ({ ...prev, newMembers: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Topic (for Cell Meeting or Leaders Meeting) */}
          {(formData.meetingType === 'cell_meeting' || formData.meetingType === 'leaders_meeting') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {formData.meetingType === 'leaders_meeting' ? 'Training Topic' : 'Bible Study Topic'}
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Topic discussed"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          )}

          {/* Offerings */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Offerings Collected
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.offerings}
              onChange={(e) => setFormData(prev => ({ ...prev, offerings: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes/Highlights
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Key highlights, prayer points, testimonies..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Testimonies */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Testimonies
            </label>
            <textarea
              value={formData.testimonies}
              onChange={(e) => setFormData(prev => ({ ...prev, testimonies: e.target.value }))}
              placeholder="Share testimonies from this meeting..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.cellId}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
