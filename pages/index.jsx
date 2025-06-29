import Head from 'next/head';
import Navbar from '../components/Navbar';
import FloatingFeatures from '../components/FloatingFeatures';

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV – AI + Web3 for Creators</title>
        <meta name="description" content="Build. Blog. Mint. Earn." />
      </Head>
      <Navbar />
      <main className="bg-gradient-to-br from-purple-800 via-black to-gray-900 text-white min-h-screen">
        <section className="text-center py-20 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to CYBEV</h1>
          <p className="text-lg md:text-xl mb-8">Build your blog, mint your posts, stake your influence, and earn from every view.</p>
          <a href="#features" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg transition">Get Started</a>
        </section>
        <FloatingFeatures />
      </main>
      <footer className="text-center py-6 text-gray-400 text-sm">© 2025 CYBEV. All rights reserved.</footer>
    </>
  );
}