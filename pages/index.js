import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-100 to-white px-4 py-16">
        <h1 className="text-5xl font-bold text-blue-900 mb-4 animate-pulse">Welcome to CYBEV.IO</h1>
        <p className="text-lg max-w-2xl mb-6">
          The all-in-one AI-powered social Web3 blogging and earning ecosystem.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
        >
          GET STARTED
        </button>
      </section>

      {/* Promo Video Section */}
      <section className="px-6 py-12 bg-blue-50 text-center">
        <h2 className="text-3xl font-bold mb-4">Watch CYBEV in Action</h2>
        <div className="max-w-3xl mx-auto aspect-video rounded overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="CYBEV Promo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Can You Do with CYBEV?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Create Smart Blogs</h3>
            <p>Build stunning, AI-assisted blogs and websites with ease.</p>
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Monetize Content</h3>
            <p>Earn CYBEV tokens for engagement, shares, and activity.</p>
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Mint & Share NFTs</h3>
            <p>Turn your blog posts into digital assets instantly.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">What People Are Saying</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <blockquote className="p-4 bg-white shadow rounded">
            <p className="italic">"CYBEV helped me launch my brand without knowing how to code!"</p>
            <footer className="text-sm text-right text-blue-700">– Alex, Digital Creator</footer>
          </blockquote>
          <blockquote className="p-4 bg-white shadow rounded">
            <p className="italic">"The integration of blogging, AI, and Web3 is simply genius."</p>
            <footer className="text-sm text-right text-blue-700">– Naomi, NFT Blogger</footer>
          </blockquote>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="border p-4 rounded shadow">
            <h4 className="font-semibold">Do I need to know how to code?</h4>
            <p>Nope! CYBEV is fully no-code and beginner friendly.</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h4 className="font-semibold">How do I earn tokens?</h4>
            <p>You earn CYBEV tokens through content creation, engagement, and referrals.</p>
          </div>
          <div className="border p-4 rounded shadow">
            <h4 className="font-semibold">Can I register a custom domain?</h4>
            <p>Yes! CYBEV lets you connect or register your own domain easily.</p>
          </div>
        </div>
      </section>
    </div>
  );
}