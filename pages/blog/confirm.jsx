
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ConfirmBlog() {
  const [blog, setBlog] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = {
      ...JSON.parse(localStorage.getItem('blogSetup') || '{}'),
      hosting: JSON.parse(localStorage.getItem('hostingPlan') || '{}')
    };
    setBlog(data);
  }, []);

  const handleSubmit = async () => {
    const res = await fetch('/api/blog/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    });
    const data = await res.json();
    alert('Blog setup submitted!');
    router.push('/');
  };

  if (!blog) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Review Your Blog Setup</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm">{JSON.stringify(blog, null, 2)}</pre>
      <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 mt-4 rounded">Submit Blog</button>
    </div>
  );
}
