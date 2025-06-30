import dbConnect from '@/lib/mongodb';
import User from '@/models/user.model';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  await dbConnect();

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Login successful', user });
}
