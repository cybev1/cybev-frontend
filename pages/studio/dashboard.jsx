
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('cybev_user_token');
    if (!token) router.replace('/auth/login');
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <div className="space-y-2">
        <Link href="/studio/create" className="text-blue-600 underline">➕ Create New Post</Link><br/>
        <Link href="/studio/blogs" className="text-blue-600 underline">📝 View My Blogs</Link><br/>
        <Link href="/studio/write" className="text-blue-600 underline">✍️ Write in a Blog</Link>
      </div>
    </div>
  );
}
