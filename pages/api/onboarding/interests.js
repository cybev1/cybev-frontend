
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { interests } = req.body;

  if (!interests || !Array.isArray(interests)) {
    return res.status(400).json({ message: 'Invalid interests format' });
  }

  // Simulate saving to DB
  console.log('Interests:', interests);

  return res.status(200).json({ message: 'Interests saved' });
}
