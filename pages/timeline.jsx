
import Head from 'next/head';
import Layout from '@/components/Layout';


export default function Timeline() {
  return (
    <Layout>
      <Head><title>Timeline – CYBEV</title></Head>
      
<nav className="w-full fixed top-0 left-0 z-50 flex justify-between items-center px-6 py-4 shadow-sm backdrop-blur-md bg-white/70 dark:bg-black/70">
  <div className="text-xl font-bold text-blue-700 dark:text-white">CYBEV</div>
  <div className="hidden md:flex gap-5 items-center text-sm font-medium">
    <a href="/features" className="text-gray-700 dark:text-white hover:text-blue-600">Features</a>
    <a href="/setup" className="text-gray-700 dark:text-white hover:text-blue-600">Create a Blog</a>
    <a href="/timeline" className="text-gray-700 dark:text-white hover:text-blue-600">Timeline</a>
    <a href="/explore" className="text-gray-700 dark:text-white hover:text-blue-600">Explore</a>
    <a href="/about" className="text-gray-700 dark:text-white hover:text-blue-600">About Us</a>
    <a href="/contact" className="text-gray-700 dark:text-white hover:text-blue-600">Contact</a>
    <a href="/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Get Started</a>
  </div>
</nav>


<div className="min-h-screen pt-32 p-10 bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-center">Your Timeline</h1>
        <p className="text-lg text-center">Follow your favorite creators and explore real-time content from across the platform.</p>
      </div>
    </Layout>
  );
}
