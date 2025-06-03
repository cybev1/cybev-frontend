
import React, { useState } from 'react';

export default function BlogSetup() {
  const [form, setForm] = useState({
    subdomain: '',
    customDomain: '',
    title: '',
    description: '',
    category: '',
    niche: '',
    template: '',
  });

  const categories = ['Christianity', 'Church', 'Religion', 'Health', 'Business', 'Education', 'Technology', 'Finance', 'Entertainment', 'Politics'];
  const templates = ['Creator', 'Magazine', 'Portfolio', 'Minimalist', 'Custom'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGenerateDescription = () => {
    setForm({ ...form, description: 'Empower your vision with this inspiring blog. Start sharing today!' });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Your Blog</h1>

      <div className="grid gap-4">
        <input name="subdomain" placeholder="Subdomain (e.g., myblog)" className="border p-2 rounded" onChange={handleChange} />
        <input name="customDomain" placeholder="Custom Domain (optional)" className="border p-2 rounded" onChange={handleChange} />

        <input name="title" placeholder="Blog Title" className="border p-2 rounded" onChange={handleChange} />
        <textarea name="description" placeholder="Blog Description" className="border p-2 rounded" value={form.description} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-fit" onClick={handleGenerateDescription}>AI Generate Description</button>

        <select name="category" className="border p-2 rounded" onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          <option value="Others">Others</option>
        </select>

        <input name="niche" placeholder="Enter niche (e.g., Faith, SEO, AI...)" className="border p-2 rounded" onChange={handleChange} />

        <select name="template" className="border p-2 rounded" onChange={handleChange}>
          <option value="">Select Blog Template</option>
          {templates.map((tpl, idx) => <option key={idx} value={tpl}>{tpl}</option>)}
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Continue to Domain & Hosting</button>
      </div>
    </div>
  );
}
