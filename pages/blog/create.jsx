
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function CreateBlogPost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    seoTitle: '',
    seoDescription: '',
    content: '',
    category: '',
    tags: '',
    featuredImage: null,
    video: null,
    mint: false,
    scheduleDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post('/api/blog/create', formData);
      router.push('/blog/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter a topic for AI to generate.');
      return;
    }

    setAiLoading(true);
    try {
      const res = await axios.post('/api/ai/generate-article', { topic: aiTopic });
      setForm((prev) => ({ ...prev, content: res.data.article }));
    } catch (error) {
      console.error(error);
      alert('Failed to generate article');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Post Title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="seoTitle" placeholder="SEO Title" value={form.seoTitle} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="seoDescription" placeholder="SEO Description" value={form.seoDescription} onChange={handleChange} className="w-full p-2 border rounded" />
        <div className="flex gap-2 items-center">
          <input type="text" placeholder="AI Topic..." value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} className="w-full p-2 border rounded" />
          <button type="button" onClick={handleAIGenerate} className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition">
            {aiLoading ? 'Generating...' : '🧠 Generate with AI'}
          </button>
        </div>
        <textarea name="content" placeholder="Write your article here..." rows="10" value={form.content} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="w-full p-2 border rounded" />
        <label className="block font-semibold">Upload Featured Image</label>
        <input type="file" name="featuredImage" accept="image/*" onChange={handleFileChange} />
        <label className="block font-semibold">Upload Video (optional)</label>
        <input type="file" name="video" accept="video/*" onChange={handleFileChange} />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="mint" checked={form.mint} onChange={handleChange} />
          <span>Mint this post as NFT</span>
        </label>
        <label className="block font-semibold">Schedule Post</label>
        <input type="datetime-local" name="scheduleDate" value={form.scheduleDate} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}
