import { useState } from 'react';
import { useRouter } from 'next/router';

export default function TemplateSelector() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all'); // all, ministry, general

  const templates = [
    // Ministry Templates
    {
      id: 'church',
      name: 'Church',
      category: 'ministry',
      icon: '⛪',
      description: 'Perfect for local churches with sermons, events, and giving',
      features: ['Sermon Library', 'Event Calendar', 'Online Giving', 'Prayer Requests'],
      preview: '/templates/church-preview.jpg',
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
      preview: '/templates/ministry-preview.jpg',
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
      preview: '/templates/podcast-preview.jpg',
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
      preview: '/templates/devotional-preview.jpg',
      color: 'from-amber-600 to-orange-600',
      badge: 'Ministry'
    },

    // General Templates
    {
      id: 'magazine',
      name: 'Magazine',
      category: 'general',
      icon: '📰',
      description: 'Modern magazine layout for news and lifestyle content',
      features: ['Article Grid', 'Categories', 'Featured Posts', 'Author Pages'],
      preview: '/templates/magazine-preview.jpg',
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
      preview: '/templates/portfolio-preview.jpg',
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
      preview: '/templates/creator-preview.jpg',
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
      preview: '/templates/business-preview.jpg',
      color: 'from-slate-600 to-gray-600',
      badge: 'Professional'
    }
  ];

  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.category === filter);

  const handleSelect = () => {
    if (!selectedTemplate) return;
    // Pass template to setup wizard
    router.push({
      pathname: '/blog/setup',
      query: { template: selectedTemplate }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Template</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a stunning template designed for your ministry or brand. All templates are fully customizable.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Templates
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
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`relative p-6 rounded-3xl bg-white border-4 transition-all duration-300 text-left hover:shadow-2xl active:scale-95 ${
                selectedTemplate === template.id
                  ? 'border-blue-500 shadow-2xl shadow-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                template.category === 'ministry'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600'
              }`}>
                {template.badge}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {template.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {template.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Preview Button */}
              <div className={`text-center py-2 rounded-xl font-semibold text-sm ${
                selectedTemplate === template.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {selectedTemplate === template.id ? '✓ Selected' : 'Preview'}
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        {selectedTemplate && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-blue-100 p-6 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Template:</p>
                <p className="text-lg font-bold text-gray-900">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </p>
              </div>
              <button
                onClick={handleSelect}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold text-lg shadow-2xl transition-all active:scale-95"
              >
                Continue to Setup →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}