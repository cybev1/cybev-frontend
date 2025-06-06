
import { useState, useEffect } from 'react';

export default function BlogSetup() {
  const [step, setStep] = useState(2);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    niche: '',
  });

  const [categories, setCategories] = useState(['Christianity', 'Technology', 'Health', 'Education']);
  const [niches, setNiches] = useState([]);
  const [allNiches] = useState({
    Christianity: ['Faith', 'Evangelism', 'Church Growth'],
    Technology: ['AI', 'Web Development', 'Blockchain'],
    Health: ['Nutrition', 'Fitness', 'Mental Health'],
    Education: ['E-learning', 'Study Tips', 'Scholarships'],
  });

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'category') {
      setNiches(allNiches[value] || []);
    }
  };

  const handleGenerateDescription = () => {
    setForm(prev => ({
      ...prev,
      description: `Welcome to ${prev.title}, your trusted destination for ${prev.category} insights and inspiration.`
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">CYBEV Blog Setup – Step {step} of 5</h1>
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div>
            <label className="block mb-1">Blog Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your blog title"
            />
          </div>
          <div>
            <label className="block mb-1">SEO Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Auto-generated or custom description"
            />
            <button onClick={handleGenerateDescription} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">AI Generate SEO</button>
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Niche</label>
            <select
              name="niche"
              value={form.niche}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Niche</option>
              {niches.map((n, idx) => (
                <option key={idx} value={n}>{n}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={goBack} className="px-4 py-2 rounded bg-gray-300">Back</button>}
        {step < 5 && <button onClick={goNext} className="px-4 py-2 rounded bg-blue-600 text-white">Next</button>}
      </div>
    </div>
  );
}
