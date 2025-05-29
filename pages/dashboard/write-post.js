import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function WritePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [seo, setSeo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleAIContent = async () => {
    setGenerating(true);
    const res = await fetch('/api/ai/generate-post', {
      method: 'POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Generate a powerful blog post about Web3 for African creators.' })
    });
    const data = await res.json();
    setTitle(data.title || '');
    setContent(data.content || '');
    setSeo((data.content || '').slice(0, 160));
    setGenerating(false);
  };

  const handleAIImage = async () => {
    const res = await fetch('https://api.dicebear.com/7.x/shapes/png?seed=cybev');
    setImageUrl(res.url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Write a New Blog Post</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">SEO Description</label>
          <input value={seo} onChange={(e) => setSeo(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Content</label>
          <ReactQuill value={content} onChange={setContent} />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Featured Image</label>
          {imageUrl && <Image src={imageUrl} alt="AI generated" width={200} height={200} className="mb-2 rounded" />}
          <button onClick={handleAIImage} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Generate AI Image
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAIContent}
            disabled={generating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {generating ? 'Generating...' : 'AI Generate Full Article'}
          </button>

          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Preview & Post
          </button>
        </div>
      </div>
    </div>
  );
}