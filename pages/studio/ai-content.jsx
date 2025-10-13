import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/DashboardLayout';

export default function AIContentPage() {
  const [activeTab, setActiveTab] = useState('blog_post');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState({
    niche: 'Technology',
    platform: 'general',
    title: '',
    contentType: 'blog'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [history, setHistory] = useState([]);
  const [templates, setTemplates] = useState([]);

  const contentTypes = [
    {
      id: 'blog_post',
      name: 'Blog Post',
      icon: '📝',
      description: 'Generate comprehensive blog posts with SEO optimization',
      placeholder: 'Enter your blog post topic (e.g., "How to start investing in cryptocurrency")'
    },
    {
      id: 'social_post',
      name: 'Social Media Post',
      icon: '📱',
      description: 'Create engaging social media content with hashtags',
      placeholder: 'Describe what you want to post about'
    },
    {
      id: 'title',
      name: 'Blog Titles',
      icon: '💡',
      description: 'Generate catchy, SEO-friendly blog titles',
      placeholder: 'Enter your topic or niche'
    },
    {
      id: 'description',
      name: 'Meta Description',
      icon: '🎯',
      description: 'Create SEO meta descriptions for better search ranking',
      placeholder: 'Enter your blog title or topic'
    },
    {
      id: 'hashtags',
      name: 'Hashtags',
      icon: '#️⃣',
      description: 'Generate trending hashtags for your content',
      placeholder: 'Describe your content topic'
    },
    {
      id: 'content_ideas',
      name: 'Content Ideas',
      icon: '💭',
      description: 'Get creative content ideas for your niche',
      placeholder: 'Enter your niche or industry'
    }
  ];

  const niches = [
    'Technology', 'Crypto', 'AI', 'Business', 'Finance', 'Health', 
    'Lifestyle', 'Travel', 'Food', 'Fashion', 'Gaming', 'Education',
    'Marketing', 'Fitness', 'Photography', 'Music', 'Art', 'Science'
  ];

  const platforms = [
    { id: 'general', name: 'General' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'tiktok', name: 'TikTok' }
  ];

  useEffect(() => {
    loadHistory();
    loadTemplates();
  }, []);

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('cybev_ai_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };

  const loadTemplates = () => {
    // Mock templates - in production, these would come from API
    setTemplates([
      {
        id: 1,
        name: 'Product Review',
        type: 'blog_post',
        prompt: 'Write a comprehensive review of [product name], including pros, cons, and recommendations'
      },
      {
        id: 2,
        name: 'How-To Guide',
        type: 'blog_post',
        prompt: 'Create a step-by-step guide on how to [action/process]'
      },
      {
        id: 3,
        name: 'Viral Tweet',
        type: 'social_post',
        prompt: 'Create a viral tweet about [trending topic] with engaging hook and call-to-action'
      },
      {
        id: 4,
        name: 'LinkedIn Post',
        type: 'social_post',
        prompt: 'Write a professional LinkedIn post about [industry insight] with personal experience'
      }
    ]);
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('cybev_token');
      const response = await axios.post('/api/ai/generate', {
        type: activeTab,
        prompt: prompt.trim(),
        context: {
          ...context,
          title: activeTab === 'description' ? prompt : context.title
        }
      }, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        setGeneratedContent(response.data.content);
        
        // Save to history
        const newHistoryItem = {
          id: Date.now(),
          type: activeTab,
          prompt: prompt.trim(),
          content: response.data.content,
          timestamp: new Date().toISOString(),
          tokensUsed: response.data.tokensUsed || 0
        };
        
        const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
        setHistory(updatedHistory);
        localStorage.setItem('cybev_ai_history', JSON.stringify(updatedHistory));
        
        toast.success(`Content generated! ${response.data.tokensEarned ? `+${response.data.tokensEarned} CYBV earned` : ''}`);
      } else {
        toast.error('Generation failed');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const useTemplate = (template) => {
    setPrompt(template.prompt);
    setActiveTab(template.type);
  };

  const saveContent = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybev-ai-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Content saved!');
  };

  const currentType = contentTypes.find(type => type.id === activeTab);

  return (
    <>
      <Head>
        <title>AI Content Generator - CYBEV</title>
        <meta name="description" content="Generate high-quality content with CYBEV AI" />
      </Head>

      <DashboardLayout title="AI Content Generator">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-2xl p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              🤖 CYBEV AI Content Generator
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Create high-quality content in seconds with our advanced AI. Earn CYBV tokens for every generation!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Content Types & Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Content Types */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Types</h3>
                <div className="space-y-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        activeTab === type.id
                          ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 border-2'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{type.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Niche/Category
                    </label>
                    <select
                      value={context.niche}
                      onChange={(e) => setContext(prev => ({ ...prev, niche: e.target.value }))}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                      {niches.map(niche => (
                        <option key={niche} value={niche}>{niche}</option>
                      ))}
                    </select>
                  </div>

                  {activeTab === 'social_post' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Platform
                      </label>
                      <select
                        value={context.platform}
                        onChange={(e) => setContext(prev => ({ ...prev, platform: e.target.value }))}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      >
                        {platforms.map(platform => (
                          <option key={platform.id} value={platform.id}>{platform.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeTab === 'description' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Blog Title
                      </label>
                      <input
                        type="text"
                        value={context.title}
                        onChange={(e) => setContext(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter your blog title"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Templates */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Templates</h3>
                <div className="space-y-2">
                  {templates
                    .filter(template => template.type === activeTab)
                    .map((template) => (
                      <button
                        key={template.id}
                        onClick={() => useTemplate(template)}
                        className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{template.prompt}</div>
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Right Column - Generator & Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Generator */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{currentType?.icon}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {currentType?.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentType?.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                      rows={4}
                      placeholder={currentType?.placeholder}
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {prompt.length}/500 characters
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateContent}
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      `✨ Generate ${currentType?.name}`
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Generated Content - FIXED: Removed duplicate opening div */}
              {generatedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Content</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(generatedContent)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={saveContent}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        💾 Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border">
                    <pre className="whitespace-pre-wrap text-gray-900 dark:text-white font-mono text-sm leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* History */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Generations</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                        onClick={() => {
                          setGeneratedContent(item.content);
                          setPrompt(item.prompt);
                          setActiveTab(item.type);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {contentTypes.find(t => t.id === item.type)?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {item.tokensUsed} tokens
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {item.prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tips */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  💡 Pro Tips for Better AI Content
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Be specific with your prompts for better results</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Include target audience in your description</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Mention desired tone (professional, casual, etc.)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Use templates for consistent results</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Edit and personalize generated content</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Save successful prompts for future use</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your AI Usage</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {history.length}
                    </div>
                    <div className="text-sm text-gray-500">Generations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {history.reduce((sum, item) => sum + (item.tokensUsed || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-500">Tokens Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {history.length * 2}
                    </div>
                    <div className="text-sm text-gray-500">CYBV Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
