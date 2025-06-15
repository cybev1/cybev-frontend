export default function PostCard({ post }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
      <div className="font-bold mb-2">{post.author}</div>
      <div className="mb-2">{post.content}</div>
      <div className="text-sm text-gray-500">{post.likes} likes • {post.views} views</div>
    </div>
  );
}
