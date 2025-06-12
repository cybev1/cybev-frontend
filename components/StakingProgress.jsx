
import React, { useEffect, useState } from 'react';

export default function StakingProgress({ start = Date.now(), durationDays = 30 }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const end = new Date(start).getTime() + durationDays * 24 * 60 * 60 * 1000;
      const total = end - start;
      const current = now - start;
      const percent = Math.min(100, (current / total) * 100);
      setProgress(percent.toFixed(1));

      const timeRemaining = end - now;
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [start, durationDays]);

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-300">
        <span>Reward Unlocks In</span>
        <span>{timeLeft}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
        <div
          className="bg-purple-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-gray-400 mt-1">{progress}% complete</div>
    </div>
  );
}
