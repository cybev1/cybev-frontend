import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Header() {
  return (
    <header className="p-4 bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto">
        <a href="/studio" className="text-xl font-bold text-gray-800 dark:text-gray-100">
          CYBEV Studio
        </a>
      </div>
    </header>
  );
}

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    let greet = 'Hello';
    if (hour < 12) greet = 'Good morning';
    else if (hour < 18) greet = 'Good afternoon';
    else greet = 'Good evening';

    const firstName = 'Prince';
    setGreeting(`${greet}, ${firstName}`);

    const messages = [
      'Today is a great day and you are winning!',
      'Keep pushing forward—you’ve got this!',
      'Your hard work is paying off. Stay motivated!',
      'Believe in yourself and magic will happen!',
      'Stay focused and never give up!'
    ];
    const idx = new Date().getDate() % messages.length;
    setMessage(messages[idx]);
  }, []);

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <Header />
      <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
        {/* Greeting Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center space-x-4"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {greeting.split(' ')[1].charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{greeting}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
          </div>
        </motion.div>

        {/* Stories Carousel */}
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
                  <img
                    src={story.avatar || '/default-avatar.png'}
                    alt={story.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center text-sm mt-1 text-gray-700 dark:text-gray-300">
                  {story.userName}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
