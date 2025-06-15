import React, { useEffect, useState } from 'react';

export default function NewsTicker({ headlines }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [headlines]);

  return (
    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mb-4">
      <span className="font-semibold">{headlines[current]}</span>
    </div>
  );
}