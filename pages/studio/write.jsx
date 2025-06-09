import { useState, useEffect } from 'react';
import PostEditor from '../../components/PostEditor';
import AutoMintButton from '@/components/mint/AutoMintButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WriteToBlog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestForm, setLatestForm] = useState({});

  useEffect(() => {
    fetch('/api/blog/list')
      .then(res => res.json())
      .then(data => {
        setBlogs(data.blogs || []);
        setLoading(false);
      });

    localStorage.setItem('wallet', '0x84E98A08aBb7378d81b2DC1b0F591e0fe5172265');
  }, []);

  const handlePostSubmit = async (post) => {
    if (!selectedBlog) {
      alert("Please select a blog to publish to.");
      return;
    }

    setLatestForm(post); // Save for minting

    const body = {
      ...post,
      blogId: selectedBlog._id,
      blogDomain: selectedBlog.domain || selectedBlog.subdomain
    };

    const res = await fetch('/api/blog/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (result.success) {
      alert("Post published to your blog!");
    } else {
      alert("Error publishing post.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Write an Article to Your Blog</h1>

        {loading ? (
          <p>Loading your blogs...</p>
        ) : (
          <>
            <label className="block mb-2 font-medium">Select Blog to Post To:</label>
            <select
              value={selectedBlog?._id || ''}
              onChange={(e) => {
                const blog = blogs.find((b) => b._id === e.target.value);
                setSelectedBlog(blog);
              }}
              className="mb-6 w-full border p-3 rounded-lg"
            >
              <option value="">-- Select a Blog --</option>
              {blogs.map((blog) => (
                <option key={blog._id} value={blog._id}>
                  {blog.title} ({blog.subdomain || blog.domain})
                </option>
              ))}
            </select>

            {selectedBlog && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Posting to: <strong>{selectedBlog.title}</strong>
                </p>
                <PostEditor onSubmit={handlePostSubmit} />
                <div className="mt-6">
                  <AutoMintButton getData={() => latestForm} />
                </div>
                <ToastContainer />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}