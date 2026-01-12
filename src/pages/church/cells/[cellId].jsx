// ============================================
// FILE: /church/cells/[cellId].jsx
// PURPOSE: Cell Detail Page with Member Management
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Edit, Users, Calendar, Clock, MapPin, Phone, Mail,
  Plus, Trash2, MoreVertical, Heart, TrendingUp, FileText, User,
  Crown, Star, BookOpen, Award, UserPlus, Settings, X, Check
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const CELL_LEVELS = {
  bible_study: { name: 'Bible Study Class', icon: BookOpen, color: '#10b981' },
  cell: { name: 'Cell', icon: Users, color: '#3b82f6' },
  senior_cell: { name: 'Senior Cell', icon: Star, color: '#8b5cf6' },
  pcf: { name: 'PCF', icon: Crown, color: '#f59e0b' }
};

export default function CellDetailPage() {
  const router = useRouter();
  const { cellId, orgId } = router.query;

  const [cell, setCell] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditCell, setShowEditCell] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (cellId && orgId) {
      fetchCell();
      fetchReports();
    }
  }, [cellId, orgId]);

  const fetchCell = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/cells/${cellId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setCell(data.cell);
    } catch (err) {
      console.error('Error fetching cell:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/cell-reports?cellId=${cellId}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const getCellLevel = (memberCount) => {
    if (memberCount >= 50) return 'pcf';
    if (memberCount >= 30) return 'senior_cell';
    if (memberCount >= 15) return 'cell';
    return 'bible_study';
  };

  const removeMember = async (memberId) => {
    if (!confirm('Remove this member from the cell?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/cells/${cellId}/members/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCell();
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  if (!cell) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Cell not found</h2>
          <Link href={`/church/cells/dashboard?orgId=${orgId}`} className="text-purple-600 hover:underline">
            Back to Cell Dashboard
          </Link>
        </div>
      </AppLayout>
    );
  }

  const level = CELL_LEVELS[getCellLevel(cell.members?.length || 0)];
  const stats = {
    totalMembers: cell.members?.length || 0,
    activeMembers: cell.members?.filter(m => m.status === 'active').length || 0,
    soulsWonThisMonth: cell.stats?.soulsWonThisMonth || 0,
    reportsThisMonth: reports.length
  };

  return (
    <AppLayout>
      <Head>
        <title>{cell.name} | Cell Ministry</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <Link
              href={`/church/cells/dashboard?orgId=${orgId}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white rounded-lg mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">{cell.name}</h1>
                <span
                  className="px-3 py-1 rounded-full text-gray-900 text-sm font-medium flex items-center gap-1"
                  style={{ backgroundColor: level?.color }}
                >
                  {level && <level.icon className="w-4 h-4" />}
                  {level?.name}
                </span>
              </div>
              {cell.location && (
                <p className="text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {cell.location}
                </p>
              )}
              {cell.meetingDay && (
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" />
                  {cell.meetingDay}s at {cell.meetingTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/church/cells/reports?orgId=${orgId}&cellId=${cellId}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FileText className="w-4 h-4" />
              Reports
            </Link>
            <button
              onClick={() => setShowEditCell(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Members" value={stats.totalMembers} color={level?.color} />
          <StatCard icon={Check} label="Active Members" value={stats.activeMembers} color="#10b981" />
          <StatCard icon={Heart} label="Souls Won (Month)" value={stats.soulsWonThisMonth} color="#ef4444" />
          <StatCard icon={FileText} label="Reports (Month)" value={stats.reportsThisMonth} color="#3b82f6" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-200 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'members', label: `Members (${cell.members?.length || 0})` },
            { id: 'reports', label: 'Recent Reports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cell Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Leader Card */}
              {cell.leader && (
                <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    Cell Leader
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      {cell.leader.avatar ? (
                        <img src={cell.leader.avatar} alt="" className="w-16 h-16 rounded-full" />
                      ) : (
                        <User className="w-8 h-8 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-900 text-lg">
                        {cell.leader.name || cell.leader.username}
                      </p>
                      {cell.leader.phone && (
                        <p className="text-gray-500 flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {cell.leader.phone}
                        </p>
                      )}
                      {cell.leader.email && (
                        <p className="text-gray-500 flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {cell.leader.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {cell.description && (
                <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-3">About this Cell</h3>
                  <p className="text-gray-600 dark:text-gray-500">{cell.description}</p>
                </div>
              )}

              {/* Meeting Info */}
              <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Meeting Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Day</p>
                      <p className="font-medium">{cell.meetingDay || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{cell.meetingTime || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 col-span-2">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{cell.location || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition"
                  >
                    <UserPlus className="w-5 h-5 text-purple-600" />
                    <span>Add Member</span>
                  </button>
                  <Link
                    href={`/church/cells/reports?orgId=${orgId}&cellId=${cellId}`}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Submit Report</span>
                  </Link>
                  <Link
                    href={`/church/cells/training?orgId=${orgId}`}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition"
                  >
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>Leader Training</span>
                  </Link>
                </div>
              </div>

              {/* Growth Progress */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-gray-900">
                <h3 className="font-semibold mb-2">Growth Progress</h3>
                <p className="text-white/80 text-sm mb-4">
                  {cell.members?.length || 0} / {
                    getCellLevel(cell.members?.length || 0) === 'pcf' ? '∞' :
                    getCellLevel(cell.members?.length || 0) === 'senior_cell' ? '50' :
                    getCellLevel(cell.members?.length || 0) === 'cell' ? '30' : '15'
                  } members to next level
                </p>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${Math.min(
                        ((cell.members?.length || 0) / (
                          getCellLevel(cell.members?.length || 0) === 'pcf' ? 100 :
                          getCellLevel(cell.members?.length || 0) === 'senior_cell' ? 50 :
                          getCellLevel(cell.members?.length || 0) === 'cell' ? 30 : 15
                        )) * 100,
                        100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white dark:bg-white rounded-xl border border-gray-200 dark:border-gray-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-900">
                Members ({cell.members?.length || 0})
              </h3>
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-gray-900 rounded-lg text-sm hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            {cell.members?.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No members yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-200">
                {cell.members?.map((member, index) => (
                  <div key={member._id || index} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        {member.user?.avatar ? (
                          <img src={member.user.avatar} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <User className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-900">
                          {member.user?.name || member.user?.username || member.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.role || 'Member'}
                          {member.joinedAt && ` • Joined ${new Date(member.joinedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMember(member._id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-white rounded-xl border border-gray-200 dark:border-gray-200">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No reports yet</p>
                <Link
                  href={`/church/cells/reports?orgId=${orgId}&cellId=${cellId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Create Report
                </Link>
              </div>
            ) : (
              reports.map(report => (
                <div
                  key={report._id}
                  className="bg-white dark:bg-white rounded-xl p-5 border border-gray-200 dark:border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-900">
                        {report.meetingType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-900">
                          {report.attendance?.total || 0}
                        </p>
                        <p className="text-gray-500">Attendance</p>
                      </div>
                      {report.soulsWon > 0 && (
                        <div className="text-center">
                          <p className="text-xl font-bold text-red-500">{report.soulsWon}</p>
                          <p className="text-gray-500">Souls Won</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {report.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-500 border-t border-gray-100 dark:border-gray-200 pt-3 mt-3">
                      {report.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          cellId={cellId}
          orgId={orgId}
          onClose={() => setShowAddMember(false)}
          onSuccess={() => {
            setShowAddMember(false);
            fetchCell();
          }}
        />
      )}
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-white rounded-xl p-5 border border-gray-200 dark:border-gray-200">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function AddMemberModal({ cellId, orgId, onClose, onSuccess }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchMembers();
    }
  }, [searchQuery]);

  const searchMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/org/${orgId}/members?search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setMembers(data.members || []);
    } catch (err) {
      console.error('Error searching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedMember) return;
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/cells/${cellId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ memberId: selectedMember._id })
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error adding member:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-gray-200 dark:border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Member to Cell</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
          />

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : members.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {members.map(member => (
                <button
                  key={member._id}
                  onClick={() => setSelectedMember(member)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                    selectedMember?._id === member._id
                      ? 'bg-purple-50 border-2 border-purple-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{member.user?.name || member.user?.username}</p>
                    <p className="text-sm text-gray-500">{member.user?.email}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <p className="text-center text-gray-500 py-8">No members found</p>
          ) : (
            <p className="text-center text-gray-500 py-8">Type to search members</p>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selectedMember || saving}
              className="px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
