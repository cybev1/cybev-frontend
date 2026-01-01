// ============================================
// FILE: src/pages/studio.jsx
// CYBEV Studio - Complete Blog Creation Suite
// Features: AI Blog Generator, Write Article, SEO, Image Upload, Scheduling
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Users, Tv, Bell, Menu, Plus, ArrowLeft, Image as ImageIcon,
  Bold, Italic, List, Quote, Code, Sparkles, Send, Save, Eye, X,
  Loader2, Type, Globe, Calendar, Clock, Upload, Trash2, ChevronDown,
  ChevronUp, Building, Hash, FileText, Wand2, Settings
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// ==========================================
// AI BLOG GENERATOR CARD (Separate & Clear)
// ==========================================
function AIBlogGenerator({ onGenerated }) {
  const [expanded, setExpanded] = useState(false);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [niche, setNiche] = useState('technology');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoHashtags, setSeoHashtags] = useState('');
  const [generating, setGenerating] = useState(false);

  // Scheduling
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduledTopics, setScheduledTopics] = useState([]);

  const niches = ['technology', 'business', 'health', 'lifestyle', 'education', 'finance', 'entertainment', 'food', 'travel', 'science'];
  const tones = ['professional', 'casual', 'friendly', 'formal', 'humorous', 'inspirational'];
  const lengths = ['short', 'medium', 'long'];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // If scheduling, save to scheduled list instead
      if (scheduleEnabled && scheduleDate && scheduleTime) {
        const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
        
        await api.post('/api/content/schedule-ai', {
          topic,
          description,
          niche,
          tone,
          length,
          seoTitle,
          seoDescription,
          seoHashtags: seoHashtags.split(',').map(t => t.trim()).filter(Boolean),
          scheduledAt: scheduledAt.toISOString()
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        toast.success(`Blog scheduled for ${scheduledAt.toLocaleString()}`);
        setTopic('');
        setDescription('');
        setScheduleEnabled(false);
        setGenerating(false);
        return;
      }

      const response = await api.post('/api/content/create-blog', {
        topic,
        description,
        niche,
        tone,
        length,
        seoTitle: seoTitle || topic,
        seoDescription: seoDescription || description,
        seoHashtags: seoHashtags.split(',').map(t => t.trim()).filter(Boolean),
        targetAudience: 'general'
      }, { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 });

      if (response.data.success) {
        toast.success(`Blog generated! +${response.data.tokensEarned || 50} CYBEV earned!`);
        onGenerated({
          title: response.data.data.title,
          content: response.data.data.content,
          featuredImage: response.data.data.featuredImage?.url || '',
          tags: response.data.data.seo?.keywords || seoHashtags.split(',').map(t => t.trim()).filter(Boolean),
          category: niche,
          seoTitle: seoTitle || response.data.data.seoTitle,
          seoDescription: seoDescription || response.data.data.seoDescription
        });
        setExpanded(false);
        setTopic('');
        setDescription('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg mb-6 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">AI Blog Generator</h3>
            <p className="text-white/80 text-sm">Let AI create your blog post</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <div className="bg-white p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Topic *</label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Future of Web3 in Africa"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Description / Prompt Hint</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you want the article to cover, key points to include, target audience, style preferences..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
            <p className="text-xs text-gray-500 mt-1">💡 The more details you provide, the better the AI can generate relevant content</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
              <select value={niche} onChange={e => setNiche(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-purple-500">
                {niches.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-purple-500">
                {tones.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Length</label>
              <select value={length} onChange={e => setLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-purple-500">
                {lengths.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
          </div>
          
          {/* SEO Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" /> SEO Settings (for viral search)
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
                  placeholder="Optimized title for search engines (leave empty for auto)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)}
                  placeholder="Meta description for search results (150-160 chars recommended)"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Hashtags / Keywords</label>
                <input type="text" value={seoHashtags} onChange={e => setSeoHashtags(e.target.value)}
                  placeholder="web3, africa, blockchain, crypto (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
          </div>
          
          {/* Schedule Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" /> Schedule AI to write later
              </span>
            </label>
            
            {scheduleEnabled && (
              <div className="mt-3 flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Time</label>
                  <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-purple-700 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Earn 50-100 CYBEV tokens for quality content!
            </p>
          </div>
          
          <button onClick={handleGenerate} disabled={generating || !topic.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
            {generating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating (up to 2 min)...</>
            ) : scheduleEnabled ? (
              <><Calendar className="w-5 h-5" /> Schedule AI Generation</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Blog Now</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// WRITE ARTICLE CARD (Separate & Clear)
// ==========================================
function WriteArticleEditor({ 
  title, setTitle, content, setContent, featuredImage, setFeaturedImage,
  category, setCategory, tags, setTags, seoTitle, setSeoTitle,
  seoDescription, setSeoDescription, visibility, setVisibility,
  scheduleDate, setScheduleDate, scheduleTime, setScheduleTime,
  onSaveDraft, onPublish, saving, publishing
}) {
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const categories = ['technology', 'business', 'health', 'lifestyle', 'education', 'finance', 'entertainment', 'food', 'travel', 'science', 'other'];

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/upload/image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.url) {
        setFeaturedImage(response.data.url);
        toast.success('Image uploaded!');
      }
    } catch (error) {
      // Fallback: use local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImage(e.target.result);
        toast.success('Image loaded (preview mode)');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const insertFormat = (format) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    
    let newText = '';
    switch (format) {
      case 'bold': newText = `**${selected || 'bold text'}**`; break;
      case 'italic': newText = `*${selected || 'italic text'}*`; break;
      case 'heading': newText = `\n## ${selected || 'Heading'}\n`; break;
      case 'quote': newText = `\n> ${selected || 'Quote'}\n`; break;
      case 'list': newText = `\n- ${selected || 'List item'}\n`; break;
      case 'code': newText = `\`${selected || 'code'}\``; break;
      default: newText = selected;
    }
    
    setContent(content.substring(0, start) + newText + content.substring(end));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Write Article</h3>
            <p className="text-gray-500 text-sm">Create your blog post manually</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="p-4 border-b border-gray-100">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Title *</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="w-full text-xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
      </div>

      {/* Featured Image Upload */}
      <div className="p-4 border-b border-gray-100">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Featured Image</label>
        
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        
        {featuredImage ? (
          <div className="relative">
            <img src={featuredImage} alt="Featured" className="w-full h-48 object-cover rounded-lg" />
            <button onClick={() => setFeaturedImage('')}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-50 transition-colors">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-gray-500 text-sm">Click to upload image from device</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Formatting Toolbar */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1 bg-gray-50 overflow-x-auto">
        <button onClick={() => insertFormat('bold')} className="p-2 hover:bg-white rounded" title="Bold">
          <Bold className="w-4 h-4 text-gray-600" />
        </button>
        <button onClick={() => insertFormat('italic')} className="p-2 hover:bg-white rounded" title="Italic">
          <Italic className="w-4 h-4 text-gray-600" />
        </button>
        <button onClick={() => insertFormat('heading')} className="p-2 hover:bg-white rounded" title="Heading">
          <Type className="w-4 h-4 text-gray-600" />
        </button>
        <button onClick={() => insertFormat('quote')} className="p-2 hover:bg-white rounded" title="Quote">
          <Quote className="w-4 h-4 text-gray-600" />
        </button>
        <button onClick={() => insertFormat('list')} className="p-2 hover:bg-white rounded" title="List">
          <List className="w-4 h-4 text-gray-600" />
        </button>
        <button onClick={() => insertFormat('code')} className="p-2 hover:bg-white rounded" title="Code">
          <Code className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Content Editor */}
      <div className="p-4 border-b border-gray-100">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Content *</label>
        <textarea ref={contentRef} value={content} onChange={e => setContent(e.target.value)}
          placeholder="Write your blog content here... (Markdown supported)"
          className="w-full min-h-[250px] text-gray-800 placeholder-gray-400 focus:outline-none resize-none leading-relaxed border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
      </div>

      {/* Category & Visibility */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500">
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Visibility</label>
            <select value={visibility} onChange={e => setVisibility(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500">
              <option value="public">🌍 Public</option>
              <option value="followers">👥 Followers Only</option>
              <option value="private">🔒 Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-gray-100">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Tags</label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              #{tag}
              <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add tag..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500" />
          <button onClick={handleAddTag} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 text-sm font-medium">
            Add
          </button>
        </div>
      </div>

      {/* SEO Section */}
      <div className="p-4 border-b border-gray-100 bg-blue-50">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" /> SEO Settings
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
              placeholder="Optimized title for search engines"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)}
              placeholder="Meta description for search results (150-160 chars)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="p-4 border-b border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
          <span className="font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" /> Schedule for later
          </span>
        </label>
        
        {scheduleEnabled && (
          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Time</label>
              <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex items-center justify-between bg-gray-50">
        <button onClick={onSaveDraft} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Draft
        </button>
        
        <div className="flex gap-2">
          <button onClick={onPublish} disabled={publishing || !title.trim() || !content.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm disabled:opacity-50 shadow-sm">
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {scheduleEnabled ? 'Schedule' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN STUDIO PAGE
// ==========================================
export default function Studio() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  // Article state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('technology');
  const [tags, setTags] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch {}
    }
  }, []);

  // Helper to convert HTML to clean text/markdown
  const htmlToMarkdown = (html) => {
    if (!html) return '';
    
    return html
      // Convert headings
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      // Convert formatting
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Convert lists
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      // Convert links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Convert blockquotes
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
      // Convert paragraphs and line breaks
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      // Remove remaining HTML tags
      .replace(/<article[^>]*>/gi, '')
      .replace(/<\/article>/gi, '')
      .replace(/<section[^>]*>/gi, '')
      .replace(/<\/section>/gi, '')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<[^>]+>/g, '') // Remove any remaining tags
      // Clean up
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
      .trim();
  };

  const handleAIGenerated = (data) => {
    setTitle(data.title || '');
    // Convert HTML content to clean markdown
    setContent(htmlToMarkdown(data.content || ''));
    setFeaturedImage(data.featuredImage || '');
    setTags(data.tags?.slice(0, 5) || []);
    setCategory(data.category || 'technology');
    setSeoTitle(data.seoTitle || '');
    setSeoDescription(data.seoDescription || '');
    toast.success('Content loaded into editor! Review and publish when ready.');
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/blogs', {
        title, content, featuredImage, category, tags,
        seo: { title: seoTitle, description: seoDescription },
        status: 'draft'
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Draft saved!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!content.trim()) {
      toast.error('Please add some content');
      return;
    }

    setPublishing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      const blogData = {
        title, content, featuredImage, category, tags,
        seo: { title: seoTitle || title, description: seoDescription },
        visibility,
        status: 'published'
      };

      // If scheduled
      if (scheduleDate && scheduleTime) {
        blogData.scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
        blogData.status = 'scheduled';
      }

      const response = await api.post('/api/blogs', blogData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (scheduleDate && scheduleTime) {
        toast.success('Blog scheduled successfully!');
      } else {
        toast.success('Blog published successfully!');
      }
      
      const blogId = response.data.blog?._id || response.data.data?._id || response.data._id;
      router.push(`/blog/${blogId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Blog - CYBEV Studio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        {/* Top Nav */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-screen-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Create Blog</h1>
            </div>
            <Link href="/feed">
              <h1 className="text-xl font-bold text-purple-600 cursor-pointer">CYBEV</h1>
            </Link>
          </div>
        </div>

        <div className="max-w-screen-md mx-auto px-4 py-6">
          {/* AI Blog Generator - Clearly Separate */}
          <AIBlogGenerator onGenerated={handleAIGenerated} />

          {/* Write Article - Clearly Separate */}
          <WriteArticleEditor
            title={title} setTitle={setTitle}
            content={content} setContent={setContent}
            featuredImage={featuredImage} setFeaturedImage={setFeaturedImage}
            category={category} setCategory={setCategory}
            tags={tags} setTags={setTags}
            seoTitle={seoTitle} setSeoTitle={setSeoTitle}
            seoDescription={seoDescription} setSeoDescription={setSeoDescription}
            visibility={visibility} setVisibility={setVisibility}
            scheduleDate={scheduleDate} setScheduleDate={setScheduleDate}
            scheduleTime={scheduleTime} setScheduleTime={setScheduleTime}
            onSaveDraft={handleSaveDraft} onPublish={handlePublish}
            saving={saving} publishing={publishing}
          />
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed"><button className="p-3 text-gray-500"><Home className="w-6 h-6" /></button></Link>
          <Link href="/groups"><button className="p-3 text-gray-500"><Users className="w-6 h-6" /></button></Link>
          <button className="p-3 bg-purple-600 rounded-full -mt-6 shadow-lg"><Plus className="w-6 h-6 text-white" /></button>
          <Link href="/tv"><button className="p-3 text-gray-500"><Tv className="w-6 h-6" /></button></Link>
          <Link href={user?.username ? `/profile/${user.username}` : '/profile'}><button className="p-3 text-gray-500"><Menu className="w-6 h-6" /></button></Link>
        </div>
      </div>
    </>
  );
}
