// ============================================
// FILE: pages/church/members/index.jsx
// Member Directory - Search, Filter, Manage Members
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users, Search, Filter, UserPlus, Mail, Phone, MapPin,
  ArrowLeft, ChevronRight, MoreHorizontal, Loader2, Star,
  Shield, Edit, Trash2, Download, Upload, X, Check,
  Calendar, Award, Building2, RefreshCw
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const roleConfig = {
  pastor: { 
    label: 'Pastor', 
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-600',
    icon: Star
  },
  leader: { 
    label: 'Leader', 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Shield
  },
  admin: { 
    label: 'Admin', 
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: Shield
  },
  worker: { 
    label: 'Worker', 
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    icon: Users
  },
  member: { 
    label: 'Member', 
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-50/30 dark:text-gray-500',
    icon: Users
  }
};

function MemberCard({ member, onEdit, onRemove, isLeader }) {
  const [showMenu, setShowMenu] = useState(false);
  const config = roleConfig[member.role] || roleConfig.member;
  const RoleIcon = config.icon;
  const user = member.user || {};

  return (
    <div className="bg-white dark:bg-white rounded-xl p-4 border border-gray-100 dark:border-gray-200 hover:shadow-md transition group">
      <div className="flex items-start gap-4">
        <img
          src={user.profilePicture || '/default-avatar.png'}
          alt={user.name || 'Member'}
          className="w-14 h-14 rounded-xl object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-900 truncate">
              {user.name || user.username || 'Unknown'}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${config.color}`}>
              <RoleIcon className="w-3 h-3" />
              {config.label}
            </span>
          </div>

          {user.email && (
            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${
              member.status === 'active' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {member.status}
            </span>
          </div>
        </div>

        {isLeader && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 bg-white dark:bg-white rounded-xl shadow-lg border border-gray-100 dark:border-gray-200 py-2 w-48 z-20">
                  <button
                    onClick={() => { onEdit(member); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-100 flex items-center gap-2 text-gray-700 dark:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                    Change Role
                  </button>
                  <button
                    onClick={() => { onRemove(member); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Member
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberListItem({ member, onEdit, onRemove, isLeader }) {
  const config = roleConfig[member.role] || roleConfig.member;
  const user = member.user || {};

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-100/50 transition group">
      <img
        src={user.profilePicture || '/default-avatar.png'}
        alt={user.name || 'Member'}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
        <div className="col-span-1">
          <p className="font-medium text-gray-900 dark:text-gray-900 truncate">
            {user.name || user.username || 'Unknown'}
          </p>
        </div>
        <div className="col-span-1">
          <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
            {config.label}
          </span>
        </div>
        <div className="col-span-1 text-sm text-gray-500 truncate">
          {user.email || '-'}
        </div>
        <div className="col-span-1 text-sm text-gray-500">
          {new Date(member.joinedAt).toLocaleDateString()}
        </div>
      </div>

      {isLeader && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(member)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-100"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onRemove(member)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}

function EditRoleModal({ isOpen, member, onClose, onSave, loading }) {
  const [role, setRole] = useState(member?.role || 'member');

  useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900">
            Change Member Role
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={member?.user?.profilePicture || '/default-avatar.png'}
              alt={member?.user?.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-900">
                {member?.user?.name || member?.user?.username}
              </p>
              <p className="text-sm text-gray-500">{member?.user?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(roleConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                    role === key
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-900">{config.label}</span>
                  {role === key && (
                    <Check className="w-5 h-5 text-purple-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(member, role)}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold bg-purple-600 text-gray-900 hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddMemberModal({ isOpen, onClose, onAdd, loading }) {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('member');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900">
            Add Member
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Search User by Email or Username
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
            >
              <option value="member">Member</option>
              <option value="worker">Worker</option>
              <option value="leader">Leader</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <p className="text-sm text-gray-500">
            The user will receive an invitation to join the organization.
          </p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(search, role)}
            disabled={loading || !search}
            className="flex-1 py-3 rounded-xl font-semibold bg-purple-600 text-gray-900 hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MemberDirectory() {
  const router = useRouter();
  const { orgId } = router.query;

  const [loading, setLoading] = useState(true);
  const [myOrgs, setMyOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isLeader, setIsLeader] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (orgId && myOrgs.length > 0) {
      setSelectedOrg(orgId);
    }
  }, [orgId, myOrgs]);

  useEffect(() => {
    if (selectedOrg) {
      fetchOrgDetails();
    }
  }, [selectedOrg]);

  const fetchOrgs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const data = await res.json();
      if (data.ok && data.orgs?.length > 0) {
        setMyOrgs(data.orgs);
        if (!orgId) {
          setSelectedOrg(data.orgs[0]._id);
        }
      }
    } catch (err) {
      console.error('Fetch orgs error:', err);
    }
  };

  const fetchOrgDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/org/${selectedOrg}`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setOrg(data.org);
        setMembers(data.org.members || []);
        
        // Check if current user is leader/admin
        const userId = localStorage.getItem('userId');
        const isOrgLeader = data.org.leader?._id === userId ||
          data.org.admins?.some(a => a._id === userId || a === userId) ||
          data.org.assistantLeaders?.some(a => a._id === userId || a === userId);
        setIsLeader(isOrgLeader);
      }
    } catch (err) {
      console.error('Fetch org error:', err);
    }
    setLoading(false);
  };

  const handleEditRole = async (member, newRole) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/org/${selectedOrg}/members`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ memberId: member.user._id, role: newRole })
      });
      const data = await res.json();
      if (data.ok) {
        setShowEditModal(false);
        fetchOrgDetails();
      } else {
        alert(data.error || 'Failed to update role');
      }
    } catch (err) {
      console.error('Edit role error:', err);
    }
    setActionLoading(false);
  };

  const handleRemoveMember = async (member) => {
    if (!confirm(`Remove ${member.user?.name || 'this member'} from the organization?`)) return;
    
    // API call would go here
    alert('Member removed (API not implemented yet)');
  };

  const handleAddMember = async (email, role) => {
    setActionLoading(true);
    // API call would go here
    setTimeout(() => {
      setActionLoading(false);
      setShowAddModal(false);
      alert('Invitation sent (API not implemented yet)');
    }, 1000);
  };

  // Filter members
  const filteredMembers = members.filter(m => {
    const user = m.user || {};
    const matchesSearch = !search || 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || m.role === roleFilter;
    const isActive = m.status === 'active';
    return matchesSearch && matchesRole && isActive;
  });

  // Stats
  const roleStats = members.reduce((acc, m) => {
    if (m.status === 'active') {
      acc[m.role] = (acc[m.role] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Member Directory - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-blue-200 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8" />
                Member Directory
              </h1>
              <p className="text-blue-100 mt-1">View and manage organization members</p>
            </div>

            <div className="flex gap-3">
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="px-4 py-2 bg-white/20 rounded-xl text-gray-900 border border-white/30 focus:outline-none"
              >
                {myOrgs.map(o => (
                  <option key={o._id} value={o._id} className="text-gray-900">
                    {o.name}
                  </option>
                ))}
              </select>

              {isLeader && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{members.filter(m => m.status === 'active').length}</p>
              <p className="text-blue-200 text-sm">Total Members</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{roleStats.pastor || 0}</p>
              <p className="text-blue-200 text-sm">Pastors</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{roleStats.leader || 0}</p>
              <p className="text-blue-200 text-sm">Leaders</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{roleStats.worker || 0}</p>
              <p className="text-blue-200 text-sm">Workers</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{roleStats.member || 0}</p>
              <p className="text-blue-200 text-sm">Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-white rounded-xl p-4 border border-gray-100 dark:border-gray-200 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
          >
            <option value="">All Roles</option>
            <option value="pastor">Pastors</option>
            <option value="leader">Leaders</option>
            <option value="admin">Admins</option>
            <option value="worker">Workers</option>
            <option value="member">Members</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-200 dark:border-gray-300 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 'text-gray-500'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 'text-gray-500'}`}
            >
              List
            </button>
          </div>

          <button
            onClick={fetchOrgDetails}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>

          <button className="px-4 py-2 border border-gray-200 dark:border-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-100 flex items-center gap-2 text-gray-600 dark:text-gray-600">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Member List */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white dark:bg-white rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-200">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900 mb-2">
              {search || roleFilter ? 'No Members Found' : 'No Members Yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || roleFilter 
                ? 'Try adjusting your search or filters'
                : 'Start building your congregation by adding members'
              }
            </p>
            {isLeader && !search && !roleFilter && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-purple-600 text-gray-900 rounded-xl font-semibold hover:bg-purple-700"
              >
                Add First Member
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, i) => (
              <MemberCard
                key={i}
                member={member}
                isLeader={isLeader}
                onEdit={(m) => { setEditingMember(m); setShowEditModal(true); }}
                onRemove={handleRemoveMember}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-white rounded-2xl border border-gray-100 dark:border-gray-200 overflow-hidden">
            {/* List Header */}
            <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-100 text-sm font-medium text-gray-500 border-b border-gray-100 dark:border-gray-200">
              <div className="pl-14">Name</div>
              <div>Role</div>
              <div>Email</div>
              <div>Joined</div>
            </div>
            {/* List Items */}
            <div className="divide-y divide-gray-100 dark:divide-gray-200">
              {filteredMembers.map((member, i) => (
                <MemberListItem
                  key={i}
                  member={member}
                  isLeader={isLeader}
                  onEdit={(m) => { setEditingMember(m); setShowEditModal(true); }}
                  onRemove={handleRemoveMember}
                />
              ))}
            </div>
          </div>
        )}

        {/* Count */}
        {filteredMembers.length > 0 && (
          <p className="text-center text-gray-500 mt-6">
            Showing {filteredMembers.length} of {members.filter(m => m.status === 'active').length} members
          </p>
        )}
      </div>

      {/* Modals */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMember}
        loading={actionLoading}
      />

      <EditRoleModal
        isOpen={showEditModal}
        member={editingMember}
        onClose={() => { setShowEditModal(false); setEditingMember(null); }}
        onSave={handleEditRole}
        loading={actionLoading}
      />
    </div>
  );
}
