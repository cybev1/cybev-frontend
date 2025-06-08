import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    if (!slug) return;

    fetch('/api/blog/post?slug=' + slug + '&host=' + hostname)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPost(data.post);
        }
        setLoading(false);
      });
  }, [slug, hostname]);

  if (loading) return <div className="p-6">Loading post...</div>;

  if (!post) return <div className="p-6 text-red-600">Post not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.description}</p>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}