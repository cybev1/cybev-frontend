import { useState } from 'react';

export default function PinPostButton({ postId }) {
  const [pinned, setPinned] = useState(false);

  const togglePin = async () => {
    setPinned(!pinned);
    // await fetch('/api/post/pin', { method: 'POST', body: JSON.stringify({ postId }) });
  };

  return (
    <button onClick={togglePin} className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
      📌 {pinned ? 'Unpin' : 'Pin Post'}
    </button>
  );
}