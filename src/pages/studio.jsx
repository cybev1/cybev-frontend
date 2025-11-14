import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  PenTool,
  Sparkles,
  Wand2,
  Globe,
  Eye,
  Save,
  Upload,
  Image as ImageIcon,
  Type,
  Palette,
  Layers,
  Code,
  Zap,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Settings,
  BookOpen,
  FileText,
  Layout,
  Smartphone,
  Monitor,
  Plus,
  Edit3,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  ArrowRight,
  Star,
  Clock,
  Users
} from 'lucide-react';

export default function BlogStudio() {
  const router = useRouter();
  const [view, setView] = useState('overview'); // overview, create, edit, templates
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const myBlogs = [
    {
      id: 1,
      title: 'Getting Started with Web3 Blogging',
      excerpt: 'A comprehensive guide to blockchain-based content creation...',
      status: 'published',
      views: '1.2K',
      likes: 89,
      comments: 23,
      image: '/api/placeholder/400/300',
      lastEdited: '2 hours ago',
      category: 'Technology',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'The Future of AI-Powered Writing',
      excerpt: 'How artificial intelligence is revolutionizing content...',
      status: 'draft',
      views: '0',
      likes: 0,
      comments: 0,
      image: '/api/placeholder/400/300',
      lastEdited: '1 day ago',
      category: 'AI',
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'Building Your First NFT Collection',
      excerpt: 'Step-by-step guide to creating and minting NFTs...',
      status: 'published',
      views: '2.5K',
      likes: 156,
      comments: 45,
      image: '/api/placeholder/400/300',
      lastEdited: '3 days ago',
      category: 'NFT',
      readTime: '10 min read'
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'Tech Blog',
      description: 'Perfect for technology and coding articles',
      preview: '/api/placeholder/400/300',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      icon: Code,
      features: ['Code highlighting', 'Dark mode', 'Responsive']
    },
    {
      id: 2,
      name: 'Portfolio',
      description: 'Showcase your work and projects',
      preview: '/api/placeholder/400/300',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      icon: Layers,
      features: ['Gallery view', 'Project cards', 'Contact form']
    },
    {
      id: 3,
      name: 'Magazine',
      description: 'Editorial-style blog with rich media',
      preview: '/api/placeholder/400/300',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      icon: BookOpen,
      features: ['Multi-column', 'Featured posts', 'Categories']
    },
    {
      id: 4,
      name: 'Minimalist',
      description: 'Clean and simple design focused on content',
      preview: '/api/placeholder/400/300',
      gradient: 'from-gray-600 to-gray-800',
      bgGradient: 'from-gray-50 to-gray-100',
      icon: FileText,
      features: ['Typography-focused', 'Fast loading', 'Elegant']
    },
    {
      id: 5,
      name: 'Business',
      description: 'Professional blog for companies',
      preview: '/api/placeholder/400/300',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      icon: Users,
      features: ['Team page', 'Services', 'Testimonials']
    },
    {
      id: 6,
      name: 'Personal',
      description: 'Express yourself with a personal blog',
      preview: '/api/placeholder/400/300',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      icon: Heart,
      features: ['About page', 'Social links', 'Newsletter']
    }
  ];

  const aiFeatures = [
    {
      title: 'AI Writing Assistant',
      description: 'Get help writing, editing, and improving your content',
      icon: Wand2,
      color: 'purple',
      action: 'Try Now'
    },
    {
      title: 'Auto-Generate',
      description: 'Create blog posts from topics or keywords',
      icon: Zap,
      color: 'yellow',
      action: 'Generate'
    },
    {
      title: 'Style Suggestions',
      description: 'AI-powered design recommendations',
      icon: Palette,
      color: 'pink',
      action: 'Explore'
    },
    {
      title: 'SEO Optimizer',
      description: 'Optimize your content for search engines',
      icon: TrendingUp,
      color: 'green',
      action: 'Optimize'
    }
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
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-5xl font-black mb-3"
                  >
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      Your Blog Studio ✍️
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 text-lg"
                  >
                    Create stunning blogs and websites powered by AI
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/blog/create')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-purple-200 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    New Blog Post
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setView('templates')}
                    className="px-6 py-3 rounded-xl bg-white border-2 border-purple-200 text-gray-700 font-bold hover:border-purple-400 hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Layout className="w-5 h-5" />
                    Browse Templates
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* AI Features Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-6 mb-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </motion.div>
              <h2 className="text-2xl font-black text-white">AI-Powered Tools</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <feature.icon className="w-8 h-8 text-yellow-300 mb-2" />
                  <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                  <p className="text-blue-100 text-sm mb-3">{feature.description}</p>
                  <button className="text-xs font-bold text-yellow-300 hover:text-yellow-200 flex items-center gap-1">
                    {feature.action}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* View Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('overview')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                view === 'overview'
                  ? 'bg-white border-2 border-purple-400 text-purple-600 shadow-lg'
                  : 'bg-white/50 border-2 border-gray-200 text-gray-600 hover:border-purple-300'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              My Blogs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('templates')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                view === 'templates'
                  ? 'bg-white border-2 border-purple-400 text-purple-600 shadow-lg'
                  : 'bg-white/50 border-2 border-gray-200 text-gray-600 hover:border-purple-300'
              }`}
            >
              <Layout className="w-5 h-5 inline mr-2" />
              Templates
            </motion.button>
          </div>

          {/* Search & Filter */}
          {view === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <div className="flex-1 min-w-[250px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your blogs..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>

              <button className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-purple-400 transition-all flex items-center gap-2 font-semibold text-gray-700">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </motion.div>
          )}

          {/* Content Area */}
          {view === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-purple-100 shadow-lg hover:shadow-2xl hover:border-purple-300 transition-all"
                >
                  {/* Blog Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        blog.status === 'published'
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-500 text-gray-900'
                      }`}>
                        {blog.status.toUpperCase()}
                      </span>
                    </div>
                    {/* Placeholder for blog image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-20 h-20 text-purple-300" />
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">
                        {blog.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer">
                      {blog.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {blog.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {blog.comments}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/blog/edit/${blog.id}`)}
                        className="flex-1 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200 transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Last edited {blog.lastEdited}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Empty State / Create New */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => router.push('/blog/create')}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all cursor-pointer flex flex-col items-center justify-center p-12 min-h-[400px]"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4"
                >
                  <Plus className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Create New Blog</h3>
                <p className="text-gray-600 text-center">Start writing with AI assistance</p>
              </motion.div>
            </div>
          )}

          {/* Templates View */}
          {view === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-gradient-to-br ${template.bgGradient} rounded-2xl p-6 border-2 border-white/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
                >
                  {/* Template Preview */}
                  <div className="relative h-40 bg-white/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <template.icon className="w-16 h-16 text-gray-300" />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 rounded-lg bg-white/80 text-xs font-bold text-gray-700 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        Popular
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-white/70 text-xs font-semibold text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/blog/create?template=${template.id}`)}
                    className={`w-full px-4 py-3 rounded-xl bg-gradient-to-r ${template.gradient} text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
                  >
                    Use Template
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
