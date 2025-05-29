
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import mintPost from '../../utils/post/mintPost';
import boostPost from '../../utils/post/boostPost';
import pinPost from '../../utils/post/pinPost';
import schedulePost from '../../utils/post/schedulePost';
import sharePost from '../../utils/post/sharePost';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function WritePost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [niche, setNiche] = useState('');
  const [tags, setTags] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [content, setContent] = useState('');

  const token = localStorage.getItem('token');

  const handlePost = async () => {
    const payload = { title, category, niche, tags, content, isDraft, scheduledDate };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/create`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(res.ok ? '✅ Post Created!' : '❌ Failed: ' + data.message);
  };

  return (
    <div className="p-6 space-y-4">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
      <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="w-full p-2 border rounded" />
      <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Niche" className="w-full p-2 border rounded" />
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
      <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full p-2 border rounded" />
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={isDraft} onChange={e => setIsDraft(e.target.checked)} />
        <span>Save as Draft</span>
      </label>
      <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />

      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={handlePost} className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
        <button onClick={() => mintPost(token)} className="bg-purple-600 text-white px-4 py-2 rounded">Mint</button>
        <button onClick={() => boostPost(token)} className="bg-yellow-500 text-white px-4 py-2 rounded">Boost</button>
        <button onClick={() => pinPost(token)} className="bg-gray-700 text-white px-4 py-2 rounded">Pin</button>
        <button onClick={() => schedulePost(token, scheduledDate)} className="bg-teal-600 text-white px-4 py-2 rounded">Schedule</button>
        <button onClick={() => sharePost(token)} className="bg-green-600 text-white px-4 py-2 rounded">Share</button>
      </div>
    </div>
  );
}
