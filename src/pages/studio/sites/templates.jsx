// ============================================
// FILE: src/pages/studio/sites/templates.jsx
// Template Gallery - Browse and preview templates
// VERSION: 6.4.2
// ============================================

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Eye, Check, Loader2, Search, Filter,
  Briefcase, ShoppingBag, Users, BookOpen, Camera, Music,
  Rocket, Zap, Heart, Code, Coffee, Star, X, Globe
} from 'lucide-react';

// Complete template library
const TEMPLATES = [
  {
    id: 'business',
    name: 'Business Pro',
    category: 'business',
    icon: Briefcase,
    description: 'Professional business website with services, team, and contact sections',
    color: 'from-blue-500 to-indigo-600',
    features: ['Hero Section', 'Services Grid', 'Team Section', 'Contact Form', 'Testimonials'],
    preview: {
      hero: { title: 'Grow Your Business', subtitle: 'Professional solutions for modern enterprises' },
      colors: { primary: '#4F46E5', secondary: '#818CF8' }
    }
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    category: 'portfolio',
    icon: Camera,
    description: 'Showcase your work with stunning gallery layouts',
    color: 'from-purple-500 to-pink-500',
    features: ['Project Gallery', 'About Section', 'Skills Display', 'Contact Info', 'Social Links'],
    preview: {
      hero: { title: 'Creative Works', subtitle: 'Showcasing design excellence' },
      colors: { primary: '#8B5CF6', secondary: '#EC4899' }
    }
  },
  {
    id: 'blog',
    name: 'Modern Blog',
    category: 'blog',
    icon: BookOpen,
    description: 'Clean and readable blog layout for writers',
    color: 'from-green-500 to-emerald-500',
    features: ['Post Grid', 'Categories', 'Author Bio', 'Newsletter', 'Social Share'],
    preview: {
      hero: { title: 'Stories & Ideas', subtitle: 'Thoughts that inspire and inform' },
      colors: { primary: '#10B981', secondary: '#34D399' }
    }
  },
  {
    id: 'shop',
    name: 'E-Commerce Store',
    category: 'shop',
    icon: ShoppingBag,
    description: 'Complete online store with product showcase',
    color: 'from-orange-500 to-red-500',
    features: ['Product Grid', 'Categories', 'Featured Items', 'Cart Preview', 'Checkout'],
    preview: {
      hero: { title: 'Shop Now', subtitle: 'Discover amazing products' },
      colors: { primary: '#F97316', secondary: '#EF4444' }
    }
  },
  {
    id: 'startup',
    name: 'Startup Launch',
    category: 'startup',
    icon: Rocket,
    description: 'High-converting landing page for startups',
    color: 'from-violet-500 to-purple-600',
    features: ['Hero with CTA', 'Features List', 'Pricing Table', 'FAQ Section', 'Newsletter'],
    preview: {
      hero: { title: 'Launch Your Vision', subtitle: 'The future starts here' },
      colors: { primary: '#7C3AED', secondary: '#A78BFA' }
    }
  },
  {
    id: 'saas',
    name: 'SaaS Product',
    category: 'startup',
    icon: Zap,
    description: 'Perfect for software and app products',
    color: 'from-cyan-500 to-blue-500',
    features: ['Product Demo', 'Feature Comparison', 'Pricing Plans', 'Integration Logos', 'CTA Sections'],
    preview: {
      hero: { title: 'Supercharge Your Workflow', subtitle: 'Automation made simple' },
      colors: { primary: '#06B6D4', secondary: '#3B82F6' }
    }
  },
  {
    id: 'music',
    name: 'Artist/Music',
    category: 'creative',
    icon: Music,
    description: 'For musicians, bands, and artists',
    color: 'from-pink-500 to-rose-500',
    features: ['Music Player', 'Tour Dates', 'Merch Store', 'Photo Gallery', 'Social Feed'],
    preview: {
      hero: { title: 'Listen Now', subtitle: 'New album dropping soon' },
      colors: { primary: '#EC4899', secondary: '#F43F5E' }
    }
  },
  {
    id: 'community',
    name: 'Community Hub',
    category: 'community',
    icon: Users,
    description: 'Build and engage your community',
    color: 'from-teal-500 to-green-500',
    features: ['Member Directory', 'Events Calendar', 'Discussion Forum', 'Resources', 'Newsletter'],
    preview: {
      hero: { title: 'Join Our Community', subtitle: 'Connect, learn, and grow together' },
      colors: { primary: '#14B8A6', secondary: '#22C55E' }
    }
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Cafe',
    category: 'business',
    icon: Coffee,
    description: 'Perfect for restaurants and food businesses',
    color: 'from-amber-500 to-orange-500',
    features: ['Menu Display', 'Reservation Form', 'Location Map', 'Photo Gallery', 'Reviews'],
    preview: {
      hero: { title: 'Fine Dining Experience', subtitle: 'Taste the difference' },
      colors: { primary: '#F59E0B', secondary: '#FB923C' }
    }
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit & Charity',
    category: 'community',
    icon: Heart,
    description: 'For organizations making a difference',
    color: 'from-rose-500 to-red-500',
    features: ['Donation Form', 'Impact Stories', 'Volunteer Signup', 'Events', 'Newsletter'],
    preview: {
      hero: { title: 'Make a Difference', subtitle: 'Together we can change the world' },
      colors: { primary: '#F43F5E', secondary: '#EF4444' }
    }
  },
  {
    id: 'developer',
    name: 'Developer Portfolio',
    category: 'portfolio',
    icon: Code,
    description: 'Showcase your coding projects',
    color: 'from-gray-700 to-gray-900',
    features: ['Project Cards', 'GitHub Integration', 'Tech Stack', 'Blog Section', 'Contact'],
    preview: {
      hero: { title: 'Building the Future', subtitle: 'One line of code at a time' },
      colors: { primary: '#374151', secondary: '#6B7280' }
    }
  },
  {
    id: 'landing',
    name: 'Product Landing',
    category: 'startup',
    icon: Star,
    description: 'Single product landing page',
    color: 'from-indigo-500 to-purple-500',
    features: ['Hero with Demo', 'Feature Highlights', 'Social Proof', 'CTA Section', 'FAQ'],
    preview: {
      hero: { title: 'Introducing Product X', subtitle: 'The solution you\'ve been waiting for' },
      colors: { primary: '#6366F1', secondary: '#8B5CF6' }
    }
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'business', name: 'Business' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'blog', name: 'Blog' },
  { id: 'shop', name: 'E-Commerce' },
  { id: 'startup', name: 'Startup' },
  { id: 'creative', name: 'Creative' },
  { id: 'community', name: 'Community' }
];

// Live preview component
function TemplatePreview({ template, onClose, onSelect }) {
  const { preview, name, features, color } = template;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-500">Preview Mode</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSelect}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Use This Template
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto">
          {/* Hero Section Preview */}
          <div 
            className={`bg-gradient-to-br ${color} text-white py-20 px-8`}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{preview.hero.title}</h1>
              <p className="text-xl opacity-90 mb-8">{preview.hero.subtitle}</p>
              <div className="flex justify-center gap-4">
                <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold">
                  Get Started
                </button>
                <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="py-16 px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Included Sections</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                    <div 
                      className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${preview.colors.primary}20` }}
                    >
                      <Check className="w-5 h-5" style={{ color: preview.colors.primary }} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{feature}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Preview */}
          <div 
            className="py-16 px-8"
            style={{ backgroundColor: preview.colors.primary }}
          >
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg opacity-90 mb-8">Create your website in minutes with this template</p>
              <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold">
                Start Building
              </button>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="py-8 px-8 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <p className="text-gray-400">© 2026 Your Company. All rights reserved.</p>
              <div className="flex gap-6">
                <span className="text-gray-400 hover:text-white cursor-pointer">Privacy</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Terms</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  const selectTemplate = (templateId) => {
    router.push(`/studio/sites/new?template=${templateId}`);
  };

  return (
    <>
      <Head>
        <title>Website Templates - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/studio">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Website Templates</h1>
                  <p className="text-sm text-gray-500">{filteredTemplates.length} templates available</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    category === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition"
              >
                {/* Preview Image */}
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${template.color}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <template.icon className="w-12 h-12 mx-auto mb-3 opacity-80" />
                      <h3 className="text-xl font-bold">{template.preview.hero.title}</h3>
                      <p className="text-sm opacity-80 mt-1">{template.preview.hero.subtitle}</p>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => selectTemplate(template.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-purple-700"
                    >
                      <Check className="w-4 h-4" />
                      Use
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                      <template.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No templates found</h3>
              <p className="text-gray-400">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => selectTemplate(previewTemplate.id)}
        />
      )}
    </>
  );
}
