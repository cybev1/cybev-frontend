
import { motion } from 'framer-motion';

const features = [
  { title: 'AI Blog Generator', desc: 'Use AI to write and optimize SEO-friendly articles.' },
  { title: 'NFT Minting', desc: 'Mint your blogs and content as tradable NFTs.' },
  { title: 'Crypto Earnings', desc: 'Earn from engagement, minting, and staking.' },
];

export default function Features() {
  return (
    <div className="py-20 px-4 sm:px-10 md:px-20 bg-black">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Core Features</h2>
        <p className="text-gray-400 mt-4">Everything you need to grow your brand with AI + Web3</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-lg hover:scale-105 transform transition duration-300"
          >
            <h3 className="text-xl font-semibold text-white">{f.title}</h3>
            <p className="text-gray-400 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
