export default function FeaturesSection() {
  const features = [
    { title: "Blog Builder", desc: "Launch and monetize blogs with built-in SEO & AI tools." },
    { title: "NFT Minting", desc: "Mint your content into NFTs and trade on the marketplace." },
    { title: "Social Feed", desc: "Connect, post, and engage with a Gen-Z inspired timeline." },
    { title: "Staking & Rewards", desc: "Earn CYBV tokens through posts, shares, and engagement." },
    { title: "Creator Studio", desc: "Track analytics, manage assets, and grow your brand." },
    { title: "Web3 Wallet", desc: "Integrated wallet for tokens, NFTs, and transactions." }
  ];

  return (
    <section className="bg-white py-16 px-6 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Everything You Need in One Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feat, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-2">{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}