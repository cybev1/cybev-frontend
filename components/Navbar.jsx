import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md fixed top-0 w-full bg-white z-50">
      <Link href="/"><span className="text-lg font-bold">CYBEV</span></Link>
      <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>
      <ul className={`md:flex gap-6 ${open ? 'block' : 'hidden'} md:block`}>
        <li><Link href="#features">Features</Link></li>
        <li><Link href="#contact">Contact</Link></li>
      </ul>
    </nav>
  );
}