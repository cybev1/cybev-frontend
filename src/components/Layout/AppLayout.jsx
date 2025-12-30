// ============================================
// FILE: src/components/Layout/AppLayout.jsx
// PATH: cybev-frontend/src/components/Layout/AppLayout.jsx
// PURPOSE: Main app layout with navigation, admin link for admins, PWA support
// ============================================

import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Home, 
  TrendingUp,
  User, 
  LogOut, 
  Settings,
  Coins,
  Menu,
  X,
  Search,
  Bell,
  MessageCircle,
  Shield,
  Wallet,
  PenSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from '@/components/notificationBell';
import MobileNav from '@/components/Navigation/MobileNav';

// CYBEV Logo Component with text
function CybevLogo({ size = 40, showText = true }) {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div 
        className="relative rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)' }}
        >
          {/* Rounded background is handled by parent div */}
          
          {/* C Letter */}
          <path 
            d="M52 25 
               C 38 25, 22 36, 22 50 
               C 22 64, 38 75, 52 75
               L 52 62
               C 42 62, 32 57, 32 50
               C 32 43, 42 38, 52 38
               Z"
            fill="white"
          />
          
          {/* Blockchain dots */}
          <circle cx="62" cy="32" r="5" fill="white" opacity="0.95"/>
          <circle cx="62" cy="68" r="5" fill="white" opacity="0.95"/>
          <circle cx="72" cy="50" r="3.5" fill="white" opacity="0.75"/>
          
          {/* Connecting line */}
          <line x1="62" y1="38" x2="62" y2="62" stroke="white" strokeWidth="2.5" opacity="0.5"/>
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
          CYBEV
        </span>
      )}
    </div>
  );
}

export default function AppLayout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
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

  // Check if user is admin - check both role and isAdmin flag
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  // Dynamic profile link
  const profileLink = user?.username ? `/profile/${user.username}` : '/profile';

  const navLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/feed', icon: TrendingUp, label: 'Feed' },
    { path: '/studio', icon: PenSquare, label: 'Create' },
    { path: profileLink, icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path.includes('/profile/') || path === '/profile') {
      return router.pathname.startsWith('/profile');
    }
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-black/40 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard">
              <div className="cursor-pointer">
                <CybevLogo size={40} showText={true} />
              </div>
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
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </button>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search */}
              <Link href="/search">
                <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors" title="Search">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </Link>

              {/* Notifications */}
              <NotificationBell />

              {/* Messages */}
              <Link href="/messages">
                <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors relative" title="Messages">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                </button>
              </Link>

              {/* Token Balance */}
              <Link href="/wallet">
                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:border-yellow-500/40 transition-colors">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">{tokenBalance} CYBEV</span>
                </div>
              </Link>

              {/* Admin Link - Only show for admins */}
              {isAdmin && (
                <Link href="/admin">
                  <button 
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors relative" 
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5 text-red-400" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </Link>
              )}

              {/* Settings */}
              <Link href="/settings">
                <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors" title="Settings">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-500/20 bg-black/80 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-gray-300 hover:bg-purple-500/10'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </button>
                </Link>
              ))}

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-purple-500/20 space-y-2">
                <Link href="/search">
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-500/10"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </Link>
                
                <Link href="/notifications">
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-500/10"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>
                </Link>
                
                <Link href="/messages">
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-500/10"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Messages</span>
                  </button>
                </Link>

                <Link href="/wallet">
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-500/10"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Wallet</span>
                    <span className="ml-auto text-yellow-400 text-sm">{tokenBalance} CYBEV</span>
                  </button>
                </Link>

                {/* Admin Link - Mobile */}
                {isAdmin && (
                  <Link href="/admin">
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                      <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                  </Link>
                )}
                
                <Link href="/settings">
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-500/10"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </Link>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0 main-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation - PWA optimized */}
      <MobileNav />
    </div>
  );
}

// Export the logo component for use elsewhere
export { CybevLogo };
