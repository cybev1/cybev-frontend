import PostActions from './PostActions';
import CommentSection from './CommentSection';

export default function TimelineCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md transition hover:shadow-lg">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{post.author} • {post.timestamp}</div>
      <p className="text-gray-900 dark:text-gray-100">{post.content}</p>
      <PostActions postId={post.id} />
      <CommentSection postId={post.id} />
    </div>
  );
}