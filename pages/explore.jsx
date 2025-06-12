
import Head from 'next/head';

export default function Explore() {
  return (
    <>
      <Head><title>Explore – CYBEV</title></Head>
      <div className="min-h-screen p-10 bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-center">Explore CYBEV</h1>
        <p className="text-lg max-w-3xl mx-auto text-center">
          Browse trending blogs, top NFTs, and creator communities. Discover what’s hot in the AI + Web3 ecosystem.
        </p>
      </div>
    </>
  );
}
