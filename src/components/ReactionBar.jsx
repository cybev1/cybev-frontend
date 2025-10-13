
import React from 'react';

export default function ReactionBar({ postId }) {
  return (
    <div className="flex space-x-4 mt-2">
      <button>👍 Like</button>
      <button>💬 Comment</button>
      <button>🔁 Share</button>
    </div>
  );
}
