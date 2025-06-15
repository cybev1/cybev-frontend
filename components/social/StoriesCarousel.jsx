import React from 'react';
import { motion } from 'framer-motion';

export default function StoriesCarousel({ stories }) {
  return (
    <div className="flex space-x-3 overflow-x-auto py-2 mb-4">
      {stories.map((s, i) => (
        <motion.div
          key={i}
          className="min-w-[100px] h-[150px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          {i === 0 ? '+' : s.name}
        </motion.div>
      ))}
    </div>
  );
}
