import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('posts').aggregate([
      {
        $group: {
          _id: '$author',
          views: { $sum: '$views' },
          shares: { $sum: '$shares' },
          earnings: { $sum: '$earnings' }
        }
      },
      { $sort: { earnings: -1 } },
      { $limit: 10 },
      {
        $project: {
          username: '$_id',
          views: 1,
          shares: 1,
          earnings: 1,
          _id: 0
        }
      }
    ]).toArray();

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Leaderboard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}