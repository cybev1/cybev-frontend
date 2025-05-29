import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function WritePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [seo, setSeo] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateTitle = async () => {
    setLoading(true);
    const res = await fetch('/api/ai/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Generate a blog title about tech innovation' })
    });
    const data = await res.json();
    setTitle(data.title || 'Untitled AI Post');
    setLoading(false);
  };

  const handleGenerateBody = async () => {
    setLoading(true);
    const res = await fetch('/api/ai/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `Write a blog post titled "${title}"` })
    });
    const data = await res.json();
    setBody(data.content || '');
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <Head><title>Write New Post | CYBEV</title></Head>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold text-blue-800">Write a New Post</h1>
        <div className="space-y-2">
          <label className="block font-medium">Title</label>
          <div className="flex space-x-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title" className="flex-1 border px-3 py-2 rounded w-full" />
            <button onClick={handleGenerateTitle} className="bg-purple-600 text-white px-3 py-2 rounded text-sm">AI Generate</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Content</label>
          <ReactQuill theme="snow" value={body} onChange={setBody} />
          <button onClick={handleGenerateBody} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm">AI Generate Article</button>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">SEO Description</label>
          <input value={seo} onChange={(e) => setSeo(e.target.value)} placeholder="Optional meta description" className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Tags</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. AI, blockchain" className="w-full border px-3 py-2 rounded" />
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">
          Publish Post
        </button>

        {loading && <p className="text-sm text-gray-500 mt-2">AI generating content...</p>}
      </div>
    </div>
  );
}
