// ============================================
// FILE: src/pages/studio/ai-blog.jsx
// PATH: cybev-frontend/src/pages/studio/ai-blog.jsx
// PURPOSE: AI Blog Generator with SEO, images, hashtags
// VERSION: 6.8.3 - Fixed .map() TypeError with null safety
// PREVIOUS: 6.5.0 - Original working version
// ROLLBACK: If issues, check API response format
// GITHUB: https://github.com/cybev1/cybev-frontend
// UPDATED: 2026-01-12
// ============================================

import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Wand2,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Rocket,
  Hash,
  Image as ImageIcon,
  Eye,
  TrendingUp,
  Coins,
  FileText,
  Tag,
  Upload,
  X
} from 'lucide-react';

export default function AIBlogGenerator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    niche: 'technology',
    tone: 'professional',
    length: 'medium',
    targetAudience: 'general',
    featuredImage: null,
    featuredImagePreview: null
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // FIXED: Ensure arrays are always defined
  const niches = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'health', label: 'Health & Wellness', icon: '🏥' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '✨' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'food', label: 'Food & Cooking', icon: '🍳' }
  ];

  const tones = [
    { id: 'professional', label: 'Professional', desc: 'Formal and authoritative' },
    { id: 'casual', label: 'Casual', desc: 'Friendly and conversational' },
    { id: 'educational', label: 'Educational', desc: 'Informative and clear' },
    { id: 'creative', label: 'Creative', desc: 'Imaginative and engaging' }
  ];

  const lengths = [
    { id: 'short', label: 'Short', words: '800-1200', time: '4-6 min read' },
    { id: 'medium', label: 'Medium', words: '1200-2000', time: '6-10 min read' },
    { id: 'long', label: 'Long', words: '2000-3000', time: '10-15 min read' }
  ];

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large! Maximum 10MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        featuredImagePreview: event.target?.result || null
      }));
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          featuredImage: data.url
        }));
        console.log('✅ Image uploaded:', data.url);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload image: ' + error.message);
      setFormData(prev => ({
        ...prev,
        featuredImage: null,
        featuredImagePreview: null
      }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null,
      featuredImagePreview: null
    }));
  };

  const handleGenerate = async () => {
    if (!formData.topic) {
      alert('Please enter a topic!');
      return;
    }

    setGenerating(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      console.log('🚀 Calling API:', `${API_URL}/api/content/create-blog`);
      console.log('📋 Request data:', formData);

      const requestData = {
        topic: formData.topic,
        niche: formData.niche,
        tone: formData.tone,
        length: formData.length,
        targetAudience: formData.targetAudience
      };

      if (formData.description?.trim()) {
        requestData.description = formData.description;
        console.log('📝 Including description for context');
      }

      if (formData.featuredImage) {
        requestData.featuredImage = formData.featuredImage;
        console.log('📸 Using user-uploaded featured image');
      }

      const response = await fetch(`${API_URL}/api/content/create-blog`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        
        if (response.status === 404) {
          throw new Error(
            'Backend route not found!\n\n' +
            'This means the backend needs to be deployed.\n\n' +
            'Check Railway logs for:\n' +
            '✅ Content routes loaded\n\n' +
            'OR contact support for help.'
          );
        }
        
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);

      if (data.success) {
        // FIXED: Ensure all expected fields have safe defaults
        const blog = data.data || {};
        const safeBlog = {
          ...blog,
          title: blog.title || 'Untitled Blog',
          summary: blog.summary || '',
          content: blog.content || '',
          readTime: blog.readTime || '5 min',
          viralityScore: blog.viralityScore || 50,
          initialTokens: blog.initialTokens || 0,
          // FIXED: Ensure hashtags is always an object with arrays
          hashtags: typeof blog.hashtags === 'object' && blog.hashtags !== null 
            ? Object.fromEntries(
                Object.entries(blog.hashtags).map(([key, value]) => [
                  key, 
                  Array.isArray(value) ? value : []
                ])
              )
            : {},
          // FIXED: Ensure seo is always an object with safe defaults
          seo: {
            title: blog.seo?.title || blog.title || '',
            description: blog.seo?.description || blog.summary || '',
            slug: blog.seo?.slug || '',
            // FIXED: Ensure keywords is always an array
            keywords: Array.isArray(blog.seo?.keywords) ? blog.seo.keywords : []
          },
          featuredImage: blog.featuredImage || null
        };
        
        setGeneratedBlog(safeBlog);
        setStep(3);
        
        alert(`🎉 Blog created! You earned ${data.tokensEarned || 0} tokens!\n\nVirality Score: ${safeBlog.viralityScore}/100`);
      } else {
        throw new Error(data.error || 'Failed to generate blog');
      }
    } catch (error) {
      console.error('❌ Generation error:', error);
      
      if (error.message.includes('Failed to fetch')) {
        alert(
          '🚨 Cannot connect to backend!\n\n' +
          'Please check:\n' +
          '1. Backend is deployed on Railway\n' +
          '2. NEXT_PUBLIC_API_URL is set correctly\n' +
          '3. No CORS issues\n\n' +
          'Error: ' + error.message
        );
      } else {
        alert('Failed to generate blog:\n\n' + error.message);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      console.log('📤 Publishing blog to database...');

      const response = await fetch(`${API_URL}/api/content/publish-blog`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blogData: generatedBlog
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('🎉 Blog published successfully!\n\nBlog ID: ' + (data.data?.blogId || 'N/A') + '\nTokens earned: ' + (data.data?.tokensEarned || 0) + '\n\nYour blog is now live in the feed!');
        router.push("/blog");
      } else {
        throw new Error(data.error || 'Failed to publish');
      }
    } catch (error) {
      console.error('❌ Publish error:', error);
      alert('Failed to publish blog:\n\n' + error.message + '\n\nPlease try again or contact support.');
    }
  };

  // FIXED: Helper function to safely get hashtag count
  const getHashtagCount = () => {
    if (!generatedBlog?.hashtags || typeof generatedBlog.hashtags !== 'object') {
      return 0;
    }
    return Object.values(generatedBlog.hashtags)
      .filter(Array.isArray)
      .flat()
      .length;
  };

  // FIXED: Helper function to safely render hashtags
  const renderHashtags = () => {
    if (!generatedBlog?.hashtags || typeof generatedBlog.hashtags !== 'object') {
      return null;
    }
    
    const entries = Object.entries(generatedBlog.hashtags);
    if (entries.length === 0) return null;
    
    return entries.map(([category, tags]) => {
      // FIXED: Ensure tags is an array before mapping
      const tagsArray = Array.isArray(tags) ? tags : [];
      if (tagsArray.length === 0) return null;
      
      return (
        <div key={category}>
          <p className="text-purple-600 text-sm mb-2 capitalize">{category}</p>
          <div className="flex flex-wrap gap-2">
            {tagsArray.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  // FIXED: Helper function to safely render keywords
  const renderKeywords = () => {
    const keywords = generatedBlog?.seo?.keywords;
    if (!Array.isArray(keywords) || keywords.length === 0) {
      return <span className="text-purple-600 text-sm">No keywords generated</span>;
    }
    
    return keywords.slice(0, 8).map((keyword, idx) => (
      <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-600 rounded-full text-xs">
        {keyword}
      </span>
    ));
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Wand2 className="w-10 h-10 text-gray-900" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              AI Blog Generator
            </h1>
            <p className="text-purple-200 text-lg">
              Create complete blog posts with SEO, images, and hashtags in seconds
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <motion.div
                  animate={{
                    scale: step >= num ? 1.2 : 1,
                    backgroundColor: step >= num ? '#A855F7' : '#374151'
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-gray-900 ${
                    step === num ? 'ring-4 ring-purple-500/30' : ''
                  }`}
                >
                  {step > num ? <Check className="w-6 h-6" /> : num}
                </motion.div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > num ? 'bg-purple-500' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Topic & Niche */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">What's your blog about?</h2>
                  <p className="text-purple-200 mb-8">Tell us your topic and choose a niche</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Blog Topic *
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="e.g., The Future of AI in Content Creation"
                        className="w-full px-6 py-4 bg-white/10 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-purple-300 focus:border-purple-500 focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-gray-900 font-semibold mb-2 flex items-center gap-2">
                        Brief Description (Optional)
                        <span className="text-purple-600 text-sm font-normal">
                          - Helps AI write more relevant content
                        </span>
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="e.g., This article explores how AI is transforming content creation, focusing on automated writing tools..."
                        className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-gray-200 text-gray-900 placeholder-purple-300 focus:border-purple-500 focus:outline-none resize-none min-h-[120px]"
                        maxLength={500}
                      />
                      <p className="text-purple-600 text-sm mt-2 flex items-center justify-between">
                        <span>💡 Add context to help AI understand your vision</span>
                        {/* FIXED: Safe access to description.length */}
                        <span>{500 - (formData.description?.length || 0)} characters</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-900 font-semibold mb-2 flex items-center gap-2">
                        Featured Image (Optional)
                        <span className="text-purple-600 text-sm font-normal">
                          - Or let AI generate one
                        </span>
                      </label>
                      
                      {!formData.featuredImagePreview ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-white/30 hover:border-purple-400 rounded-2xl p-8 cursor-pointer transition-all bg-white/5 hover:bg-white/10"
                        >
                          <div className="text-center">
                            {uploading ? (
                              <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
                            ) : (
                              <Upload className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                            )}
                            <p className="text-gray-900 font-semibold mb-2">
                              {uploading ? 'Uploading...' : 'Click to upload featured image'}
                            </p>
                            <p className="text-purple-600 text-sm">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group">
                          <img
                            src={formData.featuredImagePreview}
                            alt="Featured preview"
                            className="w-full h-64 object-cover rounded-2xl"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute top-4 right-4 p-2 bg-red-600 text-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          {formData.featuredImage && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-gray-900 rounded-full text-sm font-semibold flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              Uploaded
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      {!formData.featuredImage && (
                        <p className="text-purple-600 text-sm mt-2">
                          📸 Leave empty to let AI generate a perfect image for your blog
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-900 font-semibold mb-3">Choose Niche</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* FIXED: niches is always an array */}
                        {(niches || []).map((niche) => (
                          <motion.button
                            key={niche.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, niche: niche.id })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.niche === niche.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-gray-200 bg-white/5 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="text-3xl mb-2">{niche.icon}</div>
                            <div className="text-gray-900 text-sm font-semibold">{niche.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Tone & Length */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose your style</h2>
                  <p className="text-purple-200 mb-8">Select tone and length</p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4">Tone</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* FIXED: tones is always an array */}
                        {(tones || []).map((tone) => (
                          <motion.button
                            key={tone.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setFormData({ ...formData, tone: tone.id })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.tone === tone.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-gray-200 bg-white/5'
                            }`}
                          >
                            <div className="text-gray-900 font-bold mb-1">{tone.label}</div>
                            <div className="text-purple-200 text-xs">{tone.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4">Length</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {/* FIXED: lengths is always an array */}
                        {(lengths || []).map((length) => (
                          <motion.button
                            key={length.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setFormData({ ...formData, length: length.id })}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              formData.length === length.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-gray-200 bg-white/5'
                            }`}
                          >
                            <div className="text-gray-900 font-bold text-lg mb-1">{length.label}</div>
                            <div className="text-purple-200 text-sm">{length.words}</div>
                            <div className="text-purple-600 text-xs mt-1">{length.time}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Generated Result */}
              {step === 3 && generatedBlog && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-4"
                    >
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-semibold">Blog Created Successfully!</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{generatedBlog.title || 'Untitled'}</h2>
                    <p className="text-purple-200">{generatedBlog.summary || ''}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-gray-200">
                      <Eye className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-gray-900 font-bold">{generatedBlog.readTime || '5 min'}</p>
                      <p className="text-purple-200 text-xs">Read Time</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-gray-200">
                      <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
                      <p className="text-gray-900 font-bold">{generatedBlog.viralityScore || 0}/100</p>
                      <p className="text-purple-200 text-xs">Virality</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-gray-200">
                      <Coins className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-gray-900 font-bold">{generatedBlog.initialTokens || 0}</p>
                      <p className="text-purple-200 text-xs">Tokens Earned</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-gray-200">
                      <Hash className="w-5 h-5 text-pink-600 mb-2" />
                      {/* FIXED: Safe hashtag count */}
                      <p className="text-gray-900 font-bold">{getHashtagCount()}</p>
                      <p className="text-purple-200 text-xs">Hashtags</p>
                    </div>
                  </div>

                  {/* SEO Preview */}
                  <div className="bg-white/5 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      SEO Optimization
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-purple-600 text-sm mb-1">SEO Title</p>
                        <p className="text-gray-900">{generatedBlog.seo?.title || generatedBlog.title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm mb-1">Description</p>
                        <p className="text-gray-900 text-sm">{generatedBlog.seo?.description || generatedBlog.summary || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm mb-1">URL Slug</p>
                        <p className="text-blue-400 font-mono text-sm">{generatedBlog.seo?.slug || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm mb-1">Keywords</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {/* FIXED: Safe keywords rendering */}
                          {renderKeywords()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Image */}
                  {generatedBlog.featuredImage && (
                    <div className="bg-white/5 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-cyan-400" />
                        Featured Image
                      </h3>
                      <img
                        src={generatedBlog.featuredImage.url || generatedBlog.featuredImage}
                        alt={generatedBlog.featuredImage.alt || 'Featured image'}
                        className="w-full h-64 object-cover rounded-xl mb-3"
                      />
                      {generatedBlog.featuredImage.credit?.photographer && (
                        <p className="text-purple-200 text-sm">
                          Photo by {generatedBlog.featuredImage.credit.photographer}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Hashtags */}
                  {generatedBlog.hashtags && Object.keys(generatedBlog.hashtags).length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-pink-600" />
                        Viral Hashtags
                      </h3>
                      <div className="space-y-3">
                        {/* FIXED: Safe hashtags rendering */}
                        {renderHashtags()}
                      </div>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="bg-white/5 rounded-xl p-6 border border-gray-200 max-h-96 overflow-y-auto">
                    <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-400" />
                      Content Preview
                    </h3>
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: (generatedBlog.content || '').substring(0, 1000) + '...' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              {step > 1 && step < 3 && (
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-gray-900 rounded-xl font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}

              {step < 2 && (
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  onClick={() => setStep(2)}
                  disabled={!formData.topic}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-semibold ml-auto disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              {step === 2 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-bold text-lg ml-auto disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Generate Blog
                    </>
                  )}
                </motion.button>
              )}

              {step === 3 && (
                <div className="flex gap-3 ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setStep(1);
                      setGeneratedBlog(null);
                    }}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-gray-900 rounded-xl font-semibold"
                  >
                    Create Another
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-gray-900 rounded-xl font-bold"
                  >
                    <Rocket className="w-5 h-5" />
                    Publish Blog
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Generating Modal */}
          <AnimatePresence>
            {generating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-gray-200 text-center max-w-md"
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-gray-900" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Creating Your Blog...</h3>
                  <p className="text-purple-200 mb-6">AI is generating SEO-optimized content with images and hashtags</p>
                  
                  <div className="space-y-3">
                    {['Analyzing topic', 'Generating content', 'Optimizing SEO', 'Finding images', 'Creating hashtags'].map((text, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.5 }}
                        className="flex items-center gap-3 text-gray-900"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                        {text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
