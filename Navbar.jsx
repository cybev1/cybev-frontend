
import { MoonIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  return (
    <header className="z-20 relative flex justify-between items-center px-6 py-4">
      <div className="text-2xl font-bold">CYBEV.IO</div>
      <nav className="flex items-center space-x-6 text-sm">
        <a href="/blog" className="hover:text-primary">Blog</a>
        <a href="/studio" className="hover:text-primary">Studio</a>
        <button className="px-4 py-1 border border-white rounded hover:bg-white hover:text-black transition">Log in</button>
        <MoonIcon className="w-5 h-5" />
      </nav>
    </header>
  );
}
