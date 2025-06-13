import React from 'react';
import { motion } from 'framer-motion';

/**
 * Stories carousel with upload and live frames
 */
export default function StoriesCarousel({ stories }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 overflow-x-auto whitespace-nowrap mb-4">
      <div className="flex space-x-4">
        {stories.map(story => (
          <motion.div key={story.id} className="inline-block text-center" whileHover={{ scale: 1.05 }}>
            {/* rectangular portrait frame */}
            <div className="w-20 h-32 rounded-xl overflow-hidden border-2 border-blue-500 p-1">
              <img src={story.avatar} alt={story.userName} className="w-full h-full object-cover"/>
            </div>
            <p className="text-xs mt-1">{story.userName}</p>
          </motion.div>
        ))}
      </div>
    </div>
