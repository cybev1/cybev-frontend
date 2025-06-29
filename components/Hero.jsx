
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative text-center py-20 px-4 sm:px-10 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight"
      >
        Welcome to CYBEV
      </motion.div>
      <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
        Build your blog. Monetize your content. Earn with Web3.
      </p>
      <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-purple-500 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
      <div className="absolute top-0 right-[-50px] w-80 h-80 bg-pink-500 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-50px] left-1/3 w-72 h-72 bg-blue-500 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
    </div>
  );
}
