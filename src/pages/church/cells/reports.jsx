// ============================================
// FILE: pages/church/cells/reports.jsx
// Cell Reports - Weekly Cell Group Reports
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FileText, Users, Heart, DollarSign, BookOpen, Calendar,
  ArrowLeft, Loader2, Plus, CheckCircle, Clock, TrendingUp,
  ChevronRight, Star, MapPin, Phone, BarChart3, Download,
  Filter, Search, Eye, Edit, Trash2, Send
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function StatCard({ icon: Icon, label, value, trend, color = 'purple' }) {
  const colors = {
    purple: 'from-purple-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    pink: 'from-pink-500 to-rose-600',
    orange: 'from-orange-500 to-amber-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ReportCard({ report, onView, onEdit }) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    submitted: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            Week {report.weekNumber}, {report.year}
          </p>
          <p className="text-sm text-gray-500">{report.cell?.name || 'Cell Group'}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[report.status] || statusColors.draft}`}>
          {report.status}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{report.attendance?.members || 0}</p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{report.attendance?.visitors || 0}</p>
          <p className="text-xs text-gray-500">Visitors</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-purple-600">{report.soulsWon || 0}</p>
          <p className="text-xs text-gray-500">Souls Won</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">
            {report.offering?.currency || 'GHS'} {report.offering?.amount || 0}
          </p>
          <p className="text-xs text-gray-500">Offering</p>
        </div>
      </div>

      {report.testimonies?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Testimonies:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {report.testimonies[0].summary}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400">
          Submitted {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onView(report)}
            className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
          >
            View
          </button>
          {report.status === 'draft' && (
            <button
              onClick={() => onEdit(report)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateReportModal({ isOpen, onClose, cells, onCreate, loading, editReport }) {
  const [form, setForm] = useState({
    cellId: '',
    weekNumber: Math.ceil((new Date().getDate()) / 7),
    year: new Date().getFullYear(),
    meetingDate: new Date().toISOString().split('T')[0],
    topic: '',
    scripture: '',
    attendance: { members: 0, visitors: 0, firstTimers: 0, children: 0 },
    soulsWon: 0,
    offering: { amount: 0, currency: 'GHS' },
    testimonies: [{ summary: '', memberName: '' }],
    prayerRequests: [''],
    challenges: '',
    nextWeekPlan: '',
    notes: ''
  });

  useEffect(() => {
    if (cells.length > 0 && !form.cellId) {
      setForm(f => ({ ...f, cellId: cells[0]._id }));
    }
  }, [cells]);

  useEffect(() => {
    if (editReport) {
      setForm({
        cellId: editReport.cell?._id || editReport.cell || '',
        weekNumber: editReport.weekNumber || Math.ceil((new Date().getDate()) / 7),
        year: editReport.year || new Date().getFullYear(),
        meetingDate: editReport.meetingDate ? new Date(editReport.meetingDate).toISOString().split('T')[0] : '',
        topic: editReport.topic || '',
        scripture: editReport.scripture || '',
        attendance: editReport.attendance || { members: 0, visitors: 0, firstTimers: 0, children: 0 },
        soulsWon: editReport.soulsWon || 0,
        offering: editReport.offering || { amount: 0, currency: 'GHS' },
        testimonies: editReport.testimonies?.length > 0 ? editReport.testimonies : [{ summary: '', memberName: '' }],
        prayerRequests: editReport.prayerRequests?.length > 0 ? editReport.prayerRequests : [''],
        challenges: editReport.challenges || '',
        nextWeekPlan: editReport.nextWeekPlan || '',
        notes: editReport.notes || ''
      });
    }
  }, [editReport]);

  if (!isOpen) return null;

  const handleSubmit = (e, status = 'submitted') => {
    e.preventDefault();
    onCreate({ ...form, status }, editReport?._id);
  };

  const updateAttendance = (field, value) => {
    setForm(f => ({
      ...f,
      attendance: { ...f.attendance, [field]: parseInt(value) || 0 }
    }));
  };

  const addTestimony = () => {
    setForm(f => ({
      ...f,
      testimonies: [...f.testimonies, { summary: '', memberName: '' }]
    }));
  };

  const updateTestimony = (index, field, value) => {
    setForm(f => {
      const testimonies = [...f.testimonies];
      testimonies[index] = { ...testimonies[index], [field]: value };
      return { ...f, testimonies };
    });
  };

  const totalAttendance = Object.values(form.attendance).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            {editReport ? 'Edit Cell Report' : 'New Cell Report'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cell Group</label>
              <select
                value={form.cellId}
                onChange={(e) => setForm(f => ({ ...f, cellId: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                {cells.map(cell => (
                  <option key={cell._id} value={cell._id}>{cell.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Date</label>
              <input
                type="date"
                value={form.meetingDate}
                onChange={(e) => setForm(f => ({ ...f, meetingDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Topic & Scripture */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic Discussed</label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm(f => ({ ...f, topic: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                placeholder="e.g., Faith in Action"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scripture Reference</label>
              <input
                type="text"
                value={form.scripture}
                onChange={(e) => setForm(f => ({ ...f, scripture: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                placeholder="e.g., Hebrews 11:1-6"
              />
            </div>
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Attendance (Total: <span className="text-purple-600 font-bold">{totalAttendance}</span>)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { key: 'members', label: 'Members', color: 'purple' },
                { key: 'visitors', label: 'Visitors', color: 'blue' },
                { key: 'firstTimers', label: 'First Timers', color: 'green' },
                { key: 'children', label: 'Children', color: 'orange' }
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xs text-gray-500">{item.label}</label>
                  <input
                    type="number"
                    min="0"
                    value={form.attendance[item.key]}
                    onChange={(e) => updateAttendance(item.key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-center font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Souls Won & Offering */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Souls Won 🙏
              </label>
              <input
                type="number"
                min="0"
                value={form.soulsWon}
                onChange={(e) => setForm(f => ({ ...f, soulsWon: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Offering Collected
              </label>
              <div className="flex gap-2">
                <select
                  value={form.offering.currency}
                  onChange={(e) => setForm(f => ({ ...f, offering: { ...f.offering, currency: e.target.value } }))}
                  className="px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="GHS">GHS</option>
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.offering.amount}
                  onChange={(e) => setForm(f => ({ ...f, offering: { ...f.offering, amount: parseFloat(e.target.value) || 0 } }))}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Testimonies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Testimonies</label>
              <button
                type="button"
                onClick={addTestimony}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                + Add Testimony
              </button>
            </div>
            {form.testimonies.map((testimony, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={testimony.memberName}
                  onChange={(e) => updateTestimony(i, 'memberName', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={testimony.summary}
                  onChange={(e) => updateTestimony(i, 'summary', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Testimony summary..."
                />
              </div>
            ))}
          </div>

          {/* Challenges & Next Week */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Challenges</label>
              <textarea
                value={form.challenges}
                onChange={(e) => setForm(f => ({ ...f, challenges: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
                placeholder="Any challenges faced..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Week Plan</label>
              <textarea
                value={form.nextWeekPlan}
                onChange={(e) => setForm(f => ({ ...f, nextWeekPlan: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
                placeholder="Plans for next meeting..."
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
              placeholder="Any other notes..."
            />
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Save Draft
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'submitted')}
            disabled={loading || !form.cellId}
            className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CellReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [cells, setCells] = useState([]);
  const [stats, setStats] = useState({ total: 0, souls: 0, avgAttendance: 0, totalOffering: 0 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      // Fetch user's cells
      const orgsRes = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const orgsData = await orgsRes.json();
      if (orgsData.ok) {
        const userCells = orgsData.orgs?.filter(o => o.type === 'cell') || [];
        setCells(userCells);
      }

      // Fetch reports
      const params = new URLSearchParams({
        ...(filter !== 'all' && { status: filter })
      });
      const reportsRes = await fetch(`${API_URL}/api/church/cell-reports?${params}`, getAuth());
      const reportsData = await reportsRes.json();
      if (reportsData.ok) {
        setReports(reportsData.reports || []);
        setStats({
          total: reportsData.reports?.length || 0,
          souls: reportsData.reports?.reduce((sum, r) => sum + (r.soulsWon || 0), 0) || 0,
          avgAttendance: Math.round(
            reportsData.reports?.reduce((sum, r) => 
              sum + Object.values(r.attendance || {}).reduce((a, b) => a + b, 0), 0
            ) / (reportsData.reports?.length || 1)
          ) || 0,
          totalOffering: reportsData.reports?.reduce((sum, r) => sum + (r.offering?.amount || 0), 0) || 0
        });
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    }
    setLoading(false);
  };

  const handleCreateReport = async (formData, reportId) => {
    setActionLoading(true);
    try {
      const url = reportId
        ? `${API_URL}/api/church/cell-reports/${reportId}`
        : `${API_URL}/api/church/cell-reports`;
      
      const res = await fetch(url, {
        method: reportId ? 'PUT' : 'POST',
        ...getAuth(),
        body: JSON.stringify({
          ...formData,
          cell: formData.cellId
        })
      });

      const data = await res.json();
      if (data.ok) {
        setShowCreateModal(false);
        setEditReport(null);
        fetchData();
      } else {
        alert(data.error || 'Failed to save report');
      }
    } catch (err) {
      console.error('Create report error:', err);
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Cell Reports - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-orange-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FileText className="w-8 h-8" />
                Cell Reports
              </h1>
              <p className="text-orange-100 mt-1">Weekly cell group meeting reports</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Report
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-orange-200 text-sm">Total Reports</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.souls}</p>
              <p className="text-orange-200 text-sm">Souls Won</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.avgAttendance}</p>
              <p className="text-orange-200 text-sm">Avg Attendance</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">GHS {stats.totalOffering.toLocaleString()}</p>
              <p className="text-orange-200 text-sm">Total Offering</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All Reports' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'approved', label: 'Approved' },
            { id: 'draft', label: 'Drafts' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                filter === f.id
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Reports Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Submit your first cell report to track your group's progress
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
            >
              Create Report
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map(report => (
              <ReportCard
                key={report._id}
                report={report}
                onView={(r) => console.log('View', r)}
                onEdit={(r) => { setEditReport(r); setShowCreateModal(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateReportModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setEditReport(null); }}
        cells={cells}
        onCreate={handleCreateReport}
        loading={actionLoading}
        editReport={editReport}
      />
    </div>
  );
}
