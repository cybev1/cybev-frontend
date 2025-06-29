import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold">CYBEV</Link>
      <div className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </div>
      <ul className={`md:flex gap-6 absolute md:static bg-black w-full left-0 md:w-auto md:opacity-100 transition-all duration-300 ease-in-out ${open ? 'top-16 opacity-100' : 'top-[-400px] opacity-0'}`}>
        <li><a href="#features" className="block py-2 px-4 hover:text-blue-400">Features</a></li>
        <li><a href="#contact" className="block py-2 px-4 hover:text-blue-400">Contact</a></li>
      </ul>
    </nav>
  );
}