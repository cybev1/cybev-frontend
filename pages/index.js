import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = false; // Replace with actual auth check
    if (isLoggedIn) router.push('/studio/dashboard');
  }, []);

  return (
    <>
      <Head>
        <title>CYBEV – AI-Powered Web3 Platform</title>
        <meta name="description" content="Create, blog, mint NFTs, and grow with CYBEV." />
      </Head>
      <main className="min-h-screen flex items-center justify-center flex-col text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
          CYBEV – Create. Earn. Influence.
        </h1>
        <div className="flex gap-4 animate-fadeInUp delay-200">
          <Link href="/blog/setup" className="bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition">
            Create a Blog/Website
          </Link>
          <Link href="/feed" className="bg-white text-black border py-3 px-6 rounded-xl hover:bg-gray-100 transition">
            Join Social Media Network
          </Link>
        </div>
      </main>
    </>
  );
}
