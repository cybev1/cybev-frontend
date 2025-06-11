
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  const { ref, ip } = req.query;

  if (!ref) {
    return res.status(400).json({ success: false, message: 'Missing referral username' });
  }

  try {
    const { db } = await connectToDatabase();
    const existing = await db.collection('referral_hits').findOne({ ip, ref });

    if (!existing) {
      await db.collection('referral_hits').insertOne({
        ref,
        ip,
        createdAt: new Date()
      });
    }

    return res.status(200).json({ success: true, tracked: true });
  } catch (error) {
    console.error("Referral track error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
