// ============================================
// FILE: pages/church/souls/index.jsx
// Soul Tracker - List and Manage Souls
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Heart, UserPlus, Search, Filter, Phone, Mail, MapPin,
  Calendar, ChevronRight, MoreHorizontal, Loader2, Users,
  CheckCircle, Clock, AlertCircle, XCircle, GraduationCap,
  TrendingUp, Download, Upload, RefreshCw
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: UserPlus },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Phone },
  followup: { label: 'Follow-up', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Clock },
  attending: { label: 'Attending', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  member: { label: 'Member', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-600', icon: Users },
  foundation_school: { label: 'Foundation School', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: GraduationCap },
  graduated: { label: 'Graduated', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: GraduationCap },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700 dark:bg-gray-50/30 dark:text-gray-500', icon: AlertCircle },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
};

function SoulCard({ soul, onClick }) {
  const status = statusConfig[soul.status] || statusConfig.new;
  const StatusIcon = status.icon;

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-white rounded-xl p-4 border border-gray-100 dark:border-gray-200 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-gray-900 font-bold text-lg flex-shrink-0">
          {soul.firstName?.[0]}{soul.lastName?.[0] || ''}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-900 group-hover:text-purple-600 transition truncate">
              {soul.firstName} {soul.lastName}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {soul.phone}
            </span>
            {soul.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {soul.city}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(soul.salvationDate).toLocaleDateString()}
            </span>
            {soul.cell && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {soul.cell.name}
              </span>
            )}
            {soul.followUps?.length > 0 && (
              <span className="text-green-500">
                {soul.followUps.length} follow-ups
              </span>
            )}
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-500 transition flex-shrink-0" />
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-white rounded-xl p-4 border border-gray-100 dark:border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-gray-900" />
        </div>
      </div>
    </div>
  );
}

export default function SoulTracker() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [souls, setSouls] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [myOrgs, setMyOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchMyOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchSouls();
    }
  }, [selectedOrg, statusFilter, page, search]);

  const fetchMyOrgs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const data = await res.json();
      if (data.ok && data.orgs?.length > 0) {
        setMyOrgs(data.orgs);
        setSelectedOrg(data.orgs[0]._id);
      }
    } catch (err) {
      console.error('Fetch orgs error:', err);
    }
  };

  const fetchSouls = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        orgId: selectedOrg,
        page,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search })
      });

      const res = await fetch(`${API_URL}/api/church/souls?${params}`, getAuth());
      const data = await res.json();
      
      if (data.ok) {
        setSouls(data.souls || []);
        setStats(data.statusBreakdown || {});
        setPagination(data.pagination || { total: 0, pages: 1 });
      }
    } catch (err) {
      console.error('Fetch souls error:', err);
    }
    setLoading(false);
  };

  const totalSouls = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Soul Tracker - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-pink-200 text-sm mb-2">
                <Link href="/church" className="hover:text-gray-900">Church</Link>
                <ChevronRight className="w-4 h-4" />
                <span>Soul Tracker</span>
              </div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Heart className="w-8 h-8" />
                Soul Tracker
              </h1>
              <p className="text-pink-100 mt-1">Track and follow up with new converts</p>
            </div>
            
            <Link href="/church/souls/add">
              <button className="px-6 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:bg-pink-50 flex items-center gap-2 shadow-lg">
                <UserPlus className="w-5 h-5" />
                Add Soul
              </button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{totalSouls}</p>
              <p className="text-pink-200 text-sm">Total Souls</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.new || 0}</p>
              <p className="text-pink-200 text-sm">New</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.followup || 0}</p>
              <p className="text-pink-200 text-sm">In Follow-up</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.attending || 0}</p>
              <p className="text-pink-200 text-sm">Attending</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.graduated || 0}</p>
              <p className="text-pink-200 text-sm">Graduated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white dark:bg-white rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-200">
          <div className="flex flex-wrap gap-4">
            {/* Organization Select */}
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
            >
              {myOrgs.map(org => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="followup">Follow-up</option>
              <option value="attending">Attending</option>
              <option value="member">Member</option>
              <option value="foundation_school">Foundation School</option>
              <option value="graduated">Graduated</option>
              <option value="inactive">Inactive</option>
              <option value="lost">Lost</option>
            </select>

            <button
              onClick={fetchSouls}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Status Quick Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              !statusFilter 
                ? 'bg-purple-600 text-white' 
                : 'bg-white dark:bg-white text-gray-600 dark:text-gray-600 border border-gray-200 dark:border-gray-200 hover:border-purple-300'
            }`}
          >
            All ({totalSouls})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-1 ${
                statusFilter === key 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white dark:bg-white text-gray-600 dark:text-gray-600 border border-gray-200 dark:border-gray-200 hover:border-purple-300'
              }`}
            >
              {config.label} ({stats[key] || 0})
            </button>
          ))}
        </div>

        {/* Souls List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : souls.length === 0 ? (
          <div className="bg-white dark:bg-white rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-200">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900 mb-2">
              No Souls Found
            </h3>
            <p className="text-gray-500 mb-6">
              {search || statusFilter 
                ? 'Try adjusting your filters' 
                : 'Start adding souls to track new converts'}
            </p>
            <Link href="/church/souls/add">
              <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-gray-900 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600">
                Add First Soul
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              {souls.map(soul => (
                <SoulCard
                  key={soul._id}
                  soul={soul}
                  onClick={() => router.push(`/church/souls/${soul._id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-white border border-gray-200 dark:border-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-500">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-white border border-gray-200 dark:border-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
