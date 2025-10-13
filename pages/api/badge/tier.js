import { getMongoClient } from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { wallet } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const client = await getMongoClient();
    const db = client.db();
    const badge = await db.collection('badges').findOne({ wallet });

    if (!badge) {
      return res.status(404).json({ tier: 'Unranked' });
    }

    return res.status(200).json({ tier: badge.tier });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
