
import { motion } from 'framer-motion'
import Link from 'next/link'
import LandingNavbar from '@/components/LandingNavbar'

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to CYBEV.IO
        </motion.h1>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link href="/register">
            <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow hover:bg-blue-700 transition">
              Get Started
            </span>
          </Link>
        </motion.div>
      </div>
    </>
  )
}
    