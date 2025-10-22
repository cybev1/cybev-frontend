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
