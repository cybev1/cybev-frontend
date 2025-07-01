import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DashboardLayout({ children, title }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">CYBEV Studio</h2>
        <nav className="space-y-2">
          <Link href="/studio/dashboard" className={router.pathname === "/studio/dashboard" ? "font-bold" : ""}>Dashboard</Link>
          <Link href="/studio/create">Create Post</Link>
          <Link href="/studio/blogs">My Blogs</Link>
          <Link href="/studio/wallet">Wallet</Link>
          <Link href="/studio/profile">Profile</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-white dark:bg-gray-900 text-black dark:text-white p-6">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {children}
      </main>
    </div>
  );
}