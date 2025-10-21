import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/Layout/AppLayout';
import { blogAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { Save, Eye, ArrowLeft, Trash2 } from 'lucide-react';

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

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    tags: '',
    status: 'published'
  });

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getBlog(id);
      if (response.data.ok) {
        const blog = response.data.blog;
        
        // Check if user owns this blog
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (blog.author !== user.id) {
          toast.error('You can only edit your own blogs');
          router.push('/blog');
          return;
        }

        setFormData({
          title: blog.title,
          content: blog.content,
          category: blog.category,
          tags: blog.tags?.join(', ') || '',
          status: blog.status || 'published'
        });
      }
    } catch (error) {
      toast.error('Failed to load blog');
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const response = await blogAPI.updateBlog(id, payload);

      if (response.data.ok) {
        toast.success('✅ Blog updated successfully!');
        router.push(`/blog/${id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await blogAPI.deleteBlog(id);
      if (response.data.ok) {
        toast.success('🗑️ Blog deleted successfully');
        router.push('/blog');
      }
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(false);
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

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push(`/blog/${id}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                >
                  <Eye className="w-4 h-4" />
                  {preview ? 'Edit' : 'Preview'}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all disabled:opacity-50 border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!preview ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter an engaging title..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category, Tags, and Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="e.g., coding, javascript"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Content *
                </label>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
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
            </form>
          ) : (
            // Preview Mode
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mb-4">
                  {formData.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {formData.title || 'Untitled'}
                </h1>
                {formData.tags && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400">No content yet...</p>' }}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}