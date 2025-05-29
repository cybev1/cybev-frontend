import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Preview() {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('draftPost');
    if (stored) {
      setPost(JSON.parse(stored));
    }
  }, []);

  const handlePost = async () => {
    setPosting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/create`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem('draftPost');
        router.push('/dashboard/posts');
      } else {
        setError(data.message || 'Failed to post.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  if (!post) return <p className="p-6 text-gray-700">No draft found.</p>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800">{post.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePost}
          disabled={posting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
        <button
          onClick={() => router.push('/dashboard/write-post')}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
