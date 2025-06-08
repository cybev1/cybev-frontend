import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('/api/blog/' + id)
      .then(res => res.json())
      .then(data => {
        setBlog(data.blog || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading blog:', err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : !blog ? (
          <p>Blog not found.</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              {new Date(blog.createdAt).toLocaleString()}
            </div>
            <p className="text-lg text-gray-800 whitespace-pre-wrap">
              {blog.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
}