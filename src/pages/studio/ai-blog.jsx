// ============================================
// FILE: src/pages/studio/ai-blog.jsx
// CYBEV AI Blog Generator - CLEAN WHITE DESIGN
// VERSION: 7.1.0 - Solid white, black text, readable
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  Sparkles, ArrowLeft, ArrowRight, Loader2, Check, Wand2, Image as ImageIcon,
  Hash, FileText, Clock, Coins, AlertCircle, ChevronDown, RefreshCw, Eye
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  'Technology', 'Business', 'Lifestyle', 'Health', 'Education',
  'Entertainment', 'Travel', 'Food', 'Fashion', 'Sports',
  'Finance', 'Science', 'Art', 'Music', 'Gaming',
  'Church', 'Ministry', 'Devotional', 'Faith', 'Inspiration'
];

const TONES = [
  { id: 'professional', label: 'Professional', description: 'Formal and authoritative' },
  { id: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { id: 'inspirational', label: 'Inspirational', description: 'Uplifting and motivating' },
  { id: 'educational', label: 'Educational', description: 'Informative and teaching' },
  { id: 'storytelling', label: 'Storytelling', description: 'Narrative and engaging' },
];

const LENGTHS = [
  { id: 'short', label: 'Short', words: '500-800', time: '2-3 min read' },
  { id: 'medium', label: 'Medium', words: '1000-1500', time: '5-7 min read' },
  { id: 'long', label: 'Long', words: '2000-3000', time: '10-15 min read' },
];

export default function AIBlogGeneratorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    category: '',
    tone: 'professional',
    length: 'medium',
    includeImage: true,
    includeSEO: true,
    includeHashtags: true
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

      const res = await api.post('/api/blogs/generate', {
        topic: formData.topic,
        description: formData.description,
        category: formData.category,
        tone: formData.tone,
        length: formData.length,
        includeImage: formData.includeImage,
        includeSEO: formData.includeSEO,
        includeHashtags: formData.includeHashtags
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 180000 // 3 minutes
      });

      if (res.data.ok || res.data.success || res.data.blog) {
        setGeneratedBlog(res.data.blog || res.data);
        setStep(3);
        toast.success(`Blog generated! Earned ${res.data.tokensEarned || 0} CYBEV tokens`);
        fetchTokenBalance();
      } else {
        toast.error(res.data.message || 'Failed to generate blog');
      }
    } catch (err) {
      console.error('Generation error:', err);
      toast.error(err.response?.data?.message || 'Failed to generate blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedBlog) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/blogs', {
        ...generatedBlog,
        status: 'published'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ok || res.data.success) {
        toast.success('Blog published successfully!');
        router.push(`/blog/${res.data.blog?._id || res.data._id}`);
      }
    } catch (err) {
      toast.error('Failed to publish blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>AI Blog Generator | CYBEV</title>
      </Head>

      {/* SOLID WHITE BACKGROUND - NO GRADIENTS */}
      <div className="min-h-screen bg-white">
        {/* Header Section - Light gray background */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link href="/studio">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium">
                <ArrowLeft className="w-5 h-5" />
                Back to Studio
              </button>
            </Link>

            {/* Title - BLACK TEXT */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Blog Generator</h1>
              <p className="text-gray-600">Create complete blog posts with SEO, images, and hashtags in seconds</p>
            </div>

            {/* Token Balance */}
            <div className="flex justify-center mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">{tokenBalance} CYBEV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Progress - WHITE BACKGROUND */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  <span className={`ml-2 font-medium ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s === 1 ? 'Topic' : s === 2 ? 'Options' : 'Review'}
                  </span>
                  {s < 3 && <div className={`w-16 h-1 mx-4 rounded ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - WHITE BACKGROUND */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Step 1: Topic */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">What's your blog about?</h2>
              <p className="text-gray-600 mb-6">Tell us your topic and choose a niche</p>

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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="e.g., The Future of AI in Content Creation"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Brief Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all resize-none"
                    placeholder="Add more context to help AI write better content..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Helps AI understand your vision better</p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.category === cat
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.topic.trim()}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all"
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
              <p className="text-gray-600 mb-6">Choose tone, length, and features</p>

              <div className="space-y-6">
                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Writing Tone</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setFormData({ ...formData, tone: tone.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.tone === tone.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <p className={`font-semibold ${formData.tone === tone.id ? 'text-purple-600' : 'text-gray-900'}`}>
                          {tone.label}
                        </p>
                        <p className="text-sm text-gray-500">{tone.description}</p>
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
                            ? 'border-purple-600 bg-purple-50'
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

                {/* Features Toggles */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Include Features</label>
                  <div className="space-y-3">
                    {[
                      { key: 'includeImage', icon: ImageIcon, label: 'AI Generated Image', desc: 'Add a featured image' },
                      { key: 'includeSEO', icon: FileText, label: 'SEO Optimization', desc: 'Meta tags and keywords' },
                      { key: 'includeHashtags', icon: Hash, label: 'Hashtags', desc: 'Social media hashtags' },
                    ].map((feature) => (
                      <button
                        key={feature.key}
                        onClick={() => setFormData({ ...formData, [feature.key]: !formData[feature.key] })}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          formData[feature.key]
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData[feature.key] ? 'bg-purple-600' : 'bg-gray-100'
                        }`}>
                          <feature.icon className={`w-5 h-5 ${formData[feature.key] ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-semibold ${formData[feature.key] ? 'text-purple-600' : 'text-gray-900'}`}>
                            {feature.label}
                          </p>
                          <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData[feature.key] ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
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
                  className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all"
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
                      <p className="font-semibold text-gray-900">AI is writing your blog...</p>
                      <p className="text-sm text-gray-600">This may take 1-2 minutes</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && generatedBlog && (
            <div className="space-y-6">
              {/* Preview Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Featured Image */}
                {generatedBlog.featuredImage && (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={generatedBlog.featuredImage}
                      alt={generatedBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Category & Read Time */}
                  <div className="flex items-center gap-3 mb-4">
                    {generatedBlog.category && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {generatedBlog.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {generatedBlog.readTime || '5 min read'}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{generatedBlog.title}</h2>

                  {/* Excerpt */}
                  {generatedBlog.excerpt && (
                    <p className="text-gray-600 mb-4">{generatedBlog.excerpt}</p>
                  )}

                  {/* Hashtags */}
                  {generatedBlog.hashtags && generatedBlog.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {generatedBlog.hashtags.map((tag, i) => (
                        <span key={i} className="text-purple-600 text-sm">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="prose prose-gray max-w-none">
                    <div 
                      className="text-gray-700 line-clamp-6"
                      dangerouslySetInnerHTML={{ __html: generatedBlog.content?.substring(0, 500) + '...' }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => { setStep(1); setGeneratedBlog(null); }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generate Another
                  </button>
                  <button
                    onClick={() => router.push(`/blog/edit/${generatedBlog._id}`)}
                    className="flex-1 px-6 py-3 border border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Edit First
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all"
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
