// ============================================
// FILE: src/pages/studio/sites/[id]/edit.jsx
// Website Editor - Full page builder
// VERSION: 6.4.2
// ============================================

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft, Save, Eye, Settings, Palette, Type, Layout, Image as ImageIcon,
  Plus, Trash2, ChevronUp, ChevronDown, Edit3, X, Check, Loader2,
  Globe, ExternalLink, Copy, Smartphone, Monitor, Tablet,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Square, Circle, Triangle, Star, Sparkles, Zap,
  Menu, FileText, Users, Mail, Phone, MapPin, Link as LinkIcon
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Block types available in the editor
const BLOCK_TYPES = [
  { id: 'hero', name: 'Hero Section', icon: Star, category: 'sections' },
  { id: 'text', name: 'Text Block', icon: Type, category: 'content' },
  { id: 'image', name: 'Image', icon: ImageIcon, category: 'content' },
  { id: 'gallery', name: 'Image Gallery', icon: Square, category: 'content' },
  { id: 'cta', name: 'Call to Action', icon: Zap, category: 'sections' },
  { id: 'features', name: 'Features Grid', icon: Layout, category: 'sections' },
  { id: 'testimonials', name: 'Testimonials', icon: Users, category: 'sections' },
  { id: 'pricing', name: 'Pricing Table', icon: FileText, category: 'sections' },
  { id: 'contact', name: 'Contact Form', icon: Mail, category: 'sections' },
  { id: 'footer', name: 'Footer', icon: Menu, category: 'sections' },
  { id: 'divider', name: 'Divider', icon: AlignCenter, category: 'layout' },
  { id: 'spacer', name: 'Spacer', icon: Square, category: 'layout' },
];

// Default block content
const DEFAULT_BLOCKS = {
  hero: {
    type: 'hero',
    content: {
      title: 'Welcome to My Website',
      subtitle: 'Create amazing experiences with CYBEV',
      buttonText: 'Get Started',
      buttonLink: '#',
      backgroundImage: '',
      align: 'center'
    }
  },
  text: {
    type: 'text',
    content: {
      text: 'Add your content here. Click to edit this text block.',
      align: 'left'
    }
  },
  image: {
    type: 'image',
    content: {
      src: '',
      alt: 'Image description',
      caption: ''
    }
  },
  cta: {
    type: 'cta',
    content: {
      title: 'Ready to get started?',
      description: 'Join thousands of users who trust our platform.',
      buttonText: 'Sign Up Now',
      buttonLink: '#'
    }
  },
  features: {
    type: 'features',
    content: {
      title: 'Our Features',
      items: [
        { icon: 'zap', title: 'Fast', description: 'Lightning fast performance' },
        { icon: 'shield', title: 'Secure', description: 'Enterprise-grade security' },
        { icon: 'heart', title: 'Loved', description: 'Trusted by millions' }
      ]
    }
  },
  testimonials: {
    type: 'testimonials',
    content: {
      title: 'What Our Customers Say',
      items: [
        { name: 'John Doe', role: 'CEO', quote: 'Amazing platform!', avatar: '' },
        { name: 'Jane Smith', role: 'Designer', quote: 'Love the simplicity.', avatar: '' }
      ]
    }
  },
  contact: {
    type: 'contact',
    content: {
      title: 'Get in Touch',
      email: 'contact@example.com',
      phone: '+1 234 567 890',
      address: '123 Main St, City, Country'
    }
  },
  footer: {
    type: 'footer',
    content: {
      copyright: '© 2026 Your Company. All rights reserved.',
      links: [
        { label: 'Privacy', url: '/privacy' },
        { label: 'Terms', url: '/terms' }
      ]
    }
  },
  divider: {
    type: 'divider',
    content: { style: 'line' }
  },
  spacer: {
    type: 'spacer',
    content: { height: 40 }
  }
};

// Block renderer component
function BlockRenderer({ block, isEditing, onUpdate }) {
  const [localContent, setLocalContent] = useState(block.content);

  useEffect(() => {
    setLocalContent(block.content);
  }, [block.content]);

  const updateContent = (key, value) => {
    const newContent = { ...localContent, [key]: value };
    setLocalContent(newContent);
    onUpdate({ ...block, content: newContent });
  };

  switch (block.type) {
    case 'hero':
      return (
        <div 
          className="relative py-20 px-8 bg-gradient-to-br from-purple-600 to-indigo-700 text-white"
          style={localContent.backgroundImage ? { 
            backgroundImage: `url(${localContent.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <div className={`max-w-4xl mx-auto text-${localContent.align || 'center'}`}>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={localContent.title}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="w-full text-4xl md:text-5xl font-bold mb-4 bg-transparent border-b-2 border-white/30 focus:border-white outline-none text-center"
                />
                <input
                  type="text"
                  value={localContent.subtitle}
                  onChange={(e) => updateContent('subtitle', e.target.value)}
                  className="w-full text-xl mb-8 bg-transparent border-b border-white/30 focus:border-white outline-none text-center opacity-90"
                />
                <input
                  type="text"
                  value={localContent.buttonText}
                  onChange={(e) => updateContent('buttonText', e.target.value)}
                  className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold text-center"
                />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{localContent.title}</h1>
                <p className="text-xl mb-8 opacity-90">{localContent.subtitle}</p>
                <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition">
                  {localContent.buttonText}
                </button>
              </>
            )}
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            {isEditing ? (
              <textarea
                value={localContent.text}
                onChange={(e) => updateContent('text', e.target.value)}
                className="w-full min-h-[100px] text-lg text-gray-700 bg-transparent border border-gray-300 rounded-lg p-4 focus:border-purple-500 outline-none resize-none"
                style={{ textAlign: localContent.align }}
              />
            ) : (
              <p className="text-lg text-gray-700" style={{ textAlign: localContent.align }}>
                {localContent.text}
              </p>
            )}
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            {localContent.src ? (
              <img src={localContent.src} alt={localContent.alt} className="w-full rounded-xl shadow-lg" />
            ) : (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Click to add image</p>
                </div>
              </div>
            )}
            {localContent.caption && (
              <p className="text-center text-gray-500 mt-2">{localContent.caption}</p>
            )}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="py-16 px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={localContent.title}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="w-full text-3xl font-bold mb-4 bg-transparent border-b-2 border-white/30 focus:border-white outline-none text-center"
                />
                <input
                  type="text"
                  value={localContent.description}
                  onChange={(e) => updateContent('description', e.target.value)}
                  className="w-full text-lg mb-8 bg-transparent border-b border-white/30 focus:border-white outline-none text-center opacity-90"
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">{localContent.title}</h2>
                <p className="text-lg mb-8 opacity-90">{localContent.description}</p>
              </>
            )}
            <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition">
              {localContent.buttonText}
            </button>
          </div>
        </div>
      );

    case 'features':
      return (
        <div className="py-16 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{localContent.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {localContent.items.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'testimonials':
      return (
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{localContent.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {localContent.items.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-lg text-gray-700 mb-4 italic">"{item.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">{item.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="py-16 px-8 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">{localContent.title}</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {localContent.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>{localContent.email}</span>
                </div>
              )}
              {localContent.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <span>{localContent.phone}</span>
                </div>
              )}
              {localContent.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>{localContent.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="py-8 px-8 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-400">{localContent.copyright}</p>
            <div className="flex gap-6">
              {localContent.links.map((link, idx) => (
                <a key={idx} href={link.url} className="text-gray-400 hover:text-white transition">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="py-4 px-8">
          <div className="max-w-4xl mx-auto">
            <hr className="border-gray-200" />
          </div>
        </div>
      );

    case 'spacer':
      return <div style={{ height: localContent.height }} />;

    default:
      return (
        <div className="py-8 px-8 bg-gray-100 text-center text-gray-500">
          Unknown block type: {block.type}
        </div>
      );
  }
}

export default function SiteEditor() {
  const router = useRouter();
  const { id } = router.query;
  
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [device, setDevice] = useState('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    name: '',
    description: '',
    favicon: '',
    ogImage: '',
    customCss: '',
    customHead: ''
  });

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    if (id) {
      fetchSite();
    }
  }, [id]);

  const fetchSite = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sites/${id}`, getAuth());
      const data = await res.json();
      
      if (data.ok || data.site) {
        const siteData = data.site || data;
        setSite(siteData);
        setBlocks(siteData.pages?.[0]?.blocks || siteData.blocks || [
          { id: 'block-1', ...DEFAULT_BLOCKS.hero },
          { id: 'block-2', ...DEFAULT_BLOCKS.features },
          { id: 'block-3', ...DEFAULT_BLOCKS.cta },
          { id: 'block-4', ...DEFAULT_BLOCKS.footer }
        ]);
        setSiteSettings({
          name: siteData.name || '',
          description: siteData.description || '',
          favicon: siteData.favicon || '',
          ogImage: siteData.ogImage || '',
          customCss: siteData.customCss || '',
          customHead: siteData.customHead || ''
        });
      }
    } catch (err) {
      console.error('Fetch site error:', err);
    }
    setLoading(false);
  };

  const saveSite = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/sites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuth().headers
        },
        body: JSON.stringify({
          ...siteSettings,
          blocks,
          pages: [{ id: 'home', name: 'Home', blocks }]
        })
      });
      
      const data = await res.json();
      if (data.ok || data.site) {
        // Show success toast
      }
    } catch (err) {
      console.error('Save site error:', err);
    }
    setSaving(false);
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      ...DEFAULT_BLOCKS[type]
    };
    
    if (selectedBlock !== null) {
      const newBlocks = [...blocks];
      newBlocks.splice(selectedBlock + 1, 0, newBlock);
      setBlocks(newBlocks);
      setSelectedBlock(selectedBlock + 1);
    } else {
      setBlocks([...blocks, newBlock]);
      setSelectedBlock(blocks.length);
    }
    setShowAddBlock(false);
  };

  const deleteBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    setSelectedBlock(null);
  };

  const moveBlock = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
    setSelectedBlock(newIndex);
  };

  const updateBlock = (index, updatedBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit {site?.name || 'Website'} - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Link href="/studio">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            
            <div>
              <h1 className="font-semibold text-gray-900">{site?.name || 'Untitled Site'}</h1>
              <p className="text-sm text-gray-500">{site?.subdomain}.cybev.io</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Preview */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded ${device === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded ${device === 'tablet' ? 'bg-white shadow-sm' : ''}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded ${device === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                previewMode ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            <a
              href={`https://${site?.subdomain}.cybev.io`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </a>

            <button
              onClick={saveSite}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Sidebar - Block Library */}
          {!previewMode && (
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 mb-4">Add Blocks</h2>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sections</p>
                  {BLOCK_TYPES.filter(b => b.category === 'sections').map((block) => (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-left transition group"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                        <block.icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700">{block.name}</span>
                    </button>
                  ))}
                  
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-4">Content</p>
                  {BLOCK_TYPES.filter(b => b.category === 'content').map((block) => (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-left transition group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200">
                        <block.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{block.name}</span>
                    </button>
                  ))}
                  
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-4">Layout</p>
                  {BLOCK_TYPES.filter(b => b.category === 'layout').map((block) => (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-left transition group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200">
                        <block.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{block.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Canvas */}
          <div className="flex-1 overflow-auto bg-gray-200 p-4">
            <div 
              className="mx-auto bg-white min-h-full shadow-xl transition-all duration-300"
              style={{ width: getDeviceWidth(), maxWidth: '100%' }}
            >
              {blocks.length === 0 ? (
                <div className="p-20 text-center">
                  <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No blocks yet</h3>
                  <p className="text-gray-400 mb-6">Add blocks from the sidebar to start building</p>
                  <button
                    onClick={() => addBlock('hero')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add Hero Section
                  </button>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`relative group ${
                      selectedBlock === index && !previewMode ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => !previewMode && setSelectedBlock(index)}
                  >
                    <BlockRenderer 
                      block={block} 
                      isEditing={selectedBlock === index && !previewMode}
                      onUpdate={(updated) => updateBlock(index, updated)}
                    />
                    
                    {/* Block Controls */}
                    {!previewMode && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(index, -1); }}
                          disabled={index === 0}
                          className="p-1.5 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(index, 1); }}
                          disabled={index === blocks.length - 1}
                          className="p-1.5 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteBlock(index); }}
                          className="p-1.5 bg-white rounded shadow hover:bg-red-50 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={siteSettings.name}
                    onChange={(e) => setSiteSettings({ ...siteSettings, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={siteSettings.description}
                    onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                  <input
                    type="text"
                    value={siteSettings.favicon}
                    onChange={(e) => setSiteSettings({ ...siteSettings, favicon: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Social Preview Image</label>
                  <input
                    type="text"
                    value={siteSettings.ogImage}
                    onChange={(e) => setSiteSettings({ ...siteSettings, ogImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { saveSite(); setShowSettings(false); }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
