
import Head from 'next/head';

export default function Timeline() {
  return (
    <>
      <Head><title>Timeline – CYBEV</title></Head>
      <div className="min-h-screen p-10 bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-center">Your Timeline</h1>
        <p className="text-lg text-center">Follow your favorite creators and explore real-time content from across the platform.</p>
      </div>
    </>
  );
}
