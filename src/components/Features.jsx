export default function Features() {
  return (
    <section id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
      {[
        { title: "AI Blog Generator", desc: "Generate SEO blogs in seconds." },
        { title: "NFT Minting", desc: "Mint content as NFTs on-chain." },
        { title: "Crypto Earnings", desc: "Earn from views, likes, and shares." },
        { title: "Social Media Tools", desc: "Boost your posts with AI and crypto." }
      ].map((f, i) => (
        <div key={i} className="bg-[#F0F8FF] dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-2">{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
