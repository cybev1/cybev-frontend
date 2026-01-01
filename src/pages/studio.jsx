// ============================================
// FILE: src/pages/studio.jsx
// CYBEV Studio - Blog Creation (Light Theme)
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Users, Video, Bell, Menu, Search, MessageCircle, Plus,
  ArrowLeft, Image as ImageIcon, Bold, Italic, List, Link as LinkIcon,
  AlignLeft, AlignCenter, Quote, Code, Sparkles, Send, Save, Eye,
  X, Loader2, BarChart3, Type, Hash, Globe, Lock, ChevronDown
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// ==========================================
// TOP NAVIGATION BAR
// ==========================================
function TopNavBar({ onBack }) {
  const router = useRouter();
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Create Blog</h1>
        </div>
        
        <Link href="/feed">
          <h1 className="text-2xl font-bold text-purple-600 cursor-pointer">CYBEV</h1>
        </Link>
      </div>
    </div>
  );
}

// ==========================================
// AI BLOG GENERATOR
// ==========================================
function AIBlogGenerator({ onGenerated }) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('technology');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const niches = ['technology', 'business', 'health', 'lifestyle', 'education', 'finance', 'entertainment', 'food', 'travel'];
  const tones = ['professional', 'casual', 'friendly', 'formal', 'humorous'];
  const lengths = ['short', 'medium', 'long'];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/content/create-blog', {
        topic, niche, tone, length, targetAudience: 'general'
      }, { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 });

      if (response.data.success) {
        toast.success(`Blog generated! +${response.data.tokensEarned || 50} CYBEV earned!`);
        onGenerated({
          title: response.data.data.title,
          content: response.data.data.content,
          featuredImage: response.data.data.featuredImage?.url || '',
          tags: response.data.data.seo?.keywords || [],
          category: niche
        });
        setExpanded(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 mb-6">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">AI Blog Generator</h3>
            <p className="text-sm text-gray-500">Generate a complete blog post with AI</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
            <input 
              type="text" 
              value={topic} 
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., The Future of Web3 in Africa"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={niche} onChange={e => setNiche(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">
                {niches.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">
                {tones.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
              <select value={length} onChange={e => setLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">
                {lengths.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-purple-100 rounded-lg p-3">
            <p className="text-purple-700 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Earn 50-100 CYBEV tokens for quality content!
            </p>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
          >
            {generating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating (up to 2 min)...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Blog</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN STUDIO PAGE
// ==========================================
export default function Studio() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('technology');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const contentRef = useRef(null);

  const categories = ['technology', 'business', 'health', 'lifestyle', 'education', 'finance', 'entertainment', 'food', 'travel', 'other'];

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

  const handleAIGenerated = (data) => {
    setTitle(data.title || '');
    setContent(data.content || '');
    setFeaturedImage(data.featuredImage || '');
    setTags(data.tags?.slice(0, 5) || []);
    setCategory(data.category || 'technology');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
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
        title, content, featuredImage, category, tags, status: 'draft'
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
      const response = await api.post('/api/blogs', {
        title, content, featuredImage, category, tags, status: 'published'
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success('Blog published successfully!');
      router.push(`/blog/${response.data.blog?._id || response.data.data?._id || response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to publish');
    } finally {
      setPublishing(false);
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
      case 'bold':
        newText = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selected || 'italic text'}*`;
        break;
      case 'heading':
        newText = `\n## ${selected || 'Heading'}\n`;
        break;
      case 'quote':
        newText = `\n> ${selected || 'Quote'}\n`;
        break;
      case 'list':
        newText = `\n- ${selected || 'List item'}\n`;
        break;
      case 'code':
        newText = `\`${selected || 'code'}\``;
        break;
      default:
        newText = selected;
    }
    
    setContent(content.substring(0, start) + newText + content.substring(end));
  };

  return (
    <>
      <Head>
        <title>Create Blog - CYBEV Studio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <TopNavBar onBack={() => router.back()} />

        <div className="max-w-screen-md mx-auto px-4 py-6">
          {/* AI Generator */}
          <AIBlogGenerator onGenerated={handleAIGenerated} />

          {/* Manual Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Title */}
            <div className="p-4 border-b border-gray-100">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Blog Title..."
                className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
              />
            </div>

            {/* Featured Image */}
            <div className="p-4 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={featuredImage}
                  onChange={e => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                />
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {featuredImage && (
                <img src={featuredImage} alt="Preview" className="mt-3 rounded-lg max-h-48 object-cover" onError={e => e.target.style.display = 'none'} />
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
            <div className="p-4">
              <textarea
                ref={contentRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your blog content here... (Markdown supported)"
                className="w-full min-h-[300px] text-gray-800 placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Category & Tags */}
            <div className="p-4 border-t border-gray-100 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">
                    {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select value={visibility} onChange={e => setVisibility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">
                    <option value="public">🌍 Public</option>
                    <option value="followers">👥 Followers Only</option>
                    <option value="private">🔒 Private</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      #{tag}
                      <button onClick={() => handleRemoveTag(i)} className="hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                  <button onClick={handleAddTag} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <button 
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Draft
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => router.push('/preview')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button 
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm disabled:opacity-50"
                >
                  {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="p-3 text-gray-500"><Home className="w-6 h-6" /></button>
          </Link>
          <Link href="/discover">
            <button className="p-3 text-gray-500"><Users className="w-6 h-6" /></button>
          </Link>
          <button className="p-3 bg-purple-600 rounded-full -mt-6 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </button>
          <Link href="/dashboard">
            <button className="p-3 text-gray-500"><BarChart3 className="w-6 h-6" /></button>
          </Link>
          <Link href={user?.username ? `/profile/${user.username}` : '/profile'}>
            <button className="p-3 text-gray-500"><Menu className="w-6 h-6" /></button>
          </Link>
        </div>
      </div>
    </>
  );
}
