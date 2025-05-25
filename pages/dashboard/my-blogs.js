import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../components/ui/Card';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = () => {
    const token = localStorage.getItem('token');
    fetch('/api/blogs/user', {
      headers: { 'Authorization': token }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
        else setBlogs([]);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    });
    fetchBlogs();
  };

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
              <Card key={blog._id}>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-900">{blog.title}</h2>
                    <p className="text-sm text-gray-500">{blog.description}</p>
                    <p className="text-sm">Theme: {blog.theme}</p>
                    <p className="text-sm">Category: {blog.category}</p>
                    <p className="text-sm text-gray-600">
                      Domain: <Link href={`/site/${blog.domainValue}`} className="text-blue-600 underline">{`/site/${blog.domainValue}`}</Link>
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      onClick={() => alert('Edit functionality coming soon.')}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      onClick={() => handleDelete(blog._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}