
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function BlogDashboard() {
  const [blogData, setBlogData] = useState({
    blogName: 'My Awesome Blog',
    posts: [],
    views: 0,
    earnings: 0,
  });

  useEffect(() => {
    // Simulate fetching blog dashboard data
    async function fetchData() {
      // Replace with real API call
      const mockPosts = [
        { id: 1, title: 'Welcome to my blog', views: 120, createdAt: '2025-05-01' },
        { id: 2, title: 'Second Post - What I Learned Today', views: 87, createdAt: '2025-05-10' }
      ];
      setBlogData((prev) => ({
        ...prev,
        posts: mockPosts,
        views: 207,
        earnings: 4.35,
      }));
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">{blogData.blogName} Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
          <h2 className="text-xl font-semibold">Total Views</h2>
          <p className="text-2xl">{blogData.views}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
          <h2 className="text-xl font-semibold">Earnings ($CYBEV)</h2>
          <p className="text-2xl">${blogData.earnings.toFixed(2)}</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded">
          <h2 className="text-xl font-semibold">Total Posts</h2>
          <p className="text-2xl">{blogData.posts.length}</p>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recent Posts</h2>
        <Link href="/blog/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            + Create New Post
          </button>
        </Link>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        {blogData.posts.length === 0 ? (
          <p>No posts yet. Create your first one!</p>
        ) : (
          <ul className="space-y-3">
            {blogData.posts.map((post) => (
              <li key={post.id} className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Views: {post.views} • {post.createdAt}</p>
                </div>
                <Link href={`/blog/edit/${post.id}`}>
                  <button className="text-blue-600 hover:underline">Edit</button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
