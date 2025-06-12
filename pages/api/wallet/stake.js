
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, amount } = req.body;

  if (!username || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid stake request' });
  }

  // In production, validate balance, update staking ledger, return updated info
  return res.status(200).json({
    success: true,
    message: `Staked ${amount} CYBV`,
    estimatedReward: (amount * 0.05).toFixed(2)
  });
}
