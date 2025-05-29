
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PreviewPost() {
  const router = useRouter();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('cybev_preview');
    if (stored) setPost(JSON.parse(stored));
    else router.push('/dashboard/write-post');
  }, []);

  if (!post) return <div className="p-6">Loading preview...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
      {post.featuredImage && (
        <img src={post.featuredImage} alt="Featured" className="w-full rounded mb-4" />
      )}
      <h1 className="text-3xl font-bold text-blue-900 mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">
        <strong>Category:</strong> {post.category} | <strong>Niche:</strong> {post.niche} | <strong>Tags:</strong> {post.tags?.join(', ')}
      </p>
      <div
        className="prose max-w-full"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
