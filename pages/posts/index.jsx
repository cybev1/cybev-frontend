import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export default function BlogPostsPage() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [template, setTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const getTemplateByHost = async (host) => {
    // This should fetch from DB. We use mock logic for now:
    const map = {
      'growth.cybev.io': 'modern',
      'techtalks.io': 'classic',
    };
    return map[host] || 'modern';
  };

  useEffect(() => {
    const init = async () => {
      const t = await getTemplateByHost(hostname);
      setTemplate(t);

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

    init();
  }, [hostname]);

  const filterByCategory = (cat) => {
    setSelectedCat(cat);
    setFiltered(cat ? posts.filter(p => p.category === cat) : posts);
  };

  const TemplateComponent = dynamic(() => import(`../../components/templates/${template === 'classic' ? 'ClassicPostCard' : 'ModernPostCard'}`), {
    loading: () => <p>Loading template...</p>,
    ssr: false,
  });

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
            <TemplateComponent key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}