// ============================================
// FILE: src/pages/church/org/[id]/index.jsx
// PURPOSE: Organization Detail Page with Edit Button
// VERSION: 1.0.0
// DEPLOY TO: cybev-frontend-main/src/pages/church/org/[id]/index.jsx
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Share2, RefreshCw, Edit, Settings, Users, Heart,
  Calendar, Building2, Globe, Church, Home, BookOpen, Phone,
  Mail, MapPin, ExternalLink, Copy, Check, Plus, Download,
  MoreVertical, Loader2, AlertCircle, User
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const TYPE_CONFIG = {
  zone: { icon: Globe, label: 'Zone', color: 'bg-blue-600', childLabel: 'Churches' },
  church: { icon: Church, label: 'Church', color: 'bg-purple-600', childLabel: 'Fellowships' },
  fellowship: { icon: Users, label: 'Fellowship', color: 'bg-green-600', childLabel: 'Cells' },
  cell: { icon: Home, label: 'Cell', color: 'bg-orange-600', childLabel: 'Bible Studies' },
  biblestudy: { icon: BookOpen, label: 'Bible Study', color: 'bg-teal-600', childLabel: 'Groups' }
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'children', label: 'Sub-orgs', icon: Building2 },
  { id: 'souls', label: 'Souls', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [permissions, setPermissions] = useState({});
  const [children, setChildren] = useState([]);
  const [souls, setSouls] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);

  const fetchOrg = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/church/organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();

      if (data.ok) {
        setOrg(data.org || data.organization);
        setPermissions(data.permissions || {});
        setChildren(data.children || []);
      } else {
        setError(data.error || 'Failed to load organization');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrg();
  }, [fetchOrg]);

  const copyRegistrationLink = () => {
    const link = `https://cybev.io/join/${org?.slug}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Get leader display name
  const getLeaderDisplay = () => {
    if (org?.leaderName) {
      return {
        name: `${org.leaderTitle || ''} ${org.leaderName}`.trim(),
        title: org.leaderTitle || 'Leader',
        isActual: true
      };
    }
    if (org?.leader?.name) {
      return {
        name: org.leader.name,
        title: 'Leader',
        isActual: false
      };
    }
    return { name: 'Not set', title: 'Leader', isActual: false };
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  if (error || !org) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              {error || 'Organization Not Found'}
            </h2>
            <p className="text-red-600 mb-4">
              You may not have access to this organization.
            </p>
            <Link href="/church" className="text-purple-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const typeConfig = TYPE_CONFIG[org.type] || TYPE_CONFIG.church;
  const TypeIcon = typeConfig.icon;
  const leader = getLeaderDisplay();
  const canEdit = permissions.canEdit || permissions.isOwner || permissions.isAdmin;
  const canManage = permissions.canEdit || permissions.isOwner || permissions.isAdmin;

  // Update tabs based on org type
  const tabs = TABS.map(tab => {
    if (tab.id === 'children') {
      return { ...tab, label: typeConfig.childLabel };
    }
    return tab;
  });

  return (
    <AppLayout>
      <Head>
        <title>{org.name} | CYBEV Church</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className={`${typeConfig.color} text-white rounded-2xl p-6 mb-6`}>
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/church" 
              className="flex items-center gap-2 text-white/80 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            
            <div className="flex items-center gap-2">
              {/* EDIT BUTTON - Key addition */}
              {canEdit && (
                <Link 
                  href={`/church/org/${id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              )}
              
              <button 
                onClick={copyRegistrationLink}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              <button 
                onClick={fetchOrg}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Org Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <TypeIcon className="w-8 h-8" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{org.name}</h1>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mt-2 capitalize">
                {typeConfig.label}
              </span>
              {org.motto && (
                <p className="text-white/80 mt-2 text-sm italic">"{org.motto}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{org.memberCount || org.members?.length || 0}</p>
            <p className="text-gray-500 text-sm">Members</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <Heart className="w-6 h-6 text-pink-500 mb-2" />
            <p className="text-2xl font-bold">{org.stats?.soulsWon || 0}</p>
            <p className="text-gray-500 text-sm">Souls Won</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <Calendar className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-2xl font-bold">{org.stats?.attendance || 0}</p>
            <p className="text-gray-500 text-sm">Attendance</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <Building2 className="w-6 h-6 text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{children.length || 0}</p>
            <p className="text-gray-500 text-sm">{typeConfig.childLabel}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {canManage && (
          <div className="flex flex-wrap gap-3 mb-6">
            <Link 
              href={`/church/org/${id}/add-soul`}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              <Heart className="w-4 h-4" />
              Add Soul
            </Link>
            <Link 
              href={`/church/org/${id}/add-member`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Users className="w-4 h-4" />
              Add Member
            </Link>
            <Link 
              href={`/church/org/create?parentId=${id}&type=${getChildType(org.type)}`}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Plus className="w-4 h-4" />
              Create {getChildLabel(org.type)}
            </Link>
            <button 
              onClick={copyRegistrationLink}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Registration Link
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                  isActive 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'members' && (
                  <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                    {org.memberCount || org.members?.length || 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* About */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-600">
                    {org.description || 'No description provided.'}
                  </p>
                </div>

                {/* Registration Link */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Share2 className="w-5 h-5" />
                    <h3 className="font-semibold">Share Registration Link</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-4">
                    Share this link for people to join {org.name}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`https://cybev.io/join/${org.slug}`}
                      readOnly
                      className="flex-1 px-4 py-2 bg-white/20 rounded-lg text-white placeholder-white/50 text-sm"
                    />
                    <button
                      onClick={copyRegistrationLink}
                      className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                {(org.contact?.phone || org.contact?.email || org.contact?.address) && (
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                    <div className="space-y-3">
                      {org.contact?.phone && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{org.contact.phone}</span>
                        </div>
                      )}
                      {org.contact?.email && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{org.contact.email}</span>
                        </div>
                      )}
                      {org.contact?.address && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{org.contact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'members' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Members</h3>
                  {canManage && (
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      <Link 
                        href={`/church/org/${id}/add-member`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add Member
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Members List */}
                <div className="space-y-3">
                  {org.members?.length > 0 ? (
                    org.members.map((member, idx) => (
                      <div key={member._id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            {member.user?.profilePicture ? (
                              <img src={member.user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-purple-600 font-medium">
                                {(member.title ? member.title[0] : '') || (member.firstName ? member.firstName[0] : '') || (member.user?.name?.[0] || '?')}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.title && `${member.title} `}
                              {member.firstName} {member.lastName}
                              {!member.firstName && member.user?.name}
                            </p>
                            <p className="text-sm text-gray-500">{member.role || 'Member'}</p>
                          </div>
                        </div>
                        {canManage && (
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No members yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'children' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{typeConfig.childLabel}</h3>
                  {canManage && (
                    <Link 
                      href={`/church/org/create?parentId=${id}&type=${getChildType(org.type)}`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                      Create
                    </Link>
                  )}
                </div>
                
                {children.length > 0 ? (
                  <div className="grid gap-3">
                    {children.map(child => (
                      <Link 
                        key={child._id} 
                        href={`/church/org/${child._id}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            {child.logo ? (
                              <img src={child.logo} alt="" className="w-full h-full rounded-lg object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{child.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{child.type}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{child.memberCount || 0} members</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No {typeConfig.childLabel.toLowerCase()} yet</p>
                )}
              </div>
            )}

            {activeTab === 'souls' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Souls Won</h3>
                  {canManage && (
                    <Link 
                      href={`/church/org/${id}/add-soul`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                    >
                      <Heart className="w-4 h-4" />
                      Add Soul
                    </Link>
                  )}
                </div>
                <p className="text-gray-500 text-center py-8">Soul tracking coming soon</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
                {canManage ? (
                  <div className="space-y-4">
                    <Link 
                      href={`/church/org/${id}/edit`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Edit className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Edit Organization</p>
                          <p className="text-sm text-gray-500">Update name, description, leader, and more</p>
                        </div>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                    </Link>
                    <Link 
                      href={`/church/org/${id}/settings`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Advanced Settings</p>
                          <p className="text-sm text-gray-500">Privacy, features, integrations</p>
                        </div>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">You don't have permission to manage settings</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leader Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Leader</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  {org.leader?.profilePicture ? (
                    <img src={org.leader.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{leader.name}</p>
                  <p className="text-sm text-gray-500">{leader.title}</p>
                </div>
              </div>
              {canEdit && !leader.isActual && (
                <Link 
                  href={`/church/org/${id}/edit`}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Set Leader Name
                </Link>
              )}
            </div>

            {/* Parent Organization */}
            {org.parent && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Parent Organization</h3>
                <Link 
                  href={`/church/org/${org.parent._id || org.parent}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">
                    {org.parent.name || 'View Parent'}
                  </span>
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            {canManage && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link 
                    href={`/church/org/${id}/edit`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition w-full"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Edit Organization</span>
                  </Link>
                  <Link 
                    href={`/church/org/${id}/add-member`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition w-full"
                  >
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Add Member</span>
                  </Link>
                  <Link 
                    href={`/church/org/${id}/add-soul`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition w-full"
                  >
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span className="text-gray-700">Add Soul</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper functions
function getChildType(parentType) {
  const map = {
    zone: 'church',
    church: 'fellowship',
    fellowship: 'cell',
    cell: 'biblestudy'
  };
  return map[parentType] || 'church';
}

function getChildLabel(parentType) {
  const map = {
    zone: 'Church',
    church: 'Fellowship',
    fellowship: 'Cell',
    cell: 'Bible Study'
  };
  return map[parentType] || 'Sub-org';
}
