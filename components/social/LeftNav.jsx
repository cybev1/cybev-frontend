import Link from 'next/link';

export default function LeftNav() {
  return (
    <aside className="w-60 bg-white dark:bg-gray-800 p-4 hidden lg:block">
      <div className="text-2xl font-bold text-blue-600 mb-6">CYBEV</div>
      <nav className="space-y-2">
        <Link href="/feed"><a className="block px-2 py-1 hover:bg-gray-200">Home</a></Link>
        <Link href="/explore"><a className="block px-2 py-1 hover:bg-gray-200">Explore</a></Link>
        <Link href="/studio/stories"><a className="block px-2 py-1 hover:bg-gray-200">Stories</a></Link>
      </nav>
    </aside>
