import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GetStarted() {
  return (
    <>
      <Head>
        <title>Welcome to CYBEV.IO</title>
        <meta
          name="description"
          content="Build, mint, stake, and earn with the AI-powered Web3 platform."
        />
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-8 max-w-xl text-center mx-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to CYBEV.IO
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Build, mint, stake, and earn with the AI-powered Web3 platform.
          </p>

          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </>
  );
}