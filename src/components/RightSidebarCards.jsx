// ============================================
// FILE: src/components/Navigation/RightSidebarCards.jsx
// PURPOSE: Right sidebar with suggested content
// VERSION: 2.0 - Enhanced with real data & features
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Users, Calendar, Sparkles, ChevronRight, Heart,
  ExternalLink, UserPlus, Star, Clock, MapPin, Flame, Hash,
  FileText, Video, Gift, Zap, Award, BookOpen, Church, Bell
} from 'lucide-react';

export default function RightSidebarCards() {
  return (
    <div className="sticky top-20 space-y-4">
      <SuggestedUsersCard />
      <TrendingTopicsCard />
      <UpcomingEventsCard />
      <QuickActionsCard />
      <PromoCard />
      <FooterLinks />
    </div>
  );
}

// Suggested Users to Follow
function SuggestedUsersCard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const fetchSuggestedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/users/suggested?limit=3`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.ok) setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching suggested users:', err);
      // Fallback sample data for development
      setUsers([
        { _id: '1', username: 'creator_one', name: 'Creative One', avatar: null, followers: 1234, isVerified: true },
        { _id: '2', username: 'tech_guru', name: 'Tech Guru', avatar: null, followers: 5678, isVerified: false },
        { _id: '3', username: 'lifestyle_queen', name: 'Lifestyle Queen', avatar: null, followers: 9012, isVerified: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${API}/api/follow/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from list after following
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Who to Follow
        </h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {users.map(user => (
          <div key={user._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition">
            <div className="flex items-center gap-3">
              <Link href={`/@${user.username}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()
                  )}
                </div>
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link href={`/@${user.username}`}>
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate flex items-center gap-1">
                    {user.name || user.username}
                    {user.isVerified && (
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{user.username} · {formatFollowers(user.followers || 0)} followers
                  </p>
                </Link>
              </div>

              <button
                onClick={() => handleFollow(user._id)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-full transition"
              >
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link 
        href="/explore/people"
        className="block p-3 text-center text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
      >
        Show more
      </Link>
    </div>
  );
}

// Trending Topics
function TrendingTopicsCard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await fetch(`${API}/api/hashtags/trending?limit=5`);
      const data = await res.json();
      if (data.ok) setTopics(data.hashtags || []);
    } catch (err) {
      console.error('Error fetching trending:', err);
      // Fallback sample data
      setTopics([
        { tag: 'CYBEV', count: 1234, trend: 'up' },
        { tag: 'Web3', count: 892, trend: 'up' },
        { tag: 'CreatorEconomy', count: 567, trend: 'stable' },
        { tag: 'NFTs', count: 445, trend: 'down' },
        { tag: 'Crypto', count: 334, trend: 'up' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (topics.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Trending
        </h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {topics.map((topic, index) => (
          <Link 
            key={topic.tag} 
            href={`/hashtag/${topic.tag}`}
            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {index + 1} · Trending
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  #{topic.tag}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCount(topic.count)} posts
                </p>
              </div>
              {topic.trend === 'up' && (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
            </div>
          </Link>
        ))}
      </div>

      <Link 
        href="/explore/trending"
        className="block p-3 text-center text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
      >
        Show more
      </Link>
    </div>
  );
}

// Upcoming Events
function UpcomingEventsCard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/api/events?limit=3&upcoming=true`);
      const data = await res.json();
      if (data.ok) setEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      // Fallback sample data
      setEvents([
        { 
          _id: '1', 
          title: 'CYBEV Launch Party', 
          date: new Date(Date.now() + 86400000 * 3).toISOString(),
          location: 'Virtual',
          attendees: 156
        },
        { 
          _id: '2', 
          title: 'Creator Workshop', 
          date: new Date(Date.now() + 86400000 * 7).toISOString(),
          location: 'Online',
          attendees: 89
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading || events.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          Upcoming Events
        </h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {events.map(event => (
          <Link 
            key={event._id} 
            href={`/events/${event._id}`}
            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
          >
            <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
              {event.title}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.location}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {event.attendees} attending
            </p>
          </Link>
        ))}
      </div>

      <Link 
        href="/events"
        className="block p-3 text-center text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
      >
        View all events
      </Link>
    </div>
  );
}

// Quick Actions
function QuickActionsCard() {
  const actions = [
    { label: 'Create Post', icon: FileText, href: '/post/create', color: '#7c3aed' },
    { label: 'Go Live', icon: Video, href: '/live/start', color: '#ef4444' },
    { label: 'New Form', icon: FileText, href: '/studio/forms/builder', color: '#10b981' },
    { label: 'Create Event', icon: Calendar, href: '/events/create', color: '#f59e0b' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${action.color}15` }}
            >
              <action.icon className="w-4 h-4" style={{ color: action.color }} />
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Promo Card (for platform features, upgrades, etc.)
function PromoCard() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('promo_dismissed');
    if (isDismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('promo_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5" />
          <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">NEW</span>
        </div>
        <h4 className="font-semibold mb-1">Earn Crypto Rewards!</h4>
        <p className="text-sm text-white/80 mb-3">
          Create content, engage with the community, and earn tokens.
        </p>
        <Link 
          href="/rewards"
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Learn more <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Footer Links
function FooterLinks() {
  const links = [
    { label: 'About', href: '/about' },
    { label: 'Help', href: '/help' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'API', href: '/developers' }
  ];

  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
        {links.map(link => (
          <Link 
            key={link.href} 
            href={link.href}
            className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <p>© {new Date().getFullYear()} CYBEV. All rights reserved.</p>
    </div>
  );
}

// Alternative: Church-focused sidebar
export function ChurchSidebarCards({ orgId }) {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Church className="w-4 h-4 text-purple-500" />
          Ministry Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">24</p>
            <p className="text-xs text-gray-500">Cells</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">486</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">52</p>
            <p className="text-xs text-gray-500">Souls Won</p>
          </div>
          <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">12</p>
            <p className="text-xs text-gray-500">Events</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Link 
            href={`/church/cells/reports?orgId=${orgId}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Submit Cell Report</span>
          </Link>
          <Link 
            href={`/church/org/${orgId}/events/create`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-sm">Create Event</span>
          </Link>
          <Link 
            href={`/church/cells/training?orgId=${orgId}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <BookOpen className="w-5 h-5 text-purple-500" />
            <span className="text-sm">Leader Training</span>
          </Link>
        </div>
      </div>

      {/* Prayer Requests */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5" />
          <span className="font-semibold">Prayer Wall</span>
        </div>
        <p className="text-sm text-white/80 mb-3">
          12 new prayer requests this week
        </p>
        <Link 
          href={`/church/org/${orgId}/prayers`}
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          View prayers <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <FooterLinks />
    </div>
  );
}

// Alternative: Studio-focused sidebar
export function StudioSidebarCards() {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Creator Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Your Stats (30d)
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Views</span>
            <span className="font-semibold text-gray-900 dark:text-white">12.4K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Engagement</span>
            <span className="font-semibold text-green-600">+24%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">New Followers</span>
            <span className="font-semibold text-gray-900 dark:text-white">+156</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Earnings</span>
            <span className="font-semibold text-purple-600">$234.50</span>
          </div>
        </div>
        <Link 
          href="/studio/analytics"
          className="block mt-3 text-center text-sm text-purple-600 hover:underline"
        >
          View full analytics
        </Link>
      </div>

      {/* Tools */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Creator Tools</h3>
        <div className="space-y-2">
          <Link 
            href="/studio/forms"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FileText className="w-5 h-5 text-green-500" />
            <span className="text-sm">Forms Builder</span>
          </Link>
          <Link 
            href="/studio/sites"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <ExternalLink className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Website Builder</span>
          </Link>
          <Link 
            href="/studio/monetization"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="text-sm">Monetization</span>
          </Link>
        </div>
      </div>

      <PromoCard />
      <FooterLinks />
    </div>
  );
}
