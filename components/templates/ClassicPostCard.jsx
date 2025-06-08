export default function ClassicPostCard({ post }) {
  return (
    <div className="border-b pb-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
      <p className="text-gray-600 mt-1">{post.description}</p>
      <div className="mt-2 text-sm">
        <span className="text-gray-500 italic">{post.category || 'Uncategorized'}</span> | 
        <a href={'/posts/' + post.slug} className="text-blue-500 hover:underline ml-2">Continue reading</a>
      </div>
    </div>
  );
}