import { useState } from 'react';

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', category: '', content: '' });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generateWithAI = async () => {
    setGenerating(true);
    const prompt = `Write a blog post about "${form.title}" in the "${form.category}" category.`;
    const res = await fetch('https://cybev.io/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setForm({ ...form, content: data.generated || 'Failed to generate content.' });
    setGenerating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('https://cybev.io/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Create a New Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Post Title" onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded" required />
          <input name="category" placeholder="Category" onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded" required />
          <textarea name="content" rows="8" placeholder="Write your content..."
            onChange={handleChange} value={form.content}
            className="w-full mb-3 px-4 py-2 border rounded"></textarea>
          <div className="flex gap-4">
            <button type="button" onClick={generateWithAI} disabled={generating}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              {generating ? 'Generating...' : 'Generate with AI'}
            </button>
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loading ? 'Submitting...' : 'Submit Post'}
            </button>
          </div>
        </form>
        {response && (
          <pre className="mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}