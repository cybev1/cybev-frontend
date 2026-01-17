// ============================================
// FILE: src/pages/blog/create.jsx
// PURPOSE: Manual Blog/Article Creation
// VERSION: 2.1.0 - Fixed: White background, black text, image preview
// STYLE: Facebook-style clean white design
// ============================================

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Loader2,
  X,
  Upload,
  Wand2,
  RefreshCw,
  Image as ImageIcon
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
  const handleFeaturedImageSelect = async (e) => {
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

    // Show preview immediately using FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      setFeaturedImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setFeaturedImage(file);
    
    // Auto-upload the image
    await uploadFeaturedImage(file);
  };

  const uploadFeaturedImage = async (file) => {
    if (!file) return null;
    
    setUploadingFeatured(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

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
        // Update preview with uploaded URL
        setFeaturedImagePreview(data.url);
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
          size: '1792x1024',
          quality: 'hd'
        })
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        setFeaturedImageUrl(data.url);
        setFeaturedImagePreview(data.url);
        setFeaturedImage(null);
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

        const response = await fetch(`${API_URL}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (data.success && data.url) {
          const quill = quillRef.current?.getEditor();
          if (quill) {
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
  const handleSave = async (publishStatus = 'draft') => {
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
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const blogData = {
        siteId: siteId || null,
        authorName: user?.name || user?.username || "User",
        title: title.trim(),
        content,
        excerpt: description.trim(),
        featuredImage: featuredImageUrl || featuredImagePreview || '',
        tags,
        category: category.toLowerCase(),
        status: publishStatus,
        readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200)
      };

      console.log('📝 Saving blog:', blogData.title);

      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();

      if (data.success || data.blog || data.ok) {
        alert(`✅ Article ${publishStatus === 'published' ? 'published' : 'saved as draft'}!`);
        router.push('/blog');
      } else {
        throw new Error(data.error || 'Failed to save article');
      }

    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Failed to save article: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Article - CYBEV</title>
      </Head>
      
      {/* FACEBOOK-STYLE WHITE BACKGROUND */}
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        {/* Header - White */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderBottom: '1px solid #dddfe2',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => router.back()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#65676b',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 500
                }}
              >
                <ArrowLeft style={{ width: 20, height: 20 }} />
                Back
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e4e6eb',
                    color: '#050505',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Save style={{ width: 16, height: 16 }} />
                  Save Draft
                </button>
                
                <button
                  onClick={() => handleSave('published')}
                  disabled={loading}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(to right, #7c3aed, #db2777)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Sparkles style={{ width: 16, height: 16 }} />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - White Card */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            
            {/* Title - BLACK TEXT on WHITE */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title..."
              style={{
                width: '100%',
                fontSize: '28px',
                fontWeight: 700,
                color: '#050505',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                marginBottom: '16px'
              }}
              maxLength={200}
            />

            {/* Description/Excerpt */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#050505',
                marginBottom: '8px'
              }}>
                Description (Excerpt) *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief description of your article..."
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f0f2f5',
                  border: '1px solid #dddfe2',
                  borderRadius: '6px',
                  color: '#050505',
                  fontSize: '15px',
                  resize: 'none',
                  outline: 'none'
                }}
                rows={3}
                maxLength={300}
              />
              <div style={{ fontSize: '12px', color: '#65676b', textAlign: 'right', marginTop: '4px' }}>
                {description.length}/300 characters
              </div>
            </div>

            {/* Featured Image Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#050505',
                marginBottom: '8px'
              }}>
                Featured Image
              </label>
              
              {!featuredImagePreview ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Upload Option */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      flex: 1,
                      border: '2px dashed #dddfe2',
                      borderRadius: '8px',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload style={{ width: 32, height: 32, color: '#65676b', margin: '0 auto 8px' }} />
                    <p style={{ color: '#050505', fontWeight: 500, fontSize: '14px', margin: 0 }}>Upload Image</p>
                    <p style={{ color: '#65676b', fontSize: '12px', margin: '4px 0 0' }}>PNG, JPG up to 10MB</p>
                  </div>
                  
                  {/* AI Generate Option */}
                  <div
                    onClick={!generatingImage ? generateAIImage : undefined}
                    style={{
                      flex: 1,
                      border: '2px dashed #dddfe2',
                      borderRadius: '8px',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: generatingImage ? 'not-allowed' : 'pointer',
                      opacity: generatingImage ? 0.5 : 1
                    }}
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 style={{ width: 32, height: 32, color: '#db2777', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                        <p style={{ color: '#050505', fontWeight: 500, fontSize: '14px', margin: 0 }}>Generating...</p>
                      </>
                    ) : (
                      <>
                        <Wand2 style={{ width: 32, height: 32, color: '#db2777', margin: '0 auto 8px' }} />
                        <p style={{ color: '#050505', fontWeight: 500, fontSize: '14px', margin: 0 }}>Generate with AI</p>
                        <p style={{ color: '#65676b', fontSize: '12px', margin: '4px 0 0' }}>From your title</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dddfe2' }}>
                  <img
                    src={featuredImagePreview}
                    alt="Featured"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                  />
                  {uploadingFeatured && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ color: '#fff', textAlign: 'center' }}>
                        <Loader2 style={{ width: 32, height: 32, animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
                        <p style={{ margin: 0, fontSize: '14px' }}>Uploading...</p>
                      </div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                      title="Replace image"
                    >
                      <RefreshCw style={{ width: 16, height: 16, color: '#050505' }} />
                    </button>
                    <button
                      onClick={removeFeaturedImage}
                      style={{
                        padding: '8px',
                        backgroundColor: '#e4405f',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                      title="Remove image"
                    >
                      <X style={{ width: 16, height: 16, color: '#fff' }} />
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageSelect}
                style={{ display: 'none' }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#050505',
                marginBottom: '8px'
              }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f0f2f5',
                  border: '1px solid #dddfe2',
                  borderRadius: '6px',
                  color: '#050505',
                  fontSize: '15px',
                  outline: 'none'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#050505',
                marginBottom: '8px'
              }}>
                Tags
              </label>
              {tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#e4e6eb',
                        color: '#050505',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                      >
                        <X style={{ width: 14, height: 14, color: '#65676b' }} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleAddTag}
                placeholder="Type a tag and press Enter..."
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f0f2f5',
                  border: '1px solid #dddfe2',
                  borderRadius: '6px',
                  color: '#050505',
                  fontSize: '15px',
                  outline: 'none'
                }}
                maxLength={30}
              />
              <p style={{ fontSize: '12px', color: '#65676b', marginTop: '4px' }}>
                Press Enter to add tags (max 10)
              </p>
            </div>

            {/* Rich Text Editor */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#050505',
                marginBottom: '8px'
              }}>
                Content *
              </label>
              <p style={{ fontSize: '12px', color: '#65676b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                💡 Tip: Click the image icon in the toolbar to insert images into your article
              </p>
              <div style={{ border: '1px solid #dddfe2', borderRadius: '6px', overflow: 'hidden' }}>
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
                if (!title || !content) {
                  alert('Please add a title and content first');
                  return;
                }
                const previewWindow = window.open('', '_blank');
                previewWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Preview: ${title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f2f5; padding: 20px; }
                      .container { max-width: 680px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
                      h1 { font-size: 28px; color: #050505; margin-bottom: 12px; font-weight: 700; }
                      .meta { color: #65676b; font-size: 13px; margin-bottom: 20px; }
                      .featured-img { width: 100%; border-radius: 8px; margin-bottom: 20px; }
                      .content { color: #050505; line-height: 1.7; font-size: 16px; }
                      .content h2 { font-size: 22px; margin: 20px 0 12px; }
                      .content p { margin-bottom: 16px; }
                      .content img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
                      .tags { margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap; }
                      .tag { background: #e4e6eb; color: #050505; padding: 4px 12px; border-radius: 16px; font-size: 13px; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>${title}</h1>
                      <div class="meta">${category} • ${Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read</div>
                      ${featuredImagePreview ? `<img src="${featuredImagePreview}" class="featured-img" alt="">` : ''}
                      <div class="content">${content}</div>
                      ${tags.length > 0 ? `<div class="tags">${tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : ''}
                    </div>
                  </body>
                  </html>
                `);
                previewWindow.document.close();
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#e4e6eb',
                color: '#050505',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Eye style={{ width: 20, height: 20 }} />
              Preview Article
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Quill Editor Styles */
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #dddfe2 !important;
          background: #f0f2f5;
        }
        .ql-container {
          border: none !important;
          font-size: 16px;
          min-height: 300px;
        }
        .ql-editor {
          min-height: 300px;
          color: #050505;
          padding: 16px;
          background: #fff;
        }
        .ql-editor.ql-blank::before {
          color: #65676b;
          font-style: normal;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 12px 0;
        }
      `}</style>
    </>
  );
}
