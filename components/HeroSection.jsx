import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-bold mb-6 text-center"
      >
        Welcome to CYBEV.IO
      </motion.h1>
      <p className="text-lg md:text-2xl mb-8 text-center max-w-2xl">
        The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
      </p>
      <div className="flex gap-4">
        <a href="/register" className="px-6 py-3 rounded-full bg-white text-purple-600 font-bold hover:bg-gray-200 transition-all">
          Get Started
        </a>
        <a href="/login" className="px-6 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-purple-700 transition-all">
          Sign In
        </a>
      </div>
    </section>
  );
}