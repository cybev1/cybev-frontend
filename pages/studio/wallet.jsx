import WalletCard from '@/components/WalletCard';
import TransactionList from '@/components/TransactionList';

export default function Wallet() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">💼 My Wallet</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
        <WalletCard title="Total Earnings" value="₿ 482.75 CYBV" color="bg-green-100 dark:bg-green-900" />
        <WalletCard title="CYBV Token Balance" value="₿ 182.50" color="bg-blue-100 dark:bg-blue-900" />
        <WalletCard title="Withdrawable Amount" value="₿ 300.25" color="bg-yellow-100 dark:bg-yellow-900" />
        <WalletCard title="Staked CYBV" value="₿ 200.00" color="bg-purple-100 dark:bg-purple-900" />
      </div>
      <TransactionList />
    </div>
  );
}