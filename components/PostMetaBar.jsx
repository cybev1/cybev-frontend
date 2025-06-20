
import { useState } from 'react';
import { HeartIcon, ChatBubbleLeftEllipsisIcon, ShareIcon, EyeIcon } from '@heroicons/react/24/solid';

export default function PostMetaBar({ postId, views = 0, reactions = 0, comments = 0 }) {
  const [liked, setLiked] = useState(false);

  const handleReaction = async () => {
    setLiked(true);
    await fetch('/api/posts/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, type: 'like' })
    });
  };

  return (
    <div className="flex items-center justify-between text-xs mt-3 px-2 py-1 border-t border-gray-200 dark:border-gray-700 pt-2">
      <div className="text-gray-600 dark:text-gray-300 flex items-center gap-4">
        <span><EyeIcon className="w-4 h-4 inline" /> {views} views</span>
        <button
          onClick={handleReaction}
          className="flex items-center gap-1 text-red-500"
          disabled={liked}
        >
          <HeartIcon className="w-4 h-4" /> {reactions + (liked ? 1 : 0)}
        </button>
        <span><ChatBubbleLeftEllipsisIcon className="w-4 h-4 inline" /> {comments} comments</span>
        <span><ShareIcon className="w-4 h-4 inline" /> Share</span>
      </div>
    </div>
  );
}
