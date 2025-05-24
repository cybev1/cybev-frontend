import { useState } from 'react';

export default function BlogSetup() {
  const [form, setForm] = useState({
    title: '',
    domainType: 'subdomain',
    domainValue: '',
    category: '',
    theme: ''
  });

  const categories = [
    'Inspiration', 'Business', 'Technology', 'Finance', 'Fashion',
    'Travel', 'Lifestyle', 'Food', 'Health', 'Gaming',
    'Education', 'Real Estate', 'Parenting', 'Design', 'Sports',
    'News', 'Religion', 'Art', 'Photography', 'DIY', 'OTHERS'
  ];

  const themes = Array.from({ length: 100 }, (_, i) => `Theme ${i + 1}`);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Blog Setup Submitted:', form);
    alert('Blog setup saved (simulated)');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Set Up Your Blog/Website</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Blog Title"
            className="w-full border rounded px-4 py-2"
            required
          />

          <label className="block font-semibold text-sm text-gray-600">Choose Domain Type:</label>
          <div className="flex space-x-4">
            <label>
              <input type="radio" name="domainType" value="subdomain" checked={form.domainType === 'subdomain'} onChange={handleChange} />
              <span className="ml-1 text-gray-700">Subdomain (e.g. myblog.cybev.io)</span>
            </label>
            <label>
              <input type="radio" name="domainType" value="custom" checked={form.domainType === 'custom'} onChange={handleChange} />
              <span className="ml-1 text-gray-700">Custom Domain</span>
            </label>
            <label>
              <input type="radio" name="domainType" value="register" checked={form.domainType === 'register'} onChange={handleChange} />
              <span className="ml-1 text-gray-700">Register New Domain</span>
            </label>
          </div>

          <input
            name="domainValue"
            value={form.domainValue}
            onChange={handleChange}
            placeholder={form.domainType === 'subdomain' ? 'e.g. myblog' : 'e.g. myblog.com'}
            className="w-full border rounded px-4 py-2"
            required
          />

          <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-4 py-2" required>
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <select name="theme" value={form.theme} onChange={handleChange} className="w-full border rounded px-4 py-2" required>
            <option value="">Select Blog Theme</option>
            {themes.map((theme, i) => (
              <option key={i} value={theme}>{theme}</option>
            ))}
          </select>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
            Continue to Blog Builder
          </button>
        </form>
      </div>
    </div>
  );
}