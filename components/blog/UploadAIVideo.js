import { useState } from 'react';

export default function UploadAIVideo({ onUpload }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/ai/video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (data?.url) onUpload(data.url);
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe video to generate"
        className="w-full px-4 py-2 border rounded"
      />
      <button onClick={generateVideo} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
        {loading ? 'Generating...' : 'Generate AI Video'}
      </button>
    </div>
  );
}