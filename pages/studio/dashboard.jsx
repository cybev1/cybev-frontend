
import React, { useState } from 'react';
import Link from 'next/link';

export default function SocialDashboard() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Prince Dike',
      content: 'CYBEV is the future of Web3 + AI + Social Media!',
      image: '/uploads/sample1.jpg',
      video: '',
      views: 5200,
      likes: 140,
      comments: 12,
      tips: 34,
    },
    {
      id: 2,
      user: 'Grace Nana',
      content: 'Just minted my first blog post! Let’s go! 🔥',
      image: '',
      video: '/uploads/sample2.mp4',
      views: 3800,
      likes: 92,
      comments: 6,
      tips: 15,
    },
  ]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold">Welcome back, Prince!</h1>
        <p className="text-sm text-gray-500">You’re connected to the global CYBEV network</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Create a Post</h2>
        <div className="flex flex-col space-y-2">
          <textarea placeholder="What's on your mind?" className="w-full p-2 border rounded" />
          <div className="flex flex-wrap gap-2">
            <button className="bg-blue-600 text-white px-3 py-2 rounded">📷 Image</button>
            <button className="bg-blue-600 text-white px-3 py-2 rounded">🎥 Video</button>
            <button className="bg-purple-600 text-white px-3 py-2 rounded">🧠 AI Write</button>
            <button className="bg-red-600 text-white px-3 py-2 rounded">🔴 Go Live</button>
            <button className="bg-yellow-600 text-black px-3 py-2 rounded">📌 Pin</button>
            <button className="bg-green-600 text-white px-3 py-2 rounded">🚀 Boost</button>
            <button className="bg-indigo-600 text-white px-3 py-2 rounded">🪙 Mint</button>
            <button className="bg-gray-800 text-white px-3 py-2 rounded">Post</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold">Super Blogger 🔥</h3>
          <p className="text-sm">Top earners this week</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold">Trending Hashtags</h3>
          <ul className="text-sm list-disc ml-5">
            <li>#cybev</li>
            <li>#mintedthoughts</li>
            <li>#web3bloggers</li>
          </ul>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold">People You May Know</h3>
          <p className="text-sm">Connect and collaborate</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Social Feed</h2>
        {posts.map((post) => (
          <div key={post.id} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
            <h3 className="font-semibold">{post.user}</h3>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post" className="mt-2 rounded" />}
            {post.video && (
              <video controls className="mt-2 rounded">
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              👁 {post.views} | ❤️ {post.likes} | 💬 {post.comments} | 💰 {post.tips} tips
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
