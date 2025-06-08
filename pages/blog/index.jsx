import { useEffect, useState } from 'react';

export default function BlogExplorePage() {
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
        console.error('Error loading blogs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog, index) => (
              <div key={index} className="border p-4 rounded-xl shadow bg-gray-50">
                <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
                <p className="text-gray-700 mb-2">{blog.description}</p>
                <div className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}