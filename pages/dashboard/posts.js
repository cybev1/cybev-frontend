import { useEffect, useState } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://cybev.io/api/posts/user', {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setError('Failed to load posts.');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Posts</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post, i) => (
              <li key={i} className="p-4 border rounded shadow-sm">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-sm text-gray-500">Category: {post.category}</p>
                <p className="mt-2 text-gray-700">{post.content.slice(0, 100)}...</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}