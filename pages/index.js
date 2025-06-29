import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <Head>
        <title>CYBEV.IO – All-in-One AI-Powered Platform</title>
      </Head>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-32 w-[600px] h-[600px] bg-purple-600 opacity-30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-indigo-500 opacity-30 rounded-full filter blur-2xl animate-ping" />
      </div>
      <main className="relative z-10 flex flex-col items-center justify-center text-center p-10 space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
          Welcome to <span className="text-cyan-400">CYBEV.IO</span>
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl text-gray-300">
          The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
        </p>
        <div className="space-x-4">
          <Link href="/register" className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-lg transition">
            Get Started
          </Link>
          <Link href="/login" className="px-6 py-3 border border-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-lg transition">
            Sign In
          </Link>
        </div>
      </main>
    </div>
  )
}