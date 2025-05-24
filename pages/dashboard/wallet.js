export default function Wallet() {
  const dummyEarnings = {
    totalBalance: 1582.5,
    mintedValue: 320,
    pendingPayouts: 180,
    transactions: [
      { id: 'TXN001', type: 'Earned', amount: 300, source: 'Post Views', date: '2025-05-23' },
      { id: 'TXN002', type: 'Minted', amount: -120, source: 'NFT Mint', date: '2025-05-22' },
      { id: 'TXN003', type: 'Earned', amount: 500, source: 'Boosted Post', date: '2025-05-21' },
      { id: 'TXN004', type: 'Pending', amount: 180, source: 'Unpaid Likes', date: '2025-05-24' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Your Wallet</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="text-sm text-gray-600">CYBEV Token Balance</h2>
            <p className="text-2xl text-blue-800 font-bold">₡{dummyEarnings.totalBalance}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-sm text-gray-600">Pending Payouts</h2>
            <p className="text-2xl text-yellow-700 font-bold">₡{dummyEarnings.pendingPayouts}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded shadow">
            <h2 className="text-sm text-gray-600">Minted Value</h2>
            <p className="text-2xl text-purple-700 font-bold">₡{dummyEarnings.mintedValue}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Transactions</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-3 py-2">ID</th>
              <th className="text-left px-3 py-2">Type</th>
              <th className="text-left px-3 py-2">Amount</th>
              <th className="text-left px-3 py-2">Source</th>
              <th className="text-left px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {dummyEarnings.transactions.map((txn, i) => (
              <tr key={i} className="border-b">
                <td className="px-3 py-2">{txn.id}</td>
                <td className="px-3 py-2">{txn.type}</td>
                <td className={`px-3 py-2 font-semibold ${txn.amount < 0 ? 'text-red-600' : 'text-green-700'}`}>
                  {txn.amount < 0 ? '-' : ''}₡{Math.abs(txn.amount)}
                </td>
                <td className="px-3 py-2">{txn.source}</td>
                <td className="px-3 py-2">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}