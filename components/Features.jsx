
import { motion } from 'framer-motion';
import { Lightbulb, Edit3, DollarSign } from 'lucide-react';

const features = [
  { icon: <Edit3 className="h-6 w-6" />, title: 'AI Blog Generator', desc: 'Use AI to write and optimize SEO-friendly articles.' },
  { icon: <Lightbulb className="h-6 w-6" />, title: 'NFT Minting', desc: 'Mint your blogs and content as tradable NFTs.' },
  { icon: <DollarSign className="h-6 w-6" />, title: 'Crypto Earnings', desc: 'Earn from engagement, minting, and staking.' },
];

export default function Features() {
  return (
    <section className="py-16 px-6 text-center bg-white text-gray-800">
      <h2 className="text-3xl font-bold mb-10">Core Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 text-indigo-600">{feature.icon}</div>
            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
