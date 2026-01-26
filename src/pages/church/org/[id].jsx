/**
 * ============================================
 * FILE: [id].jsx
 * PATH: cybev-frontend-main/src/pages/church/org/[id].jsx
 * VERSION: 4.1.0 - Added Edit button + leaderName display
 * UPDATED: 2026-01-24
 * FEATURES:
 *   - Full Add/Edit/Delete member with all fields
 *   - Registration Link generation & sharing
 *   - QR Code for registration
 *   - Export members
 *   - Hierarchy navigation
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Settings, Users, Heart, TrendingUp, Plus, ChevronRight,
  Building, MapPin, Phone, Mail, Calendar, FileText, BookOpen, UserPlus,
  Edit, Trash2, Download, Search, Globe, BarChart2, Home, Layers, Grid3X3,
  X, Loader2, Save, AlertCircle, Check, Eye, EyeOff, Share2, Copy,
  QrCode, Link as LinkIcon, Facebook, Instagram, Twitter, Linkedin,
  RefreshCw, MoreVertical, ExternalLink, Briefcase, Lock
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Org type configuration
const ORG_CONFIG = {
  zone: { label: 'Zone', color: 'bg-indigo-500', textColor: 'text-indigo-600', childTypes: ['church'], childLabel: 'Churches', icon: Globe },
  church: { label: 'Church', color: 'bg-purple-500', textColor: 'text-purple-600', childTypes: ['fellowship', 'cell'], childLabel: 'Fellowships & Cells', icon: Home },
  fellowship: { label: 'Fellowship', color: 'bg-green-500', textColor: 'text-green-600', childTypes: ['cell'], childLabel: 'Cells', icon: Layers },
  cell: { label: 'Cell', color: 'bg-blue-500', textColor: 'text-blue-600', childTypes: ['biblestudy'], childLabel: 'Bible Studies', icon: Grid3X3 },
  biblestudy: { label: 'Bible Study', color: 'bg-amber-500', textColor: 'text-amber-600', childTypes: [], childLabel: null, icon: BookOpen }
};

const TITLES = [
  { value: '', label: 'Select' }, { value: 'Mr', label: 'Mr' }, { value: 'Mrs', label: 'Mrs' },
  { value: 'Miss', label: 'Miss' }, { value: 'Bro', label: 'Brother' }, { value: 'Sis', label: 'Sister' },
  { value: 'Pastor', label: 'Pastor' }, { value: 'Evangelist', label: 'Evangelist' },
  { value: 'Deacon', label: 'Deacon' }, { value: 'Deaconess', label: 'Deaconess' },
  { value: 'Dr', label: 'Dr' }, { value: 'Elder', label: 'Elder' }, { value: 'Rev', label: 'Rev' },
  { value: 'Bishop', label: 'Bishop' }, { value: 'GO', label: 'GO' }, { value: 'custom', label: 'Custom...' }
];

const ROLES = [
  { value: 'member', label: 'Member' }, { value: 'worker', label: 'Worker' },
  { value: 'cell_leader', label: 'Cell Leader' }, { value: 'leader', label: 'Leader' },
  { value: 'pastor', label: 'Pastor' }, { value: 'admin', label: 'Admin' }
];

const FS_STATUS = [
  { value: 'not_enrolled', label: 'Not Enrolled' }, { value: 'enrolled', label: 'Enrolled' },
  { value: 'in_progress', label: 'In Progress' }, { value: 'graduated', label: 'Graduated' }
];

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [org, setOrg] = useState(null);
  const [children, setChildren] = useState([]);
  const [members, setMembers] = useState([]);
  const [souls, setSouls] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Member modal
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [savingMember, setSavingMember] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);
  
  // Registration link modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [regLink, setRegLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Child org modal
  const [showCreateChild, setShowCreateChild] = useState(false);
  const [childForm, setChildForm] = useState({ name: '', type: '', description: '' });
  const [creatingChild, setCreatingChild] = useState(false);

  useEffect(() => {
    if (id) fetchOrgData();
  }, [id]);

  const fetchOrgData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/church/organizations/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.ok) {
        setOrg(data.organization);
        setChildren(data.children || []);
        setSouls(data.recentSouls || []);
        setStats(data.stats || {});
        setMembers(data.organization?.members || []);
        
        // Generate registration link
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cybev.io';
        setRegLink(`${baseUrl}/join/${data.organization?.slug || id}`);
        
        const config = ORG_CONFIG[data.organization?.type];
        if (config?.childTypes?.length > 0) {
          setChildForm(prev => ({ ...prev, type: config.childTypes[0] }));
        }
      } else {
        router.push('/church');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async (memberData) => {
    setSavingMember(true);
    try {
      const token = localStorage.getItem('token');
      const isEdit = !!editingMember?._id;
      const url = isEdit 
        ? `${API_URL}/api/church/members/${id}/${editingMember._id}`
        : `${API_URL}/api/church/members/${id}`;
      
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(memberData)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      
      setShowMemberModal(false);
      setEditingMember(null);
      fetchOrgData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingMember(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Remove this member?')) return;
    setDeletingMember(memberId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/church/members/${id}/${memberId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      fetchOrgData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDeletingMember(null);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(regLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = (platform) => {
    const text = `Join ${org?.name}! Register here:`;
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + regLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(regLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(regLink)}`
    };
    window.open(urls[platform], '_blank');
  };

  const createChildOrg = async () => {
    if (!childForm.name.trim()) return alert('Name required');
    setCreatingChild(true);
    try {
      const token = localStorage.getItem('token');
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
      setCreatingChild(false);
    }
  };

  const config = org ? ORG_CONFIG[org.type] || ORG_CONFIG.church : null;
  const TypeIcon = config?.icon || Building;
  const filteredMembers = members.filter(m => {
    if (!memberSearch) return true;
    const s = memberSearch.toLowerCase();
    return `${m.firstName} ${m.lastName}`.toLowerCase().includes(s) || m.phone?.includes(s) || m.email?.toLowerCase().includes(s);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Organization not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>{org.name} | CYBEV Church</title></Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`${config?.color || 'bg-purple-600'} text-white`}>
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => router.push('/church')} className="flex items-center gap-2 text-white/80 hover:text-white">
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <Link href={`/church/org/${id}/edit`} className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30">
                  <Edit className="w-4 h-4" /> Edit
                </Link>
                <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button onClick={fetchOrgData} className="p-2 hover:bg-white/10 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <TypeIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{org.name}</h1>
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-white/20 mt-2">{config?.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 -mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Members" value={members.length} color="blue" />
            <StatCard icon={Heart} label="Souls Won" value={stats.totalSouls || 0} color="red" />
            <StatCard icon={TrendingUp} label="Attendance" value={org.avgAttendance || 0} color="green" />
            <StatCard icon={Building} label={config?.childLabel?.split(' ')[0] || 'Sub-orgs'} value={children.length} color="purple" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3">
            <Link href={`/church/souls/add?orgId=${id}`} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <Heart className="w-4 h-4" /> Add Soul
            </Link>
            <button onClick={() => { setEditingMember(null); setShowMemberModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <UserPlus className="w-4 h-4" /> Add Member
            </button>
            {config?.childTypes?.length > 0 && (
              <button onClick={() => setShowCreateChild(true)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <Plus className="w-4 h-4" /> Create {ORG_CONFIG[config.childTypes[0]]?.label}
              </button>
            )}
            <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <LinkIcon className="w-4 h-4" /> Registration Link
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'members', label: 'Members', icon: Users, count: members.length },
              { id: 'children', label: config?.childLabel || 'Sub-orgs', icon: Building, count: children.length },
              { id: 'souls', label: 'Souls', icon: Heart },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && <span className="ml-1 px-2 py-0.5 bg-gray-100 text-xs rounded-full">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold mb-3">About</h3>
                  <p className="text-gray-600">{org.description || org.motto || 'No description'}</p>
                </div>
                
                {/* Registration Link Card */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Share2 className="w-5 h-5" /> Share Registration Link
                  </h3>
                  <p className="text-white/80 text-sm mb-4">Share this link for people to join {org.name}</p>
                  <div className="flex gap-2">
                    <input type="text" value={regLink} readOnly
                      className="flex-1 px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/60 text-sm" />
                    <button onClick={copyLink} className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium flex items-center gap-2">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <div className="space-y-2 text-gray-600">
                    {org.contact?.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {org.contact.phone}</div>}
                    {org.contact?.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {org.contact.email}</div>}
                    {org.contact?.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {org.contact.address}</div>}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-semibold mb-4">Leader</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                      {(org.leaderName || org.leader?.name)?.[0] || 'L'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {org.leaderName 
                          ? `${org.leaderTitle || ''} ${org.leaderName}`.trim()
                          : org.leader?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">{org.leaderTitle || 'Leader'}</p>
                    </div>
                  </div>
                  {!org.leaderName && (
                    <Link href={`/church/org/${id}/edit`} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 text-sm">
                      <Edit className="w-4 h-4" /> Set Leader Name
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                    placeholder="Search members..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <a href={`${API_URL}/api/church/members/${id}/export?format=csv`} target="_blank"
                    className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" /> Export
                  </a>
                  <button onClick={() => { setEditingMember(null); setShowMemberModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
                    <UserPlus className="w-4 h-4" /> Add Member
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border overflow-hidden">
                {filteredMembers.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No members found</p>
                    <button onClick={() => setShowMemberModal(true)} className="text-purple-600">Add first member</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Foundation School</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredMembers.map(m => (
                          <tr key={m._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                                  {m.firstName?.[0]}
                                </div>
                                <div>
                                  <p className="font-medium">{m.title && m.title !== 'custom' ? m.title + ' ' : ''}{m.firstName} {m.lastName}</p>
                                  <p className="text-sm text-gray-500">{m.profession || '-'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p>{m.phone || '-'}</p>
                              <p className="text-sm text-gray-500">{m.email || '-'}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                m.role === 'pastor' ? 'bg-purple-100 text-purple-700' :
                                m.role === 'leader' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {ROLES.find(r => r.value === m.role)?.label || 'Member'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                m.foundationSchool?.status === 'graduated' ? 'bg-green-100 text-green-700' :
                                m.foundationSchool?.enrolled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {FS_STATUS.find(s => s.value === m.foundationSchool?.status)?.label || 'Not Enrolled'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {m.status || 'Active'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => { setEditingMember(m); setShowMemberModal(true); }} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteMember(m._id)} disabled={deletingMember === m._id} className="p-2 hover:bg-red-50 rounded text-red-500">
                                {deletingMember === m._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'children' && (
            <div className="space-y-4">
              {config?.childTypes?.length > 0 && (
                <button onClick={() => setShowCreateChild(true)} className="w-full py-3 bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Create {ORG_CONFIG[config.childTypes[0]]?.label}
                </button>
              )}
              {children.length === 0 ? (
                <div className="bg-white rounded-xl border p-12 text-center">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No {config?.childLabel?.toLowerCase()}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map(child => (
                    <Link key={child._id} href={`/church/org/${child._id}`} className="bg-white rounded-xl border p-4 hover:shadow-md">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 ${ORG_CONFIG[child.type]?.color || 'bg-gray-500'} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                          <Building className={`w-6 h-6 ${ORG_CONFIG[child.type]?.textColor}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{child.name}</h4>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{ORG_CONFIG[child.type]?.label}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div><p className="font-bold">{child.memberCount || 0}</p><p className="text-gray-500">Members</p></div>
                        <div><p className="font-bold">{child.soulsWon || 0}</p><p className="text-gray-500">Souls</p></div>
                        <div><p className="font-bold">{child.avgAttendance || 0}</p><p className="text-gray-500">Attendance</p></div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'souls' && (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Souls ({stats.totalSouls || souls.length})</h3>
                <Link href={`/church/souls/add?orgId=${id}`} className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm">
                  <Heart className="w-4 h-4" /> Add Soul
                </Link>
              </div>
              {souls.length === 0 ? (
                <div className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No souls recorded</p>
                </div>
              ) : (
                <div className="divide-y">
                  {souls.map(s => (
                    <div key={s._id} className="p-4 flex justify-between">
                      <div><p className="font-medium">{s.firstName} {s.lastName}</p><p className="text-sm text-gray-500">{s.phone}</p></div>
                      <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'member' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold mb-4">Organization Settings</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Registration Link</h4>
                  <div className="flex gap-2">
                    <input type="text" value={regLink} readOnly className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" />
                    <button onClick={copyLink} className="px-4 py-2 bg-purple-600 text-white rounded-lg">{copied ? 'Copied!' : 'Copy'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Member Modal */}
        {showMemberModal && (
          <MemberModal
            member={editingMember}
            onClose={() => { setShowMemberModal(false); setEditingMember(null); }}
            onSave={handleSaveMember}
            saving={savingMember}
          />
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Share Registration Link</h3>
                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              
              <p className="text-gray-600 mb-4">Share this link for people to join <strong>{org.name}</strong></p>
              
              <div className="flex gap-2 mb-6">
                <input type="text" value={regLink} readOnly className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50" />
                <button onClick={copyLink} className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex gap-3 justify-center mb-6">
                <button onClick={() => shareLink('whatsapp')} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <button onClick={() => shareLink('facebook')} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Facebook className="w-6 h-6" />
                </button>
                <button onClick={() => shareLink('twitter')} className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600">
                  <Twitter className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Or scan QR code</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(regLink)}`} alt="QR Code" className="mx-auto rounded-lg" />
              </div>

              <a href={regLink} target="_blank" className="mt-4 w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50">
                <ExternalLink className="w-4 h-4" /> Open Registration Page
              </a>
            </div>
          </div>
        )}

        {/* Create Child Modal */}
        {showCreateChild && config?.childTypes?.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Create {ORG_CONFIG[childForm.type]?.label}</h3>
              <div className="space-y-4">
                {config.childTypes.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select value={childForm.type} onChange={e => setChildForm({ ...childForm, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                      {config.childTypes.map(t => <option key={t} value={t}>{ORG_CONFIG[t]?.label}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input type="text" value={childForm.name} onChange={e => setChildForm({ ...childForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder={`${ORG_CONFIG[childForm.type]?.label} name`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={childForm.description} onChange={e => setChildForm({ ...childForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreateChild(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                <button onClick={createChildOrg} disabled={creatingChild} className="flex-1 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">
                  {creatingChild ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, color }) {
  const colors = { blue: 'bg-blue-50 text-blue-500', red: 'bg-red-50 text-red-500', green: 'bg-green-50 text-green-500', purple: 'bg-purple-50 text-purple-500' };
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}><Icon className="w-5 h-5" /></div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// Member Modal Component
function MemberModal({ member, onClose, onSave, saving }) {
  const [tab, setTab] = useState('personal');
  const [form, setForm] = useState({
    title: '', customTitle: '', firstName: '', lastName: '', email: '', phone: '', whatsapp: '',
    gender: '', dateOfBirth: '', maritalStatus: '', weddingAnniversary: '',
    address: { street: '', city: '', state: '', country: '' },
    role: 'member', department: '', membershipId: '', joinedAt: new Date().toISOString().split('T')[0], joinedHow: '',
    isSaved: true, salvationDate: '', baptismType: 'none', baptismDate: '',
    foundationSchool: { enrolled: false, status: 'not_enrolled', batchNumber: '' },
    profession: '', employer: '', skills: '',
    socialMedia: { facebook: '', instagram: '', twitter: '', linkedin: '' },
    emergencyContact: { name: '', phone: '', relationship: '' },
    notes: '', status: 'active'
  });

  useEffect(() => {
    if (member) {
      setForm({
        ...form, ...member,
        address: member.address || form.address,
        socialMedia: member.socialMedia || form.socialMedia,
        emergencyContact: member.emergencyContact || form.emergencyContact,
        foundationSchool: member.foundationSchool || form.foundationSchool,
        skills: Array.isArray(member.skills) ? member.skills.join(', ') : member.skills || '',
        dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
        salvationDate: member.salvationDate ? new Date(member.salvationDate).toISOString().split('T')[0] : '',
        joinedAt: member.joinedAt ? new Date(member.joinedAt).toISOString().split('T')[0] : ''
      });
    }
  }, [member]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [p, c] = field.split('.');
      setForm(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.firstName.trim()) return alert('First name required');
    if (!form.phone.trim() && !form.email.trim()) return alert('Phone or email required');
    onSave(form);
  };

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'church', label: 'Church' },
    { id: 'spiritual', label: 'Spiritual' },
    { id: 'professional', label: 'Professional' },
    { id: 'other', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{member ? 'Edit' : 'Add'} Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="border-b px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 border-b-2 text-sm whitespace-nowrap ${tab === t.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>{t.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === 'personal' && <>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <select value={form.title} onChange={e => handleChange('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  {TITLES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {form.title === 'custom' && <div><label className="block text-sm font-medium mb-1">Custom</label><input type="text" value={form.customTitle} onChange={e => handleChange('customTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>}
              <div className={form.title === 'custom' ? '' : 'col-span-2'}>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input type="text" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div><label className="block text-sm font-medium mb-1">Last Name</label><input type="text" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium mb-1">Phone *</label><input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">WhatsApp</label><input type="tel" value={form.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div><label className="block text-sm font-medium mb-1">Gender</label><select value={form.gender} onChange={e => handleChange('gender', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
              <div><label className="block text-sm font-medium mb-1">DOB</label><input type="date" value={form.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Marital Status</label><select value={form.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Select</option><option value="single">Single</option><option value="married">Married</option><option value="divorced">Divorced</option><option value="widowed">Widowed</option></select></div>
              {form.maritalStatus === 'married' && <div><label className="block text-sm font-medium mb-1">Anniversary</label><input type="date" value={form.weddingAnniversary} onChange={e => handleChange('weddingAnniversary', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>}
            </div>
            <div><label className="block text-sm font-medium mb-1">Address</label><input type="text" value={form.address.street} onChange={e => handleChange('address.street', e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" placeholder="Street" />
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={form.address.city} onChange={e => handleChange('address.city', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="City" />
                <input type="text" value={form.address.state} onChange={e => handleChange('address.state', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="State" />
                <input type="text" value={form.address.country} onChange={e => handleChange('address.country', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="Country" />
              </div>
            </div>
          </>}

          {tab === 'church' && <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1">Role</label><select value={form.role} onChange={e => handleChange('role', e.target.value)} className="w-full px-3 py-2 border rounded-lg">{ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Department</label><input type="text" value={form.department} onChange={e => handleChange('department', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Choir, Ushering" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium mb-1">Member ID</label><input type="text" value={form.membershipId} onChange={e => handleChange('membershipId', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Joined Date</label><input type="date" value={form.joinedAt} onChange={e => handleChange('joinedAt', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">How Joined</label><select value={form.joinedHow} onChange={e => handleChange('joinedHow', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Select</option><option value="new_convert">New Convert</option><option value="transfer">Transfer</option><option value="invitation">Invitation</option><option value="online">Online</option></select></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={form.status} onChange={e => handleChange('status', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="active">Active</option><option value="inactive">Inactive</option><option value="transferred">Transferred</option></select></div>
          </>}

          {tab === 'spiritual' && <>
            <div className="p-4 bg-purple-50 rounded-xl space-y-3">
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.isSaved} onChange={e => handleChange('isSaved', e.target.checked)} className="w-5 h-5 rounded" /><span className="font-medium">Born Again / Saved</span></label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.foundationSchool.enrolled} onChange={e => handleChange('foundationSchool.enrolled', e.target.checked)} className="w-5 h-5 rounded" /><span className="font-medium"><BookOpen className="w-4 h-4 inline mr-1" />Enrolled in Foundation School</span></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1">Salvation Date</label><input type="date" value={form.salvationDate} onChange={e => handleChange('salvationDate', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Baptism</label><select value={form.baptismType} onChange={e => handleChange('baptismType', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="none">Not Baptized</option><option value="water">Water</option><option value="holy_spirit">Holy Spirit</option><option value="both">Both</option></select></div>
            </div>
            {form.foundationSchool.enrolled && <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1">FS Status</label><select value={form.foundationSchool.status} onChange={e => handleChange('foundationSchool.status', e.target.value)} className="w-full px-3 py-2 border rounded-lg">{FS_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Batch</label><input type="text" value={form.foundationSchool.batchNumber} onChange={e => handleChange('foundationSchool.batchNumber', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Batch 5" /></div>
            </div>}
          </>}

          {tab === 'professional' && <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1">Profession</label><input type="text" value={form.profession} onChange={e => handleChange('profession', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Employer</label><input type="text" value={form.employer} onChange={e => handleChange('employer', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Skills (comma separated)</label><input type="text" value={form.skills} onChange={e => handleChange('skills', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Graphics, Singing" /></div>
            <div><label className="block text-sm font-medium mb-2">Social Media</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2"><Facebook className="w-5 h-5 text-blue-600" /><input type="text" value={form.socialMedia.facebook} onChange={e => handleChange('socialMedia.facebook', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="Facebook" /></div>
                <div className="flex items-center gap-2"><Instagram className="w-5 h-5 text-pink-600" /><input type="text" value={form.socialMedia.instagram} onChange={e => handleChange('socialMedia.instagram', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="Instagram" /></div>
                <div className="flex items-center gap-2"><Twitter className="w-5 h-5 text-sky-500" /><input type="text" value={form.socialMedia.twitter} onChange={e => handleChange('socialMedia.twitter', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="Twitter" /></div>
                <div className="flex items-center gap-2"><Linkedin className="w-5 h-5 text-blue-700" /><input type="text" value={form.socialMedia.linkedin} onChange={e => handleChange('socialMedia.linkedin', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="LinkedIn" /></div>
              </div>
            </div>
          </>}

          {tab === 'other' && <>
            <div className="p-4 bg-red-50 rounded-xl">
              <h4 className="font-medium mb-3">Emergency Contact</h4>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={form.emergencyContact.name} onChange={e => handleChange('emergencyContact.name', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="Name" />
                <input type="text" value={form.emergencyContact.relationship} onChange={e => handleChange('emergencyContact.relationship', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="Relationship" />
                <input type="tel" value={form.emergencyContact.phone} onChange={e => handleChange('emergencyContact.phone', e.target.value)} className="px-3 py-2 border rounded-lg" placeholder="Phone" />
              </div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Notes</label><textarea value={form.notes} onChange={e => handleChange('notes', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
          </>}
        </div>

        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {member ? 'Update' : 'Add'} Member</>}
          </button>
        </div>
      </div>
    </div>
  );
}
