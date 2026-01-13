// ============================================
// FILE: src/pages/admin/users/index.jsx
// Admin Users Management Page - Full CRUD
// VERSION: 2.1 - Email Verification Status & Reminders
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users, Search, ChevronLeft, ChevronRight, MoreVertical,
  Ban, CheckCircle, Shield, Eye, RefreshCw,
  UserCheck, UserX, Crown, Download, X,
  Mail, Coins, Calendar, Clock, AlertTriangle, Send, XCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AppLayout from '@/components/Layout/AppLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const ROLES = [
  { value: 'user', label: 'User', color: 'bg-gray-100 text-gray-700' },
  { value: 'creator', label: 'Creator', color: 'bg-blue-100 text-blue-700' },
  { value: 'moderator', label: 'Moderator', color: 'bg-orange-100 text-orange-700' },
  { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700' }
];

const STATUS_FILTERS = [
  { value: '', label: 'All Users' },
  { value: 'active', label: 'Active' },
  { value: 'verified', label: 'Email Verified' },
  { value: 'unverified', label: 'Email Unverified' },
  { value: 'banned', label: 'Banned' }
];

// User Detail Modal
function UserModal({ user, onClose, onAction }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7c3aed&color=fff`}
              alt="" className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                {user.name || user.username}
                {user.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
              </h4>
              <p className="text-gray-500">@{user.username}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ROLES.find(r => r.value === user.role)?.color || 'bg-gray-100 text-gray-700'}`}>
                  {user.role || 'user'}
                </span>
                {user.isBanned && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Banned</span>}
                {user.isEmailVerified ? (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Email Verified</span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Email Unverified</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6 text-sm">
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{user.email}</span></div>
            <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-600">Joined {new Date(user.createdAt).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-3"><Coins className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{user.tokenBalance?.toLocaleString() || 0} tokens</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href={`/profile/${user.username}`} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50">
              <Eye className="w-4 h-4" /> View Profile
            </Link>
            
            {!user.isEmailVerified && (
              <button onClick={() => { onAction('sendReminder', user._id); }} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200">
                <Send className="w-4 h-4" /> Send Reminder
              </button>
            )}
            
            {!user.isVerified && (
              <button onClick={() => { onAction('verify', user._id); onClose(); }} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200">
                <CheckCircle className="w-4 h-4" /> Verify Badge
              </button>
            )}
            
            {user.role !== 'admin' && (
              <button onClick={() => { onAction('makeAdmin', user._id); onClose(); }} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200">
                <Crown className="w-4 h-4" /> Make Admin
              </button>
            )}
            
            {user.isBanned ? (
              <button onClick={() => { onAction('unban', user._id); onClose(); }} className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200">
                <UserCheck className="w-4 h-4" /> Unban User
              </button>
            ) : (
              <button onClick={() => { onAction('ban', user._id); onClose(); }} className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200">
                <Ban className="w-4 h-4" /> Ban User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [summary, setSummary] = useState({ totalUnverified: 0, totalBanned: 0, totalVerified: 0 });

  useEffect(() => { checkAdmin(); }, []);
  useEffect(() => { if (!loading) fetchUsers(); }, [page, roleFilter, statusFilter, sortBy, sortOrder]);
  useEffect(() => {
    const timer = setTimeout(() => { if (!loading) { setPage(1); fetchUsers(); } }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const checkAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role !== 'admin' && !user.isAdmin) { toast.error('Admin access required'); router.push('/feed'); return; }
      }
      await fetchUsers();
    } catch { router.push('/feed'); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(), limit: '20', sort: sortBy, order: sortOrder,
        ...(search && { search }), ...(roleFilter && { role: roleFilter }), ...(statusFilter && { status: statusFilter })
      });
      const response = await axios.get(`${API_URL}/api/admin-analytics/users/list?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || { total: 0, pages: 1 });
      if (response.data.summary) setSummary(response.data.summary);
    } catch (error) {
      console.error('Fetch users error:', error);
      if (error.response?.status === 403) { toast.error('Admin access required'); router.push('/feed'); }
    } finally { setLoading(false); }
  };

  const handleAction = async (action, userId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      switch (action) {
        case 'ban':
          const reason = prompt('Enter ban reason:');
          if (!reason) return;
          await axios.post(`${API_URL}/api/admin-analytics/users/${userId}/ban`, { reason }, { headers });
          toast.success('User banned');
          break;
        case 'unban':
          await axios.post(`${API_URL}/api/admin-analytics/users/${userId}/unban`, {}, { headers });
          toast.success('User unbanned');
          break;
        case 'verify':
          await axios.post(`${API_URL}/api/admin-analytics/users/${userId}/verify`, {}, { headers });
          toast.success('User verified');
          break;
        case 'makeAdmin':
          if (!confirm('Make this user an admin?')) return;
          await axios.post(`${API_URL}/api/admin-analytics/users/${userId}/role`, { role: 'admin' }, { headers });
          toast.success('User is now an admin');
          break;
        case 'makeModerator':
          await axios.post(`${API_URL}/api/admin-analytics/users/${userId}/role`, { role: 'moderator' }, { headers });
          toast.success('User is now a moderator');
          break;
        case 'removeRole':
          await axios.post(`${API_URL}/api/admin-analytics/users/${userId}/role`, { role: 'user' }, { headers });
          toast.success('Role removed');
          break;
        case 'sendReminder':
          await axios.post(`${API_URL}/api/admin-analytics/users/${userId}/send-verification-reminder`, {}, { headers });
          toast.success('Verification reminder sent!');
          break;
      }
      setShowActions(null);
      fetchUsers();
    } catch (error) { toast.error(error.response?.data?.error || 'Action failed'); }
  };

  const sendBulkReminders = async () => {
    if (!confirm(`Send verification reminders to ${summary.totalUnverified} unverified users?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/admin-analytics/users/send-bulk-verification-reminders`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Sent ${res.data.sent} reminders!`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reminders');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Username', 'Email', 'Role', 'Status', 'Email Verified', 'Joined'],
      ...users.map(u => [u.name || '', u.username, u.email, u.role || 'user', u.isBanned ? 'Banned' : 'Active', u.isEmailVerified ? 'Yes' : 'No', new Date(u.createdAt).toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybev-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Users exported');
  };

  return (
    <AppLayout>
      <Head><title>User Management | CYBEV Admin</title></Head>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin"><button className="p-2 hover:bg-gray-100 rounded-xl"><ChevronLeft className="w-5 h-5" /></button></Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-7 h-7 text-purple-600" /> User Management
              </h1>
              <p className="text-gray-500 text-sm">{pagination.total} total users</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchUsers} className="p-2.5 hover:bg-gray-100 rounded-xl" title="Refresh">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={exportUsers} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Email Verified</p>
                <p className="text-2xl font-bold text-green-600">{summary.totalVerified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-yellow-200 bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm">Unverified</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.totalUnverified}</p>
              </div>
              <button onClick={sendBulkReminders} className="p-2 bg-yellow-200 rounded-lg hover:bg-yellow-300" title="Send bulk reminders">
                <Send className="w-5 h-5 text-yellow-700" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Banned</p>
                <p className="text-2xl font-bold text-red-600">{summary.totalBanned}</p>
              </div>
              <Ban className="w-8 h-8 text-red-200" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name, email, or username..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
              <option value="">All Roles</option>
              {ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
              {STATUS_FILTERS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [s, o] = e.target.value.split('-'); setSortBy(s); setSortOrder(o); }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center"><RefreshCw className="w-8 h-8 text-purple-600 animate-spin" /></div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email Verified</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7c3aed&color=fff`}
                            alt="" className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-1">
                              {user.name || user.username}
                              {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                            </p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ROLES.find(r => r.value === user.role)?.color || 'bg-gray-100 text-gray-700'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isBanned ? (
                          <span className="flex items-center gap-1 text-sm text-red-600"><Ban className="w-4 h-4" /> Banned</span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-green-600"><UserCheck className="w-4 h-4" /> Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.isEmailVerified ? (
                          <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Verified</span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-yellow-600"><XCircle className="w-4 h-4" /> Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowActions(showActions === user._id ? null : user._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        {showActions === user._id && (
                          <div className="absolute right-6 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                            <Link href={`/profile/${user.username}`}>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Eye className="w-4 h-4" /> View Profile
                              </button>
                            </Link>
                            {!user.isEmailVerified && (
                              <button onClick={() => handleAction('sendReminder', user._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-yellow-600">
                                <Send className="w-4 h-4" /> Send Verification Email
                              </button>
                            )}
                            {!user.isVerified && (
                              <button onClick={() => handleAction('verify', user._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600">
                                <CheckCircle className="w-4 h-4" /> Verify Badge
                              </button>
                            )}
                            {user.role !== 'admin' && (
                              <button onClick={() => handleAction('makeAdmin', user._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-purple-600">
                                <Crown className="w-4 h-4" /> Make Admin
                              </button>
                            )}
                            {user.role !== 'moderator' && user.role !== 'admin' && (
                              <button onClick={() => handleAction('makeModerator', user._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-orange-600">
                                <Shield className="w-4 h-4" /> Make Moderator
                              </button>
                            )}
                            {(user.role === 'admin' || user.role === 'moderator') && (
                              <button onClick={() => handleAction('removeRole', user._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-600">
                                <UserX className="w-4 h-4" /> Remove Role
                              </button>
                            )}
                            <div className="border-t border-gray-200 my-1" />
                            {user.isBanned ? (
                              <button onClick={() => handleAction('unban', user._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600">
                                <UserCheck className="w-4 h-4" /> Unban User
                              </button>
                            ) : (
                              <button onClick={() => handleAction('ban', user._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                <Ban className="w-4 h-4" /> Ban User
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {pagination.pages}</span>
            <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page === pagination.pages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 flex items-center gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onAction={handleAction} />}

        {/* Click outside to close actions */}
        {showActions && <div className="fixed inset-0 z-40" onClick={() => setShowActions(null)} />}
      </div>
    </AppLayout>
  );
}
