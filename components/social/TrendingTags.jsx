import Link from 'next/link';

export default function TrendingTags({ tags = [] }) {
  if (tags.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
      <h3 className="font-semibold text-sm mb-3">🔥 Trending Hashtags</h3>
      <ul className="space-y-2 text-sm text-blue-600">
        {tags.map((tag, i) => (
          <li key={i}>
            <Link href={\`/explore?tag=%23\${tag.name}\`} className="hover:underline">
              #{tag.name} <span className="text-gray-500 dark:text-gray-400">({tag.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}