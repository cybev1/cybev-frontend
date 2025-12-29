// ============================================
// FILE: src/pages/admin/users.jsx
// Admin User Management
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { adminAPI } from '@/lib/api';
import { 
  Users, Search, Filter, MoreVertical, Shield, ShieldOff,
  Trash2, Mail, Calendar, Eye, Edit, ChevronLeft, ChevronRight,
  UserCheck, UserX, AlertTriangle, RefreshCw, LogIn, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', role: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [authState, setAuthState] = useState('checking'); // 'checking', 'authenticated', 'not-logged-in', 'not-admin'

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (authState === 'authenticated' && pagination.page) {
      fetchUsers();
    }
  }, [authState, pagination.page, search, filters]);

  const checkAdminAccess = () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        setAuthState('not-logged-in');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      
      if (user.role !== 'admin' && !user.isAdmin) {
        setAuthState('not-admin');
        setLoading(false);
        return;
      }

      setAuthState('authenticated');
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState('not-logged-in');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search,
        ...filters
      });

      if (response.data.ok) {
        setUsers(response.data.users);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, user) => {
    setActionLoading(true);
    try {
      switch (action) {
        case 'ban':
          await adminAPI.updateUser(user._id, { isBanned: true });
          toast.success(`${user.name || user.username} has been banned`);
          break;
        case 'unban':
          await adminAPI.updateUser(user._id, { isBanned: false });
          toast.success(`${user.name || user.username} has been unbanned`);
          break;
        case 'makeAdmin':
          await adminAPI.updateUser(user._id, { role: 'admin' });
          toast.success(`${user.name || user.username} is now an admin`);
          break;
        case 'removeAdmin':
          await adminAPI.updateUser(user._id, { role: 'user' });
          toast.success(`Admin role removed from ${user.name || user.username}`);
          break;
        case 'verify':
          await adminAPI.updateUser(user._id, { isEmailVerified: true });
          toast.success(`${user.name || user.username} email verified`);
          break;
        case 'delete':
          if (confirm(`Are you sure you want to delete ${user.name || user.username}? This cannot be undone.`)) {
            await adminAPI.deleteUser(user._id, true);
            toast.success('User deleted');
          }
          break;
      }
      fetchUsers();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setActionLoading(false);
      setShowModal(false);
    }
  };

  // Not logged in
  if (authState === 'not-logged-in') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-purple-500/30 max-w-md">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 mb-6">Please log in to access user management</p>
          <Link href="/auth/login">
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mx-auto">
              <LogIn className="w-5 h-5" />
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Not admin
  if (authState === 'not-admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-red-500/30 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have admin privileges</p>
          <Link href="/feed">
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Go to Feed
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Still checking
  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Checking access...</p>
        </div>
      </div>
    );
  }

  const UserRow = ({ user }) => (
    <tr className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name?.charAt(0) || user.username?.charAt(0) || '?'
            )}
          </div>
          <div>
            <p className="text-white font-medium">{user.name || 'No name'}</p>
            <p className="text-gray-400 text-sm">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-gray-300 text-sm">{user.email}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          {(user.role === 'admin' || user.isAdmin) && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
              Admin
            </span>
          )}
          {user.isEmailVerified && (
            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">
              Verified
            </span>
          )}
          {user.isBanned && (
            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-medium">
              Banned
            </span>
          )}
          {user.role !== 'admin' && !user.isAdmin && !user.isEmailVerified && !user.isBanned && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs font-medium">
              User
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-gray-400 text-sm">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedUser(user); setShowModal(true); }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Actions"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          <Link href={`/profile/${user.username}`}>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View Profile">
              <Eye className="w-4 h-4 text-gray-400" />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Head>
        <title>User Management - CYBEV Admin</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <div className="bg-gray-900/50 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    User Management
                  </h1>
                  <p className="text-gray-400 text-sm">{pagination.total || 0} total users</p>
                </div>
              </div>
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search & Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name, email, or username..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="banned">Banned</option>
            </select>

            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800/30 rounded-xl border border-purple-500/20 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Joined</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <UserRow key={user._id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-white px-4">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">
                Manage {selectedUser.name || selectedUser.username}
              </h3>
              
              <div className="space-y-3">
                {!selectedUser.isBanned ? (
                  <button
                    onClick={() => handleAction('ban', selectedUser)}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                  >
                    <UserX className="w-5 h-5" />
                    Ban User
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction('unban', selectedUser)}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                  >
                    <UserCheck className="w-5 h-5" />
                    Unban User
                  </button>
                )}

                {selectedUser.role !== 'admin' && !selectedUser.isAdmin ? (
                  <button
                    onClick={() => handleAction('makeAdmin', selectedUser)}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction('removeAdmin', selectedUser)}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
                  >
                    <ShieldOff className="w-5 h-5" />
                    Remove Admin
                  </button>
                )}

                {!selectedUser.isEmailVerified && (
                  <button
                    onClick={() => handleAction('verify', selectedUser)}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    Verify Email
                  </button>
                )}

                <button
                  onClick={() => handleAction('delete', selectedUser)}
                  disabled={actionLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete User & Content
                </button>
              </div>

              <button
                onClick={() => { setShowModal(false); setSelectedUser(null); }}
                className="w-full mt-4 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
