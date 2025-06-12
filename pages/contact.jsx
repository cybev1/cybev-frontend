
import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head><title>Contact – CYBEV</title></Head>
      <div className="min-h-screen p-10 text-center bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">Have questions or suggestions? Reach out to our team.</p>
        <a href="mailto:support@cybev.io" className="text-blue-600 font-medium hover:underline">support@cybev.io</a>
      </div>
    </>
  );
}
