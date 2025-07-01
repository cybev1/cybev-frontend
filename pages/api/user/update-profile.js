export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, referral } = req.body;
  const token = req.headers.authorization;

  if (!token || !name) {
    return res.status(400).json({ message: 'Missing fields or token' });
  }

  return res.status(200).json({ success: true, message: 'Profile updated successfully' });
}