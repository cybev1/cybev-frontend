export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to CYBEV 👋</h1>
      <p className="text-lg text-gray-700 mb-6">Your AI-powered Web3 media & blog platform</p>
      <div className="space-x-4">
        <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Login</a>
        <a href="/dashboard" className="bg-gray-200 text-blue-800 px-6 py-2 rounded hover:bg-gray-300">Dashboard</a>
      </div>
    </div>
  );
}