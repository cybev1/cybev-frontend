// ============================================
// FILE: /church/website/builder.jsx
// PURPOSE: Church Organization Website Builder
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Save, Eye, Settings, Plus, Trash2, GripVertical,
  Globe, Image, Video, Calendar, Book, Heart, Users, MapPin,
  Phone, Mail, Clock, ChevronDown, ChevronUp, ExternalLink,
  Play, Palette, Layout, Type, X
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero Banner', icon: Image, description: 'Large header with image' },
  { type: 'about', label: 'About Section', icon: Users, description: 'Ministry description' },
  { type: 'services', label: 'Service Times', icon: Clock, description: 'Weekly schedule' },
  { type: 'livestream', label: 'Live Stream', icon: Video, description: 'Embedded stream player' },
  { type: 'events', label: 'Events', icon: Calendar, description: 'Upcoming events list' },
  { type: 'sermons', label: 'Sermons', icon: Book, description: 'Past messages' },
  { type: 'giving', label: 'Giving', icon: Heart, description: 'Online giving section' },
  { type: 'gallery', label: 'Photo Gallery', icon: Image, description: 'Image gallery' },
  { type: 'contact', label: 'Contact Info', icon: Phone, description: 'Contact details & map' },
  { type: 'team', label: 'Leadership Team', icon: Users, description: 'Pastoral team' },
  { type: 'beliefs', label: 'Our Beliefs', icon: Book, description: 'Statement of faith' },
  { type: 'cta', label: 'Call to Action', icon: Heart, description: 'Action button section' },
];

export default function ChurchWebsiteBuilder() {
  const router = useRouter();
  const { orgId } = router.query;

  const [website, setWebsite] = useState({
    orgId: '',
    published: false,
    domain: '',
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#ec4899',
      fontFamily: 'Inter',
      darkMode: false
    },
    seo: {
      title: '',
      description: '',
      ogImage: ''
    },
    blocks: []
  });

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('blocks');
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (orgId) {
      fetchOrgAndWebsite();
    }
  }, [orgId]);

  const fetchOrgAndWebsite = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch org details
      const orgRes = await fetch(`${API}/api/church/org/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const orgData = await orgRes.json();
      if (orgData.ok) {
        setOrg(orgData.org);
        // Initialize website with org data
        setWebsite(prev => ({
          ...prev,
          orgId,
          seo: {
            ...prev.seo,
            title: orgData.org.name || '',
            description: orgData.org.description || ''
          },
          theme: {
            ...prev.theme,
            primaryColor: orgData.org.branding?.primaryColor || '#7c3aed'
          }
        }));
      }

      // Fetch existing website config if any
      const webRes = await fetch(`${API}/api/church/org/${orgId}/website`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const webData = await webRes.json();
      if (webData.ok && webData.website) {
        setWebsite(webData.website);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveWebsite = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/church/org/${orgId}/website`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(website)
      });
      const data = await res.json();
      if (data.ok) {
        alert('Website saved!');
      }
    } catch (err) {
      console.error('Error saving website:', err);
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (blockType) => {
    const blockConfig = BLOCK_TYPES.find(b => b.type === blockType);
    const newBlock = {
      id: `block_${Date.now()}`,
      type: blockType,
      content: getDefaultBlockContent(blockType)
    };

    setWebsite(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
    setSelectedBlock(newBlock.id);
  };

  const updateBlock = (blockId, content) => {
    setWebsite(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId ? { ...b, content } : b
      )
    }));
  };

  const removeBlock = (blockId) => {
    setWebsite(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== blockId)
    }));
    if (selectedBlock === blockId) setSelectedBlock(null);
  };

  const moveBlock = (fromIndex, toIndex) => {
    const newBlocks = [...website.blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    setWebsite(prev => ({ ...prev, blocks: newBlocks }));
  };

  const selectedBlockData = website.blocks.find(b => b.id === selectedBlock);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Website Builder - {org?.name || 'Church'}</title>
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-white border-b border-gray-200 dark:border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href={`/church/org/${orgId}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-gray-900">{org?.name} Website</h1>
              <p className="text-sm text-gray-500">
                {website.published ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Published
                  </span>
                ) : (
                  'Draft'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={saveWebsite}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 border-t border-gray-100 dark:border-gray-200">
          {[
            { id: 'blocks', label: 'Content', icon: Layout },
            { id: 'theme', label: 'Theme', icon: Palette },
            { id: 'seo', label: 'SEO', icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Block Types */}
        {activeTab === 'blocks' && (
          <aside className="w-64 bg-white dark:bg-white border-r border-gray-200 dark:border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Add Sections
            </h3>
            <div className="space-y-2">
              {BLOCK_TYPES.map(block => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition"
                >
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <block.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-900">{block.label}</p>
                    <p className="text-xs text-gray-500">{block.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8 h-[calc(100vh-120px)] overflow-y-auto">
          {activeTab === 'blocks' && (
            <div className="max-w-3xl mx-auto">
              {website.blocks.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <Plus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Add sections from the sidebar to build your website</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {website.blocks.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlock(block.id)}
                      className={`bg-white dark:bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                        selectedBlock === block.id
                          ? 'border-purple-500 ring-2 ring-purple-100'
                          : 'border-gray-200 dark:border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-5 h-5 text-gray-500 cursor-grab" />
                          <span className="font-medium text-gray-900 dark:text-gray-900">
                            {BLOCK_TYPES.find(b => b.type === block.type)?.label || block.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {index > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); moveBlock(index, index - 1); }}
                              className="p-1 text-gray-500 hover:text-gray-600"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}
                          {index < website.blocks.length - 1 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); moveBlock(index, index + 1); }}
                              className="p-1 text-gray-500 hover:text-gray-600"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <BlockPreview block={block} theme={website.theme} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'theme' && (
            <ThemePanel
              theme={website.theme}
              onChange={(theme) => setWebsite(prev => ({ ...prev, theme }))}
            />
          )}

          {activeTab === 'seo' && (
            <SEOPanel
              seo={website.seo}
              onChange={(seo) => setWebsite(prev => ({ ...prev, seo }))}
            />
          )}
        </main>

        {/* Right Sidebar - Block Editor */}
        {activeTab === 'blocks' && selectedBlockData && (
          <aside className="w-80 bg-white dark:bg-white border-l border-gray-200 dark:border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-900">Edit Section</h3>
              <button onClick={() => setSelectedBlock(null)} className="p-1 text-gray-500 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <BlockEditor
              block={selectedBlockData}
              onUpdate={(content) => updateBlock(selectedBlockData.id, content)}
              org={org}
            />
          </aside>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <WebsitePreview
          website={website}
          org={org}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

// Default block content
function getDefaultBlockContent(type) {
  switch (type) {
    case 'hero':
      return {
        title: 'Welcome to Our Church',
        subtitle: 'Join us for worship every Sunday',
        backgroundImage: '',
        buttonText: 'Join Us',
        buttonLink: '#services'
      };
    case 'about':
      return {
        title: 'About Us',
        description: 'Our church is a vibrant community of believers...',
        image: ''
      };
    case 'services':
      return {
        title: 'Service Times',
        services: [
          { day: 'Sunday', time: '9:00 AM', name: 'Morning Service' },
          { day: 'Sunday', time: '11:00 AM', name: 'Main Service' },
          { day: 'Wednesday', time: '7:00 PM', name: 'Bible Study' }
        ]
      };
    case 'livestream':
      return {
        title: 'Watch Live',
        embedUrl: '',
        description: 'Join us live every Sunday'
      };
    case 'events':
      return {
        title: 'Upcoming Events',
        showCount: 3
      };
    case 'sermons':
      return {
        title: 'Recent Sermons',
        showCount: 3
      };
    case 'giving':
      return {
        title: 'Support Our Ministry',
        description: 'Your generosity helps us fulfill our mission',
        buttonText: 'Give Now',
        buttonLink: '/church/giving'
      };
    case 'gallery':
      return {
        title: 'Photo Gallery',
        images: []
      };
    case 'contact':
      return {
        title: 'Contact Us',
        showMap: true,
        showForm: true
      };
    case 'team':
      return {
        title: 'Our Leadership',
        members: []
      };
    case 'beliefs':
      return {
        title: 'What We Believe',
        beliefs: []
      };
    case 'cta':
      return {
        title: 'Join Our Community',
        description: 'Experience the love of Christ with us',
        buttonText: 'Get Connected',
        buttonLink: '#contact'
      };
    default:
      return {};
  }
}

// Block Preview Component
function BlockPreview({ block, theme }) {
  const { type, content } = block;
  const primary = theme?.primaryColor || '#7c3aed';

  switch (type) {
    case 'hero':
      return (
        <div
          className="h-32 rounded-lg flex items-center justify-center text-gray-900"
          style={{
            background: content.backgroundImage
              ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.backgroundImage})`
              : `linear-gradient(135deg, ${primary}, ${theme?.secondaryColor || '#ec4899'})`
          }}
        >
          <div className="text-center">
            <h3 className="font-bold text-lg">{content.title}</h3>
            <p className="text-sm opacity-80">{content.subtitle}</p>
          </div>
        </div>
      );
    case 'services':
      return (
        <div className="space-y-2">
          {content.services?.slice(0, 2).map((s, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{s.day} - {s.name}</span>
              <span className="font-medium">{s.time}</span>
            </div>
          ))}
        </div>
      );
    case 'livestream':
      return (
        <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          <Play className="w-8 h-8 text-gray-500" />
        </div>
      );
    default:
      return (
        <div className="text-sm text-gray-500">
          {content.title || 'Section content'}
        </div>
      );
  }
}

// Block Editor Component
function BlockEditor({ block, onUpdate, org }) {
  const { type, content } = block;

  const updateContent = (key, value) => {
    onUpdate({ ...content, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Common title field */}
      {content.title !== undefined && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Title
          </label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => updateContent('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </div>
      )}

      {/* Type-specific fields */}
      {type === 'hero' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Background Image URL
            </label>
            <input
              type="url"
              value={content.backgroundImage || ''}
              onChange={(e) => updateContent('backgroundImage', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={content.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </>
      )}

      {type === 'about' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Description
          </label>
          <textarea
            value={content.description || ''}
            onChange={(e) => updateContent('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </div>
      )}

      {type === 'services' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
            Service Times
          </label>
          <div className="space-y-3">
            {content.services?.map((service, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => {
                    const newServices = [...content.services];
                    newServices[index].name = e.target.value;
                    updateContent('services', newServices);
                  }}
                  placeholder="Service name"
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={service.day}
                    onChange={(e) => {
                      const newServices = [...content.services];
                      newServices[index].day = e.target.value;
                      updateContent('services', newServices);
                    }}
                    placeholder="Day"
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={service.time}
                    onChange={(e) => {
                      const newServices = [...content.services];
                      newServices[index].time = e.target.value;
                      updateContent('services', newServices);
                    }}
                    placeholder="Time"
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                </div>
                <button
                  onClick={() => {
                    const newServices = content.services.filter((_, i) => i !== index);
                    updateContent('services', newServices);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                updateContent('services', [
                  ...(content.services || []),
                  { day: '', time: '', name: '' }
                ]);
              }}
              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-purple-400"
            >
              + Add Service
            </button>
          </div>
        </div>
      )}

      {type === 'livestream' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
            Embed URL
          </label>
          <input
            type="url"
            value={content.embedUrl || ''}
            onChange={(e) => updateContent('embedUrl', e.target.value)}
            placeholder="YouTube or Vimeo embed URL"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </div>
      )}

      {type === 'giving' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={content.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </>
      )}

      {(type === 'cta') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={content.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Button Link
            </label>
            <input
              type="text"
              value={content.buttonLink || ''}
              onChange={(e) => updateContent('buttonLink', e.target.value)}
              placeholder="#contact or URL"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </>
      )}
    </div>
  );
}

// Theme Panel
function ThemePanel({ theme, onChange }) {
  const colors = [
    '#7c3aed', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9',
    '#14b8a6', '#10b981', '#22c55e', '#eab308', '#f97316',
    '#ef4444', '#ec4899', '#d946ef'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Colors</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => onChange({ ...theme, primaryColor: color })}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    theme.primaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
              Secondary Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => onChange({ ...theme, secondaryColor: color })}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    theme.secondaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Typography</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-2">
            Font Family
          </label>
          <select
            value={theme.fontFamily || 'Inter'}
            onChange={(e) => onChange({ ...theme, fontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// SEO Panel
function SEOPanel({ seo, onChange }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Search Engine Optimization</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={seo.title || ''}
              onChange={(e) => onChange({ ...seo, title: e.target.value })}
              placeholder="Your Church Name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">60 characters max recommended</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Meta Description
            </label>
            <textarea
              value={seo.description || ''}
              onChange={(e) => onChange({ ...seo, description: e.target.value })}
              placeholder="Brief description of your church..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">155 characters max recommended</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
              Social Share Image (OG Image)
            </label>
            <input
              type="url"
              value={seo.ogImage || ''}
              onChange={(e) => onChange({ ...seo, ogImage: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">1200x630px recommended</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-200">
        <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4">Search Preview</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-blue-600 text-lg hover:underline cursor-pointer">
            {seo.title || 'Your Church Name'}
          </p>
          <p className="text-green-700 text-sm">https://your-church.cybev.io</p>
          <p className="text-gray-600 text-sm mt-1">
            {seo.description || 'Add a meta description to see a preview...'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Website Preview Modal
function WebsitePreview({ website, org, onClose }) {
  const { theme, blocks } = website;
  const primary = theme?.primaryColor || '#7c3aed';
  const secondary = theme?.secondaryColor || '#ec4899';

  return (
    <div className="fixed inset-0 bg-gray-900/80 z-50 overflow-auto">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
          <span className="font-medium">Website Preview</span>
        </div>
      </div>

      <div className="bg-white min-h-screen">
        {/* Render blocks */}
        {blocks.map(block => (
          <PreviewBlock key={block.id} block={block} theme={theme} org={org} />
        ))}

        {blocks.length === 0 && (
          <div className="flex items-center justify-center h-96 text-gray-500">
            No content added yet
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-50 text-gray-900 py-8 text-center">
          <p className="text-gray-500">
            Powered by <a href="https://cybev.io" className="hover:underline" style={{ color: primary }}>CYBEV</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Preview Block Component
function PreviewBlock({ block, theme, org }) {
  const { type, content } = block;
  const primary = theme?.primaryColor || '#7c3aed';
  const secondary = theme?.secondaryColor || '#ec4899';

  switch (type) {
    case 'hero':
      return (
        <section
          className="min-h-[70vh] flex items-center justify-center text-gray-900"
          style={{
            background: content.backgroundImage
              ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${content.backgroundImage})`
              : `linear-gradient(135deg, ${primary}, ${secondary})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{content.title}</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">{content.subtitle}</p>
            {content.buttonText && (
              <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100">
                {content.buttonText}
              </button>
            )}
          </div>
        </section>
      );

    case 'services':
      return (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.services?.map((service, i) => (
                <div key={i} className="text-center p-6 bg-gray-50 rounded-xl">
                  <Clock className="w-8 h-8 mx-auto mb-4" style={{ color: primary }} />
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  <p className="text-gray-600">{service.day}</p>
                  <p className="text-xl font-bold" style={{ color: primary }}>{service.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>
            <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">{content.description}</p>
          </div>
        </section>
      );

    case 'livestream':
      return (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>
            <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center">
              {content.embedUrl ? (
                <iframe
                  src={content.embedUrl}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                />
              ) : (
                <div className="text-gray-900 text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="opacity-50">Live stream will appear here</p>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'giving':
    case 'cta':
      return (
        <section
          className="py-20 px-6 text-gray-900"
          style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
            <p className="text-xl opacity-90 mb-8">{content.description}</p>
            {content.buttonText && (
              <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold">
                {content.buttonText}
              </button>
            )}
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="py-20 px-6 bg-gray-50 text-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {org?.contact?.email && (
                <div>
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p>{org.contact.email}</p>
                </div>
              )}
              {org?.contact?.phone && (
                <div>
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <p>{org.contact.phone}</p>
                </div>
              )}
              {org?.contact?.address && (
                <div>
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <p>{org.contact.address}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    default:
      return (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{content.title || type}</h2>
          </div>
        </section>
      );
  }
}
