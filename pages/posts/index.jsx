import { useEffect, useState } from 'react';

export default function BlogPostsPage() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/blog/posts?host=' + hostname);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
        const cats = [...new Set(data.posts.map(p => p.category).filter(Boolean))];
        setCategories(cats);
        setFiltered(data.posts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [hostname]);

  const filterByCategory = (cat) => {
    setSelectedCat(cat);
    setFiltered(cat ? posts.filter(p => p.category === cat) : posts);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Posts for {hostname}</h1>

      {categories.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap justify-center">
          <button onClick={() => filterByCategory('')} className={`px-4 py-2 rounded ${!selectedCat ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            All
          </button>
          {categories.map((cat, i) => (
            <button key={i} onClick={() => filterByCategory(cat)} className={`px-4 py-2 rounded ${selectedCat === cat ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p>Loading posts...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((post) => (
            <div key={post._id} className="border p-4 rounded-lg shadow hover:shadow-md transition bg-white">
              <h2 className="text-xl font-semibold text-blue-700">{post.title}</h2>
              <p className="text-gray-700">{post.description}</p>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-500 italic">{post.category || 'Uncategorized'}</span>
                <a href={`/posts/${post.slug}`} className="text-indigo-600 hover:underline">Read more</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}