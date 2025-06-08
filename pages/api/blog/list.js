import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const blogs = await db.collection('blogs')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    await client.close();

    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}