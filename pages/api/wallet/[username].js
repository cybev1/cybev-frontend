
export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Missing username' });
  }

  // Mock response
  const mockData = {
    success: true,
    username,
    balance: 248.75,
    claimable: 47.5
  };

  res.status(200).json(mockData);
}
