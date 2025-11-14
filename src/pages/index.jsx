import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Globe, 
  Coins, 
  TrendingUp, 
  Users, 
  Rocket,
  ArrowRight,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Edit3,
  Layers,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Edit3,
      title: "AI-Powered Blogging",
      description: "Write stunning articles with AI assistance",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      icon: Coins,
      title: "Earn CYBEV Coins",
      description: "Get rewarded for every post and interaction",
      color: "from-yellow-500 to-orange-500",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50"
    },
    {
      icon: Globe,
      title: "Web3 Publishing",
      description: "Decentralized content on the blockchain",
      color: "from-cyan-500 to-blue-500",
      gradient: "bg-gradient-to-br from-cyan-50 to-blue-50"
    },
    {
      icon: Layers,
      title: "NFT Minting",
      description: "Turn your best content into valuable NFTs",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      icon: Users,
      title: "Social Feed",
      description: "Connect with creators and grow your audience",
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-50 to-rose-50"
    },
    {
      icon: TrendingUp,
      title: "Go Viral",
      description: "Built-in discovery helps your content reach millions",
      color: "from-indigo-500 to-purple-500",
      gradient: "bg-gradient-to-br from-indigo-50 to-purple-50"
    }
  ];

  const stats = [
    { label: "Active Creators", value: "10K+", icon: Users },
    { label: "Posts Published", value: "50K+", icon: Edit3 },
    { label: "CYBEV Earned", value: "1M+", icon: Coins },
    { label: "NFTs Minted", value: "5K+", icon: Award }
  ];

  return (
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
        className="absolute top-0 -left-48 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
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
        className="absolute bottom-0 -right-48 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [45, 135, 45],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
      />

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CYBEV
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth/login')}
                className="px-6 py-2.5 rounded-xl text-gray-700 font-semibold hover:bg-purple-50 transition-all"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth/choice')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              100% Powered by AI • Web3 Ready
            </span>
            <Zap className="w-4 h-4 text-orange-500" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create. Earn. Own.
            </span>
            <br />
            <span className="text-gray-800">
              The Future of Blogging
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Write with AI, earn CYBEV coins, mint NFTs, and build your empire in the world's first 
            <span className="font-bold text-purple-600"> decentralized blogging platform</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/auth/choice')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-2xl hover:shadow-purple-300 transition-all flex items-center gap-3"
            >
              <Rocket className="w-6 h-6" />
              Start Creating Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Demo coming soon!')}
              className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-gray-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:border-purple-400 transition-all flex items-center gap-3"
            >
              <Globe className="w-6 h-6" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600"
          >
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white" />
              ))}
            </div>
            <span className="font-semibold">10,000+ creators already earning</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all"
            >
              <stat.icon className="w-8 h-8 text-purple-600 mb-3" />
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="text-gray-800">to Build Your Empire</span>
            </motion.h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From AI-powered writing to Web3 monetization, we've built the complete creator platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${feature.gradient} rounded-3xl p-8 border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Start Earning
              </span>
              <br />
              <span className="text-gray-800">in 3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Your Profile", desc: "Sign up in seconds and customize your creator space", icon: Users },
              { step: "2", title: "Write & Publish", desc: "Use AI tools to craft amazing content that resonates", icon: Edit3 },
              { step: "3", title: "Earn & Grow", desc: "Get CYBEV coins, mint NFTs, and build your audience", icon: TrendingUp }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + index * 0.2 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-blue-100 shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all">
                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-blue-600 mb-4 mt-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Ready to Lead the Creator Revolution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators earning while they create. Your empire awaits! 🚀
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/auth/choice')}
            className="px-10 py-5 rounded-2xl bg-white text-purple-600 font-black text-xl shadow-2xl hover:shadow-white/50 transition-all flex items-center gap-3 mx-auto"
          >
            <Rocket className="w-6 h-6" />
            Start Your Journey Now
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t border-purple-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">C</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CYBEV
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                The future of blogging, powered by AI and Web3
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Features</a></li>
                <li><a href="#" className="hover:text-purple-600">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600">NFT Marketplace</a></li>
                <li><a href="#" className="hover:text-purple-600">Staking</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-600">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-600">Community</a></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">About</a></li>
                <li><a href="#" className="hover:text-purple-600">Careers</a></li>
                <li><a href="#" className="hover:text-purple-600">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-600">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-100 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 CYBEV. Powered by AI. Built for Creators. 💜</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
