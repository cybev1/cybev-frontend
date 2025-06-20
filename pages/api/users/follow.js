import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { from, to } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const current = await users.findOne({ username: from });
    const isFollowing = current?.following?.includes(to);

    const updateFollow = isFollowing
      ? { $pull: { following: to } }
      : { $addToSet: { following: to } };

    const updateFollower = isFollowing
      ? { $pull: { followers: from } }
      : { $addToSet: { followers: from } };

    await users.updateOne({ username: from }, updateFollow);
    await users.updateOne({ username: to }, updateFollower);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}