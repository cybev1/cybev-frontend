// ============================================
// FILE: src/pages/church/index.jsx
// PURPOSE: Church Dashboard with Ministry Selection & CE Zones
// VERSION: 3.0 - Ministry Filter + CE Zones Support
// DEPLOY TO: cybev-frontend-main/src/pages/church/index.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Plus, Heart, Users, Building, Award, UserPlus, Target,
  BarChart2, BookOpen, Calendar, ChevronRight, Search,
  TrendingUp, Church, Globe, Filter, MapPin
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

// Organization type colors
const ORG_TYPE_COLORS = {
  zone: { bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50' },
  church: { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50' },
  cell: { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50' },
  fellowship: { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-50' },
  biblestudy: { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50' },
  ministry: { bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-50' }
};

// Ministry options
const MINISTRIES = [
  { value: 'all', label: 'All Ministries', icon: '🌐' },
  { value: 'christ_embassy', label: 'Christ Embassy', icon: '⛪' },
  { value: 'others', label: 'Other Ministries', icon: '🏛️' }
];

export default function ChurchDashboard() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [recentSouls, setRecentSouls] = useState([]);
  const [stats, setStats] = useState({
    totalSouls: 0,
    totalMembers: 0,
    totalOrgs: 0,
    fsGraduates: 0,
    newSoulsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ministryFilter, setMinistryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter organizations when filters change
  useEffect(() => {
    let filtered = [...organizations];
    
    // Ministry filter
    if (ministryFilter !== 'all') {
      filtered = filtered.filter(org => org.ministry === ministryFilter);
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(org => org.type === typeFilter);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(org => 
        org.name?.toLowerCase().includes(query) ||
        org.ceZone?.name?.toLowerCase().includes(query) ||
        org.contact?.city?.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrgs(filtered);
  }, [organizations, ministryFilter, typeFilter, searchQuery]);

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
        const orgs = orgsData.organizations || [];
        setOrganizations(orgs);
        setFilteredOrgs(orgs);
        
        // Calculate stats from organizations
        const totalMembers = orgs.reduce((sum, org) => 
          sum + (org.members?.length || org.memberCount || 0), 0);
        const totalSouls = orgs.reduce((sum, org) => 
          sum + (org.stats?.totalSouls || org.soulsWon || 0), 0);
        const fsGraduates = orgs.reduce((sum, org) => 
          sum + (org.stats?.foundationSchoolGraduates || 0), 0);

        setStats(prev => ({
          ...prev,
          totalMembers,
          totalSouls,
          totalOrgs: orgs.length,
          fsGraduates
        }));
      }

      // Fetch recent souls
      const soulsRes = await fetch(`${API}/api/church/souls?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const soulsData = await soulsRes.json();
      if (soulsData.ok) {
        setRecentSouls(soulsData.souls || []);
        
        // Calculate new souls this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = (soulsData.souls || []).filter(soul => 
          new Date(soul.createdAt) >= startOfMonth
        ).length;
        
        setStats(prev => ({ ...prev, newSoulsThisMonth: newThisMonth }));
      }

      // Try to fetch dashboard stats
      try {
        const statsRes = await fetch(`${API}/api/church/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (statsData.ok) {
          setStats(prev => ({
            ...prev,
            totalSouls: statsData.totalSouls || prev.totalSouls,
            totalMembers: statsData.totalMembers || prev.totalMembers,
            newSoulsThisMonth: statsData.newSoulsThisMonth || prev.newSoulsThisMonth,
            fsGraduates: statsData.fsGraduates || prev.fsGraduates
          }));
        }
      } catch (e) {
        // Stats endpoint optional
      }

    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrgTypeLabel = (type) => {
    const labels = {
      zone: 'Zone',
      church: 'Church',
      cell: 'Cell',
      fellowship: 'Fellowship',
      biblestudy: 'Bible Study',
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Church className="w-8 h-8 text-purple-600" />
              Church Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage your church, track souls, and grow your ministry</p>
          </div>
          <Link
            href="/church/org/create"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Create Organization
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Heart}
            label="Total Souls"
            value={stats.totalSouls}
            subtext={stats.newSoulsThisMonth > 0 ? `+${stats.newSoulsThisMonth} this month` : null}
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

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations, zones, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Ministry Filter */}
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <select
                value={ministryFilter}
                onChange={(e) => setMinistryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {MINISTRIES.map(m => (
                  <option key={m.value} value={m.value}>{m.icon} {m.label}</option>
                ))}
              </select>
            </div>
            
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="church">Churches</option>
                <option value="fellowship">Fellowships</option>
                <option value="cell">Cells</option>
                <option value="biblestudy">Bible Studies</option>
              </select>
            </div>
          </div>
          
          {/* Active filters display */}
          {(ministryFilter !== 'all' || typeFilter !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Showing:</span>
              {ministryFilter !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {MINISTRIES.find(m => m.value === ministryFilter)?.label}
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {getOrgTypeLabel(typeFilter)}s
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  "{searchQuery}"
                </span>
              )}
              <button
                onClick={() => {
                  setMinistryFilter('all');
                  setTypeFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-red-500 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Organizations & Recent Souls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organizations List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                My Organizations
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredOrgs.length} of {organizations.length})
                </span>
              </h2>
              <Link href="/church/org" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {filteredOrgs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                {organizations.length === 0 ? (
                  <>
                    <h3 className="font-semibold text-gray-900 mb-2">No organizations yet</h3>
                    <p className="text-gray-500 text-sm mb-4">Create your first church or ministry organization</p>
                    <Link
                      href="/church/org/create"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Create Organization
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900 mb-2">No matching organizations</h3>
                    <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
                    <button
                      onClick={() => {
                        setMinistryFilter('all');
                        setTypeFilter('all');
                        setSearchQuery('');
                      }}
                      className="text-purple-600 hover:underline"
                    >
                      Clear filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrgs.slice(0, 6).map(org => (
                  <OrgCard key={org._id} org={org} getOrgTypeLabel={getOrgTypeLabel} />
                ))}
              </div>
            )}
            
            {filteredOrgs.length > 6 && (
              <div className="text-center mt-4">
                <Link
                  href="/church/org"
                  className="text-purple-600 hover:underline text-sm"
                >
                  View all {filteredOrgs.length} organizations →
                </Link>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Souls */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Recent Souls</h3>
                <Link href="/church/souls" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentSouls.length === 0 ? (
                <div className="p-6 text-center">
                  <Heart className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-3">No souls recorded yet</p>
                  <Link
                    href="/church/souls/add"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Add First Soul
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentSouls.map(soul => (
                    <Link
                      key={soul._id}
                      href={`/church/souls/${soul._id}`}
                      className="p-4 hover:bg-gray-50 block"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {soul.firstName} {soul.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {soul.ceZone?.name || soul.organization?.name || 'Unassigned'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            soul.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                            soul.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                            soul.status === 'attending' ? 'bg-green-100 text-green-700' :
                            soul.status === 'member' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {soul.status || 'new'}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(soul.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Foundation School CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
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
            
            {/* Christ Embassy Zone Highlight */}
            {organizations.some(org => org.ministry === 'christ_embassy') && (
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                <Globe className="w-10 h-10 mb-3 opacity-80" />
                <h3 className="text-lg font-semibold mb-1">Christ Embassy Zones</h3>
                <p className="text-sm text-white/80 mb-4">
                  You're connected to {organizations.filter(org => org.ministry === 'christ_embassy').length} CE organization(s)
                </p>
                <Link
                  href="/church/org/create"
                  className="block w-full text-center py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                >
                  Add More
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, subtext, color }) {
  const colors = {
    red: 'bg-red-50 text-red-500',
    blue: 'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
    green: 'bg-green-50 text-green-500'
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {subtext && (
          <p className="text-xs text-green-500 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" />
            {subtext}
          </p>
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
      className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white hover:opacity-90 transition`}
    >
      <Icon className="w-8 h-8 mb-2 opacity-90" />
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-white/80">{description}</p>
    </Link>
  );
}

// Organization Card Component - With CE Zone Support
function OrgCard({ org, getOrgTypeLabel }) {
  const typeColor = ORG_TYPE_COLORS[org.type] || ORG_TYPE_COLORS.church;
  const orgLink = `/church/org/${org._id}`;

  return (
    <Link
      href={orgLink}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${typeColor.light} flex items-center justify-center`}>
          <Building className={`w-5 h-5 ${typeColor.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{org.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor.bg} text-white`}>
              {getOrgTypeLabel(org.type)}
            </span>
            {org.ministry === 'christ_embassy' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                CE
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* CE Zone Display */}
      {org.ceZone?.name && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-purple-500" />
          <span className="truncate">{org.ceZone.name}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-gray-900">
            {org.members?.length || org.memberCount || 0}
          </p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">
            {org.stats?.totalSouls || org.soulsWon || 0}
          </p>
          <p className="text-xs text-gray-500">Souls</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">
            {org.stats?.avgAttendance || org.avgAttendance || 0}
          </p>
          <p className="text-xs text-gray-500">Avg. Att.</p>
        </div>
      </div>

      {(org.leaderName || org.leader) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-xs text-purple-600">
              {(org.leaderName || org.leader?.name || org.leader?.username)?.[0] || 'L'}
            </span>
          </div>
          <span>
            {org.leaderTitle && `${org.leaderTitle} `}
            {org.leaderName || org.leader?.name || org.leader?.username}
          </span>
        </div>
      )}
    </Link>
  );
}
