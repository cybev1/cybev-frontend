export default function About() {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-blue-800">About CYBEV</h1>
        <p>
          CYBEV.IO is a revolutionary AI-powered social blogging and Web3 ecosystem that empowers creators, entrepreneurs, and developers to build their digital presence, earn tokens, and own their content.
        </p>
        <p>
          Our mission is to democratize content creation by blending the power of AI, social media, and blockchain into one seamless experience. Whether you're starting a blog, minting NFTs, or creating a digital brand, CYBEV gives you the tools to thrive.
        </p>
        <img src="https://source.unsplash.com/featured/?team" className="rounded shadow w-full h-64 object-cover" alt="About CYBEV" />
      </div>
    </div>
  );
}