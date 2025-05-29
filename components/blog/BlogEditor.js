import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import UploadAIImage from './UploadAIImage';
import UploadAIVideo from './UploadAIVideo';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiWords, setAiWords] = useState(700);
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateAIArticle = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/ai/article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, words: aiWords })
      });
      const data = await res.json();
      if (data?.content) setContent(data.content);
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="w-full px-4 py-2 border rounded text-lg"
      />

      <div className="flex gap-3 items-center">
        <input
          type="number"
          value={aiWords}
          onChange={(e) => setAiWords(e.target.value)}
          className="w-24 px-2 py-1 border rounded"
        />
        <button
          onClick={generateAIArticle}
          disabled={generating || !title}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {generating ? 'Generating...' : 'Generate Article with AI'}
        </button>
      </div>

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="bg-white"
        placeholder="Write your content here..."
      />

      <div className="space-y-4">
        <h3 className="font-bold text-lg">🎨 Generate with AI</h3>
        <UploadAIImage onUpload={(url) => setImage(url)} />
        <UploadAIVideo onUpload={(url) => setVideo(url)} />
      </div>

      {image && (
        <div className="mt-4">
          <p className="font-medium">Preview Image:</p>
          <img src={image} alt="AI Image Preview" className="max-w-sm rounded border" />
        </div>
      )}

      {video && (
        <div className="mt-4">
          <p className="font-medium">Preview Video:</p>
          <video controls className="w-full max-w-md">
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <button
        className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
        onClick={() => alert('✅ Ready to connect submit logic')}
      >
        Preview & Post
      </button>
    </div>
  );
}
