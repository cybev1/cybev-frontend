import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col items-center justify-center px-6 py-20 text-center">
      <Head>
        <title>CYBEV – AI + Web3 for Creators</title>
      </Head>

      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
        Welcome to <span className="text-indigo-600 dark:text-cyan-400">CYBEV</span>
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mb-6">
        Build your blog, mint your posts, stake your influence, and earn from every view. CYBEV is the future of AI + Web3 social creation.
      </p>
      <Link href="/register" passHref>
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md text-lg transition-all">
          Join CYBEV Now
        </button>
      </Link>

      <footer className="absolute bottom-4 text-sm text-gray-500 dark:text-gray-400">
        © 2025 CYBEV. All rights reserved.
      </footer>
    </div>
  );
}