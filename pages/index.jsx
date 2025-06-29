import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#dfe9ff] text-gray-800 flex flex-col justify-center items-center p-6">
      <Head>
        <title>CYBEV – AI-Powered Web3</title>
        <meta name="description" content="The AI-powered Web3 social media & blog platform for creators, communities, and crypto pioneers." />
      </Head>
      <main className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Welcome to CYBEV</h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">
          Build your blog, mint your posts, stake your influence, and earn from every view. CYBEV is the future of AI + Web3 social creation.
        </p>
        <Link href="/register">
          <button className="bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition">Join CYBEV Now</button>
        </Link>
      </main>
      <footer className="mt-20 text-sm text-gray-500">
        © {new Date().getFullYear()} CYBEV. All rights reserved.
      </footer>
    </div>
  );
}