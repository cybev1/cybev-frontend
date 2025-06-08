export default function ModernPostCard({ post }) {
  return (
    <div className="bg-white border rounded-2xl shadow hover:shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-700">{post.title}</h2>
      <p className="text-gray-700 mt-2">{post.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500 italic">{post.category || 'Uncategorized'}</span>
        <a href={'/posts/' + post.slug} className="text-indigo-600 hover:underline text-sm">Read More</a>
      </div>
    </div>
  );
}