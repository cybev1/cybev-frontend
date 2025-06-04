
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold text-blue-700 cursor-pointer">CYBEV</span>
        </Link>
        <div className="space-x-4">
          <Link href="/blog/setup" className="text-gray-700 hover:text-blue-600">Create Blog</Link>
          <Link href="/domain-check" className="text-gray-700 hover:text-green-600">Check Domain</Link>
        </div>
      </div>
    </nav>
  );
}
