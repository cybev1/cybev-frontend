
import Head from 'next/head';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV.IO – AI-Powered Web3 Platform</title>
        <meta name="description" content="Build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools." />
      </Head>
      <main className="bg-gradient-to-br from-[#1F1C2C] to-[#928DAB] text-white min-h-screen">
        <Hero />
        <Features />
        <CallToAction />
        <Footer />
      </main>
    </>
  );
}
