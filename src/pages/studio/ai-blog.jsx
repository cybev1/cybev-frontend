// ============================================
// FILE: src/pages/studio/ai-blog.jsx
// CYBEV AI Blog Generator - COMPLETE VERSION
// VERSION: 8.0.0 - Clean white design + Full AI features
// Features: Pexels/Unsplash images, SEO, Hashtags, Virality Score
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  Sparkles, ArrowLeft, ArrowRight, Loader2, Check, Wand2, Image as ImageIcon,
  Hash, FileText, Clock, Coins, AlertCircle, RefreshCw, Eye, TrendingUp,
  Tag, Upload, X, Camera, Zap, Target, Search, Globe
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '✨' },
  { id: 'health', label: 'Health & Wellness', icon: '🏥' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'food', label: 'Food & Cooking', icon: '🍳' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'church', label: 'Church & Ministry', icon: '⛪' },
  { id: 'faith', label: 'Faith & Devotional', icon: '🙏' },
];

const TONES = [
  { id: 'professional', label: 'Professional', description: 'Formal and authoritative' },
  { id: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { id: 'inspirational', label: 'Inspirational', description: 'Uplifting and motivating' },
  { id: 'educational', label: 'Educational', description: 'Informative and teaching' },
  { id: 'storytelling', label: 'Storytelling', description: 'Narrative and engaging' },
  { id: 'creative', label: 'Creative', description: 'Imaginative and unique' },
];

const LENGTHS = [
  { id: 'short', label: 'Short', words: '800-1200', time: '3-5 min read' },
  { id: 'medium', label: 'Medium', words: '1200-2000', time: '5-8 min read' },
  { id: 'long', label: 'Long', words: '2000-3000', time: '10-15 min read' },
];

const AUDIENCES = [
  { id: 'general', label: 'General Audience' },
  { id: 'beginners', label: 'Beginners' },
  { id: 'professionals', label: 'Professionals' },
  { id: 'enthusiasts', label: 'Enthusiasts' },
  { id: 'students', label: 'Students' },
];

export default function AIBlogGeneratorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    category: 'technology',
    tone: 'professional',
    length: 'medium',
    targetAudience: 'general',
    includeImage: true,
    includeSEO: true,
    includeHashtags: true,
    customImage: null,
    customImagePreview: null
  });

  useEffect(() => {
    fetchTokenBalance();
  }, []);

  const fetchTokenBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await api.get('/api/wallet', { headers: { Authorization: `Bearer ${token}` } });
      setTokenBalance(res.data.balance || res.data.wallet?.balance || 0);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, customImagePreview: e.target.result }));
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });

      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, customImage: data.url }));
        toast.success('Image uploaded!');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeCustomImage = () => {
    setFormData(prev => ({ ...prev, customImage: null, customImagePreview: null }));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please enter a blog topic');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to generate blogs');
        router.push('/auth/login');
        return;
      }

      console.log('🚀 Generating AI blog...');
      console.log('📋 Request:', formData);

      // Call the content creation API
      const res = await api.post('/api/content/create-blog', {
        topic: formData.topic,
        description: formData.description,
        niche: formData.category,
        tone: formData.tone,
        length: formData.length,
        targetAudience: formData.targetAudience,
        featuredImage: formData.customImage // Use custom image if provided
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 180000 // 3 minutes for AI generation
      });

      console.log('✅ API Response:', res.data);

      if (res.data.success && res.data.data) {
        setGeneratedBlog(res.data.data);
        setStep(3);
        toast.success(`🎉 Blog created! You earned ${res.data.tokensEarned || 0} tokens!`);
        fetchTokenBalance();
      } else {
        throw new Error(res.data.error || 'Failed to generate blog');
      }
    } catch (err) {
      console.error('❌ Generation error:', err);
      
      // Provide helpful error messages
      if (err.response?.status === 404) {
        toast.error('AI service not available. Please try again later.');
      } else if (err.code === 'ECONNABORTED') {
        toast.error('Generation timed out. Try a shorter blog length.');
      } else {
        toast.error(err.response?.data?.error || err.message || 'Failed to generate blog');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedBlog) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const res = await api.post('/api/content/publish-blog', {
        blogData: {
          ...generatedBlog,
          status: 'published'
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success(`🚀 Blog published! You earned ${res.data.tokensEarned || 0} more tokens!`);
        fetchTokenBalance();
        router.push(`/blog/${res.data.data?.slug || res.data.data?._id}`);
      } else {
        throw new Error(res.data.error || 'Failed to publish');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to publish blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedBlog) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const res = await api.post('/api/content/publish-blog', {
        blogData: {
          ...generatedBlog,
          status: 'draft'
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success('Draft saved!');
        router.push('/studio/blogs');
      }
    } catch (err) {
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head><title>AI Blog Generator | CYBEV</title></Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    AI Blog Generator
                  </h1>
                  <p className="text-sm text-gray-500">Create SEO-optimized blogs with AI</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-xl">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-700">{tokenBalance}</span>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {[
                { num: 1, label: 'Topic' },
                { num: 2, label: 'Options' },
                { num: 3, label: 'Review' }
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s.num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= s.num ? 'text-purple-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                  {i < 2 && <div className={`w-16 h-1 mx-4 rounded ${step > s.num ? 'bg-purple-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Step 1: Topic & Category */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">What's your blog about?</h2>
              <p className="text-gray-500 mb-6">Enter your topic and choose a category</p>

              <div className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Blog Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white"
                    placeholder="e.g., The Future of AI in Content Creation"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Additional Context <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white resize-none"
                    placeholder="Add specific points, keywords, or angles you want covered..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Category / Niche</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                          formData.category === cat.id
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.topic.trim()}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Options */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Customize your blog</h2>
              <p className="text-gray-500 mb-6">Choose tone, length, and features</p>

              <div className="space-y-6">
                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Writing Tone</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setFormData({ ...formData, tone: tone.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.tone === tone.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <p className={`font-semibold ${formData.tone === tone.id ? 'text-purple-600' : 'text-gray-900'}`}>
                          {tone.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{tone.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Blog Length</label>
                  <div className="grid grid-cols-3 gap-3">
                    {LENGTHS.map((len) => (
                      <button
                        key={len.id}
                        onClick={() => setFormData({ ...formData, length: len.id })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          formData.length === len.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <p className={`font-semibold ${formData.length === len.id ? 'text-purple-600' : 'text-gray-900'}`}>
                          {len.label}
                        </p>
                        <p className="text-xs text-gray-500">{len.words} words</p>
                        <p className="text-xs text-gray-400">{len.time}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Target Audience</label>
                  <div className="flex flex-wrap gap-2">
                    {AUDIENCES.map((aud) => (
                      <button
                        key={aud.id}
                        onClick={() => setFormData({ ...formData, targetAudience: aud.id })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.targetAudience === aud.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {aud.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Featured Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Featured Image <span className="text-gray-400">(Optional - AI will find one if not provided)</span>
                  </label>
                  {formData.customImagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.customImagePreview}
                        alt="Custom"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={removeCustomImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-8 h-8 mx-auto text-purple-600 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">Click to upload custom image</p>
                          <p className="text-xs text-gray-400 mt-1">Or let AI find the perfect image</p>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Feature Toggles */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Include Features</label>
                  <div className="space-y-3">
                    {[
                      { key: 'includeImage', icon: ImageIcon, label: 'AI Featured Image', desc: 'Auto-find relevant images from Pexels/Unsplash', color: 'cyan' },
                      { key: 'includeSEO', icon: Search, label: 'SEO Optimization', desc: 'Meta title, description, keywords, URL slug', color: 'green' },
                      { key: 'includeHashtags', icon: Hash, label: 'Viral Hashtags', desc: 'AI-generated hashtags for social media', color: 'pink' },
                    ].map((feature) => (
                      <button
                        key={feature.key}
                        onClick={() => setFormData({ ...formData, [feature.key]: !formData[feature.key] })}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          formData[feature.key]
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData[feature.key] ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                          <feature.icon className={`w-5 h-5 ${formData[feature.key] ? 'text-purple-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-medium ${formData[feature.key] ? 'text-purple-600' : 'text-gray-900'}`}>
                            {feature.label}
                          </p>
                          <p className="text-xs text-gray-500">{feature.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          formData[feature.key] ? 'bg-purple-600' : 'bg-gray-200'
                        }`}>
                          {formData[feature.key] && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Blog
                    </>
                  )}
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="mt-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">AI is creating your blog...</p>
                      <p className="text-sm text-gray-600">Generating content, finding images, optimizing SEO...</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" /> Writing SEO-optimized content
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 text-purple-500 animate-spin" /> Finding perfect images
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" /> Generating viral hashtags
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && generatedBlog && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{generatedBlog.viralityScore || 85}</p>
                  <p className="text-xs text-gray-500">Virality Score</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <Coins className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{generatedBlog.initialTokens || 50}</p>
                  <p className="text-xs text-gray-500">Tokens Earned</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{generatedBlog.readTime || '5 min'}</p>
                  <p className="text-xs text-gray-500">Read Time</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <Hash className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(generatedBlog.hashtags) ? generatedBlog.hashtags.length : Object.values(generatedBlog.hashtags || {}).flat().length}
                  </p>
                  <p className="text-xs text-gray-500">Hashtags</p>
                </div>
              </div>

              {/* Blog Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Featured Image */}
                {(generatedBlog.featuredImage?.url || generatedBlog.featuredImage) && (
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={generatedBlog.featuredImage?.url || generatedBlog.featuredImage}
                      alt={generatedBlog.title}
                      className="w-full h-full object-cover"
                    />
                    {generatedBlog.featuredImage?.credit && (
                      <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/50 text-white text-xs rounded-full">
                        📷 {generatedBlog.featuredImage.credit.photographer} • {generatedBlog.featuredImage.credit.source}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Category & Read Time */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {generatedBlog.category || formData.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {generatedBlog.readTime || '5 min read'}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{generatedBlog.title}</h2>

                  {/* Summary */}
                  {(generatedBlog.summary || generatedBlog.excerpt) && (
                    <p className="text-gray-600 mb-4 italic border-l-4 border-purple-500 pl-4">
                      {generatedBlog.summary || generatedBlog.excerpt}
                    </p>
                  )}

                  {/* SEO Preview */}
                  {generatedBlog.seo && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <Search className="w-4 h-4" /> SEO Optimization
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Title Tag</p>
                          <p className="text-sm font-medium text-gray-900">{generatedBlog.seo.title}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Meta Description</p>
                          <p className="text-sm text-gray-700">{generatedBlog.seo.description}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">URL Slug</p>
                          <p className="text-sm text-blue-600 font-mono">/blog/{generatedBlog.seo.slug}</p>
                        </div>
                        {generatedBlog.seo.keywords?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Keywords</p>
                            <div className="flex flex-wrap gap-1">
                              {generatedBlog.seo.keywords.slice(0, 10).map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hashtags */}
                  {generatedBlog.hashtags && (
                    <div className="mb-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
                      <h3 className="text-sm font-semibold text-pink-700 mb-3 flex items-center gap-2">
                        <Hash className="w-4 h-4" /> Viral Hashtags
                      </h3>
                      {Array.isArray(generatedBlog.hashtags) ? (
                        <div className="flex flex-wrap gap-2">
                          {generatedBlog.hashtags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(generatedBlog.hashtags).map(([category, tags]) => (
                            <div key={category}>
                              <p className="text-xs text-gray-500 mb-1 capitalize">{category}</p>
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag, i) => (
                                  <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">{tag}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Content Preview</h3>
                    <div 
                      className="prose prose-gray max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: generatedBlog.content
                          ?.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
                          .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
                          .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^- (.*)$/gm, '<li>$1</li>')
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/^(.+)$/gm, '<p>$1</p>')
                          || ''
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => { setStep(1); setGeneratedBlog(null); }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generate Another
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Save as Draft
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Publish Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
