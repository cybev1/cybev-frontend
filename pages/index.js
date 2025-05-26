import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-8 text-center">
      <h1 className="text-5xl font-extrabold text-blue-900 mb-6">Welcome to CYBEV.IO</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        The all-in-one AI-powered social Web3 blogging & earning ecosystem. Build, earn, own, and grow your presence online with the power of blockchain and AI.
      </p>
      <button
        onClick={handleGetStarted}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
      >
        Get Started
      </button>
      <div className="mt-12 w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="CYBEV Promo Video"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}