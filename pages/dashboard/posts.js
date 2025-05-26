import { useEffect, useState } from 'react';
import MintButton from '../../components/MintButton'; // ✅ Add this import

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://api.cybev.io/api/posts/user', {
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

  const handleMint = (postId) => {
    alert(`✅ Post ${postId} minted! (simulated)`);
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...p, isMinted: true } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Your Posts & Earnings</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {posts.length > 0 ? (
          <ul className="space-y-6">
            {posts.map((post, i) => (
              <li key={i} className="p-4 border rounded shadow-sm bg-blue-50">
                <h3 className="text-xl font-semibold text-blue-800">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-1">Category: {post.category}</p>
                <p className="text-gray-700 mb-2">{post.content.slice(0, 120)}...</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Views: {post.views || 0}</span>
                  <span>Likes: {post.likes || 0}</span>
                  <span>Comments: {post.comments || 0}</span>
                  <span className="text-green-700 font-bold">Earned: ₡{(post.views || 0) * 0.5}</span>
                </div>
                {post.isMinted ? (
                  <span className="inline-block mt-2 text-sm text-green-700 font-bold">✔ Minted</span>
                ) : (
                  <MintButton onMint={() => handleMint(post._id)} />
                )}
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
