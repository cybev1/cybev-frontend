
import React from 'react';
import { HeartIcon, ChatBubbleBottomCenterTextIcon, ShareIcon } from '@heroicons/react/24/outline';

export default function ReactionBar({ postId }) {
  return (
    <div className="flex justify-around text-sm text-gray-600 dark:text-gray-400 border-t pt-2">
      <button className="flex items-center gap-1 hover:text-red-500">
        <HeartIcon className="h-4 w-4" />
        Like
      </button>
      <button className="flex items-center gap-1 hover:text-blue-500">
        <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
        Comment
      </button>
      <button className="flex items-center gap-1 hover:text-green-500">
        <ShareIcon className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}
