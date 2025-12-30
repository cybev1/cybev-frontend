// ============================================
// FILE: src/pages/admin/users.jsx
// PURPOSE: Admin User Management
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Users, ArrowLeft, Search, Filter, MoreVertical, Ban, CheckCircle, Shield, Mail, Eye, Trash2, Edit, UserPlus, Download, Loader2, ChevronLeft, ChevronRight, Crown, Star
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminUsers() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => { fetchUsers(); }, [page, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const res = await api.get(`/api/admin/users?page=${page}&filter=${filter}&search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: { users: [] } }));

      setUsers(res.data.users?.length ? res.data.users : [
        { _id: '1', name: 'John Doe', username: 'johndoe', email: 'john@example.com', role: 'user', status: 'active', verified: true, premium: false, createdAt: '2024-01-15', postsCount: 45, followersCount: 1200 },
        { _id: '2', name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com', role: 'creator', status: 'active', verified: true, premium: true, createdAt: '2024-02-20', postsCount: 128, followersCount: 5400 },
        { _id: '3', name: 'Bob Wilson', username: 'bobwilson', email: 'bob@example.com', role: 'user', status: 'suspended', verified: false, premium: false, createdAt: '2024-03-10', postsCount: 12, followersCount: 89 },
        { _id: '4', name: 'Alice Brown', username: 'alicebrown', email: 'alice@example.com', role: 'admin', status: 'active', verified: true, premium: true, createdAt: '2023-11-05', postsCount: 234, followersCount: 12500 },
        { _id: '5', name: 'Charlie Davis', username: 'charlied', email: 'charlie@example.com', role: 'creator', status: 'active', verified: true, premium: false, createdAt: '2024-04-01', postsCount: 67, followersCount: 890 },
      ]);
      setTotalPages(res.data.totalPages || 5);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (userId, action) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    try {
      await api.post(`/api/admin/users/${userId}/${action}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (err) { console.error(err); }
    setShowActionMenu(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs flex items-center gap-1"><Shield className="w-3 h-3" />Admin</span>;
      case 'creator': return <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs flex items-center gap-1"><Star className="w-3 h-3" />Creator</span>;
      default: return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">User</span>;
    }
  };

  return (
    <AppLayout>
      <Head><title>User Management - Admin - CYBEV</title></Head>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/admin"><button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ArrowLeft className="w-5 h-5" />Back to Dashboard</button></Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center"><Users className="w-7 h-7 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">User Management</h1><p className="text-gray-400">{users.length} users total</p></div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"><Download className="w-4 h-4" />Export</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"><UserPlus className="w-4 h-4" />Add User</button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'suspended', 'premium', 'creators'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg capitalize ${filter === f ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Posts</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Followers</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" /></td></tr>
                ) : users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">{user.name?.[0] || 'U'}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{user.name}</p>
                            {user.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                            {user.premium && <Crown className="w-4 h-4 text-yellow-400" />}
                          </div>
                          <p className="text-gray-400 text-sm">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(user.status)}`}>{user.status}</span></td>
                    <td className="px-6 py-4 text-gray-300">{user.postsCount || 0}</td>
                    <td className="px-6 py-4 text-gray-300">{(user.followersCount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)} className="p-2 hover:bg-gray-700 rounded-lg">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {showActionMenu === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-10 py-2">
                            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2"><Eye className="w-4 h-4" />View Profile</button>
                            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2"><Edit className="w-4 h-4" />Edit User</button>
                            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2"><Mail className="w-4 h-4" />Send Email</button>
                            {user.status === 'active' ? (
                              <button onClick={() => handleAction(user._id, 'suspend')} className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2"><Ban className="w-4 h-4" />Suspend</button>
                            ) : (
                              <button onClick={() => handleAction(user._id, 'activate')} className="w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Activate</button>
                            )}
                            <button onClick={() => handleAction(user._id, 'delete')} className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <p className="text-gray-400 text-sm">Showing page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 bg-gray-700 rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5 text-white" /></button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 bg-gray-700 rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5 text-white" /></button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
