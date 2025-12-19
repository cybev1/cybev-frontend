import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  X,
  Upload
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for rich text editor
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function CreateBlog() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // NEW: Meta description/excerpt
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null); // NEW: Featured image
  const [featuredImagePreview, setFeaturedImagePreview] = useState(''); // NEW: Preview
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('technology');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    'Technology', 'Business', 'Lifestyle', 'Health', 'Science',
    'Entertainment', 'Sports', 'Politics', 'Education', 'Travel'
  ];

  // Handle featured image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Maximum size is 5MB.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    setFeaturedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFeaturedImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Save blog
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      // For now, use placeholder for featured image
      // TODO: Upload to Cloudinary/S3 first
      let featuredImageUrl = '';
      if (featuredImage) {
        // Placeholder - in production, upload to cloud storage
        featuredImageUrl = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643';
        console.log('📸 Featured image selected:', featuredImage.name);
        console.log('⚠️ TODO: Upload to Cloudinary/S3');
      }

      const blogData = {
        title,
        content,
        excerpt: description, // Meta description
        featuredImage: featuredImageUrl,
        tags,
        category: category.toLowerCase(),
        status: publishStatus,
        readTime: Math.ceil(content.split(' ').length / 200) // Estimate reading time
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

      if (data.success) {
        alert(`✅ Blog ${publishStatus === 'published' ? 'published' : 'saved as draft'}!`);
        router.push('/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave('draft')}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
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
        <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-xl p-8">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title..."
            className="w-full text-4xl font-bold mb-6 border-none focus:outline-none focus:ring-0 placeholder-gray-300"
            maxLength={200}
          />

          {/* NEW: Description/Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description (Excerpt) *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief description of your article (shown in previews and search results)..."
              className="w-full p-4 border-2 border-purple-100 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-200 resize-none"
              rows={3}
              maxLength={300}
            />
            <div className="text-sm text-gray-500 mt-1 text-right">
              {description.length}/300 characters
            </div>
          </div>

          {/* NEW: Featured Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Featured Image
            </label>
            
            {!featuredImagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all"
              >
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold mb-1">
                  Click to upload featured image
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={featuredImagePreview}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  onClick={removeFeaturedImage}
                  className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  {featuredImage?.name}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border-2 border-purple-100 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-2"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
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
              className="w-full p-3 border-2 border-purple-100 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
              maxLength={30}
            />
            <p className="text-sm text-gray-500 mt-1">
              Press Enter to add tags (max 10)
            </p>
          </div>

          {/* Rich Text Editor */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Content *
            </label>
            <div className="border-2 border-purple-100 rounded-xl overflow-hidden">
              <ReactQuill
                value={content}
                onChange={setContent}
                placeholder="Write your article content here..."
                className="bg-white"
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    ['link', 'image', 'video'],
                    ['blockquote', 'code-block'],
                    [{ color: [] }, { background: [] }],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>

          {/* Preview Button */}
          <button
            onClick={() => alert('Preview coming soon!')}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Preview Article
          </button>
        </div>
      </div>
    </div>
  );
}
