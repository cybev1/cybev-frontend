import { useEffect, useState } from 'react';

export default function BlogsDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/list')
      .then(res => res.json())
      .then(data => {
        setBlogs(data.blogs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load blogs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📋 My Blogs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs published yet.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog, i) => (
              <div key={i} className="border rounded-xl p-4 shadow bg-gray-50">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-600">{blog.description}</p>
                <div className="text-sm text-gray-400 mt-2">
                  {new Date(blog.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}