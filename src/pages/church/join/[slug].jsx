// ============================================
// FILE: pages/church/join/[slug].jsx
// Organization Join Page - Handle invite links
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Church, Users, CheckCircle, XCircle, Loader2,
  ArrowRight, LogIn, UserPlus, MapPin, Globe,
  Calendar, Heart, Mail, Phone
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const typeConfig = {
  zone: { label: 'Zone', color: 'from-purple-500 to-indigo-600', icon: Globe },
  church: { label: 'Church', color: 'from-blue-500 to-cyan-600', icon: Church },
  fellowship: { label: 'Fellowship', color: 'from-green-500 to-emerald-600', icon: Users },
  cell: { label: 'Cell', color: 'from-orange-500 to-amber-600', icon: Heart },
  biblestudy: { label: 'Bible Study', color: 'from-pink-500 to-rose-600', icon: Calendar }
};

export default function JoinOrganizationPage() {
  const router = useRouter();
  const { slug, ref } = router.query;

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMembership, setUserMembership] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (slug) {
      fetchOrganization();
    }
  }, [slug]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Try to find by slug first, then by ID
      let res = await fetch(`${API_URL}/api/church/org/slug/${slug}`, { headers });
      
      if (!res.ok) {
        // Try by ID
        res = await fetch(`${API_URL}/api/church/org/${slug}`, { headers });
      }
      
      const data = await res.json();

      if (data.ok) {
        setOrg(data.org);
        
        // Check if user is already a member
        if (token && data.org.members) {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          const membership = data.org.members.find(m => 
            m.user?._id === userId || m.user === userId
          );
          setUserMembership(membership);
        }
      } else {
        setError(data.error || 'Organization not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login with return URL
      router.push(`/auth/login?redirect=/church/join/${slug}`);
      return;
    }

    try {
      setJoining(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/church/org/${org._id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ referrer: ref })
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
        setUserMembership({ status: 'active', role: 'member' });
        
        // If there's a group, redirect to it
        if (data.groupId) {
          setTimeout(() => {
            router.push(`/groups/${data.groupId}`);
          }, 2000);
        }
      } else {
        setError(data.error || 'Failed to join');
      }
    } catch (err) {
      console.error('Join error:', err);
      setError('Failed to join organization');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !org) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
            Organization Not Found
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/church">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-xl font-medium transition">
              Browse Organizations
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const config = typeConfig[org?.type] || typeConfig.church;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Head>
        <title>Join {org?.name || 'Organization'} | CYBEV</title>
        <meta name="description" content={`Join ${org?.name} on CYBEV`} />
      </Head>

      <div className="bg-white dark:bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${config.color} p-8 text-gray-900 text-center`}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            {org?.logo ? (
              <img src={org.logo} alt={org.name} className="w-14 h-14 object-contain rounded-xl" />
            ) : (
              <Icon className="w-10 h-10" />
            )}
          </div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
            {config.label}
          </span>
          <h1 className="text-2xl font-bold mb-2">{org?.name}</h1>
          {org?.motto && (
            <p className="text-white/80 text-sm italic">"{org.motto}"</p>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Description */}
          {org?.description && (
            <p className="text-gray-600 dark:text-gray-500 text-center mb-6">
              {org.description}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-100 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">{org?.memberCount || 0}</p>
              <p className="text-sm text-gray-500">Members</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-100 rounded-xl">
              <p className="text-2xl font-bold text-green-600">{org?.stats?.totalSouls || 0}</p>
              <p className="text-sm text-gray-500">Souls Won</p>
            </div>
          </div>

          {/* Contact Info */}
          {(org?.contact?.address || org?.contact?.email || org?.contact?.phone) && (
            <div className="mb-6 space-y-2">
              {org.contact.address && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{org.contact.address}{org.contact.city && `, ${org.contact.city}`}</span>
                </div>
              )}
              {org.contact.email && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-500 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{org.contact.email}</span>
                </div>
              )}
              {org.contact.phone && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-500 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{org.contact.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Meeting Schedule */}
          {org?.meetingSchedule?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">Meeting Schedule:</p>
              <div className="space-y-1">
                {org.meetingSchedule.slice(0, 2).map((schedule, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-500">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="capitalize">{schedule.day}</span>
                    <span>at</span>
                    <span>{schedule.time}</span>
                    {schedule.title && <span className="text-gray-500">- {schedule.title}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Welcome to {org?.name}!</p>
              <p className="text-sm">You have successfully joined.</p>
            </div>
          )}

          {/* Action Buttons */}
          {!success && (
            <div className="space-y-3">
              {userMembership?.status === 'active' ? (
                <>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center text-green-600">
                    <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                    <p className="font-medium">You're already a member!</p>
                  </div>
                  <Link href={`/church/org/${org._id}`}>
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-xl font-medium flex items-center justify-center gap-2 transition">
                      View Organization
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </>
              ) : userMembership?.status === 'pending' ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center text-yellow-600">
                  <Loader2 className="w-6 h-6 mx-auto mb-1" />
                  <p className="font-medium">Your request is pending approval</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition"
                  >
                    {joining ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        {org?.settings?.requireApproval ? 'Request to Join' : 'Join Now'}
                      </>
                    )}
                  </button>

                  {!isLoggedIn && (
                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{' '}
                      <Link href={`/auth/signup?redirect=/church/join/${slug}`}>
                        <span className="text-purple-600 hover:underline cursor-pointer">Sign up</span>
                      </Link>
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Powered by */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Powered by{' '}
              <Link href="/">
                <span className="text-purple-600 hover:underline cursor-pointer">CYBEV</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
