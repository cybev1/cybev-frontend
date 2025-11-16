import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Eye, Flame, Coins } from 'lucide-react';

const motivationalQuotes = [
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown"
  }
];

export default function GreetingHeader({ user, stats }) {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Random quote (changes daily based on date)
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length]);
  }, []);

  // Default stats if not provided
  const defaultStats = {
    views: stats?.views || 0,
    virality: stats?.virality || 0,
    tokens: stats?.tokens || 0,
    growth: stats?.growth || 0,
    streak: stats?.streak || 0
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>
      
      {/* Content */}
      <div className="relative px-4 py-8 md:px-6 lg:px-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {greeting}, {user?.name || user?.username || 'Creator'}!
              </span>
            </h1>
            <motion.div
              animate={{ rotate: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl md:text-4xl"
            >
              {greeting.includes('Morning') ? '🌅' : greeting.includes('Afternoon') ? '☀️' : '🌙'}
            </motion.div>
          </div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-base md:text-lg italic max-w-3xl"
          >
            "{quote.text}"
            <span className="block text-gray-700 text-sm md:text-base mt-2 font-semibold">
              — {quote.author}
            </span>
          </motion.div>
        </motion.div>

        {/* Stats Dashboard - Mobile Toggle */}
        <div className="md:hidden mb-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-gray-800 font-bold text-sm flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl backdrop-blur-xl border-2 border-purple-100 shadow-lg"
          >
            {showStats ? '▼' : '▶'} Your Stats Today
          </button>
        </div>

        {/* Stats Grid - white theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${showStats ? 'block' : 'hidden md:grid'}`}
        >
          {/* Views */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-xs md:text-sm text-gray-600 font-bold">Views</span>
            </div>
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {defaultStats.views.toLocaleString()}
            </div>
          </div>

          {/* Virality */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-xs md:text-sm text-gray-600 font-bold">Virality</span>
            </div>
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              {defaultStats.virality}
            </div>
          </div>

          {/* Tokens */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="text-xs md:text-sm text-gray-600 font-bold">Tokens</span>
            </div>
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
              {defaultStats.tokens.toLocaleString()}
            </div>
          </div>

          {/* Growth */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-xs md:text-sm text-gray-600 font-bold">Growth</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-2">
              {defaultStats.growth > 0 ? '+' : ''}{defaultStats.growth}%
              {defaultStats.growth > 0 && (
                <span className="text-lg">📈</span>
              )}
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-xs md:text-sm text-gray-600 font-bold">Streak</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-2">
              {defaultStats.streak}
              {defaultStats.streak >= 7 && (
                <span className="text-lg">🔥</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}