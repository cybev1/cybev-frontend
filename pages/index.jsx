import Head from 'next/head';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV – Create. Earn. Mint. Grow.</title>
        <meta name="description" content="Your Gen-Z powered Web3 platform for creators." />
      </Head>
      <div className="bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">
        <Hero />
        <Features />
        <Footer />
      </div>
    </>
  );
}