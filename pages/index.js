
export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 mb-6">Welcome to CYBEV</h1>
      <p className="text-gray-600 text-lg md:text-xl mb-10">Build, Earn, and Grow with AI + Web3</p>
      <div className="space-x-4">
        <a href="/blog/setup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow">Create a Blog</a>
        <a href="/domain-check" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow">Check Domain</a>
      </div>
    </div>
  );
}
