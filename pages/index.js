
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  const handleGetStarted = () => {
    router.push('/register');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500 overflow-x-hidden">
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="flex flex-col justify-center items-center text-center px-6 py-32 space-y-6 relative">
        {/* Animated floating icons */}
        <motion.div className="absolute top-10 left-10 w-10 h-10 bg-blue-400 rounded-full opacity-70"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <motion.div className="absolute top-20 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-50"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-blue-900 dark:text-white"
        >
          Welcome to CYBEV.IO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl"
        >
          The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}
