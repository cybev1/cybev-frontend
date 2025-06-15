import React, { useState } from 'react';

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [views, setViews] = useState(Math.floor(Math.random() * 100) + 1);
  const [reactions, setReactions] = useState({ 👍: 2, ❤️: 1, 😂: 0, 😮: 0 });

  const handleReaction = emoji => {
    setReactions(prev => ({ ...prev, [emoji]: prev[emoji] + 1 }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img src={post.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold text-gray-800 dark:text-white">{post.userName}</div>
            <div className="text-xs text-gray-500">{post.time}</div>
          </div>
        </div>
        <div className="text-xs text-gray-400">{views} views</div>
      </div>
      <p className="text-gray-700 dark:text-gray-200 mb-2">{post.content}</p>
      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
        {Object.entries(reactions).map(([emoji, count]) => (
          <button key={emoji} onClick={() => handleReaction(emoji)} className="hover:scale-105">
            {emoji} {count}
          </button>
        ))}
      </div>
      <div className="flex space-x-2 mt-2">
        <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">🚀 Boost</button>
        <button className="px-2 py-1 bg-green-500 text-white rounded text-sm">💰 Tip</button>
        <button className="px-2 py-1 bg-purple-600 text-white rounded text-sm">🪙 Mint</button>
        <button className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">📈 Stake</button>
      </div>
    </div>
  );
}
