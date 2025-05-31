
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function BlogSetup() {
  const router = useRouter();
  const [form, setForm] = useState({
    blogName: '',
    description: '',
    domainType: 'subdomain',
    subdomain: '',
    customDomain: '',
    category: '',
    niche: '',
    template: 'minimalist',
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const categories = ["Christianity", "Tech", "Health", "Fashion", "Music", "Business"];
  const niches = {
    Christianity: ["Faith", "Devotionals", "Ministry"],
    Tech: ["AI", "Blockchain", "Software"],
    Health: ["Fitness", "Nutrition", "Mental Health"],
    Fashion: ["Style Tips", "Designers", "Culture"],
    Music: ["Gospel", "Afrobeats", "Hip Hop"],
    Business: ["Startups", "Marketing", "Investing"]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      await axios.post('/api/blog/setup', formData);
      router.push('/blog/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to setup blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Your Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="blogName" placeholder="Blog Name" value={form.blogName} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Short Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" required />

        <label className="block font-semibold">Domain Type</label>
        <select name="domainType" value={form.domainType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="subdomain">Use a free CYBEV subdomain</option>
          <option value="custom">Connect a custom domain</option>
          <option value="register">Register a new domain</option>
        </select>

        {form.domainType === 'subdomain' && (
          <input type="text" name="subdomain" placeholder="yourname.cybev.io" value={form.subdomain} onChange={handleChange} className="w-full p-2 border rounded" />
        )}

        {form.domainType === 'custom' && (
          <input type="text" name="customDomain" placeholder="yourdomain.com" value={form.customDomain} onChange={handleChange} className="w-full p-2 border rounded" />
        )}

        <label className="block font-semibold">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="block font-semibold">Niche</label>
        <select name="niche" value={form.niche} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Niche</option>
          {form.category && niches[form.category]?.map((niche) => (
            <option key={niche} value={niche}>{niche}</option>
          ))}
        </select>

        <label className="block font-semibold">Choose a Template</label>
        <select name="template" value={form.template} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="minimalist">Minimalist</option>
          <option value="creator">Creator</option>
          <option value="magazine">Magazine</option>
          <option value="portfolio">Portfolio</option>
        </select>

        <label className="block font-semibold">Upload Logo</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Setting up...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}
