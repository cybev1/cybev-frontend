
let transactionLogs = [];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, amount, method, walletAddress } = req.body;

  if (!userId || !amount || !method || !walletAddress) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const tx = {
    id: transactionLogs.length + 1,
    userId,
    amount: parseFloat(amount),
    method,
    walletAddress,
    status: 'Pending',
    requestedAt: new Date().toISOString(),
  };

  transactionLogs.push(tx);
  console.log('Withdrawal Requested:', tx);

  return res.status(200).json({ message: 'Withdrawal requested', transaction: tx });
}
