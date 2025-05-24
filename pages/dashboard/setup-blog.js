import { useState } from 'react'

export default function BlogSetup() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    domainType: 'subdomain',
    domainValue: '',
    category: '',
    theme: ''
  });

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [generating, setGenerating] = useState(false);

  const categories = [
    'Inspiration', 'Business', 'Technology', 'Finance', 'Fashion',
    'Travel', 'Lifestyle', 'Food', 'Health', 'Gaming',
    'Education', 'Real Estate', 'Parenting', 'Design', 'Sports',
    'News', 'Religion', 'Art', 'Photography', 'DIY', 'OTHERS'
  ];

  const themes = Array.from({ length: 100 }, (_, i) => `Theme ${i + 1}`);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAvailable(null);
  };

  const handleCheckDomain = async () => {
    setChecking(true);
    setAvailable(null);
    setTimeout(() => {
      setAvailable(Math.random() > 0.5);
      setChecking(false);
    }, 1000);
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    setTimeout(() => {
      setForm({ ...form, description: "Welcome to my amazing blog powered by CYBEV. Stay tuned for exciting updates, content, and community!" });
      setGenerating(false);
    }, 1000);
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

          <div>
            <div className="flex justify-between items-center">
              <label className="font-semibold text-sm text-gray-600">Blog Description</label>
              <button type="button" onClick={handleGenerateAI}
                className="text-sm text-purple-600 hover:underline font-medium">
                {generating ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of your blog"
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-sm text-gray-600 mb-1">Domain Options</label>
            <select
              name="domainType"
              value={form.domainType}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            >
              <option value="subdomain">Subdomain (e.g. myblog.cybev.io)</option>
              <option value="custom">Custom Domain</option>
              <option value="register">Register New Domain</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <input
              name="domainValue"
              value={form.domainValue}
              onChange={handleChange}
              placeholder={form.domainType === 'subdomain' ? 'e.g. myblog' : 'e.g. myblog.com'}
              className="flex-1 border rounded px-4 py-2"
              required
            />
            <button
              type="button"
              onClick={handleCheckDomain}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {checking ? 'Checking...' : 'Check'}
            </button>
          </div>
          {available !== null && (
            <p className={available ? 'text-green-600' : 'text-red-600'}>
              {available ? 'Domain is available!' : 'Domain is taken.'}
            </p>
          )}

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