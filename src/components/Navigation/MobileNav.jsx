// ============================================
// FILE: src/components/Navigation/MobileNav.jsx
// PATH: cybev-frontend/src/components/Navigation/MobileNav.jsx
// PURPOSE: Mobile Bottom Navigation - Clean White Design
// VERSION: 7.0.0 - Facebook-style clean white design
// PREVIOUS: 6.8.x - Dark blur mobile nav
// ROLLBACK: Restore previous MobileNav.jsx
// GITHUB: https://github.com/cybev1/cybev-frontend
// UPDATED: 2026-01-12
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
  Wallet,
  Church,
  FileText,
  Video,
  Pencil,
  X,
  Image,
  Mic,
  Calendar,
  Users,
  MoreHorizontal,
  Globe,
  Play
} from 'lucide-react';

// ==========================================
// MAIN NAVIGATION ITEMS
// ==========================================
const NAV_ITEMS = [
  {
    label: 'Feed',
    href: '/feed',
    icon: Home,
    matchPaths: ['/feed', '/']
  },
  {
    label: 'Search',
    href: '/search',
    icon: Search,
    matchPaths: ['/search']
  },
  {
    label: 'Create',
    href: '/post/create',
    icon: PlusSquare,
    matchPaths: ['/post/create', '/blog/create'],
    isAction: true
  },
  {
    label: 'Alerts',
    href: '/notifications',
    icon: Bell,
    matchPaths: ['/notifications']
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    matchPaths: ['/profile', '/settings']
  }
];

// ==========================================
// MOBILE NAV COMPONENT
// ==========================================
export default function MobileNav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
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
    return item.matchPaths.some(path =>
      currentPath === path || currentPath.startsWith(path + '/')
    );
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    setShowCreateMenu(true);
  };

  return (
    <>
      {/* ==========================================
          MOBILE BOTTOM NAVIGATION BAR
          ========================================== */}
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            // Create Button - Floating Gradient
            if (item.isAction) {
              return (
                <button
                  key={item.href}
                  onClick={handleCreateClick}
                  className="flex flex-col items-center justify-center p-1 -mt-6"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white active:scale-95 transition-transform"
                    style={{ boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)' }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </button>
              );
            }

            // Regular Nav Item
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all ${
                  active ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  <div className="relative">
                    <Icon className={`w-6 h-6 ${active ? 'text-purple-600' : 'text-gray-500'}`} />
                    {item.label === 'Alerts' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold ${
                    active ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Create Menu Modal */}
      {showCreateMenu && (
        <CreateMenuModal onClose={() => setShowCreateMenu(false)} />
      )}
    </>
  );
}

// ==========================================
// CREATE MENU MODAL - Clean White Design
// ==========================================
function CreateMenuModal({ onClose }) {
  const router = useRouter();

  const createOptions = [
    {
      label: 'Post',
      description: 'Share a thought',
      icon: Pencil,
      href: '/post/create',
      color: '#7c3aed',
      bgColor: '#f3e8ff'
    },
    {
      label: 'Blog',
      description: 'Write an article',
      icon: FileText,
      href: '/studio/ai-blog',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      label: 'Video',
      description: 'Upload video',
      icon: Video,
      href: '/vlog/create',
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      label: 'Story',
      description: '24hr moment',
      icon: Image,
      href: '/story/create',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      label: 'Website',
      description: 'Build with AI',
      icon: Globe,
      href: '/studio/sites/new',
      color: '#ec4899',
      bgColor: '#fce7f3'
    },
    {
      label: 'Form',
      description: 'Create survey',
      icon: FileText,
      href: '/studio/forms/builder',
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      label: 'Event',
      description: 'Plan event',
      icon: Calendar,
      href: '/events/create',
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
    {
      label: 'Go Live',
      description: 'Start stream',
      icon: Play,
      href: '/live/start',
      color: '#ef4444',
      bgColor: '#fee2e2'
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
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Menu Panel */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden"
        style={{
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Create</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Grid of Options */}
        <div className="grid grid-cols-4 gap-3 px-4 pb-4">
          {createOptions.map((option) => (
            <button
              key={option.href}
              onClick={() => handleNavigate(option.href)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: option.bgColor }}
              >
                <option.icon className="w-6 h-6" style={{ color: option.color }} />
              </div>
              <span className="text-xs font-semibold text-gray-900 text-center">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// CHURCH MOBILE NAV VARIANT
// ==========================================
export function MobileNavChurch({ orgId }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { label: 'Home', href: `/church/org/${orgId}`, icon: Home },
    { label: 'Cells', href: `/church/cells/dashboard?orgId=${orgId}`, icon: Users },
    { label: 'Reports', href: `/church/cells/reports?orgId=${orgId}`, icon: FileText },
    { label: 'Events', href: `/church/org/${orgId}/events`, icon: Calendar },
    { label: 'More', href: '#', icon: MoreHorizontal, isMore: true }
  ];

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const active = currentPath.includes(item.href.split('?')[0]);
          const Icon = item.icon;

          return (
            <Link key={item.label} href={item.href}>
              <div className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg ${
                active ? 'text-purple-600' : 'text-gray-500'
              }`}>
                <Icon className={`w-6 h-6 ${active ? 'text-purple-600' : 'text-gray-500'}`} />
                <span className={`text-[10px] mt-1 font-semibold ${
                  active ? 'text-purple-600' : 'text-gray-500'
                }`}>
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
// EXPANDED NAV WITH STUDIO & CHURCH
// ==========================================
export function MobileNavExpanded() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems = [
    { label: 'Feed', href: '/feed', icon: Home },
    { label: 'Studio', href: '/studio', icon: Sparkles },
    { label: 'Create', href: '/post/create', icon: PlusSquare, isAction: true },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'More', href: '#more', icon: MoreHorizontal, isMore: true }
  ];

  return (
    <>
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const active = currentPath === item.href || currentPath.startsWith(item.href + '/');
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <Link key={item.href} href={item.href}>
                  <div className="flex flex-col items-center justify-center p-1 -mt-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white active:scale-95 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Link>
              );
            }

            if (item.isMore) {
              return (
                <button
                  key="more"
                  onClick={() => setShowMoreMenu(true)}
                  className="flex flex-col items-center justify-center py-2 px-3"
                >
                  <Icon className="w-6 h-6 text-gray-500" />
                  <span className="text-[10px] mt-1 font-semibold text-gray-500">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex flex-col items-center justify-center py-2 px-3 ${
                  active ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  <Icon className={`w-6 h-6 ${active ? 'text-purple-600' : 'text-gray-500'}`} />
                  <span className={`text-[10px] mt-1 font-semibold ${
                    active ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* More Menu */}
      {showMoreMenu && (
        <MoreMenuModal onClose={() => setShowMoreMenu(false)} />
      )}
    </>
  );
}

// ==========================================
// MORE MENU MODAL
// ==========================================
function MoreMenuModal({ onClose }) {
  const router = useRouter();

  const menuItems = [
    { label: 'Profile', icon: User, href: '/profile', color: '#7c3aed', bgColor: '#f3e8ff' },
    { label: 'Notifications', icon: Bell, href: '/notifications', color: '#ef4444', bgColor: '#fee2e2' },
    { label: 'Church', icon: Church, href: '/church', color: '#f59e0b', bgColor: '#fef3c7' },
    { label: 'Forms', icon: FileText, href: '/studio/forms', color: '#10b981', bgColor: '#d1fae5' },
    { label: 'Events', icon: Calendar, href: '/events', color: '#ec4899', bgColor: '#fce7f3' },
    { label: 'Groups', icon: Users, href: '/groups', color: '#3b82f6', bgColor: '#dbeafe' },
    { label: 'Search', icon: Search, href: '/search', color: '#6b7280', bgColor: '#f3f4f6' },
  ];

  const handleNavigate = (href) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-4">
          <h3 className="text-lg font-bold text-gray-900">More</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-4 pb-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigate(item.href)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: item.bgColor }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <span className="font-semibold text-gray-900">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
