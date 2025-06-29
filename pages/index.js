import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/solid'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white min-h-screen">
      <Head>
        <title>CYBEV – AI Web3 Platform</title>
        <meta name="description" content="CYBEV is an all-in-one AI-powered Web3 platform." />
      </Head>

      <header className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">CYBEV.IO</h1>
        <div className="space-x-4">
          <Link href="/login"><button className="px-4 py-2 rounded bg-white text-black font-semibold">Sign In</button></Link>
          <Link href="/register"><button className="px-4 py-2 rounded border border-white hover:bg-white hover:text-black transition">Get Started</button></Link>
        </div>
      </header>

      <main className="text-center px-6 py-20">
        <motion.h2 className="text-4xl md:text-6xl font-bold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          Welcome to CYBEV.IO
        </motion.h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10">
          The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
        </p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/register" className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition">
            Get Started <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </main>

      <section className="px-6 py-16 bg-black text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {["Blog Builder", "NFT Minting", "Social Feed", "Staking & Rewards", "Creator Studio", "Web3 Wallet"].map((title, i) => (
            <motion.div key={title} className="bg-gradient-to-tr from-gray-800 to-indigo-700 rounded-xl p-6 shadow-lg" whileHover={{ scale: 1.03 }}>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm opacity-80">Learn more about {title.toLowerCase()} on CYBEV.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="p-6 text-center text-sm bg-gray-900 text-gray-400">
        &copy; 2025 CYBEV. All rights reserved.
      </footer>
    </div>
  )
}