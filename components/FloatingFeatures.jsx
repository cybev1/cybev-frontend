export default function FloatingFeatures() {
  const features = [
    { title: 'AI Blog Generator', desc: 'Generate SEO blogs in seconds.' },
    { title: 'NFT Minting', desc: 'Mint content as NFTs on-chain.' },
    { title: 'Crypto Earnings', desc: 'Earn from views, likes, and shares.' },
    { title: 'Social Media Tools', desc: 'Boost your posts with AI and crypto.' }
  ];

  return (
    <section id="features" className="p-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <div key={i} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-sm text-gray-600">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}