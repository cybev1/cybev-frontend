import { motion } from 'framer-motion';

const features = [
  { title: "AI Content Tools", desc: "Write blogs with AI and mint them into NFTs" },
  { title: "Social Media Network", desc: "Post, share, boost, and earn tokens" },
  { title: "Custom Blog Builder", desc: "Create your personal or business blog in minutes" }
];

export default function Features() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 text-center">Why Choose CYBEV?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-2 text-pink-300">{f.title}</h3>
            <p className="text-sm text-gray-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}