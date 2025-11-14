import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { 
  PenTool, 
  TrendingUp, 
  Coins, 
  Sparkles, 
  Users,
  Zap,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Award,
  Eye,
  ThumbsUp,
  TrendingDown,
  ArrowRight,
  Flame,
  Star,
  Globe,
  Layers
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Creator');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
    // Get user name from token/API
    // For now using default
  }, [router]);

  const quickActions = [
    {
      title: 'Write a Blog',
      description: 'Create your next amazing post',
      icon: PenTool,
      href: '/blog/create',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      emoji: '✍️',
      color: 'purple'
    },
    {
      title: 'Explore Blogs',
      description: 'Discover trending content',
      icon: TrendingUp,
      href: '/blog',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      emoji: '📚',
      color: 'blue'
    },
    {
      title: 'View Rewards',
      description: 'Check your CYBEV earnings',
      icon: Coins,
      href: '/rewards/dashboard',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      emoji: '💰',
      color: 'yellow'
    },
    {
      title: 'Social Feed',
      description: 'Connect with creators',
      icon: Users,
      href: '/social',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      emoji: '🌟',
      color: 'green'
    },
    {
      title: 'NFT Gallery',
      description: 'Mint and manage NFTs',
      icon: Layers,
      href: '/nft',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      emoji: '🎨',
      color: 'indigo'
    },
    {
      title: 'Analytics',
      description: 'Track your growth',
      icon: TrendingUp,
      href: '/analytics',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      emoji: '📊',
      color: 'pink'
    }
  ];

  const stats = [
    { label: 'Total Posts', value: '12', icon: BookOpen, change: '+3', color: 'purple' },
    { label: 'Total Views', value: '1.2K', icon: Eye, change: '+24%', color: 'blue' },
    { label: 'CYBEV Earned', value: '250', icon: Coins, change: '+50', color: 'yellow' },
    { label: 'Followers', value: '89', icon: Users, change: '+12', color: 'green' }
  ];

  const recentActivity = [
    { type: 'like', user: 'Sarah', action: 'liked your post', post: 'Getting Started with Web3', time: '2h ago', color: 'red' },
    { type: 'comment', user: 'Mike', action: 'commented on', post: 'AI and Blockchain', time: '5h ago', color: 'blue' },
    { type: 'follow', user: 'Emma', action: 'started following you', post: '', time: '1d ago', color: 'purple' },
    { type: 'coin', user: 'System', action: 'earned 25 CYBEV from', post: 'Popular Post Bonus', time: '2d ago', color: 'yellow' }
  ];

  const trendingTopics = [
    { name: 'Web3 Blogging', posts: '234', trend: 'up', emoji: '🚀' },
    { name: 'AI Writing', posts: '189', trend: 'up', emoji: '🤖' },
    { name: 'NFT Art', posts: '156', trend: 'up', emoji: '🎨' },
    { name: 'Crypto News', posts: '143', trend: 'down', emoji: '📰' }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background Orbs */}
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
          className="absolute top-0 -left-48 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
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
          className="absolute bottom-0 -right-48 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-100 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black mb-2"
                  >
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      Welcome Back, {userName}! 👋
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 text-lg"
                  >
                    Ready to create something amazing today?
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/blog/create">
                    <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-200 transition-all flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      Write New Post
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-100 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  <span className={`px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold`}>
                    {stat.change}
                  </span>
                </div>
                <div className={`text-3xl font-black bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-400 bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-800">Quick Actions</h2>
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Link href={action.href}>
                    <div className={`bg-gradient-to-br ${action.bgGradient} rounded-2xl p-6 border-2 border-white/50 shadow-lg hover:shadow-xl transition-all cursor-pointer group`}>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg`}
                      >
                        {action.emoji}
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-100 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-orange-500" />
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${activity.color}-500 to-${activity.color}-600 flex items-center justify-center flex-shrink-0`}>
                      {activity.type === 'like' && <Heart className="w-5 h-5 text-white" fill="white" />}
                      {activity.type === 'comment' && <MessageCircle className="w-5 h-5 text-white" />}
                      {activity.type === 'follow' && <Users className="w-5 h-5 text-white" />}
                      {activity.type === 'coin' && <Coins className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>{' '}
                        {activity.post && <span className="font-semibold text-purple-600">{activity.post}</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-100 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  Trending Topics
                </h2>
              </div>

              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.emoji}</span>
                      <div>
                        <p className="font-bold text-gray-800">{topic.name}</p>
                        <p className="text-xs text-gray-600">{topic.posts} posts</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                      topic.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {topic.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* What's New Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </motion.div>
              <h2 className="text-3xl font-black text-white">What's New in CYBEV</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '💬', title: 'Comments & Discussions', desc: 'Engage with readers through threaded comments', color: 'green' },
                { icon: '🔖', title: 'Bookmarks', desc: 'Save your favorite posts for later reading', color: 'blue' },
                { icon: '👥', title: 'Follow System', desc: 'Connect with writers and build your network', color: 'purple' },
                { icon: '🔔', title: 'Real-time Notifications', desc: 'Stay updated with likes, comments, and followers', color: 'orange' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg mb-1">{feature.title}</h4>
                    <p className="text-blue-100 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
