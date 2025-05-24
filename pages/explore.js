import Link from 'next/link'
import { useEffect, useState } from 'react'
import { EyeIcon, HeartIcon, RocketLaunchIcon } from '@heroicons/react/24/solid'

export default function Explore() {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    const res = await fetch('https://cybev.io/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    await fetch(`https://cybev.io/api/posts/${id}/like`, { method: 'POST' });
    fetchPosts();
  };

  const handleBoost = async (id) => {
    await fetch(`https://cybev.io/api/posts/${id}/boost`, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Explore Creators</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post._id} className="bg-white p-4 rounded shadow hover:shadow-md">
              <h2 className="text-xl font-semibold text-blue-800">{post.title}</h2>
              <p className="text-sm text-gray-500">Category: {post.category}</p>
              <p className="mt-2 text-gray-700">{post.content.slice(0, 100)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
                <span className="flex items-center gap-1"><EyeIcon className="h-4 w-4 text-gray-500" /> {post.views || 0}</span>
                <span className="flex items-center gap-1"><HeartIcon className="h-4 w-4 text-red-500" /> {post.likes || 0}</span>
                <span>💬 {post.comments || 0}</span>
              </div>
              <div className="mt-3 flex gap-3">
                <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 text-sm">
                  <HeartIcon className="h-4 w-4" /> Like
                </button>
                <button onClick={() => handleBoost(post._id)} className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                  <RocketLaunchIcon className="h-4 w-4" /> Boost
                </button>
              </div>
              <Link href={`/blog/${post._id}`} className="block mt-3 text-blue-600 font-medium">
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
