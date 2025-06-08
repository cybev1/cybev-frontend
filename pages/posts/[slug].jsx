import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [template, setTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const getTemplateByHost = async (host) => {
    const map = {
      'growth.cybev.io': 'modern',
      'techtalks.io': 'classic',
    };
    return map[host] || 'modern';
  };

  useEffect(() => {
    if (!slug || !hostname) return;

    const fetchPost = async () => {
      const t = await getTemplateByHost(hostname);
      setTemplate(t);

      const res = await fetch('/api/blog/post?slug=' + slug + '&host=' + hostname);
      const data = await res.json();
      if (data.success) {
        setPost(data.post);

        // Track post view
        await fetch('/api/analytics/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, host: hostname }),
        });
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, hostname]);

  const TemplatePage = dynamic(() =>
    import(`../../components/templates/${template === 'classic' ? 'ClassicPostCard' : 'ModernPostCard'}`), {
    loading: () => <p>Loading template...</p>,
    ssr: false,
  });

  if (loading) return <div className="p-6">Loading post...</div>;
  if (!post) return <div className="p-6 text-red-600">Post not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <TemplatePage post={post} />
      <div className="prose prose-lg max-w-none mt-6" dangerouslySetInnerHTML={{ __html: post.content }} />

<div className="mt-10 bg-white p-4 rounded-xl shadow border">
  <h3 className="text-lg font-semibold mb-2 text-gray-800">📈 Post Performance Summary</h3>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
    <div>
      <p className="font-bold text-indigo-700">Views</p>
      <p className="text-gray-700">{post.views || 0}</p>
    </div>
    <div>
      <p className="font-bold text-green-700">Shares</p>
      <p className="text-gray-700">{post.shares || 0}</p>
    </div>
    <div>
      <p className="font-bold text-yellow-600">Earnings</p>
      <p className="text-gray-700">${post.earnings?.toFixed(2) || '0.00'}</p>
    </div>
    <div>
      <p className="font-bold text-gray-500">Last Viewed</p>
      <p className="text-gray-700">{post.lastViewed ? new Date(post.lastViewed).toLocaleString() : 'N/A'}</p>
    </div>
  </div>
</div>

    </div>
  );
}