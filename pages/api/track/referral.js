import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Missing username' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const record = await db.collection('referral_rewards').findOne({ username });

    if (!record || record.claimed) {
      return res.status(400).json({ success: false, message: 'No unclaimed rewards found.' });
    }

    await db.collection('referral_rewards').updateOne(
      { username },
      { $set: { claimed: true, claimedAt: new Date() } }
    );

    await db.collection('wallets').updateOne(
      { username },
      { $inc: { balance: record.earned } },
      { upsert: true }
    );

    return res.status(200).json({ success: true, message: 'Reward claimed successfully', amount: record.earned });
  } catch (error) {
    console.error('Claim error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
