
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-800 text-white py-20 px-6 text-center rounded-lg shadow-xl">
      <h2 className="text-4xl font-bold mb-4">Unleash Your Potential</h2>
      <p className="text-lg mb-6">Join CYBEV – where creators thrive with AI, Web3, and crypto-powered rewards.</p>
      <Link href="/studio/dashboard">
        <a className="bg-white text-purple-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
          Get Started Now
        </a>
      </Link>
    </section>
  );
}
