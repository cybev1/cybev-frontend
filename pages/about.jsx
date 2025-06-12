
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head><title>About – CYBEV</title></Head>
      <div className="min-h-screen p-10 text-center bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4">About CYBEV</h1>
        <p className="text-lg max-w-2xl mx-auto">
          CYBEV is an AI-powered Web3 platform that empowers creators to build blogs, mint NFTs, earn tokens, and manage communities — all in one seamless ecosystem.
        </p>
      </div>
    </>
  );
}
