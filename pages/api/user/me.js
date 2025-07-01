import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
