
import Head from 'next/head';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV.IO – AI + Web3 Social Platform</title>
        <meta name="description" content="Launch, share, mint, and earn. Blog builder, NFT marketplace, creator tools & timeline." />
      </Head>
      <main className="bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen overflow-x-hidden">
        <HeroSection />
        <FeatureGrid />
      </main>
    </>
  );
}
