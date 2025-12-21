import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Home,
  TrendingUp,
  Sparkles,
  User,
  LogOut,
  Settings,
  Coins,
  Menu,
  X,
  Search,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import NotificationBell from '@/components/notificationBell';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function AppLayout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileHref, setProfileHref] = useState('/dashboard');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return;
      const u = JSON.parse(raw);
      const username = u?.username || u?.handle || u?.name;
      if (username) setProfileHref(`/profile/${encodeURIComponent(username)}`);
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    router.push('/auth/login');
  };

  const navLinks = useMemo(
    () => [
      { path: '/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/feed', icon: TrendingUp, label: 'Feed' },
      { path: '/blog', icon: FileText, label: 'Blogs' },
      { path: '/studio', icon: Sparkles, label: 'Studio' },
      { path: profileHref, icon: User, label: 'Profile' },
    ],
    [profileHref]
  );

  const isActive = (path) => {
    if (!path) return false;
    // Handle sections
    if (path === '/blog') return router.pathname.startsWith('/blog');
    if (path === '/studio') return router.pathname === '/studio' || router.pathname.startsWith('/studio/');
    return router.pathname === path || router.asPath === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-black/40 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CYBEV
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-300 hover:bg-purple-500/10 hover:text-white'
                    }`}
                    type="button"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </button>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search (desktop) */}
              <button
                className="hidden md:inline-flex p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                type="button"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>

              {/* Notifications */}
              <NotificationBell />

              {/* Messages (desktop) */}
              <button
                className="hidden md:inline-flex p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                type="button"
                aria-label="Messages"
              >
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </button>

              {/* Token Balance (desktop) */}
              <div className="hidden md:flex bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 px-4 py-2 rounded-lg items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">0 CYBEV</span>
              </div>

              {/* Mobile menu button (mobile only) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                type="button"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>

              {/* Desktop logout */}
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                type="button"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (secondary actions) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-500/20 bg-black/60 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              <Link href="/settings/domain" onClick={() => setMobileMenuOpen(false)} className="block">
                <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-500/10">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
                type="button"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pb-mobile-nav md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
