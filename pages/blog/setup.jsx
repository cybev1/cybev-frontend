import { useState } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(2);
  const [form, setForm] = useState({
    title: 'Living Faith Daily',
    category: 'Christianity',
    niche: 'Devotionals',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const simulateAIGenerateSEO = () => {
    setLoading(true);
    setTimeout(() => {
      const seo = `Unlock daily inspiration with "${form.title}" — a powerful blog sharing ${form.niche.toLowerCase()} insights rooted in ${form.category.toLowerCase()} values.`;
      setForm((prev) => ({ ...prev, description: seo }));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Step 2: Blog Identity</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Blog Title"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Christianity">Christianity</option>
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
        </select>

        <select
          name="niche"
          value={form.niche}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Devotionals">Devotionals</option>
          <option value="Leadership">Leadership</option>
          <option value="Faith">Faith</option>
        </select>

        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="SEO Description"
        />

        <button
          onClick={simulateAIGenerateSEO}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Generating...' : 'AI GENERATE SEO'}
        </button>
      </div>
    </div>
  );
}
