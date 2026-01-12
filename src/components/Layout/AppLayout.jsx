// ============================================
// FILE: src/components/Layout/AppLayout.jsx
// CYBEV Design System v7.0.0
// PURPOSE: Clean white navigation, Facebook-style layout
// VERSION: 7.0.0 - Clean bright design for mobile apps
// UPDATED: 2026-01-12
// ============================================

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Tv,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  MessageCircle,
  Shield,
  Wallet,
  Sparkles,
  ChevronDown,
  Plus,
  Building2,
  Coins,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import NotificationBell from '@/components/notificationBell';
import MobileNav from '@/components/Navigation/MobileNav';

// ==========================================
// CYBEV LOGO - Clean Design
// ==========================================
function CybevLogo({ size = 40, showText = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)' }}
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
        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hidden sm:block tracking-tight">
          CYBEV
        </span>
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setTokenBalance(parsedUser.tokenBalance || 0);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  // Fetch token balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
        const res = await fetch(`${API}/api/rewards/wallet`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success || data.ok) {
          setTokenBalance(data.balance || data.wallet?.balance || 0);
        }
      } catch (err) {
        console.log('Balance fetch error');
      }
    };
    fetchBalance();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cybev_token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    router.push('/auth/login');
  };

  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  const profileLink = user?.username ? `/profile/${user.username}` : '/profile';

  // Navigation items
  const navItems = [
    { path: '/feed', icon: Home, label: 'Home' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/tv', icon: Tv, label: 'TV' },
    { path: '/studio', icon: Sparkles, label: 'Studio' },
  ];

  const isActive = (path) => {
    if (path === '/feed') {
      return router.pathname === '/feed' || router.pathname === '/';
    }
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* ==========================================
          TOP NAVIGATION BAR - Clean White
          ========================================== */}
      <nav className="nav-top h-14 flex items-center">
        <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Link href="/feed">
              <div className="cursor-pointer">
                <CybevLogo size={40} showText={true} />
              </div>
            </Link>
            
            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex ml-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search CYBEV"
                  className="input-search w-60 h-10 pl-10 pr-4 text-sm"
                  onClick={() => router.push('/search')}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Center: Navigation - Desktop */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`relative flex items-center justify-center w-24 h-12 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-purple-600 rounded-t-full" />
                  )}
                </button>
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {/* Token Balance - Floating Style */}
            <Link href="/wallet">
              <button className="hidden sm:flex items-center gap-1.5 h-9 px-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full hover:border-amber-300 transition-colors">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 font-semibold text-sm">{tokenBalance}</span>
              </button>
            </Link>

            {/* Create Button - Mobile */}
            <button
              onClick={() => router.push('/studio')}
              className="md:hidden btn-icon"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Search - Mobile */}
            <button
              onClick={() => router.push('/search')}
              className="lg:hidden btn-icon"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Messages */}
            <Link href="/messages">
              <button className="btn-icon relative">
                <MessageCircle className="w-5 h-5" />
              </button>
            </Link>

            {/* Notifications */}
            <NotificationBell />

            {/* Profile Menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden ring-2 ring-white">
                  {user?.profilePicture || user?.avatar ? (
                    <img
                      src={user.profilePicture || user.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.[0] || 'U'}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="dropdown right-0 mt-2 w-72 p-2 animate-scale-in">
                    {/* Profile Link */}
                    <Link href={profileLink}>
                      <div
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                          {user?.profilePicture || user?.avatar ? (
                            <img
                              src={user.profilePicture || user.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold">
                              {user?.name?.[0] || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-500">View your profile</p>
                        </div>
                      </div>
                    </Link>

                    <div className="divider my-2" />

                    {/* Menu Items */}
                    <Link href="/settings">
                      <div
                        className="dropdown-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                          <Settings className="w-5 h-5 text-gray-700" />
                        </div>
                        <span>Settings & Privacy</span>
                      </div>
                    </Link>

                    <Link href="/wallet">
                      <div
                        className="dropdown-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-gray-700" />
                        </div>
                        <span>Wallet</span>
                        <span className="ml-auto text-amber-500 font-semibold text-sm">
                          {tokenBalance} CYBEV
                        </span>
                      </div>
                    </Link>

                    {isAdmin && (
                      <Link href="/admin">
                        <div
                          className="dropdown-item"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-500" />
                          </div>
                          <span>Admin Dashboard</span>
                          <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                        </div>
                      </Link>
                    )}

                    <Link href="/help">
                      <div
                        className="dropdown-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                          <HelpCircle className="w-5 h-5 text-gray-700" />
                        </div>
                        <span>Help & Support</span>
                      </div>
                    </Link>

                    <div className="divider my-2" />

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="dropdown-item w-full text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-gray-700" />
                      </div>
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-icon"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ==========================================
          MOBILE MENU - Clean Slide Down
          ========================================== */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 bg-white z-50 md:hidden border-b border-gray-200 shadow-lg animate-slide-down">
            <div className="p-4 space-y-1">
              {/* Profile Section */}
              <Link href={profileLink}>
                <div
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    {user?.profilePicture || user?.avatar ? (
                      <img
                        src={user.profilePicture || user.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {user?.name?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">View your profile</p>
                  </div>
                </div>
              </Link>

              {/* Token Balance */}
              <Link href="/wallet">
                <div
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="font-medium text-gray-900">Wallet</span>
                  </div>
                  <span className="text-amber-600 font-semibold">{tokenBalance} CYBEV</span>
                </div>
              </Link>

              <div className="divider" />

              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-50 text-purple-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive(item.path) ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}

              <div className="divider" />

              {/* Settings */}
              <Link href="/settings">
                <div
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-gray-700" />
                  </div>
                  <span className="font-medium text-gray-700">Settings</span>
                </div>
              </Link>

              {/* Admin */}
              {isAdmin && (
                <Link href="/admin">
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-medium text-red-600">Admin Dashboard</span>
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-gray-700" />
                </div>
                <span className="font-medium text-gray-700">Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}
      <main className="pb-20 md:pb-0 min-h-[calc(100vh-56px)]">
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
