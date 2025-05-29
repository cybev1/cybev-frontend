import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiWords, setAiWords] = useState(700);

  const generateAIArticle = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/ai/article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, words: aiWords })
    });
    const data = await res.json();
    if (data?.content) setContent(data.content);
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
      <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />
    </div>
  );
}