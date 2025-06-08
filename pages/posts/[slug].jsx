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
    if (!slug) return;

    const fetchPost = async () => {
      const t = await getTemplateByHost(hostname);
      setTemplate(t);

      const res = await fetch('/api/blog/post?slug=' + slug + '&host=' + hostname);
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
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
    </div>
  );
}