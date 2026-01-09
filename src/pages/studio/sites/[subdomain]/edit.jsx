// ============================================
// FILE: src/pages/studio/sites/[subdomain]/edit.jsx
// Website Builder Edit Page - FIX FOR 404
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Layout,
  Type,
  Image as ImageIcon,
  Palette,
  Settings,
  Loader2,
  ExternalLink,
  Plus,
  Trash2,
  Move,
  Copy
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const SECTION_TYPES = [
  { id: 'hero', name: 'Hero Section', icon: Layout },
  { id: 'about', name: 'About', icon: Type },
  { id: 'gallery', name: 'Image Gallery', icon: ImageIcon },
  { id: 'features', name: 'Features', icon: Layout },
  { id: 'contact', name: 'Contact', icon: Globe },
  { id: 'cta', name: 'Call to Action', icon: Layout }
];

export default function WebsiteBuilderEdit() {
  const router = useRouter();
  const { subdomain } = router.query;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [site, setSite] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (subdomain) {
      fetchSite();
    }
  }, [subdomain]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchSite = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/sites/subdomain/${subdomain}`, getAuth());
      if (res.data.ok || res.data.site) {
        setSite(res.data.site || res.data);
      }
    } catch (err) {
      console.error('Fetch site error:', err);
      if (err.response?.status === 404) {
        // Try by ID
        try {
          const res2 = await axios.get(`${API_URL}/api/sites/${subdomain}`, getAuth());
          if (res2.data.ok || res2.data.site) {
            setSite(res2.data.site || res2.data);
          }
        } catch {
          alert('Site not found');
          router.push('/studio');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/sites/${site._id}`,
        site,
        getAuth()
      );
      if (res.data.ok) {
        alert('Site saved successfully!');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/sites/${site._id}/publish`,
        {},
        getAuth()
      );
      if (res.data.ok) {
        setSite(prev => ({ ...prev, isPublished: true }));
        alert('Site published successfully!');
      }
    } catch (err) {
      console.error('Publish error:', err);
      alert(err.response?.data?.error || 'Failed to publish');
    } finally {
      setSaving(false);
    }
  };

  const updateSiteField = (field, value) => {
    setSite(prev => ({ ...prev, [field]: value }));
  };

  const updateSection = (index, field, value) => {
    setSite(prev => {
      const sections = [...(prev.sections || [])];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const addSection = (type) => {
    setSite(prev => ({
      ...prev,
      sections: [
        ...(prev.sections || []),
        { type, title: '', content: '', order: (prev.sections?.length || 0) + 1 }
      ]
    }));
  };

  const removeSection = (index) => {
    setSite(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!site) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Site not found</h2>
          <Link href="/studio">
            <button className="text-purple-400 hover:underline">Back to Studio</button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Edit {site.name || 'Website'} - CYBEV Studio</title>
      </Head>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/studio">
              <button className="p-2 hover:bg-white/10 rounded-lg text-white">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">{site.name || 'Untitled Site'}</h1>
              <p className="text-gray-400 text-sm">
                {site.subdomain}.cybev.io
                {site.customDomain && ` • ${site.customDomain}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            
            <a
              href={`https://${site.subdomain}.cybev.io`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              <ExternalLink className="w-4 h-4" />
              Visit
            </a>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>

            <button
              onClick={handlePublish}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg"
            >
              <Globe className="w-4 h-4" />
              {site.isPublished ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'content', label: 'Content', icon: Type },
              { id: 'design', label: 'Design', icon: Palette },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'content' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-4">
              {/* Site Title & Description */}
              <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-white font-semibold mb-4">Basic Info</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Site Title</label>
                    <input
                      type="text"
                      value={site.name || ''}
                      onChange={(e) => updateSiteField('name', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      placeholder="My Awesome Website"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Description</label>
                    <textarea
                      value={site.description || ''}
                      onChange={(e) => updateSiteField('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                      placeholder="Describe your website..."
                    />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Sections</h3>
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm">
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                    <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
                      {SECTION_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => addSection(type.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 text-left"
                        >
                          <type.icon className="w-4 h-4" />
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {(site.sections || []).map((section, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 border border-purple-500/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Move className="w-4 h-4 text-gray-500 cursor-move" />
                          <span className="text-purple-400 text-sm font-medium capitalize">
                            {section.type}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSection(index)}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={section.title || ''}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none mb-2"
                        placeholder="Section Title"
                      />

                      <textarea
                        value={section.content || ''}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                        placeholder="Section content..."
                      />
                    </div>
                  ))}

                  {(!site.sections || site.sections.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No sections yet. Add one to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-4 sticky top-32">
                <h3 className="text-white font-semibold mb-4">Preview</h3>
                <div className="aspect-[9/16] bg-white rounded-lg overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-purple-100 to-pink-100 p-4 text-gray-800">
                    <h4 className="font-bold text-lg mb-2">{site.name || 'Site Title'}</h4>
                    <p className="text-sm text-gray-600">{site.description || 'Site description...'}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs text-center mt-3">
                  Preview updates as you edit
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-6">
            <h3 className="text-white font-semibold mb-4">Design Settings</h3>
            <p className="text-gray-400">Theme and style customization coming soon...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/5 rounded-2xl border border-purple-500/20 p-6 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-4">Domain Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Subdomain</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={site.subdomain || ''}
                      onChange={(e) => updateSiteField('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="flex-1 px-4 py-2 bg-white/5 border border-purple-500/30 rounded-l-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                    <span className="px-4 py-2 bg-white/10 border border-l-0 border-purple-500/30 rounded-r-lg text-gray-400">
                      .cybev.io
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Custom Domain (optional)</label>
                  <input
                    type="text"
                    value={site.customDomain || ''}
                    onChange={(e) => updateSiteField('customDomain', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="www.yourdomain.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={site.seo?.title || site.name || ''}
                    onChange={(e) => updateSiteField('seo', { ...site.seo, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Meta Description</label>
                  <textarea
                    value={site.seo?.description || site.description || ''}
                    onChange={(e) => updateSiteField('seo', { ...site.seo, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
