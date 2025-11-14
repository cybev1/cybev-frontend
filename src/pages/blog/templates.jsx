// 🎨 UPGRADED: Ultra-Modern Template Selector
// Squarespace-level design with Framer Motion animations
// Perfect mobile responsiveness for iOS & Android
// File path: src/pages/blog/templates.jsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, Sparkles, ChevronRight } from 'lucide-react';

export default function TemplateSelector() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all');

  const templates = [
    // 🆕 NEW MEDIA TEMPLATES (CNN & Bloomberg Style)
    {
      id: 'cnn-news',
      name: 'News Network',
      category: 'media',
      icon: '📰',
      description: 'Professional news blog with breaking news, live updates, and video content (CNN-style)',
      features: ['Breaking News Banner', 'Live Updates', 'Video News', 'Trending Stories', 'Weather Widget', 'Dark Mode'],
      preview: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
      color: 'from-red-600 to-gray-900',
      badge: '🔥 NEW',
      featured: true
    },
    {
      id: 'bloomberg-tv',
      name: 'Streaming TV',
      category: 'media',
      icon: '📺',
      description: 'Live streaming platform for shows, videos, and broadcasts (Bloomberg-style)',
      features: ['Live Stream Player', 'Market Ticker', 'Show Schedule', 'Video Library', 'Subscription CTA', 'Professional Theme'],
      preview: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      color: 'from-yellow-500 to-black',
      badge: '🔥 NEW',
      featured: true
    },

    // Ministry Templates
    {
      id: 'church',
      name: 'Church',
      category: 'ministry',
      icon: '⛪',
      description: 'Perfect for local churches with sermons, events, and giving',
      features: ['Sermon Library', 'Event Calendar', 'Online Giving', 'Prayer Requests'],
      preview: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Ministry'
    },
    {
      id: 'ministry',
      name: 'Ministry',
      category: 'ministry',
      icon: '📖',
      description: 'For evangelists, missionaries, and ministry leaders',
      features: ['Blog Posts', 'Testimony Library', 'Mission Updates', 'Donation Portal'],
      preview: 'https://images.unsplash.com/photo-1507692049790-de58290a4334',
      color: 'from-blue-600 to-purple-600',
      badge: 'Ministry'
    },
    {
      id: 'podcast',
      name: 'Podcast',
      category: 'ministry',
      icon: '🎙️',
      description: 'Showcase your Christian podcast with episode archives',
      features: ['Episode Player', 'Show Notes', 'Transcriptions', 'RSS Feed'],
      preview: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
      color: 'from-pink-600 to-rose-600',
      badge: 'Ministry'
    },
    {
      id: 'devotional',
      name: 'Devotional',
      category: 'ministry',
      icon: '✝️',
      description: 'Share daily devotionals and Bible studies',
      features: ['Daily Posts', 'Bible Integration', 'Prayer Wall', 'Study Guides'],
      preview: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94',
      color: 'from-amber-600 to-orange-600',
      badge: 'Ministry'
    },

    // Enhanced General Templates
    {
      id: 'arts_creativity',
      name: 'Arts & Creativity',
      category: 'general',
      icon: '🎨',
      description: 'Showcase your creative talents — from visual arts to performance, DIY, and literature.',
      features: ['Portfolio Gallery', 'Project Showcases', 'Artist Bio', 'Contact Form'],
      preview: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      color: 'from-pink-500 to-yellow-500',
      badge: 'Creative'
    },
    {
      id: 'business_career',
      name: 'Business & Career',
      category: 'general',
      icon: '💼',
      description: 'Professional insights, entrepreneurship journeys, and corporate strategies.',
      features: ['Case Studies', 'Team Profiles', 'Service Pages', 'Testimonials'],
      preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      color: 'from-gray-600 to-blue-900',
      badge: 'Business'
    },
    {
      id: 'education_learning',
      name: 'Education & Learning',
      category: 'general',
      icon: '📚',
      description: 'For educators, learners, and knowledge seekers — tutorials, ideas, and guides.',
      features: ['Course Catalog', 'Video Lessons', 'Resource Library', 'Student Portal'],
      preview: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      color: 'from-green-600 to-cyan-600',
      badge: 'Education'
    },
    {
      id: 'entertainment_pop',
      name: 'Entertainment & Pop Culture',
      category: 'general',
      icon: '🎬',
      description: 'Cover trending shows, celebrity updates, music, and fan theories.',
      features: ['Reviews', 'Celebrity News', 'Music Charts', 'Fan Forums'],
      preview: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b',
      color: 'from-purple-700 to-indigo-800',
      badge: 'Entertainment'
    },
    {
      id: 'health_wellness',
      name: 'Health & Wellness',
      category: 'general',
      icon: '💪',
      description: 'Promote fitness, mental clarity, and holistic self-care.',
      features: ['Workout Plans', 'Nutrition Guides', 'Progress Tracking', 'Recipe Database'],
      preview: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      color: 'from-emerald-600 to-lime-600',
      badge: 'Health'
    },
    {
      id: 'lifestyle_personal_dev',
      name: 'Lifestyle & Personal Growth',
      category: 'general',
      icon: '🌱',
      description: 'Inspire others with habits, routines, travel logs, and relationship tips.',
      features: ['Personal Stories', 'Travel Guides', 'Goal Tracking', 'Inspiration Board'],
      preview: 'https://images.unsplash.com/photo-1490138139357-fc819d633e38',
      color: 'from-orange-600 to-pink-600',
      badge: 'Lifestyle'
    },
    {
      id: 'science_tech',
      name: 'Science & Tech',
      category: 'general',
      icon: '🧪',
      description: 'Explore AI, space, robotics, physics, and modern discoveries.',
      features: ['Tech News', 'Code Snippets', 'Research Papers', 'Innovation Showcase'],
      preview: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      color: 'from-sky-500 to-violet-800',
      badge: 'Tech'
    },
    {
      id: 'society_worldview',
      name: 'Society & Worldview',
      category: 'general',
      icon: '🌍',
      description: 'Dive into culture, politics, religion, and social transformation.',
      features: ['Opinion Pieces', 'Cultural Analysis', 'Historical Context', 'Discussion Forums'],
      preview: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e',
      color: 'from-stone-600 to-zinc-800',
      badge: 'Society'
    },
    {
      id: 'practical_living',
      name: 'Practical Living',
      category: 'general',
      icon: '🛠️',
      description: 'Finance, food, gardening, fashion — real life, real skills.',
      features: ['Recipe Cards', 'Budget Planners', 'DIY Tutorials', 'Shopping Guides'],
      preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      color: 'from-yellow-600 to-amber-800',
      badge: 'Practical'
    },

    // Original General Templates
    {
      id: 'magazine',
      name: 'Magazine',
      category: 'general',
      icon: '📰',
      description: 'Modern magazine layout for news and lifestyle content',
      features: ['Article Grid', 'Featured Stories', 'Author Profiles', 'Categories'],
      preview: 'https://images.unsplash.com/photo-1495020689067-958852a7765e',
      color: 'from-gray-700 to-gray-900',
      badge: 'Classic'
    },
    {
      id: 'personal',
      name: 'Personal Blog',
      category: 'general',
      icon: '✍️',
      description: 'Simple, elegant blog for personal stories and thoughts',
      features: ['Clean Layout', 'Reading Time', 'Comments', 'Social Share'],
      preview: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
      color: 'from-slate-600 to-slate-800',
      badge: 'Popular'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      category: 'general',
      icon: '💼',
      description: 'Showcase your work with a stunning portfolio layout',
      features: ['Project Gallery', 'Case Studies', 'Skills Display', 'Resume'],
      preview: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
      color: 'from-blue-500 to-blue-700',
      badge: 'Professional'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      category: 'general',
      icon: '⚪',
      description: 'Less is more — focus on your content with minimal distractions',
      features: ['Clean Typography', 'Whitespace', 'Simple Navigation', 'Fast Loading'],
      preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      color: 'from-gray-400 to-gray-600',
      badge: 'Clean'
    }
  ];

  // Filter templates
  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.category === filter);

  // Sort to show featured templates first
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const handleSelect = () => {
    if (!selectedTemplate) return;
    router.push({
      pathname: '/blog/setup',
      query: { template: selectedTemplate }
    });
  };

  const handlePreview = (templateId) => {
    window.open(`/blog/preview/${templateId}`, '_blank');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Template</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Select a stunning template designed for your ministry or brand. All templates are fully customizable.
            </p>
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-blue-600 font-semibold"
            >
              🆕 NEW: Professional News & Streaming TV templates!
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3 md:gap-4 mb-8 md:mb-12 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('all')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Templates ({templates.length})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('media')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all flex items-center gap-2 ${
              filter === 'media'
                ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            📺 News & Media
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('ministry')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
              filter === 'ministry'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            🙏 Ministry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('general')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
              filter === 'general'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            General
          </motion.button>
        </motion.div>

        {/* Template Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-20"
        >
          <AnimatePresence mode="wait">
            {sortedTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-2xl md:rounded-3xl bg-white border-2 md:border-4 transition-all duration-300 overflow-hidden ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 shadow-2xl shadow-blue-200 ring-4 ring-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                }`}
              >
                {/* Preview Image */}
                <div className="relative h-40 md:h-48 overflow-hidden group">
                  <Image
                    src={`${template.preview}?w=600&h=400&fit=crop`}
                    alt={template.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                  
                  {/* Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm ${
                      template.featured
                        ? 'bg-gradient-to-r from-red-600 to-orange-500'
                        : template.category === 'ministry'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600'
                    }`}
                  >
                    {template.badge}
                  </motion.div>

                  {/* Selected Badge */}
                  {selectedTemplate === template.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-4 shadow-lg`}>
                    {template.icon}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-4 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {template.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500 flex-shrink-0" />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {template.features.length > 4 && (
                      <li className="text-xs text-gray-500 pl-5">
                        +{template.features.length - 4} more features
                      </li>
                    )}
                  </ul>

                  {/* Select Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-center py-2.5 md:py-3 rounded-xl font-semibold text-sm transition-all ${
                      selectedTemplate === template.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedTemplate === template.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Selected
                      </span>
                    ) : (
                      'Select Template'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Continue Button - Fixed Bottom Bar */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 md:p-6 shadow-2xl z-50"
            >
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs md:text-sm text-gray-600">Selected Template:</p>
                  <p className="text-base md:text-lg font-bold text-gray-900">
                    {templates.find(t => t.id === selectedTemplate)?.icon}{' '}
                    {templates.find(t => t.id === selectedTemplate)?.name}
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreview(selectedTemplate)}
                    className="flex-1 sm:flex-none px-4 md:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSelect}
                    className="flex-1 sm:flex-none px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold text-base md:text-lg shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
