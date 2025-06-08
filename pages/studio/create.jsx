import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    domainType: 'subdomain',
    category: '',
    niche: '',
    monetize: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        alert('Blog published!');
        router.push('/studio/blogs');
      } else {
        alert(result.message || 'Failed to publish blog');
      }
    } catch (err) {
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Blog Title" value={form.title} onChange={handleChange} className="w-full border p-3 rounded" required />
          <textarea name="description" placeholder="Short description" value={form.description} onChange={handleChange} className="w-full border p-3 rounded" required />

          <select name="domainType" value={form.domainType} onChange={handleChange} className="w-full border p-3 rounded">
            <option value="subdomain">Free Subdomain (.cybev.io)</option>
            <option value="existingDomain">Use Existing Domain</option>
            <option value="newDomain">Register New Domain</option>
          </select>

          <select name="category" value={form.category} onChange={handleChange} className="w-full border p-3 rounded">
            <option value="">Select Category</option>
            <option value="Christianity">Christianity</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>

          <input type="text" name="niche" placeholder="Niche" value={form.niche} onChange={handleChange} className="w-full border p-3 rounded" />

          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" name="monetize" checked={form.monetize} onChange={handleChange} />
            <span>Enable Monetization</span>
          </label>

          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            {submitting ? 'Publishing...' : 'Publish Blog'}
          </button>
        </form>
      </div>
    </div>
  );
}