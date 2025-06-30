export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) return res.status(400).json({ message: 'Missing verification token' });

  // Assume verification is successful for mockup purposes
  res.status(200).json({ message: 'Email verified successfully' });
}
