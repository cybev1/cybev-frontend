// ============================================
// FILE: src/pages/church/index.jsx
// PURPOSE: Church Dashboard (FIXED org links)
// VERSION: 2.0 - Fixed 404 errors on org clicks
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus, Heart, Users, Building, Award, UserPlus, Target,
  BarChart2, BookOpen, Calendar, ChevronRight, Search,
  TrendingUp, Church
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

// Organization type colors
const ORG_TYPE_COLORS = {
  church: { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50' },
  cell: { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50' },
  fellowship: { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-50' },
  bible_study: { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50' },
  ministry: { bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-50' }
};

export default function ChurchDashboard() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [recentSouls, setRecentSouls] = useState([]);
  const [stats, setStats] = useState({
    totalSouls: 0,
    totalMembers: 0,
    totalOrgs: 0,
    fsGraduates: 0
  });
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch organizations
      const orgsRes = await fetch(`${API}/api/church/organizations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const orgsData = await orgsRes.json();

      if (orgsData.ok) {
        setOrganizations(orgsData.organizations || []);
        
        // Calculate stats from organizations
        const totalMembers = orgsData.organizations?.reduce((sum, org) => 
          sum + (org.members?.length || org.memberCount || 0), 0) || 0;
        const totalSouls = orgsData.organizations?.reduce((sum, org) => 
          sum + (org.soulsWon || 0), 0) || 0;

        setStats({
          totalSouls,
          totalMembers,
          totalOrgs: orgsData.organizations?.length || 0,
          fsGraduates: 0
        });
      }

      // Fetch recent souls
      const soulsRes = await fetch(`${API}/api/church/souls?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const soulsData = await soulsRes.json();
      if (soulsData.ok) setRecentSouls(soulsData.souls || []);

    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrgTypeLabel = (type) => {
    const labels = {
      church: 'Church',
      cell: 'Cell',
      fellowship: 'Fellowship',
      bible_study: 'Bible Study',
      ministry: 'Ministry'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Church Dashboard | CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-900 flex items-center gap-3">
              <Church className="w-8 h-8 text-purple-600" />
              Church Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage your church, track souls, and grow your ministry</p>
          </div>
          <Link
            href="/church/org/create"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Create Organization
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Heart}
            label="Total Souls Won"
            value={stats.totalSouls}
            trend="+12%"
            color="red"
          />
          <StatCard
            icon={Users}
            label="Total Members"
            value={stats.totalMembers}
            color="blue"
          />
          <StatCard
            icon={Building}
            label="Organizations"
            value={stats.totalOrgs}
            color="purple"
          />
          <StatCard
            icon={Award}
            label="FS Graduates"
            value={stats.fsGraduates}
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickAction
            icon={UserPlus}
            label="Add Soul"
            description="Record new convert"
            href="/church/souls/add"
            color="red"
          />
          <QuickAction
            icon={Target}
            label="Soul Tracker"
            description="Manage follow-ups"
            href="/church/souls"
            color="green"
          />
          <QuickAction
            icon={BookOpen}
            label="Foundation School"
            description="Discipleship program"
            href="/church/foundation"
            color="blue"
          />
          <QuickAction
            icon={BarChart2}
            label="Attendance"
            description="Record & analytics"
            href="/church/attendance"
            color="purple"
          />
        </div>

        {/* Organizations & Recent Souls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organizations List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-900">My Organizations</h2>
              <Link href="/church/org" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {organizations.length === 0 ? (
              <div className="bg-white dark:bg-white rounded-xl p-8 text-center border border-gray-200 dark:border-gray-200">
                <Building className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">No organizations yet</h3>
                <p className="text-gray-500 text-sm mb-4">Create your first church or ministry organization</p>
                <Link
                  href="/church/org/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Create Organization
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizations.map(org => (
                  <OrgCard key={org._id} org={org} getOrgTypeLabel={getOrgTypeLabel} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Souls */}
            <div className="bg-white dark:bg-white rounded-xl border border-gray-200 dark:border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900">Recent Souls</h3>
                <Link href="/church/souls" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentSouls.length === 0 ? (
                <div className="p-6 text-center">
                  <Heart className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-3">No souls recorded yet</p>
                  <Link
                    href="/church/souls/add"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Add First Soul
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-200">
                  {recentSouls.map(soul => (
                    <div key={soul._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <p className="font-medium text-gray-900 dark:text-gray-900">{soul.name}</p>
                      <p className="text-sm text-gray-500">{new Date(soul.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Foundation School CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-gray-900">
              <BookOpen className="w-10 h-10 mb-3 opacity-80" />
              <h3 className="text-lg font-semibold mb-1">Foundation School</h3>
              <p className="text-sm text-white/80 mb-4">
                Enroll new believers in our 6-module discipleship program
              </p>
              <Link
                href="/church/foundation"
                className="block w-full text-center py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                View Modules
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, trend, color }) {
  const colors = {
    red: 'bg-red-50 text-red-500',
    blue: 'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
    green: 'bg-green-50 text-green-500'
  };

  return (
    <div className="bg-white dark:bg-white rounded-xl p-4 border border-gray-200 dark:border-gray-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
        {trend && (
          <span className="text-xs text-green-500 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

// Quick Action Component
function QuickAction({ icon: Icon, label, description, href, color }) {
  const colors = {
    red: 'from-red-500 to-pink-500',
    green: 'from-green-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-indigo-500'
  };

  return (
    <Link
      href={href}
      className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-gray-900 hover:opacity-90 transition`}
    >
      <Icon className="w-8 h-8 mb-2 opacity-90" />
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-white/80">{description}</p>
    </Link>
  );
}

// Organization Card Component - FIXED LINKS
function OrgCard({ org, getOrgTypeLabel }) {
  const typeColor = ORG_TYPE_COLORS[org.type] || ORG_TYPE_COLORS.church;
  
  // FIXED: Use correct route format
  const orgLink = `/church/org/${org._id}`;

  return (
    <Link
      href={orgLink}
      className="bg-white dark:bg-white rounded-xl border border-gray-200 dark:border-gray-200 p-4 hover:shadow-md transition block"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${typeColor.light} flex items-center justify-center`}>
          <Building className={`w-5 h-5 ${typeColor.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-900 truncate">{org.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor.bg} text-white`}>
            {getOrgTypeLabel(org.type)}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-900">
            {org.members?.length || org.memberCount || 0}
          </p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-900">
            {org.soulsWon || 0}
          </p>
          <p className="text-xs text-gray-500">Souls</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-900">
            {org.avgAttendance || 0}
          </p>
          <p className="text-xs text-gray-500">Avg. Attendance</p>
        </div>
      </div>

      {org.leader && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-200 flex items-center gap-2 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-xs text-purple-600">
              {org.leader.name?.[0] || org.leader.username?.[0] || 'L'}
            </span>
          </div>
          <span>Led by {org.leader.name || org.leader.username}</span>
        </div>
      )}
    </Link>
  );
}
