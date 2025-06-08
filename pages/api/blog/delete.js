import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing blog ID' });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });

    await client.close();

    if (result.deletedCount === 1) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}