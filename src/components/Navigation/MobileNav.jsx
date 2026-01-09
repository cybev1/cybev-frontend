// ============================================
// FILE: src/components/Navigation/MobileNav.jsx
// PURPOSE: Mobile bottom navigation bar
// FIXED: Removed /dashboard, uses /feed and /studio
// ============================================

import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Home,
  Search,
  PlusSquare,
  Bell,
  User,
  Sparkles,
  Wallet
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

  const isActive = (item) => {
    return item.matchPaths.some(path => 
      currentPath === path || currentPath.startsWith(path + '/')
    );
  };

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center justify-center p-2 -mt-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className={`mobile-nav-item ${active ? 'active' : ''}`}>
                <Icon className={`icon ${active ? 'text-purple-400' : 'text-gray-400'}`} />
                <span className={`label ${active ? 'text-purple-400' : 'text-gray-500'}`}>
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

// Alternative expanded nav - FIXED: Uses /feed and /studio
export function MobileNavExpanded() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { label: 'Feed', href: '/feed', icon: Home },
    { label: 'Studio', href: '/studio', icon: Sparkles },
    { label: 'Create', href: '/post/create', icon: PlusSquare, isAction: true },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Profile', href: '/profile', icon: User }
  ];

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const active = currentPath === item.href || currentPath.startsWith(item.href + '/');
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center justify-center p-2 -mt-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 haptic-tap">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className={`mobile-nav-item haptic-tap ${active ? 'active' : ''}`}>
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
