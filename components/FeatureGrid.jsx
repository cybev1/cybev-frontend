
import { motion } from 'framer-motion';

const features = [
  { title: "Blog Builder", desc: "Launch and monetize blogs with built-in SEO & AI tools." },
  { title: "NFT Minting", desc: "Mint your content into NFTs and trade on the marketplace." },
  { title: "Social Feed", desc: "Connect, post, and engage with a Gen-Z inspired timeline." },
  { title: "Staking & Rewards", desc: "Earn CYBV tokens through posts, shares, and engagement." },
  { title: "Creator Studio", desc: "Track analytics, manage assets, and grow your brand." },
  { title: "Web3 Wallet", desc: "Integrated wallet for tokens, NFTs, and transactions." },
];

export default function FeatureGrid() {
  return (
    <section className="px-6 py-16 bg-white dark:bg-gray-950 text-gray-800 dark:text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Everything You Need in One Platform</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((item, idx) => (
          <motion.div
            key={idx}
            className="p-6 rounded-xl shadow-lg bg-purple-50 dark:bg-gray-900 hover:shadow-2xl transition-all"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
