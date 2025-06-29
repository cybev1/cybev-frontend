import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c2a] to-[#120429] text-white font-sans">
      <Head>
        <title>CYBEV.IO – Welcome</title>
        <meta name="description" content="AI-powered Web3 platform to build, mint, and earn." />
      </Head>

      <nav className="flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold">CYBEV.IO</div>
        <div className="space-x-6 hidden md:flex">
          <a href="#" className="hover:text-purple-400">Blog</a>
          <a href="#" className="hover:text-purple-400">Studio</a>
          <button className="border px-4 py-1 rounded-md">Log in</button>
          <button className="text-xl">🌙</button>
        </div>
      </nav>

      <section className="relative px-8 py-24">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-extrabold leading-tight">Welcome to <br />CYBEV.IO</h1>
          <p className="mt-6 text-lg text-gray-300">
            The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
          </p>
          <button className="mt-8 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold">Get Started</button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-32 right-12 transform rotate-6"
        >
          <div className="bg-white shadow-2xl rounded-xl p-6 w-64 text-black">
            <p className="text-lg font-bold">Getting Started with Web3</p>
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span className="ml-3 text-gray-600">Sharon M.</span>
            </div>
            <button className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-md">Read</button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
