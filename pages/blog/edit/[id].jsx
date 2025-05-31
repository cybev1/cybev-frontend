
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: '',
    seoTitle: '',
    seoDescription: '',
    content: '',
    category: '',
    tags: '',
    mint: false,
    scheduleDate: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const res = await axios.get(`/api/blog/post?id=${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/blog/post?id=${id}`, form);
      router.push('/blog/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Post Title" className="w-full p-2 border rounded" />
        <input type="text" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="SEO Title" className="w-full p-2 border rounded" />
        <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} placeholder="SEO Description" className="w-full p-2 border rounded" />
        <textarea name="content" value={form.content} onChange={handleChange} rows="10" placeholder="Write your article here..." className="w-full p-2 border rounded" />
        <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" />
        <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="mint" checked={form.mint} onChange={handleChange} />
          <span>Mint this post as NFT</span>
        </label>
        <label className="block font-semibold">Schedule Post</label>
        <input type="datetime-local" name="scheduleDate" value={form.scheduleDate} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition" disabled={loading}>
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}
