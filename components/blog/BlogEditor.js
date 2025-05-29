
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [niche, setNiche] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [aiWords, setAiWords] = useState(700);
  const [draft, setDraft] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const generateAIArticle = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/ai/article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, words: aiWords })
    });
    const data = await res.json();
    if (data?.content) setContent(data.content);
  };

  const handleSubmit = () => {
    const post = {
      title,
      category,
      niche,
      tags: tags.split(',').map(t => t.trim()),
      content,
      isDraft: draft,
      scheduleAt: scheduleDate || null,
    };
    console.log('📝 Submit Post:', post);
    // TODO: Wire to backend
  };

  return (
    <div className="p-6 space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="w-full px-4 py-2 border rounded"
      />
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={aiWords}
          onChange={(e) => setAiWords(e.target.value)}
          className="w-24 px-2 py-1 border rounded"
        />
        <button onClick={generateAIArticle} className="bg-blue-600 text-white px-4 py-2 rounded">
          Generate Article with AI
        </button>
      </div>
      <select onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded">
        <option value="">Select Category</option>
        <option value="Technology">Technology</option>
        <option value="Christianity">Christianity</option>
        <option value="Health">Health</option>
      </select>
      <select onChange={(e) => setNiche(e.target.value)} className="w-full px-4 py-2 border rounded">
        <option value="">Select Niche</option>
        <option value="AI">AI</option>
        <option value="Faith">Faith</option>
        <option value="Wellness">Wellness</option>
      </select>
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Enter tags (comma separated)"
        className="w-full px-4 py-2 border rounded"
      />
      <label className="block text-sm text-gray-700">Content</label>
      <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft} onChange={() => setDraft(!draft)} />
          Save as Draft
        </label>
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
      </div>
      <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Preview & Post
      </button>
    </div>
  );
}
