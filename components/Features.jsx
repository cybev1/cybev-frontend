
export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Core Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["AI Blog Generator", "Generate SEO blogs in seconds."],
            ["NFT Minting", "Mint content as NFTs on-chain."],
            ["Crypto Earnings", "Earn from views, likes, and shares."],
            ["Social Media Tools", "Boost your posts with AI and crypto."]
          ].map(([title, desc]) => (
            <div key={title} className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
