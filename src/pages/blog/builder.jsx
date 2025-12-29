// ============================================
// FILE: src/pages/blog/builder.jsx
// PATH: cybev-frontend/src/pages/blog/builder.jsx
// PURPOSE: Advanced drag-and-drop blog/website builder
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Type,
  Image,
  Video,
  Layout,
  Columns,
  Square,
  Circle,
  Star,
  Quote,
  List,
  Code,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Trash2,
  Copy,
  Move,
  Eye,
  EyeOff,
  Save,
  Undo,
  Redo,
  Settings,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  ChevronLeft,
  ChevronRight,
  Plus,
  GripVertical,
  X,
  Check,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Globe,
  Zap,
  Sparkles,
  FileText,
  Grid,
  Layers
} from 'lucide-react';
import api from '@/lib/api';

// Component types for the builder
const COMPONENT_TYPES = {
  // Layout components
  SECTION: 'section',
  CONTAINER: 'container',
  COLUMNS: 'columns',
  SPACER: 'spacer',
  DIVIDER: 'divider',
  
  // Content components
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  IMAGE: 'image',
  VIDEO: 'video',
  BUTTON: 'button',
  LINK: 'link',
  
  // Rich content
  QUOTE: 'quote',
  LIST: 'list',
  CODE: 'code',
  EMBED: 'embed',
  
  // Advanced
  GALLERY: 'gallery',
  CAROUSEL: 'carousel',
  TESTIMONIAL: 'testimonial',
  CTA: 'cta',
  HERO: 'hero',
  FEATURE_GRID: 'featureGrid',
  PRICING: 'pricing',
  FAQ: 'faq',
  CONTACT_FORM: 'contactForm',
  NEWSLETTER: 'newsletter',
  SOCIAL_LINKS: 'socialLinks'
};

// Component library with default props
const COMPONENT_LIBRARY = [
  {
    category: 'Layout',
    icon: Layout,
    items: [
      { type: COMPONENT_TYPES.SECTION, label: 'Section', icon: Square, description: 'Full-width section container' },
      { type: COMPONENT_TYPES.CONTAINER, label: 'Container', icon: Square, description: 'Centered content container' },
      { type: COMPONENT_TYPES.COLUMNS, label: 'Columns', icon: Columns, description: '2-4 column layout' },
      { type: COMPONENT_TYPES.SPACER, label: 'Spacer', icon: Square, description: 'Vertical spacing' },
      { type: COMPONENT_TYPES.DIVIDER, label: 'Divider', icon: Square, description: 'Horizontal line divider' }
    ]
  },
  {
    category: 'Text',
    icon: Type,
    items: [
      { type: COMPONENT_TYPES.HEADING, label: 'Heading', icon: Type, description: 'H1-H6 headings' },
      { type: COMPONENT_TYPES.PARAGRAPH, label: 'Paragraph', icon: AlignLeft, description: 'Text paragraph' },
      { type: COMPONENT_TYPES.QUOTE, label: 'Quote', icon: Quote, description: 'Blockquote' },
      { type: COMPONENT_TYPES.LIST, label: 'List', icon: List, description: 'Bullet or numbered list' },
      { type: COMPONENT_TYPES.CODE, label: 'Code Block', icon: Code, description: 'Code snippet' }
    ]
  },
  {
    category: 'Media',
    icon: Image,
    items: [
      { type: COMPONENT_TYPES.IMAGE, label: 'Image', icon: Image, description: 'Single image' },
      { type: COMPONENT_TYPES.VIDEO, label: 'Video', icon: Video, description: 'Video embed' },
      { type: COMPONENT_TYPES.GALLERY, label: 'Gallery', icon: Grid, description: 'Image gallery grid' },
      { type: COMPONENT_TYPES.CAROUSEL, label: 'Carousel', icon: Layers, description: 'Image/content slider' }
    ]
  },
  {
    category: 'Actions',
    icon: Zap,
    items: [
      { type: COMPONENT_TYPES.BUTTON, label: 'Button', icon: Square, description: 'CTA button' },
      { type: COMPONENT_TYPES.LINK, label: 'Link', icon: LinkIcon, description: 'Text link' },
      { type: COMPONENT_TYPES.CTA, label: 'Call to Action', icon: Zap, description: 'CTA section' },
      { type: COMPONENT_TYPES.NEWSLETTER, label: 'Newsletter', icon: FileText, description: 'Email signup form' }
    ]
  },
  {
    category: 'Blocks',
    icon: Sparkles,
    items: [
      { type: COMPONENT_TYPES.HERO, label: 'Hero Section', icon: Maximize2, description: 'Full-width hero banner' },
      { type: COMPONENT_TYPES.FEATURE_GRID, label: 'Features', icon: Grid, description: 'Feature cards grid' },
      { type: COMPONENT_TYPES.TESTIMONIAL, label: 'Testimonial', icon: Quote, description: 'Customer testimonial' },
      { type: COMPONENT_TYPES.PRICING, label: 'Pricing', icon: Star, description: 'Pricing table' },
      { type: COMPONENT_TYPES.FAQ, label: 'FAQ', icon: List, description: 'FAQ accordion' },
      { type: COMPONENT_TYPES.CONTACT_FORM, label: 'Contact Form', icon: FileText, description: 'Contact form' }
    ]
  }
];

// Default component data factory
const createComponent = (type) => {
  const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const defaults = {
    [COMPONENT_TYPES.HEADING]: {
      id, type,
      props: { text: 'Your Heading Here', level: 'h2', align: 'left' },
      style: { color: '#ffffff', fontSize: '2rem', fontWeight: 'bold' }
    },
    [COMPONENT_TYPES.PARAGRAPH]: {
      id, type,
      props: { text: 'Add your paragraph text here. Click to edit and customize your content.' },
      style: { color: '#d1d5db', fontSize: '1rem', lineHeight: '1.75' }
    },
    [COMPONENT_TYPES.IMAGE]: {
      id, type,
      props: { src: '', alt: 'Image', caption: '' },
      style: { width: '100%', borderRadius: '0.5rem' }
    },
    [COMPONENT_TYPES.VIDEO]: {
      id, type,
      props: { url: '', autoplay: false, muted: true },
      style: { width: '100%', aspectRatio: '16/9' }
    },
    [COMPONENT_TYPES.BUTTON]: {
      id, type,
      props: { text: 'Click Me', url: '#', target: '_self' },
      style: { 
        backgroundColor: '#8b5cf6', 
        color: '#ffffff', 
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '600'
      }
    },
    [COMPONENT_TYPES.SECTION]: {
      id, type,
      props: { fullWidth: true },
      style: { padding: '4rem 2rem', backgroundColor: 'transparent' },
      children: []
    },
    [COMPONENT_TYPES.COLUMNS]: {
      id, type,
      props: { columns: 2, gap: '2rem' },
      style: {},
      children: [[], []] // Array of arrays for each column
    },
    [COMPONENT_TYPES.HERO]: {
      id, type,
      props: {
        title: 'Welcome to Your Site',
        subtitle: 'Create something amazing with our builder',
        buttonText: 'Get Started',
        buttonUrl: '#',
        backgroundImage: ''
      },
      style: {
        minHeight: '80vh',
        backgroundColor: '#1f2937',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    },
    [COMPONENT_TYPES.QUOTE]: {
      id, type,
      props: { text: 'Add an inspiring quote here.', author: 'Author Name' },
      style: { borderLeftColor: '#8b5cf6', fontStyle: 'italic' }
    },
    [COMPONENT_TYPES.SPACER]: {
      id, type,
      props: { height: '2rem' },
      style: {}
    },
    [COMPONENT_TYPES.DIVIDER]: {
      id, type,
      props: {},
      style: { borderColor: '#374151', borderWidth: '1px' }
    },
    [COMPONENT_TYPES.FEATURE_GRID]: {
      id, type,
      props: {
        title: 'Our Features',
        features: [
          { icon: 'star', title: 'Feature One', description: 'Description of feature one' },
          { icon: 'zap', title: 'Feature Two', description: 'Description of feature two' },
          { icon: 'shield', title: 'Feature Three', description: 'Description of feature three' }
        ]
      },
      style: { backgroundColor: '#111827' }
    },
    [COMPONENT_TYPES.TESTIMONIAL]: {
      id, type,
      props: {
        quote: 'This is an amazing product!',
        author: 'John Doe',
        role: 'CEO, Company',
        avatar: ''
      },
      style: {}
    },
    [COMPONENT_TYPES.CTA]: {
      id, type,
      props: {
        title: 'Ready to Get Started?',
        description: 'Join thousands of happy customers today.',
        buttonText: 'Sign Up Now',
        buttonUrl: '#'
      },
      style: { backgroundColor: '#7c3aed' }
    },
    [COMPONENT_TYPES.NEWSLETTER]: {
      id, type,
      props: {
        title: 'Subscribe to our Newsletter',
        description: 'Get the latest updates delivered to your inbox.',
        buttonText: 'Subscribe',
        placeholder: 'Enter your email'
      },
      style: {}
    }
  };

  return defaults[type] || { id, type, props: {}, style: {} };
};

// Component Renderer
function ComponentRenderer({ component, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onMove }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const renderComponent = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HEADING:
        const HeadingTag = component.props.level || 'h2';
        return (
          <HeadingTag
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              handleBlur();
              onUpdate({ ...component, props: { ...component.props, text: e.target.innerText } });
            }}
            style={component.style}
            className={`outline-none ${component.props.align === 'center' ? 'text-center' : component.props.align === 'right' ? 'text-right' : 'text-left'}`}
          >
            {component.props.text}
          </HeadingTag>
        );

      case COMPONENT_TYPES.PARAGRAPH:
        return (
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              handleBlur();
              onUpdate({ ...component, props: { ...component.props, text: e.target.innerText } });
            }}
            style={component.style}
            className="outline-none"
          >
            {component.props.text}
          </p>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <div className="relative">
            {component.props.src ? (
              <img
                src={component.props.src}
                alt={component.props.alt}
                style={component.style}
                className="w-full"
              />
            ) : (
              <div 
                className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600"
                style={component.style}
              >
                <div className="text-center text-gray-400">
                  <Image className="w-12 h-12 mx-auto mb-2" />
                  <p>Click to add image</p>
                </div>
              </div>
            )}
            {component.props.caption && (
              <p className="text-sm text-gray-400 mt-2 text-center">{component.props.caption}</p>
            )}
          </div>
        );

      case COMPONENT_TYPES.BUTTON:
        return (
          <button
            style={component.style}
            className="inline-block transition-opacity hover:opacity-90"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              handleBlur();
              onUpdate({ ...component, props: { ...component.props, text: e.target.innerText } });
            }}
          >
            {component.props.text}
          </button>
        );

      case COMPONENT_TYPES.HERO:
        return (
          <div
            style={{
              ...component.style,
              backgroundImage: component.props.backgroundImage ? `url(${component.props.backgroundImage})` : undefined
            }}
            className="flex items-center justify-center text-center"
          >
            <div className="max-w-3xl mx-auto px-4">
              <h1 
                className="text-5xl font-bold text-white mb-4"
                contentEditable={isEditing}
                suppressContentEditableWarning
              >
                {component.props.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8">{component.props.subtitle}</p>
              <button className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                {component.props.buttonText}
              </button>
            </div>
          </div>
        );

      case COMPONENT_TYPES.QUOTE:
        return (
          <blockquote
            className="border-l-4 pl-6 py-4"
            style={{ borderLeftColor: component.style.borderLeftColor }}
          >
            <p className="text-xl text-gray-300 italic mb-2">{component.props.text}</p>
            {component.props.author && (
              <cite className="text-gray-400">— {component.props.author}</cite>
            )}
          </blockquote>
        );

      case COMPONENT_TYPES.SPACER:
        return <div style={{ height: component.props.height }} />;

      case COMPONENT_TYPES.DIVIDER:
        return <hr style={component.style} className="border-t" />;

      case COMPONENT_TYPES.FEATURE_GRID:
        return (
          <div style={component.style} className="py-16 px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">{component.props.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {component.props.features?.map((feature, i) => (
                <div key={i} className="text-center p-6 bg-gray-800/50 rounded-xl">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case COMPONENT_TYPES.CTA:
        return (
          <div style={component.style} className="py-16 px-4 text-center rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">{component.props.title}</h2>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto">{component.props.description}</p>
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {component.props.buttonText}
            </button>
          </div>
        );

      default:
        return <div className="p-4 bg-gray-800 rounded text-gray-400">Unknown component: {component.type}</div>;
    }
  };

  return (
    <div
      onClick={() => onSelect(component.id)}
      onDoubleClick={handleDoubleClick}
      className={`relative group transition-all ${
        isSelected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900' : ''
      }`}
    >
      {/* Component Toolbar */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex gap-1 bg-gray-900 rounded-lg p-1 shadow-xl border border-purple-500/20 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onMove('up'); }}
            className="p-1.5 hover:bg-purple-500/20 rounded text-gray-400 hover:text-white"
            title="Move Up"
          >
            <ChevronLeft className="w-4 h-4 rotate-90" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMove('down'); }}
            className="p-1.5 hover:bg-purple-500/20 rounded text-gray-400 hover:text-white"
            title="Move Down"
          >
            <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
          <div className="w-px bg-gray-700" />
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-1.5 hover:bg-purple-500/20 rounded text-gray-400 hover:text-white"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drag Handle */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
        <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
      </div>

      {/* Component Content */}
      <div className="relative">
        {renderComponent()}
      </div>
    </div>
  );
}

// Main Builder Component
export default function BlogBuilder() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Builder state
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // UI state
  const [showLibrary, setShowLibrary] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [expandedCategory, setExpandedCategory] = useState('Layout');
  
  // Page settings
  const [pageSettings, setPageSettings] = useState({
    title: 'Untitled Page',
    slug: '',
    description: '',
    backgroundColor: '#111827',
    fontFamily: 'Inter, sans-serif'
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
    
    // Load saved draft if exists
    const savedDraft = localStorage.getItem('blogBuilderDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setComponents(draft.components || []);
        setPageSettings(draft.settings || pageSettings);
      } catch (e) {
        console.error('Failed to load draft');
      }
    }
    
    setLoading(false);
  }, [router]);

  // Save to history for undo/redo
  const saveToHistory = useCallback((newComponents) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newComponents));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Add component
  const addComponent = (type) => {
    const newComponent = createComponent(type);
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedId(newComponent.id);
    saveToHistory(newComponents);
  };

  // Update component
  const updateComponent = (updatedComponent) => {
    const newComponents = components.map(c => 
      c.id === updatedComponent.id ? updatedComponent : c
    );
    setComponents(newComponents);
    saveToHistory(newComponents);
  };

  // Delete component
  const deleteComponent = (id) => {
    const newComponents = components.filter(c => c.id !== id);
    setComponents(newComponents);
    setSelectedId(null);
    saveToHistory(newComponents);
  };

  // Duplicate component
  const duplicateComponent = (id) => {
    const component = components.find(c => c.id === id);
    if (component) {
      const newComponent = { 
        ...JSON.parse(JSON.stringify(component)), 
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
      };
      const index = components.findIndex(c => c.id === id);
      const newComponents = [...components];
      newComponents.splice(index + 1, 0, newComponent);
      setComponents(newComponents);
      setSelectedId(newComponent.id);
      saveToHistory(newComponents);
    }
  };

  // Move component
  const moveComponent = (id, direction) => {
    const index = components.findIndex(c => c.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= components.length) return;
    
    const newComponents = [...components];
    [newComponents[index], newComponents[newIndex]] = [newComponents[newIndex], newComponents[index]];
    setComponents(newComponents);
    saveToHistory(newComponents);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(JSON.parse(history[historyIndex - 1]));
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(JSON.parse(history[historyIndex + 1]));
    }
  };

  // Save draft
  const saveDraft = () => {
    localStorage.setItem('blogBuilderDraft', JSON.stringify({
      components,
      settings: pageSettings
    }));
    alert('Draft saved!');
  };

  // Publish
  const publish = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/blogs', {
        title: pageSettings.title,
        slug: pageSettings.slug || pageSettings.title.toLowerCase().replace(/\s+/g, '-'),
        description: pageSettings.description,
        components: components,
        settings: pageSettings,
        status: 'published'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        localStorage.removeItem('blogBuilderDraft');
        alert('Published successfully!');
        router.push(`/blog/${response.data.blog._id}`);
      }
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Get device width class
  const getDeviceClass = () => {
    switch (deviceView) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-6xl';
    }
  };

  const selectedComponent = components.find(c => c.id === selectedId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Blog Builder - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-900 flex">
        {/* Left Sidebar - Component Library */}
        {showLibrary && !previewMode && (
          <div className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Components
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {COMPONENT_LIBRARY.map((category) => (
                <div key={category.category} className="mb-2">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-gray-300">
                      <category.icon className="w-4 h-4" />
                      {category.category}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${expandedCategory === category.category ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {expandedCategory === category.category && (
                    <div className="mt-1 space-y-1 pl-2">
                      {category.items.map((item) => (
                        <button
                          key={item.type}
                          onClick={() => addComponent(item.type)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-purple-500/10 text-gray-400 hover:text-white transition-colors group"
                        >
                          <item.icon className="w-4 h-4 group-hover:text-purple-400" />
                          <div>
                            <p className="text-sm">{item.label}</p>
                            <p className="text-xs text-gray-600 group-hover:text-gray-500">{item.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Builder Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/studio')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              
              <button
                onClick={() => setShowLibrary(!showLibrary)}
                className={`p-2 rounded-lg transition-colors ${showLibrary ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-gray-800 text-gray-400'}`}
              >
                <Layers className="w-5 h-5" />
              </button>
              
              <div className="w-px h-6 bg-gray-700 mx-2" />
              
              <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50">
                <Undo className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50">
                <Redo className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Page Title */}
            <input
              type="text"
              value={pageSettings.title}
              onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
              className="bg-transparent text-white font-medium text-center focus:outline-none focus:bg-gray-800 px-4 py-1 rounded-lg"
            />

            <div className="flex items-center gap-2">
              {/* Device Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'desktop', icon: Monitor },
                  { id: 'tablet', icon: Tablet },
                  { id: 'mobile', icon: Smartphone }
                ].map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setDeviceView(device.id)}
                    className={`p-1.5 rounded transition-colors ${deviceView === device.id ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <device.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              
              <div className="w-px h-6 bg-gray-700 mx-2" />
              
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`p-2 rounded-lg transition-colors ${previewMode ? 'bg-purple-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
              >
                {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-gray-800 text-gray-400'}`}
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <div className="w-px h-6 bg-gray-700 mx-2" />
              
              <button
                onClick={saveDraft}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              
              <button
                onClick={publish}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                <Globe className="w-4 h-4" />
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto p-8" style={{ backgroundColor: '#1a1a2e' }}>
            <div 
              className={`mx-auto transition-all duration-300 ${getDeviceClass()}`}
              style={{ 
                backgroundColor: pageSettings.backgroundColor,
                fontFamily: pageSettings.fontFamily,
                minHeight: '100vh'
              }}
            >
              {components.length === 0 ? (
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl">
                  <div className="text-center">
                    <Plus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Start building your page</p>
                    <p className="text-gray-600 text-sm">Drag components from the left panel or click to add</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {components.map((component) => (
                    <ComponentRenderer
                      key={component.id}
                      component={component}
                      isSelected={selectedId === component.id}
                      onSelect={setSelectedId}
                      onUpdate={updateComponent}
                      onDelete={() => deleteComponent(component.id)}
                      onDuplicate={() => duplicateComponent(component.id)}
                      onMove={(dir) => moveComponent(component.id, dir)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        {showSettings && !previewMode && (
          <div className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">
                {selectedComponent ? 'Component Settings' : 'Page Settings'}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {selectedComponent ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 capitalize">{selectedComponent.type}</p>
                  
                  {/* Component-specific settings would go here */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Styles</label>
                    <div className="space-y-2">
                      {Object.entries(selectedComponent.style || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">{key}</span>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateComponent({
                              ...selectedComponent,
                              style: { ...selectedComponent.style, [key]: e.target.value }
                            })}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Page Title</label>
                    <input
                      type="text"
                      value={pageSettings.title}
                      onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">URL Slug</label>
                    <input
                      type="text"
                      value={pageSettings.slug}
                      onChange={(e) => setPageSettings({ ...pageSettings, slug: e.target.value })}
                      placeholder="my-awesome-page"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <textarea
                      value={pageSettings.description}
                      onChange={(e) => setPageSettings({ ...pageSettings, description: e.target.value })}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={pageSettings.backgroundColor}
                        onChange={(e) => setPageSettings({ ...pageSettings, backgroundColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={pageSettings.backgroundColor}
                        onChange={(e) => setPageSettings({ ...pageSettings, backgroundColor: e.target.value })}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
