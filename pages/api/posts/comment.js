import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { postId, user, text } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const posts = db.collection('posts');

    await posts.updateOne(
      { _id: postId },
      {
        $push: {
          comments: {
            user,
            text,
            createdAt: new Date()
          }
        },
        $inc: { commentCount: 1 }
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}