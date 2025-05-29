
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function WritePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [niche, setNiche] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [mint, setMint] = useState(false);
  const [share, setShare] = useState(false);
  const [pin, setPin] = useState(false);
  const [boost, setBoost] = useState(false);
  const [aiWords, setAiWords] = useState(700);

  const isPremiumUser = true; // TODO: Replace with real check from user token/profile

  const generateAIArticle = async () => {
    if (!isPremiumUser) {
      return alert("AI generation is only available for premium users. Please upgrade.");
    }

    if (!title) return alert('Please enter a title before generating AI content.');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/ai/generate-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Write a ${aiWords}-word blog article titled "${title}"` })
      });

      if (!res.ok) throw new Error('AI quota exceeded or API error.');

      const data = await res.json();
      if (data?.content) setContent(data.content);
    } catch (err) {
      console.error('AI generation failed:', err);
      alert('AI article generation failed. Please try again later.');
    }
  };

  const handlePreview = () => {
    localStorage.setItem('draftPost', JSON.stringify({ title, content }));
    router.push('/dashboard/preview');
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('niche', niche);
    formData.append('tags', tags);
    formData.append('isDraft', isDraft);
    formData.append('scheduleDate', scheduleDate);
    formData.append('mint', mint);
    formData.append('shareToTimeline', share);
    formData.append('isPinned', pin);
    formData.append('isBoosted', boost);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);

    const token = localStorage.getItem('token');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/create`, {
      method: 'POST',
      headers: { Authorization: token },
      body: formData
    });

    if (res.ok) {
      router.push('/dashboard/posts');
    } else {
      alert('Post creation failed.');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" className="w-full px-4 py-2 border rounded" />
      <div className="flex gap-2 items-center">
        <input type="number" value={aiWords} onChange={(e) => setAiWords(e.target.value)} className="w-24 px-2 py-1 border rounded" />
        <button onClick={generateAIArticle} className="bg-blue-600 text-white px-4 py-2 rounded">Generate AI Article</button>
      </div>
      <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded p-2 w-full">
        <option value="">Select Category</option>
        <option value="Christianity">Christianity</option>
        <option value="Tech">Tech</option>
        <option value="News">News</option>
        <option value="Others">Others</option>
      </select>
      <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche" className="w-full px-4 py-2 border rounded" />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full px-4 py-2 border rounded" />
      <label className="flex items-center gap-2"><input type="checkbox" checked={isDraft} onChange={() => setIsDraft(!isDraft)} />Save as Draft</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={mint} onChange={() => setMint(!mint)} />Mint as NFT</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={share} onChange={() => setShare(!share)} />Share to Timeline</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={pin} onChange={() => setPin(!pin)} />Pin Post</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={boost} onChange={() => setBoost(!boost)} />Boost Post</label>
      <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full border rounded px-4 py-2" />
      <div className="flex gap-4 mt-4">
        <button onClick={handlePreview} className="bg-purple-600 text-white px-4 py-2 rounded">Preview</button>
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Post</button>
      </div>
    </div>
  );
}
