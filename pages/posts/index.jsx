import { useEffect, useState } from 'react';

export default function BlogPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/blog/posts?host=' + hostname);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [hostname]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Posts for {hostname}</h1>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found for this blog.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700">{post.title}</h2>
              <p className="text-gray-700">{post.description}</p>
              <a href={`/posts/${post.slug}`} className="text-sm text-indigo-600 hover:underline">Read more</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}