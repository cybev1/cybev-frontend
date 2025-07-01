export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount } = req.body;

  // Simulate staking logic
  return res.status(200).json({
    success: true,
    message: `Successfully staked ₿ ${amount}`,
  });
}