
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';

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

export default function Home({ theme, setTheme }) {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <>
      <SeoHead />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500 overflow-hidden">
        <nav className="w-full flex justify-between items-center px-8 py-4">
          <div className="text-xl font-bold text-blue-700 dark:text-white">CYBEV.IO</div>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="text-sm bg-gray-200 px-4 py-1 rounded dark:bg-gray-700 dark:text-white">
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </nav>

        <div className="flex flex-col justify-center items-center text-center px-6 py-32 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-blue-900 dark:text-white"
          >
            Welcome to CYBEV.IO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
    </>
  );
}
