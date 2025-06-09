import { useEffect, useState } from 'react';
import AutoMintButton from '@/components/mint/AutoMintButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyPostDashboard() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/blog/my')
      .then((res) => res.json())
      .then((data) => setBlogs(data.blogs || []));

    localStorage.setItem('wallet', '0x84E98A08aBb7378d81b2DC1b0F591e0fe5172265');
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Blog Posts (Mintable)</h1>

        {blogs.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          blogs.map((post) => (
            <div key={post._id} className="border p-4 rounded-xl shadow mb-6 bg-gray-50">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{post.description}</p>
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt="cover"
                  className="h-40 w-full object-cover rounded mb-3"
                />
              )}
              <AutoMintButton
                getData={() => ({
                  title: post.title,
                  description: post.description,
                  mediaUrl: post.featuredImage || ''
                })}
              />
            </div>
          ))
        )}
        <ToastContainer />
      </div>
    </div>
  );
}