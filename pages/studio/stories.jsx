import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [message, setMessage] = useState('');
  const firstName = 'Prince';

  useEffect(() => {
    const hour = new Date().getHours();
    let greet = 'Hello';
    if (hour < 12) greet = 'Good morning';
    else if (hour < 18) greet = 'Good afternoon';
    else greet = 'Good evening';
    setGreeting(`${greet}, ${firstName}`);

    const msgs = [
      'Today is a great day and you are winning!',
      'Keep pushing forward—you’ve got this!',
      'Your hard work is paying off. Stay motivated!',
      'Believe in yourself and magic will happen!',
      'Stay focused and never give up!'
    ];
    setMessage(msgs[new Date().getDate() % msgs.length]);
  }, []);

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(console.error);
  }, []);

  const initialLetter = firstName.charAt(0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Greeting Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center space-x-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-bold">{initialLetter}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{greeting}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </motion.div>

      {/* Stories Carousel */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl overflow-x-auto whitespace-nowrap p-4">
        <h2 className="text-lg font-semibold mb-2">Stories</h2>
        <div className="flex space-x-4">
          {stories.map(story => (
            <motion.div
              key={story.id}
              className="inline-block"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 p-1 cursor-pointer">
                <img
                  src={story.avatar || '/default-avatar.png'}
                  alt={story.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-sm mt-1">{story.userName}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
