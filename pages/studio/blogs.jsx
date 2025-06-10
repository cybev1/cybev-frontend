
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BlogsDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = () => {
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
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    const res = await fetch('/api/blog/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.success) {
      alert("Blog deleted.");
      fetchBlogs();
    } else {
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Blogs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs published yet.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="border rounded-xl p-4 shadow bg-gray-50">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-600">{blog.description}</p>
                <div className="text-sm text-gray-400 mt-2">
                  {new Date(blog.createdAt).toLocaleString()}
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <Link href={`/studio/analytics/post/${blog._id}`}>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      📊 View Analytics
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
