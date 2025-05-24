import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();

  const handleChoice = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-8 text-center">
      <img src="/logo.svg" alt="CYBEV Logo" className="h-16 mb-6" />
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to CYBEV</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        A Next-Gen AI-Powered Social Media + Blog Builder + Web3 Ecosystem. Build. Earn. Own. Grow.
      </p>

      <div className="grid gap-4 w-full max-w-sm">
        <button
          onClick={() => handleChoice('/register')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Join the Social Network
        </button>
        <button
          onClick={() => handleChoice('/dashboard/create')}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Create a Blog
        </button>
        <div className="text-sm text-gray-500 mt-6">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </div>
      </div>
    </div>
  );
}