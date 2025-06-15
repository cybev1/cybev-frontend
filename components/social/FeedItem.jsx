import { useState } from 'react';
import { HeartIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function FeedItem({ user, timestamp, content, views, likes, comments, reactions }) {
  const [liked, setLiked] = useState(false);
  const handleLike = () => setLiked(!liked);
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center mb-2">
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</div>
        </div>
      </div>
      <div className="mb-2">{content}</div>
      <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 mb-2">
        <div className="flex items-center space-x-1"><EyeIcon className="w-5 h-5" /><span>{views}</span></div>
        <div onClick={handleLike} className="flex items-center space-x-1 cursor-pointer">
          <HeartIcon className={`w-5 h-5 ${liked ? 'text-red-500' : ''}`} /><span>{likes + (liked ? 1 : 0)}</span>
        </div>
        <div className="flex items-center space-x-1"><span>💬</span><span>{comments}</span></div>
      </div>
      <div className="flex space-x-2">
        {Object.entries(reactions).map(([emoji, count]) => (
          <span key={emoji} className="cursor-pointer">{emoji} {count}</span>
        ))}
      </div>
    </div>
  );
}
