
import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.section 
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-r from-purple-700 to-fuchsia-500 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-5xl font-bold mb-4">Welcome to CYBEV</h1>
      <p className="text-lg max-w-xl mb-8">The AI-powered Web3 social media & blog platform for creators, communities, and crypto pioneers.</p>
      <button className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-full shadow hover:bg-purple-100 transition">Get Started</button>
    </motion.section>
  );
}
