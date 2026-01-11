// ============================================
// FILE: src/components/Navigation/MobileNav.jsx
// PURPOSE: Mobile bottom navigation bar
// VERSION: 2.0 - Enhanced with Forms, Church, Studio
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
  MoreHorizontal
} from 'lucide-react';

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
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <button 
                  key={item.href} 
                  onClick={handleCreateClick}
                  className="flex flex-col items-center justify-center p-2 -mt-6"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-95 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </button>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <div className={`mobile-nav-item ${active ? 'active' : ''}`}>
                  <div className="relative">
                    <Icon className={`icon ${active ? 'text-purple-400' : 'text-gray-400'}`} />
                    {item.label === 'Alerts' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`label ${active ? 'text-purple-400' : 'text-gray-500'}`}>
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

// Create Menu Modal Component
function CreateMenuModal({ onClose }) {
  const router = useRouter();

  const createOptions = [
    {
      label: 'Post',
      description: 'Share a thought or update',
      icon: Pencil,
      href: '/post/create',
      color: '#7c3aed'
    },
    {
      label: 'Blog',
      description: 'Write a long-form article',
      icon: FileText,
      href: '/blog/create',
      color: '#3b82f6'
    },
    {
      label: 'Video',
      description: 'Upload or record a video',
      icon: Video,
      href: '/vlog/create',
      color: '#ef4444'
    },
    {
      label: 'Story',
      description: 'Share a moment (24hr)',
      icon: Image,
      href: '/story/create',
      color: '#f59e0b'
    },
    {
      label: 'Form',
      description: 'Create a survey or form',
      icon: FileText,
      href: '/studio/forms/builder',
      color: '#10b981'
    },
    {
      label: 'Event',
      description: 'Create an event',
      icon: Calendar,
      href: '/events/create',
      color: '#ec4899'
    },
    {
      label: 'Go Live',
      description: 'Start a live stream',
      icon: Mic,
      href: '/live/start',
      color: '#8b5cf6'
    },
    {
      label: 'Group',
      description: 'Create a community',
      icon: Users,
      href: '/groups/create',
      color: '#06b6d4'
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {createOptions.map((option) => (
            <button
              key={option.href}
              onClick={() => handleNavigate(option.href)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <option.icon className="w-6 h-6" style={{ color: option.color }} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Handle bar indicator */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Alternative expanded nav with Studio & Church
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
                  <div className="flex flex-col items-center justify-center p-2 -mt-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-95 transition-transform">
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
                  className="mobile-nav-item"
                >
                  <Icon className="w-6 h-6 text-gray-400" />
                  <span className="text-[10px] mt-1 font-medium text-gray-500">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <div className={`mobile-nav-item ${active ? 'active' : ''}`}>
                  <Icon className={`w-6 h-6 ${active ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span className={`text-[10px] mt-1 font-medium ${active ? 'text-purple-400' : 'text-gray-500'}`}>
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

// More Menu Modal
function MoreMenuModal({ onClose }) {
  const router = useRouter();

  const menuItems = [
    { label: 'Profile', icon: User, href: '/profile', color: '#7c3aed' },
    { label: 'Notifications', icon: Bell, href: '/notifications', color: '#ef4444' },
    { label: 'Church', icon: Church, href: '/church', color: '#f59e0b' },
    { label: 'Forms', icon: FileText, href: '/studio/forms', color: '#10b981' },
    { label: 'Events', icon: Calendar, href: '/events', color: '#ec4899' },
    { label: 'Groups', icon: Users, href: '/groups', color: '#3b82f6' },
    { label: 'Search', icon: Search, href: '/search', color: '#6b7280' },
  ];

  const handleNavigate = (href) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-8">
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        
        <div className="flex items-center justify-between mb-6 mt-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">More</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigate(item.href)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Church-focused mobile nav variant
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
              <div className={`mobile-nav-item ${active ? 'active' : ''}`}>
                <Icon className={`w-6 h-6 ${active ? 'text-purple-400' : 'text-gray-400'}`} />
                <span className={`text-[10px] mt-1 font-medium ${active ? 'text-purple-400' : 'text-gray-500'}`}>
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
