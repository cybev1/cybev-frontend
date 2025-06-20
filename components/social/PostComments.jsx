
import { useState, useEffect } from 'react';

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/posts/comments/${postId}`);
        const json = await res.json();
        if (json.success) setComments(json.comments);
      } catch (err) {
        console.error('Failed to load comments');
      }
    }

    fetchComments();
  }, [postId]);

  const submitComment = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const user = localStorage.getItem('cybev_username') || 'Anonymous';
    const res = await fetch('/api/posts/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, user, text: input })
    });

    const data = await res.json();
    if (data.success) {
      setComments(prev => [...prev, { user, text: input, createdAt: new Date() }]);
      setInput('');
    }
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">💬 Comments</h3>

      <div className="space-y-4 mb-4">
        {comments.map((c, idx) => (
          <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
            <p className="text-sm text-gray-800 dark:text-gray-200"><strong>@{c.user}</strong> — {new Date(c.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
        />
        <button
          onClick={submitComment}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
