import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(2);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    niche: '',
    otherNiche: '',
  });

  const categories = {
    Christianity: ['Faith', 'Bible Study', 'Devotionals', 'Leadership', 'Sermons'],
    Technology: ['AI', 'Web Development', 'Cybersecurity', 'Blockchain', 'Gadgets'],
    Health: ['Nutrition', 'Fitness', 'Mental Health', 'Diseases', 'Wellness'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generateSEO = () => {
    const seo = `Discover insights and updates on ${form.title || 'this blog'} – covering topics in ${form.niche || form.category}.`;
    setForm(prev => ({ ...prev, description: seo }));
  };

  const renderNicheOptions = () => {
    if (!form.category) return null;
    const niches = categories[form.category] || [];
    return (
      <>
        <label className="block font-medium">Niche</label>
        <select
          name="niche"
          value={form.niche}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select a niche</option>
          {niches.map((n, idx) => (
            <option key={idx} value={n}>{n}</option>
          ))}
          <option value="Other">Other (specify below)</option>
        </select>
        {form.niche === 'Other' && (
          <input
            type="text"
            name="otherNiche"
            placeholder="Enter your niche"
            value={form.otherNiche}
            onChange={handleChange}
            className="mt-2 border px-3 py-2 rounded w-full"
          />
        )}
      </>
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Step 2: Blog Identity</h2>
          <p className="text-sm text-gray-600">This is your business or brand name and what people will call your blog</p>
        </div>

        <div>
          <label className="block font-medium">Blog Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Living Faith Daily"
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select a category</option>
            {Object.keys(categories).map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {renderNicheOptions()}

        <div>
          <label className="block font-medium">SEO Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Enter SEO-friendly description"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={generateSEO}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Generate SEO
          </button>
        </div>
      </div>
    </div>
  );
}
