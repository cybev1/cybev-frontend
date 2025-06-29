
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative z-10 px-6 py-24 text-center"
    >
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Welcome to <span className="text-primary">CYBEV.IO</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
      </p>
      <motion.a
        href="/studio"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 inline-block bg-primary hover:bg-secondary transition px-8 py-4 rounded-full font-bold text-white shadow-lg"
      >
        Get Started
      </motion.a>
    </motion.section>
  );
}
