
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Head>
        <title>CYBEV – AI-Powered Web3 Platform</title>
        <meta name="description" content="Build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools on CYBEV." />
        <meta property="og:title" content="CYBEV – Create. Earn. Grow." />
        <meta property="og:description" content="Your all-in-one AI-powered Web3 Creator Studio." />
        <meta property="og:image" content="/og-banner.png" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white">
        <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Welcome to CYBEV.IO
          </motion.h1>
          <motion.p
            className="mt-6 text-lg max-w-2xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.
          </motion.p>

          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <Link href="/register">
              <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:scale-105 transition">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-xl hover:bg-gray-200 transition">
                Sign In
              </button>
            </Link>
          </motion.div>
        </section>

        <motion.section
          className="px-4 md:px-20 py-16 bg-black bg-opacity-30 backdrop-blur-xl rounded-t-3xl shadow-2xl mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-10 text-center text-fuchsia-500">Everything You Need in One Platform</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { title: 'Blog Builder', desc: 'Launch and monetize blogs with built-in SEO & AI tools.' },
              { title: 'NFT Minting', desc: 'Mint your content into NFTs and trade on the marketplace.' },
              { title: 'Social Feed', desc: 'Connect, post, and engage with a Gen-Z inspired timeline.' },
              { title: 'Staking & Rewards', desc: 'Earn CYBV tokens through posts, shares, and engagement.' },
              { title: 'Creator Studio', desc: 'Track analytics, manage assets, and grow your brand.' },
              { title: 'Web3 Wallet', desc: 'Integrated wallet for tokens, NFTs, and transactions.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-tr from-gray-900 via-purple-800 to-fuchsia-800 p-6 rounded-2xl shadow-xl hover:scale-105 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 + i * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-300">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </>
  );
}
