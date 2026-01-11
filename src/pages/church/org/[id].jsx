// ============================================
// FILE: src/pages/church/org/[id].jsx
// PURPOSE: Organization Detail Page (FIXED 404)
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Settings, Users, Heart, Calendar, FileText, BarChart2,
  UserPlus, BookOpen, MapPin, Phone, Mail, Globe, Edit, MoreVertical,
  TrendingUp, Target, Award, Clock, ChevronRight, Plus, Building
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    members: 0,
    soulsWon: 0,
    attendance: 0,
    cells: 0
  });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.ok && data.organization) {
        setOrg(data.organization);
        setStats({
          members: data.organization.members?.length || data.organization.memberCount || 0,
          soulsWon: data.organization.soulsWon || 0,
          attendance: data.organization.avgAttendance || 0,
          cells: data.organization.cells?.length || 0
        });
      } else {
        console.error('Organization not found');
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
    } finally {
      setLoading(false);
    }
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

  if (!org) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Organization not found
          </h2>
          <p className="text-gray-500 mb-6">
            This organization may have been deleted or you don't have access.
          </p>
          <Link
            href="/church"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Church Dashboard
          </Link>
        </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'cells', label: 'Cells', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <AppLayout>
      <Head>
        <title>{org.name} | CYBEV Church</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <Link
            href="/church"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{org.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {org.type || 'Church'}
                  </span>
                  {org.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {org.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/church/org/${id}/settings`}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                </Link>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Members" value={stats.members} color="blue" />
          <StatCard icon={Heart} label="Souls Won" value={stats.soulsWon} color="red" />
          <StatCard icon={TrendingUp} label="Avg Attendance" value={stats.attendance} color="green" />
          <StatCard icon={Target} label="Cells" value={stats.cells} color="purple" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href={`/church/souls/add?orgId=${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Heart className="w-4 h-4" />
            Add Soul
          </Link>
          <Link
            href={`/church/cells/dashboard?orgId=${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Target className="w-4 h-4" />
            Cell Ministry
          </Link>
          <Link
            href={`/church/cells/reports?orgId=${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            Submit Report
          </Link>
          <Link
            href={`/church/foundation?orgId=${id}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <BookOpen className="w-4 h-4" />
            Foundation School
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab org={org} stats={stats} />
        )}

        {activeTab === 'members' && (
          <MembersTab orgId={id} />
        )}

        {activeTab === 'cells' && (
          <CellsTab orgId={id} />
        )}

        {activeTab === 'reports' && (
          <ReportsTab orgId={id} />
        )}

        {activeTab === 'events' && (
          <EventsTab orgId={id} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab org={org} />
        )}
      </div>
    </AppLayout>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-500',
    red: 'bg-red-50 text-red-500',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-purple-50 text-purple-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// Overview Tab
function OverviewTab({ org, stats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {org.description || 'No description provided.'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
          <div className="space-y-3">
            {org.location && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>{org.location}</span>
              </div>
            )}
            {org.phone && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5" />
                <span>{org.phone}</span>
              </div>
            )}
            {org.email && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5" />
                <span>{org.email}</span>
              </div>
            )}
            {org.website && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Globe className="w-5 h-5" />
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  {org.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="space-y-6">
        {/* Leader */}
        {org.leader && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Leader</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-lg text-purple-600 font-semibold">
                  {org.leader.name?.[0] || 'L'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {org.leader.name || org.leader.username}
                </p>
                <p className="text-sm text-gray-500">Organization Leader</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <div className="space-y-2">
            <QuickLink href={`/church/cells/dashboard?orgId=${org._id}`} label="Cell Dashboard" />
            <QuickLink href={`/church/cells/reports?orgId=${org._id}`} label="Cell Reports" />
            <QuickLink href={`/church/cells/training?orgId=${org._id}`} label="Leader Training" />
            <QuickLink href={`/church/foundation?orgId=${org._id}`} label="Foundation School" />
            <QuickLink href={`/church/website/builder?orgId=${org._id}`} label="Website Builder" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
    >
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  );
}

// Members Tab
function MembersTab({ orgId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchMembers();
  }, [orgId]);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/org/${orgId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) setMembers(data.members || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading members...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Members ({members.length})</h3>
        <Link
          href={`/church/org/${orgId}/members/add`}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No members yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {members.map(member => (
              <div key={member._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    {member.user?.name?.[0] || 'M'}
                  </div>
                  <div>
                    <p className="font-medium">{member.user?.name || member.name}</p>
                    <p className="text-sm text-gray-500">{member.role || 'Member'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Cells Tab
function CellsTab({ orgId }) {
  return (
    <div className="text-center py-12">
      <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cell Ministry</h3>
      <p className="text-gray-500 mb-4">Manage your cells and track growth</p>
      <Link
        href={`/church/cells/dashboard?orgId=${orgId}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Open Cell Dashboard
      </Link>
    </div>
  );
}

// Reports Tab
function ReportsTab({ orgId }) {
  return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cell Reports</h3>
      <p className="text-gray-500 mb-4">View and submit cell meeting reports</p>
      <Link
        href={`/church/cells/reports?orgId=${orgId}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Open Reports
      </Link>
    </div>
  );
}

// Events Tab
function EventsTab({ orgId }) {
  return (
    <div className="text-center py-12">
      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Events</h3>
      <p className="text-gray-500 mb-4">Create and manage church events</p>
      <Link
        href={`/church/org/${orgId}/events/create`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        <Plus className="w-4 h-4" />
        Create Event
      </Link>
    </div>
  );
}

// Settings Tab
function SettingsTab({ org }) {
  return (
    <div className="max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Organization Settings</h3>
        <Link
          href={`/church/org/${org._id}/settings`}
          className="flex items-center gap-2 text-purple-600 hover:underline"
        >
          <Settings className="w-4 h-4" />
          Go to Settings Page
        </Link>
      </div>
    </div>
  );
}
