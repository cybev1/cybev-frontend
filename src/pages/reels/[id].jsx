import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ReelViewer() {
  const router = useRouter();
  const { id } = router.query;
  const [reel, setReel] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { user: 'Jane', text: 'Epic content 🔥' },
    { user: 'Prince', text: 'Keep them coming!' }
  ]);
  const [likes, setLikes] = useState(24);

  useEffect(() => {
    if (id) {
      setReel({
        id,
        video: '/demo-reel.mp4',
        username: 'jane_doe',
        caption: 'This moment changed my life!'
      });
    }
  }, [id]);

  const handleComment = () => {
    if (comment.trim()) {
      setComments([...comments, { user: 'You', text: comment }]);
      setComment('');
    }
  };

  const handleLike = () => setLikes(prev => prev + 1);

  if (!reel) return <div className="p-6">Loading Reel...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <video src={reel.video} controls className="w-full rounded-2xl shadow-lg mb-4" />
      <div className="text-xl font-semibold">@{reel.username}</div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{reel.caption}</p>
      <div className="flex gap-4 mb-4">
        <button onClick={handleLike} className="text-red-600">❤️ {likes}</button>
        <button className="text-blue-600">💬 {comments.length} Comments</button>
      </div>
      <div className="space-y-1 mb-4">
        {comments.map((c, i) => (
          <p key={i} className="text-sm text-gray-800 dark:text-white"><b>{c.user}:</b> {c.text}</p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border dark:bg-gray-800"
        />
        <button onClick={handleComment} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Send</button>
      </div>
    </div>
  );
}