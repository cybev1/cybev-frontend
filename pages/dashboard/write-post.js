import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function WritePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [seo, setSeo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [category, setCategory] = useState('');
  const [niche, setNiche] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [schedule, setSchedule] = useState('');
  const [generateLoading, setGenerateLoading] = useState(false);
  const [wordCount, setWordCount] = useState(700);
  const [boost, setBoost] = useState(false);
  const [pin, setPin] = useState(false);
  const [mint, setMint] = useState(false);
  const [share, setShare] = useState(true);

  const handleAIContent = async () => {
    setGenerateLoading(true);
    const res = await fetch('/api/ai/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `Write a ${wordCount}-word article about ${title}` })
    });
    const data = await res.json();
    setTitle(data.title || title);
    setContent(data.content || '');
    setSeo((data.content || '').slice(0, 160));
    setGenerateLoading(false);
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('seo', seo);
    formData.append('category', category);
    formData.append('niche', niche);
    formData.append('tags', tags);
    formData.append('status', status);
    formData.append('schedule', schedule);
    formData.append('boost', boost);
    formData.append('pin', pin);
    formData.append('mint', mint);
    formData.append('share', share);
    if (uploadImage) formData.append('image', uploadImage);
    if (videoFile) formData.append('video', videoFile);

    await fetch('/api/posts/create', {
      method: 'POST',
      headers: { Authorization: localStorage.getItem('token') },
      body: formData
    }).then(res => {
      if (res.ok) alert('✅ Post submitted!');
      else alert('❌ Failed to submit post');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Write a New Blog Post</h1>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">How many words?</label>
          <input type="number" value={wordCount} onChange={(e) => setWordCount(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">SEO Description</label>
          <input value={seo} onChange={(e) => setSeo(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold">Niche</label>
            <input value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Tags (comma-separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Content</label>
          <ReactQuill value={content} onChange={setContent} />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Featured Image</label>
          <input type="file" accept="image/*" onChange={(e) => setUploadImage(e.target.files[0])} />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Upload Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
          <label><input type="checkbox" checked={mint} onChange={(e) => setMint(e.target.checked)} /> Mint</label>
          <label><input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} /> Share to Timeline</label>
          <label><input type="checkbox" checked={boost} onChange={(e) => setBoost(e.target.checked)} /> Boost Post</label>
          <label><input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} /> Pin Post</label>
        </div>

        <div className="flex gap-4 mb-6">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2 py-1">
            <option value="draft">Draft</option>
            <option value="published">Publish Now</option>
          </select>
          <input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="border rounded px-2 py-1" />
        </div>

        <div className="flex gap-4">
          <button onClick={handleAIContent} disabled={generateLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {generateLoading ? 'Generating...' : 'AI Generate Full Article'}
          </button>
          <button onClick={handlePostSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">Submit Post</button>
        </div>
      </div>
    </div>
  );
}