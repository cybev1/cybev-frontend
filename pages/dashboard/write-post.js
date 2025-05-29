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

  const handleAIContent = async () => {
    setGenerateLoading(true);
    const res = await fetch('/api/ai/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Generate a powerful blog post about Web3 for African creators.' })
    });
    const data = await res.json();
    setTitle(data.title || '');
    setContent(data.content || '');
    setSeo((data.content || '').slice(0, 160));
    setGenerateLoading(false);
  };

  const handleAIImage = async () => {
    const res = await fetch('https://api.dicebear.com/7.x/shapes/png?seed=cybev');
    setImageUrl(res.url);
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
          <label className="block font-semibold text-gray-700">SEO Description</label>
          <input value={seo} onChange={(e) => setSeo(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select Category</option>
            <option value="Christianity">Christianity</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Niche</label>
          <input value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Tags</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma-separated" className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Content</label>
          <ReactQuill value={content} onChange={setContent} />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Featured Image</label>
          {imageUrl && <Image src={imageUrl} alt="AI image" width={200} height={200} />}
          <input type="file" accept="image/*" onChange={(e) => setUploadImage(e.target.files[0])} className="mt-2" />
          <button onClick={handleAIImage} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Generate AI Image</button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Upload Video (optional)</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        </div>

        <div className="mb-4 flex gap-4 items-center">
          <label className="font-semibold">Post Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-1">
            <option value="draft">Draft</option>
            <option value="published">Publish Now</option>
          </select>
          <input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="border rounded px-3 py-1" />
        </div>

        <div className="flex gap-4">
          <button onClick={handleAIContent} disabled={generateLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {generateLoading ? 'Generating...' : 'AI Generate Full Article'}
          </button>

          <button onClick={handlePostSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">
            Preview & Post
          </button>
        </div>
      </div>
    </div>
  );
}