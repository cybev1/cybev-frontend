import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance("Welcome to CYBEV.IO. Explore the future of Web3 blogging and social engagement.");
    utter.rate = 0.9;
    synth.speak(utter);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col justify-center items-center text-center px-4">
      <Head>
        <title>CYBEV.IO – Web3 Creator Studio</title>
      </Head>
      <nav className="w-full absolute top-0 left-0 flex justify-between px-10 py-6 text-white font-bold text-lg z-50">
        <div>CYBEV.IO</div>
        <div className="space-x-6">
          <Link href="/blog">Blog</Link>
          <Link href="/studio">Studio</Link>
          <button className="border border-white px-4 py-1 rounded hover:bg-white hover:text-black transition">Log in</button>
        </div>
      </nav>
      <main className="z-10 mt-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Welcome to CYBEV.IO</h1>
        <p className="max-w-xl text-lg md:text-xl mb-8 text-gray-300">
          The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
        </p>
        <Link href="/get-started">
          <button className="bg-purple-600 hover:bg-purple-800 text-white text-lg font-semibold px-6 py-3 rounded-full transition transform hover:scale-105">
            Get Started
          </button>
        </Link>
      </main>
      <div className="absolute right-10 bottom-10 bg-white text-black p-6 rounded-xl shadow-xl rotate-6 hover:rotate-0 transition-transform duration-500 ease-in-out">
        <h3 className="text-xl font-bold">Getting Started with Web3</h3>
        <p className="text-sm text-gray-700 mb-2">Sharon M.</p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-full">Read</button>
      </div>
    </div>
  );
}
