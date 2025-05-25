import { useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '../../components/ui/Card';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function WritePost() {
  const [form, setForm] = useState({
    title: '',
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    videoUrl: '',
    content: ''
  });

  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value) => {
    setForm({ ...form, content: value });
  };

  const handleGenerateAI = () => {
    setForm({
      ...form,
      title: '5 AI Tools to Revolutionize Blogging',
      seoTitle: 'Best AI tools for Web3 bloggers in 2024',
      seoDescription: 'Discover the top AI tools bloggers can use to save time, reach more people, and grow faster.',
      content: '<p>AI is transforming how content is created. In this post, we explore the tools every Web3 blogger should know...</p>'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMessage('✅ Post created!');
        setForm({ title: '', content: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || '❌ Failed to save.');
      }
    } catch {
      setMessage('❌ Error saving post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Create New Blog Post</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              placeholder="Post Title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="seoTitle"
                placeholder="SEO Title"
                value={form.seoTitle}
                onChange={handleChange}
                className="px-4 py-2 border rounded"
              />
              <input
                name="seoDescription"
                placeholder="SEO Description"
                value={form.seoDescription}
                onChange={handleChange}
                className="px-4 py-2 border rounded"
              />
            </div>
            <input
              name="featuredImage"
              placeholder="Featured Image URL"
              value={form.featuredImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              name="videoUrl"
              placeholder="Optional Video URL"
              value={form.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <ReactQuill
              value={form.content}
              onChange={handleContentChange}
              placeholder="Write your content here..."
              theme="snow"
            />
            <div className="flex justify-between items-center mt-4">
              <button type="button" onClick={handleGenerateAI} className="text-sm text-blue-600 hover:underline">
                🧠 Generate with AI
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {submitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
            {message && <p className="text-sm mt-2">{message}</p>}
          </form>
        </Card>
      </div>
    </div>
  );
}