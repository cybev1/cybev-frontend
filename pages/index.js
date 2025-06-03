
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to CYBEV 🎉</h1>
        <p className="mb-6 text-lg">Your all-in-one AI-powered Social Media + Blog + Web3 Network.</p>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/studio/dashboard" className="block border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold">🚀 Creator Studio</h2>
            <p>Manage your content, analytics, NFTs and earnings</p>
          </Link>

          <Link href="/explore" className="block border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold">🌍 Explore</h2>
            <p>Discover blogs, posts, and trending content</p>
          </Link>

          <Link href="/blog" className="block border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold">📝 Create a Blog</h2>
            <p>Start writing with AI and publish your work</p>
          </Link>

          <Link href="/studio/smm/order" className="block border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold">📢 Order SMM Services</h2>
            <p>Boost your visibility and followers across platforms</p>
          </Link>

          <Link href="/studio/wallet" className="block border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold">💰 Wallet & Earnings</h2>
            <p>View, stake, or withdraw your CYBEV tokens</p>
          </Link>

          <Link href="/studio/utility" className="block border rounded p-4 hover:shadow">
            <h2 className="text-xl font-semibold">🛠️ Utilities</h2>
            <p>Buy airtime, pay bills, and more from your dashboard</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
