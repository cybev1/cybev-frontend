import { useState } from 'react';

export default function PostEditor({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [featuredMedia, setFeaturedMedia] = useState(null);
  const [wordCount, setWordCount] = useState(700);
  const [loadingAI, setLoadingAI] = useState(false);
  const [draft, setDraft] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [mint, setMint] = useState(false);
  const [boost, setBoost] = useState(false);
  const [shareTimeline, setShareTimeline] = useState(true);
  const [shareExternal, setShareExternal] = useState(false);

  const handleAIContent = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title, words: wordCount }),
      });
      const data = await res.json();
      if (data?.content) setContent(data.content);
    } catch {
      alert('AI generation failed.');
    }
    setLoadingAI(false);
  };

  const handleDescriptionAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title }),
      });
      const data = await res.json();
      if (data?.description) setDescription(data.description);
    } catch {
      alert('AI description generation failed.');
    }
    setLoadingAI(false);
  };

  const handleMediaUpload = (e) => {
    setFeaturedMedia(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      content,
      featuredMedia,
      draft,
      scheduledAt,
      mint,
      boost,
      shareTimeline,
      shareExternal,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3 rounded" required />

      <div className="flex gap-2 items-center">
        <button type="button" onClick={handleDescriptionAI} className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">
          Generate Description with AI
        </button>
        <textarea placeholder="Short Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded" rows={3} required />
      </div>

      <div className="flex items-center gap-2">
        <input type="number" value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} className="w-24 border p-2 rounded" />
        <button type="button" onClick={handleAIContent} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Generate Full Article
        </button>
      </div>

      <textarea placeholder="Full Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full border p-3 rounded" rows={10} required />

      <input type="file" onChange={handleMediaUpload} accept="image/*,video/*" className="w-full border p-2 rounded" />

      <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full border p-2 rounded" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={draft} onChange={() => setDraft(!draft)} />
          <span>Save as Draft</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={mint} onChange={() => setMint(!mint)} />
          <span>Mint Article</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={boost} onChange={() => setBoost(!boost)} />
          <span>Boost Post</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={shareTimeline} onChange={() => setShareTimeline(!shareTimeline)} />
          <span>Share to Timeline</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={shareExternal} onChange={() => setShareExternal(!shareExternal)} />
          <span>Share Externally</span>
        </label>
      </div>

      <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
        Publish Article
      </button>
    </form>
  );
}