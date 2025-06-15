export default function PostComposer() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
      <textarea className="w-full p-2 border rounded" placeholder="What's on your mind today?"></textarea>
      <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">Post</button>
    </div>
  );
}
