import Link from 'next/link';

export default function BlogCard({ blog }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
      <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{blog.domain}</p>
      <div className="flex justify-between text-sm">
        <span className="text-green-600 dark:text-green-400">{blog.status}</span>
        <span className="text-gray-500">{blog.createdAt}</span>
      </div>
      <div className="mt-4 flex gap-3">
        <Link href={'/studio/write?id=' + blog.id} className="text-blue-600 text-sm">✏️ Edit</Link>
        <Link href={'/blog/' + blog.domain} className="text-purple-600 text-sm" target="_blank">🌐 View</Link>
      </div>
    </div>
  );
}