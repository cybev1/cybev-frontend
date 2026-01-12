// ============================================
// FILE: src/components/Layout/AppLayout.jsx
// PATH: cybev-frontend/src/components/Layout/AppLayout.jsx
// PURPOSE: Main App Layout - Clean White Design
// VERSION: 7.0.0 - Facebook-style clean white design
// PREVIOUS: 6.8.x - Dark purple gradient design
// ROLLBACK: Restore previous AppLayout.jsx
// GITHUB: https://github.com/cybev1/cybev-frontend
// UPDATED: 2026-01-12
// ============================================

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Tv,
  Building,
  Bell,
  MessageCircle,
  Search,
  Plus,
  Menu,
  X,
  Settings,
  LogOut,
  Shield,
  Wallet,
  Coins,
  ChevronDown,
  User
} from 'lucide-react';
import NotificationBell from '@/components/notificationBell';
import MobileNav from '@/components/Navigation/MobileNav';

// ==========================================
// CYBEV LOGO - Clean Design
// ==========================================
function CybevLogo({ size = 40, showText = true }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}
        >
          <path
            d="M52 25 C 38 25, 22 36, 22 50 C 22 64, 38 75, 52 75 L 52 62 C 42 62, 32 57, 32 50 C 32 43, 42 38, 52 38 Z"
            fill="white"
          />
          <circle cx="62" cy="32" r="5" fill="white" opacity="0.95" />
          <circle cx="62" cy="68" r="5" fill="white" opacity="0.95" />
          <circle cx="72" cy="50" r="3.5" fill="white" opacity="0.75" />
          <line x1="62" y1="38" x2="62" y2="62" stroke="white" strokeWidth="2.5" opacity="0.5" />
        </svg>
      </div>
      {showText && (
        <span className="text-xl font-bold text-purple-600 hidden sm:block">
          CYBEV
        </span>
      )}
    </div>
  );
}

// ==========================================
// DESKTOP NAV ITEM
// ==========================================
function NavItem({ href, icon: Icon, label, active, badge }) {
  return (
    <Link href={href}>
      <button
        className={`relative px-6 py-2.5 rounded-lg transition-all duration-200 group ${
          active
            ? 'text-purple-600 bg-purple-50'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
        title={label}
      >
        <Icon className={`w-6 h-6 ${active ? 'text-purple-600' : ''}`} />
        {active && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-purple-600 rounded-full" />
        )}
        {badge && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    </Link>
  );
}

// ==========================================
// ICON BUTTON
// ==========================================
function IconButton({ icon: Icon, onClick, href, badge, title, active }) {
  const content = (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
        active
          ? 'bg-purple-100 text-purple-600'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
      title={title}
    >
      <Icon className="w-5 h-5" />
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// ==========================================
// USER MENU DROPDOWN
// ==========================================
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold overflow-hidden">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
          ) : (
            user?.name?.[0] || 'U'
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
            {/* User Info */}
            <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
              <div className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0] || 'U'
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500">View your profile</p>
                </div>
              </div>
            </Link>

            <div className="h-px bg-gray-100 my-2" />

            {/* Menu Items */}
            <Link href="/wallet">
              <div className="px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-gray-700 font-medium">Wallet</span>
              </div>
            </Link>

            <Link href="/settings">
              <div className="px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium">Settings</span>
              </div>
            </Link>

            {isAdmin && (
              <Link href="/admin">
                <div className="px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Admin Dashboard</span>
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                </div>
              </Link>
            )}

            <div className="h-px bg-gray-100 my-2" />

            <button
              onClick={onLogout}
              className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-gray-700 font-medium">Log Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ==========================================
// MAIN APP LAYOUT
// ==========================================
export default function AppLayout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cybev_token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    router.push('/auth/login');
  };

  const isActive = (path) => {
    if (path === '/feed') {
      return router.pathname === '/feed' || router.pathname === '/';
    }
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/feed', icon: Home, label: 'Home' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/tv', icon: Tv, label: 'TV' },
    { path: '/studio', icon: Building, label: 'Studio' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ==========================================
          TOP NAVIGATION BAR - Clean White
          ========================================== */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <Link href="/feed">
                <div className="cursor-pointer">
                  <CybevLogo size={40} showText={true} />
                </div>
              </Link>

              {/* Search - Desktop */}
              <div className="hidden md:flex ml-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search CYBEV"
                    className="w-60 pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    onClick={() => router.push('/search')}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Center: Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  href={item.path}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.path)}
                />
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Create Button - Desktop */}
              <div className="hidden md:block">
                <Link href="/studio">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" />
                    Create
                  </button>
                </Link>
              </div>

              {/* Search - Mobile */}
              <div className="md:hidden">
                <IconButton href="/search" icon={Search} title="Search" />
              </div>

              {/* Notifications */}
              <NotificationBell />

              {/* Messages */}
              <IconButton href="/messages" icon={MessageCircle} title="Messages" />

              {/* User Menu */}
              <div className="hidden md:block">
                <UserMenu user={user} onLogout={handleLogout} />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            MOBILE MENU DROPDOWN
            ========================================== */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {/* User Profile Link */}
              <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0] || 'U'
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">View profile</p>
                  </div>
                </div>
              </Link>

              <div className="h-px bg-gray-100 my-2" />

              {/* Nav Items */}
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </Link>
              ))}

              <div className="h-px bg-gray-100 my-2" />

              {/* Additional Links */}
              <Link href="/wallet">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Wallet</span>
                  <span className="ml-auto text-sm text-yellow-600 font-semibold">
                    {tokenBalance} CYBEV
                  </span>
                </button>
              </Link>

              <Link href="/settings">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </Link>

              {(user?.role === 'admin' || user?.isAdmin) && (
                <Link href="/admin">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Admin Dashboard</span>
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                </Link>
              )}

              <div className="h-px bg-gray-100 my-2" />

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ==========================================
          MAIN CONTENT AREA
          ========================================== */}
      <main className="pb-20 md:pb-0 main-content">
        {children}
      </main>

      {/* ==========================================
          MOBILE BOTTOM NAVIGATION
          ========================================== */}
      <MobileNav />
    </div>
  );
}

export { CybevLogo };
