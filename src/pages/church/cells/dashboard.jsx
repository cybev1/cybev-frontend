// ============================================
// FILE: /church/cells/dashboard.jsx
// PURPOSE: Cell Ministry Dashboard
// Cell Structure: Bible Study Class → Cell → Senior Cell → PCF
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Users, BookOpen, TrendingUp, Target, Award,
  ChevronRight, Calendar, Heart, MapPin, Phone, Mail, Edit,
  MoreVertical, UserPlus, Star, Clock, ArrowUpRight, FileText,
  Layers, Crown, User
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

// Cell Structure Hierarchy
const CELL_LEVELS = [
  {
    id: 'bible_study',
    name: 'Bible Study Class',
    description: 'Entry point for new believers (3-15 members)',
    icon: BookOpen,
    color: '#10b981',
    minMembers: 3,
    maxMembers: 15
  },
  {
    id: 'cell',
    name: 'Cell',
    description: 'Growing fellowship unit (15-30 members)',
    icon: Users,
    color: '#3b82f6',
    minMembers: 15,
    maxMembers: 30
  },
  {
    id: 'senior_cell',
    name: 'Senior Cell',
    description: 'Mature cells ready to multiply (30-50 members)',
    icon: Star,
    color: '#8b5cf6',
    minMembers: 30,
    maxMembers: 50
  },
  {
    id: 'pcf',
    name: 'PCF (Pastors Cell Fellowship)',
    description: 'Network of cells under a PCF Leader (50+ members)',
    icon: Crown,
    color: '#f59e0b',
    minMembers: 50,
    maxMembers: null
  }
];

export default function CellDashboard() {
  const router = useRouter();
  const { orgId } = router.query;

  const [cells, setCells] = useState([]);
  const [stats, setStats] = useState({
    totalCells: 0,
    totalMembers: 0,
    activeLeaders: 0,
    soulsWonThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showNewCell, setShowNewCell] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (orgId) {
      fetchCells();
    }
  }, [orgId]);

  const fetchCells = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/org/${orgId}/cells`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setCells(data.cells || []);
        calculateStats(data.cells || []);
      }
    } catch (err) {
      console.error('Error fetching cells:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (cellsList) => {
    setStats({
      totalCells: cellsList.length,
      totalMembers: cellsList.reduce((sum, c) => sum + (c.members?.length || 0), 0),
      activeLeaders: cellsList.filter(c => c.leader).length,
      soulsWonThisMonth: cellsList.reduce((sum, c) => sum + (c.stats?.soulsWonThisMonth || 0), 0)
    });
  };

  const getCellLevel = (memberCount) => {
    if (memberCount >= 50) return 'pcf';
    if (memberCount >= 30) return 'senior_cell';
    if (memberCount >= 15) return 'cell';
    return 'bible_study';
  };

  const filteredCells = cells.filter(cell => {
    if (selectedLevel === 'all') return true;
    const level = getCellLevel(cell.members?.length || 0);
    return level === selectedLevel;
  });

  // Group cells by level
  const cellsByLevel = CELL_LEVELS.reduce((acc, level) => {
    acc[level.id] = cells.filter(c => getCellLevel(c.members?.length || 0) === level.id);
    return acc;
  }, {});

  return (
    <AppLayout>
      <Head>
        <title>Cell Ministry Dashboard | CYBEV Church</title>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cell Ministry</h1>
              <p className="text-gray-500">Manage cells and track growth</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/church/cells/reports?orgId=${orgId}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FileText className="w-4 h-4" />
              Reports
            </Link>
            <button
              onClick={() => setShowNewCell(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              New Cell
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Layers}
            label="Total Cells"
            value={stats.totalCells}
            color="purple"
          />
          <StatCard
            icon={Users}
            label="Total Members"
            value={stats.totalMembers}
            color="blue"
          />
          <StatCard
            icon={Crown}
            label="Active Leaders"
            value={stats.activeLeaders}
            color="amber"
          />
          <StatCard
            icon={Heart}
            label="Souls Won (Month)"
            value={stats.soulsWonThisMonth}
            color="red"
          />
        </div>

        {/* Cell Structure Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Cell Structure Overview
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {CELL_LEVELS.map((level, index) => (
              <div key={level.id} className="flex items-center">
                <button
                  onClick={() => setSelectedLevel(selectedLevel === level.id ? 'all' : level.id)}
                  className={`flex flex-col items-center p-4 rounded-xl transition min-w-[140px] ${
                    selectedLevel === level.id
                      ? 'bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${level.color}15` }}
                  >
                    <level.icon className="w-7 h-7" style={{ color: level.color }} />
                  </div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white text-center">
                    {level.name}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: level.color }}>
                    {cellsByLevel[level.id]?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    {level.minMembers}-{level.maxMembers || '∞'} members
                  </p>
                </button>
                {index < CELL_LEVELS.length - 1 && (
                  <ChevronRight className="w-6 h-6 text-gray-300 mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              selectedLevel === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Cells ({cells.length})
          </button>
          {CELL_LEVELS.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition flex items-center gap-2 ${
                selectedLevel === level.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedLevel === level.id ? level.color : undefined
              }}
            >
              <level.icon className="w-4 h-4" />
              {level.name} ({cellsByLevel[level.id]?.length || 0})
            </button>
          ))}
        </div>

        {/* Cells List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCells.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No cells found
            </h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first cell
            </p>
            <button
              onClick={() => setShowNewCell(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Create Cell
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCells.map(cell => {
              const level = CELL_LEVELS.find(l => l.id === getCellLevel(cell.members?.length || 0));
              const progressToNext = level?.maxMembers
                ? ((cell.members?.length || 0) / level.maxMembers) * 100
                : 100;

              return (
                <Link
                  key={cell._id}
                  href={`/church/cells/${cell._id}?orgId=${orgId}`}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition group"
                >
                  {/* Header with Level Color */}
                  <div
                    className="h-2"
                    style={{ backgroundColor: level?.color || '#7c3aed' }}
                  />

                  <div className="p-5">
                    {/* Cell Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {cell.name}
                          </h3>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: level?.color }}
                          >
                            {level?.name}
                          </span>
                        </div>
                        {cell.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cell.location}
                          </p>
                        )}
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${level?.color}15` }}
                      >
                        {level && <level.icon className="w-5 h-5" style={{ color: level.color }} />}
                      </div>
                    </div>

                    {/* Leader Info */}
                    {cell.leader && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          {cell.leader.avatar ? (
                            <img src={cell.leader.avatar} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <User className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {cell.leader.name || cell.leader.username}
                          </p>
                          <p className="text-xs text-gray-500">Cell Leader</p>
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm mb-4">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{cell.members?.length || 0} members</span>
                      </div>
                      {cell.meetingDay && (
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{cell.meetingDay}s</span>
                        </div>
                      )}
                    </div>

                    {/* Progress to Next Level */}
                    {level?.maxMembers && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress to {CELL_LEVELS[CELL_LEVELS.indexOf(level) + 1]?.name || 'Growth'}</span>
                          <span>{cell.members?.length || 0}/{level.maxMembers}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(progressToNext, 100)}%`,
                              backgroundColor: level.color
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Hint */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                      <span className="text-gray-500">View Details</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Growth Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Cell Growth Pathway</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {CELL_LEVELS.map((level, index) => (
              <div key={level.id} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <level.icon className="w-5 h-5" />
                  <span className="font-medium">{level.name}</span>
                </div>
                <p className="text-sm text-white/80">{level.description}</p>
                {index < CELL_LEVELS.length - 1 && (
                  <p className="text-xs mt-2 text-white/60">
                    → Grows into {CELL_LEVELS[index + 1].name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Cell Modal */}
      {showNewCell && (
        <NewCellModal
          orgId={orgId}
          onClose={() => setShowNewCell(false)}
          onSuccess={() => {
            setShowNewCell(false);
            fetchCells();
          }}
        />
      )}
    </AppLayout>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600'
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

// New Cell Modal
function NewCellModal({ orgId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    meetingDay: 'Wednesday',
    meetingTime: '18:00',
    leaderId: ''
  });
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/org/${orgId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setMembers(data.members || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/org/${orgId}/cells`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.ok) {
        onSuccess();
      } else {
        alert(data.error || 'Failed to create cell');
      }
    } catch (err) {
      console.error('Error creating cell:', err);
    } finally {
      setSaving(false);
    }
  };

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Cell</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cell Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="e.g., Grace Cell, Victory Cell"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              placeholder="Brief description of the cell"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location/Area
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Meeting location or area"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meeting Day
              </label>
              <select
                value={formData.meetingDay}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingDay: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                {weekdays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meeting Time
              </label>
              <input
                type="time"
                value={formData.meetingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cell Leader
            </label>
            <select
              value={formData.leaderId}
              onChange={(e) => setFormData(prev => ({ ...prev, leaderId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="">Select a leader</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.user?.name || member.user?.username || member.user?.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.name}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Cell'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
