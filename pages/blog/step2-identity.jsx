
import { useState } from 'react';

const categoryNiches = {
  Christianity: ['Faith', 'Leadership', 'Prayer', 'Evangelism', 'Bible Study', 'Church Growth', 'Christian Living', 'Healing', 'End Times', 'Love', 'Grace', 'Purpose', 'Fellowship', 'Ministry', 'Youth Ministry', 'Worship', 'Miracles', 'Salvation', 'Others'],
  Business: ['Startups', 'Marketing', 'Finance', 'Entrepreneurship', 'Investing', 'E-commerce', 'Branding', 'Sales', 'Leadership', 'Economics', 'HR', 'Strategy', 'Negotiation', 'Growth Hacking', 'Innovation', 'Analytics', 'Budgeting', 'Tax', 'Others'],
  Technology: ['Web Development', 'AI', 'Cloud', 'Cybersecurity', 'DevOps', 'Data Science', 'Mobile Apps', 'Blockchain', 'IoT', 'AR/VR', 'Machine Learning', 'Programming', 'SaaS', 'Startups', 'UX/UI', 'Automation', 'Open Source', 'APIs', 'Others'],
};

export default function Step2BlogIdentity() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    niche: ''
  });

  const [niches, setNiches] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'category') {
      setNiches(categoryNiches[value] || []);
    }
  };

  const generateDescription = () => {
    const text = form.title
      ? `Welcome to ${form.title}, your destination for engaging content and timeless insights.`
      : 'Welcome to your new blog. Discover insightful content and share your voice with the world.';
    setForm(prev => ({ ...prev, description: text }));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Step 2: Blog Identity</h1>
      <p className="text-gray-600 mb-4">This is your blog's name and what it will be known for.</p>

      <input
        name="title"
        placeholder="Blog Title"
        value={form.title}
        className="border p-2 rounded w-full mb-3"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="SEO Blog Description"
        value={form.description}
        className="border p-2 rounded w-full mb-2"
        onChange={handleChange}
      />

      <button onClick={generateDescription} className="bg-indigo-600 text-white px-4 py-2 rounded mb-4">
        AI Generate Description
      </button>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="">Select Category</option>
        {Object.keys(categoryNiches).map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        name="niche"
        value={form.niche}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select Niche</option>
        {niches.map((niche, i) => (
          <option key={i} value={niche}>{niche}</option>
        ))}
        <option value="Others">Others</option>
      </select>
    </div>
  );
}
