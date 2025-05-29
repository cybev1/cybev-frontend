
import { useEffect, useState } from 'react';

export default function Preview() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('draftPost');
    if (stored) {
      setPost(JSON.parse(stored));
    }
  }, []);

  if (!post) return <p className="p-6 text-gray-700">No draft found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-blue-800">{post.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
