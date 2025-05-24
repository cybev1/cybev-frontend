import { useState } from 'react';
import { useRouter } from 'next/router';

export default function BlogSetup() {
  const router = useRouter();

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
  const [submitting, setSubmitting] = useState(false);

  const categories = [...Array(20)].map((_, i) => `Category ${i + 1}`).concat(['OTHERS']);
  const themes = [...Array(100)].map((_, i) => `Theme ${i + 1}`);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAvailable(null);
  };

  const handleCheckDomain = async () => {
    setChecking(true);
    try {
      const res = await fetch(`/api/check-domain?domain=${form.domainValue}`);
      const data = await res.json();
      setAvailable(data.available);
    } catch {
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleGenerateAI = () => {
    setGenerating(true);
    setTimeout(() => {
      setForm({ ...form, description: "Welcome to my amazing blog powered by CYBEV!" });
      setGenerating(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push(`/dashboard/launch-blog?title=${form.title}&description=${form.description}&domainType=${form.domainType}&domainValue=${form.domainValue}&theme=${form.theme}&category=${form.category}`);
      } else {
        alert('Failed to save blog.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving blog.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Set Up Your Blog/Website</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" placeholder="Blog Title" onChange={handleChange} required className="w-full border rounded px-4 py-2" />
          <div>
            <div className="flex justify-between items-center">
              <label className="font-semibold text-sm text-gray-600">Blog Description</label>
              <button type="button" onClick={handleGenerateAI} className="text-sm text-purple-600 hover:underline font-medium">
                {generating ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} className="w-full border rounded px-4 py-2" />
          </div>
          <label className="font-semibold text-sm text-gray-600">Domain Options</label>
          <select name="domainType" value={form.domainType} onChange={handleChange} className="w-full border rounded px-4 py-2">
            <option value="subdomain">Subdomain</option>
            <option value="custom">Custom Domain</option>
            <option value="register">Register New Domain</option>
          </select>
          <div className="flex gap-2 items-center">
            <input name="domainValue" onChange={handleChange} placeholder="e.g. myblog" className="flex-1 border rounded px-4 py-2" required />
            <button type="button" onClick={handleCheckDomain} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {checking ? 'Checking...' : 'Check'}
            </button>
          </div>
          {available !== null && (
            <p className={available ? 'text-green-600' : 'text-red-600'}>
              {available ? 'Domain is available!' : 'Domain is taken or error.'}
            </p>
          )}
          <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-4 py-2" required>
            <option value="">Select Category</option>
            {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
          <select name="theme" value={form.theme} onChange={handleChange} className="w-full border rounded px-4 py-2" required>
            <option value="">Select Theme</option>
            {themes.map((theme, i) => <option key={i} value={theme}>{theme}</option>)}
          </select>
          <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
            {submitting ? 'Submitting...' : 'Continue to Blog Builder'}
          </button>
        </form>
      </div>
    </div>
  );
}