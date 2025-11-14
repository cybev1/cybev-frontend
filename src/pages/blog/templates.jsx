import { useState } from 'react';
import { useRouter } from 'next/router';

export default function TemplateSelector() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all'); // all, ministry, general, media

  const templates = [
    // 🆕 NEW MEDIA TEMPLATES (CNN & Bloomberg Style)
    {
      id: 'cnn-news',
      name: 'News Network',
      category: 'media',
      icon: '📰',
      description: 'Professional news blog with breaking news, live updates, and video content (CNN-style)',
      features: ['Breaking News Banner', 'Live Updates', 'Video News', 'Trending Stories', 'Weather Widget', 'Dark Mode'],
      preview: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
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
      preview: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
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
      preview: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400',
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
      preview: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400',
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
      preview: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
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
      preview: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400',
      color: 'from-amber-600 to-orange-600',
      badge: 'Ministry'
    },

    // Enhanced General Templates (from your list)
    {
      id: 'arts_creativity',
      name: 'Arts & Creativity',
      category: 'general',
      icon: '🎨',
      description: 'Showcase your creative talents — from visual arts to performance, DIY, and literature.',
      features: ['Portfolio Gallery', 'Project Showcases', 'Artist Bio', 'Contact Form'],
      preview: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
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
      preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
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
      preview: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
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
      preview: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400',
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
      preview: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
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
      preview: 'https://images.unsplash.com/photo-1490138139357-fc819d633e38?w=400',
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
      preview: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
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
      preview: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400',
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
      preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
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
      features: ['Article Grid', 'Categories', 'Featured Posts', 'Author Pages'],
      preview: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
      color: 'from-cyan-600 to-blue-600',
      badge: 'Popular'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      category: 'general',
      icon: '🎨',
      description: 'Showcase your work with a stunning portfolio',
      features: ['Project Gallery', 'Case Studies', 'About Page', 'Contact Form'],
      preview: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
      color: 'from-violet-600 to-purple-600',
      badge: 'Creative'
    },
    {
      id: 'creator',
      name: 'Creator',
      category: 'general',
      icon: '⭐',
      description: 'Personal brand template for influencers and creators',
      features: ['Hero Section', 'Social Links', 'Newsletter', 'Shop Integration'],
      preview: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
      color: 'from-pink-600 to-purple-600',
      badge: 'Trending'
    },
    {
      id: 'business',
      name: 'Business',
      category: 'general',
      icon: '💼',
      description: 'Professional template for startups and companies',
      features: ['Services Page', 'Team Section', 'Testimonials', 'Lead Forms'],
      preview: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
      color: 'from-slate-600 to-gray-600',
      badge: 'Professional'
    }
  ];

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
    // Open preview in new tab
    window.open(`/blog/preview/${templateId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Template</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Select a stunning template designed for your ministry or brand. All templates are fully customizable.
          </p>
          <p className="text-sm text-blue-600 font-semibold">
            🆕 NEW: Professional News & Streaming TV templates!
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Templates ({templates.length})
          </button>
          <button
            onClick={() => setFilter('media')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              filter === 'media'
                ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            📺 News & Media
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
          </button>
          <button
            onClick={() => setFilter('ministry')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              filter === 'ministry'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            🙏 Ministry & Faith
          </button>
          <button
            onClick={() => setFilter('general')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'general'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            General
          </button>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sortedTemplates.map((template) => (
            <div
              key={template.id}
              className={`relative rounded-3xl bg-white border-4 transition-all duration-300 overflow-hidden hover:shadow-2xl ${
                selectedTemplate === template.id
                  ? 'border-blue-500 shadow-2xl shadow-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Preview Image */}
              <div className="relative h-48 overflow-hidden group cursor-pointer" onClick={() => handlePreview(template.id)}>
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                    👁️ Preview
                  </button>
                </div>
                
                {/* Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  template.featured
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 animate-pulse'
                    : template.category === 'ministry'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600'
                }`}>
                  {template.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {template.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{template.description}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {template.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                  {template.features.length > 4 && (
                    <li className="text-xs text-gray-500 pl-5">+{template.features.length - 4} more features</li>
                  )}
                </ul>

                {/* Select Button */}
                <button
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedTemplate === template.id ? '✓ Selected' : 'Select Template'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedTemplate && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-blue-100 p-6 shadow-2xl z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Template:</p>
                <p className="text-lg font-bold text-gray-900">
                  {templates.find(t => t.id === selectedTemplate)?.icon} {templates.find(t => t.id === selectedTemplate)?.name}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handlePreview(selectedTemplate)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-all"
                >
                  👁️ Preview
                </button>
                <button
                  onClick={handleSelect}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold text-lg shadow-2xl transition-all active:scale-95"
                >
                  Continue to Setup →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
