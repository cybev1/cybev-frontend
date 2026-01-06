// ============================================
// FILE: src/pages/index.jsx
// CYBEV Landing Page - Social Blogging Platform
// VERSION: 5.0 - Rebranded for Social Blogging
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Globe, 
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
  Award,
  Play,
  BookOpen,
  Tv,
  Camera,
  Mic,
  PenTool,
  Image as ImageIcon,
  Video,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      router.push('/feed');
    }
  }, []);

  const features = [
    {
      icon: Edit3,
      title: "AI-Powered Blogging",
      description: "Create stunning articles in minutes with intelligent AI assistance that helps you write better",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      icon: Users,
      title: "Social Networking",
      description: "Connect with creators, follow your favorites, and build your community",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      icon: Tv,
      title: "Live Streaming",
      description: "Go live from any device - share your moments in real-time with your audience",
      color: "from-red-500 to-orange-500",
      gradient: "bg-gradient-to-br from-red-50 to-orange-50"
    },
    {
      icon: Video,
      title: "Video Content",
      description: "Upload vlogs, create stories, and share video content with your followers",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      icon: MessageCircle,
      title: "Engage & Interact",
      description: "Comments, reactions, and real-time messaging to stay connected",
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-50 to-rose-50"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Audience",
      description: "Analytics, SEO tools, and discovery features to help you reach more people",
      color: "from-indigo-500 to-purple-500",
      gradient: "bg-gradient-to-br from-indigo-50 to-purple-50"
    }
  ];

  const stats = [
    { label: "Active Creators", value: "10K+", icon: Users },
    { label: "Articles Published", value: "50K+", icon: Edit3 },
    { label: "Monthly Readers", value: "500K+", icon: BookOpen },
    { label: "Live Streams", value: "2K+", icon: Tv }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Travel Blogger",
      avatar: "SC",
      quote: "CYBEV's AI helped me write my best-performing article ever. It's like having a writing partner available 24/7!"
    },
    {
      name: "Marcus Johnson",
      role: "Tech Creator",
      avatar: "MJ",
      quote: "The live streaming feature is incredible. I went from zero to 500 followers in just two weeks!"
    },
    {
      name: "Emily Davis",
      role: "Lifestyle Writer",
      avatar: "ED",
      quote: "Finally, a platform that combines blogging and social media seamlessly. My engagement has tripled!"
    }
  ];

  return (
    <>
      <Head>
        <title>CYBEV - Where Creators Connect & Create</title>
        <meta name="description" content="CYBEV is the modern platform for creators to blog, stream, and connect. Write with AI assistance, go live, and build your audience." />
        <meta property="og:title" content="CYBEV - Where Creators Connect & Create" />
        <meta property="og:description" content="The modern platform for creators to blog, stream, and connect." />
        <meta property="og:image" content="/og-default.png" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-48 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-48 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-50/30 rounded-full blur-3xl" />
        </div>

        {/* Navigation */}
        <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                  <span className="text-xl md:text-2xl font-black text-white">C</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    CYBEV
                  </span>
                  <p className="text-[10px] md:text-xs text-gray-500 -mt-1 hidden sm:block">Where Creators Connect</p>
                </div>
              </motion.div>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium transition">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 font-medium transition">How It Works</a>
                <a href="#testimonials" className="text-gray-600 hover:text-purple-600 font-medium transition">Testimonials</a>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 md:gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/login')}
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/signup')}
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                The Future of Content Creation
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight text-gray-900"
            >
              Create. Connect.
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Grow Your Voice.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              The all-in-one platform for creators to write blogs, go live, share videos, 
              and build meaningful connections with their audience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/auth/signup')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300 transition-all flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Start Creating Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/explore')}
                className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Explore Content
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Hero Visual - Mock UI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl p-2 md:p-3 shadow-2xl">
              <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden">
                {/* Mock Browser Header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white rounded-lg px-4 py-1 text-sm text-gray-500 flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      cybev.io/feed
                    </div>
                  </div>
                </div>
                
                {/* Mock Feed Content */}
                <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white min-h-[300px] md:min-h-[400px]">
                  <div className="flex gap-4">
                    {/* Sidebar */}
                    <div className="hidden md:block w-48 space-y-3">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                      </div>
                      <div className="space-y-2">
                        {['Feed', 'Explore', 'Live TV', 'Messages'].map((item, i) => (
                          <div key={i} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${i === 0 ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}>
                            <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      {/* Post Card */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                          <div>
                            <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-purple-300" />
                        </div>
                        <div className="flex gap-4 text-gray-400">
                          <Heart className="w-5 h-5" />
                          <MessageCircle className="w-5 h-5" />
                          <Share2 className="w-5 h-5" />
                        </div>
                      </div>
                      
                      {/* Live Stream Card */}
                      <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-sm font-bold">LIVE NOW</span>
                        </div>
                        <div className="h-3 bg-white/30 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-white/20 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">+248%</p>
                  <p className="text-xs text-gray-500">Growth</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${i === 1 ? 'bg-purple-500' : i === 2 ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">+10K joined this week</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 mb-4">
                    <stat.icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-4 text-gray-900">
                Everything You Need to
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Succeed</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From AI-powered writing to live streaming, we've built the complete creator toolkit
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`${feature.gradient} rounded-2xl p-6 md:p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-4 text-gray-900">
                Start Creating in
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> 3 Steps</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Create Your Profile", desc: "Sign up in seconds and customize your creator space", icon: Users, color: "from-purple-500 to-pink-500" },
                { step: "2", title: "Create Content", desc: "Write blogs with AI, go live, or share videos - your choice", icon: Edit3, color: "from-blue-500 to-cyan-500" },
                { step: "3", title: "Grow & Connect", desc: "Build your audience and engage with your community", icon: TrendingUp, color: "from-green-500 to-emerald-500" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                    <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl font-black text-white shadow-lg`}>
                      {item.step}
                    </div>
                    <div className="pt-4">
                      <item.icon className="w-10 h-10 text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-4 text-gray-900">
                Loved by
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"> Creators</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mt-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-14 h-14 text-yellow-300 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
                Join thousands of creators building their audience on CYBEV. It's free to start!
              </p>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/auth/signup')}
                className="px-10 py-4 rounded-2xl bg-white text-purple-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto"
              >
                <Rocket className="w-5 h-5" />
                Create Your Account
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-white">C</span>
                  </div>
                  <span className="text-xl font-bold">CYBEV</span>
                </div>
                <p className="text-gray-400 text-sm">
                  The modern platform for creators to blog, stream, and connect.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/explore" className="hover:text-white transition">Explore</a></li>
                  <li><a href="/tv" className="hover:text-white transition">Live TV</a></li>
                  <li><a href="/blog" className="hover:text-white transition">Blogs</a></li>
                  <li><a href="/studio" className="hover:text-white transition">Studio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition">Community</a></li>
                  <li><a href="#" className="hover:text-white transition">Creator Guide</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/about" className="hover:text-white transition">About</a></li>
                  <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="mailto:support@cybev.io" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} CYBEV. Built for Creators. 💜</p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
