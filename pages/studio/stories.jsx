// pages/studio/stories.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Stories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(console.error);
  }, []);

  return (
    <div className="py-4 bg-white dark:bg-gray-800 shadow rounded-2xl overflow-x-auto whitespace-nowrap px-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Stories</h2>
      <div className="flex space-x-4">
        {stories.map(story => (
          <motion.div 
            key={story.id} 
            className="inline-block"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500 p-1 cursor-pointer">
              <img src={story.avatar || '/default-avatar.png'} alt={story.userName} className="w-full h-full object-cover" />
            </div>
            <p className="text-center text-sm mt-1 text-gray-700 dark:text-gray-300">{story.userName}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
