import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Wand2,
  Sparkles,
  Zap,
  Globe,
  Coins,
  TrendingUp,
  Layout,
  FileText,
  Image as ImageIcon,
  Code,
  Palette,
  Brain,
  Rocket,
  Crown,
  Target,
  Users,
  BarChart3,
  Settings,
  Plus,
  ArrowRight,
  Star,
  ChevronRight,
  Layers,
  BookOpen,
  Video,
  Mic,
  Music,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Heart,
  Award
} from 'lucide-react';

export default function Studio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('create');
  const [userStats, setUserStats] = useState({
    totalEarnings: 1250,
    weeklyViews: 12500,
    totalPosts: 23,
    followers: 487
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const creationOptions = [
    {
      id: 'ai-website',
      title: 'AI Website Builder',
      description: 'Generate complete websites with AI in seconds',
      icon: Wand2,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      badge: 'Most Popular',
      earnings: '100 coins',
      route: '/studio/ai-generator'
    },
    {
      id: 'blog',
      title: 'Blog Post',
      description: 'Write and publish articles with AI assistance',
      icon: FileText,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      earnings: '50 coins',
      route: '/blog/create'
    },
    {
      id: 'landing',
      title: 'Landing Page',
      description: 'Build high-converting landing pages',
      icon: Rocket,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      earnings: '75 coins',
      route: '/studio/builder?type=landing'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Site',
      description: 'Showcase your work professionally',
      icon: Briefcase,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      earnings: '80 coins',
      route: '/studio/builder?type=portfolio'
    },
    {
      id: 'store',
      title: 'Online Store',
      description: 'Create an e-commerce website',
      icon: ShoppingBag,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      earnings: '120 coins',
      route: '/studio/builder?type=store'
    },
    {
      id: 'course',
      title: 'Course Platform',
      description: 'Build educational content sites',
      icon: GraduationCap,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      earnings: '100 coins',
      route: '/studio/builder?type=course'
    }
  ];

  const aiFeatures = [
    {
      title: 'AI Content Writer',
      description: 'Generate articles, blogs, and copy instantly',
      icon: Brain,
      color: 'purple',
      uses: 'Unlimited'
    },
    {
      title: 'AI Design Studio',
      description: 'Create stunning visuals and layouts',
      icon: Palette,
      color: 'pink',
      uses: 'Unlimited'
    },
    {
      title: 'AI SEO Optimizer',
      description: 'Rank higher on search engines automatically',
      icon: TrendingUp,
      color: 'green',
      uses: 'Unlimited'
    },
    {
      title: 'AI Code Generator',
      description: 'Add custom functionality with AI-generated code',
      icon: Code,
      color: 'blue',
      uses: 'Unlimited'
    }
  ];

  const templates = [
    {
      id: 'cnn-news',
      name: 'News Network',
      category: 'Media',
      preview: '/templates/cnn.jpg',
      icon: Video,
      gradient: 'from-red-500 to-orange-500'
    },
    {
      id: 'bloomberg-tv',
      name: 'Streaming TV',
      category: 'Media',
      preview: '/templates/bloomberg.jpg',
      icon: Mic,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'tech-blog',
      name: 'Tech Blog',
      category: 'Blog',
      preview: '/templates/tech.jpg',
      icon: Code,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'portfolio',
      name: 'Creative Portfolio',
      category: 'Portfolio',
      preview: '/templates/portfolio.jpg',
      icon: Layers,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'ecommerce',
      name: 'Online Store',
      category: 'E-commerce',
      preview: '/templates/store.jpg',
      icon: ShoppingBag,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'saas',
      name: 'SaaS Landing',
      category: 'Business',
      preview: '/templates/saas.jpg',
      icon: Rocket,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivity = [
    { type: 'earn', text: 'Earned 50 coins from blog post', time: '2 hours ago', amount: '+50' },
    { type: 'view', text: 'Your site got 234 views', time: '5 hours ago', amount: '+234' },
    { type: 'earn', text: 'Earned 25 coins from engagement', time: '1 day ago', amount: '+25' },
  ];

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
                    Create. Publish. Earn. 💰
                  </h1>
                  <p className="text-purple-200 text-lg max-w-2xl">
                    Build professional websites and content with AI. Every view, like, and share earns you crypto!
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
                    <p className="text-2xl font-bold text-white">{userStats.weeklyViews.toLocaleString()}</p>
                    <p className="text-xs text-purple-200">Weekly Views</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI-Powered Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 mb-8 relative overflow-hidden"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-white mb-2">
                    ⚡ AI-Powered Everything
                  </h2>
                  <p className="text-white/90 mb-4">
                    Powered by DeepSeek, Claude & OpenAI • Generate websites, content, designs & code instantly
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {aiFeatures.map((feature, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-semibold text-sm hover:bg-white/30 transition-all flex items-center gap-2"
                      >
                        <feature.icon className="w-4 h-4" />
                        {feature.title}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
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
                      whileHover={{ scale: 1.03, y: -5 }}
                      onClick={() => router.push(option.route)}
                      className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 cursor-pointer group overflow-hidden"
                    >
                      {option.badge && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                          {option.badge}
                        </div>
                      )}
                      
                      <div className={`w-14 h-14 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <option.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                      <p className="text-purple-200 text-sm mb-4">{option.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                          <Coins className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-sm font-semibold">{option.earnings}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Templates Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Layout className="w-6 h-6 text-pink-400" />
                    Professional Templates
                  </h2>
                  <Link href="/studio/templates">
                    <button className="text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {templates.slice(0, 6).map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => router.push(`/blog/preview/${template.id}`)}
                      className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/20 hover:border-purple-500/50 cursor-pointer group"
                    >
                      <div className={`h-32 bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                        <template.icon className="w-12 h-12 text-white/50" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                            {template.category}
                          </span>
                        </div>
                        <h3 className="text-white font-bold">{template.name}</h3>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                          Preview
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Stats */}
            <div className="space-y-6">
              {/* Earnings Widget */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Coins className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-200 text-sm">Total Earnings</p>
                    <p className="text-3xl font-black text-white">${userStats.totalEarnings}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-200">This Week</span>
                    <span className="text-green-300 font-semibold">+$125</span>
                  </div>
                  <div className="w-full bg-green-900/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'earn' ? 'bg-green-500/20' : 'bg-blue-500/20'
                      }`}>
                        {activity.type === 'earn' ? (
                          <Coins className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">{activity.text}</p>
                        <p className="text-purple-300 text-xs">{activity.time}</p>
                      </div>
                      <span className={`text-sm font-bold ${
                        activity.type === 'earn' ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {activity.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/studio/ai-generator')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between group"
                  >
                    <span>AI Website Generator</span>
                    <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                  <button
                    onClick={() => router.push('/studio/templates')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between"
                  >
                    <span>Browse Templates</span>
                    <Layout className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between"
                  >
                    <span>View Analytics</span>
                    <BarChart3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
