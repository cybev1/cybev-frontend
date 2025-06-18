
import dynamic from 'next/dynamic';
import { useState } from 'react';

const RichEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

export default function PostEditor({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [seo, setSeo] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [draft, setDraft] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [boost, setBoost] = useState(false);
  const [shareExternal, setShareExternal] = useState(false);
  const [shareTimeline, setShareTimeline] = useState(true);
  const [mint, setMint] = useState(false);
  const [wordCount, setWordCount] = useState(700);
  const [featuredFile, setFeaturedFile] = useState(null);
  const [featuredAI, setFeaturedAI] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description: seo,
      content,
      tags,
      location,
      draft,
      scheduledAt,
      boost,
      shareExternal,
      shareTimeline,
      mint,
      featuredFile,
      featuredAI,
    });
  };

  const handleGenerateAIImage = () => {
    setFeaturedAI(`https://via.placeholder.com/600x400?text=AI+Generated+${encodeURIComponent(title || "Image")}`);
  };

  const handleAIContent = async () => {
    try {
      const res = await fetch('/api/ai/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title, words: wordCount }),
      });
      const data = await res.json();
      if (data?.content) setContent(data.content);
    } catch {
      alert('AI article generation failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border shadow-xl rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Blog Post</h1>
      <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3 rounded-lg" required />
      <div className="flex gap-2">
        <button type="button" onClick={() => alert('Call AI SEO endpoint here')} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          AI GENERATE SEO
        </button>
        <textarea placeholder="SEO Description" value={seo} onChange={(e) => setSeo(e.target.value)} className="w-full border p-3 rounded-lg" rows={3} required />
      </div>
      <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border p-3 rounded-lg" />
      <input type="text" placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-3 rounded-lg" />
      <div className="flex items-center gap-2">
        <input type="number" value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} className="w-24 border p-2 rounded" />
        <button type="button" onClick={handleAIContent} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          AI GENERATE FULL ARTICLE
        </button>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Full Article</label>
        <RichEditor value={content} onChange={setContent} />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">Upload Featured Image/Video:</label>
        <input type="file" accept="image/*,video/*" onChange={(e) => setFeaturedFile(e.target.files[0])} className="w-full border p-2 rounded" />
        <button type="button" onClick={handleGenerateAIImage} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          AI GENERATE FEATURED IMAGE
        </button>
        {featuredAI && <img src={featuredAI} alt="AI Featured" className="mt-2 rounded-lg w-full max-w-md" />}
      </div>
      <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full border p-3 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label className="inline-flex items-center space-x-2"><input type="checkbox" checked={draft} onChange={() => setDraft(!draft)} /><span>Save as Draft</span></label>
        <label className="inline-flex items-center space-x-2"><input type="checkbox" checked={mint} onChange={() => setMint(!mint)} /><span>Mint Article</span></label>
        <label className="inline-flex items-center space-x-2"><input type="checkbox" checked={boost} onChange={() => setBoost(!boost)} /><span>Boost Post</span></label>
        <label className="inline-flex items-center space-x-2"><input type="checkbox" checked={shareTimeline} onChange={() => setShareTimeline(!shareTimeline)} /><span>Share to Timeline</span></label>
        <label className="inline-flex items-center space-x-2"><input type="checkbox" checked={shareExternal} onChange={() => setShareExternal(!shareExternal)} /><span>Share Externally</span></label>
      </div>
      <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Publish Article</button>
    </form>
  );
}
