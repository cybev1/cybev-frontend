// ============================================
// FILE: src/pages/blog/edit/[id].jsx
// PURPOSE: Edit Blog Page
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft, Save, Eye, Image as ImageIcon, X, Loader2, Sparkles, Upload, Trash2, Clock, Globe, Lock
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Try multiple endpoints
      let response;
      try {
        response = await api.get(`/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // Try alternate endpoint
        response = await api.get(`/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const blogData = response.data.blog || response.data;
      setBlog(blogData);
      setTitle(blogData.title || '');
      setContent(blogData.content || '');
      setExcerpt(blogData.excerpt || '');
      setFeaturedImage(blogData.featuredImage || blogData.coverImage || '');
      setTags(blogData.tags || []);
      setStatus(blogData.status || 'draft');
      setCategory(blogData.category || '');
    } catch (err) {
      console.error('Fetch blog error:', err);
      toast.error('Failed to load blog');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleSave = async (newStatus = status) => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      const updateData = {
        title,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160),
        featuredImage,
        tags,
        status: newStatus,
        category
      };

      await api.put(`/api/blogs/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus(newStatus);
      toast.success(newStatus === 'published' ? 'Blog published!' : 'Blog saved!');
      
      if (newStatus === 'published') {
        router.push(`/blog/${id}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save blog');
    }
    setSaving(false);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, convert to base64 or use your upload endpoint
    const reader = new FileReader();
    reader.onload = () => {
      setFeaturedImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Or use upload API:
    // const formData = new FormData();
    // formData.append('file', file);
    // const res = await api.post('/api/upload', formData);
    // setFeaturedImage(res.data.url);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Blog deleted');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>Edit Blog - CYBEV</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 hover:bg-gray-800 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Edit Blog</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                {status === 'published' ? (
                  <><Globe className="w-3 h-3" /> Published</>
                ) : (
                  <><Lock className="w-3 h-3" /> Draft</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <Link href={`/blog/${id}`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </Link>
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Publish
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-6">
          {featuredImage ? (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={featuredImage}
                alt="Featured"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setFeaturedImage('')}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <label className="block w-full h-48 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
              <div className="flex flex-col items-center justify-center h-full">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-gray-400">Click to upload featured image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="w-full text-3xl font-bold bg-transparent text-white placeholder-gray-500 focus:outline-none mb-6"
        />

        {/* Excerpt */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Excerpt (optional)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of your blog..."
            rows={2}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none"
          />
        </div>

        {/* Content Editor */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Content</label>
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here... (HTML supported)"
            rows={15}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="crypto">Crypto & Web3</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleAddTag}
            placeholder="Add tag and press Enter..."
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Last updated: {blog?.updatedAt ? new Date(blog.updatedAt).toLocaleString() : 'Never'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50"
            >
              {status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
