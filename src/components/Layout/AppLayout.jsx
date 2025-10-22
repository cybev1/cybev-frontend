// ============================================
// FILE: src/components/Layout/AppLayout.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Home, PenTool, Coins, User, Menu, X, 
  TrendingUp, Sparkles, LogOut, Settings, Bell, Bookmark
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AppLayout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/blog', label: 'Explore', icon: TrendingUp },
    { href: '/blog/create', label: 'Write', icon: PenTool },
    { href: '/bookmarks', label: 'Saved', icon: Bookmark },
    { href: '/rewards/dashboard', label: 'Rewards', icon: Coins },
  ];

  const isActive = (path) => router.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg' 
          : 'bg-white/80 backdrop-blur-lg border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                  C
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CYBEV
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200 hover:shadow-md transition-all"
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-900 font-semibold">
                      {user.name || user.username || 'User'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-2">
                        <Link href={`/profile/${user.username}`}>
                          <div
                            onClick={() => setShowUserMenu(false)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                          >
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </Link>

                        <Link href="/settings">
                          <div
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </div>
                        </Link>

                        <div className="border-t border-gray-100 my-2" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/login">
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all font-semibold shadow-md">
                    Sign In
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <div
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link href={`/profile/${user.username}`}>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200 mb-3">
                        <User className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-900 font-semibold">
                          {user.name || user.username}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all border border-red-200"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login">
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-md">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 safe-bottom">
        <div className="flex justify-around items-center px-2 py-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  active ? 'text-purple-600' : 'text-gray-500 hover:text-gray-900'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">
                    {link.label.split(' ')[0]}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ============================================
// FILE: src/pages/dashboard.jsx
// ============================================
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { PenTool, TrendingUp, Coins, Sparkles, Users } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const quickActions = [
    {
      title: 'Write a Blog',
      description: 'Create your next amazing post',
      icon: PenTool,
      href: '/blog/create',
      gradient: 'from-purple-600 to-pink-600',
      emoji: '✍️'
    },
    {
      title: 'Explore Blogs',
      description: 'Discover trending content',
      icon: TrendingUp,
      href: '/blog',
      gradient: 'from-blue-600 to-cyan-600',
      emoji: '📚'
    },
    {
      title: 'View Rewards',
      description: 'Check your earnings',
      icon: Coins,
      href: '/rewards/dashboard',
      gradient: 'from-yellow-600 to-orange-600',
      emoji: '💰'
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome Back! 👋
            </h1>
            <p className="text-xl text-gray-300">
              Ready to create something amazing today?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href={action.href}>
                  <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-purple-500/50 transition-all cursor-pointer">
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      {action.emoji}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">What's New</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✨
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Comments & Discussions</h4>
                  <p className="text-sm">Engage with readers through threaded comments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  🔖
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Bookmarks</h4>
                  <p className="text-sm">Save your favorite posts for later reading</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  👥
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Follow System</h4>
                  <p className="text-sm">Connect with writers and build your network</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  🔔
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Real-time Notifications</h4>
                  <p className="text-sm">Stay updated with likes, comments, and followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
