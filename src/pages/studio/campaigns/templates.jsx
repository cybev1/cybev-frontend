// ============================================
// FILE: src/pages/studio/campaigns/templates.jsx
// CYBEV Premium Email Templates - World Class
// VERSION: 3.0.0 - Mailchimp/Klaviyo Quality
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Mail, Plus, Search, Filter, Grid, List, Star, Copy, Edit2,
  Trash2, Eye, Download, Upload, ArrowLeft, Loader2, Check,
  Layout, Sparkles, ShoppingCart, Bell, Heart, Gift, Calendar,
  Users, TrendingUp, Megaphone, BookOpen, Award, Zap, Clock,
  ChevronDown, MoreHorizontal, FolderOpen, Tag, X
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Professional Template Categories with Icons
const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: Grid },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'promotional', label: 'Promotional', icon: Megaphone },
  { id: 'welcome', label: 'Welcome Series', icon: Heart },
  { id: 'announcement', label: 'Announcements', icon: Bell },
  { id: 'event', label: 'Events', icon: Calendar },
  { id: 'abandoned_cart', label: 'Abandoned Cart', icon: ShoppingCart },
  { id: 're_engagement', label: 'Re-engagement', icon: TrendingUp },
  { id: 'transactional', label: 'Transactional', icon: Check },
  { id: 'educational', label: 'Educational', icon: BookOpen },
  { id: 'thank_you', label: 'Thank You', icon: Gift },
];

// Professional Pre-built Templates
const SYSTEM_TEMPLATES = [
  {
    _id: 'tpl_welcome_1',
    name: 'Welcome Series - Modern',
    description: 'Clean, modern welcome email with brand introduction',
    category: 'welcome',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.8, count: 234 },
    usageCount: 1520,
    tags: ['welcome', 'onboarding', 'modern'],
    design: { primaryColor: '#6366f1', backgroundColor: '#ffffff' }
  },
  {
    _id: 'tpl_newsletter_1',
    name: 'Weekly Digest',
    description: 'Professional newsletter layout with multiple content sections',
    category: 'newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.7, count: 189 },
    usageCount: 2340,
    tags: ['newsletter', 'digest', 'content'],
    design: { primaryColor: '#3b82f6', backgroundColor: '#f8fafc' }
  },
  {
    _id: 'tpl_promo_1',
    name: 'Flash Sale',
    description: 'Eye-catching promotional template with countdown timer',
    category: 'promotional',
    thumbnail: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.9, count: 312 },
    usageCount: 3120,
    tags: ['sale', 'promotion', 'countdown'],
    design: { primaryColor: '#ef4444', backgroundColor: '#fef2f2' }
  },
  {
    _id: 'tpl_cart_1',
    name: 'Cart Recovery',
    description: 'Recover lost sales with this proven cart abandonment template',
    category: 'abandoned_cart',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.6, count: 156 },
    usageCount: 890,
    tags: ['cart', 'recovery', 'ecommerce'],
    design: { primaryColor: '#f59e0b', backgroundColor: '#fffbeb' }
  },
  {
    _id: 'tpl_event_1',
    name: 'Event Invitation',
    description: 'Beautiful event invitation with RSVP button and details',
    category: 'event',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.8, count: 98 },
    usageCount: 670,
    tags: ['event', 'invitation', 'rsvp'],
    design: { primaryColor: '#8b5cf6', backgroundColor: '#faf5ff' }
  },
  {
    _id: 'tpl_announce_1',
    name: 'Product Launch',
    description: 'Announce new products with stunning visuals',
    category: 'announcement',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.7, count: 145 },
    usageCount: 1230,
    tags: ['launch', 'product', 'announcement'],
    design: { primaryColor: '#10b981', backgroundColor: '#ecfdf5' }
  },
  {
    _id: 'tpl_reengage_1',
    name: 'We Miss You',
    description: 'Win back inactive subscribers with this engaging template',
    category: 're_engagement',
    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.5, count: 87 },
    usageCount: 540,
    tags: ['winback', 'reengagement', 'inactive'],
    design: { primaryColor: '#ec4899', backgroundColor: '#fdf2f8' }
  },
  {
    _id: 'tpl_thankyou_1',
    name: 'Order Confirmation',
    description: 'Professional order confirmation with tracking info',
    category: 'thank_you',
    thumbnail: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.9, count: 267 },
    usageCount: 4560,
    tags: ['order', 'confirmation', 'transactional'],
    design: { primaryColor: '#059669', backgroundColor: '#ffffff' }
  },
  {
    _id: 'tpl_edu_1',
    name: 'Course Update',
    description: 'Educational content with lessons and resources',
    category: 'educational',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.6, count: 78 },
    usageCount: 320,
    tags: ['course', 'education', 'learning'],
    design: { primaryColor: '#0ea5e9', backgroundColor: '#f0f9ff' }
  },
  {
    _id: 'tpl_minimal_1',
    name: 'Minimal Clean',
    description: 'Simple, elegant template for any purpose',
    category: 'newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.8, count: 203 },
    usageCount: 1890,
    tags: ['minimal', 'clean', 'simple'],
    design: { primaryColor: '#374151', backgroundColor: '#ffffff' }
  },
  {
    _id: 'tpl_dark_1',
    name: 'Dark Mode',
    description: 'Sleek dark-themed template for modern brands',
    category: 'newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.7, count: 156 },
    usageCount: 980,
    tags: ['dark', 'modern', 'tech'],
    design: { primaryColor: '#8b5cf6', backgroundColor: '#1f2937' }
  },
  {
    _id: 'tpl_holiday_1',
    name: 'Holiday Special',
    description: 'Festive template perfect for seasonal promotions',
    category: 'promotional',
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=300&fit=crop',
    type: 'system',
    rating: { average: 4.9, count: 178 },
    usageCount: 2340,
    tags: ['holiday', 'seasonal', 'festive'],
    design: { primaryColor: '#dc2626', backgroundColor: '#fef2f2' }
  }
];

export default function EmailTemplates() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('library'); // 'library', 'my-templates'
  const [showPreview, setShowPreview] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchTemplates = async () => {
    try {
      // Fetch user templates from API
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/templates`, getAuth());
      const data = await res.json();
      
      if (data.templates) {
        setUserTemplates(data.templates.filter(t => t.type === 'user'));
      }
      
      // Combine with system templates
      setTemplates([...SYSTEM_TEMPLATES]);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setTemplates(SYSTEM_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = async (template) => {
    // Navigate to create campaign with this template
    router.push({
      pathname: '/studio/campaigns/create',
      query: { templateId: template._id }
    });
  };

  const duplicateTemplate = async (template) => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/templates`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          description: template.description,
          category: template.category,
          content: template.content,
          design: template.design,
          type: 'user'
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        setUserTemplates([data.template, ...userTemplates]);
        setActiveTab('my-templates');
      }
    } catch (err) {
      console.error('Failed to duplicate:', err);
    } finally {
      setCreating(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!confirm('Delete this template?')) return;
    
    try {
      await fetch(`${API_URL}/api/campaigns-enhanced/templates/${id}`, {
        method: 'DELETE',
        ...getAuth()
      });
      setUserTemplates(userTemplates.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filteredTemplates = (activeTab === 'library' ? templates : userTemplates).filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || 
             t.description?.toLowerCase().includes(q) ||
             t.tags?.some(tag => tag.toLowerCase().includes(q));
    }
    return true;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-3 h-3 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <AppLayout>
      <Head>
        <title>Email Templates - CYBEV Studio</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/studio/campaigns" className="text-purple-600 hover:underline text-sm mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
            <p className="text-gray-600">Professional templates to kickstart your campaigns</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/studio/campaigns/editor?new=true"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Template
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'library' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Template Library
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {templates.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('my-templates')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'my-templates' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              My Templates
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {userTemplates.length}
              </span>
            </div>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* View Mode */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const count = (activeTab === 'library' ? templates : userTemplates)
              .filter(t => cat.id === 'all' || t.category === cat.id).length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                <span className="text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Templates Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'my-templates' ? 'No custom templates yet' : 'No templates found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'my-templates' 
                ? 'Create your first template or save one from the library'
                : 'Try adjusting your search or filters'}
            </p>
            {activeTab === 'my-templates' && (
              <button 
                onClick={() => setActiveTab('library')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Browse Template Library
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <div 
                key={template._id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {template.thumbnail ? (
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: template.design?.primaryColor || '#6366f1' }}
                    >
                      <Mail className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setShowPreview(template)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => useTemplate(template)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 text-sm font-medium"
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => duplicateTemplate(template)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Duplicate"
                    >
                      <Copy className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  
                  {/* Type Badge */}
                  {template.type === 'system' && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Pro
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{template.description}</p>
                  
                  {/* Rating & Usage */}
                  {template.rating && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        {renderStars(template.rating.average)}
                        <span className="text-gray-500 ml-1">({template.rating.count})</span>
                      </div>
                      <span className="text-gray-400">{template.usageCount?.toLocaleString()} uses</span>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {template.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <div 
                key={template._id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 transition flex items-center gap-4"
              >
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {template.thumbnail ? (
                    <img src={template.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: template.design?.primaryColor || '#6366f1' }}
                    >
                      <Mail className="w-6 h-6 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                    {template.type === 'system' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Pro</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{template.description}</p>
                </div>

                {/* Stats */}
                {template.rating && (
                  <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {template.rating.average}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(template)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => useTemplate(template)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                  >
                    Use
                  </button>
                  {activeTab === 'my-templates' && (
                    <button
                      onClick={() => deleteTemplate(template._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{showPreview.name}</h3>
                  <p className="text-sm text-gray-500">{showPreview.description}</p>
                </div>
                <button 
                  onClick={() => setShowPreview(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Preview Content */}
              <div className="p-4 bg-gray-100 overflow-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                <div className="bg-white max-w-[600px] mx-auto rounded-lg shadow-lg overflow-hidden">
                  {showPreview.thumbnail ? (
                    <img src={showPreview.thumbnail} alt="" className="w-full" />
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
                      <Mail className="w-20 h-20 text-white/30" />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Preview</h2>
                    <p className="text-gray-600">
                      This is a preview of the {showPreview.name} template. 
                      The actual email will contain your customized content and branding.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {showPreview.rating && (
                    <div className="flex items-center gap-1">
                      {renderStars(showPreview.rating.average)}
                      <span className="ml-1">({showPreview.rating.count} reviews)</span>
                    </div>
                  )}
                  {showPreview.usageCount && (
                    <span>{showPreview.usageCount.toLocaleString()} people used this</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      duplicateTemplate(showPreview);
                      setShowPreview(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Save Copy
                  </button>
                  <button
                    onClick={() => {
                      useTemplate(showPreview);
                      setShowPreview(null);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Need a custom template?</h2>
            <p className="text-gray-600 mb-4">
              Our drag-and-drop editor lets you create beautiful emails from scratch. 
              Start with a blank canvas and build exactly what you need.
            </p>
            <Link
              href="/studio/campaigns/editor?new=true"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              <Sparkles className="w-5 h-5" />
              Open Email Builder
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
