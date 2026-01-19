// ============================================
// FILE: src/pages/studio/campaigns/templates.jsx
// CYBEV Email Templates - Klaviyo Quality
// VERSION: 3.0.0 - Functional Templates
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import { Mail, Plus, Search, Grid, List, Star, Copy, Eye, ArrowLeft, Loader2, X, Layout, Sparkles, ShoppingCart, Bell, Heart, Gift, Calendar, Megaphone, BookOpen, Zap } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid },
  { id: 'welcome', label: 'Welcome', icon: Heart },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'promotional', label: 'Promotional', icon: Megaphone },
  { id: 'announcement', label: 'Announcement', icon: Bell },
  { id: 'event', label: 'Event', icon: Calendar },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'educational', label: 'Educational', icon: BookOpen },
];

const TEMPLATES = [
  { _id: 'tpl_welcome', name: 'Welcome Series', description: 'Modern welcome email with brand intro', category: 'welcome', thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', rating: 4.8, usageCount: 1520, subject: 'Welcome to {{company}}! 🎉' },
  { _id: 'tpl_digest', name: 'Weekly Digest', description: 'Newsletter with multiple content sections', category: 'newsletter', thumbnail: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=400&h=300&fit=crop', rating: 4.7, usageCount: 2340, subject: 'Your Weekly Update 📬' },
  { _id: 'tpl_flash', name: 'Flash Sale', description: 'Eye-catching promo with countdown', category: 'promotional', thumbnail: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop', rating: 4.9, usageCount: 3120, subject: '⚡ Flash Sale - 24 Hours Only!' },
  { _id: 'tpl_cart', name: 'Cart Recovery', description: 'Recover abandoned carts', category: 'ecommerce', thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', rating: 4.6, usageCount: 890, subject: 'You left something behind 🛒' },
  { _id: 'tpl_event', name: 'Event Invitation', description: 'Beautiful RSVP invitation', category: 'event', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop', rating: 4.8, usageCount: 670, subject: 'You\'re Invited! 🎉' },
  { _id: 'tpl_launch', name: 'Product Launch', description: 'Announce new products', category: 'announcement', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', rating: 4.7, usageCount: 1230, subject: 'Introducing: {{product_name}} 🚀' },
  { _id: 'tpl_winback', name: 'We Miss You', description: 'Re-engage inactive subscribers', category: 'promotional', thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop', rating: 4.5, usageCount: 540, subject: 'We miss you! Come back for 20% off' },
  { _id: 'tpl_order', name: 'Order Confirmation', description: 'Professional order receipt', category: 'ecommerce', thumbnail: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=400&h=300&fit=crop', rating: 4.9, usageCount: 4560, subject: 'Order Confirmed ✓' },
  { _id: 'tpl_course', name: 'Course Update', description: 'Educational content delivery', category: 'educational', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop', rating: 4.6, usageCount: 320, subject: 'New lesson available 📚' },
  { _id: 'tpl_minimal', name: 'Minimal Clean', description: 'Simple elegant template', category: 'newsletter', thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop', rating: 4.8, usageCount: 1890, subject: 'Quick Update' },
  { _id: 'tpl_dark', name: 'Dark Mode', description: 'Sleek dark-themed design', category: 'newsletter', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', rating: 4.7, usageCount: 980, subject: 'The Latest News' },
  { _id: 'tpl_holiday', name: 'Holiday Special', description: 'Festive seasonal template', category: 'promotional', thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=300&fit=crop', rating: 4.9, usageCount: 2340, subject: '🎄 Holiday Special Inside!' },
];

export default function EmailTemplates() {
  const router = useRouter();
  const [templates, setTemplates] = useState(TEMPLATES);
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('library');
  const [showPreview, setShowPreview] = useState(null);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  useEffect(() => {
    fetchUserTemplates();
  }, []);

  const fetchUserTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/templates`, getAuth());
      const data = await res.json();
      if (data.templates) setUserTemplates(data.templates.filter(t => t.type === 'user'));
    } catch (err) { console.error(err); }
  };

  const useTemplate = (template) => {
    router.push(`/studio/campaigns/editor?templateId=${template._id}`);
  };

  const filteredTemplates = (activeTab === 'library' ? templates : userTemplates).filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <Head><title>Email Templates - CYBEV</title></Head>
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
          <Link href="/studio/campaigns/editor?new=true" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create Template
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {[{ id: 'library', label: 'Template Library', count: templates.length }, { id: 'my', label: 'My Templates', count: userTemplates.length }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600'}`}>
              {tab.label} <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full ml-1">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${activeCategory === cat.id ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'}`}>
                <Icon className="w-4 h-4" /> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}>
            {filteredTemplates.map(tpl => (
              <div key={tpl._id} className={`bg-white rounded-xl border hover:shadow-lg hover:border-purple-300 transition overflow-hidden group ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button onClick={() => setShowPreview(tpl)} className="p-2 bg-white rounded-full"><Eye className="w-5 h-5" /></button>
                        <button onClick={() => useTemplate(tpl)} className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">Use Template</button>
                      </div>
                      <span className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> Pro</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{tpl.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{tpl.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(tpl.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                        </div>
                        <span className="text-gray-400">{tpl.usageCount?.toLocaleString()} uses</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={tpl.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                      <p className="text-sm text-gray-500">{tpl.description}</p>
                    </div>
                    <button onClick={() => useTemplate(tpl)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">Use</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold">{showPreview.name}</h3>
                  <p className="text-sm text-gray-500">{showPreview.description}</p>
                </div>
                <button onClick={() => setShowPreview(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 bg-gray-100 overflow-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                <div className="bg-white max-w-[600px] mx-auto rounded-lg shadow-lg overflow-hidden">
                  <img src={showPreview.thumbnail} alt="" className="w-full" />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">Email Preview</h2>
                    <p className="text-gray-600 mb-4">Subject: {showPreview.subject}</p>
                    <p className="text-gray-500">This template includes professionally designed sections with customizable content blocks.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(showPreview.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  <span className="ml-2">{showPreview.usageCount?.toLocaleString()} uses</span>
                </div>
                <button onClick={() => { useTemplate(showPreview); setShowPreview(null); }} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Use This Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Need a custom design?</h2>
          <p className="text-gray-600 mb-4">Use our drag-and-drop editor to create beautiful emails from scratch.</p>
          <Link href="/studio/campaigns/editor?new=true" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            <Sparkles className="w-5 h-5" /> Open Email Builder
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
