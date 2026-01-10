// ============================================
// FILE: pages/church/souls/[id].jsx
// Soul Detail - Profile, Follow-ups, Status Updates
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Heart, User, Phone, Mail, MapPin, Calendar, Clock,
  ArrowLeft, ChevronRight, Edit, Trash2, Plus, Send,
  CheckCircle, XCircle, AlertCircle, MessageSquare,
  PhoneCall, Home, Users, BookOpen, GraduationCap,
  Star, MoreHorizontal, Loader2, Save, X, Award,
  TrendingUp, Activity, FileText, Bookmark
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Status configuration
const statusConfig = {
  new: { 
    label: 'New', 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    bgColor: 'bg-blue-500',
    description: 'Just received salvation'
  },
  contacted: { 
    label: 'Contacted', 
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    bgColor: 'bg-yellow-500',
    description: 'Initial contact made'
  },
  followup: { 
    label: 'Follow-up', 
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    bgColor: 'bg-orange-500',
    description: 'In active follow-up'
  },
  attending: { 
    label: 'Attending', 
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    bgColor: 'bg-green-500',
    description: 'Attending services'
  },
  member: { 
    label: 'Member', 
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    bgColor: 'bg-purple-500',
    description: 'Active church member'
  },
  foundation_school: { 
    label: 'Foundation School', 
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    bgColor: 'bg-indigo-500',
    description: 'Enrolled in Foundation School'
  },
  graduated: { 
    label: 'Graduated', 
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    bgColor: 'bg-emerald-500',
    description: 'Completed Foundation School'
  },
  inactive: { 
    label: 'Inactive', 
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    bgColor: 'bg-gray-500',
    description: 'No recent activity'
  },
  lost: { 
    label: 'Lost', 
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    bgColor: 'bg-red-500',
    description: 'Unable to reach'
  }
};

const statusOrder = ['new', 'contacted', 'followup', 'attending', 'member', 'foundation_school', 'graduated'];

// Follow-up type icons
const followUpIcons = {
  call: PhoneCall,
  visit: Home,
  message: MessageSquare,
  service_attendance: Users,
  cell_attendance: Users
};

// Follow-up outcome colors
const outcomeColors = {
  successful: 'text-green-500',
  no_answer: 'text-yellow-500',
  scheduled: 'text-blue-500',
  declined: 'text-red-500',
  wrong_number: 'text-gray-500'
};

function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.new;
  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-2 py-1 text-xs';
  
  return (
    <span className={`${config.color} ${sizeClasses} rounded-full font-medium`}>
      {config.label}
    </span>
  );
}

function StatusProgress({ currentStatus }) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  return (
    <div className="flex items-center gap-1">
      {statusOrder.slice(0, 5).map((status, index) => {
        const isActive = index <= currentIndex;
        const config = statusConfig[status];
        return (
          <div key={status} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive ? `${config.bgColor} text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}
              title={config.label}
            >
              {index + 1}
            </div>
            {index < 4 && (
              <div className={`w-6 h-1 ${isActive && index < currentIndex ? config.bgColor : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FollowUpCard({ followUp }) {
  const Icon = followUpIcons[followUp.type] || MessageSquare;
  const outcomeColor = outcomeColors[followUp.outcome] || 'text-gray-500';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {followUp.type?.replace('_', ' ')}
            </span>
            <span className={`text-sm font-medium capitalize ${outcomeColor}`}>
              {followUp.outcome?.replace('_', ' ')}
            </span>
          </div>
          
          {followUp.notes && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {followUp.notes}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(followUp.date).toLocaleDateString()}
            </span>
            {followUp.followedUpBy && (
              <span>by {followUp.followedUpBy.name || followUp.followedUpBy.username}</span>
            )}
            {followUp.nextFollowUpDate && (
              <span className="text-blue-500">
                Next: {new Date(followUp.nextFollowUpDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddFollowUpModal({ isOpen, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    type: 'call',
    notes: '',
    outcome: 'successful',
    nextFollowUpDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Follow-up
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'call', label: 'Call', icon: PhoneCall },
                { id: 'visit', label: 'Visit', icon: Home },
                { id: 'message', label: 'Message', icon: MessageSquare }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: id }))}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition ${
                    form.type === id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${form.type === id ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${form.type === id ? 'text-purple-600 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Outcome
            </label>
            <select
              value={form.outcome}
              onChange={(e) => setForm(f => ({ ...f, outcome: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="successful">✅ Successful</option>
              <option value="no_answer">📞 No Answer</option>
              <option value="scheduled">📅 Scheduled</option>
              <option value="declined">❌ Declined</option>
              <option value="wrong_number">⚠️ Wrong Number</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="How did the follow-up go?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Next Follow-up Date (Optional)
            </label>
            <input
              type="date"
              value={form.nextFollowUpDate}
              onChange={(e) => setForm(f => ({ ...f, nextFollowUpDate: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Follow-up
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UpdateStatusModal({ isOpen, onClose, currentStatus, onSubmit, loading }) {
  const [newStatus, setNewStatus] = useState(currentStatus);

  useEffect(() => {
    setNewStatus(currentStatus);
  }, [currentStatus]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (newStatus !== currentStatus) {
      onSubmit(newStatus);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Status
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setNewStatus(key)}
              className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                newStatus === key
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${config.bgColor}`} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{config.label}</p>
                <p className="text-sm text-gray-500">{config.description}</p>
              </div>
              {newStatus === key && (
                <CheckCircle className="w-5 h-5 text-purple-500 ml-auto" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || newStatus === currentStatus}
            className="flex-1 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EnrollFoundationModal({ isOpen, onClose, soul, onSubmit, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Enroll in Foundation School
          </h3>
          <p className="text-gray-500 mb-6">
            Enroll <strong>{soul?.firstName} {soul?.lastName}</strong> in the 6-module Foundation School discipleship program?
          </p>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Program includes:</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>✓ Salvation & New Birth</li>
              <li>✓ The Word of God</li>
              <li>✓ Prayer & Fellowship</li>
              <li>✓ The Holy Spirit</li>
              <li>✓ The Local Church</li>
              <li>✓ Living the Christian Life</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Enroll Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SoulDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [soul, setSoul] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    if (id) {
      fetchSoul();
    }
  }, [id]);

  const fetchSoul = async () => {
    try {
      const res = await fetch(`${API_URL}/api/church/souls/${id}`, getAuth());
      const data = await res.json();
      if (data.ok) {
        setSoul(data.soul);
      }
    } catch (err) {
      console.error('Fetch soul error:', err);
    }
    setLoading(false);
  };

  const handleAddFollowUp = async (formData) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/souls/${id}/followup`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.ok) {
        setSoul(data.soul);
        setShowFollowUpModal(false);
      } else {
        alert(data.error || 'Failed to add follow-up');
      }
    } catch (err) {
      console.error('Add follow-up error:', err);
    }
    setActionLoading(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/souls/${id}`, {
        method: 'PUT',
        ...getAuth(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.ok) {
        setSoul(data.soul);
        setShowStatusModal(false);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
    setActionLoading(false);
  };

  const handleEnrollFoundation = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/church/foundation/enroll`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          soulId: id,
          churchId: soul.church?._id
        })
      });
      const data = await res.json();
      if (data.ok) {
        // Update soul status
        await handleUpdateStatus('foundation_school');
        setShowEnrollModal(false);
        alert('Successfully enrolled in Foundation School!');
      } else {
        alert(data.error || 'Failed to enroll');
      }
    } catch (err) {
      console.error('Enroll error:', err);
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!soul) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Soul not found</p>
          <Link href="/church/souls">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">
              Back to Soul Tracker
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[soul.status] || statusConfig.new;
  const followUps = soul.followUps || [];
  const daysSinceSalvation = Math.floor((Date.now() - new Date(soul.salvationDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{soul.firstName} {soul.lastName} - Soul Tracker</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/church/souls" className="inline-flex items-center gap-2 text-pink-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Soul Tracker
          </Link>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {soul.firstName?.[0]}{soul.lastName?.[0] || ''}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {soul.firstName} {soul.lastName}
                </h1>
                <StatusBadge status={soul.status} size="lg" />
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-pink-100 text-sm">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {soul.phone}
                </span>
                {soul.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {soul.email}
                  </span>
                )}
                {soul.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {soul.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Saved {daysSinceSalvation} days ago
                </span>
              </div>

              {/* Status Progress */}
              <div className="mt-4">
                <StatusProgress currentStatus={soul.status} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowFollowUpModal(true)}
                className="px-4 py-2 bg-white text-pink-600 rounded-xl font-semibold hover:bg-pink-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Follow-up
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-4 py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'followups', label: 'Follow-ups', icon: Activity, count: followUps.length },
              { id: 'foundation', label: 'Foundation School', icon: GraduationCap }
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-4 font-medium border-b-2 transition flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {count !== undefined && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Personal Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {soul.firstName} {soul.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium text-gray-900 dark:text-white">{soul.phone}</p>
                  </div>
                  {soul.email && (
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium text-gray-900 dark:text-white">{soul.email}</p>
                    </div>
                  )}
                  {soul.gender && (
                    <div>
                      <label className="text-sm text-gray-500">Gender</label>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{soul.gender}</p>
                    </div>
                  )}
                  {soul.ageGroup && (
                    <div>
                      <label className="text-sm text-gray-500">Age Group</label>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {soul.ageGroup.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                  {soul.address && (
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-500">Address</label>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {soul.address}{soul.city && `, ${soul.city}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Salvation Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Salvation Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Salvation Date</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(soul.salvationDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type</label>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {soul.salvationType?.replace('_', ' ') || 'First Time'}
                    </p>
                  </div>
                  {soul.howTheyHeard && (
                    <div>
                      <label className="text-sm text-gray-500">How They Heard</label>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {soul.howTheyHeard.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                  {soul.witnessedBy && (
                    <div>
                      <label className="text-sm text-gray-500">Witnessed By</label>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {soul.witnessedBy.name || soul.witnessedBy.username}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {soul.notes && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Notes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{soul.notes}</p>
                </div>
              )}

              {/* Prayer Requests */}
              {soul.prayerRequests?.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-purple-500" />
                    Prayer Requests
                  </h3>
                  <ul className="space-y-2">
                    {soul.prayerRequests.map((request, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-purple-500">•</span>
                        {request}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Follow-ups</span>
                    <span className="font-bold text-gray-900 dark:text-white">{followUps.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Days Since Salvation</span>
                    <span className="font-bold text-gray-900 dark:text-white">{daysSinceSalvation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Current Status</span>
                    <StatusBadge status={soul.status} />
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Assignment</h3>
                
                {soul.church && (
                  <div className="mb-3">
                    <label className="text-sm text-gray-500">Church</label>
                    <p className="font-medium text-gray-900 dark:text-white">{soul.church.name}</p>
                  </div>
                )}
                
                {soul.cell && (
                  <div className="mb-3">
                    <label className="text-sm text-gray-500">Cell</label>
                    <p className="font-medium text-gray-900 dark:text-white">{soul.cell.name}</p>
                  </div>
                )}
                
                {soul.assignedTo && (
                  <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <img
                      src={soul.assignedTo.profilePicture || '/default-avatar.png'}
                      alt={soul.assignedTo.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Assigned to</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {soul.assignedTo.name || soul.assignedTo.username}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Foundation School CTA */}
              {!soul.foundationSchool?.enrolled && soul.status !== 'foundation_school' && soul.status !== 'graduated' && (
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
                  <GraduationCap className="w-10 h-10 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Foundation School</h3>
                  <p className="text-purple-200 text-sm mb-4">
                    Enroll {soul.firstName} in our discipleship program
                  </p>
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="w-full py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50"
                  >
                    Enroll Now
                  </button>
                </div>
              )}

              {/* Foundation School Progress */}
              {(soul.foundationSchool?.enrolled || soul.status === 'foundation_school' || soul.status === 'graduated') && (
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    {soul.status === 'graduated' ? (
                      <Award className="w-10 h-10" />
                    ) : (
                      <BookOpen className="w-10 h-10" />
                    )}
                    <div>
                      <h3 className="font-bold">Foundation School</h3>
                      <p className="text-green-200 text-sm">
                        {soul.status === 'graduated' ? 'Graduated! 🎉' : 'Currently Enrolled'}
                      </p>
                    </div>
                  </div>
                  {soul.foundationSchool?.currentModule && (
                    <p className="text-sm">
                      Current Module: {soul.foundationSchool.currentModule} of 6
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Follow-ups Tab */}
        {activeTab === 'followups' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Follow-up History ({followUps.length})
              </h2>
              <button
                onClick={() => setShowFollowUpModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Follow-up
              </button>
            </div>

            {followUps.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Follow-ups Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start tracking your follow-up efforts with {soul.firstName}
                </p>
                <button
                  onClick={() => setShowFollowUpModal(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                >
                  Add First Follow-up
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {followUps.slice().reverse().map((followUp, i) => (
                  <FollowUpCard key={i} followUp={followUp} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Foundation School Tab */}
        {activeTab === 'foundation' && (
          <div className="space-y-6">
            {soul.foundationSchool?.enrolled || soul.status === 'foundation_school' || soul.status === 'graduated' ? (
              <>
                {/* Enrolled State */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {soul.status === 'graduated' ? (
                        <Award className="w-12 h-12" />
                      ) : (
                        <BookOpen className="w-12 h-12" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold">
                          {soul.status === 'graduated' ? 'Foundation School Graduate' : 'Enrolled in Foundation School'}
                        </h3>
                        <p className="text-purple-200">
                          {soul.status === 'graduated' 
                            ? `Graduated on ${new Date(soul.foundationSchool?.graduatedAt).toLocaleDateString()}`
                            : `Enrolled on ${new Date(soul.foundationSchool?.enrolledAt).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                    </div>
                    {soul.status === 'graduated' && (
                      <div className="text-right">
                        <span className="px-4 py-2 bg-white/20 rounded-full font-medium">
                          🎓 Certified
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Module Progress would go here */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Module Progress</h3>
                  <p className="text-gray-500">
                    View detailed progress in the Foundation School section.
                  </p>
                  <Link href="/church/foundation">
                    <button className="mt-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg font-medium">
                      View Foundation School →
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              /* Not Enrolled State */
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Not Enrolled Yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {soul.firstName} has not been enrolled in Foundation School yet.
                  Enroll them to begin their discipleship journey.
                </p>
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700"
                >
                  Enroll in Foundation School
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddFollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        onSubmit={handleAddFollowUp}
        loading={actionLoading}
      />

      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={soul.status}
        onSubmit={handleUpdateStatus}
        loading={actionLoading}
      />

      <EnrollFoundationModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        soul={soul}
        onSubmit={handleEnrollFoundation}
        loading={actionLoading}
      />
    </div>
  );
}
