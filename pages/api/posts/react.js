import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { postId, type = 'like' } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const posts = db.collection('posts');

    const update = type === 'like'
      ? { $inc: { reactions: 1 } }
      : { $inc: { [`reactions.${type}`]: 1 } };

    await posts.updateOne({ _id: postId }, update);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}