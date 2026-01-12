// ============================================
// FILE: src/pages/create.jsx
// Create Short Blog Post Page
// Formerly "Create Social Post" - now focused on blogging
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Image as ImageIcon, Video, Send, Loader2, X, Upload, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function CreateShortBlog() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl('');
  };

  const handleImageUrlChange = (url) => {
    setImageUrl(url);
    if (url) {
      setImageFile(null);
      setImagePreview('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    setPublishing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      let finalImageUrl = imageUrl;
      
      // Upload image if file selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
          const uploadRes = await api.post('/api/upload/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          finalImageUrl = uploadRes.data?.url || '';
        } catch (uploadErr) {
          console.log('Image upload failed, continuing without image');
        }
      }

      // Create the short blog post (using blog API)
      const blogData = {
        title: title.trim() || content.slice(0, 50).trim() + (content.length > 50 ? '...' : ''),
        content: content,
        excerpt: content.slice(0, 200),
        featuredImage: finalImageUrl,
        status: 'published',
        category: 'general',
        isShortPost: true // Flag for short posts
      };

      const response = await api.post('/api/blogs', blogData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.blog || response.data?._id) {
        toast.success('🎉 Blog post published!');
        router.push('/feed');
      } else {
        throw new Error('Failed to create post');
      }

    } catch (error) {
      console.error('Publish error:', error);
      toast.error(error.response?.data?.error || 'Failed to publish');
    }

    setPublishing(false);
  };

  return (
    <>
      <Head>
        <title>Create Short Blog | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-transparent px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-gray-900 cursor-pointer hover:bg-white/30">
                  <span className="text-xl font-bold">C</span>
                </div>
              </Link>
              <span className="text-gray-900 font-bold text-xl">CYBEV</span>
            </div>
            <button onClick={() => router.push('/feed')} className="text-gray-900 text-sm">
              ≡
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 pb-24">
          {/* Title Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Short Blog</h1>
            <Link href="/feed">
              <span className="text-white/80 text-sm hover:text-gray-900 cursor-pointer">Back to Feed</span>
            </Link>
          </div>

          <p className="text-white/70 text-sm mb-6">
            Share a quick thought, update, or mini article. For full blog posts, use{' '}
            <Link href="/studio">
              <span className="text-purple-600 underline cursor-pointer">Create Blog Post</span>
            </Link>.
          </p>

          {/* Title Input (Optional) */}
          <div className="mb-4">
            <label className="text-white/80 text-sm mb-2 block">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="w-full px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              maxLength={100}
            />
          </div>

          {/* Content Textarea */}
          <div className="mb-4">
            <label className="text-white/80 text-sm mb-2 block">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share a thought, insight, update, or quick article..."
              className="w-full px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
              rows={6}
              maxLength={2000}
            />
            <div className="text-right text-white/60 text-xs mt-1">{content.length}/2000</div>
          </div>

          {/* Image Section */}
          <div className="mb-4">
            <label className="text-white/80 text-sm mb-2 block">Image (optional)</label>
            
            {/* Image Preview */}
            {(imagePreview || imageUrl) && (
              <div className="relative mb-3 rounded-xl overflow-hidden">
                <img 
                  src={imagePreview || imageUrl} 
                  alt="Preview" 
                  className="w-full max-h-64 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    toast.error('Invalid image URL');
                  }}
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-gray-900/50 rounded-full text-gray-900 hover:bg-gray-900/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-gray-900 rounded-xl hover:bg-white/20 transition"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Or URL Input */}
            <div className="mt-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="Or paste image URL..."
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-gray-900 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={publishing || !content.trim()}
            className="w-full py-4 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
          >
            {publishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publish
              </>
            )}
          </button>

          {/* Quick AI Write Option */}
          <Link href="/studio">
            <div className="mt-4 p-4 bg-white/10 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/20 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold">Write with AI</p>
                <p className="text-white/60 text-sm">Generate a full blog post with AI</p>
              </div>
            </div>
          </Link>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </button>
          </Link>
          
          <Link href="/search">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs mt-1">Search</span>
            </button>
          </Link>
          
          <button className="relative -mt-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
          
          <Link href="/notifications">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-xs mt-1">Alerts</span>
            </button>
          </Link>
          
          <Link href="/profile">
            <button className="flex flex-col items-center py-2 px-4 text-purple-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </Link>
        </nav>
      </div>
    </>
  );
}
