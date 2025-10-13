export default function WalletSummary({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-sm text-gray-600 dark:text-gray-300 mb-2">CYBV Token Balance</h2>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">₿ {data.balance.toFixed(2)}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-sm text-gray-600 dark:text-gray-300 mb-2">Total Earned</h2>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₿ {data.earned.toFixed(2)}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-sm text-gray-600 dark:text-gray-300 mb-2">Staked Tokens</h2>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₿ {data.staked.toFixed(2)}</div>
      </div>
    </div>
  );
}