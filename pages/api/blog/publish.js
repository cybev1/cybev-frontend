import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const data = req.body;

    if (!data.title || !data.description || !data.domainType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('blogs');

    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
      status: 'published',
    });

    await client.close();

    return res.status(200).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Publish Error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}