/**
 * ============================================
 * FILE: [id].jsx
 * PATH: cybev-frontend-main/src/pages/church/organizations/[id].jsx
 * VERSION: 2.0.0 - Hierarchical Management Dashboard
 * UPDATED: 2026-01-24
 * FEATURES:
 *   - Adaptive dashboard based on org type
 *   - Hierarchy navigation (Zone → Church → Fellowship → Cell → Bible Study)
 *   - Create child organizations
 *   - Member management
 *   - Soul tracking
 *   - Reports & Events
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Settings, MoreVertical, Users, Heart, TrendingUp,
  Target, Plus, ChevronRight, Building, MapPin, Phone, Mail,
  Calendar, FileText, BookOpen, UserPlus, Edit, Trash2, Eye,
  Globe, Clock, Award, BarChart2, Home, Layers, Grid3X3
} from 'lucide-react';

// Org type configuration
const ORG_CONFIG = {
  zone: {
    label: 'Zone',
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    childTypes: ['church'],
    childLabel: 'Churches',
    icon: Globe
  },
  church: {
    label: 'Church',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    childTypes: ['fellowship', 'cell'],
    childLabel: 'Fellowships & Cells',
    icon: Home
  },
  fellowship: {
    label: 'Fellowship',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    childTypes: ['cell'],
    childLabel: 'Cells',
    icon: Layers
  },
  cell: {
    label: 'Cell',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    childTypes: ['biblestudy'],
    childLabel: 'Bible Studies',
    icon: Grid3X3
  },
  biblestudy: {
    label: 'Bible Study',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    childTypes: [],
    childLabel: null,
    icon: BookOpen
  }
};

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  
  const [org, setOrg] = useState(null);
  const [children, setChildren] = useState([]);
  const [members, setMembers] = useState([]);
  const [souls, setSouls] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateChild, setShowCreateChild] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [childForm, setChildForm] = useState({ name: '', type: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (id) fetchOrgData();
  }, [id]);

  const fetchOrgData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch organization details
      const orgRes = await fetch(`${API_URL}/api/church/organizations/${id}`, { headers });
      const orgData = await orgRes.json();

      if (orgData.ok) {
        setOrg(orgData.organization);
        setChildren(orgData.children || []);
        setSouls(orgData.recentSouls || []);
        setStats(orgData.stats || {});
        setMembers(orgData.organization?.members || []);
        
        // Set default child type for creation
        const config = ORG_CONFIG[orgData.organization?.type];
        if (config?.childTypes?.length > 0) {
          setChildForm(prev => ({ ...prev, type: config.childTypes[0] }));
        }
      } else {
        console.error('Org not found');
        router.push('/church');
      }
    } catch (err) {
      console.error('Fetch org error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createChildOrg = async () => {
    if (!childForm.name.trim()) return alert('Name is required');
    
    const token = localStorage.getItem('token');
    try {
      setCreating(true);
      const res = await fetch(`${API_URL}/api/church/org`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...childForm,
          parentId: id,
          zoneId: org?.zone?._id || (org?.type === 'zone' ? id : null),
          churchId: org?.church?._id || (org?.type === 'church' ? id : null)
        })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      
      setShowCreateChild(false);
      setChildForm({ name: '', type: config?.childTypes?.[0] || '', description: '' });
      fetchOrgData();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const config = org ? ORG_CONFIG[org.type] || ORG_CONFIG.church : null;
  const TypeIcon = config?.icon || Building;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Organization not found</p>
          <button onClick={() => router.push('/church')} className="mt-4 text-purple-600">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{org.name} | CYBEV Church</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`${config?.color || 'bg-purple-600'} text-white`}>
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => router.push('/church')} className="flex items-center gap-2 text-white/80 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <TypeIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{org.name}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${config?.lightColor} ${config?.textColor} mt-2`}>
                  {config?.label}
                </span>
                {org.parent && (
                  <p className="text-white/70 text-sm mt-1">
                    Under: {org.parent.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 -mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Members" value={stats.totalMembers || members.length || 0} color="blue" />
            <StatCard icon={Heart} label="Souls Won" value={stats.totalSouls || org.soulsWon || 0} color="red" />
            <StatCard icon={TrendingUp} label="Avg Attendance" value={org.avgAttendance || 0} color="green" />
            <StatCard icon={Building} label={config?.childLabel?.split(' ')[0] || 'Children'} value={children.length} color="purple" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3">
            <Link href={`/church/souls/add?orgId=${id}`} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <Heart className="w-4 h-4" />
              Add Soul
            </Link>
            
            {config?.childTypes?.length > 0 && (
              <button onClick={() => setShowCreateChild(true)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <Plus className="w-4 h-4" />
                Create {ORG_CONFIG[config.childTypes[0]]?.label}
              </button>
            )}
            
            <Link href={`/church/cell-reports/submit?orgId=${id}`} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FileText className="w-4 h-4" />
              Submit Report
            </Link>
            
            <Link href="/church/foundation" className="flex items-center gap-2 px-4 py-2 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50">
              <BookOpen className="w-4 h-4" />
              Foundation School
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'members', label: 'Members', icon: Users },
              { id: 'children', label: config?.childLabel || 'Sub-orgs', icon: Building },
              { id: 'souls', label: 'Souls', icon: Heart },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap ${
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
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-600">{org.description || org.motto || 'No description available.'}</p>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {org.contact?.phone && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-5 h-5 text-gray-400" />
                        {org.contact.phone}
                      </div>
                    )}
                    {org.contact?.email && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-5 h-5 text-gray-400" />
                        {org.contact.email}
                      </div>
                    )}
                    {org.contact?.address && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        {org.contact.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* Children Preview */}
                {config?.childTypes?.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{config.childLabel}</h3>
                      <button onClick={() => setActiveTab('children')} className="text-sm text-purple-600 hover:underline">
                        View All ({children.length})
                      </button>
                    </div>
                    
                    {children.length === 0 ? (
                      <div className="text-center py-8">
                        <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-3">No {config.childLabel?.toLowerCase()} yet</p>
                        <button onClick={() => setShowCreateChild(true)} className="text-purple-600 hover:underline">
                          Create first {ORG_CONFIG[config.childTypes[0]]?.label?.toLowerCase()}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {children.slice(0, 5).map(child => {
                          const childConfig = ORG_CONFIG[child.type];
                          return (
                            <Link
                              key={child._id}
                              href={`/church/organizations/${child._id}`}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${childConfig?.lightColor || 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                                  <Building className={`w-5 h-5 ${childConfig?.textColor || 'text-gray-600'}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{child.name}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${childConfig?.color || 'bg-gray-500'} text-white`}>
                                    {childConfig?.label}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Leader */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Leader</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-purple-600">
                        {org.leader?.name?.[0] || 'L'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{org.leader?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">Organization Leader</p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Cell Dashboard', href: `/church/cells?orgId=${id}` },
                      { label: 'Cell Reports', href: `/church/cell-reports?orgId=${id}` },
                      { label: 'Leader Training', href: '/church/training' },
                      { label: 'Foundation School', href: '/church/foundation' },
                      { label: 'Website Builder', href: '/sites' }
                    ].map(link => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-700">{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Members ({members.length})</h3>
                <button onClick={() => setShowAddMember(true)} className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm">
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              </div>
              
              {members.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-3">No members yet</p>
                  <button onClick={() => setShowAddMember(true)} className="text-purple-600 hover:underline">
                    Add first member
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {members.map((member, idx) => (
                    <div key={member._id || idx} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-purple-600">
                            {member.user?.name?.[0] || member.name?.[0] || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.user?.name || member.name}</p>
                          <p className="text-sm text-gray-500">{member.role || 'Member'}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        Joined {new Date(member.joinedAt || member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Children Tab */}
          {activeTab === 'children' && (
            <div className="space-y-4">
              {config?.childTypes?.length > 0 && (
                <button onClick={() => setShowCreateChild(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                  <Plus className="w-5 h-5" />
                  Create {ORG_CONFIG[config.childTypes[0]]?.label}
                </button>
              )}
              
              {children.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No {config?.childLabel?.toLowerCase() || 'sub-organizations'} yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map(child => {
                    const childConfig = ORG_CONFIG[child.type];
                    return (
                      <Link
                        key={child._id}
                        href={`/church/organizations/${child._id}`}
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 ${childConfig?.lightColor || 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
                              <Building className={`w-6 h-6 ${childConfig?.textColor || 'text-gray-600'}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{child.name}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${childConfig?.color || 'bg-gray-500'} text-white`}>
                                {childConfig?.label}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="font-bold text-gray-900">{child.memberCount || 0}</p>
                            <p className="text-gray-500">Members</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{child.soulsWon || 0}</p>
                            <p className="text-gray-500">Souls</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{child.avgAttendance || 0}</p>
                            <p className="text-gray-500">Attendance</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Souls Tab */}
          {activeTab === 'souls' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Souls Won ({stats.totalSouls || 0})</h3>
                <Link href={`/church/souls/add?orgId=${id}`} className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm">
                  <Heart className="w-4 h-4" />
                  Add Soul
                </Link>
              </div>
              
              {souls.length === 0 ? (
                <div className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-3">No souls recorded yet</p>
                  <Link href={`/church/souls/add?orgId=${id}`} className="text-red-500 hover:underline">
                    Record first soul
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {souls.map(soul => (
                    <div key={soul._id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{soul.name}</p>
                        <p className="text-sm text-gray-500">{soul.phone || soul.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          soul.status === 'followup' ? 'bg-yellow-100 text-yellow-700' :
                          soul.status === 'converted' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {soul.status || 'new'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(soul.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-3">Reports feature coming soon</p>
              <Link href={`/church/cell-reports?orgId=${id}`} className="text-purple-600 hover:underline">
                View Cell Reports
              </Link>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-3">Events feature coming soon</p>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Organization Settings</h3>
              <div className="space-y-4">
                <Link href={`/church/org/${id}/edit`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Edit className="w-5 h-5 text-gray-400" />
                    <span>Edit Organization</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <Link href={`/church/org/${id}/members`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>Manage Members</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 text-red-600">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Organization</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Child Modal */}
        {showCreateChild && config?.childTypes?.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Create {ORG_CONFIG[childForm.type]?.label || 'Organization'}
              </h3>
              
              <div className="space-y-4">
                {config.childTypes.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={childForm.type}
                      onChange={(e) => setChildForm({ ...childForm, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    >
                      {config.childTypes.map(type => (
                        <option key={type} value={type}>{ORG_CONFIG[type]?.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={childForm.name}
                    onChange={(e) => setChildForm({ ...childForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    placeholder={`e.g., ${ORG_CONFIG[childForm.type]?.label} Alpha`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={childForm.description}
                    onChange={(e) => setChildForm({ ...childForm, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    rows={3}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreateChild(false)} className="flex-1 py-2 border border-gray-200 rounded-lg">
                  Cancel
                </button>
                <button onClick={createChildOrg} disabled={creating} className="flex-1 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-500',
    red: 'bg-red-50 text-red-500',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-purple-50 text-purple-500'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
