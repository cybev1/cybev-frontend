import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function PostEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const generateSEO = async () => {
    setAiLoading(true);
    // TODO: call real OpenAI backend endpoint
    const response = await fetch('/api/ai/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    const data = await response.json();
    setSeoDescription(data.description || '');
    setAiLoading(false);
  };

  const saveDraft = () => {
    // TODO: implement save draft API
    console.log('Saving draft…');
  };

  const publishPost = () => {
    // TODO: implement publish API
    console.log('Publishing post…');
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full text-2xl font-semibold p-2 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
      />

      <ReactQuill theme="snow" value={content} onChange={setContent} className="h-64" />

      <div className="flex flex-col gap-2">
        <label className="font-medium">SEO Description</label>
        <textarea
          value={seoDescription}
          onChange={e => setSeoDescription(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700"
          rows={3}
        />
        <button
          onClick={generateSEO}
          disabled={aiLoading}
          className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {aiLoading ? 'Generating…' : 'AI Generate SEO'}
        </button>
      </div>

      <div className="flex gap-4">
        <button onClick={saveDraft} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg">Save Draft</button>
        <button onClick={publishPost} className="px-4 py-2 bg-green-600 text-white rounded-lg">Publish</button>
      </div>
    </motion.div>
  );
}