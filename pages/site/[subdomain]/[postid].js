import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card';

const themes = {
  'Theme 1': 'bg-white text-gray-900',
  'Theme 2': 'bg-gray-900 text-white',
  'Theme 3': 'bg-blue-50 text-blue-900',
  'Theme 4': 'bg-yellow-50 text-yellow-900',
  'Theme 5': 'bg-green-50 text-green-900'
};

export default function BlogPost() {
  const router = useRouter();
  const { subdomain, postid } = router.query;
  const [blog, setBlog] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subdomain && postid) {
      fetch(`/api/blogs/${subdomain}`)
        .then(res => res.json())
        .then(data => {
          setBlog(data);
          return fetch(`/api/posts/${postid}`);
        })
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(() => {
          setBlog(null);
          setPost(null);
        })
        .finally(() => setLoading(false));
    }
  }, [subdomain, postid]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading post...</div>;
  }

  if (!blog || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 p-8">
        <h1 className="text-2xl font-bold">404: Post Not Found</h1>
      </div>
    );
  }

  const themeStyle = themes[blog.theme] || 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen p-6 ${themeStyle}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">Published on {new Date(post.createdAt).toLocaleDateString()}</p>
          {post.featuredImage && <img src={post.featuredImage} alt="Featured" className="w-full rounded mb-4" />}
          {post.videoUrl && (
            <div className="aspect-video mb-4">
              <iframe
                className="w-full h-full"
                src={post.videoUrl}
                title="Blog Video"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Card>
      </div>
    </div>
  );
}