
import Head from 'next/head';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] text-white min-h-screen font-sans overflow-x-hidden">
      <Head>
        <title>CYBEV – AI-Powered Web3 Blog & Social Platform</title>
        <meta name="description" content="Create, blog, mint NFTs, run ads, manage communities, and earn crypto – all in one AI-powered Web3 platform." />
      </Head>
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
