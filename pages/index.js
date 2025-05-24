import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();

  const handleChoice = () => {
    router.push('/dashboard/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-900 mb-3">CYBEV.IO</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        The all-in-one AI-powered social Web3 blogging & earning ecosystem. Build, earn, own, and grow your presence online with the power of blockchain and AI.
      </p>

      <button
        onClick={handleChoice}
        className="bg-blue-600 text-white px-6 py-3 text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Create a Blog/Website
      </button>

      <div className="text-sm text-gray-500 mt-6">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
      </div>
    </div>
  );
}