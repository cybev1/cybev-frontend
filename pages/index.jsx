
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – AI-Powered Web3 Blog & Social Platform</title>
    <meta name="description" content="Create, blog, mint NFTs, run ads, manage communities, and earn crypto – all in one AI-powered Web3 platform." />
    <meta property="og:title" content="CYBEV.IO – Create, Earn, Mint, Grow" />
    <meta property="og:description" content="Your all-in-one Creator Studio powered by AI + Web3. Blog, share, mint NFTs, and earn on CYBEV.IO." />
    <meta property="og:image" content="https://app.cybev.io/og-banner.png" />
    <meta property="og:url" content="https://app.cybev.io" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleGetStarted = () => {
    const ref = router.query.ref;
    if (ref) localStorage.setItem('cybev_ref', ref);
    router.push('/register');
  };

  return (
    <>
      <SeoHead />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition duration-500 overflow-hidden">
        <nav className="w-full flex justify-between items-center px-6 py-4 shadow-sm backdrop-blur-md bg-white/70 dark:bg-black/70 relative z-50">
          <div className="text-xl font-bold text-blue-700 dark:text-white">CYBEV.IO</div>

          <div className="md:flex hidden items-center gap-6">
            <Link href="/features" className="nav-link">Features</Link>
            <Link href="/setup" className="nav-link">Create a Blog</Link>
            <Link href="/timeline" className="nav-link">Timeline</Link>
            <Link href="/explore" className="nav-link">Explore</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            <button onClick={handleGetStarted} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700">Get Started</button>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-700" />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XMarkIcon className="w-6 h-6 text-gray-800 dark:text-white" /> : <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-white" />}
            </button>
          </div>

          {menuOpen && (
            <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 flex flex-col items-start gap-4 p-6 shadow-lg z-40 md:hidden">
              <Link href="/features" className="nav-link">Features</Link>
              <Link href="/setup" className="nav-link">Create a Blog</Link>
              <Link href="/timeline" className="nav-link">Timeline</Link>
              <Link href="/explore" className="nav-link">Explore</Link>
              <Link href="/about" className="nav-link">About Us</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
              <button onClick={handleGetStarted} className="w-full px-4 py-2 mt-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700">Get Started</button>
            </div>
          )}
        </nav>

        <div className="flex flex-col justify-center items-center text-center px-6 py-28 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl px-10 py-14 rounded-3xl shadow-2xl border border-blue-200 dark:border-gray-800 max-w-2xl"
          >
            <motion.h1 className="text-5xl font-extrabold text-blue-900 dark:text-white mb-4">
              Welcome to CYBEV.IO
            </motion.h1>
            <motion.p className="text-lg text-gray-700 dark:text-gray-300">
              Build, blog, mint, and earn from the next-gen AI-powered Web3 platform.
              Unlock creative tools, manage communities, and grow your brand.
            </motion.p>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
            >
              Create Your Account
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
