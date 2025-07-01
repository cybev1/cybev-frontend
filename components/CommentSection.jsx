import { useState } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([
    { user: 'Jane', text: 'Love this!' },
    { user: 'Prince', text: '🔥🔥🔥' }
  ]);
  const [text, setText] = useState('');

  const submitComment = async () => {
    if (!text.trim()) return;
    const newComment = { user: 'You', text };
    setComments([...comments, newComment]);
    setText('');
    // await fetch('/api/posts/comment', { method: 'POST', body: JSON.stringify({ postId, text }) });
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="space-y-1">
        {comments.map((c, i) => (
          <p key={i} className="text-sm text-gray-800 dark:text-gray-100"><b>{c.user}:</b> {c.text}</p>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 px-3 py-1 rounded-lg border dark:bg-gray-700 dark:text-white"
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={submitComment} className="px-3 py-1 bg-blue-600 text-white rounded-lg">Send</button>
      </div>
    </div>
  );
}