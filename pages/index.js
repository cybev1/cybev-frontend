import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-20">
      <nav className="flex justify-between items-center mb-20">
        <h1 className="text-2xl font-bold">CYBEV.IO</h1>
        <div className="flex items-center gap-6">
          <Link href="/blog">Blog</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/login" className="border px-4 py-1 rounded-md">Log in</Link>
        </div>
      </nav>
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div>
          <h2 className="text-5xl font-extrabold mb-4">Welcome to CYBEV.IO</h2>
          <p className="text-lg text-gray-300 mb-6 max-w-xl">
            The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
          </p>
          <Link href="/register">
            <button className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg">
              Get Started
            </button>
          </Link>
        </div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-white rounded-2xl shadow-xl px-6 py-8 w-[320px] text-black"
        >
          <h3 className="text-xl font-bold mb-2">Getting Started with Web3</h3>
          <p className="text-sm text-gray-600 mb-4">Sharon M.</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md">Read</button>
        </motion.div>
      </div>
    </div>
  );
}
