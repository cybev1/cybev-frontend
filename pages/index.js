import { useEffect } from 'react';
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-8 text-center">
      <h1 className="text-5xl font-extrabold text-blue-900 mb-4 animate-bounce">CYBEV.IO</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-10 animate-fade-in">
        The all-in-one AI-powered social Web3 blogging & earning ecosystem. Build, earn, own, and grow your presence online with the power of blockchain and AI.
      </p>

      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <button
          onClick={() => router.push('/dashboard/create')}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Create a Blog/Website
        </button>
        <button
          onClick={() => router.push('/explore')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Join the Social Network
        </button>
        <p className="text-sm text-gray-500 mt-6">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}