
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-purple-800 dark:text-white mb-6">
          Welcome to <span className="text-indigo-600">CYBEV.IO</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition">
            Get Started
          </a>
          <a href="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign In
          </a>
        </div>
      </motion.div>
    </section>
  );
}
