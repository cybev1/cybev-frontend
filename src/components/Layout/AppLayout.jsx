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
  Bell,
  MessageCircle,
  Shield,
  Wallet
} from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from '@/components/notificationBell';
import MobileBottomNav from '@/components/MobileBottomNav';

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

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  const navLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/feed', icon: TrendingUp, label: 'Feed' },
    { path: '/studio', icon: Sparkles, label: 'Create' },
    { path: `/profile/${user?.username || ''}`, icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path.includes('/profile/')) {
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
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CYBEV
                </span>
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
            <div className="hidden md:flex items-center gap-3">
              {/* Search */}
              <Link href="/search">
                <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </Link>

              {/* Notifications */}
              <NotificationBell />

              {/* Messages */}
              <Link href="/messages">
                <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors relative">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                </button>
              </Link>

              {/* Token Balance */}
              <Link href="/wallet">
                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:border-yellow-500/40 transition-colors">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{tokenBalance} CYBEV</span>
                </div>
              </Link>

              {/* Admin Link - Only show for admins */}
              {isAdmin && (
                <Link href="/admin">
                  <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors" title="Admin Dashboard">
                    <Shield className="w-5 h-5 text-red-400" />
                  </button>
                </Link>
              )}

              {/* Settings */}
              <Link href="/settings">
                <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
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
          <div className="md:hidden border-t border-purple-500/20 bg-black/60 backdrop-blur-xl">
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
                  onClick={handleLogout}
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
      <main className="pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
