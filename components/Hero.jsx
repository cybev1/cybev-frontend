import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const phrases = ["Create", "Earn", "Mint", "Grow"];

export default function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold">
          {phrases[index]} <span className="text-pink-400">with CYBEV</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          The all-in-one platform to create blogs, earn with NFTs, and grow your influence.
        </p>
      </motion.div>
    </section>
  );
}