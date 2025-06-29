import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div>
      <Head>
        <title>CYBEV.IO – AI-Powered Web3</title>
        <meta name="description" content="Your all-in-one AI-powered Web3 platform." />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to CYBEV.IO
        </motion.h1>
        <p className="text-xl mb-8 max-w-2xl">
          Build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
        </p>
        <div className="flex space-x-4">
          <a href="/register" className="px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-800 transition">Get Started</a>
          <a href="/login" className="px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition">Sign In</a>
        </div>
      </main>
    </div>
  );
}