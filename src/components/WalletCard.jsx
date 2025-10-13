export default function WalletCard({ title, value, color }) {
  return (
    <div className={`p-5 rounded-xl shadow ${color}`}>
      <h2 className="text-sm text-gray-700 dark:text-gray-200">{title}</h2>
      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}