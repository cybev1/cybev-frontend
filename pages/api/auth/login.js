import { connectToDatabase } from '../../../lib/mongodb';
export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { email, password } = req.body;
  const user = await db.collection('users').findOne({ email, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!user.verified) return res.status(403).json({ error: 'Please verify your email' });
  res.status(200).json({ message: 'Login successful' });
}