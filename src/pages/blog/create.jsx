// ============================================
// FILE: src/pages/blog/create.jsx
// PURPOSE: Manual Blog/Article Creation with Image Uploads
// VERSION: 2.0.0 - Fixed image uploads
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  X,
  Upload,
  Plus,
  Wand2,
  RefreshCw
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function CreateBlog() {
  const router = useRouter();
  const siteId = typeof router.query.site === 'string' ? router.query.site : null;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('technology');
  const [status, setStatus] = useState('draft');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

  const categories = [
    'Technology', 'Business', 'Lifestyle', 'Health', 'Science',
    'Entertainment', 'Sports', 'Politics', 'Education', 'Travel',
    'Food', 'Fashion', 'Finance', 'Marketing', 'Spirituality'
  ];

  // ==========================================
  // FEATURED IMAGE UPLOAD
  // ==========================================
  const handleFeaturedImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image is too large. Maximum size is 10MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    setFeaturedImage(file);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setFeaturedImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadFeaturedImage = async () => {
    if (!featuredImage) return null;
    
    setUploadingFeatured(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', featuredImage);

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        setFeaturedImageUrl(data.url);
        console.log('✅ Featured image uploaded:', data.url);
        return data.url;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Featured image upload error:', error);
      alert('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setUploadingFeatured(false);
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview('');
    setFeaturedImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ==========================================
  // AI IMAGE GENERATION
  // ==========================================
  const generateAIImage = async () => {
    if (!title && !description) {
      alert('Please enter a title or description first to generate a relevant image');
      return;
    }

    setGeneratingImage(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create a more specific prompt based on the article content
      const imagePrompt = `Professional blog featured image for article titled "${title}". 
Topic: ${description || title}. 
Category: ${category}. 
Style: Modern, clean, professional photography or illustration suitable for a blog header.
DO NOT include any text or words in the image.`;

      const response = await fetch(`${API_URL}/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: 'professional',
          size: '1792x1024', // Wide format for blog headers
          quality: 'hd'
        })
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        setFeaturedImageUrl(data.url);
        setFeaturedImagePreview(data.url);
        setFeaturedImage(null); // Clear file since we have URL
        console.log('✅ AI image generated:', data.url);
      } else {
        throw new Error(data.error || 'Image generation failed');
      }
    } catch (error) {
      console.error('❌ AI image generation error:', error);
      alert('Failed to generate image. Please try uploading manually.');
    } finally {
      setGeneratingImage(false);
    }
  };

  // ==========================================
  // IN-TEXT IMAGE UPLOAD (Quill)
  // ==========================================
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        alert('Image is too large. Maximum size is 10MB.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        // Show loading state
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertText(range.index, 'Uploading image...', { italic: true, color: '#888' });
        }

        const response = await fetch(`${API_URL}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (data.success && data.url) {
          if (quill) {
            // Remove loading text
            const currentContent = quill.getText();
            const loadingIndex = currentContent.indexOf('Uploading image...');
            if (loadingIndex !== -1) {
              quill.deleteText(loadingIndex, 18);
            }
            
            // Insert image
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', data.url);
            quill.setSelection(range.index + 1);
          }
          console.log('✅ In-text image uploaded:', data.url);
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        console.error('❌ In-text image upload error:', error);
        alert('Failed to upload image: ' + error.message);
        
        // Remove loading text on error
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const currentContent = quill.getText();
          const loadingIndex = currentContent.indexOf('Uploading image...');
          if (loadingIndex !== -1) {
            quill.deleteText(loadingIndex, 18);
          }
        }
      }
    };
  }, []);

  // Quill modules with custom image handler
  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        [{ color: [] }, { background: [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  // ==========================================
  // TAGS
  // ==========================================
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // ==========================================
  // SAVE BLOG
  // ==========================================
  const handleSave = async (publishStatus = status) => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!content.trim() || content === '<p><br></p>') {
      alert('Please enter some content');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Upload featured image if selected but not yet uploaded
      let finalImageUrl = featuredImageUrl;
      if (featuredImage && !featuredImageUrl) {
        finalImageUrl = await uploadFeaturedImage();
      }

      const blogData = {
        siteId: siteId || null,
        authorName: JSON.parse(localStorage.getItem("user"))?.name || "User",
        title,
        content,
        excerpt: description,
        featuredImage: finalImageUrl || '',
        tags,
        category: category.toLowerCase(),
        status: publishStatus,
        readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200)
      };

      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();

      if (data.success || data.blog) {
        alert(`✅ Blog ${publishStatus === 'published' ? 'published' : 'saved as draft'}!`);
        router.push('/blog');
      } else {
        throw new Error(data.error || 'Failed to save blog');
      }

    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Failed to save blog: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Article - CYBEV</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                
                <button
                  onClick={() => handleSave('published')}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title..."
              className="w-full text-4xl font-bold mb-6 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              maxLength={200}
            />

            {/* Description/Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                Description (Excerpt) *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief description of your article..."
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                rows={3}
                maxLength={300}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
                {description.length}/300 characters
              </div>
            </div>

            {/* Featured Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                Featured Image
              </label>
              
              {!featuredImagePreview ? (
                <div className="flex gap-4">
                  {/* Upload Option */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                  >
                    <Upload className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                    <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">
                      Upload Image
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                  
                  {/* AI Generate Option */}
                  <div
                    onClick={generateAIImage}
                    className={`flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all ${generatingImage ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 className="w-10 h-10 text-pink-600 mx-auto mb-3 animate-spin" />
                        <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">
                          Generating...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Creating AI image
                        </p>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                        <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">
                          Generate with AI
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Create image from title
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={featuredImagePreview}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                      title="Replace image"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={removeFeaturedImage}
                      className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {uploadingFeatured && (
                    <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                      <div className="text-white text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p>Uploading...</p>
                      </div>
                    </div>
                  )}
                  {featuredImage && (
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                      {featuredImage?.name}
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageSelect}
                className="hidden"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()} className="bg-white dark:bg-gray-700">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 dark:hover:text-red-400"
                    >
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
                placeholder="Type a tag and press Enter..."
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                maxLength={30}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Press Enter to add tags (max 10)
              </p>
            </div>

            {/* Rich Text Editor */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                Content *
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                💡 Tip: Click the image icon in the toolbar to insert images into your article
              </p>
              <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  placeholder="Write your article content here..."
                  theme="snow"
                  modules={quillModules}
                />
              </div>
            </div>

            {/* Preview Button */}
            <button
              onClick={() => {
                // Open preview in new tab
                const previewContent = {
                  title,
                  description,
                  content,
                  featuredImage: featuredImagePreview || featuredImageUrl,
                  category,
                  tags
                };
                localStorage.setItem('blog-preview', JSON.stringify(previewContent));
                window.open('/blog/preview/draft', '_blank');
              }}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Preview Article
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #e5e7eb !important;
          background: #f9fafb;
        }
        .dark .ql-toolbar {
          background: #374151;
          border-color: #4b5563 !important;
        }
        .dark .ql-toolbar .ql-stroke {
          stroke: #d1d5db;
        }
        .dark .ql-toolbar .ql-fill {
          fill: #d1d5db;
        }
        .dark .ql-toolbar .ql-picker {
          color: #d1d5db;
        }
        .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #e5e7eb !important;
          font-size: 16px;
          min-height: 400px;
        }
        .dark .ql-container {
          border-color: #4b5563 !important;
        }
        .ql-editor {
          min-height: 400px;
          color: #111827;
        }
        .dark .ql-editor {
          color: #f3f4f6;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .dark .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </>
  );
}
