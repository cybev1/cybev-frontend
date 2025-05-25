import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Auto-redirects after login if token exists
      router.push('/dashboard');
    }
  }, []);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-center flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold text-blue-800 mb-6">Welcome to CYBEV.IO</h1>
        <p className="text-lg text-gray-700 mb-8">
          The all-in-one AI-powered social Web3 blogging and earning ecosystem. Create powerful blogs, publish to the world, mint content as NFTs, earn tokens, and build your online empire.
        </p>
        <div className="aspect-video bg-black rounded shadow-md overflow-hidden mb-8">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1"
            title="CYBEV Promo Video"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
        >
          GET STARTED
        </button>
        <p className="text-sm text-gray-500 mt-4">Already have an account? <a href="/login" className="text-blue-700 underline">Log in</a></p>
      </div>
    </div>
  );
}