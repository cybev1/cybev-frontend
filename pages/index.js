import { motion } from 'framer-motion';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Head>
        <title>CYBEV.IO – Web3 Creator Platform</title>
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-purple-700">Welcome to CYBEV.IO</h1>
        <p className="text-lg mb-6">The all-in-one AI-powered Web3 platform to build, share, mint, and earn.</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition">Get Started</button>
          <button className="border border-purple-700 text-purple-700 px-6 py-2 rounded-full hover:bg-purple-50 transition">Sign In</button>
        </div>
      </motion.div>
    </div>
  );
}