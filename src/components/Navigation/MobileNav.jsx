// ============================================
// FILE: src/components/Navigation/MobileNav.jsx
// CYBEV Design System v7.1.0
// PURPOSE: Clean white mobile bottom navigation
// VERSION: 7.1.0 - Studio = Home
// UPDATED: 2026-01-14
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Home,
  Search,
  PlusSquare,
  Bell,
  User,
  Sparkles,
  Video,
  Pencil,
  FileText,
  Image,
  Mic,
  Calendar,
  Users,
  X,
  Church,
  Tv,
  MessageCircle,
  Play
} from 'lucide-react';

// ==========================================
// NAVIGATION ITEMS - Studio is HOME
// ==========================================
const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/studio',
    icon: Home,
    matchPaths: ['/studio', '/']
  },
  {
    label: 'Feed',
    href: '/feed',
    icon: Sparkles,
    matchPaths: ['/feed']
  },
  {
    label: 'Create',
    href: '/post/create',
    icon: PlusSquare,
    matchPaths: ['/post/create', '/blog/create'],
    isAction: true
  },
  {
    label: 'Reels',
    href: '/vlog',
    icon: Play,
    matchPaths: ['/vlog', '/reels']
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    matchPaths: ['/profile', '/settings']
  }
];

// ==========================================
// MAIN MOBILE NAV COMPONENT
// ==========================================
export default function MobileNav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.ok) setUnreadCount(data.count || 0);
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (item) => {
    return item.matchPaths.some(
      (path) => currentPath === path || currentPath.startsWith(path + '/')
    );
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    setShowCreateMenu(true);
  };

  return (
    <>
      {/* ==========================================
          BOTTOM NAV BAR - Clean White
          ========================================== */}
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center h-full">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            // Create Button - Center Elevated
            if (item.isAction) {
              return (
                <button
                  key={item.href}
                  onClick={handleCreateClick}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="mobile-nav-create">
                    <Icon className="w-6 h-6" />
                  </div>
                </button>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <div className={`mobile-nav-item ${active ? 'active' : ''}`}>
                  <div className="relative">
                    <Icon
                      className={`icon ${active ? 'text-purple-600' : 'text-gray-500'}`}
                    />
                    {item.label === 'Alerts' && unreadCount > 0 && (
                      <span className="badge-notification">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`label ${active ? 'text-purple-600' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ==========================================
          CREATE MENU MODAL
          ========================================== */}
      {showCreateMenu && (
        <CreateMenuModal onClose={() => setShowCreateMenu(false)} />
      )}
    </>
  );
}

// ==========================================
// CREATE MENU MODAL - Clean Design
// ==========================================
function CreateMenuModal({ onClose }) {
  const router = useRouter();

  const createOptions = [
    {
      label: 'Post',
      description: 'Share a thought',
      icon: Pencil,
      href: '/post/create',
      color: '#7C3AED',
      bgColor: '#EDE9FE'
    },
    {
      label: 'Blog',
      description: 'Write an article',
      icon: FileText,
      href: '/blog/create',
      color: '#3B82F6',
      bgColor: '#DBEAFE'
    },
    {
      label: 'Video',
      description: 'Upload a video',
      icon: Video,
      href: '/vlog/create',
      color: '#EF4444',
      bgColor: '#FEE2E2'
    },
    {
      label: 'Story',
      description: '24hr moment',
      icon: Image,
      href: '/story/create',
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    },
    {
      label: 'Live',
      description: 'Go live now',
      icon: Mic,
      href: '/live/start',
      color: '#EC4899',
      bgColor: '#FCE7F3'
    },
    {
      label: 'Event',
      description: 'Create event',
      icon: Calendar,
      href: '/events/create',
      color: '#10B981',
      bgColor: '#D1FAE5'
    },
    {
      label: 'Group',
      description: 'Start community',
      icon: Users,
      href: '/groups/create',
      color: '#06B6D4',
      bgColor: '#CFFAFE'
    },
    {
      label: 'AI Blog',
      description: 'Generate with AI',
      icon: Sparkles,
      href: '/studio/ai-blog',
      color: '#8B5CF6',
      bgColor: '#EDE9FE'
    }
  ];

  const handleNavigate = (href) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-slide-up safe-bottom">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <h3 className="text-xl font-bold text-gray-900">Create</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-4 gap-2 px-4 pb-6">
          {createOptions.map((option) => (
            <button
              key={option.href}
              onClick={() => handleNavigate(option.href)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl active:bg-gray-50 transition-colors"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: option.bgColor }}
              >
                <option.icon
                  className="w-6 h-6"
                  style={{ color: option.color }}
                />
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-gray-900 block">
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EXPANDED MOBILE NAV (Alternative)
// ==========================================
export function MobileNavExpanded() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems = [
    { label: 'Home', href: '/studio', icon: Home },
    { label: 'TV', href: '/tv', icon: Tv },
    { label: 'Create', href: '/post/create', icon: PlusSquare, isAction: true },
    { label: 'Chat', href: '/messages', icon: MessageCircle },
    { label: 'Profile', href: '/profile', icon: User }
  ];

  const isActive = (href) => {
    if (href === '/studio') return currentPath === '/studio' || currentPath === '/' || currentPath.startsWith('/studio/');
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center justify-center -mt-5">
                  <div className="mobile-nav-create">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className={`mobile-nav-item ${active ? 'active' : ''}`}>
                <Icon
                  className={`w-6 h-6 ${active ? 'text-purple-600' : 'text-gray-500'}`}
                />
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    active ? 'text-purple-600' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ==========================================
// CHURCH MOBILE NAV
// ==========================================
export function MobileNavChurch({ orgId }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { label: 'Home', href: `/church/org/${orgId}`, icon: Home },
    { label: 'Cells', href: `/church/cells/dashboard?orgId=${orgId}`, icon: Users },
    { label: 'Reports', href: `/church/cells/reports?orgId=${orgId}`, icon: FileText },
    { label: 'Events', href: `/church/org/${orgId}/events`, icon: Calendar },
    { label: 'Profile', href: '/profile', icon: User }
  ];

  const isActive = (href) => currentPath.includes(href.split('?')[0]);

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.label} href={item.href}>
              <div className={`mobile-nav-item ${active ? 'active' : ''}`}>
                <Icon
                  className={`w-6 h-6 ${active ? 'text-purple-600' : 'text-gray-500'}`}
                />
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    active ? 'text-purple-600' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
