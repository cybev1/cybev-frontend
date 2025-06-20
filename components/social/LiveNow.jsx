import Link from 'next/link';

export default function LiveNow({ streams = [] }) {
  if (streams.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
      <h3 className="font-semibold text-sm mb-3">🔴 Live Now</h3>
      <ul className="space-y-3 text-sm">
        {streams.map((user, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>
              <span className="font-medium">@{user.username}</span>
            </div>
            <Link
              href={`/live/${user.username}`}
              className="text-blue-600 hover:underline text-xs"
            >
              Join Now
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}