
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiWords, setAiWords] = useState(700);
  const [category, setCategory] = useState('');
  const [niche, setNiche] = useState('');
  const [tags, setTags] = useState('');
  const [mint, setMint] = useState(false);
  const [boost, setBoost] = useState(false);
  const [pin, setPin] = useState(false);
  const [shareTimeline, setShareTimeline] = useState(true);
  const [isDraft, setIsDraft] = useState(false);
  const [schedule, setSchedule] = useState('');

  const generateAIArticle = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/ai/article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, words: aiWords })
    });
    const data = await res.json();
    if (data?.content) setContent(data.content);
  };

  const handlePost = async () => {
    const token = localStorage.getItem('token');
    const payload = {
      title, content, category, niche, tags: tags.split(','),
      mint, boost, pin, shareTimeline, isDraft, schedule
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify(payload)
    });

    if (res.ok) alert('✅ Blog post submitted!');
    else alert('❌ Failed to submit post');
  };

  return (
    <div className="p-6 space-y-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" className="w-full px-4 py-2 border rounded" />

      <div className="grid grid-cols-2 gap-4">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-4 py-2 rounded">
          <option value="">Select Category</option>
          <option>Christianity</option>
          <option>Technology</option>
          <option>Health</option>
          <option>Finance</option>
          <option>Others</option>
        </select>
        <select value={niche} onChange={(e) => setNiche(e.target.value)} className="border px-4 py-2 rounded">
          <option value="">Select Niche</option>
          <option>Inspiration</option>
          <option>Digital Marketing</option>
          <option>Wellness</option>
          <option>Crypto</option>
          <option>Others</option>
        </select>
      </div>

      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" className="w-full px-4 py-2 border rounded" />

      <div className="flex gap-2 items-center">
        <input type="number" value={aiWords} onChange={(e) => setAiWords(e.target.value)} className="w-24 px-2 py-1 border rounded" />
        <button onClick={generateAIArticle} className="bg-blue-600 text-white px-4 py-2 rounded">Generate Article with AI</button>
      </div>

      <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <label><input type="checkbox" checked={mint} onChange={(e) => setMint(e.target.checked)} /> Mint as NFT</label>
        <label><input type="checkbox" checked={boost} onChange={(e) => setBoost(e.target.checked)} /> Boost</label>
        <label><input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} /> Pin</label>
        <label><input type="checkbox" checked={shareTimeline} onChange={(e) => setShareTimeline(e.target.checked)} /> Share to Timeline</label>
        <label><input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} /> Save as Draft</label>
        <input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="px-2 py-1 border rounded" />
      </div>

      <button onClick={handlePost} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Preview & Post
      </button>
    </div>
  );
}
