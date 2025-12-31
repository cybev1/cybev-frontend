// ============================================
// FILE: pages/blog/edit/[id].jsx
// Blog Edit Page - Edit existing blog posts
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { 
  FiSave, 
  FiArrowLeft, 
  FiImage, 
  FiTag, 
  FiLoader,
  FiTrash2,
  FiEye,
  FiAlertCircle
} from 'react-icons/fi';

// Dynamic import for rich text editor (avoid SSR issues)
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-white/5 rounded-lg animate-pulse" />
});
import 'react-quill/dist/quill.snow.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cybev-backend-production.up.railway.app';

const CATEGORIES = [
  'Technology',
  'Business & Finance',
  'Health & Wellness',
  'Lifestyle',
  'Education',
  'Entertainment',
  'Food & Cooking',
  'Travel',
  'Science',
  'Sports',
  'Fashion & Beauty',
  'Personal Development',
  'News & Politics',
  'Environment',
  'Other'
];

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    category: 'Technology',
    tags: [],
    featuredImage: '',
    status: 'published'
  });
  
  const [tagInput, setTagInput] = useState('');

  // Fetch blog data
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Try multiple endpoints
      let response = await fetch(`${API_URL}/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // If not found, try content routes
      if (!response.ok && response.status === 404) {
        response = await fetch(`${API_URL}/api/content/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (!response.ok) {
        throw new Error('Blog not found');
      }

      const data = await response.json();
      const blogData = data.blog || data.data || data;
      
      setBlog({
        title: blogData.title || '',
        content: blogData.content || '',
        category: blogData.category || 'Technology',
        tags: blogData.tags || [],
        featuredImage: blogData.featuredImage || '',
        status: blogData.status || 'published'
      });
      
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!blog.title.trim()) {
        setError('Title is required');
        return;
      }

      if (!blog.content.trim()) {
        setError('Content is required');
        return;
      }

      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          category: blog.category,
          tags: blog.tags,
          featuredImage: blog.featuredImage,
          status: blog.status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update blog');
      }

      setSuccess('Blog updated successfully!');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(err.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete blog');
      }

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError(err.message || 'Failed to delete blog');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !blog.tags.includes(tag) && blog.tags.length < 10) {
      setBlog(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Quill editor modules
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Blog | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(`/blog/${id}`, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <FiEye className="w-4 h-4" />
                Preview
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {saving ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-400">{success}</p>
            </div>
          )}

          {/* Edit Form */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-white/70 mb-2 text-sm">Title</label>
              <input
                type="text"
                value={blog.title}
                onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter blog title..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 text-lg"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                <FiImage className="w-4 h-4" />
                Featured Image URL
              </label>
              <input
                type="url"
                value={blog.featuredImage}
                onChange={(e) => setBlog(prev => ({ ...prev, featuredImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              />
              {blog.featuredImage && (
                <div className="mt-3">
                  <img 
                    src={blog.featuredImage} 
                    alt="Featured" 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-2 text-sm">Category</label>
                <select
                  value={blog.category}
                  onChange={(e) => setBlog(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white/70 mb-2 text-sm">Status</label>
                <select
                  value={blog.status}
                  onChange={(e) => setBlog(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="published" className="bg-gray-900">Published</option>
                  <option value="draft" className="bg-gray-900">Draft</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                <FiTag className="w-4 h-4" />
                Tags ({blog.tags.length}/10)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-white/70 mb-2 text-sm">Content</label>
              <div className="bg-white rounded-lg">
                <ReactQuill
                  value={blog.content}
                  onChange={(content) => setBlog(prev => ({ ...prev, content }))}
                  modules={quillModules}
                  theme="snow"
                  placeholder="Write your blog content..."
                  className="h-96"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Delete Blog Post?</h3>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete "{blog.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #e5e7eb !important;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e5e7eb !important;
          font-size: 16px;
        }
        .ql-editor {
          min-height: 300px;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </>
  );
}
