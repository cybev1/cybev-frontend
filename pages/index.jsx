import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col justify-center items-center px-4">
      <Head>
        <title>CYBEV.IO – AI-Powered Web3 Platform</title>
      </Head>
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">Welcome to CYBEV.IO</h1>
      <p className="text-center text-lg md:text-xl max-w-xl mb-10">
        The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
      </p>
      <button className="bg-indigo-500 hover:bg-indigo-600 transition px-6 py-3 rounded-lg text-white font-semibold shadow-lg">
        Get Started
      </button>
    </div>
  );
}
