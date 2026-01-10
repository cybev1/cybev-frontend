// ============================================
// FILE: src/pages/church/index.jsx
// Church Dashboard - Main Hub
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Church, Users, UserPlus, BookOpen, Calendar, BarChart3,
  Plus, ChevronRight, TrendingUp, Heart, Star, Award,
  MapPin, Phone, Mail, Globe, Settings, MoreHorizontal,
  Loader2, Building2, Users2, GraduationCap, Target
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Quick stat card
function StatCard({ icon: Icon, label, value, trend, color = 'purple' }) {
  const colors = {
    purple: 'from-purple-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    orange: 'from-orange-500 to-amber-600',
    pink: 'from-pink-500 to-rose-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

// Organization card
function OrgCard({ org, onClick }) {
  const typeColors = {
    zone: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    church: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    fellowship: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cell: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    biblestudy: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
  };

  const typeLabels = {
    zone: 'Zone',
    church: 'Church',
    fellowship: 'Fellowship',
    cell: 'Cell',
    biblestudy: 'Bible Study'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {org.logo ? (
            <img src={org.logo} alt={org.name} className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Church className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition">
              {org.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[org.type]}`}>
              {typeLabels[org.type]}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{org.memberCount || 0}</p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{org.stats?.totalSouls || 0}</p>
          <p className="text-xs text-gray-500">Souls</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{org.stats?.avgAttendance || 0}</p>
          <p className="text-xs text-gray-500">Avg. Attendance</p>
        </div>
      </div>

      {org.leader && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <img 
            src={org.leader.profilePicture || '/default-avatar.png'} 
            alt={org.leader.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Led by {org.leader.name}
          </span>
        </div>
      )}
    </div>
  );
}

// Recent soul card
function RecentSoulCard({ soul }) {
  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    followup: 'bg-orange-100 text-orange-700',
    attending: 'bg-green-100 text-green-700',
    member: 'bg-purple-100 text-purple-700',
    foundation_school: 'bg-indigo-100 text-indigo-700',
    graduated: 'bg-emerald-100 text-emerald-700'
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
        {soul.firstName?.[0]}{soul.lastName?.[0] || ''}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {soul.firstName} {soul.lastName}
        </p>
        <p className="text-sm text-gray-500 truncate">{soul.phone}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[soul.status] || 'bg-gray-100 text-gray-600'}`}>
        {soul.status?.replace('_', ' ')}
      </span>
    </div>
  );
}

export default function ChurchDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myOrgs, setMyOrgs] = useState([]);
  const [stats, setStats] = useState({
    totalSouls: 0,
    totalMembers: 0,
    totalOrgs: 0,
    graduates: 0
  });
  const [recentSouls, setRecentSouls] = useState([]);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch my organizations
      const orgsRes = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const orgsData = await orgsRes.json();
      if (orgsData.ok) {
        setMyOrgs(orgsData.orgs || []);
        
        // Calculate stats from orgs
        const totalStats = orgsData.orgs.reduce((acc, org) => ({
          totalSouls: acc.totalSouls + (org.stats?.totalSouls || 0),
          totalMembers: acc.totalMembers + (org.memberCount || 0),
          graduates: acc.graduates + (org.stats?.foundationSchoolGraduates || 0)
        }), { totalSouls: 0, totalMembers: 0, graduates: 0 });
        
        setStats({
          ...totalStats,
          totalOrgs: orgsData.orgs.length
        });

        // Fetch recent souls if we have orgs
        if (orgsData.orgs.length > 0) {
          const primaryOrg = orgsData.orgs[0];
          const soulsRes = await fetch(
            `${API_URL}/api/church/souls?orgId=${primaryOrg._id}&limit=5`,
            getAuth()
          );
          const soulsData = await soulsRes.json();
          if (soulsData.ok) {
            setRecentSouls(soulsData.souls || []);
          }
        }
      }
    } catch (err) {
      console.error('Fetch dashboard error:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Church Dashboard - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Church className="w-8 h-8 text-purple-500" />
              Church Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your church, track souls, and grow your ministry
            </p>
          </div>
          
          <Link href="/church/create">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg shadow-purple-500/30">
              <Plus className="w-5 h-5" />
              Create Organization
            </button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={Heart} 
            label="Total Souls Won" 
            value={stats.totalSouls}
            trend={12}
            color="pink"
          />
          <StatCard 
            icon={Users} 
            label="Total Members" 
            value={stats.totalMembers}
            color="blue"
          />
          <StatCard 
            icon={Building2} 
            label="Organizations" 
            value={stats.totalOrgs}
            color="purple"
          />
          <StatCard 
            icon={GraduationCap} 
            label="FS Graduates" 
            value={stats.graduates}
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/church/souls/add">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <UserPlus className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Add Soul</h3>
              <p className="text-sm opacity-80">Record new convert</p>
            </div>
          </Link>
          
          <Link href="/church/souls">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <Target className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Soul Tracker</h3>
              <p className="text-sm opacity-80">Manage follow-ups</p>
            </div>
          </Link>
          
          <Link href="/church/foundation">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <BookOpen className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Foundation School</h3>
              <p className="text-sm opacity-80">Discipleship program</p>
            </div>
          </Link>
          
          <Link href="/church/attendance">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <BarChart3 className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Attendance</h3>
              <p className="text-sm opacity-80">Record & analytics</p>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Organizations */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Organizations</h2>
              <Link href="/church/orgs" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All →
              </Link>
            </div>

            {myOrgs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <Church className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Organizations Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first church organization to get started
                </p>
                <Link href="/church/create">
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
                    Create Organization
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myOrgs.slice(0, 4).map(org => (
                  <OrgCard 
                    key={org._id} 
                    org={org}
                    onClick={() => router.push(`/church/org/${org._id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Souls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Souls</h2>
              <Link href="/church/souls" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {recentSouls.length === 0 ? (
                <div className="p-8 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No souls recorded yet</p>
                  <Link href="/church/souls/add">
                    <button className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                      Add First Soul
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentSouls.map(soul => (
                    <RecentSoulCard key={soul._id} soul={soul} />
                  ))}
                </div>
              )}
            </div>

            {/* Foundation School CTA */}
            <div className="mt-6 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
              <BookOpen className="w-10 h-10 mb-3" />
              <h3 className="font-bold text-lg mb-2">Foundation School</h3>
              <p className="text-sm opacity-90 mb-4">
                Enroll new believers in our 6-module discipleship program
              </p>
              <Link href="/church/foundation">
                <button className="w-full py-2 bg-white text-purple-700 rounded-lg font-semibold hover:bg-gray-100">
                  View Modules
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
