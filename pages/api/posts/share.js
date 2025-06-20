import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { postId } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('posts').updateOne(
      { _id: postId },
      { $inc: { shares: 1 } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}