import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – AI-Powered Web3 Blog & Social Platform</title>
    <meta name="description" content="Create, blog, mint NFTs, run ads, manage communities, and earn crypto – all in one AI-powered Web3 platform." />
    <meta property="og:title" content="CYBEV.IO – Create, Earn, Mint, Grow" />
    <meta property="og:description" content="Your all-in-one Creator Studio powered by AI + Web3. Blog, share, mint NFTs, and earn on CYBEV.IO." />
    <meta property="og:image" content="https://app.cybev.io/og-banner.png" />
    <meta property="og:url" content="https://app.cybev.io" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);


export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <SeoHead />
      <div className="min-h-screen ...">
        <Navbar theme={theme} setTheme={setTheme} />
        <div className="flex flex-col ...">
          <motion.h1 className="text-5xl ...">Welcome to CYBEV.IO</motion.h1>
        </div>
      </div>
    </>
  );
}