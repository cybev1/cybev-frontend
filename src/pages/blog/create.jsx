import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { blogAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { PenTool, Save, Eye, Sparkles, TrendingUp } from 'lucide-react';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = [
  'Technology',
  'Health & Wellness',
  'Business & Finance',
  'Lifestyle',
  'Travel',
  'Food & Cooking',
  'Education',
  'Entertainment',
  'Science',
  'Sports',
  'Fashion & Beauty',
  'Personal Development',
  'News & Politics',
  'Environment',
  'Other'
];

export default function CreateBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    tags: ''
  });

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create a blog');
        router.push('/auth/login');
      }
    }
  }, [router]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const response = await blogAPI.createBlog(payload);
      
      if (response.data.ok) {
        toast.success(`🎉 Blog published! You earned ${response.data.tokensEarned} tokens!`);
        router.push('/blog');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PenTool className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Create Blog Post</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <Eye className="w-4 h-4" />
                {preview ? 'Edit' : 'Preview'}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-4">
          <Sparkles className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-white font-semibold">Earn 50 Tokens!</h3>
            <p className="text-gray-300 text-sm">Publishing this blog will reward you with tokens. Keep your streak going!</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!preview ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="e.g., coding, javascript, web development"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-white font-medium mb-2">
                Content *
              </label>
              <div className="bg-white rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  modules={modules}
                  className="h-96"
                  placeholder="Write your amazing content here..."
                />
              </div>
            </div>

            {/* Submit Button (Mobile) */}
            <div className="md:hidden">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Publishing...' : 'Publish Blog'}
              </button>
            </div>
          </form>
        ) : (
          // Preview Mode
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm mb-4">
                {formData.category}
              </span>
              <h1 className="text-4xl font-bold text-white mb-4">
                {formData.title || 'Untitled'}
              </h1>
              {formData.tags && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.content || '<p className="text-gray-400">No content yet...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Tips Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Tips for Great Content</h3>
          </div>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Use a catchy, descriptive title</li>
            <li>• Break content into sections with headers</li>
            <li>• Add relevant images to engage readers</li>
            <li>• Use tags to help readers find your content</li>
            <li>• Proofread before publishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
