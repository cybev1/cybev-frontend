
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <div className="text-2xl font-bold text-blue-700">CYBEV.IO</div>
      <div className="space-x-6 hidden md:flex">
        <Link href="/features" className="text-gray-700 hover:text-blue-700 font-medium transition">Features</Link>
        <Link href="/explore" className="text-gray-700 hover:text-blue-700 font-medium transition">Explore</Link>
        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Get Started</Link>
      </div>
    </nav>
  );
}
