import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/blogs/user', {
      headers: {
        'Authorization': token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
        else setBlogs([]);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">My Blogs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <ul className="space-y-4">
            {blogs.map((blog) => (
              <li key={blog._id} className="p-4 border rounded shadow bg-white">
                <h2 className="text-xl font-semibold text-blue-900">{blog.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{blog.description}</p>
                <p className="text-sm mb-1">Theme: {blog.theme}</p>
                <p className="text-sm mb-1">Category: {blog.category}</p>
                <p className="text-sm text-gray-600">Domain: <Link href={`/site/${blog.domainValue}`} className="text-blue-600 underline">{`/site/${blog.domainValue}`}</Link></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}