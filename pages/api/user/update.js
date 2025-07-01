import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const user = await User.findByIdAndUpdate(decoded.id, req.body, { new: true }).select('-password');
    res.status(200).json(user);
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
