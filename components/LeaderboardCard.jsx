export default function LeaderboardCard({ user }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-xl">
      <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">#{user.rank}</h2>
      <p className="text-lg font-semibold mt-2">@{user.username}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">Minted NFTs: {user.minted}</p>
      <p className="text-sm text-green-600 dark:text-green-400">Earnings: ₿ {user.earnings.toFixed(2)}</p>
    </div>
  );
}