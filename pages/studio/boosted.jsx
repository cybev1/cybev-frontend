import { useEffect, useState } from 'react';

export default function BoostedPostLeaderboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts/boosted')
      .then(res => res.json())
      .then(data => setPosts(data.posts || []));
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔥 Boosted Post Leaderboard</h1>

        {posts.length === 0 ? (
          <p>No boosted posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post, index) => (
              <li key={post._id} className="bg-gray-50 p-4 rounded-xl shadow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{post.title || 'Untitled Post'}</h2>
                  <span className="text-sm text-orange-600 font-bold">🔥 Boosts: {post.boostCount || 0}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{post.description || post.caption}</p>
                {post.mediaUrl && (
                  <img
                    src={post.mediaUrl}
                    alt="post media"
                    className="w-full max-h-56 object-cover rounded mt-2"
                  />
                )}
                <p className="text-xs text-gray-400 mt-2">Author: {post.author || 'Anonymous'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}