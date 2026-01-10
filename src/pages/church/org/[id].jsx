// ============================================
// FILE: pages/church/org/[id].jsx
// Organization Detail - Hierarchy, Members, Stats
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Church, Users, Heart, Calendar, MapPin, Phone, Mail,
  Globe, ArrowLeft, ChevronRight, ChevronDown, Plus,
  Settings, BarChart3, UserPlus, Edit, Loader2, Star,
  Building2, BookOpen, Clock, ExternalLink, MoreHorizontal,
  TrendingUp, Award, Target, Layers, Share2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const typeConfig = {
  zone: { 
    label: 'Zone', 
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-700 dark:text-purple-400',
    icon: Globe
  },
  church: { 
    label: 'Church', 
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-400',
    icon: Church
  },
  fellowship: { 
    label: 'Fellowship', 
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    icon: Users
  },
  cell: { 
    label: 'Cell', 
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-700 dark:text-orange-400',
    icon: Building2
  },
  biblestudy: { 
    label: 'Bible Study', 
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    textColor: 'text-pink-700 dark:text-pink-400',
    icon: BookOpen
  }
};

function StatCard({ icon: Icon, label, value, trend, color = 'purple' }) {
  const colors = {
    purple: 'from-purple-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    pink: 'from-pink-500 to-rose-600',
    orange: 'from-orange-500 to-amber-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function HierarchyNode({ org, level = 0, expanded, onToggle }) {
  const config = typeConfig[org.type] || typeConfig.church;
  const Icon = config.icon;
  const hasChildren = org.children && org.children.length > 0;

  return (
    <div className="relative">
      {/* Connector line */}
      {level > 0 && (
        <div className="absolute left-4 top-0 w-px h-6 bg-gray-200 dark:bg-gray-700 -mt-2" />
      )}
      
      <div 
        className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition group ${
          level > 0 ? 'ml-8' : ''
        }`}
        onClick={() => hasChildren && onToggle(org._id)}
      >
        {hasChildren ? (
          <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
            {expanded[org._id] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.textColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/church/org/${org._id}`}>
              <span className="font-medium text-gray-900 dark:text-white hover:text-purple-600 transition">
                {org.name}
              </span>
            </Link>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {org.memberCount || 0} members • {org.stats?.totalSouls || 0} souls
          </p>
        </div>

        <Link href={`/church/org/${org._id}`}>
          <button className="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition">
            View
          </button>
        </Link>
      </div>

      {/* Children */}
      {hasChildren && expanded[org._id] && (
        <div className="relative">
          {level < 4 && (
            <div className="absolute left-4 top-0 w-px h-full bg-gray-200 dark:bg-gray-700 ml-8" />
          )}
          {org.children.map((child) => (
            <HierarchyNode
              key={child._id}
              org={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MemberCard({ member }) {
  const roleColors = {
    pastor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    leader: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    admin: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    worker: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    member: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
      <img
        src={member.user?.profilePicture || '/default-avatar.png'}
        alt={member.user?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {member.user?.name || member.user?.username || 'Unknown'}
        </p>
        <p className="text-sm text-gray-500">
          Joined {new Date(member.joinedAt).toLocaleDateString()}
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full capitalize ${roleColors[member.role] || roleColors.member}`}>
        {member.role}
      </span>
    </div>
  );
}

function ScheduleItem({ schedule }) {
  const dayLabels = {
    sunday: 'Sun', monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
    thursday: 'Thu', friday: 'Fri', saturday: 'Sat'
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex flex-col items-center justify-center">
        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
          {dayLabels[schedule.day]}
        </span>
        <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">{schedule.title}</p>
        <p className="text-sm text-gray-500">{schedule.time}</p>
      </div>
      {schedule.isOnline && (
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
          Online
        </span>
      )}
    </div>
  );
}

export default function OrganizationDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [children, setChildren] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [recentSouls, setRecentSouls] = useState(0);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const fetchOrganization = async () => {
    try {
      // Fetch org details
      const res = await fetch(`${API_URL}/api/church/org/${id}`, getAuth());
      const data = await res.json();
      
      if (data.ok) {
        setOrg(data.org);
        setChildren(data.children || []);
        setRecentSouls(data.recentSouls || 0);
      }

      // Fetch hierarchy
      const hierRes = await fetch(`${API_URL}/api/church/org/${id}/hierarchy`, getAuth());
      const hierData = await hierRes.json();
      if (hierData.ok) {
        setHierarchy(hierData.hierarchy || []);
        // Auto-expand first level
        const expandedInit = {};
        hierData.hierarchy?.forEach(h => { expandedInit[h._id] = true; });
        setExpanded(expandedInit);
      }
    } catch (err) {
      console.error('Fetch org error:', err);
    }
    setLoading(false);
  };

  const toggleExpand = (orgId) => {
    setExpanded(prev => ({ ...prev, [orgId]: !prev[orgId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Organization not found</p>
          <Link href="/church">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const config = typeConfig[org.type] || typeConfig.church;
  const Icon = config.icon;
  const members = org.members || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{org.name} - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} text-white`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/church" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <Icon className="w-10 h-10" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{org.name}</h1>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {config.label}
                </span>
              </div>

              {org.motto && (
                <p className="text-white/80 italic mb-3">"{org.motto}"</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                {org.contact?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {org.contact.city}{org.contact.country && `, ${org.contact.country}`}
                  </span>
                )}
                {org.contact?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {org.contact.phone}
                  </span>
                )}
                {org.leader && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Led by {org.leader.name || org.leader.username}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              {org.siteId && (
                <Link href={`https://${org.subdomain}.cybev.io`} target="_blank">
                  <button className="px-4 py-2 bg-white/20 rounded-xl font-medium hover:bg-white/30 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Site
                  </button>
                </Link>
              )}
              <Link href={`/church/org/${id}/settings`}>
                <button className="px-4 py-2 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Members" value={org.memberCount || 0} color="blue" />
          <StatCard icon={Heart} label="Total Souls" value={org.stats?.totalSouls || 0} color="pink" />
          <StatCard icon={Target} label="This Month" value={recentSouls} trend={12} color="green" />
          <StatCard icon={Award} label="FS Graduates" value={org.stats?.foundationSchoolGraduates || 0} color="purple" />
          <StatCard icon={Layers} label="Sub-Orgs" value={children.length} color="orange" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 mt-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Church },
              { id: 'hierarchy', label: 'Hierarchy', icon: Layers },
              { id: 'members', label: 'Members', icon: Users },
              { id: 'schedule', label: 'Schedule', icon: Calendar }
            ].map(({ id, label, icon: TabIcon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-4 font-medium border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {org.description && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                  <p className="text-gray-600 dark:text-gray-400">{org.description}</p>
                </div>
              )}

              {/* Sub-organizations */}
              {children.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Sub-Organizations ({children.length})
                    </h3>
                    <Link href={`/church/create?parentId=${id}`}>
                      <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {children.slice(0, 6).map((child) => {
                      const childConfig = typeConfig[child.type] || typeConfig.church;
                      const ChildIcon = childConfig.icon;
                      return (
                        <Link key={child._id} href={`/church/org/${child._id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer">
                            <div className={`w-10 h-10 rounded-lg ${childConfig.bgColor} flex items-center justify-center`}>
                              <ChildIcon className={`w-5 h-5 ${childConfig.textColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {child.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {child.memberCount || 0} members
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {children.length > 6 && (
                    <button
                      onClick={() => setActiveTab('hierarchy')}
                      className="w-full mt-4 py-2 text-purple-600 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                    >
                      View All ({children.length})
                    </button>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href={`/church/souls/add?churchId=${id}`}>
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 text-white hover:shadow-lg transition cursor-pointer">
                    <UserPlus className="w-6 h-6 mb-2" />
                    <p className="font-medium">Add Soul</p>
                  </div>
                </Link>
                <Link href={`/church/souls?orgId=${id}`}>
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white hover:shadow-lg transition cursor-pointer">
                    <Heart className="w-6 h-6 mb-2" />
                    <p className="font-medium">Soul Tracker</p>
                  </div>
                </Link>
                <Link href={`/church/attendance?orgId=${id}`}>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white hover:shadow-lg transition cursor-pointer">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <p className="font-medium">Attendance</p>
                  </div>
                </Link>
                <Link href={`/church/reports?orgId=${id}`}>
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white hover:shadow-lg transition cursor-pointer">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <p className="font-medium">Reports</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              {(org.contact?.email || org.contact?.phone || org.contact?.address) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
                  <div className="space-y-3">
                    {org.contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{org.contact.email}</span>
                      </div>
                    )}
                    {org.contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{org.contact.phone}</span>
                      </div>
                    )}
                    {org.contact.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {org.contact.address}
                          {org.contact.city && `, ${org.contact.city}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Leadership */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Leadership</h3>
                
                {org.leader && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-3">
                    <img
                      src={org.leader.profilePicture || '/default-avatar.png'}
                      alt={org.leader.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {org.leader.name || org.leader.username}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        {org.type === 'zone' || org.type === 'church' ? 'Pastor' : 'Leader'}
                      </p>
                    </div>
                  </div>
                )}

                {org.assistantLeaders?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Assistant Leaders</p>
                    {org.assistantLeaders.map((leader) => (
                      <div key={leader._id} className="flex items-center gap-2">
                        <img
                          src={leader.profilePicture || '/default-avatar.png'}
                          alt={leader.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {leader.name || leader.username}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Meeting Schedule */}
              {org.meetingSchedule?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Schedule</h3>
                  <div className="space-y-3">
                    {org.meetingSchedule.slice(0, 3).map((schedule, i) => (
                      <ScheduleItem key={i} schedule={schedule} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hierarchy Tab */}
        {activeTab === 'hierarchy' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Organization Hierarchy
              </h3>
              <Link href={`/church/create?parentId=${id}`}>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Sub-Organization
                </button>
              </Link>
            </div>

            {hierarchy.length === 0 ? (
              <div className="text-center py-12">
                <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No sub-organizations yet</p>
                <Link href={`/church/create?parentId=${id}`}>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">
                    Create First Sub-Organization
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {hierarchy.map((child) => (
                  <HierarchyNode
                    key={child._id}
                    org={child}
                    expanded={expanded}
                    onToggle={toggleExpand}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Members ({members.length})
              </h3>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No members yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-2">
                {members.filter(m => m.status === 'active').map((member, i) => (
                  <MemberCard key={i} member={member} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Meeting Schedule
              </h3>
              <Link href={`/church/org/${id}/settings`}>
                <button className="text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1">
                  <Edit className="w-4 h-4" />
                  Edit Schedule
                </button>
              </Link>
            </div>

            {(!org.meetingSchedule || org.meetingSchedule.length === 0) ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No meetings scheduled</p>
                <Link href={`/church/org/${id}/settings`}>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">
                    Add Schedule
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {org.meetingSchedule.map((schedule, i) => (
                  <ScheduleItem key={i} schedule={schedule} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
