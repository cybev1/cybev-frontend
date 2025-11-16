import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Wand2,
  Sparkles,
  Zap,
  FileText,
  Rocket,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Coins,
  TrendingUp,
  BarChart3,
  Crown,
  ChevronRight,
  Users,
  Eye,
  Heart,
  Layout,
  Settings,
  BookOpen
} from 'lucide-react';

export default function Studio() {
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    weeklyViews: 0,
    totalPosts: 0,
    followers: 0
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  // Creation options that ACTUALLY WORK
  const creationOptions = [
    {
      id: 'blog',
      title: 'Blog Post',
      description: 'Write and publish articles instantly',
      icon: FileText,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      badge: 'Working Now',
      earnings: '50 coins',
      route: '/blog/create',
      available: true
    },
    {
      id: 'ai-website',
      title: 'AI Website Builder',
      description: 'Generate complete websites with AI',
      icon: Wand2,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      badge: 'Coming Soon',
      earnings: '100 coins',
      route: '#',
      available: false
    },
    {
      id: 'landing',
      title: 'Landing Page',
      description: 'Build high-converting pages',
      icon: Rocket,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      badge: 'Coming Soon',
      earnings: '75 coins',
      route: '#',
      available: false
    },
    {
      id: 'portfolio',
      title: 'Portfolio Site',
      description: 'Showcase your work professionally',
      icon: Briefcase,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      badge: 'Coming Soon',
      earnings: '80 coins',
      route: '#',
      available: false
    },
    {
      id: 'store',
      title: 'Online Store',
      description: 'Create an e-commerce website',
      icon: ShoppingBag,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      badge: 'Coming Soon',
      earnings: '120 coins',
      route: '#',
      available: false
    },
    {
      id: 'course',
      title: 'Course Platform',
      description: 'Build educational content sites',
      icon: GraduationCap,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      badge: 'Coming Soon',
      earnings: '100 coins',
      route: '#',
      available: false
    }
  ];

  const quickActions = [
    {
      title: 'Browse Blogs',
      description: 'See what others are creating',
      icon: BookOpen,
      route: '/blog',
      color: 'blue'
    },
    {
      title: 'My Blogs',
      description: 'View your published content',
      icon: FileText,
      route: '/blog?filter=my',
      color: 'purple'
    },
    {
      title: 'Templates',
      description: 'Explore blog templates',
      icon: Layout,
      route: '/studio/templates',
      color: 'pink'
    }
  ];

  const handleCreateClick = (option) => {
    if (option.available) {
      router.push(option.route);
    } else {
      alert(`${option.title} is coming soon! 🚀\n\nFor now, try creating a Blog Post!`);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 -right-48 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-full mb-4"
                  >
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300 font-semibold">Creator Studio</span>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Welcome back{user ? `, ${user.name}` : ''}! 👋
                  </h1>
                  <p className="text-purple-200 text-lg max-w-2xl">
                    Ready to create something amazing? Start with a blog post or explore other options!
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <Coins className="w-6 h-6 text-yellow-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{userStats.totalEarnings}</p>
                    <p className="text-xs text-purple-200">Total Earnings</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{userStats.totalPosts}</p>
                    <p className="text-xs text-purple-200">Posts Created</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 mb-8 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    ✨ Start Creating Now!
                  </h2>
                  <p className="text-white/90">
                    Click "Blog Post" below to create your first article
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Creation Options */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-purple-400" />
                  What do you want to create?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {creationOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: option.available ? 1.03 : 1, y: option.available ? -5 : 0 }}
                      onClick={() => handleCreateClick(option)}
                      className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 ${
                        option.available 
                          ? 'cursor-pointer hover:border-purple-500/50' 
                          : 'opacity-60 cursor-not-allowed'
                      } group overflow-hidden`}
                    >
                      {option.badge && (
                        <div className={`absolute top-4 right-4 ${
                          option.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-gray-200'
                        } text-xs font-bold px-3 py-1 rounded-full`}>
                          {option.badge}
                        </div>
                      )}
                      
                      <div className={`w-14 h-14 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center mb-4 ${
                        option.available ? 'group-hover:scale-110' : ''
                      } transition-transform`}>
                        <option.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                      <p className="text-purple-200 text-sm mb-4">{option.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                          <Coins className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-sm font-semibold">{option.earnings}</span>
                        </div>
                        {option.available && (
                          <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions & Info */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      onClick={() => router.push(action.route)}
                      className="w-full text-left bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${action.color}-500/20 rounded-lg flex items-center justify-center`}>
                          <action.icon className={`w-5 h-5 text-${action.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{action.title}</p>
                          <p className="text-purple-300 text-xs">{action.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Getting Started Guide */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Getting Started
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Create Your First Blog</p>
                      <p className="text-purple-200 text-xs">Click "Blog Post" and start writing!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Earn Tokens</p>
                      <p className="text-purple-200 text-xs">Get 50 tokens for each blog post</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Share & Grow</p>
                      <p className="text-purple-200 text-xs">Earn more from views and likes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-300 font-semibold text-sm">All Systems Operational</p>
                    <p className="text-green-200/70 text-xs">Ready to create content!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
