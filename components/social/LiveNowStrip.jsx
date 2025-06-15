import React from 'react';
import { PlayIcon } from 'lucide-react';

export default function LiveNowStrip({ isLive, streamUrl }) {
  if (!isLive) return null;
  return (
    <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900 p-2 rounded-lg my-4 cursor-pointer" onClick={() => window.open(streamUrl, '_blank')}>
      <PlayIcon className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
      <span className="text-sm font-medium text-red-600 dark:text-red-400">Admin is live now! Click to watch</span>
    </div>
  );
}