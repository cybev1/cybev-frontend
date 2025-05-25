import { useState } from 'react';
import Card from '../../components/ui/Card';

export default function WritePost() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateAI = () => {
    setForm({
      ...form,
      title: '5 Powerful Reasons to Start a Web3 Blog on CYBEV',
      content: 'Discover how CYBEV empowers creators using AI and blockchain to build, monetize, and grow digital content with full ownership.'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Post published successfully!');
        setForm({ title: '', content: '' });
      } else {
        setMessage(data.message || '❌ Failed to publish.');
      }
    } catch (err) {
      setMessage('❌ Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Write a New Blog Post</h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              placeholder="Post Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <textarea
              name="content"
              rows="8"
              placeholder="Write your post content here..."
              value={form.content}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleGenerateAI}
                className="text-blue-600 hover:underline text-sm"
              >
                🧠 Generate with AI
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {submitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
            {message && <p className="text-sm mt-2">{message}</p>}
          </form>
        </Card>
      </div>
    </div>
  );
}