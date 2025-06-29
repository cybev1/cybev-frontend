import Navbar from '../components/Navbar';
import FloatingFeatures from '../components/FloatingFeatures';

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Navbar />
      <main className="p-6 text-center max-w-2xl mx-auto mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to CYBEV</h1>
        <p className="mb-6 text-lg">Build your blog, mint your posts, stake your influence, and earn from every view.</p>
        <button className="bg-black text-white px-6 py-2 rounded hover:scale-105 transition">Get Started</button>
      </main>
      <FloatingFeatures />
      <footer className="text-center text-sm py-10 text-gray-400">© 2025 CYBEV. All rights reserved.</footer>
    </div>
  );
}