// ============================================
// FILE: src/pages/admin/users/index.jsx
// Admin Users Management Page
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users, Search, Filter, ChevronLeft, ChevronRight, MoreVertical,
  Ban, CheckCircle, Shield, Trash2, Mail, Eye, RefreshCw,
  UserCheck, UserX, Crown, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const ROLES = [
  { value: 'user', label: 'User', color: 'bg-gray-500' },
  { value: 'creator', label: 'Creator', color: 'bg-blue-500' },
  { value: 'moderator', label: 'Moderator', color: 'bg-orange-500' },
  { value: 'admin', label: 'Admin', color: 'bg-purple-500' }
];

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page,
        limit: 20,
        sort: sortBy,
        order: sortOrder,
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter })
      });

      const response = await axios.get(`${API_URL}/api/admin-analytics/users/list?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(response.data.users || []);
      setPagination(response.data.pagination || { total: 0, pages: 1 });
    } catch (error) {
      console.error('Fetch users error:', error);
      if (error.response?.status === 403) {
        toast.error('Admin access required');
        router.push('/feed');
      }
    } finally {
      setLoading(false);
    }
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
      }

      setShowActions(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Action failed');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>User Management | CYBEV Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  User Management
                </h1>
              </div>
              <button
                onClick={fetchUsers}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or username..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <option value="">All Roles</option>
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s);
                  setSortOrder(o);
                  setPage(1);
                }}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="lastActive-desc">Recently Active</option>
              </select>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span>Showing {users.length} of {pagination.total} users</span>
            <span>Page {page} of {pagination.pages}</span>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600" />
                <p className="mt-2 text-gray-500">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7c3aed&color=fff`}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                {user.name}
                                {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                              </p>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                            ROLES.find(r => r.value === user.role)?.color || 'bg-gray-500'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isBanned ? (
                            <span className="flex items-center gap-1 text-sm text-red-600">
                              <Ban className="w-4 h-4" /> Banned
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-green-600">
                              <UserCheck className="w-4 h-4" /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="text-purple-600 font-medium">
                            {user.tokenBalance?.toLocaleString() || 0} tokens
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <button
                            onClick={() => setShowActions(showActions === user._id ? null : user._id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>

                          {/* Actions Dropdown */}
                          {showActions === user._id && (
                            <div className="absolute right-6 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                              <Link href={`/profile/${user.username}`}>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                  <Eye className="w-4 h-4" /> View Profile
                                </button>
                              </Link>
                              
                              {!user.isVerified && (
                                <button
                                  onClick={() => handleAction('verify', user._id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-blue-600"
                                >
                                  <CheckCircle className="w-4 h-4" /> Verify User
                                </button>
                              )}

                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleAction('makeAdmin', user._id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-purple-600"
                                >
                                  <Crown className="w-4 h-4" /> Make Admin
                                </button>
                              )}

                              {user.role !== 'moderator' && user.role !== 'admin' && (
                                <button
                                  onClick={() => handleAction('makeModerator', user._id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-orange-600"
                                >
                                  <Shield className="w-4 h-4" /> Make Moderator
                                </button>
                              )}

                              {(user.role === 'admin' || user.role === 'moderator') && (
                                <button
                                  onClick={() => handleAction('removeRole', user._id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-600"
                                >
                                  <UserX className="w-4 h-4" /> Remove Role
                                </button>
                              )}

                              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                              {user.isBanned ? (
                                <button
                                  onClick={() => handleAction('unban', user._id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-green-600"
                                >
                                  <UserCheck className="w-4 h-4" /> Unban User
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction('ban', user._id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                                >
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
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <div className="flex gap-1">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        page === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

        {/* Click outside to close actions */}
        {showActions && (
          <div className="fixed inset-0 z-40" onClick={() => setShowActions(null)} />
        )}
      </div>
    </>
  );
}
