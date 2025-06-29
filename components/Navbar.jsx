
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/"><span className="text-blue-600 font-bold text-lg">CYBEV.IO</span></Link>
        <div className="space-x-4 hidden md:block">
          <Link href="#features">Features</Link>
          <Link href="#contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
