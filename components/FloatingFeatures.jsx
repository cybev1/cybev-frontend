import { Sparkles, PenTool, Coins, Image } from 'lucide-react';

const features = [
  { icon: <Sparkles />, title: 'AI Blog Generator', desc: 'Generate SEO blogs in seconds.' },
  { icon: <PenTool />, title: 'NFT Minting', desc: 'Mint content as NFTs on-chain.' },
  { icon: <Coins />, title: 'Crypto Earnings', desc: 'Earn from views, likes, and shares.' },
  { icon: <Image />, title: 'Social Media Tools', desc: 'Boost your posts with AI and crypto.' },
];

export default function FloatingFeatures() {
  return (
    <section id="features" className="py-16 px-6 max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-lg text-center transition hover:scale-105 hover:bg-white/10">
          <div className="text-blue-500 mb-4 flex justify-center">{f.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-sm text-gray-300">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}