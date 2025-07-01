import { useState } from 'react';

export default function PostActions({ postId }) {
  const [likes, setLikes] = useState(14);
  const [boosted, setBoosted] = useState(false);

  const handleLike = async () => {
    setLikes(prev => prev + 1);
    // await fetch('/api/posts/react', { method: 'POST', body: JSON.stringify({ postId }) });
  };

  const handleBoost = async () => {
    setBoosted(true);
    // await fetch('/api/post/boost', { method: 'POST', body: JSON.stringify({ postId }) });
  };

  return (
    <div className="flex items-center gap-4 mt-2 text-sm text-gray-700 dark:text-gray-200">
      <button onClick={handleLike}>❤️ {likes}</button>
      <button onClick={handleBoost} className={boosted ? 'text-green-600 font-bold' : ''}>
        🚀 {boosted ? 'Boosted' : 'Boost'}
      </button>
      <button>💬 Comment</button>
      <button>🔗 Share</button>
    </div>
  );
}