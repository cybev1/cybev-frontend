// ============================================
// FILE: src/pages/church/souls/index.jsx
// Soul Tracker - List & Manage Souls
// VERSION: 2.0.0 - Enhanced with filters
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Heart, UserPlus, Search, Filter, Phone, Mail, MapPin,
  ChevronRight, MoreVertical, Clock, CheckCircle, XCircle,
  Users, TrendingUp, Calendar, Loader2, Eye, Edit, Trash2
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Status colors
const STATUS_COLORS = {
  new: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'New' },
  contacted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Contacted' },
  followup: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Following Up' },
  attending: { bg: 'bg-green-100', text: 'text-green-700', label: 'Attending' },
  member: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Member' },
  foundation_school: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'In FS' },
  graduated: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Graduated' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive' },
  lost: { bg: 'bg-red-100', text: 'text-red-700', label: 'Lost' }
};

export default function SoulsTracker() {
  const router = useRouter();
  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchSouls();
  }, [search, statusFilter, pagination.page]);

  const fetchSouls = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`${API_URL}/api/church/souls?${params}`, getAuth());
      const data = await res.json();
      
      if (data.ok) {
        setSouls(data.souls || []);
        setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error('Fetch souls error:', err);
    }
    setLoading(false);
  };

  const totalSouls = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <AppLayout>
      <Head>
        <title>Soul Tracker | CYBEV Church</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-500" />
              Soul Tracker
            </h1>
            <p className="text-gray-500 mt-1">Track and follow up with new converts</p>
          </div>
          <Link
            href="/church/souls/add"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add New Soul
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">{totalSouls}</p>
            <p className="text-sm text-gray-500">Total Souls</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <p className="text-2xl font-bold text-yellow-700">{stats.new || 0}</p>
            <p className="text-sm text-yellow-600">New</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{stats.contacted || 0}</p>
            <p className="text-sm text-blue-600">Contacted</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-2xl font-bold text-green-700">{stats.attending || 0}</p>
            <p className="text-sm text-green-600">Attending</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-2xl font-bold text-emerald-700">{stats.member || 0}</p>
            <p className="text-sm text-emerald-600">Members</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 min-w-[150px]"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="followup">Following Up</option>
              <option value="attending">Attending</option>
              <option value="member">Member</option>
              <option value="foundation_school">In Foundation School</option>
              <option value="graduated">Graduated</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Souls List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-3" />
              <p className="text-gray-500">Loading souls...</p>
            </div>
          ) : souls.length === 0 ? (
            <div className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No souls found</h3>
              <p className="text-gray-500 mb-6">
                {search || statusFilter 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first soul to track'
                }
              </p>
              <Link
                href="/church/souls/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg"
              >
                <UserPlus className="w-4 h-4" />
                Add First Soul
              </Link>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Contact</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Added</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Soul Rows */}
              <div className="divide-y divide-gray-100">
                {souls.map(soul => (
                  <SoulRow key={soul._id} soul={soul} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                      disabled={pagination.page * pagination.limit >= pagination.total}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Soul Row Component
function SoulRow({ soul }) {
  const status = STATUS_COLORS[soul.status] || STATUS_COLORS.new;
  
  return (
    <Link
      href={`/church/souls/${soul._id}`}
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50 transition"
    >
      {/* Name */}
      <div className="md:col-span-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-semibold">
          {soul.firstName?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {soul.firstName} {soul.lastName}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {soul.salvationType?.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="md:col-span-2 flex flex-col text-sm">
        {soul.phone && (
          <span className="text-gray-600 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {soul.phone}
          </span>
        )}
        {soul.email && (
          <span className="text-gray-500 truncate flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {soul.email}
          </span>
        )}
      </div>

      {/* Location */}
      <div className="md:col-span-2 text-sm text-gray-500">
        {soul.city && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {soul.city}{soul.country ? `, ${soul.country}` : ''}
          </span>
        )}
        {soul.church && (
          <span className="text-xs text-purple-600">{soul.church.name}</span>
        )}
      </div>

      {/* Status */}
      <div className="md:col-span-2">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
        {soul.totalFollowUps > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {soul.totalFollowUps} follow-up{soul.totalFollowUps > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Added Date */}
      <div className="md:col-span-2 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(soul.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Actions */}
      <div className="md:col-span-1 flex items-center justify-end">
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}
