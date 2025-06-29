import Card3D from '../components/Card3D';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-10">
      <nav className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CYBEV.IO</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 border rounded">Log in</button>
        </div>
      </nav>
      <main className="mt-20 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl">
          <h2 className="text-5xl font-extrabold mb-6">Welcome to CYBEV.IO</h2>
          <p className="mb-6 text-lg">The all-in-one AI-powered Web3 platform to build, share, mint, and earn with blogs, NFTs, social feeds, and creator tools.</p>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold">Get Started</button>
        </div>
        <div className="mt-10 md:mt-0 md:ml-10">
          <Card3D />
        </div>
      </main>
    </div>
  );
}
