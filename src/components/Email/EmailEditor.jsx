// ============================================
// FILE: components/Email/EmailEditor.jsx
// CYBEV Professional Drag-Drop Email Builder
// VERSION: 2.0.0 - Mailchimp/Beehiiv Quality
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Type, Image, Square, Columns, Minus, Link, Share2, Video,
  Trash2, Copy, ChevronUp, ChevronDown, Settings, Eye, Code,
  Smartphone, Monitor, Undo, Redo, Save, Send, Layout, Grid,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, List,
  Plus, Move, Palette, X, Check, Upload, Sparkles, GripVertical,
  Heading1, Heading2, FileText, ImageIcon, Button, SeparatorHorizontal,
  LayoutGrid, Users, Play, Code2, Building, FileCode
} from 'lucide-react';

// ==========================================
// BLOCK TYPE DEFINITIONS
// ==========================================

const BLOCK_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  IMAGE: 'image',
  BUTTON: 'button',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  COLUMNS: 'columns',
  SOCIAL: 'social',
  VIDEO: 'video',
  HTML: 'html',
  LOGO: 'logo',
  FOOTER: 'footer'
};

const BLOCK_LIBRARY = [
  { type: BLOCK_TYPES.HEADING, icon: Heading1, label: 'Heading', category: 'content', description: 'Add a title or header' },
  { type: BLOCK_TYPES.TEXT, icon: FileText, label: 'Text Block', category: 'content', description: 'Rich text paragraph' },
  { type: BLOCK_TYPES.IMAGE, icon: ImageIcon, label: 'Image', category: 'media', description: 'Upload or link an image' },
  { type: BLOCK_TYPES.BUTTON, icon: Square, label: 'Button', category: 'content', description: 'Call-to-action button' },
  { type: BLOCK_TYPES.COLUMNS, icon: LayoutGrid, label: '2 Columns', category: 'layout', description: 'Side-by-side layout' },
  { type: BLOCK_TYPES.DIVIDER, icon: SeparatorHorizontal, label: 'Divider', category: 'layout', description: 'Horizontal line' },
  { type: BLOCK_TYPES.SPACER, icon: Layout, label: 'Spacer', category: 'layout', description: 'Add vertical space' },
  { type: BLOCK_TYPES.SOCIAL, icon: Users, label: 'Social Icons', category: 'content', description: 'Social media links' },
  { type: BLOCK_TYPES.VIDEO, icon: Play, label: 'Video', category: 'media', description: 'Embed video thumbnail' },
  { type: BLOCK_TYPES.HTML, icon: Code2, label: 'Custom HTML', category: 'advanced', description: 'Raw HTML code' },
  { type: BLOCK_TYPES.LOGO, icon: Building, label: 'Logo', category: 'content', description: 'Brand logo image' },
  { type: BLOCK_TYPES.FOOTER, icon: FileCode, label: 'Footer', category: 'content', description: 'Email footer with links' }
];

const DEFAULT_CONTENT = {
  [BLOCK_TYPES.HEADING]: { text: 'Your Heading Here', level: 'h1', align: 'center' },
  [BLOCK_TYPES.TEXT]: { html: '<p>Click to edit this text. You can add <strong>bold</strong>, <em>italic</em>, and more formatting.</p>' },
  [BLOCK_TYPES.IMAGE]: { src: '', alt: 'Image', width: '100%', align: 'center', link: '' },
  [BLOCK_TYPES.BUTTON]: { text: 'Click Here', link: '#', backgroundColor: '#6366f1', textColor: '#ffffff', align: 'center', borderRadius: '8px', padding: '12px 24px' },
  [BLOCK_TYPES.DIVIDER]: { color: '#e5e7eb', thickness: '1px', width: '100%', style: 'solid' },
  [BLOCK_TYPES.SPACER]: { height: '24px' },
  [BLOCK_TYPES.COLUMNS]: { columns: [{ blocks: [] }, { blocks: [] }], gap: '16px' },
  [BLOCK_TYPES.SOCIAL]: { icons: [
    { platform: 'facebook', url: '#', color: '#1877F2' },
    { platform: 'twitter', url: '#', color: '#1DA1F2' },
    { platform: 'instagram', url: '#', color: '#E4405F' },
    { platform: 'linkedin', url: '#', color: '#0A66C2' }
  ], align: 'center', size: '32px' },
  [BLOCK_TYPES.VIDEO]: { thumbnail: '', videoUrl: '', platform: 'youtube' },
  [BLOCK_TYPES.HTML]: { code: '<!-- Your custom HTML here -->' },
  [BLOCK_TYPES.LOGO]: { src: '', alt: 'Logo', width: '150px', align: 'center', link: '' },
  [BLOCK_TYPES.FOOTER]: { 
    companyName: 'CYBEV', 
    address: '123 Main St, City, Country',
    unsubscribeText: 'Unsubscribe',
    showSocial: true,
    links: [
      { text: 'Privacy Policy', url: '#' },
      { text: 'Terms of Service', url: '#' }
    ]
  }
};

const DEFAULT_STYLES = {
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'Arial, sans-serif',
  padding: '16px',
  margin: '0',
  borderRadius: '0'
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// ==========================================
// BLOCK RENDERER COMPONENT
// ==========================================

const BlockRenderer = ({ block, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast, viewMode }) => {
  const renderContent = () => {
    const { type, content, styles } = block;
    
    switch (type) {
      case BLOCK_TYPES.HEADING:
        const HeadingTag = content.level || 'h1';
        const headingSizes = { h1: '32px', h2: '24px', h3: '20px', h4: '18px' };
        return (
          <HeadingTag 
            style={{ 
              fontSize: headingSizes[content.level], 
              fontWeight: 'bold',
              textAlign: content.align || 'left',
              margin: 0,
              color: styles?.textColor || '#1f2937'
            }}
          >
            {content.text}
          </HeadingTag>
        );
      
      case BLOCK_TYPES.TEXT:
        return (
          <div 
            dangerouslySetInnerHTML={{ __html: content.html }}
            style={{ 
              color: styles?.textColor || '#4b5563',
              lineHeight: '1.6'
            }}
          />
        );
      
      case BLOCK_TYPES.IMAGE:
        return (
          <div style={{ textAlign: content.align || 'center' }}>
            {content.src ? (
              <img 
                src={content.src} 
                alt={content.alt} 
                style={{ 
                  maxWidth: content.width || '100%',
                  height: 'auto',
                  borderRadius: styles?.borderRadius || '8px'
                }}
              />
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-500">Click to add image</span>
              </div>
            )}
          </div>
        );
      
      case BLOCK_TYPES.BUTTON:
        return (
          <div style={{ textAlign: content.align || 'center' }}>
            <a
              href={content.link || '#'}
              style={{
                display: 'inline-block',
                backgroundColor: content.backgroundColor || '#6366f1',
                color: content.textColor || '#ffffff',
                padding: content.padding || '12px 24px',
                borderRadius: content.borderRadius || '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              {content.text || 'Click Here'}
            </a>
          </div>
        );
      
      case BLOCK_TYPES.DIVIDER:
        return (
          <hr style={{
            border: 'none',
            borderTop: `${content.thickness || '1px'} ${content.style || 'solid'} ${content.color || '#e5e7eb'}`,
            width: content.width || '100%',
            margin: '0 auto'
          }} />
        );
      
      case BLOCK_TYPES.SPACER:
        return <div style={{ height: content.height || '24px' }} />;
      
      case BLOCK_TYPES.SOCIAL:
        const socialIcons = {
          facebook: '📘',
          twitter: '🐦',
          instagram: '📷',
          linkedin: '💼',
          youtube: '▶️',
          tiktok: '🎵'
        };
        return (
          <div style={{ textAlign: content.align || 'center' }}>
            {content.icons?.map((icon, i) => (
              <a
                key={i}
                href={icon.url || '#'}
                style={{
                  display: 'inline-block',
                  width: content.size || '32px',
                  height: content.size || '32px',
                  margin: '0 8px',
                  fontSize: content.size || '24px',
                  textDecoration: 'none'
                }}
              >
                {socialIcons[icon.platform] || '🔗'}
              </a>
            ))}
          </div>
        );
      
      case BLOCK_TYPES.VIDEO:
        return (
          <div style={{ textAlign: 'center' }}>
            {content.thumbnail ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src={content.thumbnail} 
                  alt="Video thumbnail"
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                <Play className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-500">Add video URL</span>
              </div>
            )}
          </div>
        );
      
      case BLOCK_TYPES.HTML:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <pre className="text-xs text-gray-600 overflow-auto">
              <code>{content.code}</code>
            </pre>
          </div>
        );
      
      case BLOCK_TYPES.LOGO:
        return (
          <div style={{ textAlign: content.align || 'center' }}>
            {content.src ? (
              <img 
                src={content.src} 
                alt={content.alt} 
                style={{ width: content.width || '150px', height: 'auto' }}
              />
            ) : (
              <div className="inline-block bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-8 py-4">
                <Building className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <span className="text-gray-500 text-sm">Add logo</span>
              </div>
            )}
          </div>
        );
      
      case BLOCK_TYPES.FOOTER:
        return (
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            <p style={{ margin: '0 0 8px 0' }}>{content.companyName}</p>
            <p style={{ margin: '0 0 8px 0' }}>{content.address}</p>
            {content.links?.length > 0 && (
              <p style={{ margin: '0 0 8px 0' }}>
                {content.links.map((link, i) => (
                  <span key={i}>
                    {i > 0 && ' | '}
                    <a href={link.url} style={{ color: '#6366f1' }}>{link.text}</a>
                  </span>
                ))}
              </p>
            )}
            <p style={{ margin: '8px 0 0 0' }}>
              <a href="{{unsubscribe_url}}" style={{ color: '#6366f1' }}>{content.unsubscribeText}</a>
            </p>
          </div>
        );
      
      case BLOCK_TYPES.COLUMNS:
        return (
          <div style={{ display: 'flex', gap: content.gap || '16px' }}>
            {content.columns?.map((col, i) => (
              <div key={i} style={{ flex: 1, minWidth: 0 }}>
                {col.blocks?.length > 0 ? (
                  col.blocks.map(b => (
                    <div key={b.id} className="mb-2">
                      <BlockRenderer 
                        block={b} 
                        viewMode={true}
                        isSelected={false}
                        onSelect={() => {}}
                        onUpdate={() => {}}
                        onDelete={() => {}}
                        onDuplicate={() => {}}
                        onMoveUp={() => {}}
                        onMoveDown={() => {}}
                        isFirst={true}
                        isLast={true}
                      />
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded p-4 text-center text-gray-400 text-sm">
                    Column {i + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      default:
        return <div className="text-gray-400">Unknown block type: {type}</div>;
    }
  };
  
  if (viewMode) {
    return (
      <div style={{ 
        padding: block.styles?.padding || '16px',
        backgroundColor: block.styles?.backgroundColor || 'transparent',
        borderRadius: block.styles?.borderRadius || '0'
      }}>
        {renderContent()}
      </div>
    );
  }
  
  return (
    <div 
      className={`relative group border-2 rounded-lg transition-all cursor-pointer ${
        isSelected 
          ? 'border-purple-500 bg-purple-50/50' 
          : 'border-transparent hover:border-gray-300 hover:bg-gray-50/50'
      }`}
      onClick={() => onSelect(block.id)}
    >
      {/* Block Controls */}
      <div className={`absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <button 
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={isFirst}
          className="p-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-30"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="p-1 bg-white border rounded cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={isLast}
          className="p-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-30"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      {/* Block Actions */}
      <div className={`absolute -right-2 -top-2 flex gap-1 transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <button 
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="p-1.5 bg-white border rounded-full shadow-sm hover:bg-gray-100"
          title="Duplicate"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 bg-white border rounded-full shadow-sm hover:bg-red-100 hover:border-red-300 hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Block Content */}
      <div style={{ 
        padding: block.styles?.padding || '16px',
        backgroundColor: block.styles?.backgroundColor || 'transparent',
        borderRadius: block.styles?.borderRadius || '0'
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

// ==========================================
// BLOCK SETTINGS PANEL
// ==========================================

const BlockSettingsPanel = ({ block, onUpdate, onClose }) => {
  if (!block) return null;
  
  const updateContent = (key, value) => {
    onUpdate({
      ...block,
      content: { ...block.content, [key]: value }
    });
  };
  
  const updateStyles = (key, value) => {
    onUpdate({
      ...block,
      styles: { ...block.styles, [key]: value }
    });
  };
  
  const renderSettings = () => {
    switch (block.type) {
      case BLOCK_TYPES.HEADING:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Heading Text</span>
                <input
                  type="text"
                  value={block.content.text}
                  onChange={(e) => updateContent('text', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Heading Level</span>
                <select
                  value={block.content.level}
                  onChange={(e) => updateContent('level', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="h1">H1 - Large</option>
                  <option value="h2">H2 - Medium</option>
                  <option value="h3">H3 - Small</option>
                  <option value="h4">H4 - Extra Small</option>
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Alignment</span>
                <div className="mt-1 flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateContent('align', align)}
                      className={`flex-1 p-2 rounded border ${
                        block.content.align === align 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                      {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                    </button>
                  ))}
                </div>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Text Color</span>
                <input
                  type="color"
                  value={block.styles?.textColor || '#1f2937'}
                  onChange={(e) => updateStyles('textColor', e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300"
                />
              </label>
            </div>
          </>
        );
      
      case BLOCK_TYPES.TEXT:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Text Content</span>
                <textarea
                  value={block.content.html?.replace(/<[^>]+>/g, '') || ''}
                  onChange={(e) => updateContent('html', `<p>${e.target.value}</p>`)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter your text..."
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Text Color</span>
                <input
                  type="color"
                  value={block.styles?.textColor || '#4b5563'}
                  onChange={(e) => updateStyles('textColor', e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300"
                />
              </label>
            </div>
          </>
        );
      
      case BLOCK_TYPES.IMAGE:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Image URL</span>
                <input
                  type="url"
                  value={block.content.src}
                  onChange={(e) => updateContent('src', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </label>
              
              <div className="text-center">
                <span className="text-sm text-gray-500">or</span>
              </div>
              
              <button className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Alt Text</span>
                <input
                  type="text"
                  value={block.content.alt}
                  onChange={(e) => updateContent('alt', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Describe the image..."
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Width</span>
                <select
                  value={block.content.width}
                  onChange={(e) => updateContent('width', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="100%">Full Width</option>
                  <option value="75%">75%</option>
                  <option value="50%">50%</option>
                  <option value="300px">300px</option>
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Link (optional)</span>
                <input
                  type="url"
                  value={block.content.link}
                  onChange={(e) => updateContent('link', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="https://..."
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Alignment</span>
                <div className="mt-1 flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateContent('align', align)}
                      className={`flex-1 p-2 rounded border ${
                        block.content.align === align 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                      {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </>
        );
      
      case BLOCK_TYPES.BUTTON:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Button Text</span>
                <input
                  type="text"
                  value={block.content.text}
                  onChange={(e) => updateContent('text', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Link URL</span>
                <input
                  type="url"
                  value={block.content.link}
                  onChange={(e) => updateContent('link', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="https://..."
                />
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Background</span>
                  <input
                    type="color"
                    value={block.content.backgroundColor}
                    onChange={(e) => updateContent('backgroundColor', e.target.value)}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300"
                  />
                </label>
                
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Text Color</span>
                  <input
                    type="color"
                    value={block.content.textColor}
                    onChange={(e) => updateContent('textColor', e.target.value)}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300"
                  />
                </label>
              </div>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Border Radius</span>
                <select
                  value={block.content.borderRadius}
                  onChange={(e) => updateContent('borderRadius', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="0">Square</option>
                  <option value="4px">Slightly Rounded</option>
                  <option value="8px">Rounded</option>
                  <option value="16px">Very Rounded</option>
                  <option value="9999px">Pill</option>
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Alignment</span>
                <div className="mt-1 flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateContent('align', align)}
                      className={`flex-1 p-2 rounded border ${
                        block.content.align === align 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                      {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </>
        );
      
      case BLOCK_TYPES.DIVIDER:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Color</span>
                <input
                  type="color"
                  value={block.content.color}
                  onChange={(e) => updateContent('color', e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Thickness</span>
                <select
                  value={block.content.thickness}
                  onChange={(e) => updateContent('thickness', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="1px">Thin (1px)</option>
                  <option value="2px">Medium (2px)</option>
                  <option value="4px">Thick (4px)</option>
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Style</span>
                <select
                  value={block.content.style}
                  onChange={(e) => updateContent('style', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Width</span>
                <select
                  value={block.content.width}
                  onChange={(e) => updateContent('width', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="100%">Full Width</option>
                  <option value="75%">75%</option>
                  <option value="50%">50%</option>
                  <option value="25%">25%</option>
                </select>
              </label>
            </div>
          </>
        );
      
      case BLOCK_TYPES.SPACER:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Height</span>
                <select
                  value={block.content.height}
                  onChange={(e) => updateContent('height', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="8px">Extra Small (8px)</option>
                  <option value="16px">Small (16px)</option>
                  <option value="24px">Medium (24px)</option>
                  <option value="32px">Large (32px)</option>
                  <option value="48px">Extra Large (48px)</option>
                  <option value="64px">Huge (64px)</option>
                </select>
              </label>
            </div>
          </>
        );
      
      case BLOCK_TYPES.SOCIAL:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Icon Size</span>
                <select
                  value={block.content.size}
                  onChange={(e) => updateContent('size', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="24px">Small</option>
                  <option value="32px">Medium</option>
                  <option value="40px">Large</option>
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Alignment</span>
                <div className="mt-1 flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateContent('align', align)}
                      className={`flex-1 p-2 rounded border ${
                        block.content.align === align 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                      {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                    </button>
                  ))}
                </div>
              </label>
              
              <div className="border-t pt-3">
                <span className="text-sm font-medium text-gray-700">Social Links</span>
                {block.content.icons?.map((icon, i) => (
                  <div key={i} className="mt-2 flex gap-2 items-center">
                    <span className="text-lg">{icon.platform}</span>
                    <input
                      type="url"
                      value={icon.url}
                      onChange={(e) => {
                        const newIcons = [...block.content.icons];
                        newIcons[i] = { ...newIcons[i], url: e.target.value };
                        updateContent('icons', newIcons);
                      }}
                      className="flex-1 text-sm rounded-md border-gray-300 shadow-sm"
                      placeholder="URL..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      
      case BLOCK_TYPES.FOOTER:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Company Name</span>
                <input
                  type="text"
                  value={block.content.companyName}
                  onChange={(e) => updateContent('companyName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Address</span>
                <input
                  type="text"
                  value={block.content.address}
                  onChange={(e) => updateContent('address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Unsubscribe Text</span>
                <input
                  type="text"
                  value={block.content.unsubscribeText}
                  onChange={(e) => updateContent('unsubscribeText', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
            </div>
          </>
        );
      
      case BLOCK_TYPES.HTML:
        return (
          <>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Custom HTML</span>
                <textarea
                  value={block.content.code}
                  onChange={(e) => updateContent('code', e.target.value)}
                  rows={8}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono text-sm"
                  placeholder="<div>Your HTML here</div>"
                />
              </label>
              <p className="text-xs text-gray-500">
                ⚠️ Custom HTML is rendered as-is. Be careful with scripts.
              </p>
            </div>
          </>
        );
      
      default:
        return <p className="text-gray-500">No settings available for this block type.</p>;
    }
  };
  
  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white border-l shadow-lg overflow-y-auto z-20">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Block Settings</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          {BLOCK_LIBRARY.find(b => b.type === block.type)?.icon && (
            (() => {
              const IconComponent = BLOCK_LIBRARY.find(b => b.type === block.type).icon;
              return <IconComponent className="w-4 h-4" />;
            })()
          )}
          <span>{BLOCK_LIBRARY.find(b => b.type === block.type)?.label || block.type}</span>
        </div>
        {renderSettings()}
        
        {/* Common Styles Section */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Block Styles</h4>
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-600">Background Color</span>
              <input
                type="color"
                value={block.styles?.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                className="mt-1 block w-full h-8 rounded-md border-gray-300"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Padding</span>
              <select
                value={block.styles?.padding || '16px'}
                onChange={(e) => updateStyles('padding', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="0">None</option>
                <option value="8px">Small</option>
                <option value="16px">Medium</option>
                <option value="24px">Large</option>
                <option value="32px">Extra Large</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN EMAIL EDITOR COMPONENT
// ==========================================

export default function EmailEditor({ 
  initialBlocks = [], 
  onChange, 
  onSave,
  emailSettings = {},
  onSettingsChange
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [history, setHistory] = useState([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [draggedType, setDraggedType] = useState(null);
  const [settings, setSettings] = useState({
    backgroundColor: '#f3f4f6',
    contentWidth: '600px',
    fontFamily: 'Arial, sans-serif',
    ...emailSettings
  });
  
  const editorRef = useRef(null);
  
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  
  // Push state to history
  const pushHistory = (newBlocks) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  // Update blocks with history
  const updateBlocks = (newBlocks) => {
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    onChange?.(newBlocks);
  };
  
  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };
  
  // Add block
  const addBlock = (type, afterId = null) => {
    const newBlock = {
      id: generateId(),
      type,
      content: deepClone(DEFAULT_CONTENT[type] || {}),
      styles: deepClone(DEFAULT_STYLES)
    };
    
    let newBlocks;
    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId);
      newBlocks = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
    } else {
      newBlocks = [...blocks, newBlock];
    }
    
    updateBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  };
  
  // Update block
  const updateBlock = (updatedBlock) => {
    const newBlocks = blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b);
    updateBlocks(newBlocks);
  };
  
  // Delete block
  const deleteBlock = (id) => {
    const newBlocks = blocks.filter(b => b.id !== id);
    updateBlocks(newBlocks);
    if (selectedBlockId === id) setSelectedBlockId(null);
  };
  
  // Duplicate block
  const duplicateBlock = (id) => {
    const index = blocks.findIndex(b => b.id === id);
    const block = blocks[index];
    const newBlock = {
      ...deepClone(block),
      id: generateId()
    };
    const newBlocks = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
    updateBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  };
  
  // Move block
  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };
  
  // Generate HTML
  const generateHtml = () => {
    const renderBlockHtml = (block) => {
      const { type, content, styles } = block;
      const padding = styles?.padding || '16px';
      const bgColor = styles?.backgroundColor || 'transparent';
      
      let innerHtml = '';
      
      switch (type) {
        case BLOCK_TYPES.HEADING:
          const sizes = { h1: '32px', h2: '24px', h3: '20px', h4: '18px' };
          innerHtml = `<${content.level} style="margin:0;font-size:${sizes[content.level]};font-weight:bold;text-align:${content.align || 'left'};color:${styles?.textColor || '#1f2937'}">${content.text}</${content.level}>`;
          break;
        case BLOCK_TYPES.TEXT:
          innerHtml = `<div style="color:${styles?.textColor || '#4b5563'};line-height:1.6">${content.html}</div>`;
          break;
        case BLOCK_TYPES.IMAGE:
          const imgHtml = `<img src="${content.src}" alt="${content.alt}" style="max-width:${content.width || '100%'};height:auto;display:block;margin:0 auto;border-radius:${styles?.borderRadius || '8px'}" />`;
          innerHtml = content.link 
            ? `<a href="${content.link}" target="_blank">${imgHtml}</a>` 
            : imgHtml;
          innerHtml = `<div style="text-align:${content.align || 'center'}">${innerHtml}</div>`;
          break;
        case BLOCK_TYPES.BUTTON:
          innerHtml = `<div style="text-align:${content.align || 'center'}"><a href="${content.link || '#'}" style="display:inline-block;background:${content.backgroundColor || '#6366f1'};color:${content.textColor || '#fff'};padding:${content.padding || '12px 24px'};border-radius:${content.borderRadius || '8px'};text-decoration:none;font-weight:600;font-size:16px">${content.text}</a></div>`;
          break;
        case BLOCK_TYPES.DIVIDER:
          innerHtml = `<hr style="border:none;border-top:${content.thickness || '1px'} ${content.style || 'solid'} ${content.color || '#e5e7eb'};width:${content.width || '100%'};margin:0 auto" />`;
          break;
        case BLOCK_TYPES.SPACER:
          innerHtml = `<div style="height:${content.height || '24px'}"></div>`;
          break;
        case BLOCK_TYPES.SOCIAL:
          const icons = content.icons?.map(icon => 
            `<a href="${icon.url || '#'}" style="display:inline-block;width:${content.size || '32px'};height:${content.size || '32px'};margin:0 8px;text-decoration:none">${icon.platform}</a>`
          ).join('');
          innerHtml = `<div style="text-align:${content.align || 'center'}">${icons}</div>`;
          break;
        case BLOCK_TYPES.FOOTER:
          innerHtml = `<div style="text-align:center;font-size:12px;color:#6b7280">
            <p style="margin:0 0 8px 0">${content.companyName}</p>
            <p style="margin:0 0 8px 0">${content.address}</p>
            ${content.links?.map(l => `<a href="${l.url}" style="color:#6366f1">${l.text}</a>`).join(' | ')}
            <p style="margin:8px 0 0 0"><a href="{{unsubscribe_url}}" style="color:#6366f1">${content.unsubscribeText}</a></p>
          </div>`;
          break;
        case BLOCK_TYPES.HTML:
          innerHtml = content.code;
          break;
        default:
          innerHtml = '';
      }
      
      return `<div style="padding:${padding};background:${bgColor}">${innerHtml}</div>`;
    };
    
    const bodyContent = blocks.map(renderBlockHtml).join('\n');
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin:0;padding:0;background:${settings.backgroundColor};font-family:${settings.fontFamily}">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:20px 0">
        <table width="${settings.contentWidth}" cellpadding="0" cellspacing="0" border="0" style="max-width:100%;background:#ffffff">
          <tr>
            <td>
              ${bodyContent}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };
  
  // Drag handlers
  const handleDragStart = (e, type) => {
    setDraggedType(type);
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDrop = (e, afterId = null) => {
    e.preventDefault();
    if (draggedType) {
      addBlock(draggedType, afterId);
      setDraggedType(null);
    }
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave?.(blocks, generateHtml());
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBlockId) {
          e.preventDefault();
          deleteBlock(selectedBlockId);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, historyIndex]);
  
  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCode(!showCode)}
            className={`p-2 rounded flex items-center gap-1 ${showCode ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <Code className="w-4 h-4" />
            <span className="text-sm">Code</span>
          </button>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded flex items-center gap-1 ${showPreview ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">Preview</span>
          </button>
          <button 
            onClick={() => onSave?.(blocks, generateHtml())}
            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Block Library Sidebar */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Blocks</h3>
            
            {['content', 'layout', 'media', 'advanced'].map(category => (
              <div key={category} className="mb-4">
                <h4 className="text-xs uppercase text-gray-500 mb-2">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_LIBRARY.filter(b => b.category === category).map(block => (
                    <div
                      key={block.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, block.type)}
                      onClick={() => addBlock(block.type)}
                      className="p-3 border rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors group"
                    >
                      <block.icon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 mb-1 mx-auto" />
                      <span className="text-xs text-gray-600 block text-center">{block.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Editor Canvas */}
        <div 
          ref={editorRef}
          className="flex-1 overflow-y-auto p-8"
          style={{ backgroundColor: settings.backgroundColor }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e)}
        >
          <div 
            className={`mx-auto bg-white shadow-lg transition-all ${
              viewMode === 'mobile' ? 'max-w-[375px]' : ''
            }`}
            style={{ 
              maxWidth: viewMode === 'mobile' ? '375px' : settings.contentWidth,
              minHeight: '500px'
            }}
          >
            {blocks.length === 0 ? (
              <div 
                className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 m-4 rounded-lg"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
              >
                <Plus className="w-8 h-8 mb-2" />
                <p>Drag blocks here or click to add</p>
              </div>
            ) : (
              <div className="pl-14 pr-4 py-4 space-y-2">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, block.id)}
                  >
                    <BlockRenderer
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={setSelectedBlockId}
                      onUpdate={updateBlock}
                      onDelete={() => deleteBlock(block.id)}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onMoveUp={() => moveBlock(block.id, 'up')}
                      onMoveDown={() => moveBlock(block.id, 'down')}
                      isFirst={index === 0}
                      isLast={index === blocks.length - 1}
                      viewMode={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Settings Panel */}
        {selectedBlock && (
          <BlockSettingsPanel
            block={selectedBlock}
            onUpdate={updateBlock}
            onClose={() => setSelectedBlockId(null)}
          />
        )}
        
        {/* Code View */}
        {showCode && (
          <div className="w-96 bg-gray-900 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-3">HTML Output</h3>
              <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
                {generateHtml()}
              </pre>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Email Preview</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div 
              className="p-8 overflow-y-auto"
              style={{ backgroundColor: settings.backgroundColor, maxHeight: 'calc(100vh - 200px)' }}
            >
              <div 
                className="mx-auto bg-white shadow-lg"
                style={{ maxWidth: viewMode === 'mobile' ? '375px' : settings.contentWidth }}
                dangerouslySetInnerHTML={{ __html: generateHtml() }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Named exports for templates
export const EMAIL_TEMPLATES = {
  welcome: [
    { id: '1', type: 'logo', content: { src: '', alt: 'Logo', width: '120px', align: 'center' }, styles: { padding: '24px' } },
    { id: '2', type: 'heading', content: { text: 'Welcome to CYBEV! 🎉', level: 'h1', align: 'center' }, styles: { padding: '16px' } },
    { id: '3', type: 'text', content: { html: '<p>Hi {{name}},</p><p>Thank you for joining CYBEV! We\'re excited to have you on board.</p>' }, styles: { padding: '16px' } },
    { id: '4', type: 'button', content: { text: 'Get Started', link: '{{dashboard_url}}', backgroundColor: '#6366f1', textColor: '#ffffff', align: 'center', borderRadius: '8px', padding: '14px 32px' }, styles: { padding: '24px' } },
    { id: '5', type: 'divider', content: { color: '#e5e7eb', thickness: '1px', width: '80%', style: 'solid' }, styles: { padding: '16px' } },
    { id: '6', type: 'footer', content: { companyName: 'CYBEV', address: '', unsubscribeText: 'Unsubscribe', links: [] }, styles: { padding: '24px', backgroundColor: '#f9fafb' } }
  ],
  newsletter: [
    { id: '1', type: 'logo', content: { src: '', alt: 'Logo', width: '120px', align: 'center' }, styles: { padding: '24px' } },
    { id: '2', type: 'heading', content: { text: 'Weekly Newsletter', level: 'h1', align: 'center' }, styles: { padding: '16px' } },
    { id: '3', type: 'image', content: { src: '', alt: 'Featured Image', width: '100%', align: 'center' }, styles: { padding: '16px' } },
    { id: '4', type: 'text', content: { html: '<p>Here\'s what\'s new this week...</p>' }, styles: { padding: '16px' } },
    { id: '5', type: 'button', content: { text: 'Read More', link: '#', backgroundColor: '#6366f1', textColor: '#ffffff', align: 'center', borderRadius: '8px', padding: '14px 32px' }, styles: { padding: '24px' } },
    { id: '6', type: 'social', content: { icons: [{ platform: 'facebook', url: '#' }, { platform: 'twitter', url: '#' }, { platform: 'instagram', url: '#' }], align: 'center', size: '32px' }, styles: { padding: '16px' } },
    { id: '7', type: 'footer', content: { companyName: 'CYBEV', address: '', unsubscribeText: 'Unsubscribe', links: [] }, styles: { padding: '24px', backgroundColor: '#f9fafb' } }
  ],
  promotional: [
    { id: '1', type: 'heading', content: { text: '🔥 Limited Time Offer!', level: 'h1', align: 'center' }, styles: { padding: '24px', backgroundColor: '#6366f1' } },
    { id: '2', type: 'text', content: { html: '<p style="color:white;text-align:center;font-size:20px">Get 50% OFF your first month</p>' }, styles: { padding: '0 24px 24px', backgroundColor: '#6366f1' } },
    { id: '3', type: 'image', content: { src: '', alt: 'Product Image', width: '100%', align: 'center' }, styles: { padding: '24px' } },
    { id: '4', type: 'text', content: { html: '<p>Don\'t miss out on this incredible deal...</p>' }, styles: { padding: '16px' } },
    { id: '5', type: 'button', content: { text: 'Claim Your Discount', link: '#', backgroundColor: '#ef4444', textColor: '#ffffff', align: 'center', borderRadius: '8px', padding: '16px 48px' }, styles: { padding: '24px' } },
    { id: '6', type: 'footer', content: { companyName: 'CYBEV', address: '', unsubscribeText: 'Unsubscribe', links: [] }, styles: { padding: '24px', backgroundColor: '#f9fafb' } }
  ]
};
