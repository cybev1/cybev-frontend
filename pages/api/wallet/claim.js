
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Missing username' });
  }

  // In production, fetch claimable amount and credit to balance

  return res.status(200).json({
    success: true,
    username,
    amount: 47.5,
    message: 'Reward claimed successfully'
  });
}
