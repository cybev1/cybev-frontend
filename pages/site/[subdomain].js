import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';

const themes = {
  'Theme 1': 'bg-white text-gray-900',
  'Theme 2': 'bg-gray-900 text-white',
  'Theme 3': 'bg-blue-50 text-blue-900',
  'Theme 4': 'bg-yellow-50 text-yellow-900',
  'Theme 5': 'bg-green-50 text-green-900'
};

export default function Site() {
  const { query } = useRouter();
  const [blog, setBlog] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query.subdomain) {
      fetch(`/api/blogs/${query.subdomain}`)
        .then(res => res.json())
        .then(data => {
          setBlog(data);
          return fetch(`/api/posts/by-blog/${data._id}`);
        })
        .then(res => res.json())
        .then(data => setPosts(Array.isArray(data) ? data : []))
        .catch(() => {
          setBlog(null);
          setPosts([]);
        })
        .finally(() => setLoading(false));
    }
  }, [query.subdomain]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading blog...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 p-8">
        <h1 className="text-2xl font-bold">404: Blog Not Found</h1>
      </div>
    );
  }

  const themeStyle = themes[blog.theme] || 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen p-6 ${themeStyle}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <h1 className="text-4xl font-extrabold mb-2">{blog.title}</h1>
          <p className="text-lg">{blog.description}</p>
        </Card>

        {posts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Latest Posts</h2>
            {posts.map((post) => (
              <Card key={post._id}>
                <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
                <div
                  className="text-base"
                  dangerouslySetInnerHTML={{ __html: post.content.slice(0, 300) + '...' }}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}