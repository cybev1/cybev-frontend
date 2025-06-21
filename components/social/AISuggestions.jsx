import Link from 'next/link';

export default function AISuggestions() {
  const suggestions = [
    { type: 'post', label: 'Read this trending blog', link: '/post/abc123' },
    { type: 'follow', label: 'Follow @web3prophet', link: '/profile/web3prophet' },
    { type: 'live', label: 'Join live session: AI & NFTs', link: '/live/coachonair' },
    { type: 'explore', label: 'Explore #cyberchurch', link: '/explore?tag=#cyberchurch' },
  ];

  const random = suggestions[Math.floor(Math.random() * suggestions.length)];

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white rounded-xl shadow p-4 mb-6">
      <h3 className="text-sm font-semibold mb-1">🤖 AI Suggestion</h3>
      <p className="text-sm">{random.label}</p>
      <Link href={random.link}>
        <span className="inline-block mt-2 text-sm text-blue-700 dark:text-blue-400 hover:underline">
          Check it out →
        </span>
      </Link>
    </div>
  );
}