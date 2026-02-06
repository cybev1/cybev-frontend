// ============================================
// FILE: src/pages/studio/campaigns/editor.jsx
// CYBEV Email Builder - Klaviyo Quality
// VERSION: 3.0.0 - Full Drag & Drop Editor
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Type, Image, Square, Columns, Minus, MousePointer, Link2,
  Video, Share2, Calendar, MapPin, Code, List, Quote, Gift,
  ArrowLeft, Save, Eye, Send, Undo, Redo, Smartphone, Monitor,
  Tablet, Settings, Palette, Layout, Plus, Trash2, Copy, Move,
  ChevronDown, ChevronUp, X, Check, Loader2, GripVertical,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  FileText, Mail, Sparkles, Timer, ShoppingCart, Star, Users,
  Zap, Clock, Target, BarChart3, Hash, Heart, Globe
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// ==========================================
// BLOCK TYPES
// ==========================================

const BLOCK_TYPES = [
  { type: 'header', label: 'Header', icon: Layout, category: 'structure', description: 'Logo and navigation' },
  { type: 'text', label: 'Text', icon: Type, category: 'content', description: 'Paragraphs and headings' },
  { type: 'image', label: 'Image', icon: Image, category: 'content', description: 'Single image' },
  { type: 'button', label: 'Button', icon: MousePointer, category: 'content', description: 'Call to action' },
  { type: 'divider', label: 'Divider', icon: Minus, category: 'structure', description: 'Horizontal line' },
  { type: 'spacer', label: 'Spacer', icon: Square, category: 'structure', description: 'Empty space' },
  { type: 'columns', label: 'Columns', icon: Columns, category: 'layout', description: '2-4 column layout' },
  { type: 'social', label: 'Social', icon: Share2, category: 'content', description: 'Social media icons' },
  { type: 'video', label: 'Video', icon: Video, category: 'content', description: 'Video thumbnail' },
  { type: 'html', label: 'Custom HTML', icon: Code, category: 'advanced', description: 'Raw HTML code' },
  { type: 'footer', label: 'Footer', icon: FileText, category: 'structure', description: 'Unsubscribe & info' },
  { type: 'product', label: 'Product', icon: ShoppingCart, category: 'ecommerce', description: 'Product card' },
  { type: 'countdown', label: 'Countdown', icon: Timer, category: 'advanced', description: 'Timer to date' },
  { type: 'menu', label: 'Menu', icon: List, category: 'structure', description: 'Navigation links' },
  { type: 'quote', label: 'Quote', icon: Quote, category: 'content', description: 'Testimonial quote' },
  { type: 'coupon', label: 'Coupon', icon: Gift, category: 'ecommerce', description: 'Discount code' },
];

const CATEGORIES = [
  { id: 'content', label: 'Content', icon: Type },
  { id: 'structure', label: 'Structure', icon: Layout },
  { id: 'layout', label: 'Layout', icon: Columns },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'advanced', label: 'Advanced', icon: Code },
];

// ==========================================
// DEFAULT BLOCK DATA
// ==========================================

const getDefaultBlockData = (type) => {
  const defaults = {
    header: {
      logo: { url: '', alt: 'Logo', width: 150 },
      backgroundColor: '#ffffff',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      alignment: 'center'
    },
    text: {
      content: '<p>Click to edit this text. You can format it with bold, italic, and more.</p>',
      fontSize: 16,
      lineHeight: 1.6,
      color: '#374151',
      backgroundColor: 'transparent',
      padding: { top: 10, bottom: 10, left: 20, right: 20 },
      alignment: 'left'
    },
    image: {
      src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
      alt: 'Image description',
      link: '',
      width: '100%',
      alignment: 'center',
      padding: { top: 10, bottom: 10, left: 20, right: 20 }
    },
    button: {
      text: 'Click Here',
      link: 'https://',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      borderRadius: 8,
      padding: { top: 14, bottom: 14, left: 32, right: 32 },
      alignment: 'center',
      fullWidth: false
    },
    divider: {
      style: 'solid',
      color: '#e5e7eb',
      thickness: 1,
      width: '100%',
      padding: { top: 20, bottom: 20, left: 20, right: 20 }
    },
    spacer: {
      height: 40,
      backgroundColor: 'transparent'
    },
    columns: {
      columns: 2,
      gap: 20,
      padding: { top: 10, bottom: 10, left: 20, right: 20 },
      columnContent: [
        [{ type: 'text', data: { content: '<p>Column 1</p>', padding: { top: 0, bottom: 0, left: 0, right: 0 } } }],
        [{ type: 'text', data: { content: '<p>Column 2</p>', padding: { top: 0, bottom: 0, left: 0, right: 0 } } }]
      ]
    },
    social: {
      icons: [
        { platform: 'facebook', url: 'https://facebook.com/', color: '#1877f2' },
        { platform: 'twitter', url: 'https://twitter.com/', color: '#1da1f2' },
        { platform: 'instagram', url: 'https://instagram.com/', color: '#e4405f' },
        { platform: 'linkedin', url: 'https://linkedin.com/', color: '#0a66c2' }
      ],
      iconSize: 32,
      alignment: 'center',
      padding: { top: 20, bottom: 20, left: 20, right: 20 }
    },
    video: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=340&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=',
      playButtonColor: '#ef4444',
      padding: { top: 10, bottom: 10, left: 20, right: 20 }
    },
    html: {
      code: '<!-- Your custom HTML here -->',
      padding: { top: 10, bottom: 10, left: 20, right: 20 }
    },
    footer: {
      companyName: 'Your Company',
      address: '123 Main St, City, State 12345',
      showUnsubscribe: true,
      showPreferences: true,
      backgroundColor: '#f9fafb',
      textColor: '#6b7280',
      fontSize: 12,
      padding: { top: 30, bottom: 30, left: 20, right: 20 }
    },
    product: {
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      title: 'Product Name',
      price: '$99.00',
      originalPrice: '$149.00',
      description: 'Short product description goes here.',
      buttonText: 'Shop Now',
      buttonUrl: 'https://',
      buttonColor: '#7c3aed',
      padding: { top: 20, bottom: 20, left: 20, right: 20 }
    },
    countdown: {
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Sale ends in:',
      backgroundColor: '#fef3c7',
      numberColor: '#92400e',
      labelColor: '#78350f',
      padding: { top: 20, bottom: 20, left: 20, right: 20 }
    },
    menu: {
      items: [
        { label: 'Home', url: 'https://' },
        { label: 'Shop', url: 'https://' },
        { label: 'About', url: 'https://' },
        { label: 'Contact', url: 'https://' }
      ],
      alignment: 'center',
      color: '#374151',
      fontSize: 14,
      separator: '|',
      padding: { top: 15, bottom: 15, left: 20, right: 20 }
    },
    quote: {
      text: '"This product changed my life! Highly recommend to everyone."',
      author: 'John Doe',
      authorTitle: 'Happy Customer',
      avatar: '',
      backgroundColor: '#f3f4f6',
      textColor: '#1f2937',
      fontSize: 18,
      fontStyle: 'italic',
      padding: { top: 30, bottom: 30, left: 40, right: 40 }
    },
    coupon: {
      code: 'SAVE20',
      title: 'Special Offer!',
      description: 'Use this code for 20% off your order',
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      codeColor: '#92400e',
      padding: { top: 20, bottom: 20, left: 20, right: 20 }
    }
  };
  return defaults[type] || {};
};

// ==========================================
// BLOCK RENDERER
// ==========================================

const BlockRenderer = ({ block, isPreview = false }) => {
  const { type, data } = block;
  
  const style = {
    padding: data.padding ? `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px` : undefined,
    backgroundColor: data.backgroundColor || 'transparent',
    textAlign: data.alignment || 'left'
  };
  
  switch (type) {
    case 'header':
      return (
        <div style={style}>
          {data.logo?.url ? (
            <img src={data.logo.url} alt={data.logo.alt} style={{ maxWidth: data.logo.width || 150 }} />
          ) : (
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Your Logo</div>
          )}
        </div>
      );
      
    case 'text':
      return (
        <div 
          style={{ ...style, fontSize: data.fontSize, lineHeight: data.lineHeight, color: data.color }}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      );
      
    case 'image':
      return (
        <div style={style}>
          {data.link ? (
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              <img src={data.src} alt={data.alt} style={{ maxWidth: '100%', width: data.width, display: 'block', margin: data.alignment === 'center' ? '0 auto' : undefined }} />
            </a>
          ) : (
            <img src={data.src} alt={data.alt} style={{ maxWidth: '100%', width: data.width, display: 'block', margin: data.alignment === 'center' ? '0 auto' : undefined }} />
          )}
        </div>
      );
      
    case 'button':
      return (
        <div style={{ ...style, padding: style.padding }}>
          <a
            href={data.link}
            style={{
              display: data.fullWidth ? 'block' : 'inline-block',
              backgroundColor: data.backgroundColor,
              color: data.textColor,
              fontSize: data.fontSize,
              fontWeight: data.fontWeight,
              padding: `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`,
              borderRadius: data.borderRadius,
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            {data.text}
          </a>
        </div>
      );
      
    case 'divider':
      return (
        <div style={style}>
          <hr style={{ border: 'none', borderTop: `${data.thickness}px ${data.style} ${data.color}`, width: data.width, margin: '0 auto' }} />
        </div>
      );
      
    case 'spacer':
      return <div style={{ height: data.height, backgroundColor: data.backgroundColor }} />;
      
    case 'columns':
      return (
        <div style={style}>
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {data.columnContent?.map((col, i) => (
                  <td key={i} style={{ width: `${100 / data.columns}%`, verticalAlign: 'top', padding: data.gap / 2 }}>
                    {col.map((b, j) => <BlockRenderer key={j} block={b} isPreview={isPreview} />)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
      
    case 'social':
      const socialIcons = { facebook: '📘', twitter: '🐦', instagram: '📷', linkedin: '💼', youtube: '▶️', tiktok: '🎵' };
      return (
        <div style={style}>
          <div style={{ display: 'flex', justifyContent: data.alignment, gap: 12 }}>
            {data.icons?.map((icon, i) => (
              <a key={i} href={icon.url} style={{ width: data.iconSize, height: data.iconSize, backgroundColor: icon.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', fontSize: data.iconSize * 0.5 }}>
                {socialIcons[icon.platform] || '🔗'}
              </a>
            ))}
          </div>
        </div>
      );
      
    case 'video':
      return (
        <div style={style}>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <img src={data.thumbnailUrl} alt="Video thumbnail" style={{ width: '100%', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 64, height: 64, backgroundColor: data.playButtonColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 24, marginLeft: 4 }}>▶</span>
              </div>
            </div>
          </div>
        </div>
      );
      
    case 'footer':
      return (
        <div style={{ ...style, fontSize: data.fontSize, color: data.textColor, textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px' }}>{data.companyName}</p>
          <p style={{ margin: '0 0 8px' }}>{data.address}</p>
          {data.showUnsubscribe && <p style={{ margin: '8px 0' }}><a href="{{unsubscribe}}" style={{ color: data.textColor }}>Unsubscribe</a></p>}
        </div>
      );
      
    case 'product':
      return (
        <div style={style}>
          <div style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={data.image} alt={data.title} style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: 16 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{data.title}</h3>
              <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: 14 }}>{data.description}</p>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>{data.price}</span>
                {data.originalPrice && <span style={{ marginLeft: 8, textDecoration: 'line-through', color: '#9ca3af' }}>{data.originalPrice}</span>}
              </div>
              <a href={data.buttonUrl} style={{ display: 'block', backgroundColor: data.buttonColor, color: '#fff', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' }}>{data.buttonText}</a>
            </div>
          </div>
        </div>
      );
      
    case 'countdown':
      return (
        <div style={{ ...style, backgroundColor: data.backgroundColor, borderRadius: 8 }}>
          <p style={{ textAlign: 'center', margin: '0 0 12px', color: data.labelColor, fontWeight: 'bold' }}>{data.title}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            {['Days', 'Hours', 'Mins', 'Secs'].map((label, i) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: data.numberColor }}>{['07', '23', '59', '59'][i]}</div>
                <div style={{ fontSize: 12, color: data.labelColor }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      );
      
    case 'menu':
      return (
        <div style={{ ...style, textAlign: data.alignment }}>
          {data.items?.map((item, i) => (
            <span key={i}>
              <a href={item.url} style={{ color: data.color, textDecoration: 'none', fontSize: data.fontSize }}>{item.label}</a>
              {i < data.items.length - 1 && <span style={{ margin: '0 8px', color: data.color }}>{data.separator}</span>}
            </span>
          ))}
        </div>
      );
      
    case 'quote':
      return (
        <div style={{ ...style, backgroundColor: data.backgroundColor, borderRadius: 8 }}>
          <p style={{ fontSize: data.fontSize, fontStyle: data.fontStyle, color: data.textColor, margin: '0 0 12px' }}>{data.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {data.avatar && <img src={data.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />}
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color: data.textColor }}>{data.author}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{data.authorTitle}</p>
            </div>
          </div>
        </div>
      );
      
    case 'coupon':
      return (
        <div style={{ ...style, backgroundColor: data.backgroundColor, border: `2px dashed ${data.borderColor}`, borderRadius: 8, textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 'bold', fontSize: 18 }}>{data.title}</p>
          <p style={{ margin: '0 0 12px', color: '#6b7280' }}>{data.description}</p>
          <div style={{ display: 'inline-block', backgroundColor: '#fff', padding: '8px 24px', borderRadius: 4, fontWeight: 'bold', fontSize: 24, letterSpacing: 2, color: data.codeColor }}>{data.code}</div>
        </div>
      );
      
    case 'html':
      return <div style={style} dangerouslySetInnerHTML={{ __html: data.code }} />;
      
    default:
      return <div style={style}>Unknown block type: {type}</div>;
  }
};

// ==========================================
// MAIN EDITOR COMPONENT
// ==========================================

export default function EmailEditor() {
  const router = useRouter();
  const { id, templateId } = router.query;
  
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showBlockPanel, setShowBlockPanel] = useState(true);
  const [activeCategory, setActiveCategory] = useState('content');
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Save as Template
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('General');
  const [savingTemplate, setSavingTemplate] = useState(false);
  
  const [emailSettings, setEmailSettings] = useState({
    backgroundColor: '#f3f4f6',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif'
  });
  
  const editorRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      if (id && id !== 'new') {
        fetchCampaign(id);
      } else if (templateId) {
        fetchTemplate(templateId);
      } else {
        // New campaign - add default blocks
        setBlocks([
          { id: `block_${Date.now()}_1`, type: 'header', data: getDefaultBlockData('header') },
          { id: `block_${Date.now()}_2`, type: 'text', data: { ...getDefaultBlockData('text'), content: '<h1 style="margin:0;font-size:28px;">Welcome to our newsletter!</h1>' } },
          { id: `block_${Date.now()}_3`, type: 'image', data: getDefaultBlockData('image') },
          { id: `block_${Date.now()}_4`, type: 'text', data: getDefaultBlockData('text') },
          { id: `block_${Date.now()}_5`, type: 'button', data: getDefaultBlockData('button') },
          { id: `block_${Date.now()}_6`, type: 'footer', data: getDefaultBlockData('footer') }
        ]);
        setLoading(false);
      }
    }
  }, [router.isReady, id, templateId]);

  const getAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

  const fetchCampaign = async (campaignId) => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/${campaignId}`, getAuth());
      const data = await res.json();
      if (data.campaign) {
        setCampaign(data.campaign);
        setBlocks(data.campaign.content?.blocks || []);
      }
    } catch (err) {
      console.error('Failed to fetch campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplate = async (tplId) => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/templates/${tplId}`, getAuth());
      const data = await res.json();
      if (data.template) {
        setBlocks(data.template.content?.blocks || []);
      }
    } catch (err) {
      console.error('Failed to fetch template:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = useCallback((newBlocks) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newBlocks));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(JSON.parse(history[historyIndex - 1]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(JSON.parse(history[historyIndex + 1]));
    }
  };

  const addBlock = (type, index = null) => {
    const newBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: getDefaultBlockData(type)
    };
    
    const newBlocks = [...blocks];
    if (index !== null) {
      newBlocks.splice(index, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (blockId, newData) => {
    const newBlocks = blocks.map(b => 
      b.id === blockId ? { ...b, data: { ...b.data, ...newData } } : b
    );
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
  };

  const deleteBlock = (blockId) => {
    const newBlocks = blocks.filter(b => b.id !== blockId);
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const duplicateBlock = (blockId) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;
    
    const original = blocks[blockIndex];
    const copy = {
      ...JSON.parse(JSON.stringify(original)),
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex + 1, 0, copy);
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
  };

  const moveBlock = (blockId, direction) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
  };

  const generateHTML = () => {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: ${emailSettings.backgroundColor}; font-family: ${emailSettings.fontFamily}; }
    .email-container { max-width: ${emailSettings.contentWidth}px; margin: 0 auto; background-color: #ffffff; }
    img { max-width: 100%; height: auto; }
    a { color: inherit; }
  </style>
</head>
<body>
  <div class="email-container">`;
    
    blocks.forEach(block => {
      html += `<div class="email-block" data-type="${block.type}">`;
      // Generate block HTML (simplified - in production, use server-side rendering)
      html += `<!-- Block: ${block.type} -->`;
      html += `</div>`;
    });
    
    html += `</div></body></html>`;
    return html;
  };

  const saveCampaign = async () => {
    setSaving(true);
    try {
      const html = generateHTML();
      const endpoint = campaign?._id 
        ? `${API_URL}/api/campaigns-enhanced/${campaign._id}`
        : `${API_URL}/api/campaigns-enhanced`;
      
      const method = campaign?._id ? 'PUT' : 'POST';
      
      const res = await fetch(endpoint, {
        method,
        ...getAuth(),
        body: JSON.stringify({
          name: campaign?.name || 'Untitled Campaign',
          subject: campaign?.subject || 'Newsletter',
          content: {
            blocks,
            html,
            json: { blocks, settings: emailSettings }
          }
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        setCampaign(data.campaign);
        alert('Saved successfully!');
        if (!campaign?._id) {
          router.replace(`/studio/campaigns/editor?id=${data.campaign._id}`, undefined, { shallow: true });
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const saveAsTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    
    setSavingTemplate(true);
    try {
      const html = generateHTML();
      
      const res = await fetch(`${API_URL}/api/campaigns-enhanced/templates`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({
          name: templateName.trim(),
          category: templateCategory,
          html,
          designJson: { blocks, settings: emailSettings }
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        alert('Template saved successfully!');
        setShowSaveTemplate(false);
        setTemplateName('');
      } else {
        alert(data.error || 'Failed to save template');
      }
    } catch (err) {
      console.error('Save template error:', err);
      alert('Failed to save template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Email Editor - CYBEV Studio</title>
      </Head>

      <div className="h-screen flex flex-col bg-gray-100">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/studio/campaigns')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <input
                type="text"
                value={campaign?.name || 'Untitled Campaign'}
                onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                className="font-semibold text-lg border-none focus:ring-0 p-0 bg-transparent"
                placeholder="Campaign name"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
              <Undo className="w-5 h-5" />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
              <Redo className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            {/* Preview Mode */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-md ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}>
                <Monitor className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded-md ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}>
                <Tablet className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-md ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}>
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            {/* Actions */}
            <button
              onClick={() => setShowSaveTemplate(true)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Layout className="w-4 h-4" />
              Save as Template
            </button>
            <button
              onClick={saveCampaign}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>

        {/* Save as Template Modal */}
        {showSaveTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Save as Template</h3>
                <button onClick={() => setShowSaveTemplate(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="My Email Template"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="General">General</option>
                    <option value="welcome">Welcome</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="promotional">Promotional</option>
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                    <option value="ecommerce">E-commerce</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowSaveTemplate(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAsTemplate}
                  disabled={savingTemplate || !templateName.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingTemplate && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Block Library */}
          {showBlockPanel && (
            <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Content Blocks</h3>
                <p className="text-sm text-gray-500">Drag blocks to add them</p>
              </div>
              
              {/* Categories */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
                      activeCategory === cat.id 
                        ? 'text-purple-600 border-b-2 border-purple-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Blocks Grid */}
              <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_TYPES.filter(b => b.category === activeCategory).map(blockType => {
                    const Icon = blockType.icon;
                    return (
                      <button
                        key={blockType.type}
                        onClick={() => addBlock(blockType.type)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('blockType', blockType.type);
                          setDraggedBlock(blockType.type);
                        }}
                        onDragEnd={() => setDraggedBlock(null)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition text-left group"
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 mb-1" />
                        <div className="text-sm font-medium text-gray-700">{blockType.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 overflow-auto p-8" style={{ backgroundColor: emailSettings.backgroundColor }}>
            <div
              ref={editorRef}
              className="mx-auto bg-white shadow-lg"
              style={{ 
                width: previewMode === 'mobile' ? 375 : previewMode === 'tablet' ? 768 : emailSettings.contentWidth,
                minHeight: 600,
                transition: 'width 0.3s'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const blockType = e.dataTransfer.getData('blockType');
                if (blockType) addBlock(blockType);
              }}
            >
              {blocks.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg m-4">
                  <Plus className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium">Drag blocks here to start</p>
                  <p className="text-sm">Or click a block from the left panel</p>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`relative group ${selectedBlockId === block.id ? 'ring-2 ring-purple-500 ring-inset' : ''}`}
                  >
                    {/* Block Actions */}
                    <div className={`absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition ${selectedBlockId === block.id ? 'opacity-100' : ''}`}>
                      <button onClick={() => moveBlock(block.id, 'up')} className="p-1.5 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveBlock(block.id, 'down')} className="p-1.5 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => duplicateBlock(block.id)} className="p-1.5 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteBlock(block.id)} className="p-1.5 bg-white border border-gray-200 rounded shadow-sm hover:bg-red-50 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Block Content */}
                    <BlockRenderer block={block} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Block Settings */}
          {selectedBlock && (
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 capitalize">{selectedBlock.type} Settings</h3>
                <button onClick={() => setSelectedBlockId(null)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Dynamic settings based on block type */}
                {selectedBlock.type === 'text' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={selectedBlock.data.content?.replace(/<[^>]*>/g, '') || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { content: `<p>${e.target.value}</p>` })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                      <input
                        type="number"
                        value={selectedBlock.data.fontSize || 16}
                        onChange={(e) => updateBlock(selectedBlock.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                      <input
                        type="color"
                        value={selectedBlock.data.color || '#374151'}
                        onChange={(e) => updateBlock(selectedBlock.id, { color: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </>
                )}
                
                {selectedBlock.type === 'button' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={selectedBlock.data.text || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                      <input
                        type="text"
                        value={selectedBlock.data.link || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { link: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                      <input
                        type="color"
                        value={selectedBlock.data.backgroundColor || '#7c3aed'}
                        onChange={(e) => updateBlock(selectedBlock.id, { backgroundColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={selectedBlock.data.borderRadius || 8}
                        onChange={(e) => updateBlock(selectedBlock.id, { borderRadius: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
                
                {selectedBlock.type === 'image' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={selectedBlock.data.src || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { src: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={selectedBlock.data.alt || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { alt: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                      <input
                        type="text"
                        value={selectedBlock.data.link || ''}
                        onChange={(e) => updateBlock(selectedBlock.id, { link: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}

                {/* Padding Settings (common) */}
                <div className="border-t pt-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['top', 'right', 'bottom', 'left'].map(side => (
                      <div key={side}>
                        <label className="text-xs text-gray-500 capitalize">{side}</label>
                        <input
                          type="number"
                          value={selectedBlock.data.padding?.[side] || 0}
                          onChange={(e) => updateBlock(selectedBlock.id, { 
                            padding: { ...selectedBlock.data.padding, [side]: parseInt(e.target.value) }
                          })}
                          className="w-full p-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Alignment (common) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
                  <div className="flex gap-1">
                    {['left', 'center', 'right'].map(align => (
                      <button
                        key={align}
                        onClick={() => updateBlock(selectedBlock.id, { alignment: align })}
                        className={`flex-1 p-2 border rounded ${selectedBlock.data.alignment === align ? 'bg-purple-100 border-purple-300' : 'border-gray-300 hover:bg-gray-50'}`}
                      >
                        {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                        {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                        {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
