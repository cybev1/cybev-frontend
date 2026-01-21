// ============================================
// FILE: src/pages/studio/ai-blog.jsx
// AI Blog Generator - FIXED TIMEOUT VERSION
// VERSION: 3.0.0 - 3 minute timeout + better UX
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { 
  Sparkles, ArrowLeft, ArrowRight, Check, Loader2, 
  Image as ImageIcon, Search, Hash, Wand2, BookOpen,
  Clock, Target, Palette, PenTool, Eye, Edit3, Send,
  CheckCircle, AlertCircle, Coins, TrendingUp
} from 'lucide-react';
import axios from 'axios';
// Simple toast replacement (uses browser alert as fallback)
const toast = {
  success: (msg) => {
    if (typeof window !== 'undefined') {
      // Try to use existing toast if available, otherwise alert
      if (window.toast?.success) {
        window.toast.success(msg);
      } else {
        alert(msg);
      }
    }
  },
  error: (msg) => {
    if (typeof window !== 'undefined') {
      if (window.toast?.error) {
        window.toast.error(msg);
      } else {
        alert(msg);
      }
    }
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Create axios instance with longer timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 180000 // 3 minutes for AI generation
});

const NICHES = [
  { id: 'technology', label: 'Technology', icon: '💻', color: 'blue' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🌟', color: 'pink' },
  { id: 'business', label: 'Business', icon: '💼', color: 'green' },
  { id: 'health', label: 'Health & Wellness', icon: '🏃', color: 'red' },
  { id: 'finance', label: 'Finance', icon: '💰', color: 'yellow' },
  { id: 'education', label: 'Education', icon: '📚', color: 'purple' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'orange' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: 'cyan' },
  { id: 'food', label: 'Food & Cooking', icon: '🍳', color: 'amber' },
  { id: 'sports', label: 'Sports', icon: '⚽', color: 'emerald' },
  { id: 'fashion', label: 'Fashion', icon: '👗', color: 'fuchsia' },
  { id: 'faith', label: 'Faith & Spirituality', icon: '🙏', color: 'indigo' },
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
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    category: 'lifestyle',
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
      const res = await api.get('/api/rewards/wallet', { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });
      setTokenBalance(res.data.balance || res.data.wallet?.balance || 0);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  // Simulated progress for better UX during long generation
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setProgressMessage('');
      return;
    }

    const messages = [
      { time: 0, msg: 'Starting AI generation...', pct: 5 },
      { time: 3000, msg: '🤖 Calling AI model...', pct: 15 },
      { time: 8000, msg: '📝 Generating content...', pct: 30 },
      { time: 20000, msg: '✍️ Writing sections...', pct: 45 },
      { time: 40000, msg: '🖼️ Finding images...', pct: 60 },
      { time: 60000, msg: '#️⃣ Creating hashtags...', pct: 75 },
      { time: 80000, msg: '🔍 Optimizing SEO...', pct: 85 },
      { time: 100000, msg: '✨ Finalizing blog...', pct: 95 },
    ];

    const timers = messages.map(({ time, msg, pct }) => 
      setTimeout(() => {
        if (loading) {
          setProgressMessage(msg);
          setProgress(pct);
        }
      }, time)
    );

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please enter a blog topic');
      return;
    }

    setLoading(true);
    setProgress(5);
    setProgressMessage('Starting AI generation...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to generate blogs');
        router.push('/auth/login');
        return;
      }

      console.log('🚀 Starting blog generation...');
      
      // Use the content create-blog endpoint
      const res = await api.post('/api/content/create-blog', {
        topic: formData.topic,
        description: formData.description,
        niche: formData.category,
        tone: formData.tone,
        length: formData.length,
        generateImage: formData.includeImage,
        autoPublish: false
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 180000 // 3 minutes
      });

      console.log('📥 Response received:', res.data);

      if (res.data.ok || res.data.success || res.data.blog) {
        const blog = res.data.blog || res.data;
        setGeneratedBlog(blog);
        setStep(3);
        setProgress(100);
        toast.success(`🎉 Blog generated! Earned ${res.data.tokensEarned || 50} CYBEV tokens`);
        fetchTokenBalance();
      } else {
        throw new Error(res.data.error || res.data.message || 'Failed to generate blog');
      }
    } catch (err) {
      console.error('❌ Generation error:', err);
      
      // Better error messages
      let errorMsg = 'Failed to generate blog. Please try again.';
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMsg = 'Generation is taking longer than expected. The blog may still be created - check your drafts!';
      } else if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please login again.';
        router.push('/auth/login');
      } else if (err.response?.status === 500) {
        errorMsg = err.response?.data?.error || 'AI service temporarily unavailable. Please try again.';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedBlog?._id) {
      toast.error('No blog to publish');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/blogs/${generatedBlog._id}`, 
        { status: 'published' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Blog published successfully!');
      router.push(`/blog/${generatedBlog._id}`);
    } catch (err) {
      toast.error('Failed to publish blog');
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.topic.trim().length >= 5;
    if (step === 2) return formData.category;
    return true;
  };

  return (
    <AppLayout>
      <Head>
        <title>AI Blog Generator | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-20">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/studio" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI Blog Generator
                  </h1>
                  <p className="text-xs text-gray-500">Create SEO-optimized blogs with AI</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">{tokenBalance}</span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-4 gap-2">
              {[
                { num: 1, label: 'Topic' },
                { num: 2, label: 'Options' },
                { num: 3, label: 'Review' }
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    step === s.num 
                      ? 'bg-purple-600 text-white' 
                      : step > s.num 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < 2 && <div className={`w-8 h-1 mx-1 rounded ${step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Step 1: Topic */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">What do you want to write about?</h2>
                <p className="text-gray-500 mt-2">Enter your blog topic and let AI do the magic</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Topic *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., 10 Ways AI is Changing Healthcare in 2025"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-2">Be specific for better results</p>

                <label className="block text-sm font-medium text-gray-700 mb-2 mt-6">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any specific points, keywords, or angle you want the AI to focus on..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <label className="block text-sm font-medium text-gray-700 mb-3 mt-6">
                  Category / Niche *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {NICHES.map((niche) => (
                    <button
                      key={niche.id}
                      onClick={() => setFormData({ ...formData, category: niche.id })}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.category === niche.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{niche.icon}</span>
                      <div className="text-xs font-medium mt-1">{niche.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Options */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Customize Your Blog</h2>
                <p className="text-gray-500 mt-2">Choose tone, length, and features</p>
              </div>

              {/* Tone Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Writing Tone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TONES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setFormData({ ...formData, tone: tone.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.tone === tone.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Blog Length
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {LENGTHS.map((len) => (
                    <button
                      key={len.id}
                      onClick={() => setFormData({ ...formData, length: len.id })}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.length === len.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{len.label}</div>
                      <div className="text-xs text-gray-500">{len.words} words</div>
                      <div className="text-xs text-gray-400">{len.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed p-8 text-center">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Click to upload custom image</p>
                <p className="text-xs text-gray-400 mt-1">Or let AI find the perfect image</p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Include Features</h3>
                <div className="space-y-3">
                  {[
                    { key: 'includeImage', icon: ImageIcon, label: 'AI Featured Image', desc: 'Auto-find relevant images from Pexels/Unsplash', color: 'purple' },
                    { key: 'includeSEO', icon: Search, label: 'SEO Optimization', desc: 'Meta title, description, keywords, URL slug', color: 'blue' },
                    { key: 'includeHashtags', icon: Hash, label: 'Viral Hashtags', desc: 'AI-generated hashtags for social media', color: 'pink' },
                  ].map((feature) => (
                    <label 
                      key={feature.key}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData[feature.key] 
                          ? `border-${feature.color}-500 bg-${feature.color}-50` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <feature.icon className={`w-5 h-5 ${formData[feature.key] ? `text-${feature.color}-500` : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className={`font-medium ${formData[feature.key] ? `text-${feature.color}-700` : 'text-gray-700'}`}>
                          {feature.label}
                        </div>
                        <div className="text-xs text-gray-500">{feature.desc}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData[feature.key] 
                          ? `border-${feature.color}-500 bg-${feature.color}-500` 
                          : 'border-gray-300'
                      }`}>
                        {formData[feature.key] && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={formData[feature.key]}
                        onChange={(e) => setFormData({ ...formData, [feature.key]: e.target.checked })}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && generatedBlog && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Blog Generated! 🎉</h2>
                <p className="text-gray-500 mt-2">Review and publish your AI-generated blog</p>
              </div>

              {/* Blog Preview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {generatedBlog.featuredImage && (
                  <img 
                    src={generatedBlog.featuredImage} 
                    alt={generatedBlog.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{generatedBlog.title}</h3>
                  
                  {generatedBlog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {generatedBlog.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none text-gray-600 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedBlog.content?.substring(0, 1000) + '...' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push(`/blog/edit/${generatedBlog._id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Blog
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  <Send className="w-5 h-5" />
                  Publish Now
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
                  <div 
                    className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"
                    style={{ animationDuration: '1s' }}
                  />
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-600" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">Creating Your Blog</h3>
                <p className="text-sm text-gray-500 mb-4">{progressMessage}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{progress}% complete</p>
                
                <p className="text-xs text-gray-400 mt-4">
                  This may take 1-2 minutes. Please wait...
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {!loading && step < 3 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              {step < 2 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!canProceed() || loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate Blog
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
